// Every catalogue entry draws, for every facing, animation frame and option choice, and every sound renders: audible, never clipping.
// Serve the project folder, then: node tests/smoke.mjs http://127.0.0.1:8771/master-creator
import {chromium} from 'playwright-core';
const base=process.argv[2]||'http://127.0.0.1:8771';
const b=await chromium.launch({executablePath:process.env.CHROMIUM||'/opt/pw-browsers/chromium'});const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(base+'/index.html');await p.waitForFunction(()=>window.mc);
const r=await p.evaluate(async()=>{const {CATALOG,CATEGORIES}=await import('./assets/catalog.js'),{kit}=await import('./assets/sounds/kit.js');const problems=[];let pictures=0,sounds=0;
 const ids=new Set();for(const e of CATALOG){if(ids.has(e.id))problems.push('duplicate id '+e.id);ids.add(e.id);
  for(const k of ['id','name','category','group','kind','summary','source','usage'])if(!e[k])problems.push(e.id+' has no '+k);
  if(!CATEGORIES.some(c=>c.id===e.category))problems.push(e.id+' has an unknown category');}
 const ink=(e,args)=>{const c=new OffscreenCanvas(e.w,e.h),g=c.getContext('2d',{willReadFrequently:true});e.draw(g,args);const d=g.getImageData(0,0,e.w,e.h).data;for(let i=3;i<d.length;i+=4)if(d[i])return true;return false;};
 for(const e of CATALOG){if(e.kind==='sound'){
   for(const o of [e.defaults||{},...(e.options||[]).flatMap(op=>op.choices.map((_,i)=>({...e.defaults,[op.key]:i})))]){const sr=22050,ctx=new OfflineAudioContext(1,Math.ceil(sr*(e.dur+.1)),sr);e.sound.play(kit(ctx,0),o);
    const d=(await ctx.startRendering()).getChannelData(0);let pk=0;for(const v of d)pk=Math.max(pk,Math.abs(v));sounds++;if(pk<.002)problems.push(e.id+' is silent ('+pk.toFixed(4)+')');if(pk>=1)problems.push(e.id+' clips');}
   continue;}
  const frames=e.anims?[...new Set(Object.values(e.anims).flatMap(a=>a.frames))]:[0],facings=e.facings>1?[0,1,2,3,4,5,6,7]:[0],times=e.kind==='motion'?[0,e.dur*.3,e.dur*.6,e.dur*.95]:[0];
  for(const facing of facings)for(const frame of frames)for(const t of times){pictures++;try{if(!ink(e,{facing,frame,o:e.defaults||{},t}))problems.push(`${e.id} is blank at facing ${facing}, frame ${frame}, t ${t}`);}catch(err){problems.push(`${e.id}: ${err.message}`);}}
  for(const op of e.options||[]){const values=op.type==='text'?['','ABC 123']:op.choices.map((c,i)=>c?i:null).filter(v=>v!==null);
   for(const v of values){pictures++;try{ink(e,{facing:e.facing??0,frame:0,o:{...e.defaults,[op.key]:v},t:(e.dur||0)*.6});}catch(err){problems.push(`${e.id} ${op.key}=${v}: ${err.message}`);}}}
  for(const pr of e.presets||[]){pictures++;try{ink(e,{facing:1,frame:0,o:{...e.defaults,...pr.options},t:0});}catch(err){problems.push(`${e.id} preset ${pr.name}: ${err.message}`);}}}
 return {entries:CATALOG.length,pictures,sounds,problems};});
console.log(`${r.entries} entries, ${r.pictures} pictures drawn, ${r.sounds} sounds rendered`);
for(const x of [...r.problems,...errs])console.log('PROBLEM',x);
await b.close();process.exit(r.problems.length||errs.length?1:0);
