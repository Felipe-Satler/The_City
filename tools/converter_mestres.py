#!/usr/bin/env python3
"""Converte os mestres gerados (arte/cenario_v2/mestres_gerados) para uma densidade de pixel escolhida.

Uso (a partir da raiz do repositório):
    python3 tools/converter_mestres.py arte/cenario_v2/MANIFESTO_MODELOS.json arte/cenario_v2/mestres_gerados \
        arte/cenario_v2/nativos 2 arte/cenario_v2/densidade_2

Os "nativos" saem do Pixel Snapper (MIT; github.com/Hugo-Dz/spritefusion-pixel-snapper), que acha a grade dos
pixels falsos de cada mestre e devolve a imagem com 1 pixel por bloco. Instalação isolada:
    python3 -m venv /tmp/ps && /tmp/ps/bin/pip install pixel-snapper
    /tmp/ps/bin/pixel-snapper arte/cenario_v2/mestres_gerados/<nome>.png arte/cenario_v2/nativos/<nome>.png 96
Atenção: funciona nos mestres (pixels falsos nítidos); NÃO serve para a Kamila e outros sprites de bordas suaves.

- <pasta_nativos>: os mestres já "encaixados" na própria grade de pixels (Pixel Snapper, MIT). Se um nativo não existir
  ou tiver menos pixels que o pedido, usa o mestre.
- <densidade>: px de arte por px de mundo (o pacote V2 usa 4; o chão da rua usa 2).
Passos: recorta a área visível; reduz por média de área (cor pré-multiplicada); alfa 0/255; paleta limitada sem pontilhado;
refaz o contorno de 1 px (mais escuro embaixo/à direita, mais leve em cima/à esquerda, sempre rumo ao escuro comum);
encaixa na tela do tamanho do manifesto, convertido para a densidade, e grava as âncoras convertidas.
"""
import json
import pathlib
import sys

import numpy as np
from PIL import Image

MAN, MESTRES, NATIVOS, D, SAIDA = sys.argv[1], pathlib.Path(sys.argv[2]), pathlib.Path(sys.argv[3]), float(sys.argv[4]), pathlib.Path(sys.argv[5])
CORES = int(sys.argv[6]) if len(sys.argv) > 6 else 64
ESCURO = np.array([0x1d, 0x19, 0x27], np.float64)
SAIDA.mkdir(parents=True, exist_ok=True)


def recorte(im):
    bb = im.getchannel('A').point(lambda v: 255 if v >= 128 else 0).getbbox()
    return im.crop(bb)


def reduzir(im, w, h):
    a = np.asarray(im.convert('RGBA')).astype(np.float64) / 255
    pre = np.concatenate([a[..., :3] * a[..., 3:4], a[..., 3:4]], axis=2)
    r = np.asarray(Image.fromarray((pre * 255).round().astype(np.uint8), 'RGBA').resize((w, h), Image.BOX)).astype(np.float64) / 255
    al = r[..., 3]
    cor = np.where(al[..., None] > 1e-6, r[..., :3] / np.maximum(al[..., None], 1e-6), 0)
    return cor, al >= .5


def paleta(cor, op, n):
    img = Image.fromarray((cor * 255).round().clip(0, 255).astype(np.uint8), 'RGB')
    q = img.quantize(colors=n, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert('RGB')
    return np.asarray(q).astype(np.float64) / 255


def contorno(cor, op):
    h, w = op.shape; out = cor.copy(); esc = ESCURO / 255
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
                out[y, x] = cor[y, x] * (1 - k) + esc * k
    return out


man = json.load(open(MAN, encoding='utf-8'))
saida = {'densidade': D, 'origem': 'arte/cenario_v2 (mestres), convertidos por converter_mestres.py', 'assets': []}
for a in man['assets']:
    n, cb = a['id'], a['contentBounds']
    W, H = round(a['width'] / 4 * D), round(a['height'] / 4 * D)
    cw, ch = max(1, round(cb['width'] / 4 * D)), max(1, round(cb['height'] / 4 * D))
    ox, oy = round(cb['left'] / 4 * D), round(cb['top'] / 4 * D)
    nat = NATIVOS / f'{n}.png'
    fonte = None
    if nat.exists():
        s = recorte(Image.open(nat))
        if s.width >= cw * .95 and s.height >= ch * .95:
            fonte = s; tipo = 'nativo'
    if fonte is None:
        fonte = recorte(Image.open(MESTRES / f'{n}.png')); tipo = 'mestre'
    cor, op = reduzir(fonte, cw, ch)
    cor = paleta(cor, op, CORES)
    cor = contorno(cor, op)
    out = np.zeros((ch, cw, 4), np.uint8); out[..., :3] = (cor * 255).round().clip(0, 255); out[..., 3] = op * 255
    tela = Image.new('RGBA', (W, H), (0, 0, 0, 0)); tela.alpha_composite(Image.fromarray(out, 'RGBA'), (ox, oy))
    tela.save(SAIDA / f'{n}.png')
    ax, ay = a['anchorPx']['x'] / 4 * D, a['anchorPx']['y'] / 4 * D
    saida['assets'].append({'id': n, 'width': W, 'height': H, 'anchorPx': {'x': round(ax, 2), 'y': round(ay, 2)}, 'anchorType': a['anchorType'], 'fonte': tipo})
    print(f'{n:16} {W}x{H}  conteúdo {cw}x{ch}  de {tipo} {fonte.size}')
json.dump(saida, open(SAIDA / 'MANIFESTO.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
