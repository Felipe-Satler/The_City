import sys
from PIL import Image, ImageDraw, ImageFont
# Folha de modelos: cada modelo ampliado 2x (pixel a pixel), em linhas por tipo, com a Kamila na mesma escala para comparar tamanhos.
# Uso: python3 folha.py pasta_dos_sprites kamila_sprites.png saida.png
SPR, KAM, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
F = (36, 42, 51)
fonte = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 17)
fonteT = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
Z = 2


def modelo(nome):
    im = Image.open(f'{SPR}/{nome}.png').convert('RGBA')
    return im.resize((im.width * Z, im.height * Z), Image.NEAREST)


# Kamila: quadro parado de frente. A folha dela tem 191 px para 57 px de mundo; os modelos têm 4 px por px de mundo.
k = Image.open(KAM).convert('RGBA').crop((0, 0, 209, 209))
bb = k.getbbox(); k = k.crop(bb)
esc = 4 / (191 / 57) * Z
kam = k.resize((round(k.width * esc), round(k.height * esc)), Image.LANCZOS)

linhas = [
    ('Árvores', [('arvore_copa', 'árvore de rua'), ('arvore_seca', 'árvore seca')]),
    ('Vasos', [('vaso_arbusto', 'floreira com arbusto'), ('vaso_folhas', 'vaso de cerâmica'), ('vaso_flores', 'vaso de barro com flores')]),
    ('Lixeiras', [('lixeira_rodas', 'lixeira de rodas'), ('lixeira_metal', 'lixeira de metal'), ('sacos_lixo', 'sacos de lixo')]),
    ('Placas', [('placa_rua', 'placa de rua'), ('placa_pendurada', 'placa de loja'), ('placa_transito', 'placa de trânsito')]),
    ('Vitrines', [('vitrine_livros', 'livraria'), ('vitrine_fechada', 'loja fechada'), ('vitrine_cafe', 'café aceso')]),
]
# Disposição: árvores numa coluna à esquerda (são altas); o resto em linhas à direita.
blocos = []
for titulo, itens in linhas:
    ims = [(modelo(n), rot) for n, rot in itens]
    if titulo in ('Vasos', 'Lixeiras', 'Placas'):
        ims.append((kam, 'Kamila (escala)'))
    d0 = ImageDraw.Draw(Image.new('RGB', (4, 4)))
    larg = [max(i.width, int(d0.textlength(rot, font=fonte)) + 6) for i, rot in ims]
    w = sum(larg) + 28 * (len(ims) + 1)
    h = max(i.height for i, _ in ims) + 78
    b = Image.new('RGB', (w, h), F); d = ImageDraw.Draw(b)
    d.text((14, 8), titulo, font=fonteT, fill=(214, 220, 226))
    x = 28
    for (im, rot), lw in zip(ims, larg):
        b.paste(im, (x + (lw - im.width) // 2, h - 30 - im.height), im)
        d.text((x, h - 26), rot, font=fonte, fill=(150, 160, 172))
        x += lw + 28
    blocos.append((titulo, b))
B = dict(blocos)
esq = B['Árvores']; dir_ = [B['Vasos'], B['Lixeiras'], B['Placas']]
wd = max(b.width for b in dir_); hd = sum(b.height for b in dir_) + 20 * 2
topo_h = max(esq.height, hd)
W = max(esq.width + 30 + wd, B['Vitrines'].width) + 40
H = topo_h + 30 + B['Vitrines'].height + 40
c = Image.new('RGB', (W, H), F)
c.paste(esq, (20, 20)); y = 20
for b in dir_:
    c.paste(b, (20 + esq.width + 30, y)); y += b.height + 20
c.paste(B['Vitrines'], (20, 20 + topo_h + 30))
c.save(OUT); print(c.size)
