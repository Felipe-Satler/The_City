#!/usr/bin/env python3
"""Embute o modelo articulado da Crooked Legs (arte/crooked_legs/) no the-city.html.

Uso (a partir da raiz do repositório; precisa do Pillow):
    python3 tools/embutir_crooked.py

Lê CROOKED_LEGS_RIG.json, CROOKED_LEGS_ANIMACOES.json e as imagens de parts/ e troca o objeto
entre /*CL:INICIO*/ e /*CL:FIM*/ por:
    esc      escala das imagens embutidas em relação às originais (ESCALA abaixo)
    S        px da célula (512 x 512) por px da arte original
    partes   as 6 peças do corpo: imagem (WebP), canto da peça na arte original, caminho de repouso,
             vértices usados da malha (x, y em sequência) e triângulos (índices em sequência)
    cabecas  as 6 cabeças: imagem, olho, boca, ponto onde o pescoço chega, escala
    rep      a pose de repouso (parada_01), já com o deslocamento do quadro somado
Preserva as quebras de linha CRLF do HTML (open com newline='').
"""
import base64
import io
import json
import pathlib
import sys

from PIL import Image

RAIZ = pathlib.Path(__file__).resolve().parent.parent
HTML = RAIZ / 'the-city.html'
ARTE = RAIZ / 'arte' / 'crooked_legs'
INI, FIM = '/*CL:INICIO*/', '/*CL:FIM*/'
# As peças aparecem no jogo com menos de metade do tamanho original, então metade da resolução basta.
ESCALA = 0.5
REPOUSO = 'parada_01'


def webp(caminho):
    im = Image.open(caminho).convert('RGBA')
    im = im.resize((max(1, round(im.width * ESCALA)), max(1, round(im.height * ESCALA))), Image.LANCZOS)
    b = io.BytesIO()
    im.save(b, 'WEBP', quality=92, method=6)
    return 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode('ascii')


def r1(v):
    v = round(v, 1)
    return int(v) if v == int(v) else v


def main():
    rig = json.loads((ARTE / 'CROOKED_LEGS_RIG.json').read_text(encoding='utf-8'))
    anim = json.loads((ARTE / 'CROOKED_LEGS_ANIMACOES.json').read_text(encoding='utf-8'))
    partes = []
    for p in rig['parts']:
        # Só os vértices que algum triângulo usa (a malha original é uma grade com sobras).
        usados = sorted({i for t in p['mesh']['triangles'] for i in t})
        idx = {v: k for k, v in enumerate(usados)}
        partes.append({
            'id': p['id'], 'img': webp(ARTE / p['file']), 'bx': p['bounds']['x'], 'by': p['bounds']['y'],
            'rest': p['restPath'],
            'v': [c for i in usados for c in p['mesh']['vertices'][i]],
            't': [idx[i] for t in p['mesh']['triangles'] for i in t],
        })
    cabecas = {
        nome: {'img': webp(ARTE / h['file']), 'eye': h['eye'], 'mouth': h['mouth'], 'scale': h['scale'],
               'att': h['attachment']}
        for nome, h in rig['heads'].items()
    }
    rep = None
    for acao in anim['actions'].values():
        for f in acao['frames']:
            if f['name'] == REPOUSO:
                ox, oy = f.get('offsetX') or 0, f.get('offsetY') or 0
                rep = {k: [[r1(x + ox), r1(y + oy)] for x, y in v] for k, v in f['paths'].items()}
    if rep is None:
        sys.exit(f'pose {REPOUSO} não encontrada')
    dados = {'esc': ESCALA, 'S': rig['sourceScale'], 'partes': partes, 'cabecas': cabecas, 'rep': rep}
    with open(HTML, encoding='utf-8', newline='') as f:
        s = f.read()
    if s.count(INI) != 1 or s.count(FIM) != 1:
        sys.exit('marcadores CL ausentes ou repetidos no the-city.html')
    a = s.index(INI) + len(INI)
    b = s.index(FIM)
    txt = json.dumps(dados, separators=(',', ':'))
    s = s[:a] + txt + s[b:]
    with open(HTML, 'w', encoding='utf-8', newline='') as f:
        f.write(s)
    print(f'modelo embutido: {len(partes)} peças, {len(cabecas)} cabeças, {len(txt) // 1024} KB')


if __name__ == '__main__':
    main()
