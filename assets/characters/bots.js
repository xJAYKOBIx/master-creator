// Gadget's robots and the brute: training dummies built from a bedsheet over a stuffed pillow, broom-handle arms, a car battery and
// shopping-cart wheels, in seven looks (four plain sheets, the runner, the husk and the spitter), and a hulking brute.
// botArt paints a sheet of BOT.rows rows by BOT.frames frames (rolling, rolling, knocked down, and the hit flash); bruteArt paints
// BRUTE.frames frames. Moved from Deadlight Hollow (grounds/art.js) unchanged.
import {painter,hash2 as hash} from '../core/paint.js';
import {EDGE,SHADOW,BONE,EMBER,W,M,R} from '../props/camp.js';
// Gadget's robots: a bedsheet over a stuffed pillow, broom-handle arms, a car battery and four shopping-cart wheels.
// The newer ones copy what is out there. One sheet holds them all: a row per robot, and four frames a row (rolling, rolling, down, and the tell).
export const BOT={w:56,h:56,ax:28,ay:52,frames:4,variants:4,rows:7,led:[9,-48.5]};
export const BOT_ROW={shambler:0,runner:4,husk:5,spitter:6};
export const BRUTE={w:96,h:88,ax:48,ay:82,frames:4};
const SHEETS=[{c:['#24303f','#33435a','#46607c','#6582a0'],dot:'#c9b9a0',arms:['broom','broom']},{c:['#3f2430','#5a3345','#7a4a60','#9c6a82'],dot:'#e2cfc6',arms:['broom','plunger']},
 {c:['#24392f','#33524a','#477368','#64968a'],dot:'#c9d6c0',arms:['mop','broom']},{c:['#3f3624','#5a4d33','#7a6a4a','#9c8a64'],dot:'#2e2418',arms:['plunger','mop']}];
const KIND_SHEET={runner:{c:['#4a2a14','#6e3e1c','#9a5a28','#c07a3a'],dot:'#f2c46a',arms:['noodle','noodle']},husk:{c:['#2e2e2a','#45443c','#5e5c50','#7a786a'],dot:'#9a968a',arms:['broom','broom']},
 spitter:{c:['#22341e','#2f4a2a','#41663a','#5a8a50'],dot:'#c9e07a',arms:['mop','plunger']}};
