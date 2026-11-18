#!/usr/bin/env python3
"""Converte os mestres gerados (arte/cenario_v2/mestres_gerados) para a grade de pixels do jogo.

Lote (todos os objetos do manifesto, numa densidade):
    python3 tools/converter_mestres.py lote arte/cenario_v2/MANIFESTO_MODELOS.json arte/cenario_v2/mestres_gerados \\
        arte/cenario_v2/nativos 2 arte/cenario_v2/densidade_2

Sob medida (uma peça esticada para um retângulo exato, em pixels de arte; usado nas vitrines que cobrem janelas):
    python3 tools/converter_mestres.py sob-medida arte/cenario_v2/mestres_gerados/vitrine_cafe.png 184 104 saida.png

- densidade: px de arte por px de mundo (o pacote V2 veio em 4; o chão da rua é 2).
- Os "nativos" saem do Pixel Snapper (MIT; github.com/Hugo-Dz/spritefusion-pixel-snapper), que acha a grade dos
  pixels falsos de cada mestre e devolve a imagem com 1 pixel por bloco. Instalação isolada:
      python3 -m venv /tmp/ps && /tmp/ps/bin/pip install pixel-snapper
      /tmp/ps/bin/pixel-snapper arte/cenario_v2/mestres_gerados/<nome>.png arte/cenario_v2/nativos/<nome>.png 96
  Funciona nos mestres (pixels falsos nítidos); NÃO serve para a Kamila e outros sprites de bordas suaves.
Passos: recorta a área visível; reduz por média de área (cor pré-multiplicada); alfa 0/255; paleta limitada sem pontilhado;
refaz o contorno de 1 px (mais escuro embaixo/à direita, mais leve em cima/à esquerda, sempre rumo ao escuro comum #1d1927).
"""
import json
import pathlib
import sys

import numpy as np
from PIL import Image

ESCURO = np.array([0x1d, 0x19, 0x27], np.float64) / 255


def recorte(im):
    im = im.convert('RGBA')
    return im.crop(im.getchannel('A').point(lambda v: 255 if v >= 128 else 0).getbbox())


def reduzir(im, w, h):
    a = np.asarray(im.convert('RGBA')).astype(np.float64) / 255
    pre = np.concatenate([a[..., :3] * a[..., 3:4], a[..., 3:4]], axis=2)
    r = np.asarray(Image.fromarray((pre * 255).round().astype(np.uint8), 'RGBA').resize((w, h), Image.BOX)).astype(np.float64) / 255
    al = r[..., 3]
    cor = np.where(al[..., None] > 1e-6, r[..., :3] / np.maximum(al[..., None], 1e-6), 0)
    return cor, al >= .5


def paleta(cor, n):
    img = Image.fromarray((cor * 255).round().clip(0, 255).astype(np.uint8), 'RGB')
    q = img.quantize(colors=n, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert('RGB')
    return np.asarray(q).astype(np.float64) / 255


def contorno(cor, op):
    h, w = op.shape; out = cor.copy()
    lum = cor @ np.array([.2126, .7152, .0722])
    for y in range(h):
        for x in range(w):
            if not op[y, x] or lum[y, x] < .13:
                continue
            viz = lambda dx, dy: 0 <= x + dx < w and 0 <= y + dy < h and op[y + dy, x + dx]
            sombra = not viz(1, 0) or not viz(0, 1)
            luz = not viz(-1, 0) or not viz(0, -1)
            if sombra or luz:
                k = .62 if sombra else .34
                out[y, x] = cor[y, x] * (1 - k) + ESCURO * k
    return out


def peca(fonte, w, h, cores=64):
    """Converte a imagem (já recortada) num retângulo w x h de pixels de arte."""
    cor, op = reduzir(fonte, w, h)
    cor = contorno(paleta(cor, cores), op)
    out = np.zeros((h, w, 4), np.uint8); out[..., :3] = (cor * 255).round().clip(0, 255); out[..., 3] = op * 255
    return Image.fromarray(out, 'RGBA')


def lote(man_arq, mestres, nativos, D, saida, cores=64):
    mestres, nativos, saida = pathlib.Path(mestres), pathlib.Path(nativos), pathlib.Path(saida); saida.mkdir(parents=True, exist_ok=True)
    man = json.load(open(man_arq, encoding='utf-8'))
    res = {'densidade': D, 'origem': 'arte/cenario_v2 (mestres), convertidos por tools/converter_mestres.py', 'assets': []}
    for a in man['assets']:
        n, cb = a['id'], a['contentBounds']
        W, H = round(a['width'] / 4 * D), round(a['height'] / 4 * D)
        cw, ch = max(1, round(cb['width'] / 4 * D)), max(1, round(cb['height'] / 4 * D))
        ox, oy = round(cb['left'] / 4 * D), round(cb['top'] / 4 * D)
        fonte, tipo = None, 'mestre'
        nat = nativos / f'{n}.png'
        if nat.exists():
            s = recorte(Image.open(nat))
            if s.width >= cw * .95 and s.height >= ch * .95:
                fonte, tipo = s, 'nativo'
        if fonte is None:
            fonte = recorte(Image.open(mestres / f'{n}.png'))
        tela = Image.new('RGBA', (W, H), (0, 0, 0, 0)); tela.alpha_composite(peca(fonte, cw, ch, cores), (ox, oy))
        tela.save(saida / f'{n}.png')
        res['assets'].append({'id': n, 'width': W, 'height': H, 'anchorPx': {'x': round(a['anchorPx']['x'] / 4 * D, 2), 'y': round(a['anchorPx']['y'] / 4 * D, 2)},
                              'anchorType': a['anchorType'], 'fonte': tipo})
        print(f'{n:16} {W}x{H}  conteúdo {cw}x{ch}  de {tipo} {fonte.size}')
    json.dump(res, open(saida / 'MANIFESTO.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    modo = sys.argv[1]
    if modo == 'lote':
        lote(sys.argv[2], sys.argv[3], sys.argv[4], float(sys.argv[5]), sys.argv[6], int(sys.argv[7]) if len(sys.argv) > 7 else 64)
    elif modo == 'sob-medida':
        w, h = int(sys.argv[3]), int(sys.argv[4])
        peca(recorte(Image.open(sys.argv[2])), w, h, int(sys.argv[6]) if len(sys.argv) > 6 else 64).save(sys.argv[5])
        print(sys.argv[5], w, h)
    else:
        sys.exit('modo: lote | sob-medida')
