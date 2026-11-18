#!/usr/bin/env python3
"""Embute os objetos de cenário V2 (arte/cenario_v2/densidade_2) no the-city.html.

Uso (a partir da raiz do repositório):
    python3 tools/embutir_cenario_v2.py

Troca o objeto entre /*V2:INICIO*/ e /*V2:FIM*/ por {nome: {w, h, ax, ay, src}}: tamanho em px de arte (2 por px de mundo,
a mesma grade do chão da rua) e ponto de apoio (ax, ay) em px de arte, do MANIFESTO.json. As vitrines sob medida
(densidade_2/sob_medida) cobrem uma janela inteira e são posicionadas pelo canto de cima à esquerda (apoio 0, 0).
Preserva as quebras de linha CRLF do HTML (open com newline='').
"""
import base64
import json
import pathlib
import struct
import sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
HTML = RAIZ / 'the-city.html'
PASTA = RAIZ / 'arte' / 'cenario_v2' / 'densidade_2'
INI, FIM = '/*V2:INICIO*/', '/*V2:FIM*/'
# Peças usadas só como base das vitrines sob medida (não entram inteiras no jogo).
FORA = {'vitrine_livros', 'vitrine_cafe', 'vitrine_fechada'}


def entrada(png, ax, ay):
    b = png.read_bytes()
    w, h = struct.unpack('>II', b[16:24])
    return {'w': w, 'h': h, 'ax': ax, 'ay': ay, 'src': 'data:image/png;base64,' + base64.b64encode(b).decode('ascii')}


def main():
    man = json.load(open(PASTA / 'MANIFESTO.json', encoding='utf-8'))
    if man.get('densidade') != 2:
        sys.exit('o jogo usa 2 px de arte por px de mundo; o manifesto diz ' + str(man.get('densidade')))
    dados = {}
    for a in man['assets']:
        if a['id'] in FORA:
            continue
        dados[a['id']] = entrada(PASTA / f"{a['id']}.png", a['anchorPx']['x'], a['anchorPx']['y'])
    for p in sorted((PASTA / 'sob_medida').glob('*.png')):
        dados[p.stem] = entrada(p, 0, 0)
    with open(HTML, encoding='utf-8', newline='') as f:
        s = f.read()
    if s.count(INI) != 1 or s.count(FIM) != 1:
        sys.exit('marcadores V2 ausentes ou repetidos no the-city.html')
    a = s.index(INI) + len(INI); b = s.index(FIM)
    s = s[:a] + json.dumps(dados, separators=(',', ':')) + s[b:]
    with open(HTML, 'w', encoding='utf-8', newline='') as f:
        f.write(s)
    print(f'{len(dados)} peças embutidas: ' + ', '.join(dados))


if __name__ == '__main__':
    main()
