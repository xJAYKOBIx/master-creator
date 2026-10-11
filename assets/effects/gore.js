// Zombie gore for a fight: a body blown in two at the waist, a head knocked clean off, the top half that keeps crawling, the chunks
// a blast throws and the blood they leave on the ground and up the walls. The pieces are cut out of the zombie's own frame along a
// ragged line, so every look, facing and body comes apart the same way, and the wound is painted along the cut.
// Pieces and crawl frames are canvas pixels on the 2x frame (160 × 192, foot at 80, 170); gibs and blood are world units on 2x canvases.
import {canvas} from '../core/kit.js';
import {painter,hash2} from '../core/paint.js';
import {survivor,FRAME} from '../characters/character.js';
import {SKIN_TONES,rotRamp} from '../characters/palette.js';
// Where a body comes apart, in frame pixels: the waist and the neck, broken up by this much either way.
export const CUT={waist:120,neck:69,rag:3};
export const GORE_PARTS=['upper','lower','head','headless'];
// Fresh blood, wetter and redder than the dried grime palette, from the dark edge in to the shine; raw flesh, gut and bone.
export const GORE={blood:['#2a0709','#4e0c0f','#741416','#9a2220','#c0463a'],flesh:['#5c1a1c','#8f3530','#b65a4c','#d58a78'],gut:['#6e3434','#a8524c','#c97a6a'],bone:['#a3977a','#d8cdb0','#efe6cc']};
const INK='#111319',hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
// Where the cut crosses column x: the base row, broken a little every two pixels and a little more every eight.
const cutRow=(x,base,seed)=>base+Math.round((hash2(x>>1,seed)-.5)*CUT.rag*2)+Math.round((hash2(x>>3,seed+7)-.5)*CUT.rag*1.4);
function frameOf(look,direction,frame){const S=canvas(FRAME.w,FRAME.h),s=S.getContext('2d');s.imageSmoothingEnabled=false;s.save();s.scale(2,2);survivor(s,direction,frame,false,{...look,zombie:1});s.restore();return S;}
// One piece of a zombie, in its own frame (so it lines up with the whole body it came from): 'upper' and 'lower' are the two
// halves, 'head' and 'headless' the head and the rest. The open end gets a dark rim, raw meat and a stub of spine; the top half
// trails gut and the neck a drip or two.
export function zombiePiece(c,look,direction=2,part='upper',frame=0,seed=1){const S=frameOf(look,direction,frame),s=S.getContext('2d'),W=FRAME.w,H=FRAME.h,img=s.getImageData(0,0,W,H),d=img.data;
 const top=part==='upper'||part==='head',base=part==='upper'||part==='lower'?CUT.waist:CUT.neck,rows=[];
 const set=(x,y,h)=>{if(x<0||y<0||x>=W||y>=H)return;const i=(y*W+x)*4,[r,g,b]=hex(h);d[i]=r;d[i+1]=g;d[i+2]=b;d[i+3]=255;},a=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&d[(y*W+x)*4+3]>0;
 // The cut: what is past it goes, and the edge of what stays turns to wound, deepest at the very edge.
 const span=[];for(let x=0;x<W;x++){const y0=cutRow(x,base,seed);rows[x]=y0;if(a(x,y0))span.push(x);
  for(let y=0;y<H;y++){if(!a(x,y))continue;const k=top?y0-y:y-y0+1;if(k<=0){d[(y*W+x)*4+3]=0;continue;}const h=hash2(x*3+y,seed);
   if(k<=1)set(x,y,GORE.blood[0]);else if(k<=3)set(x,y,h<.3?GORE.flesh[2]:h<.7?GORE.blood[3]:GORE.blood[2]);else if(k<=5&&h<.5)set(x,y,h<.2?GORE.blood[1]:GORE.blood[2]);}}
 // The middle of the body at the cut (the longest run of pixels across it near the centre), for the spine and the gut.
 let best=[W/2,W/2];for(let i=0;i<span.length;){let j=i;while(j+1<span.length&&span[j+1]===span[j]+1)j++;const [l,r]=[span[i],span[j]];if(r-l>best[1]-best[0]&&l<W/2+12&&r>W/2-12)best=[l,r];i=j+1;}
 const [L,R]=best,cx=Math.round((L+R)/2),wide=R-L;
 if(wide>3){
  // A stub of spine standing out of the meat.
  const out=part==='head'?3:part==='headless'?4:part==='upper'?3:5;for(let t=0;t<out;t++)for(const dx of [-1,0]){const y=top?rows[cx+dx]+t:rows[cx+dx]-1-t;set(cx+dx,y,t===out-1?GORE.bone[0]:dx?GORE.bone[1]:GORE.bone[2]);}
  // The top half trails gut: a few strands of different lengths hanging out of the cut, each with a knot at the end.
  if(part==='upper')for(let k=0,n=2+Math.floor(hash2(seed,5)*3);k<n;k++){const x=Math.round(L+2+hash2(k,seed+3)*(wide-4));if(Math.abs(x-cx)<2)continue;const len=3+Math.floor(hash2(seed+k,9)*8);
   for(let t=0;t<len;t++){const y=rows[x]+t,w=t>len-3?2:1;set(x,y,t%3?GORE.gut[1]:GORE.gut[0]);if(w>1)set(x+1,y,GORE.gut[2]);}set(x,rows[x]+len,INK);set(x+1,rows[x]+len,GORE.gut[0]);}
  // Meat bulging over the bottom half's cut, and the neck's drips.
  if(part==='lower')for(let x=L+1;x<R;x++)if(hash2(x,seed+11)<.45)set(x,rows[x]-1,hash2(x,seed)<.5?GORE.flesh[1]:GORE.flesh[2]);
  if(part==='head'||part==='headless')for(let k=0;k<2;k++){const x=Math.round(L+1+hash2(k,seed+13)*(wide-2)),len=2+Math.floor(hash2(seed,k+17)*3);for(let t=0;t<len;t++)set(x,top?rows[x]+t:rows[x]-1-t,t===len-1?GORE.blood[3]:GORE.blood[2]);}}
 s.putImageData(img,0,0);c.drawImage(S,0,0);}
