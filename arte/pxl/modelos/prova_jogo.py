import base64
import json
import pathlib
import sys
# Cópia de TESTE do jogo com os modelos de cenário colocados na rua (não altera o the-city.html).
# Uso: python3 prova_jogo.py the-city.html pasta_dos_sprites saida.html
ENT, SPR, SAI = sys.argv[1], pathlib.Path(sys.argv[2]), sys.argv[3]
s = open(ENT, encoding='utf-8', newline='').read()
N = '\r\n'
src = {p.stem: 'data:image/png;base64,' + base64.b64encode(p.read_bytes()).decode('ascii') for p in sorted(SPR.glob('*.png'))}
ancora = " Promise.all([pvReady,pxlReady]).then(()=>{pxlPintar();pvDrawVehicles();"
assert s.count(ancora) == 1
i = s.index(ancora); j = s.index(N, i)
bloco = N.join([
    " // ---- PROVA (só nesta cópia): modelos de cenário em alta resolução, 4 px de arte por px de mundo ----",
    " const MOD_SRC=" + json.dumps(src, separators=(',', ':')) + ",MOD={};",
    " const modReady=Promise.all(Object.entries(MOD_SRC).map(([k,u])=>new Promise(r=>{const im=new Image();im.onload=()=>{MOD[k]=im;r()};im.onerror=r;im.src=u})));",
    " Promise.all([pvReady,pxlReady,modReady]).then(()=>{const g=sg,E=.25;g.save();g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';",
    "  // (cx, base) = ponto do chão no mundo; (ax, ay) = o mesmo ponto dentro do modelo, em px de arte; esc opcional",
    "  const chao=(k,cx,base,ax,ay,e=E)=>{const im=MOD[k];if(im)g.drawImage(im,cx-ax*e,base-ay*e,im.width*e,im.height*e)};",
    "  const sombra=(cx,base,rx,ry)=>oval(g,cx+2,base,rx,ry,'rgba(5,8,12,.45)');",
    "  // Lixeiras de rodas no lugar das atuais; sacos ao lado de uma delas.",
    "  for(const [x,y] of [[10,26],[29,26],[10,40]]){const X=Math.round(x*T*SX),Y=y*T;sombra(X+9,Y+25,13,4.5);chao('lixeira_rodas',X+8,Y+26.5,48,124)}",
    "  sombra(258,860,15,4);chao('sacos_lixo',256,861,60,88);",
    "  // Floreiras do café no lugar das atuais; vaso de cerâmica no canto do café; vaso de flores junto da livraria.",
    "  {const dc=766,B=1216;for(const px of [dc-42,dc+30]){sombra(px+6,B,12,3);chao('vaso_arbusto',px+6,B+.5,48,116)}sombra(866,B+2,11,3);chao('vaso_folhas',864,B+3,52,140);sombra(20,B+3,8,2.5);chao('vaso_flores',19,B+4,40,112)}",
    "  // Vitrines da livraria: a de livros à esquerda e, para comparar, a de loja fechada à direita.",
    "  {const im=MOD.vitrine_livros;if(im){g.drawImage(im,29,1157,90,90*im.height/im.width);g.drawImage(MOD.vitrine_fechada,157,1158,82,82*im.height/im.width)}}",
    "  chao('placa_pendurada',196,1128,0,0);",
    "  // Lixeira de metal e placa de trânsito na calçada da direita.",
    "  sombra(600,952,9,3);chao('lixeira_metal',598,953,38,110);sombra(596,1108,5,2);chao('placa_transito',594,1109,40,244);",
    "  g.restore();",
    "  // Elementos altos: árvores (uma delas seca) e a placa da rua.",
    "  const alto=(k,cx,base,ax,ay,kind)=>{const im=MOD[k],cv=document.createElement('canvas');cv.width=im.width;cv.height=im.height;cv.lw=im.width*E;cv.lh=im.height*E;cv.getContext('2d').drawImage(im,0,0);return {img:cv,x:cx-ax*E,y:base-ay*E,base,cx,kind}};",
    "  let nt=0;stProps.forEach((p,k)=>{if(p.kind==='tree'){nt++;stProps[k]=nt===2||nt===7?alto('arvore_seca',p.cx,p.base+4,176,460,'tree'):alto('arvore_copa',p.cx,p.base+4,212,480,'tree')}else if(p.kind==='sign')stProps[k]=alto('placa_rua',p.cx,p.base+1,182,226,'sign')});",
    "  streetMap.g.clearRect(0,0,RW,RH);streetMap.g.drawImage(streetHi,0,0,RW,RH);if(typeof artCache!=='undefined')artCache.clear();window.MODELOS_PRONTOS=true});",
])
s = s[:j] + N + bloco + s[j:]
open(SAI, 'w', encoding='utf-8', newline='').write(s)
print('ok', len(src), 'modelos')
