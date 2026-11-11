(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.CrookedRig=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 function rotate(p,degrees){const a=degrees*Math.PI/180,c=Math.cos(a),s=Math.sin(a);return [p[0]*c-p[1]*s,p[0]*s+p[1]*c];}
 function world(model,p){return [p[0]*model.sourceScale+model.sourceOffset[0],p[1]*model.sourceScale+model.sourceOffset[1]];}
 function mapVertex(model,part,p,dest,pose){
  const source=part.restPath;let best=null,total=0;const lens=[];
  for(let i=0;i<source.length-1;i++){const a=source[i],b=source[i+1],vx=b[0]-a[0],vy=b[1]-a[1],len=Math.hypot(vx,vy);lens.push(len);total+=len;}
  let traveled=0;
  for(let i=0;i<source.length-1;i++){
   const a=source[i],b=source[i+1],len=lens[i],ux=(b[0]-a[0])/len,uy=(b[1]-a[1])/len;
   const along=(p[0]-a[0])*ux+(p[1]-a[1])*uy,t=clamp(along/len,0,1),cx=a[0]+ux*t*len,cy=a[1]+uy*t*len,ds=(p[0]-cx)**2+(p[1]-cy)**2;
   if(!best||ds<best.ds)best={i,t,ds,normal:-(p[0]-cx)*uy+(p[1]-cy)*ux,overflow:along-t*len,progress:(traveled+t*len)/total};
   traveled+=len;
  }
  const a=dest[best.i],b=dest[best.i+1],vx=b[0]-a[0],vy=b[1]-a[1],len=Math.max(1e-6,Math.hypot(vx,vy)),ux=vx/len,uy=vy/len;
  let width=model.sourceScale;
  if(part.id==='neck'&&pose.bulge!=null)width*=1+.65*Math.exp(-(((best.progress-pose.bulge)/.13)**2));
  return [a[0]+vx*best.t+ux*best.overflow*model.sourceScale-uy*best.normal*width,a[1]+vy*best.t+uy*best.overflow*model.sourceScale+ux*best.normal*width];
 }
 function triangle(ctx,img,s,d){
  const [p,q,r]=s,[a,b,c]=d,den=p[0]*(q[1]-r[1])+q[0]*(r[1]-p[1])+r[0]*(p[1]-q[1]);if(Math.abs(den)<1e-8)return;
  const m=(v)=>[(v[0]*(q[1]-r[1])+v[1]*(r[1]-p[1])+v[2]*(p[1]-q[1]))/den,(v[0]*(r[0]-q[0])+v[1]*(p[0]-r[0])+v[2]*(q[0]-p[0]))/den,(v[0]*(q[0]*r[1]-r[0]*q[1])+v[1]*(r[0]*p[1]-p[0]*r[1])+v[2]*(p[0]*q[1]-q[0]*p[1]))/den];
  const x=m([a[0],b[0],c[0]]),y=m([a[1],b[1],c[1]]),center=[(a[0]+b[0]+c[0])/3,(a[1]+b[1]+c[1])/3];
  ctx.save();ctx.beginPath();d.forEach((v,i)=>{let dx=v[0]-center[0],dy=v[1]-center[1],l=Math.max(.1,Math.hypot(dx,dy));let px=v[0]+dx/l*.22,py=v[1]+dy/l*.22;if(!i)ctx.moveTo(px,py);else ctx.lineTo(px,py);});ctx.closePath();ctx.clip();ctx.transform(x[0],y[0],x[1],y[1],x[2],y[2]);ctx.drawImage(img,0,0);ctx.restore();
 }
 function draw(ctx,model,images,pose,options){
  const o=options||{},dy=pose.offsetY||0,dx=pose.offsetX||0;ctx.save();ctx.translate(dx,dy);
  if(o.flip){ctx.translate(512,0);ctx.scale(-1,1);}
  for(const part of model.parts){
   const dest=pose.paths[part.id],mapped=part.mesh.vertices.map(v=>mapVertex(model,part,[v[0]+part.bounds.x,v[1]+part.bounds.y],dest,pose));
   for(const t of part.mesh.triangles)triangle(ctx,images[part.id],t.map(i=>part.mesh.vertices[i]),t.map(i=>mapped[i]));
  }
  const h=model.heads[pose.head],im=images[pose.head],angle=pose.headAngle||0;
  ctx.save();ctx.translate(pose.eye[0],pose.eye[1]);ctx.rotate(angle*Math.PI/180);ctx.scale(h.scale,h.scale);ctx.drawImage(im,-h.eye[0],-h.eye[1]);ctx.restore();
  if(o.joints){ctx.lineWidth=1;for(const part of model.parts){ctx.strokeStyle=part.id==='neck'?'#79d4ed':'#dea76a';ctx.beginPath();pose.paths[part.id].forEach((p,i)=>{if(i)ctx.lineTo(...p);else ctx.moveTo(...p);});ctx.stroke();for(const p of pose.paths[part.id]){ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(p[0],p[1],2,0,Math.PI*2);ctx.fill();}}}
  ctx.restore();const local=rotate([(h.mouth[0]-h.eye[0])*h.scale,(h.mouth[1]-h.eye[1])*h.scale],angle);let mouth=[pose.eye[0]+local[0],pose.eye[1]+local[1]];if(o.flip)mouth[0]=512-mouth[0];return [mouth[0]+dx,mouth[1]+dy];
 }
 function interpolate(a,b,t){const c=JSON.parse(JSON.stringify(a));for(const k of Object.keys(c.paths))c.paths[k]=c.paths[k].map((p,i)=>p.map((v,j)=>v+(b.paths[k][i][j]-v)*t));c.eye=a.eye.map((v,i)=>v+(b.eye[i]-v)*t);let d=((b.headAngle-a.headAngle+540)%360)-180;c.headAngle=a.headAngle+d*t;c.offsetY=(a.offsetY||0)+((b.offsetY||0)-(a.offsetY||0))*t;if(t>=.5)c.head=b.head;if(a.bulge!=null&&b.bulge!=null)c.bulge=a.bulge+(b.bulge-a.bulge)*t;return c;}
 return {draw,world,rotate,interpolate};
});
