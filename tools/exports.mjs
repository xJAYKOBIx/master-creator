// Lists what each of a game's modules exports, so a refactor can prove nothing went missing: node tools/exports.mjs <url-base> <out.json> file...
import {chromium} from 'playwright-core';import fs from 'fs';
const [base,out,...files]=process.argv.slice(2);
const b=await chromium.launch({executablePath:process.env.CHROMIUM||'/opt/pw-browsers/chromium'});const p=await b.newPage();await p.goto(base+'/icon.svg');
const r=await p.evaluate(async files=>{const o={};for(const f of files){try{const m=await import('./'+f);o[f]=Object.keys(m).sort().map(k=>k+':'+typeof m[k]);}catch(e){o[f]='ERROR '+e.message;}}return o;},files);
fs.writeFileSync(out,JSON.stringify(r,null,1));console.log(Object.entries(r).map(([k,v])=>k+' '+(Array.isArray(v)?v.length:v)).join('\n'));await b.close();
