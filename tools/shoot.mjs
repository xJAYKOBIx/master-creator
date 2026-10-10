// Screenshots of the library for review: node tools/shoot.mjs <out-prefix> [hash ...]
import {chromium} from 'playwright-core';
const [pre='shot',...ids]=process.argv.slice(2),base=process.env.MC_URL||'http://127.0.0.1:8771/master-creator/index.html';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const errs=[];
for(const [vw,vh,tag] of [[1440,900,'desk'],[390,844,'phone']]){const p=await b.newPage({viewport:{width:vw,height:vh},deviceScaleFactor:1});p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
 for(const id of ids.length?ids:['']){await p.goto('about:blank');await p.goto(base+(id?'#'+id:''));await p.waitForTimeout(1500);await p.screenshot({path:`${pre}-${tag}-${id||'home'}.png`});}await p.close();}
console.log(JSON.stringify(errs.slice(0,10)));await b.close();
