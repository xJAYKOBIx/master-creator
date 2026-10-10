// Screenshot of one category's grid: node tools/grid.mjs <category> <out.png> [width height]
import {chromium} from 'playwright-core';
const [cat='props',out='grid.png',w=1440,h=1800]=process.argv.slice(2),base=process.env.MC_URL||'http://127.0.0.1:8771/master-creator/index.html';
const b=await chromium.launch({executablePath:process.env.CHROMIUM||'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:+w,height:+h}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(base);await p.click(`#rail button[data-cat="${cat}"]`);await p.waitForTimeout(400);
// Scroll the grid through so every thumbnail paints, then back to the top.
await p.evaluate(async()=>{const g=document.getElementById('browse');for(let y=0;y<g.scrollHeight;y+=600){g.scrollTop=y;await new Promise(r=>setTimeout(r,120));}g.scrollTop=0;});
await p.waitForTimeout(500);await p.screenshot({path:out});console.log(JSON.stringify(errs));await b.close();