// The top half after it lands: dragging itself along the ground by its arms. Frames are a bigger box than a standing frame, since
// the body lies along the ground; its point on the ground (the chest) is at (CRAWL.x, CRAWL.y). Frames 0 to 3 are the drag; the
// mirrored facings reuse the right-facing art. Lying flat, a body's length up the screen is foreshortened, as with the dive.
export const CRAWL={w:192,h:128,x:96,y:84,frames:4};
const CHEST=96,SQUASH=.62;
export function crawlArt(c,look,direction=0,frame=0,seed=1){const dir=((direction%8)+8)%8,flip=dir===3||dir===4||dir===5,d=flip?(dir===4?0:dir===3?1:7):dir;
 const a=d*Math.PI/4,P=canvas(FRAME.w,FRAME.h),p=P.getContext('2d');p.imageSmoothingEnabled=false;zombiePiece(p,look,6,'upper',0,seed);
 // The sleeve's colour, from the coat just in from the body's edge at the shoulder.
 const row=p.getImageData(0,88,FRAME.w,1).data;let sleeve='#3a3f4a';for(let x=0;x<FRAME.w;x++)if(row[x*4+3]){const i=(x+3)*4;sleeve=`rgb(${row[i]},${row[i+1]},${row[i+2]})`;break;}
 const f=frame%CRAWL.frames,reach=[0,1,2,1][f],pull=[0,.5,1,.5][f],fx=Math.cos(a),fy=Math.sin(a)*SQUASH,sx=-Math.sin(a),sy=Math.cos(a)*SQUASH;
 c.save();c.imageSmoothingEnabled=false;c.translate(CRAWL.x,CRAWL.y);if(flip)c.scale(-1,1);
 // A smear of blood behind it, along the way it has come (in world units from here, like the rest of a frame's art).
 c.save();c.scale(2,2);const g=painter(c);for(let t=8;t<30;t+=.5){const w=Math.max(1,5-t/6),j=(hash2(t*2|0,seed)-.5)*1.5;g.r(-fx*t+sx*j-w/2,-fy*t+sy*j-w*.3,w,w*.6,t>20?GORE.blood[0]:GORE.blood[1]);}c.restore();
 // The body: the back of the top half laid out along the facing, pulled forward a little at the end of each drag.
 c.save();c.scale(1,SQUASH);c.rotate(a+Math.PI/2);c.translate(0,-pull*2);c.drawImage(P,-FRAME.w/2,-CHEST);c.restore();
 // Both arms out ahead of the head, clawing in turn: the reaching one long, the pulling one short beside the shoulder.
 c.save();c.scale(2,2);const skin=rotRamp((SKIN_TONES[look.skin]||SKIN_TONES[0]).ramp,look.rot||0,look.decay??1);const arm=(side,len)=>{const ox=sx*side*11,oy=sy*side*11-1,bx=ox+fx*10,by=oy+fy*10,hx=ox+fx*(10+len)-sx*side*3,hy=oy+fy*(10+len)-sy*side*3;
  const mx=(bx+hx)/2,my=(by+hy)/2;g.l(bx,by,hx,hy,4,INK);g.l(bx,by,mx,my,2.5,sleeve);g.l(mx,my,hx,hy,2,skin[2]);g.r(hx-2,hy-2,4,4,INK);g.r(hx-1.5,hy-1.5,3,3,skin[0]);g.r(hx-1.5,hy-1.5,1.5,.5,skin[1]);};
 arm(-1,20+reach*7);arm(1,34-reach*7);c.restore();
 c.restore();}
