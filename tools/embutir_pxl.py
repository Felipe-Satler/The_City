#!/usr/bin/env python3
"""Embute os sprites gerados pelo pxl (arte/pxl/out/sprites/*.png) no the-city.html.

Uso (a partir da raiz do repositório):
    node tools/pxl/bin/pxl.js build arte/pxl/rua.px.js --out arte/pxl/out
    python3 tools/embutir_pxl.py

Troca o objeto entre /*PXL:INICIO*/ e /*PXL:FIM*/ por {nome: {w, h, src}} (tamanho em pixels de arte).
Preserva as quebras de linha CRLF do HTML (open com newline='').
"""
import base64
import json
import pathlib
import struct
import sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
HTML = RAIZ / 'the-city.html'
PASTA = RAIZ / 'arte' / 'pxl' / 'out' / 'sprites'
INI, FIM = '/*PXL:INICIO*/', '/*PXL:FIM*/'


def main():
    pngs = sorted(PASTA.glob('*.png'))
    if not pngs:
        sys.exit(f'nenhum PNG em {PASTA}')
    dados = {}
    for p in pngs:
        png = p.read_bytes()
        w, h = struct.unpack(">II", png[16:24])
        dados[p.stem] = {'w': w, 'h': h, 'src': 'data:image/png;base64,' + base64.b64encode(png).decode('ascii')}
    with open(HTML, encoding='utf-8', newline='') as f:
        s = f.read()
    if s.count(INI) != 1 or s.count(FIM) != 1:
        sys.exit('marcadores PXL ausentes ou repetidos no the-city.html')
    a = s.index(INI) + len(INI)
    b = s.index(FIM)
    s = s[:a] + json.dumps(dados, separators=(',', ':')) + s[b:]
    with open(HTML, 'w', encoding='utf-8', newline='') as f:
        f.write(s)
    print(f'{len(dados)} sprites embutidos: ' + ', '.join(dados))


if __name__ == '__main__':
    main()