export const SPIT='#8fd14f';
function drawBot(g,cx,gy,v,frame,kind='shambler'){const {e,r,l,p}=g,S=KIND_SHEET[kind]||SHEETS[v%4];if(frame===2)return downBot(g,cx,gy,S,kind);
 const tell=frame===3,b=frame===1?-.5:tell?-1:0,up=frame===1?-1:0;
 e(cx,gy-1,14,4,SHADOW);
 // The chassis: a cart's bottom rack for most, a toy car for a runner.
 if(kind==='runner'){r(cx-14,gy-10,28,6,EDGE);r(cx-13.5,gy-9.5,27,5,'#b33a2a');r(cx-13.5,gy-9.5,27,1,'#d9604a');r(cx-6,gy-12,12,2.5,EDGE);r(cx-5.5,gy-11.5,11,1.5,'#2a2c31');
  for(const s of [-1,1]){const x=cx+s*9;e(x,gy-3,4.5,4.5,EDGE);e(x,gy-3,3.6,3.6,'#1f2024');e(x,gy-3,1.4,1.4,frame===1?'#c4c9ce':'#8a9096');}}
 else{r(cx-12,gy-9,24,4,EDGE);r(cx-11.5,gy-8.5,23,3,W[2]);r(cx-11.5,gy-8.5,23,.5,W[3]);
  for(const s of [-1,1]){const x=cx+s*9;r(x-1.5,gy-6,3,2,'#8a9096');r(x-1.5,gy-5,3,5,EDGE);r(x-1,gy-4.5,2,4,'#1f2024');r(x-.5,frame===1?gy-2.5:gy-4,1,1.5,'#8a9096');}}
 const lean=kind==='runner'?3:0,body=[[cx-10,gy-9],[cx-11,gy-16],[cx-10+lean,gy-26+b],[cx-7+lean,gy-31+b],[cx+7+lean,gy-31+b],[cx+10+lean,gy-26+b],[cx+11,gy-16],[cx+10,gy-9],[cx+7,gy-7],[cx+4,gy-9.5],[cx+1,gy-7],[cx-2,gy-9.5],[cx-5,gy-7],[cx-8,gy-9.5]];
 // A spitter carries its paint on its back: a jug of green and a hose to the launcher.
 if(kind==='spitter'){r(cx-16,gy-30+b,9,16,EDGE);r(cx-15.5,gy-29.5+b,8,15,'#d6d0c2');r(cx-15.5,gy-24+b,8,8,SPIT);r(cx-14,gy-32+b,4,2.5,EDGE);l(cx-11,gy-30+b,cx-4,gy-36+b,.8,'#2a2c31');}
 p(body.map(([x,y])=>[x+(x<cx?-.6:.6),y+(y<gy-20?-.6:.6)]),EDGE);p(body,S.c[2]);
 p([[cx-10+lean,gy-26+b],[cx-7+lean,gy-31+b],[cx-3+lean,gy-31+b],[cx-6,gy-9]],S.c[3]);p([[cx+5+lean,gy-31+b],[cx+7+lean,gy-31+b],[cx+10+lean,gy-26+b],[cx+11,gy-16],[cx+10,gy-9],[cx+6,gy-8]],S.c[1]);
 for(const x of [-4,2,7])r(cx+x+lean*.5,gy-24+b,.5,13,S.c[1]);for(let k=0;k<8;k++)r(cx-8+hash(k,v)*15,gy-28+b+hash(v,k)*17,1,1,S.dot);
 r(cx-11,gy-18,22,2.5,EDGE);r(cx-10.5,gy-17.5,21,1.5,'#8d9196');r(cx-10.5,gy-17.5,21,.5,'#b5b9bd');
 // Arms: up high when a shambler or a husk is about to grab you.
 const grab=tell&&(kind==='shambler'||kind==='husk');
 S.arms.forEach((a,i)=>{const s=i?1:-1,sx=cx+s*9+lean,sy=gy-25+b,hx=kind==='runner'?cx+s*8-12:grab?cx+s*15:cx+s*20,hy=kind==='runner'?gy-22+up:grab?gy-46:gy-30+up;l(sx,sy,hx,hy,2,EDGE);l(sx,sy,hx,hy,1,a==='noodle'?'#e0457b':W[3]);
  if(a==='broom'){r(hx-3,hy-6,6,7,EDGE);r(hx-2.5,hy-5.5,5,3,'#a0803a');r(hx-2.5,hy-2.5,5,3,'#c9a24a');r(hx-3,hy-3,6,.5,'#c0392b');}
  else if(a==='plunger'){e(hx+s,hy-1,3.5,3,EDGE);e(hx+s,hy-1.3,2.8,2.3,'#b33a2a');r(hx+s-1.5,hy-3,2,.5,'#d9604a');}
  else if(a==='mop')for(let k=0;k<5;k++)l(hx,hy,hx+s*(1+k*.6),hy+5+k%2,.8,k%2?'#8d9196':'#b5b9bd');});
 // The head: a pillowcase face, Xs for eyes and a stitched mouth.
 const jerk=tell&&kind==='spitter'?-3:0,hx=cx+lean+(kind==='runner'?3:0)+jerk,hy=gy-37+b+(tell&&kind==='runner'?-2:0)+(kind==='runner'?3:0);
 e(hx,hy,8.5,6.5,EDGE);e(hx,hy-.3,7.8,5.8,'#b5ad9c');e(hx-1.5,hy-2,5,3,'#d6cfbf');for(const s of [-1,1])p([[hx+s*7,hy-5],[hx+s*9.5,hy-6.5],[hx+s*8.5,hy-3.5]],'#b5ad9c');
 for(const x of [hx-3,hx+3]){l(x-1.2,hy-1.7,x+1.2,hy+.7,.6,'#1c1d22');l(x-1.2,hy+.7,x+1.2,hy-1.7,.6,'#1c1d22');}
 if(tell&&kind==='runner'){e(hx,hy+3,3.5,2.6,EDGE);e(hx,hy+3,2.8,2,'#5a1f1a');r(hx-1.5,hy+2,3,.5,'#d6cfbf');for(const s of [-1,1])for(let k=0;k<3;k++)l(hx+s*(10+k*2.5),hy-6+k*4,hx+s*(13+k*2.5),hy-7+k*4,.6,'#f2c46a');}
 else{for(let k=0;k<5;k++)r(hx-3.5+k*1.75,hy+2.5+(k%2?.5:0),1.25,.5,'#1c1d22');r(hx-4,hy+3,8,.5,'#1c1d22');}r(hx-6,hy+5,12,1.5,'#8d9196');
 // A husk wears a stock pot for a helmet and a trash-can lid strapped on as a chest plate.
 if(kind==='husk'){r(hx-9,hy-10,18,7,EDGE);r(hx-8.5,hy-9.5,17,6,'#8a8f94');r(hx-8.5,hy-9.5,17,1,'#c4c9ce');r(hx-8.5,hy-4.5,17,1,'#5c636b');r(hx-11,hy-8,2.5,2,EDGE);r(hx+8.5,hy-8,2.5,2,EDGE);
  e(cx+2,gy-19+b,9,8,EDGE);e(cx+2,gy-19.3+b,8.3,7.3,'#7a808a');ring(g,cx+2,gy-19.3+b,6,5.2,'#9aa0a6','#7a808a');ring(g,cx+2,gy-19.3+b,3.5,3,'#9aa0a6','#7a808a');e(cx+2,gy-20+b,1.5,1.2,'#c4c9ce');r(cx-6,gy-26+b,16,1,'#2a2420');}
 // A spitter's launcher: a length of drain pipe on its shoulder, glowing green just before it fires.
 if(kind==='spitter'){const tx=cx+6,ty=gy-31+b;l(tx,ty,tx+14,ty-6,3.4,EDGE);l(tx,ty,tx+14,ty-6,2.2,'#c4c9ce');e(tx+14,ty-6,2,2,EDGE);e(tx+14,ty-6,1.3,1.3,tell?'#d8ff9a':'#2a3a22');
  if(tell){e(tx+15,ty-7,4.5,4.5,'#8fd14f55');e(hx,hy+3,3,2,'#8fd14f');}}
 if(kind==='runner'){r(cx-5.5,gy-15,11,6,EDGE);r(cx-5,gy-14.5,10,5,'#2a2c31');}
 else{r(cx-5.5,gy-15,11,7,EDGE);r(cx-5,gy-14.5,10,6,'#2a2c31');r(cx-5,gy-14.5,10,.5,'#44464c');r(cx-4,gy-16,2,1.5,'#c0392b');r(cx+2,gy-16,2,1.5,'#141416');r(cx-3,gy-11.5,6,1.5,'#c9a23a');}
 l(cx+6,gy-30+b,cx+9,gy-48+b,.6,EDGE);e(cx+9,gy-48.5+b,1.2,1.2,'#5a1f1a');}