// Chunks a blast throws: meat, a rib, a bone, gut, a hand, a scrap of clothing (in col) and a bit of scalp. Each fits in 10 × 10
// units round its middle and comes in a few shapes by seed. They tumble in the air, so they have no facing.
export const GIBS=['meat','rib','bone','gut','hand','cloth','scalp'];
export function gibArt(c,kind='meat',seed=0,col='#4c5566'){const g=painter(c),{r,p}=g,h=k=>hash2(seed,k);c.save();c.scale(2,2);c.translate(5,5);
 const blob=(n,s,fill,edge=INK)=>{const pts=[];for(let i=0;i<n;i++){const t=i/n*Math.PI*2,k=s*(.7+h(i)*.5);pts.push([Math.cos(t)*k,Math.sin(t)*k*.8]);}p(pts.map(([x,y])=>[x*1.25,y*1.25]),edge);p(pts,fill);return pts;};
 if(kind==='meat'){blob(7,2.6,GORE.flesh[1]);r(-1,-1,1.5,1,GORE.flesh[2]);r(.5,0,1,.5,GORE.flesh[3]);r(-1.5,1,1,.5,GORE.blood[1]);}
 else if(kind==='rib'){for(let i=0;i<3;i++){const y=-2+i*1.8;r(-3.5,y-.5,7,1.5,INK);r(-3,y,6,.5,GORE.bone[1]);r(-3,y+.5,6,.5,GORE.bone[0]);}r(-1,-3,2,6,INK);r(-.5,-2.5,1,5,GORE.flesh[1]);}
 else if(kind==='bone'){r(-3.5,-1,7,2,INK);r(-3,-.5,6,1,GORE.bone[1]);r(-4,-1.5,1.5,3,INK);r(2.5,-1.5,1.5,3,INK);r(-3.5,-1,1,2,GORE.bone[2]);r(3,-1,.5,2,GORE.bone[1]);r(-1,0,2,.5,GORE.bone[0]);}
 else if(kind==='gut'){const n=4+Math.floor(h(1)*3);for(let i=0;i<n;i++){const x=-3+i*1.4,y=Math.sin(i*1.7+h(2)*3)*1.4;r(x-.5,y-.5,2,2,INK);}for(let i=0;i<n;i++){const x=-3+i*1.4,y=Math.sin(i*1.7+h(2)*3)*1.4;r(x,y,1,1,i%2?GORE.gut[1]:GORE.gut[2]);}}
 else if(kind==='hand'){p([[-2.5,-2],[1,-2.5],[2,-1],[3.5,-1.5],[3.5,0],[2,.5],[3,2],[1.5,2.5],[-2.5,2]],INK);p([[-2,-1.5],[1,-2],[1.5,-.5],[3,-1],[3,-.5],[1.5,.5],[2.5,2],[1.5,2],[-2,1.5]],'#a8b39a');r(-2.5,-1.5,1,3,GORE.blood[2]);r(-2,-1,.5,2,GORE.flesh[2]);}
 else if(kind==='cloth'){p([[-3,-2],[2,-2.5],[3.5,0],[1,2.5],[-2,2],[-3.5,.5]],INK);p([[-2.5,-1.5],[2,-2],[3,0],[1,2],[-2,1.5],[-3,.5]],col);r(-1,-.5,2,.5,GORE.blood[2]);r(.5,.5,1.5,.5,GORE.blood[1]);}
 else{blob(6,2.4,GORE.flesh[2]);r(-2,-2,3,1,'#3a2c24');r(-1.5,-1.5,2,1,'#5a4434');r(.5,.5,1,.5,GORE.blood[2]);}
 c.restore();}
