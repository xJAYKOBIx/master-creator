// What the special dead leave in a fight: a spitter's acid (the glob in the air and the pool it leaves, bubbling as it eats into the
// ground), a bloater's gas (puffs of a sour green cloud that hang and drift) and the ring of a screamer's scream. World units on 2x
// canvases, centred on the spot, like the blood in gore.js.
import {painter,hash2,bayer} from '../core/paint.js';
// Acid from the dark edge in to the shine, and the gas's three greens.
export const ACID=['#1c2608','#2e3d0c','#5c7a12','#9ad13a','#e2ff8a'],GAS=['#4a5a1e','#7d9a2c','#b8d060'];
const INK='#111319';
// The pool: ACID_BOX units, an uneven puddle with a scorched rim, a few blobs round it and bubbles that rise and pop over its four
// frames. fade 0 to 1 dries it to a stain.
export const ACID_BOX={w:56,h:32,frames:4};
export function acidArt(c,seed=0,frame=0,fade=0){const g=painter(c),{r,e}=g,h=k=>hash2(seed,k),A=ACID;c.save();c.scale(2,2);c.translate(ACID_BOX.w/2,ACID_BOX.h/2);
 const blob=(x,y,s,lit)=>{e(x,y,s*1.2+.5,s*.7+.5,fade>.6?'#1a1c12':A[0]);e(x,y,s,s*.58,fade>.6?A[0]:A[1]);if(fade<.6){e(x-s*.1,y-s*.08,s*.72,s*.4,A[2]);if(lit)e(x-s*.2,y-s*.15,s*.4,s*.2,A[3]);}};
 // A scorched ring first, under everything.
 for(let k=0;k<14;k++){const t=k/14*Math.PI*2,d=12+h(k+90)*5;e(Math.cos(t)*d,Math.sin(t)*d*.55,3+h(k+70)*2,1.6+h(k+80),'#16180f');}
 blob(0,0,11+h(1)*2,true);for(let k=0;k<7;k++){const t=h(k+2)*Math.PI*2,d=8+h(k+9)*8;blob(Math.cos(t)*d,Math.sin(t)*d*.55,1.5+h(k+20)*3,k<3);}
 if(fade<.6){
  // Bubbles: each rises over a frame or two and pops into a ring.
  for(let k=0;k<6;k++){const x=(h(k+40)-.5)*16,y=(h(k+50)-.5)*7,life=(frame+Math.floor(h(k+60)*4))%4;if(life===0){e(x,y,.8,.5,A[3]);}else if(life===1){e(x,y,1.3,.9,A[3]);r(x-.5,y-.5,.5,.5,A[4]);}else if(life===2){e(x,y,1.6,1,A[1]);e(x,y,1,.6,A[2]);}}
  r(-4,-2,2,.5,A[4]);r(-4.5,-2,.5,.5,'#f7ffd8');}
 c.restore();}
// The glob in flight: GLOB units square, a wobbling drop with a tail that streams behind it (angle is the way it is going).
export const GLOB={w:16,h:16};
export function globArt(c,frame=0,angle=0){const g=painter(c),{r,e,l}=g,A=ACID;c.save();c.scale(2,2);c.translate(GLOB.w/2,GLOB.h/2);const bx=-Math.cos(angle),by=-Math.sin(angle),w=frame%2?.3:0;
 l(0,0,bx*6,by*6,2,A[1]);l(bx*5,by*5,bx*7.5,by*7.5,1,A[1]);e(0,0,3+w,2.6-w,INK);e(0,0,2.5+w,2.1-w,A[2]);e(-.6,-.6,1.4,1,A[3]);r(-1,-1,.5,.5,A[4]);c.restore();}
// One puff of the bloater's gas: GAS_BOX units, a soft lumpy cloud, dithered at its edge so it reads as thin, in one of the greens.
export const GAS_BOX={w:48,h:36};
export function gasArt(c,seed=0,shade=1){const W=GAS_BOX.w*2,H=GAS_BOX.h*2,img=c.createImageData(W,H),d=img.data,h=k=>hash2(seed,k),col=GAS[shade]||GAS[1],[R,G,B]=[1,3,5].map(i=>parseInt(col.slice(i,i+2),16));
 const lumps=Array.from({length:6},(_,k)=>({x:W/2+(h(k)-.5)*W*.45,y:H/2+(h(k+10)-.5)*H*.35,r:W*(.16+h(k+20)*.12)}));
 for(let y=0;y<H;y+=1)for(let x=0;x<W;x+=1){let f=0;for(const q of lumps){const dx=(x-q.x)/q.r,dy=(y-q.y)/(q.r*.8),v=1-(dx*dx+dy*dy);if(v>0)f=Math.max(f,v);}if(f<=0)continue;
  // Two pixels to a world half-unit, so the dither steps in half units like the rest of the art.
  const a=Math.min(1,f*1.6),i=(y*W+x)*4;if(a<bayer(x>>1,y>>1))continue;const lit=f>.55?1.15:1;d[i]=Math.min(255,R*lit);d[i+1]=Math.min(255,G*lit);d[i+2]=Math.min(255,B*lit);d[i+3]=Math.round(150+80*Math.min(1,f));}
 c.putImageData(img,0,0);}