function downBot(g,cx,gy,S,kind){const {e,r,l}=g;e(cx,gy-2,20,5,SHADOW);
 r(cx+2,gy-12,20,4,EDGE);r(cx+2.5,gy-11.5,19,3,kind==='runner'?'#b33a2a':W[2]);for(const x of [cx+5,cx+17]){r(x-1.5,gy-17,3,5,EDGE);r(x-1,gy-16.5,2,4,'#1f2024');}
 e(cx-2,gy-6,15,6.5,EDGE);e(cx-2,gy-6.5,14,5.8,S.c[2]);e(cx-5,gy-8,8,3,S.c[3]);e(cx+3,gy-5,7,3,S.c[1]);for(let k=0;k<5;k++)r(cx-12+hash(k,4)*20,gy-10+hash(4,k)*6,1,1,S.dot);
 const hx=cx-19,hy=gy-5;e(hx,hy,6.5,5,EDGE);e(hx,hy-.3,5.8,4.4,'#b5ad9c');for(const x of [hx-2,hx+2]){l(x-1,hy-1.5,x+1,hy+.5,.6,'#1c1d22');l(x-1,hy+.5,x+1,hy-1.5,.6,'#1c1d22');}
 l(cx+4,gy-2,cx+24,gy-6,1.6,EDGE);l(cx+4,gy-2,cx+24,gy-6,.8,W[3]);r(cx+22,gy-10,5,6,EDGE);r(cx+22.5,gy-9.5,4,5,'#c9a24a');
 if(kind==='husk'){e(cx-22,gy+1,7,3.5,EDGE);e(cx-22,gy+.7,6.3,2.9,'#8a8f94');e(cx-22,gy,4,1.6,'#5c636b');}
 if(kind==='spitter'){e(cx+10,gy,9,3,'#5a8a3a');e(cx+10,gy-.4,7,2.2,SPIT);}}