// Blood: a pool where a body comes to rest, a splash thrown one way from a hit (direction 0 to 7), a scatter of drops, a drag mark
// and a splatter up a wall. Drawn in world units round (0, 0) on a 2x canvas (so 80 × 48 units fits every kind), and painted from
// a seed so each one is its own shape.
export const BLOOD_KINDS=['pool','splash','drops','smear','wall'];export const BLOOD_BOX={w:80,h:48};
export function bloodArt(c,kind='pool',seed=0,direction=0){const g=painter(c),{r,e}=g,B=GORE.blood,h=k=>hash2(seed,k),a=direction*Math.PI/4,dx=Math.cos(a),dy=Math.sin(a)*.6;c.save();c.scale(2,2);c.translate(BLOOD_BOX.w/2,BLOOD_BOX.h/2);
 const puddle=(x,y,s,lit=true)=>{e(x,y,s*1.15,s*.7,B[0]);e(x,y,s,s*.6,B[1]);e(x-s*.15,y-s*.1,s*.7,s*.4,B[2]);if(lit){r(x-s*.4,y-s*.3,Math.max(.5,s*.25),.5,B[3]);r(x-s*.45,y-s*.3,.5,.5,B[4]);}};
 if(kind==='pool'){puddle(0,0,9+h(1)*4);for(let k=0;k<6;k++){const t=h(k+2)*Math.PI*2,d=7+h(k+9)*6;puddle(Math.cos(t)*d,Math.sin(t)*d*.6,2+h(k+20)*3,false);}}
 else if(kind==='splash'){for(let k=0;k<3;k++){const t=a+(h(k+70)-.5)*.5,len=6+h(k+80)*14;for(let q=2;q<len;q+=.5)r(Math.cos(t)*q,Math.sin(t)*q*.6,.5,.5,q<len*.6?B[2]:B[1]);e(Math.cos(t)*len,Math.sin(t)*len*.6,.8,.5,B[1]);}
  for(let k=0;k<22;k++){const d=2+h(k+2)*30,t=a+(h(k+30)-.5)*(.5+d/30),s=Math.max(.5,(1.9-d/20)*(.6+h(k+50)*.8)),x=Math.cos(t)*d,y=Math.sin(t)*d*.6;if(s>1){e(x,y,s,s*.6,B[1]);r(x-.25,y-.25,.5,.5,B[2]);}else r(x,y,.5,.5,h(k+60)<.5?B[1]:B[2]);}}
 else if(kind==='drops'){for(let k=0;k<12;k++){const t=h(k)*Math.PI*2,d=h(k+40)*14,s=.5+h(k+60)*1.4;const x=Math.cos(t)*d,y=Math.sin(t)*d*.6;if(s>1)e(x,y,s,s*.6,B[1]);else r(x,y,.5,.5,B[2]);}}
 else if(kind==='smear'){for(let t=-24;t<24;t+=.5){const k=1-Math.abs(t)/24,w=1+k*3.5,j=Math.sin(t*.3+h(1)*6)*1.2,x=dx*t-dy*j,y=dy*t+dx*j;r(x-w/2,y-w*.3,w,w*.6,k>.6?B[2]:B[1]);}for(let k=0;k<4;k++){const t=(h(k)-.5)*40;r(dx*t+(h(k+5)-.5)*6,dy*t+3+h(k+7)*2,1,.5,B[0]);}}
 else{e(0,0,5+h(1)*3,4+h(2)*2,B[1]);e(-.5,-.5,3+h(1)*2,2.5+h(2),B[2]);for(let k=0;k<10;k++){const t=h(k+3)*Math.PI*2,d=5+h(k+13)*12;e(Math.cos(t)*d,Math.sin(t)*d*.8,.6+h(k+23)*1.2,.6+h(k+23),B[1]);}
  for(let k=0,n=3+Math.floor(h(4)*3);k<n;k++){const x=-5+h(k+33)*10,len=4+h(k+43)*12;r(x,0,.5+(k%2)*.5,len,B[1]);e(x+.25,len,1,.8,B[1]);}r(-2,-2,1,.5,B[3]);}
 c.restore();}
