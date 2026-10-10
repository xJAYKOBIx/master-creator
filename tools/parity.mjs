// Checks that the Master Creator draws every shared asset exactly as the game it came from does, pixel for pixel.
// Serve a folder that holds both projects, then: node tools/parity.mjs http://127.0.0.1:8771 /master-creator /dh
// (the second and third arguments are the URL paths of this project and of the game's dist folder).
import {chromium} from 'playwright-core';
const [origin='http://127.0.0.1:8771',mc='/master-creator',dh='/dh']=process.argv.slice(2);
const b=await chromium.launch({executablePath:process.env.CHROMIUM||'/opt/pw-browsers/chromium'});const p=await b.newPage();
await p.goto(origin+mc+'/index.html');
const out=await p.evaluate(async([mc,dh])=>{
 const M=async f=>import(mc+'/assets/'+f),D=async f=>import(dh+'/'+f);
 const [mc1,dh1,mcA,dhA,mcP,dhP,mcL,dhL,mcW,dhW,mcG,dhG,mcF,dhF,mcT,dhT,mcB,dhB]=await Promise.all([M('characters/character.js'),D('study/character.js'),M('characters/appearance.js'),D('study/appearance.js'),
  M('animals/pet.js'),D('companion/pet.js'),M('animals/look.js'),D('companion/look.js'),M('weapons/equipment.js'),D('study/equipment.js'),M('effects/grime.js'),D('study/grime.js'),
  M('ui/font5x7.js'),D('intro/font.js'),M('effects/tv.js'),D('intro/tv.js'),M('effects/broadcast.js'),D('intro/overlay.js')]);
 const mk=(w,h)=>{const c=new OffscreenCanvas(w,h);return [c,c.getContext('2d',{willReadFrequently:true})];};
 const same=(w,h,fa,fb)=>{const [,a]=mk(w,h),[,b]=mk(w,h);fa(a);fb(b);const x=a.getImageData(0,0,w,h).data,y=b.getImageData(0,0,w,h).data;let n=0,ink=0;for(let i=0;i<x.length;i++){if(x[i]!==y[i])n++;if(i%4===3&&x[i])ink++;}return {diff:n,ink};};
 let seed=7;const rand=()=>{seed=(seed*1103515245+12345)&0x7fffffff;return seed/0x7fffffff;};
 const res={};const tally=(k,r)=>{const t=res[k]??={cases:0,failed:0,emptyCases:0};t.cases++;if(r.diff)t.failed++;if(!r.ink)t.emptyCases++;};
 const guns=Object.keys(dhW.GUNS);
 for(let i=0;i<60;i++){const look=dhA.randomAppearance(rand);if(i%3===0)look.zombie=1;else if(i%2===0)look.gun=guns[i%guns.length];
  for(const dir of [0,1,2,3,4,5,6,7])for(const f of [0,4,12])tally(look.zombie?'zombie':'survivor',same(160,192,c=>{c.scale(2,2);dhA&&dh1.survivor(c,dir,f,true,look);},c=>{c.scale(2,2);mc1.survivor(c,dir,f,true,look);}));}
 for(let i=0;i<30;i++){const species=i%2,look={species,...dhL.randomPet(species,rand)};for(const dir of [0,1,2,5,6])for(const f of [0,5,11,16,18])tally(species?'cat':'dog',same(160,160,c=>{c.scale(2,2);dhP.pet(c,dir,f,look);},c=>{c.scale(2,2);mcP.pet(c,dir,f,look);}));}
 const vp=c=>({r:(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h);},p:(pts,col)=>{c.fillStyle=col;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}});
 for(const id of guns)for(const paint of [undefined,dhW.PAINT[id]])tally('guns',same(240,120,c=>{c.translate(120,60);c.scale(4,4);dhW.gunArt(vp(c),id,paint);},c=>{c.translate(120,60);c.scale(4,4);mcW.gunArt(vp(c),id,paint);}));
 for(const id of Object.keys(dhW.GRENADES))tally('grenades',same(120,120,c=>{c.translate(60,60);c.scale(4,4);dhW.grenadeArt(vp(c),id);},c=>{c.translate(60,60);c.scale(4,4);mcW.grenadeArt(vp(c),id);}));
 for(const [w,h] of [[390,270],[600,300]])tally('grime deck',same(w,h,c=>dhG.paintDeck(c,{w,h}),c=>mcG.paintDeck(c,{w,h})));
 tally('font',same(240,40,c=>{dhF.text(c,'THE QUICK BROWN FOX 0123456789 ,.!?',2,2,'#fff');},c=>{mcF.text(c,'THE QUICK BROWN FOX 0123456789 ,.!?',2,2,'#fff');}));
 for(const k of [.3,1])tally('tv logo',same(240,135,c=>dhT.logo(c,240,135,k),c=>mcT.logo(c,240,135,k)));
 for(const t of [0,3,9])tally('no signal',same(240,135,c=>dhT.noSignal(c,240,135,t),c=>mcT.noSignal(c,240,135,t)));
 tally('osd',same(240,135,c=>dhT.osd(c,9,'MRN',1,240),c=>mcT.osd(c,9,'MRN',1,240)));
 for(const t of [.5,2])tally('broadcast',same(240,135,c=>{dhB.lowerThird(c,{tag:'LIVE',headline:'TEST',wipe:t});dhB.ticker(c,'ONE · TWO · ',t,{clock:'11:47'});dhB.captions(c,[[0,'A'],[1,'B']],t);dhB.bug(c,'6',200,5);},
  c=>{mcB.lowerThird(c,{tag:'LIVE',headline:'TEST',wipe:t});mcB.ticker(c,'ONE · TWO · ',t,{clock:'11:47'});mcB.captions(c,[[0,'A'],[1,'B']],t);mcB.bug(c,'6',200,5);}));
 // Props, robots, icons, flames and fish.
 const [mcC,dhC,mcWk,dhWk,mcBt,cd,td]=await Promise.all([M('props/camp.js'),D('camp/art.js'),M('props/workshop.js'),D('grounds/art.js'),M('characters/bots.js'),D('camp/data.js'),D('grounds/data.js')]);
 for(const [mine,theirs,list] of [[mcC,dhC,cd.PROPS],[mcWk,dhWk,td.PROPS]])for(const o of list){const w=Math.ceil(o.w+mcC.PROP_PAD*2)*2,h=Math.ceil(o.h+o.z+mcC.PROP_PAD*2)*2;tally('props',same(w,h,c=>theirs.propArt(c,o),c=>mine.propArt(c,o)));}
 tally('robots',same(56*4*2,56*7*2,c=>dhWk.botArt(c),c=>mcBt.botArt(c)));tally('brute',same(96*4*2,88*2,c=>dhWk.bruteArt(c),c=>mcBt.bruteArt(c)));
 tally('icons',same(20*7*2,24*2,c=>dhC.iconArt(c),c=>mcC.iconArt(c)));tally('flames',same(48*6*2,60*2,c=>dhC.flameArt(c),c=>mcC.flameArt(c)));
 for(const id of Object.keys(dhC.FISH_COLORS))for(const cook of [null,.3,.7,.95])tally('fish',same(120,60,c=>{c.translate(60,30);c.scale(2,2);dhC.fishArt(c,id,cook);},c=>{c.translate(60,30);c.scale(2,2);mcC.fishArt(c,id,cook);}));
 return res;},[mc,dh]);
let bad=0;for(const [k,v] of Object.entries(out)){console.log(`${k.padEnd(12)} ${String(v.cases).padStart(4)} cases  ${v.failed?v.failed+' DIFFER':'identical'}${v.emptyCases?'  ('+v.emptyCases+' blank)':''}`);bad+=v.failed;}
await b.close();process.exit(bad?1:0);