// The brute: a laundry cart on four big casters, a stuffed mattress for a body, punching bags for arms and a bucket for a head.
// Its front is a folded mattress strapped on; its back, where the battery sits, is bare. Unflipped, it faces right.
function drawBrute(g,cx,gy,frame){const {e,r,l,p}=g,b=frame===1?-1:0,wind=frame===3,low=wind?4:0;
 if(frame===2){e(cx,gy-3,40,8,SHADOW);r(cx-30,gy-20,60,14,EDGE);r(cx-29.5,gy-19.5,59,13,'#5e5c50');r(cx-29.5,gy-19.5,59,2,'#7a786a');for(let k=0;k<5;k++)r(cx-24+k*12,gy-18,1,10,'#45443c');
  r(cx-34,gy-14,14,10,EDGE);r(cx-33.5,gy-13.5,13,9,'#2a2c31');r(cx+18,gy-26,22,18,EDGE);r(cx+18.5,gy-25.5,21,17,'#b5ad9c');for(let k=0;k<3;k++)e(cx+23+k*6,gy-17,1.2,1.2,'#8a8270');
  for(const x of [cx-24,cx+24]){e(x,gy-24,5,5,EDGE);e(x,gy-24,4,4,'#1f2024');}e(cx-42,gy-4,8,5,EDGE);e(cx-42,gy-4.5,7,4.2,'#c9622a');return;}
 e(cx,gy-2,34,7,SHADOW);
 // Casters and the cart's frame.
 for(const x of [cx-24,cx-8,cx+8,cx+24]){r(x-2,gy-12,4,4,'#8a9096');e(x,gy-4,4.5,4.5,EDGE);e(x,gy-4,3.5,3.5,'#1f2024');e(x,frame===1?gy-5:gy-3,1.2,1.2,'#8a9096');}
 r(cx-30,gy-16,60,6,EDGE);r(cx-29.5,gy-15.5,59,5,M[2]);r(cx-29.5,gy-15.5,59,1,'#c4c9ce');for(let x=cx-28;x<cx+28;x+=4)r(x,gy-14,.5,3,M[1]);
 // The mattress body, stitched and buttoned.
 const top=gy-58+b+low;r(cx-26,top,52,44-low,EDGE);r(cx-25.5,top+.5,51,43-low,'#5e5c50');r(cx-25.5,top+.5,51,2,'#7a786a');r(cx-25.5,top+.5,8,43-low,'#6e6c5e');
 for(let j=0;j<3;j++)for(let i=0;i<4;i++)e(cx-18+i*11,top+9+j*11,1.3,1,'#3a3930');for(let k=0;k<4;k++)r(cx-24+k*14,top+2,.5,40-low,'#45443c');
 // The bare back: the battery and its leads, the place to shoot.
 r(cx-34,top+16,12,16,EDGE);r(cx-33.5,top+16.5,11,15,'#2a2c31');r(cx-33.5,top+16.5,11,1,'#44464c');r(cx-32,top+14.5,3,2,'#c0392b');r(cx-26,top+14.5,3,2,'#141416');r(cx-32,top+24,8,2,'#c9a23a');l(cx-30,top+15,cx-22,top+8,.8,'#c0392b');
 // The padded front: a folded mattress strapped over the face it pushes with.
 r(cx+20,top-4,16,50-low,EDGE);r(cx+20.5,top-3.5,15,49-low,'#b5ad9c');r(cx+20.5,top-3.5,15,2,'#d6cfbf');r(cx+33,top-3.5,2.5,49-low,'#8a8270');for(let k=0;k<4;k++)e(cx+28,top+5+k*10,1.2,1.2,'#8a8270');
 for(const y of [top+8,top+30-low]){r(cx+18,y,20,3,EDGE);r(cx+18.5,y+.5,19,2,'#3a3d44');r(cx+26,y,3,3,'#c4c9ce');}
 // Punching-bag arms, low and swinging when it rolls, braced back when it paws the floor before a charge.
 for(const [sx,sy,ax,ay] of wind?[[cx-16,top+16,cx-30,top+40],[cx+12,top+16,cx+30,top+44]]:[[cx-16,top+14,cx-26,top+38+b],[cx+12,top+14,cx+38,top+30-b]]){l(sx,sy,ax,ay-8,2.4,EDGE);l(sx,sy,ax,ay-8,1.2,'#8a8f94');r(ax-5,ay-10,10,14,EDGE);r(ax-4.5,ay-9.5,9,13,'#b33a2a');r(ax-4.5,ay-9.5,9,2,'#d9604a');r(ax-4.5,ay-3,9,1,'#5a1f1a');}
 // A bucket for a head, eyes painted on; they go red when it is about to charge.
 const hx=cx+6,hy=top-6;p([[hx-11,hy-10],[hx+11,hy-10],[hx+9,hy+6],[hx-9,hy+6]],EDGE);p([[hx-10.5,hy-9.5],[hx+10.5,hy-9.5],[hx+8.5,hy+5.5],[hx-8.5,hy+5.5]],'#c9622a');r(hx-10.5,hy-9.5,21,2,'#e07a3a');r(hx-9,hy+3,18,1,'#a54e22');
 l(hx-11,hy-6,hx-14,hy+2,.8,'#8a8f94');l(hx+11,hy-6,hx+14,hy+2,.8,'#8a8f94');
 for(const x of [hx-4,hx+5]){r(x-2,hy-4,4,3,EDGE);r(x-1.5,hy-3.5,3,2,wind?'#ff4a3a':'#1c1d22');}r(hx-5,hy+1,12,1,'#1c1d22');
 if(wind)for(let k=0;k<4;k++){const x=cx-30+k*20;r(x,gy-1+(k%2),6,.8,'#8a7a5a');r(x+2,gy+1,3,.6,'#8a7a5a');}
 l(cx-12,top,cx-16,top-18,.8,EDGE);e(cx-16,top-18.5,1.5,1.5,'#5a1f1a');}
const ROW_KIND=['shambler','shambler','shambler','shambler','runner','husk','spitter'];
export function botArt(c){c.save();c.scale(2,2);const g=painter(c);for(let v=0;v<BOT.rows;v++)for(let f=0;f<BOT.frames;f++){c.save();c.translate(f*BOT.w,v*BOT.h);
  // Runners are smaller: a toy car under a cut-down sheet.
  if(ROW_KIND[v]==='runner'){c.translate(BOT.ax,BOT.ay);c.scale(.85,.85);c.translate(-BOT.ax,-BOT.ay);}drawBot(g,BOT.ax,BOT.ay,v,f,ROW_KIND[v]);c.restore();}c.restore();}
export function bruteArt(c){c.save();c.scale(2,2);const g=painter(c);for(let f=0;f<BRUTE.frames;f++){c.save();c.translate(f*BRUTE.w,0);drawBrute(g,BRUTE.ax,BRUTE.ay,f);c.restore();}c.restore();}
export {drawBot,drawBrute,ROW_KIND};
const ring=(g,cx,cy,rx,ry,col,bg)=>{g.e(cx,cy,rx,ry,col);g.e(cx,cy,rx-.6,ry-.6,bg);};
