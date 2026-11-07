 // ===== PROVA DO ENTRELUZ (cópia de teste; não faz parte da versão publicada) =====
 // Chão inteiro, fachada do café, carros, motos e postes no estilo novo, mantendo a atmosfera fria e escura.
 const PV={},PV_SRC=__PV_SRC__;
 const pvReady=Promise.all(Object.entries(PV_SRC).map(([k,s])=>new Promise(r=>{const im=new Image();im.onload=()=>{PV[k]=im;r()};im.onerror=r;im.src=s})));
 const PVC={line:'#15161c',asph:'#272b32',asphD:'#22252c',asphL:'#2e333b',crack:'#14161b',crackL:'#3a3f48',curb:'#767c84',curbL:'#959ba2',curbFace:'#41464e',
  pav:'#454a52',pavL:'#4b5058',pavD:'#40444c',mortar:'#2a2d34',paint:'#a8a48c'};
 function orect(g,x,y,w,h,fill,line=PVC.line,t=.5){hrect(g,x-t,y-t,w+2*t,h+2*t,line);hrect(g,x,y,w,h,fill)}
 function pvBlob(g,cx,cy,rx,ry,seed){let s=seed;const r=()=>{s=(s*16807)%2147483647;return s/2147483647};const n=9,pts=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2,k=.75+r()*.35;pts.push([cx+Math.cos(a)*rx*k,cy+Math.sin(a)*ry*k])}
  const m=i=>[(pts[i%n][0]+pts[(i+1)%n][0])/2,(pts[i%n][1]+pts[(i+1)%n][1])/2];g.beginPath();g.moveTo(...m(0));for(let i=1;i<=n;i++)g.quadraticCurveTo(...pts[i%n],...m(i));g.closePath()}
 function provaChao(){const g=sg;
  // Asfalto: base lisa, manchas grandes em planos, trilhas de pneu um pouco mais escuras, rachaduras com borda clara.
  g.save();g.beginPath();g.rect(ROAD.l,ROAD.top,ROAD.r-ROAD.l,RH-ROAD.top);g.rect(0,ROAD.top,RW,ROAD.bottom-ROAD.top);g.clip();
  g.fillStyle=PVC.asph;g.fillRect(0,ROAD.top,RW,RH-ROAD.top);
  for(const t of [ROAD.l+34,ROAD.l+100,ROAD.r-100,ROAD.r-34])hrect(g,t-9,ROAD.bottom,18,RH-ROAD.bottom,'rgba(20,22,28,.28)');
  for(let k=0;k<70;k++){const x=sp(0,RW),y=sp(ROAD.top,RH);pvBlob(g,x,y,sp(14,46),sp(8,22),k+11);g.fillStyle=k%3?PVC.asphD:PVC.asphL;g.fill()}
  for(let k=0;k<26;k++){let x=sp(ROAD.l+10,ROAD.r-10),y=sp(ROAD.bottom+20,RH-20),a=sp(0,6.28);const pts=[[x,y]];for(let i=0;i<sp(4,9);i++){a+=sp(-.7,.7);x+=Math.cos(a)*sp(4,9);y+=Math.sin(a)*sp(4,9);pts.push([x,y])}
   g.lineWidth=1;g.strokeStyle=PVC.crackL;g.beginPath();pts.forEach(([px,py],i)=>i?g.lineTo(px+.5,py+.5):g.moveTo(px+.5,py+.5));g.stroke();g.strokeStyle=PVC.crack;g.beginPath();pts.forEach(([px,py],i)=>i?g.lineTo(px,py):g.moveTo(px,py));g.stroke()}
  g.restore();
  // Sinalização gasta: tracejado central, faixa de pedestres e linha de parada.
  for(let y=ROAD.bottom+52;y<RH;y+=48){hrect(g,ROAD.mid-1.5,y,3,24,'rgba(168,164,140,.42)');hrect(g,ROAD.mid-1.5,y,3,.5,'rgba(200,196,170,.35)')}
  for(let x=ROAD.l+10;x<ROAD.r-14;x+=22){hrect(g,x,ROAD.bottom+8,11,30,'rgba(178,182,170,.26)');hrect(g,x,ROAD.bottom+8,11,.5,'rgba(210,214,200,.25)');hrect(g,x,ROAD.bottom+37.5,11,.5,'rgba(10,12,16,.35)')}
  hrect(g,ROAD.mid+6,ROAD.bottom+46,ROAD.r-ROAD.mid-12,3,'rgba(178,182,170,.24)');
  // Calçadas: lajotas grandes (24 x 12) em amarração, contorno de rejunte, luz no alto e sombra embaixo de cada peça.
  const PWv=24,PHv=12,side=(x0,x1,y0,y1)=>{for(let y=y0,row=0;y<y1;y+=PHv,row++)for(let x=x0-((row&1)?PWv/2:0);x<x1;x+=PWv){const a=Math.max(x,x0),b=Math.min(x+PWv,x1),hh=Math.min(PHv,y1-y);if(b-a<=0)continue;
   const h=hash2(Math.round(x),Math.round(y)),base=h<.2?PVC.pavD:h>.9?PVC.pavL:PVC.pav;hrect(g,a,y,b-a,hh,PVC.mortar);hrect(g,a+.5,y+.5,b-a-1,hh-1,base);hrect(g,a+.5,y+.5,b-a-1,.5,shade(base,10));hrect(g,a+.5,y+hh-1,b-a-1,.5,shade(base,-8));
   if(h>.94&&b-a>12){g.strokeStyle=PVC.mortar;g.lineWidth=.5;g.beginPath();g.moveTo(a+3,y+2);g.lineTo(a+9,y+6);g.lineTo(a+12,y+hh-2);g.stroke()}}};
  side(0,ROAD.l-5,ROAD.bottom+4,RH);side(ROAD.r+5,RW,ROAD.bottom+4,RH);side(0,RW,0,ROAD.top-5);
  // Meio-fio: topo claro, face escura e sarjeta.
  const curbV=(x,dir)=>{const a=dir<0?x-5:x;orect(g,a,ROAD.bottom,5,RH-ROAD.bottom,PVC.curb);hrect(g,dir<0?a:a+4,ROAD.bottom,1,RH-ROAD.bottom,PVC.curbL);hrect(g,dir<0?a+4:a,ROAD.bottom,1,RH-ROAD.bottom,PVC.curbFace);hrect(g,dir<0?x:x-4,ROAD.bottom,4,RH-ROAD.bottom,'rgba(10,12,16,.45)');for(let y=ROAD.bottom+6;y<RH;y+=24)hrect(g,a,y,5,.5,PVC.line)};
  curbV(ROAD.l,-1);curbV(ROAD.r,1);
  orect(g,0,ROAD.top-5,RW,4,PVC.curb);hrect(g,0,ROAD.top-5,RW,1,PVC.curbL);hrect(g,0,ROAD.top-1,RW,4,'rgba(10,12,16,.45)');for(let x=0;x<RW;x+=24)hrect(g,x,ROAD.top-5,.5,4,PVC.line);
  for(const [a,b] of [[0,ROAD.l-5],[ROAD.r+5,RW]]){orect(g,a,ROAD.bottom,b-a,4,PVC.curb);hrect(g,a,ROAD.bottom,b-a,1,PVC.curbL);hrect(g,a,ROAD.bottom-3,b-a,3,'rgba(10,12,16,.45)')}
  // Tampas de bueiro e grelhas de sarjeta.
  for(const y of [22,34,42]){const x=ROAD.mid,yy=y*T;oval(g,x,yy+1.5,14,8.5,'rgba(8,10,14,.5)');oval(g,x,yy,13.5,8,PVC.line);oval(g,x,yy,12.5,7.2,'#3b3f47');oval(g,x,yy,10,5.6,'#2c2f36');for(let k=-8;k<=8;k+=3)hrect(g,x+k,yy-4.5+Math.abs(k)*.15,1,9-Math.abs(k)*.3,'#41464f');hrect(g,x-12,yy-.5,24,.5,'#545a63')}
  for(const y of [18,27,36,44])for(const x of [ROAD.l+3,ROAD.r-15]){orect(g,x,y*T,12,24,'#1b1d23');for(let k=0;k<10;k++)hrect(g,x+1.5,y*T+2+k*2.2,9,1,'#3d424b');hrect(g,x,y*T,12,.5,'#5c626b')}
  // Poças: forma plana escura com borda de cima clara (o brilho das luzes vem depois, na camada de luz).
  for(const p of stPuddles){g.save();g.translate(0,-1);puddlePath(g,p);g.fillStyle='rgba(120,130,150,.18)';g.fill();g.restore();puddlePath(g,p);g.fillStyle='#1b1f27';g.fill();
   g.save();puddlePath(g,p);g.clip();g.fillStyle='rgba(90,104,124,.22)';g.fillRect(p.cx-p.w*.5,p.cy-p.h*.6,p.w*.6,1);g.fillRect(p.cx-p.w*.2,p.cy-p.h*.15,p.w*.45,.5);g.restore()}
 }
 function pvBricks(g,X,Y,W,H){const bw=9,bh=4.5;hrect(g,X,Y,W,H,'#33272a');
  for(let y=Y,row=0;y<Y+H;y+=bh,row++)for(let x=X-((row&1)?bw/2:0);x<X+W;x+=bw){const a=Math.max(x,X)+.5,b=Math.min(x+bw,X+W)-.5;if(b<=a)continue;const h=hash2(Math.round(x*3),Math.round(y*3)),base=h<.3?'#4f3734':h>.8?'#614540':'#583e3a';
   hrect(g,a,y+.5,b-a,bh-1,base);hrect(g,a,y+.5,b-a,.5,shade(base,9))}}
 function pvWindow(x,y,w,h){const g=sg;orect(g,x-2,y-2,w+4,h+4,'#3a3d44');hrect(g,x,y,w,h,'#1a212b');
  g.fillStyle='rgba(120,140,170,.16)';g.beginPath();g.moveTo(x+w*.15,y+h);g.lineTo(x+w*.45,y);g.lineTo(x+w*.62,y);g.lineTo(x+w*.32,y+h);g.fill();
  hrect(g,x+w/2-.5,y,1,h,'#2c3038');hrect(g,x,y+h*.45,w,1,'#2c3038');orect(g,x-4,y+h+2,w+8,3,'#6b7078');hrect(g,x-4,y+h+2,w+8,.5,'#8b9097')}
 function pvInterior(x,y,w,h){const g=sg;vgrad(g,x,y,w,h,[[0,'#6e4426'],[.5,'#b0763c'],[1,'#7d5029']]);
  hrect(g,x,y+h*.3,w,1.5,'#3e2614');for(let bx=x+3;bx<x+w-3;bx+=4.5){const bh=3+((bx*7)%3);hrect(g,bx,y+h*.3-bh,2.5,bh,['#5a3a20','#7a5030','#4a3424'][Math.round(bx)%3])}
  for(let k=0;k<3;k++){const lx=Math.round(x+w*(.18+k*.32));hrect(g,lx,y,.5,h*.2,'#2a1a10');g.fillStyle='#2e1d12';g.beginPath();g.moveTo(lx-4,y+h*.27);g.lineTo(lx+4.5,y+h*.27);g.lineTo(lx+.25,y+h*.2);g.fill();hrect(g,lx-3,y+h*.27,7,1,'#ffe7ad');
   eg.fillStyle='rgba(255,226,160,1)';eg.fillRect(lx-3,y+h*.27,7,1.5)}
  for(let k=0;k<2;k++){const tx=x+w*(.18+k*.5);orect(g,tx,y+h-14,w*.28,3,'#6a4127','#2a170c');hrect(g,tx+2,y+h-11,1.5,10,'#2a170c');hrect(g,tx+w*.28-3.5,y+h-11,1.5,10,'#2a170c');hrect(g,tx+w*.08,y+h-16,3,2,'#e8dcc4')}
  g.fillStyle='rgba(255,236,200,.1)';g.beginPath();g.moveTo(x+w*.08,y+h);g.lineTo(x+w*.3,y);g.lineTo(x+w*.4,y);g.lineTo(x+w*.18,y+h);g.fill()}
 function provaCafe(x,y,w,h){
  block(streetMap,x*SX,y,w*SX,h);
  const g=sg,X=Math.round(x*T*SX),Y=y*T,W=Math.round(w*T*SX),H=h*T,wallH=132,FY=Y+H-wallH,B=Y+H,dc=X+Math.round(W*.52);
  vgrad(g,X+2,B,W,18,[[0,'rgba(6,8,12,.55)'],[1,'rgba(6,8,12,0)']]);
  // Telhado plano visto de cima: mureta, manta em painéis, ar-condicionado e respiro.
  orect(g,X,Y,W,FY-Y,'#383c43');hrect(g,X,Y,W,1,'#565b63');
  orect(g,X+6,Y+6,W-12,FY-Y-12,'#292c32','#1c1e24');hrect(g,X+6,Y+6,W-12,3,'rgba(8,10,14,.45)');hrect(g,X+6,Y+6,3,FY-Y-12,'rgba(8,10,14,.35)');
  for(let k=X+50;k<X+W-10;k+=44){hrect(g,k,Y+9,.5,FY-Y-15,'#212429');hrect(g,k+.5,Y+9,.5,FY-Y-15,'#33373e')}
  {const ax=X+26,ay=Y+44;hrect(g,ax+3,ay+4,38,28,'rgba(6,8,12,.5)');orect(g,ax,ay,38,28,'#575c64');hrect(g,ax,ay,38,1.5,'#737881');hrect(g,ax,ay+24,38,4,'#454950');oval(g,ax+19,ay+12,10,9,PVC.line);oval(g,ax+19,ay+12,9,8,'#30343b');for(let k=-7;k<=7;k+=2.5)hrect(g,ax+19+k,ay+5+Math.abs(k)*.3,1,14-Math.abs(k)*.6,'#4a4f57');oval(g,ax+19,ay+12,2,2,'#5d626a')}
  {const vx=X+W-48,vy=Y+92;oval(g,vx+2,vy+3,9,6,'rgba(6,8,12,.5)');oval(g,vx,vy,8,8,PVC.line);oval(g,vx,vy,7,7,'#4c5058');oval(g,vx,vy,4.5,4.5,'#1d1f25');hrect(g,vx-5,vy-5,4,1,'#6a6f77')}
  orect(g,X,FY-6,W,6,'#4a4e55');hrect(g,X,FY-6,W,1,'#686d75');
  // Fachada de tijolos com pilastras, janelas do andar de cima e friso de pedra.
  pvBricks(g,X,FY,W,wallH-7);orect(g,X,FY,5,wallH-7,'#47393a');orect(g,X+W-5,FY,5,wallH-7,'#3b2f31');
  orect(g,X,B-7,W,7,'#3d3537');hrect(g,X,B-7,W,1,'#544a4c');
  spread(X,W,3,30).forEach(wx=>pvWindow(wx,FY+10,30,26));
  orect(g,X,FY+46,W,5,'#5b5f66');hrect(g,X,FY+46,W,1,'#7a7f86');hrect(g,X,FY+51,W,2,'rgba(8,10,14,.5)');
  // Letreiro: placa escura de moldura dourada e letras quentes (acesas na camada de brilho).
  const sx=X+Math.round(W*.5),sy=FY+52;orect(g,sx-61,sy,122,18,'#8a7148',PVC.line,1);hrect(g,sx-59.5,sy+1.5,119,15,'#191b21');hrect(g,sx-59.5,sy+1.5,119,.5,'#2e3139');
  for(const [qx,qy] of [[-59,2.5],[58,2.5],[-59,15],[58,15]])hrect(g,sx+qx,sy+qy,1,1,'#c9ad74');
  pixelText(g,'ENTRELUZ',sx+.5,sy+4.5,2,'rgba(8,8,10,.8)');pixelText(g,'ENTRELUZ',sx,sy+4,2,'#f3d9a2');pixelText(eg,'ENTRELUZ',sx,sy+4,2,'rgba(255,214,150,1)');
  stGlows.push({c:'warm',x:sx,y:sy+10,r:74,sq:.3,a:.26});
  // Vitrines quentes.
  const top=FY+74,bot=B-8;
  for(const [a,b] of [[X+10,dc-22],[dc+22,X+W-10]]){const wx=Math.round(a),ww=Math.round(b-a),wy=top+4,wh=bot-wy;
   orect(g,wx-3,wy-3,ww+6,wh+5,'#2a292d');pvInterior(wx,wy,ww,wh);eg.fillStyle='rgba(255,192,116,.9)';eg.fillRect(wx,wy,ww,wh);
   for(let k=1;k<3;k++)hrect(g,wx+Math.round(ww*k/3)-1,wy,2,wh,'#1f2026');hrect(g,wx,wy+Math.round(wh*.3),ww,1.5,'#1f2026');
   orect(g,wx-4,bot,ww+8,3,'#6e665c');hrect(g,wx-4,bot,ww+8,.5,'#8d847a');
   stGlows.push({c:'warm',x:wx+ww/2,y:wy+wh/2,r:ww*.75,sq:.55,a:.22});stLights.push({c:'warm',x:wx+ww/2,y:B+20,r:ww*.85,sq:.5,i:.95});
   // Reflexo das vitrines na calçada molhada: faixas verticais quebradas.
   for(let k=0;k<5;k++){const rx=wx+ww*(.12+k*.19);for(let yy=B+5;yy<B+58;yy+=sp(5,9)){eg.fillStyle=`rgba(255,186,110,${(.6*(1-(yy-B)/62)).toFixed(3)})`;eg.fillRect(Math.round(rx),Math.round(yy),3,Math.round(sp(2,5)))}}}
  // Porta de madeira com vidro aceso e degrau.
  {const dw=28,dh=bot-top+2,dx=dc-dw/2,dy=B-dh-2;orect(g,dx-2,dy-2,dw+4,dh+2,'#2a292d');orect(g,dx,dy,dw,dh,'#5e3f28','#24170e');
   hrect(g,dx+4,dy+4,dw-8,dh*.55,'#e2a65c');eg.fillStyle='rgba(255,196,120,.95)';eg.fillRect(dx+4,dy+4,dw-8,dh*.55);hrect(g,dx+dw/2-.5,dy+4,1,dh*.55,'#3b2616');
   hrect(g,dx+4,dy+dh*.62,dw-8,dh*.3,'#53361f');hrect(g,dx+4,dy+dh*.62,dw-8,.5,'#7a5434');hrect(g,dx+dw-7,dy+dh*.5,2,4,'#d8b673');
   orect(g,dx-6,B-2,dw+12,4,'#5b5f66');hrect(g,dx-6,B-2,dw+12,.5,'#7d828a')}
  stLights.push({c:'warm',x:dc,y:B+16,r:46,sq:.6,i:.9},{c:'warm',x:X+W*.5,y:B+44,r:180,sq:.55,i:.42},{c:'warm',x:X+W*.5,y:B-30,r:130,sq:.5,i:.3});
  // Toldo verde-escuro com listras e beirada recortada.
  {const ay=top+5,ax0=X+4,aw=W-8;orect(g,ax0,ay-7,aw,8,'#2b4236');for(let k=ax0;k<ax0+aw;k+=10)hrect(g,k,ay-7,5,8,'#33503f');hrect(g,ax0,ay-7,aw,1,'#4d6b58');
   for(let k=ax0;k<ax0+aw-1;k+=10){oval(g,k+5,ay+1.5,5.6,3.6,PVC.line);oval(g,k+5,ay+1,5,3,'#2b4236');oval(g,k+5,ay+.4,3,1.4,'#355241')}hrect(g,ax0,ay+4.5,aw,3,'rgba(8,10,14,.35)')}
  // Floreiras com arbustos redondos.
  for(const px of [dc-42,dc+30]){orect(g,px,B-14,12,12,'#4a3a2c');hrect(g,px,B-14,12,1,'#6a5440');hrect(g,px,B-6,12,1,'#3a2c20');
   oval(g,px+6,B-18,10,8,PVC.line);oval(g,px+6,B-18,9,7,'#2d4632');oval(g,px+4,B-21,5,4,'#3f5e44');oval(g,px+9,B-20,3,3,'#36523b')}
 }
 // Veículos: imagens do criador na escala física (Kamila 1,65 m = 57 px de mundo).
 const PV_CARS=[];
 function pvCar(key,x,y,w,o={}){PV_CARS.push({key,x,y,w,o});const im=PV_SRC_SIZE[key],h=w*im[1]/im[0];streetMap.solid.push(o.solid||{x,y:y+4,w,h:h-8});
  if(o.open){streetMap.solid.push({x:x-14,y:y+h*.36,w:15,h:24});stLights.push({c:'warm',x:x-8,y:y+h*.55,r:32,sq:.7,i:.4},{c:'warm',x:x+w*.35,y:y+h*.46,r:22,sq:1,i:.5})}}
 function provaVeiculos(){
  pvCar('carro2',ROAD.r-70,1106,62,{open:true});pvCar('carro0',ROAD.l+7,620,62,{flip:true});pvCar('carro1',ROAD.r-70,842,62);
  pvCar('lado0',112,334,104,{solid:{x:118,y:352,w:91,h:34}});
  for(const [x,y,k] of [[12,32,'moto0'],[27.2,22,'moto2'],[12,43,'moto1']]){const X=x*T*SX,Y=y*T;block(streetMap,x*SX,y,SX,2);PV_CARS.push({key:k,x:X+11-15,y:Y,w:30,o:{}})}
 }
 function pvDrawVehicles(){const g=sg;g.save();g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';
  for(const c of PV_CARS){const im=PV[c.key];if(!im)continue;const h=c.w*im.height/im.width;
   const moto=c.key.startsWith('moto');g.fillStyle=moto?'rgba(6,8,12,.32)':'rgba(6,8,12,.45)';g.beginPath();g.ellipse(c.x+c.w/2+2,c.y+h/2+3,c.w*(moto?.36:.5),h*(moto?.4:.48),0,0,Math.PI*2);g.fill();
   if(c.o.flip){g.save();g.translate(0,c.y*2+h);g.scale(1,-1);g.drawImage(im,c.x,c.y,c.w,h);g.restore()}else g.drawImage(im,c.x,c.y,c.w,h);
   if(c.o.open){// porta do motorista aberta, com a luz de dentro
    const hx=c.x+5,hy=c.y+h*.34;eg.fillStyle='rgba(255,206,140,.55)';eg.fillRect(c.x+c.w*.22,c.y+h*.36,c.w*.36,h*.2);
    g.save();g.translate(hx,hy);g.rotate(.7);orect(g,-7,0,7,24,'#2e5a54');hrect(g,-6.5,.5,1,23,'#4a827a');hrect(g,-6,3,5,9,'#1e2b33');hrect(g,-6,3,5,1,'#4c6573');hrect(g,-2,15,2,1,'#9fb0aa');g.restore()}}
  g.restore()}
 // Postes: imagem do criador (aceso ou apagado), espelhada quando o braço aponta para a esquerda.
 const PV_LAMP_S=104/302;
 function provaLamp(x,y,o={}){const X=Math.round(x*T*SX),Y=Math.round(y*T),dir=o.dir??(X>RW/2?-1:1);streetMap.solid.push({x:(x*T-4)*SX,y:Y-3,w:8*SX,h:10});
  oval(sg,X+2,Y+2,9,3.5,'rgba(5,8,12,.55)');
  const key=o.dead?'posteOff':'posteOn',sz=PV_SRC_SIZE[key],cv=document.createElement('canvas');cv.width=sz[0];cv.height=sz[1];cv.lw=sz[0]*PV_LAMP_S;cv.lh=sz[1]*PV_LAMP_S;
  pvReady.then(()=>{const t=cv.getContext('2d');if(dir<0){t.translate(sz[0],0);t.scale(-1,1)}t.drawImage(PV[key],0,0)});
  const px=dir>0?X-27*PV_LAMP_S:X-(sz[0]-27)*PV_LAMP_S;stProps.push({img:cv,x:px,y:Y-304*PV_LAMP_S,base:Y,cx:X,kind:'lamp'});
  if(!o.dead)stLamps.push({x:X+dir*69*PV_LAMP_S,y:Y-(304-34)*PV_LAMP_S,gx:X+dir*18,gy:Y+10,r:o.r||104,flicker:!!o.flicker,phase:sp(0,9),speed:sp(.8,1.3)});
 }
 pvReady.then(()=>{pvDrawVehicles();streetMap.g.clearRect(0,0,RW,RH);streetMap.g.drawImage(streetHi,0,0,RW,RH);if(typeof artCache!=='undefined')artCache.clear();window.PROVA_PRONTA=true});
