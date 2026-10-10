// Blood, smears and scrapes on the phone controller (v0.30). The deck is a panel someone has been fighting with: a splash that hit the
// hazard stripe and ran, a hand dragged down the left edge, claw gouges on the right, a spray behind the grenade and swap buttons and
// dried specks. It is drawn once as pixel art, two screen pixels to an art pixel, from a fixed seed, so it looks the same every time, and
// it is kept off the sticks and the HUD text. A few buttons get a thumbprint or a fleck of their own.
export const BLOOD=['#140605','#280b08','#3c110c','#561911','#6e2416'],ICHOR=['#1d1d0c','#2e2c13','#43401b'];
const BONE='#e8e0d1';
export function rng(seed){let a=seed>>>0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const hash=(x,y,s)=>{let n=Math.imul(x|0,374761393)+Math.imul(y|0,668265263)+Math.imul(s|0,982451653)|0;n=Math.imul(n^n>>>13,1274126177);return((n^n>>>16)>>>0)/4294967296;};
function noise(x,y,k,s){const gx=Math.floor(x/k),gy=Math.floor(y/k),fx=x/k-gx,fy=y/k-gy,a=hash(gx,gy,s),b=hash(gx+1,gy,s),c=hash(gx,gy+1,s),d=hash(gx+1,gy+1,s),u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;}
// Brushes on a 2D context in art pixels. Strokes that cross themselves only paint a pixel once, so dried blood stays flat.
export function brushes(c,seed){const r=rng(seed);let once=null;
 const px=(x,y,col,a=1)=>{x=Math.round(x);y=Math.round(y);if(once){const k=x+','+y;if(once.has(k))return;once.add(k);}c.globalAlpha=Math.max(0,Math.min(1,a));c.fillStyle=col;c.fillRect(x,y,1,1);};
 const stroke=fn=>{once=new Set();fn();once=null;};
 // A rough disc: the edge wobbles with noise so no two drops are round.
 const blob=(cx,cy,rad,col,a=1,rough=.45,s=0)=>{const R=Math.ceil(rad+2);stroke(()=>{for(let y=-R;y<=R;y++)for(let x=-R;x<=R;x++){const d=Math.hypot(x,y)+(noise(cx+x,cy+y,2,s)-.5)*rough*rad;if(d<rad)px(cx+x,cy+y,col,a);}});};
 const drop=(x,y,s,pal=BLOOD)=>{if(s<.9){px(x,y,pal[1]);return;}blob(x,y,s+.4,pal[1]);blob(x-.3,y-.3,Math.max(.6,s-.4),pal[2]);if(s>1.7)px(x-s*.4,y-s*.4,pal[3],.9);};
 // A splash: a pool, droplets thrown outward (along dir, when given) and a few streaks that join them to the pool.
 const splat=(cx,cy,rad,{spread=1,dir=null,arc=1.6,count=12}={})=>{blob(cx,cy,rad+1,BLOOD[1],1,.6,7);blob(cx,cy,rad,BLOOD[2],1,.6,7);blob(cx-rad*.25,cy-rad*.3,rad*.45,BLOOD[3],.9,.8,9);px(cx-rad*.35,cy-rad*.45,BLOOD[4],.8);
  for(let i=0;i<count;i++){const a=dir==null?r()*Math.PI*2:dir+(r()-.5)*arc,d=rad*(1.3+r()*2.6*spread),s=Math.max(.5,rad*.42*(1-d/(rad*4.8*spread))*(.5+r()));
   if(r()<.4){const L=d-rad;stroke(()=>{for(let t=0;t<L;t++){const k=t/L;px(cx+Math.cos(a)*(rad+t),cy+Math.sin(a)*(rad+t),k<.5?BLOOD[2]:BLOOD[1],1-.45*k);}});}
   drop(cx+Math.cos(a)*d,cy+Math.sin(a)*d,s);}};
 // A run down from where blood landed, thinning, with a bead at the end.
 const drip=(x,y,len,w=1)=>{stroke(()=>{for(let t=0;t<len;t++){const ww=Math.max(1,Math.round(w*(1-t/len*.5)));for(let i=0;i<ww;i++)px(x+i,y+t,ww>1&&i===ww-1?BLOOD[1]:BLOOD[2]);}});const bx=x+(w-1)/2;blob(bx,y+len,1.1+w*.35,BLOOD[1]);blob(bx-.3,y+len-.3,.7+w*.3,BLOOD[2]);px(bx-1,y+len-1,BLOOD[3]);};
 // A hand dragged across the panel: a heavy patch where it landed, then finger streaks that break up as the blood runs out.
 const smear=(x0,y0,x1,y1,wd,fingers=4,s=3,bend=0)=>{const L=Math.hypot(x1-x0,y1-y0),ux=(x1-x0)/L,uy=(y1-y0)/L,nx=-uy,ny=ux;
  blob(x0,y0,wd*.5,BLOOD[1],.9,.7,s+1);blob(x0-ux,y0-uy,wd*.32,BLOOD[2],.9,.7,s+2);
  stroke(()=>{for(let t=0;t<L;t++){const k=t/L,sway=Math.sin(k*Math.PI)*bend;for(let j=-wd/2;j<=wd/2;j+=.5){const f=(j+wd/2)/wd,fi=Math.min(fingers-1,Math.floor(f*fingers)),end=.45+.55*hash(fi,7,s),
   finger=Math.pow(Math.abs(Math.sin(f*Math.PI*fingers)),.7),dry=noise(t*.6,j*2.5,3,s),keep=finger*.95+.2-(k/end)*.9*(1-dry)-(dry<.28?.5:0);
   if(k<end&&keep>.5)px(x0+ux*t+nx*(j+sway),y0+uy*t+ny*(j+sway),keep>.9&&k<.3?BLOOD[2]:BLOOD[1],Math.min(.95,.5+keep*.5)*(1-k*.4));}}});};
 // Claw gouges: a bright line of scraped metal with a shadow on one side, deepest in the middle of each scratch.
 const claw=(x0,y0,x1,y1,n=3,gap=3)=>{const L=Math.hypot(x1-x0,y1-y0),ux=(x1-x0)/L,uy=(y1-y0)/L,nx=-uy,ny=ux;
  for(let i=0;i<n;i++){const off=(i-(n-1)/2)*gap,st=r()*L*.15,len=L*(.75+r()*.25);stroke(()=>{for(let t=st;t<len;t++){const k=(t-st)/(len-st),depth=Math.sin(k*Math.PI);if(depth<.2&&r()<.5)continue;const bend=Math.sin(k*2.2+i)*.6,x=x0+ux*t+nx*(off+bend),y=y0+uy*t+ny*(off+bend);
   px(x+nx,y+ny,'#000',.38*depth+.08);px(x,y,BONE,.05+.13*depth);}});}};
 // Light scuffs and chips where the paint has worn.
 const scuff=(x,y,len,a,al=.1)=>stroke(()=>{for(let t=0;t<len;t++)px(x+Math.cos(a)*t,y+Math.sin(a)*t,BONE,al*(.4+.6*Math.sin(t/len*Math.PI)));});
 const chip=(x,y)=>{px(x,y,BONE,.16);px(x+1,y+1,'#000',.35);};
 const dirt=(x,y,w,h,s,al=.5)=>stroke(()=>{for(let j=0;j<h;j++)for(let i=0;i<w;i++){const n=noise(x+i,y+j,7,s)*.7+noise(x+i,y+j,2,s+1)*.3;if(n>.6)px(x+i,y+j,'#070404',(n-.6)*al*2.2);}});
 return {r,px,blob,drop,splat,drip,smear,claw,scuff,chip,dirt};}
// The deck in art pixels: w × h, the move stick centred at (lx, sy) and the aim stick mirrored at (w − lx, sy), each kept clear to ring.
export function paintDeck(c,{w,h,lx=42,sy=52,ring=29,bottom=7}){const b=brushes(c,0xdead);c.clearRect(0,0,w,h);c.imageSmoothingEnabled=false;const rx=w-lx,foot=h-bottom;
 b.dirt(0,h-34,w*.4,34,11,.55);b.dirt(w*.62,h-30,w*.38,30,12,.5);b.dirt(0,0,w*.18,h*.6,13,.35);
 // A splash on the hazard stripe, top centre, running down toward the zoom bar.
 const tx=Math.round(w*.5)-3;b.splat(tx,1,3.2,{dir:Math.PI*.5,arc:2.6,spread:.75,count:11});b.drip(tx-2,2,13,2);b.drip(tx+2,3,8,1);b.drip(tx+5,2,17,1);b.drop(tx-8,6,1.1,ICHOR);
 // A hand dragged down the left edge.
 b.smear(1,sy-26,6,foot-4,10,4,21,2.5);
 // Claw marks down the right edge, and a short pair along the bottom.
 b.claw(w-3,sy-30,w-13,sy+20,3,4);b.claw(Math.round(w*.32),h-3,Math.round(w*.55),h-7,2,4);
 // A spray behind Grenade and Swap.
 b.splat(w-14,foot-8,4,{dir:Math.PI*1.12,arc:1.9,spread:1.15,count:16});b.drop(w-26,foot-2,1.3,ICHOR);b.drop(w-31,foot-14,.9,ICHOR);b.drip(w-12,foot-4,6,1);
 // Dried specks and worn chips anywhere the sticks and the text aren't.
 for(let i=0;i<34;i++){const x=b.r()*w,y=12+b.r()*(h-14);if(Math.hypot(x-lx,y-sy)<ring+2||Math.hypot(x-rx,y-sy)<ring+2)continue;b.r()<.55?b.drop(x,y,.6+b.r()*.9):b.chip(x,y);}
 for(let i=0;i<14;i++){const x=b.r()*w,y=24+b.r()*(h-26);b.scuff(x,y,3+b.r()*7,(b.r()-.5)*1.2,.12);}
 // Nothing under the sticks.
 c.globalAlpha=1;c.globalCompositeOperation='destination-out';for(const x of [lx,rx]){c.beginPath();c.arc(x,sy,ring,0,Math.PI*2);c.fill();}c.globalCompositeOperation='source-over';}
// Small marks for the buttons, as data URLs.
export function paintMarks(make){
 const print=make(12,14),p=print.getContext('2d'),pr=rng(77);for(let y=0;y<14;y++)for(let x=0;x<12;x++){const ex=(x-5.5)/5.6,ey=(y-6.5)/6.8,e=Math.hypot(ex,ey);if(e>1)continue;const ridge=Math.sin(Math.hypot(ex*1.1,ey+.25)*14);if(ridge<-.1||noise(x,y,2,5)<.3-e*.2||(x+y*.5>15&&pr()<.7))continue;p.globalAlpha=.55+.35*(1-e);p.fillStyle=ridge>.6?BLOOD[2]:BLOOD[1];p.fillRect(x,y,1,1);}
 const fleck=make(16,10),f=brushes(fleck.getContext('2d'),31);f.drop(3,3,1.6);f.drop(7,2,.9);f.drop(9,5,1.1);f.drop(13,3,.7);f.drop(5,7,.7);f.drop(12,8,.9);
 const wipe=make(22,7),wp=brushes(wipe.getContext('2d'),9);wp.smear(1,3,21,4,5,3,41);
 return {print:print.toDataURL(),fleck:fleck.toDataURL(),wipe:wipe.toDataURL()};}
// Put the grime on the deck and the marks on the buttons, and repaint when the deck changes size.
export function mountGrime(deck,doc=globalThis.document){
 if(!deck||!doc?.createElement||typeof ResizeObserver==='undefined')return null;
 const make=(w,h)=>{const c=doc.createElement('canvas');c.width=w;c.height=h;return c;};
 try{const m=paintMarks(make),root=doc.documentElement.style;root.setProperty('--gore-print',`url(${m.print})`);root.setProperty('--gore-fleck',`url(${m.fleck})`);root.setProperty('--gore-wipe',`url(${m.wipe})`);}catch{}
 const cv=doc.createElement('canvas');cv.id='grime';cv.setAttribute('aria-hidden','true');deck.appendChild(cv);let last='';
 const paint=()=>{const d=deck.getBoundingClientRect();if(!d.width||!d.height||doc.getElementById('moveZone')?.classList.contains('active'))return;const ring=doc.getElementById('ring')?.getBoundingClientRect(),w=Math.ceil(d.width/2),h=Math.ceil(d.height/2);
  const lx=ring?.width?Math.round((ring.left+ring.width/2-d.left)/2):42,sy=ring?.width?Math.round((ring.top+ring.height/2-d.top)/2):52,bottom=Math.round((d.bottom-(doc.getElementById('swapGun')?.getBoundingClientRect().bottom||d.bottom-14))/2);
  const key=[w,h,lx,sy,bottom].join();if(key===last)return;last=key;cv.width=w;cv.height=h;paintDeck(cv.getContext('2d'),{w,h,lx,sy,bottom:Math.max(5,bottom)});};
 const ro=new ResizeObserver(()=>requestAnimationFrame(paint));ro.observe(deck);return {paint,canvas:cv};}
