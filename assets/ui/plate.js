// The phone controller's faceplate: the worn gunmetal plate the portrait controls sit in. Two halves with a seam down the middle, a
// hazard stripe along the top, screws, a recessed well under each stick and a socket under each button, dark glass behind the
// readouts, and the two names cut into the bottom edge with a knife at the same size: G.U.N. on the left in careful straight cuts
// with stabbed stops, LEET AF on the right, hacked in fast with slips past the corners. Then scratches, rust round the screws and some blood, kept out of the wells and off the names.
// Everything is in art pixels (a game shows it at two screen pixels each) and comes from fixed seeds, so it paints the same every time.
import {brushes,BLOOD,rng} from '../effects/grime.js';
import {HEIGHT} from './font5x7.js';
export const STEEL=['#0f1013','#17181c','#1f2126','#292b31','#363940','#4b4f58','#6b6f78'];
export const RUST=['#2b170d','#45230f','#603115','#7b431f'];
const HAZARD=['#c39a2a','#8f6f1c'],INK='#0a0b0d',CUT='#bdb9b0',BARE='#8d8a83';
const hash=(x,y,s)=>{let n=Math.imul(x|0,374761393)+Math.imul(y|0,668265263)+Math.imul(s|0,982451653)|0;n=Math.imul(n^n>>>13,1274126177);return((n^n>>>16)>>>0)/4294967296;};
const rgb=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const mix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
// The names, as knife cuts: each letter is a few straight strokes in a 5 × 7 box like the font's (a knife cannot draw a curve, so the G and U are
// faceted), and a stop is a stab. Letters sit 6 apart, with 4 for a space.
const CUTS={L:[[0,0,0,6],[0,6,4,6]],E:[[0,0,0,6],[0,0,4,0],[0,3,3,3],[0,6,4,6]],T:[[0,0,4,0],[2,0,2,6]],A:[[0,6,2,0],[2,0,4,6],[1,4,3,4]],
 F:[[0,0,0,6],[0,0,4,0],[0,3,3,3]],G:[[4,1,3,0],[3,0,1,0],[1,0,0,1],[0,1,0,5],[0,5,1,6],[1,6,4,6],[4,6,4,3],[4,3,2,3]],
 U:[[0,0,0,5],[0,5,1,6],[1,6,3,6],[3,6,4,5],[4,5,4,0]],N:[[0,6,0,0],[0,0,4,6],[4,6,4,0]]};
const ADV=c=>c===' '?4:c==='.'?3:6;
export const nameWidth=s=>[...s].reduce((a,c,i)=>a+(i<s.length-1?ADV(c):c==='.'?1:5),0);
// Scores one name into a depth map (x,y → 0..1): each stroke walked in half-pixel steps from a jittered start, biting deepest
// a little after the start and lifting off at the end. A hasty hand overshoots the corners and sometimes goes over a cut twice.
function score(s,x0,y0,seed,hasty){const m=new Map(),dig=(x,y,v)=>{const k=Math.round(x)+','+Math.round(y);m.set(k,Math.max(m.get(k)||0,v));};let cx=x0,n=0;
 for(const ch of s){if(ch==='.'){dig(cx,y0+6,1);dig(cx,y0+5,.5);}
  for(const [a,b,c,d] of CUTS[ch]||[]){n++;const j=(k,amt)=>(hash(n,k,seed)-.5)*amt,over=hasty?.6+hash(n,9,seed)*1.6:.15+hash(n,9,seed)*.35,
    X0=cx+a+j(1,.7),Y0=y0+b+j(2,.5),X1=cx+c+j(3,.7),Y1=y0+d+j(4,.5),L=Math.hypot(X1-X0,Y1-Y0)||1,ux=(X1-X0)/L,uy=(Y1-Y0)/L,end=L+over;
   for(let t=-.2;t<=end;t+=.5){const f=t/end,v=Math.min(1,.55+f*3)*(f>.8?1-(f-.8)*2.6:1)*(.62+hash(n,Math.round(t*2),seed+1)*.38),w=hasty&&t>L*.5&&hash(n,7,seed)<.35?1:0;dig(X0+ux*t+(Math.abs(uy)>.7?w:0),Y0+uy*t+(Math.abs(uy)>.7?0:w),v);}
   // A second pass, a pixel off and fainter, on some of the hasty cuts; and a slip that scratches on past the end of a few.
   if(hasty&&hash(n,5,seed)<.3){const ox=Math.abs(uy)>.7?1:0,oy=ox?0:1;for(let t=.5;t<L-.5;t+=.5)dig(X0+ux*t+ox,Y0+uy*t+oy,.32);}
   if(hasty&&hash(n,6,seed)<.22)for(let t=end;t<end+3;t+=.5)dig(X0+ux*t,Y0+uy*t,.18);}
  cx+=ADV(ch);}
 return m;}
