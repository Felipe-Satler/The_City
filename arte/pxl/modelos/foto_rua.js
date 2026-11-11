const {chromium}=require('playwright');
// Fotos da rua: na abertura e depois de subir um trecho. Uso: node foto_rua.js arquivo.html prefixo_saida [ms subindo]
(async()=>{const [file,out,sobe]=process.argv.slice(2);const b=await chromium.launch();
 const p=await b.newPage({viewport:{width:1440,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+file);await p.waitForTimeout(600);
 await p.click('[data-action=start]');await p.waitForTimeout(400);await p.click('[data-character=kamila]');await p.waitForTimeout(1200);await p.click('[data-action=return]');await p.waitForTimeout(2600);
 for(let i=0;i<3;i++){await p.keyboard.press('Enter');await p.waitForTimeout(250)}
 await p.waitForFunction(()=>window.MODELOS_PRONTOS||window.CENARIO_PRONTO,null,{timeout:6000}).catch(()=>{});
 await p.waitForTimeout(1200);await p.screenshot({path:out+'_abertura.png'});
 await p.keyboard.down('ArrowUp');await p.waitForTimeout(+(sobe||3200));await p.keyboard.up('ArrowUp');await p.waitForTimeout(700);
 await p.screenshot({path:out+'_subindo.png'});
 console.log('erros',errs);await b.close()})();
