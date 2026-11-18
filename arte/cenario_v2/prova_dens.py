import base64
import json
import pathlib
import sys
# Cópia de TESTE do jogo com os modelos V2 numa densidade escolhida (não altera o the-city.html).
# Uso: python3 arte/cenario_v2/prova_dens.py the-city.html arte/cenario_v2/densidade_2 arte/cenario_v2/densidade_2/MANIFESTO.json 2 copia_de_teste.html
# (para os PNGs como vieram: arte/cenario_v2/originais arte/cenario_v2/MANIFESTO_MODELOS.json 4)
# Os objetos de chão são pintados na camada do chão da rua (2 px de arte por px de mundo); os altos (árvores, placa) entram como elementos altos.
ENT, PASTA, MAN, D, SAI = sys.argv[1], pathlib.Path(sys.argv[2]), sys.argv[3], float(sys.argv[4]), sys.argv[5]
man = json.load(open(MAN, encoding='utf-8'))
anc = {a['id']: [a['anchorPx']['x'] * (D / 4 if 'densidade' not in man else 1), a['anchorPx']['y'] * (D / 4 if 'densidade' not in man else 1)] for a in man['assets']}
s = open(ENT, encoding='utf-8', newline='').read()
N = '\r\n'
src = {p.stem: 'data:image/png;base64,' + base64.b64encode(p.read_bytes()).decode('ascii') for p in sorted(PASTA.glob('*.png'))}
ancora = " Promise.all([pvReady,pxlReady]).then(()=>{pxlPintar();pvDrawVehicles();"
assert s.count(ancora) == 1
i = s.index(ancora); j = s.index(N, i)
bloco = N.join([
    f" // ---- PROVA (só nesta cópia): modelos V2 em {D:g} px de arte por px de mundo ----",
    " const MOD_SRC=" + json.dumps(src, separators=(',', ':')) + ",MOD={},ANC=" + json.dumps(anc) + f",DENS={D:g};",
    " const modReady=Promise.all(Object.entries(MOD_SRC).map(([k,u])=>new Promise(r=>{const im=new Image();im.onload=()=>{MOD[k]=im;r()};im.onerror=r;im.src=u})));",
    " Promise.all([pvReady,pxlReady,modReady]).then(()=>{const g=sg,E=1/DENS;g.save();",
    "  // Na densidade do chão (2), o desenho cai exatamente nos pixels da camada: sem suavizar. Nas outras, reduz suavizando.",
    "  g.imageSmoothingEnabled=DENS!==2;g.imageSmoothingQuality='high';const gr=v=>Math.round(v*2)/2;",
    "  const chao=(k,cx,base)=>{const im=MOD[k],a=ANC[k];if(im)g.drawImage(im,gr(cx-a[0]*E),gr(base-a[1]*E),im.width*E,im.height*E)};",
    "  const sombra=(cx,base,rx,ry)=>oval(g,cx+2,base,rx,ry,'rgba(5,8,12,.45)');",
    "  for(const [x,y] of [[10,26],[29,26],[10,40]]){const X=Math.round(x*T*SX),Y=y*T;sombra(X+9,Y+25,13,4.5);chao('lixeira_rodas',X+8,Y+26.5)}",
    "  sombra(258,860,15,4);chao('sacos_lixo',258,861);",
    "  {const dc=766,B=1216;for(const px of [dc-42,dc+30]){sombra(px+6,B,12,3);chao('vaso_arbusto',px+6,B+.5)}sombra(866,B+2,11,3);chao('vaso_folhas',864,B+3);sombra(20,B+3,8,2.5);chao('vaso_flores',19,B+4)}",
    "  chao('vitrine_livros',74,1217);chao('vitrine_fechada',198,1213);chao('placa_pendurada',197,1144);",
    "  sombra(600,952,9,3);chao('lixeira_metal',598,953);sombra(596,1108,5,2);chao('placa_transito',594,1109);",
    "  g.restore();",
    "  const alto=(k,cx,base,kind)=>{const im=MOD[k],a=ANC[k],cv=document.createElement('canvas');cv.width=im.width;cv.height=im.height;cv.lw=im.width*E;cv.lh=im.height*E;cv.getContext('2d').drawImage(im,0,0);return {img:cv,x:cx-a[0]*E,y:base-a[1]*E,base,cx,kind}};",
    "  let nt=0;stProps.forEach((p,k)=>{if(p.kind==='tree'){nt++;stProps[k]=alto(nt===2||nt===7?'arvore_seca':'arvore_copa',p.cx,p.base+4,'tree')}else if(p.kind==='sign')stProps[k]=alto('placa_rua',p.cx,p.base+1,'sign')});",
    "  streetMap.g.clearRect(0,0,RW,RH);streetMap.g.drawImage(streetHi,0,0,RW,RH);if(typeof artCache!=='undefined')artCache.clear();window.MODELOS_PRONTOS=true});",
])
s = s[:j] + N + bloco + s[j:]
open(SAI, 'w', encoding='utf-8', newline='').write(s)
print('ok', len(src), 'modelos, densidade', D)