export const NAMES={gun:'G.U.N.',leet:'LEET AF'};
// w × h: the plate. split: x of the seam between the halves. band: the strip along the bottom the names sit in (art pixels tall).
// wells: [{x, y, r}] under the sticks. sockets: [{x, y, r}] under the buttons. insets: [{x, y, w, h}] behind readouts.
// names: {left: x where G.U.N. starts, right: x where LEET AF ends, y: top of the letters}. blood: false leaves it clean.
export function paintPlate(c,{w,h,split=Math.round(w/2),band=8,wells=[],sockets=[],insets=[],names=null,blood=true,seed=0x51ee1}){
 c.clearRect(0,0,w,h);c.imageSmoothingEnabled=false;c.globalAlpha=1;c.globalCompositeOperation='source-over';
 const S=STEEL.map(rgb),img=c.createImageData(w,h),d=img.data,foot=h-band,r=rng(seed);
 // Brushed gunmetal: lighter toward the top, with long horizontal grain and a slow mottle.
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const t=y/h,run=Math.floor((x+hash(y,1,seed)*40)/(10+hash(y,2,seed)*26)),grain=hash(run,y,seed)*.5+hash(x>>3,y>>2,seed+1)*.25;
  let v=2.15-t*1.15+grain*.95-(hash(x>>4,y>>4,seed+2)<.18?.35:0);if(y>=foot)v-=.3;const i=Math.max(0,Math.min(4,Math.floor(v))),col=mix(S[i],S[Math.min(6,i+1)],v-Math.floor(v)<.5?0:.35),o=(y*w+x)*4;
  d[o]=col[0];d[o+1]=col[1];d[o+2]=col[2];d[o+3]=255;}
 c.putImageData(img,0,0);
 const px=(x,y,col,a=1)=>{c.globalAlpha=a;c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),1,1);};
 const line=(x0,y0,x1,y1,col,a=1)=>{c.globalAlpha=a;c.fillStyle=col;c.fillRect(Math.round(Math.min(x0,x1)),Math.round(Math.min(y0,y1)),Math.round(Math.abs(x1-x0))+1,Math.round(Math.abs(y1-y0))+1);};
 // The lip and the hazard stripe, worn through to the metal in places.
 line(0,0,w-1,0,STEEL[6],.55);line(0,1,w-1,1,STEEL[5],.35);
 for(let y=2;y<5;y++)for(let x=0;x<w;x++){const k=Math.floor((x+y)/4)%2,worn=hash(x>>1,y,seed+3)<.18||hash(x>>3,0,seed+4)<.12;if(worn)continue;px(x,y,HAZARD[k?1:0],k?.5:.75);}
 line(0,5,w-1,5,'#000',.55);
 // Edges, the seam between the halves and the strip the names are on.
 line(0,0,0,h-1,'#000',.5);line(w-1,0,w-1,h-1,'#000',.5);
 line(split,7,split,foot-3,'#000',.55);line(split+1,7,split+1,foot-3,STEEL[5],.18);
 line(1,foot-1,w-2,foot-1,'#000',.6);line(1,foot,w-2,foot,STEEL[5],.2);
 // Screws in each half's corners, with rust bleeding out from a few.
 const screw=(x,y)=>{for(let j=-2;j<=2;j++)for(let i=-2;i<=2;i++){const e=Math.hypot(i,j);if(e>2.3)continue;px(x+i,y+j,e>1.6?'#000':i+j<0?STEEL[5]:STEEL[3],e>1.6?.5:1);}
  const a=hash(x,y,seed+5)*Math.PI;for(let t=-1;t<=1;t++)px(x+Math.round(Math.cos(a)*t),y+Math.round(Math.sin(a)*t),INK);
  if(hash(x,y,seed+6)<.55)for(let k=0;k<14;k++){const ang=r()*Math.PI*2,dd=2.5+r()*3.5;px(x+Math.cos(ang)*dd,y+Math.sin(ang)*dd*1.3+(r()<.5?1:0),RUST[Math.floor(r()*4)],.35+r()*.35);}};
 for(const [x,y] of [[3,9],[split-4,9],[split+5,9],[w-4,9],[3,foot-4],[split-4,foot-4],[split+5,foot-4],[w-4,foot-4]])screw(x,y);
 // Rust along the bottom and in the corners.
 for(let y=foot-8;y<h;y++)for(let x=0;x<w;x++){const n=hash(x>>1,y>>1,seed+7)*.6+hash(x>>3,y>>2,seed+8)*.4,edge=Math.min(x,w-1-x)<10?.18:0;if(n+edge>.86)px(x,y,RUST[Math.floor(hash(x,y,seed+9)*4)],.28);}
 // The names, cut into the metal: each cut scraped through the paint to bright bare steel, its upper and left wall in shadow (the
 // light comes from the top left), a faint lit lip below it, and a few raised burrs along the deepest cuts.
 const keep=new Set();
 if(names){const top=names.y??foot+Math.max(0,Math.floor((band-HEIGHT)/2)),cut=new Map([...score(NAMES.gun,names.left,top,seed+14,false),...score(NAMES.leet,names.right-nameWidth(NAMES.leet),top,seed+10,true)]);
  const each=f=>{for(const [k,v] of cut){const [X,Y]=k.split(',').map(Number);f(X,Y,v,(i,j)=>cut.has((X+i)+','+(Y+j)));}};
  each((X,Y,v,has)=>{if(!has(0,-1))px(X,Y-1,'#000',.75*v);if(!has(-1,0))px(X-1,Y,'#000',.6*v);if(!has(0,1))px(X,Y+1,STEEL[6],.3*v);if(!has(1,0))px(X+1,Y,STEEL[5],.3*v);});
  each((X,Y,v)=>{px(X,Y,v>.8?CUT:v>.55?BARE:STEEL[6],.4+.5*v);if(v>.7&&hash(X,Y,seed+12)<.12)px(X+(hash(X,Y,seed+13)<.5?-1:1),Y-1,CUT,.3);keep.add(X+','+Y);});}
 // Wear: scuffs across both halves, paint chips, and a set of claw gouges across the right half.
 const b=brushes(c,seed^0x77);
 for(let i=0;i<26;i++){const x=b.r()*w,y=8+b.r()*(foot-10);b.scuff(x,y,4+b.r()*10,(b.r()-.5)*1.4,.1);}
 for(let i=0;i<30;i++)b.chip(b.r()*w,7+b.r()*(foot-8));
 b.claw(Math.round(w*.62),12,Math.round(w*.78),Math.round(foot*.42),3,3);b.claw(Math.round(w*.08),Math.round(foot*.55),Math.round(w*.2),Math.round(foot*.8),2,3);
 b.dirt(0,foot-14,w,14,21,.5);b.dirt(0,6,Math.round(w*.15),Math.round(foot*.6),22,.35);
 // Blood: a splash that hit the stripe and ran, a hand dragged down the left edge, a spray low on the right, dried specks.
 const clear=(x,y,pad)=>wells.every(o=>Math.hypot(x-o.x,y-o.y)>o.r+pad)&&sockets.every(o=>Math.hypot(x-o.x,y-o.y)>o.r+pad)&&y<foot-1;
 if(blood){const sx=Math.round(w*.44);b.splat(sx,3,3,{dir:Math.PI*.5,arc:2.4,spread:.8,count:12});b.drip(sx-2,4,Math.round(foot*.22),2);b.drip(sx+3,5,Math.round(foot*.12),1);
  b.smear(1,Math.round(foot*.3),5,foot-6,9,4,21,2);
  b.splat(w-12,foot-9,3.5,{dir:Math.PI*1.1,arc:1.9,spread:1.1,count:14});b.drip(w-10,foot-6,5,1);
  for(let i=0;i<30;i++){const x=b.r()*w,y=8+b.r()*(foot-9);if(clear(x,y,2))b.drop(x,y,.6+b.r()*.9);}}
 c.globalAlpha=1;
 // Wells under the sticks: sunk in, lit from the top left, with a knurled rim.
 for(const o of wells){const R=Math.ceil(o.r+4);for(let j=-R;j<=R;j++)for(let i=-R;i<=R;i++){const e=Math.hypot(i,j);
   if(e<=o.r){const t=e/o.r;px(o.x+i,o.y+j,t>.9?STEEL[0]:STEEL[1],t>.9?1:.92);if(t>.84&&t<=.94&&(i+j)>0)px(o.x+i,o.y+j,STEEL[4],.35);}
   else if(e<=o.r+1.2)px(o.x+i,o.y+j,i+j<0?'#000':STEEL[5],i+j<0?.65:.4);
   else if(e<=o.r+3.2){const a=Math.atan2(j,i),tick=Math.floor((a+Math.PI)/(Math.PI/24))%2;px(o.x+i,o.y+j,tick?STEEL[4]:STEEL[0],tick?.35:.5);}}
  for(let k=0;k<4;k++){const a=k*Math.PI/2;px(o.x+Math.cos(a)*(o.r-3),o.y+Math.sin(a)*(o.r-3),STEEL[4],.5);}}
 // Sockets under the buttons: a dark ring the cap sits down into.
 for(const o of sockets){const R=Math.ceil(o.r+2);for(let j=-R;j<=R;j++)for(let i=-R;i<=R;i++){const e=Math.hypot(i,j);
   if(e<=o.r)px(o.x+i,o.y+j,STEEL[0],.9);else if(e<=o.r+1.4)px(o.x+i,o.y+j,i+j<0?'#000':STEEL[5],i+j<0?.6:.35);}}
 // Dark glass behind the readouts, screwed down at the corners.
 for(const o of insets){c.globalAlpha=.8;c.fillStyle='#0a0b0e';c.fillRect(o.x,o.y,o.w,o.h);line(o.x-1,o.y-1,o.x+o.w,o.y-1,'#000',.7);line(o.x-1,o.y-1,o.x-1,o.y+o.h,'#000',.7);
  line(o.x,o.y+o.h,o.x+o.w,o.y+o.h,STEEL[5],.35);line(o.x+o.w,o.y,o.x+o.w,o.y+o.h,STEEL[5],.3);line(o.x+1,o.y+1,o.x+o.w-2,o.y+1,'#ffffff',.04);}
 c.globalAlpha=1;}
// A sample layout for the library: the 195 × 115 plate of a 390-wide phone, both sticks, seven buttons, two readouts and the names.
export const SAMPLE={w:195,h:115,split:81,band:8,wells:[{x:41,y:55,r:31},{x:156,y:61,r:32}],
 sockets:[{x:106,y:68,r:15},{x:110,y:41,r:15},{x:117,y:92,r:14},{x:127,y:21,r:14},{x:17,y:96,r:12},{x:40,y:96,r:12},{x:63,y:96,r:12}],
 insets:[{x:7,y:3,w:107,h:21},{x:141,y:3,w:47,h:22}],names:{left:8,right:187,y:108}};
