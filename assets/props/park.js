// Park and ball-field props for the suburbs: benches, a picnic table, a playground set, a footbridge over the creek, a gazebo, a
// pond, boulders, cattails and park bins; and at the ball fields, bleachers, a backstop, light towers, a snack stand and dugouts.
// Same conventions as the street set: footprint top left at (0, 0), height rising into negative y, the top of a thing seen from
// above and its south face seen face on. Flat pieces (the footbridge and the pond) lie on the ground.
import {hash2 as hash} from '../core/paint.js';
import {EDGE,SHADOW} from './camp.js';
// What the park is made of, dark to light: weathered wood, iron, galvanised aluminium, painted block, water, mud, moss, stone,
// and the playground's faded primaries.
const WD=['#231b15','#33281f','#46382b','#5a4837','#6e5a46'],IR=['#141519','#22242a','#33363c','#4a4d54'],AL=['#383c42','#555a62','#727881','#90969f','#aab0b8'];
const BK=['#33322e','#44433e','#57554f','#6a6760','#7c7970'],WT=['#0b1318','#0f1b21','#14232b','#1b2e38'],MUD=['#201a14','#2c251c','#3a3126','#4a3e30'];
const MOSS=['#1d281a','#283722','#36482b','#455a37'],ST=['#25262a','#34363c','#45484f','#585b64','#6c7079'],WH=['#6e6c66','#94928a','#b4b2aa','#cbc9c1'];
const RED=['#45201e','#62302b','#7a403a','#90544a'],BLU=['#1d283a','#2a3a52','#394c6a','#4b6080'],YEL=['#574820','#76622c','#907c3c','#a6914e'],GRN=['#1d2e22','#29402f','#36533d','#46664c'];
const GLOW='#fff4d6',DARKGLASS='#24282e',LANTERN='#e8b45a';
// A polygon grown outward by d, for the dark edge round a shape: each corner moves out along both its edges' normals.
const nrm=(a,b,s)=>{const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1;return [dy/L*s,-dx/L*s];};
function grow(pts,d){const n=pts.length;let A=0;for(let i=0;i<n;i++){const [x1,y1]=pts[i],[x2,y2]=pts[(i+1)%n];A+=x1*y2-x2*y1;}const s=A>0?1:-1;
 return pts.map((v,i)=>{const n1=nrm(pts[(i+n-1)%n],v,s),n2=nrm(v,pts[(i+1)%n],s),k=Math.max(.35,1+n1[0]*n2[0]+n1[1]*n2[1]);return [v[0]+(n1[0]+n2[0])/k*d,v[1]+(n1[1]+n2[1])/k*d];});}
const op=(g,pts,col)=>{g.p(grow(pts,.5),EDGE);g.p(pts,col);};// an outlined polygon
const ob=(g,x,y,w,h,col)=>{g.r(x-.5,y-.5,w+1,h+1,EDGE);g.r(x,y,w,h,col);};// an outlined rectangle
const mix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
// Chain-link mesh on an upright panel: the panel's foot runs from (x0, y0) to (x1, y1) on the ground and it rises H. The wire runs
// in two diagonals so it reads as diamonds, thin and see-through like the street set's fence.
function mesh(g,x0,y0,x1,y1,H,col,step=4){const len=Math.hypot(x1-x0,y1-y0),at=(s,v)=>[x0+(x1-x0)*s/len,y0+(y1-y0)*s/len-v];
 for(let c=-H+step/2;c<len;c+=step){const a=Math.max(0,c),b=Math.min(len,H+c);if(b>a){const p=at(a,a-c),q=at(b,b-c);g.l(p[0],p[1],q[0],q[1],.5,col);}}
 for(let c=step/2;c<len+H;c+=step){const a=Math.max(0,c-H),b=Math.min(len,c);if(b>a){const p=at(a,c-a),q=at(b,c-b);g.l(p[0],p[1],q[0],q[1],.5,col);}}}
// A regular octagon with flat sides north, south, east and west, its flats k × (rx, ry) from (cx, cy).
const oct=(cx,cy,rx,ry)=>Array.from({length:8},(_,i)=>{const a=(i+.5)/8*Math.PI*2,c=1/Math.cos(Math.PI/8);return [cx+Math.cos(a)*rx*c,cy+Math.sin(a)*ry*c];});
// Rock silhouettes for the boulder, as (across, down) fractions of its picture.
const ROCKS=[[[.05,.75],[0,.55],[.1,.3],[.3,.08],[.55,0],[.8,.1],[.97,.35],[1,.62],[.93,.86],[.7,1],[.3,1],[.12,.94]],
 [[0,.82],[.06,.45],[.2,.15],[.42,0],[.62,.04],[.76,.25],[.95,.44],[1,.76],[.88,.97],[.5,1],[.15,.98]],
 [[0,.86],[.04,.6],[.18,.42],[.45,.3],[.74,.28],[.95,.44],[1,.7],[.94,.93],[.6,1],[.2,1]]];
export const PARK_ART={
 // A park bench along its length: three slats in the back, three in the seat, cast-iron ends standing proud of the wood.
 bench(g,o){const {r,e}=g,w=o.w,h=o.h,z=o.z,sz=Math.round(z*.5),y0=1,y1=h-2,st=y0-sz,sb=y1-sz,bt=y0-z,bb=y0-sz-1.5,sh=(bb-bt)/3;
  e(w/2,h-1.5,w/2+2,3,SHADOW);
  // The back: three slats on the iron uprights, lit along their tops.
  r(-.5,bt-.5,w+1,bb-bt+1,EDGE);for(let k=0;k<3;k++){const y=bt+k*sh;r(0,y,w,sh-.75,WD[3]);r(0,y,w,.5,WD[4]);r(0,y+sh-1.25,w,.5,WD[2]);}
  // The seat: three slats seen from above, its front edge in shade, and the dark under it.
  r(-.5,st-.5,w+1,sb-st+2.5,EDGE);const ss=(sb-st)/3;for(let k=0;k<3;k++){r(0,st+k*ss,w,ss-.5,WD[3]);r(0,st+k*ss,w,.5,WD[4]);}r(0,sb,w,1.5,WD[1]);
  // The iron ends: an upright from the top of the back to the front foot, with a rolled armrest.
  for(const x of [1,w-3.5]){r(x-.5,bt-1.5,3.5,y1-bt+2.5,EDGE);r(x,bt-1,2.5,sb-bt+2.5,IR[2]);r(x,bt-1,.75,sb-bt+2.5,IR[3]);r(x,sb+1.5,2.5,y1-sb-1,IR[1]);r(x-1,st-5,4.5,2.5,EDGE);r(x-.5,st-4.5,3.5,1.5,IR[3]);}},
 // A wooden picnic table: the far bench peeking past the ends of the top, the plank top on its A-frame legs, the near bench.
 picnic(g,o){const {r,e,l}=g,w=o.w,h=o.h,z=o.z,bz=Math.round(z*.55),d=Math.round(h*.18),ty0=d+3,ty1=h-d-3,tt=ty0-z,tb=ty1-z;
  e(w/2,h/2+3,w/2+2,h/2-3,SHADOW);
  const benchAt=(y0,yb)=>{const t=y0-bz,b=yb-bz;r(-.5,t-.5,w+1,b-t+2.5,EDGE);r(0,t,w,b-t,WD[3]);r(0,t,w,.5,WD[4]);r(0,(t+b)/2,w,.5,WD[1]);r(0,b,w,1.5,WD[1]);
   for(const x of [4,w-6])ob(g,x,b+1.5,2,yb-b-1.5,WD[1]);};
  benchAt(1,1+d);
  // The A-frames under the top, and the brace from them to the benches.
  for(const x of [10,w-10]){for(const s of [-1,1]){l(x,tb+1,x+s*5,ty1,2.5,EDGE);l(x,tb+1,x+s*5,ty1,1.5,WD[2]);}r(x-6,(tb+ty1)/2+2,12,2,EDGE);r(x-5.5,(tb+ty1)/2+2.5,11,1,WD[2]);}
  // The top: planks along its length with gaps between, the front edge in shade.
  const L=4,R=w-4;r(L-.5,tt-.5,R-L+1,tb-tt+2.5,EDGE);const n=4,ph=(tb-tt)/n;for(let k=0;k<n;k++){const y=tt+k*ph;r(L,y,R-L,ph-.5,k%2?WD[3]:WD[2]);r(L,y,R-L,.5,WD[4]);}
  for(let i=0;i<4;i++)r(L+4+hash(i,o.x|0)*(R-L-12),tt+1+hash(o.y|0,i)*(tb-tt-2),4,.5,WD[1]);r(L,tb,R-L,1.5,WD[1]);
  benchAt(ty1+2,h-1);},
 // A playground set: a little wooden tower with a peaked red roof, a yellow slide down its west side and a ladder up the front, and
 // a blue swing frame with two swings to the east. Everything faded.
 playset(g,o){const {r,p,e,l}=g,w=o.w,h=o.h,z=o.z,tx0=Math.round(w*.37),tx1=Math.round(w*.63),ty0=Math.round(h*.28),ty1=Math.round(h*.8),dz=Math.round(z*.44),ez=Math.round(z*.76);
  e(w/2,h*.62,w/2+4,h*.32,SHADOW);
  // The swing frame: a top bar on two A-frames, the legs splayed so each end reads as an A, and two swings on chains.
  const sx0=Math.round(w*.68),sx1=w-4,bz=Math.round(z*.78),sy=Math.round(h*.55),by=sy-bz,fb=Math.round(h*.22),ff=h-3;
  for(const x of [sx0,sx1]){l(x,by,x+3,fb,3,EDGE);l(x,by,x+3,fb,2,BLU[1]);}
  r(sx0-2,by-1.5,sx1-sx0+4,3.5,EDGE);r(sx0-1.5,by-1,sx1-sx0+3,2.5,BLU[2]);r(sx0-1.5,by-1,sx1-sx0+3,.75,BLU[3]);
  for(const k of [.3,.7]){const x=sx0+(sx1-sx0)*k,sz=Math.round(z*.14),syy=sy-sz;l(x-3,by+1,x-3.5,syy,.6,AL[2]);l(x+3,by+1,x+3.5,syy,.6,AL[2]);ob(g,x-5,syy-.5,10,2.5,'#2a2b2e');r(x-5,syy-.5,10,.5,'#44464b');e(x,sy+2,6,1.5,SHADOW);}
  for(const x of [sx0,sx1]){l(x,by,x-3,ff,3,EDGE);l(x,by,x-3,ff,2,BLU[2]);l(x-.5,by,x-3.5,ff,.6,BLU[3]);}
  // The tower: posts from the ground, the deck at dz with its skirt, a green rail panel on the front, posts on up to the roof.
  const dt=ty0-dz,db=ty1-dz,P=(x,y0,y1)=>{ob(g,x-1.5,y0,3,y1-y0,WD[2]);r(x-1.5,y0,1,y1-y0,WD[3]);};
  r(tx0,db+3,tx1-tx0,ty1-db-3,'#00000030');P(tx0+1.5,dt,ty0);P(tx1-1.5,dt,ty0);
  r(tx0-.5,dt-.5,tx1-tx0+1,db-dt+4,EDGE);r(tx0,dt,tx1-tx0,db-dt,WD[3]);for(let x=tx0+4;x<tx1;x+=4)r(x,dt,.5,db-dt,WD[2]);r(tx0,db,tx1-tx0,3,WD[1]);r(tx0,db,tx1-tx0,.5,WD[4]);
  P(tx0+1.5,db+3,ty1);P(tx1-1.5,db+3,ty1);
  // The ladder up the front: two rails and rungs.
  const lx=(tx0+tx1)/2;for(const s of [-5,5]){r(lx+s-1,db+2.5,2,ty1-db-2.5,EDGE);r(lx+s-.5,db+3,1,ty1-db-3,WD[3]);}for(let y=db+7;y<ty1-2;y+=6){r(lx-5,y-.5,10,2,EDGE);r(lx-4.5,y,9,1,WD[4]);}
  const rt=ty1-dz-Math.round(z*.12),ey=ty1-ez;P(tx0+1.5,ey,db);P(tx1-1.5,ey,db);
  r(tx0+3,rt-.5,tx1-tx0-6,db-rt+.5,EDGE);r(tx0+3.5,rt,tx1-tx0-7,db-rt-.5,GRN[2]);r(tx0+3.5,rt,tx1-tx0-7,.75,GRN[3]);for(let x=tx0+8;x<tx1-5;x+=5)r(x,rt+2,1.5,db-rt-3,GRN[1]);
  // The slide: a yellow chute from the deck's west edge to the ground, its lips raised, its near side in shade, a flat run out.
  const s0=Math.round(h*.43),s1=Math.round(h*.6),fx=Math.round(w*.06),run=8,sz0=2;
  const top=[[tx0,s0-dz],[fx+run,s0-sz0],[fx,s0-sz0],[fx,s1-sz0],[fx+run,s1-sz0],[tx0,s1-dz]];
  op(g,[...top.slice(0,3),[fx,s1-sz0+3],[fx+run,s1-sz0+3],[tx0,s1-dz+3]],YEL[0]);p([[fx,s1-sz0],[fx+run,s1-sz0],[tx0,s1-dz],[tx0,s1-dz+3],[fx+run,s1-sz0+3],[fx,s1-sz0+3]],YEL[1]);
  p(top,YEL[2]);p([[tx0,s0-dz+2],[fx+run,s0-sz0+2],[fx,s0-sz0+2],[fx,s1-sz0-2],[fx+run,s1-sz0-2],[tx0,s1-dz-2]],YEL[3]);
  l(tx0,s0-dz+.5,fx+run,s0-sz0+.5,1,YEL[1]);l(tx0,s1-dz-.5,fx+run,s1-sz0-.5,1,YEL[1]);l(tx0-6,(s0+s1)/2-dz-1,fx+run+6,(s0+s1)/2-sz0-6,.5,'#c8b46a');
  // The roof: a peak over the tower, the near slope lit, the far slope a sliver, the sides shaded.
  const R0=tx0-4,R1=tx1+4,Ry0=ty0-3-ez,Ry1=ty1+3-ez,ax=(R0+R1)/2,ay=Ry0+(Ry1-Ry0)*.3;
  op(g,[[R0,Ry0],[R1,Ry0],[R1,Ry1],[R0,Ry1]],RED[1]);p([[R0,Ry0],[R1,Ry0],[ax,ay]],RED[0]);p([[R1,Ry0],[R1,Ry1],[ax,ay]],RED[1]);p([[R0,Ry0],[R0,Ry1],[ax,ay]],RED[2]);p([[R0,Ry1],[R1,Ry1],[ax,ay]],RED[3]);
  for(const t of [.33,.66]){const a=mix([R0,Ry1],[ax,ay],t),b=mix([R1,Ry1],[ax,ay],t);l(a[0],a[1],b[0],b[1],.5,RED[2]);}
  l(R0,Ry1,ax,ay,.75,RED[0]);l(R1,Ry1,ax,ay,.75,RED[0]);r(R0,Ry1,R1-R0,2,RED[0]);e(ax,ay,1.5,1.5,YEL[3]);},
 // A wooden footbridge over a creek running north to south: deck planks laid across the span, edge beams, and a low railing along
 // each side, the near one face on. Flat: it lies on the water.
 footbridge(g,o){const {r}=g,w=o.w,h=o.h,z=o.z,s=(o.x|0)+(o.y|0)*7;
  r(-1,h,w+2,4,SHADOW);r(-1,h,w+2,2,SHADOW);
  r(-.5,-.5,w+1,h+1,EDGE);r(0,0,w,h,WD[1]);for(let x=0,i=0;x<w;x+=5,i++){const v=hash(i,s),c=v<.75?WD[3]:WD[4];r(x,2.5,4.5,h-5,c);r(x+4.5,2.5,.5,h-5,WD[1]);if(v>.55)r(x+1.5,6+hash(s,i)*(h-18),.5,7,WD[2]);r(x+1,4,.75,.75,WD[1]);r(x+1,h-5,.75,.75,WD[1]);}
  r(0,0,w,2.5,WD[2]);r(0,h-2.5,w,2.5,WD[1]);r(0,0,w,.5,WD[3]);r(0,h-z+1,w,4,'#00000022');
  // A railing: posts every so often, a top rail and a middle rail, standing on the edge beam at footprint row y.
  const rail=y=>{const t=y-z,n=Math.max(2,Math.round(w/30)),xs=[...Array(n+1).keys()].map(k=>Math.min(w-3,k*(w-3)/n));
   for(const x of xs){r(x-.5,t-.5,3.5,z+1,EDGE);r(x,t,2.5,z,WD[1]);r(x,t,.75,z,WD[2]);}
   for(const [yy,hh] of [[t,2.5],[t+z*.5,1.5]]){r(-.5,yy-.5,w+1,hh+1,EDGE);r(0,yy,w,hh,WD[2]);r(0,yy,w,.5,WD[3]);}};
  rail(1.5);rail(h-1.5);},
 // Aluminium bleachers: rows of planks stepping up toward the back, the dark frame under each step, steel stringers at the ends
 // and a guard rail along the top.
 bleachers(g,o){const {r,e,l}=g,w=o.w,h=o.h,z=o.z,n=5,dep=(h-5)/n,rz=(z-6)/n;
  r(-3,h-2,w+6,5,SHADOW);r(-1,h-1,w+2,2,SHADOW);
  // The guard rail behind the top row.
  const gy=4,gt=gy-z-6,nb=Math.max(2,Math.round(w/44));for(let k=0;k<=nb;k++){const x=Math.min(w-3,k*(w-3)/nb);r(x-.5,gt-.5,3,gy-rz*n-gt+1,EDGE);r(x,gt,2,gy-rz*n-gt,AL[2]);}
  r(-.5,gt-.5,w+1,2.5,EDGE);r(0,gt,w,1.5,AL[3]);r(-.5,gt+6,w+1,2,EDGE);r(0,gt+6.5,w,1,AL[2]);
  for(let i=n-1;i>=0;i--){const y0=h-(i+1)*dep,Z=rz*(i+1),yt=y0-Z,yb=y0+dep-Z,yg=y0+dep-rz*i;
   // The open riser under the step: dark, with the frame's uprights and a kick plank.
   r(-.5,yb,w+1,yg-yb,EDGE);r(0,yb,w,yg-yb,'#1a1c21');for(let x=10;x<w-5;x+=36){r(x,yb,2,yg-yb,AL[0]);r(x,yb,.5,yg-yb,AL[1]);}
   if(i===0)for(let x=10;x<w-5;x+=36)l(x+1,yb+2,x+19,yg-1,1,AL[0]);
   r(0,yb,w,1.5,AL[1]);
   // The step: a seat plank and a foot plank, lit along their front edges.
   r(-.5,yt-.5,w+1,yb-yt+1,EDGE);r(0,yt,w,yb-yt,AL[1]);const pd=(yb-yt)/2;for(let k=0;k<2;k++){r(0,yt+k*pd,w,pd-.75,AL[3-k%2]);r(0,yt+k*pd+pd-1.25,w,.5,AL[4]);r(0,yt+k*pd,w,.5,AL[2]);}
   for(let x=w*.15+hash(i,3)*w*.2;x<w;x+=w*.33)r(x,yt+1,.5,yb-yt-2,AL[1]);}
  // The stringers at the ends, from the ground to the top row.
  for(const x of [0,w-3]){r(x-.5,gy-rz*n-.5,4,h-gy+rz*n+1,EDGE);r(x,gy-rz*n,3,h-gy+rz*n,AL[1]);r(x,gy-rz*n,1,h-gy+rz*n,AL[2]);}},
 // A baseball backstop: a tall chain-link centre panel along the back with two wings angled forward, on posts with a top rail.
 backstop(g,o){const {r,l}=g,w=o.w,h=o.h,z=o.z,c0=Math.round(w*.23),c1=w-c0,yb=4,wf=h-4,S=['#3b3e43','#6c7179','#8e939b'],M='#8e939b55';
  l(c0,yb+1,c1,yb+1,4,SHADOW);l(2,wf+1,c0,yb+1,4,SHADOW);l(w-2,wf+1,c1,yb+1,4,SHADOW);
  const panel=(x0,y0,x1,y1,posts)=>{mesh(g,x0,y0,x1,y1,z,M);
   // The top rail, a middle rail and the bottom rail, then the posts.
   for(const [v,wd,c] of [[z,2,S[2]],[z*.5,1.25,S[1]],[1,1,S[0]]]){l(x0,y0-v,x1,y1-v,wd+1,EDGE);l(x0,y0-v,x1,y1-v,wd,c);}
   for(const t of posts){const x=x0+(x1-x0)*t,y=y0+(y1-y0)*t;r(x-1.75,y-z-1.5,3.5,z+1.5,EDGE);r(x-1.25,y-z-1,2.5,z+.5,S[1]);r(x-1.25,y-z-1,.75,z+.5,S[2]);r(x-1.75,y-z-2,3.5,1.5,S[2]);}};
  panel(c0,yb,c1,yb,[0,.5,1]);panel(c0,yb,2,wf,[1]);panel(c1,yb,w-2,wf,[1]);},
 // A ballfield light tower: one galvanised pole up the middle and a bank of ten lamps on a frame at the top. lit turns them on.
 lighttower(g,o){const {r,p,e,l}=g,w=o.w,h=o.h,z=o.z,cx=w/2,fy=Math.round(h/2)+2,W=Math.min(110,w-6),x0=cx-W/2,lh=13,ft=-z+1,fb=ft+lh*2+6;
  e(cx,fy+1,14,3.5,SHADOW);
  // The footing and the pole, tapering up, lit down its left side, with climbing pegs and a breaker box.
  ob(g,cx-6,fy-4,12,5,BK[2]);r(cx-6,fy-4,12,1,BK[3]);
  op(g,[[cx-3.5,fy-3],[cx+3.5,fy-3],[cx+2.25,fb],[cx-2.25,fb]],AL[2]);p([[cx-3.5,fy-3],[cx-1.5,fy-3],[cx-1,fb],[cx-2.25,fb]],AL[3]);p([[cx+2,fy-3],[cx+3.5,fy-3],[cx+2.25,fb],[cx+1.25,fb]],AL[1]);
  for(let y=fy-30,k=0;y>fb+6;y-=9,k++)r(k%2?cx+2.5:cx-5,y,2.5,1,AL[1]);ob(g,cx-5,fy-26,10,12,AL[1]);r(cx-5,fy-26,10,1,AL[3]);r(cx-1,fy-21,2,2,'#2a2c30');
  // The frame: a top and bottom chord with uprights, braced, and arms down to the pole.
  for(const y of [ft-2,fb-2]){r(x0-2.5,y-.5,W+5,3,EDGE);r(x0-2,y,W+4,2,AL[2]);r(x0-2,y,W+4,.5,AL[3]);}
  for(let k=0;k<=5;k++){const x=x0+k*W/5;r(x-1.5,ft-2.5,3,fb-ft+3,EDGE);r(x-1,ft-2,2,fb-ft+2,AL[1]);}
  l(cx,fb+14,x0+W*.2,fb,2,EDGE);l(cx,fb+14,x0+W*.8,fb,2,EDGE);l(cx,fb+14,x0+W*.2,fb,1,AL[2]);l(cx,fb+14,x0+W*.8,fb,1,AL[2]);
  // The lamps: two rows of five round heads tipped down at the field, hooded on top.
  for(let j=0;j<2;j++)for(let k=0;k<5;k++){const lx=x0+(k+.5)*W/5,ly=ft+2+lh/2+j*(lh+2),rx=W/10-2.5,ry=lh/2-.5;
   if(o.lit)e(lx,ly,rx+6,ry+5,'#fff4d618');
   e(lx,ly,rx+.5,ry+.5,EDGE);e(lx,ly,rx,ry,IR[2]);e(lx,ly+1,rx-1.5,ry-2,o.lit?GLOW:DARKGLASS);
   if(o.lit){e(lx-1.5,ly,rx-4,ry-4,'#ffffff');}else{e(lx-2,ly-.5,rx-5,ry-4.5,'#3a4048');}
   p([[lx-rx-.5,ly-1],[lx-rx+1,ly-ry-1],[lx+rx-1,ly-ry-1],[lx+rx+.5,ly-1],[lx+rx-1,ly-ry+1.5],[lx-rx+1,ly-ry+1.5]],IR[1]);}
  if(o.lit){e(cx,(ft+fb)/2,W/2+8,lh+9,'#fff4d610');e(cx,(ft+fb)/2,W/2+2,lh+3,'#fff4d612');}},
 // A snack stand: a painted block building under a flat tin roof, a roll-up shutter half open over a dark counter, a menu board
 // beside it and a sign above. lit hangs a lantern inside and spills its light over the counter.
 concession(g,o){const {r,e,l}=g,w=o.w,h=o.h,z=o.z,t=h-z,ov=3,fz=3;
  r(-3,h-1,w+6,4,SHADOW);r(-1,h,w+2,2,SHADOW);
  // The roof from above: tin with standing seams, falling to the front, a vent box near the back.
  r(-ov-.5,-z-ov-.5,w+ov*2+1,t+z+ov+fz+1,EDGE);r(-ov,-z-ov,w+ov*2,t+z+ov,'#3e4147');r(-ov,-z-ov,w+ov*2,(t+z+ov)*.3,'#383b41');
  for(let x=-ov+5;x<w+ov;x+=6){r(x,-z-ov,.5,t+z+ov,'#2c2f34');r(x+.5,-z-ov,.5,t+z+ov,'#50545b');}
  r(-ov,-z-ov,w+ov*2,.5,'#55595f');r(-ov,t,w+ov*2,fz,'#2a2c31');r(-ov,t,w+ov*2,.5,'#5a5e65');
  ob(g,w*.72,-z+10,14,10,'#4a4e55');r(w*.72,-z+10,14,1.5,'#5c6067');r(w*.72+2,-z+12,10,.5,'#2c2f34');
  // The front wall: pale painted block, a few courses and staggered joints.
  const wt=t+fz;r(-.5,wt,w+1,h-wt+.5,EDGE);r(0,wt,w,h-wt,BK[4]);for(let y=wt+5,k=0;y<h-1;y+=5,k++){r(0,y,w,.5,BK[2]);for(let x=(k%2)*8+4;x<w;x+=16)r(x,y-5+.5,.5,4.5,BK[2]);}r(0,h-3,w,3,BK[2]);r(0,wt,w,1,'#00000040');
  // The sign over the window: a painted board, red with cream lettering strokes.
  const sx0=12,sx1=Math.round(w*.62),sgy=wt+3;ob(g,sx0+4,sgy,sx1-sx0-8,8,RED[2]);r(sx0+4,sgy,sx1-sx0-8,1,RED[3]);for(let x=sx0+9,i=0;x<sx1-10;x+=6.5,i++){r(x,sgy+2,4,1,'#d8cfb4');r(x+(i%3===1?3:0),sgy+3,1,2,'#d8cfb4');r(x,sgy+5,4,1,'#d8cfb4');}
  // The window: the roll-up shutter half down, ribbed, and the dark inside under it; a counter in front.
  const oy0=sgy+11,oy1=h-Math.round(z*.36),om=Math.round((oy0+oy1)/2)-2;ob(g,sx0-1,oy0-1,sx1-sx0+2,oy1-oy0+1,'#2a2c30');
  r(sx0,om,sx1-sx0,oy1-om,o.lit?'#3a2814':'#121316');r(sx0,om,sx1-sx0,2,'#0a0b0d');
  for(const x of [sx0+6,sx0+22,sx1-14])r(x,om+6,8,.75,o.lit?'#6a4a28':'#2a2c30');r(sx0+7,om+3,3,3,o.lit?'#8a5a2a':'#26282c');r(sx0+24,om+4,4,2,o.lit?'#7a3a2a':'#26282c');
  if(o.lit){const lx=sx0+(sx1-sx0)*.55;r(lx-.25,om,.5,4,'#2a2c30');e(lx,om+9,14,6,'#e8b45a30');ob(g,lx-2,om+4,4,5,LANTERN);r(lx-1,om+5,2,3,'#ffe4a0');}
  r(sx0,oy0,sx1-sx0,om-oy0,'#5c6168');for(let y=oy0+2;y<om;y+=2.5){r(sx0,y,sx1-sx0,.5,'#43474d');r(sx0,y+.5,sx1-sx0,.5,'#767b82');}r(sx0,om-2,sx1-sx0,2,'#43474d');r((sx0+sx1)/2-3,om-1.5,6,1,'#9aa0a6');
  r(sx0-3.5,oy1-.5,sx1-sx0+7,4,EDGE);r(sx0-3,oy1,sx1-sx0+6,2,WD[3]);r(sx0-3,oy1,sx1-sx0+6,.5,WD[4]);r(sx0-3,oy1+2,sx1-sx0+6,1,WD[1]);if(o.lit){r(sx0,oy1,sx1-sx0,1,'#c8a060');e((sx0+sx1)/2,h+3,(sx1-sx0)/2,4,'#e8b45a18');}
  // The menu board: a framed chalk-green board with a red header and lines of prices.
  const mx0=sx1+8,mx1=w-8,my0=oy0,my1=Math.min(h-12,oy0+32);if(mx1-mx0>12){ob(g,mx0-1.5,my0-1.5,mx1-mx0+3,my1-my0+3,WD[2]);r(mx0,my0,mx1-mx0,my1-my0,'#24342a');r(mx0,my0,mx1-mx0,5,RED[2]);r(mx0+3,my0+2,mx1-mx0-6,1,'#d8cfb4');
   for(let y=my0+8,i=0;y<my1-2;y+=4,i++){r(mx0+3,y,(mx1-mx0)*(.35+hash(i,9)*.25),.75,'#a8ac9c');r(mx1-7,y,4,.75,'#c8b46a');}}},
 // A dugout: a block wall along the back and the ends under a flat roof, open at the front; a long bench inside, a water cooler at
 // one end and bats leaning on the wall.
 dugout(g,o){const {r,e,l}=g,w=o.w,h=o.h,z=o.z,t=h-z,ew=5,fz=4,R=['#232b27','#2c3631','#36423c','#435049'];
  r(-2,h-1,w+4,4,SHADOW);
  // Inside, in the roof's shade: the back wall's face and the floor.
  r(-.5,t,w+1,h-t+.5,EDGE);r(0,t,w,3-t,'#2e2d2a');for(let y=t+fz+4;y<3;y+=5)r(0,y,w,.5,'#252420');r(0,3,w,h-3,'#1e1f22');r(0,3,w,1,'#141517');
  // The bench: a plank seat on short legs, helmets left on it, and bats leaning on its front.
  const bz=12,b0=6,b1=13;r(ew+2.5,b0-bz-.5,w-ew*2-5,b1-b0+3,EDGE);r(ew+3,b0-bz,w-ew*2-6,b1-b0,WD[3]);r(ew+3,b0-bz,w-ew*2-6,.5,WD[4]);r(ew+3,b1-bz,w-ew*2-6,1.5,WD[1]);
  for(let x=ew+8;x<w-ew-6;x+=30)ob(g,x,b1-bz+1.5,2,bz-1.5,WD[1]);for(const k of [.22,.27,.5]){const x=w*k;e(x,b0-bz+2,3.5,2.5,EDGE);e(x,b0-bz+2,3,2,BLU[1]);e(x-1,b0-bz+1.5,1.2,.8,BLU[3]);}
  for(let i=0;i<4;i++){const x=w*.1+i*3.5;l(x+2.5,b1-bz+1,x,h-4,2,EDGE);l(x+2.5,b1-bz+1,x,h-4,1.2,i%2?'#8a7a56':'#6a5a40');}r(0,h-3,w,3,'#2a2b2e');r(0,h-3,w,.5,'#3a3b3e');
  // The cooler: an orange jug with a white lid, near the far end.
  const cx=w-ew-14;r(cx-5.5,h-17.5,11,15,EDGE);r(cx-5,h-17,10,14,'#9a5424');r(cx-5,h-17,3,14,'#b06a32');e(cx,h-17,5.5,2.5,EDGE);e(cx,h-17,5,2,'#c8c4ba');r(cx+1,h-8,2,1.5,'#2a2c30');e(cx,h-2,7,2,SHADOW);
  // The end walls, face on, and the roof: flat green metal with seams, its fascia over the opening.
  for(const x of [0,w-ew]){r(x,t,ew,h-t,BK[3]);r(x,t,ew,h-t,BK[3]);for(let y=t+fz+4;y<h;y+=5)r(x,y,ew,.5,BK[1]);r(x===0?ew-.5:x,t,.5,h-t,'#00000060');}
  r(-2.5,-z-2.5,w+5,t+z+fz+3,EDGE);r(-2,-z-2,w+4,t+z+2,R[2]);for(let x=4;x<w;x+=8){r(x,-z-2,.5,t+z+2,R[1]);r(x+.5,-z-2,.5,t+z+2,R[3]);}r(-2,-z-2,w+4,.5,R[3]);r(-2,t,w+4,fz,R[0]);r(-2,t,w+4,.5,R[3]);},
 // A park trash can in a slatted wooden housing with two steel bands; you see the dark liner from above.
 parkbin(g,o){const {r,e}=g,w=o.w,h=o.h,z=o.z,t=h-z;
  e(w/2,h,w/2+1.5,2,SHADOW);r(-.5,-z-.5,w+1,h+z+1,EDGE);
  r(0,-z,w,h,IR[3]);r(1.5,-z+1.5,w-3,h-3,'#0c0d0f');r(1.5,-z+1.5,w-3,1,'#1e2024');r(3,-z+4,3,2,'#3a3c40');
  r(0,t,w,z,WD[2]);for(let x=2.5;x<w;x+=3){r(x,t,.5,z,WD[0]);r(x+.5,t,.5,z,WD[3]);}r(0,t,w,.5,WD[4]);
  for(const y of [t+3,h-6]){r(0,y,w,1.5,IR[2]);r(0,y,w,.5,IR[3]);}r(0,h-1.5,w,1.5,WD[0]);},
 // A clump of cattails and reeds at the water's edge: blades of different heights, brown seed heads on stalks. seed reshuffles them.
 cattails(g,o){const {p,e,l}=g,w=o.w,h=o.h,z=o.z,s=(o.seed|0)*13+1,by=h-3,B=['#2a3620','#36452a','#465634','#5a5838'];
  e(w/2,h-2,w/2+2,3,SHADOW);e(w/2,h-2.5,w/2-3,2.5,MUD[1]);
  const blade=i=>{const x=2+hash(i,s)*(w-4),ht=(z+h-6)*(.4+hash(s,i)*.55),ln=(hash(i,s+3)-.5)*12,c=B[1+(i%3)];p([[x-1.5,by],[x+1.5,by],[x+ln+.3,by-ht]],EDGE);p([[x-1,by],[x+1,by],[x+ln,by-ht+1]],c);};
  for(let i=0;i<8;i++)blade(i);
  // The stalks and their heads.
  for(let i=0;i<6;i++){const x=5+hash(i,s+7)*(w-10),top=-z+2+hash(s+7,i)*(z*.4),ln=(hash(i,s+9)-.5)*6,hx=x+ln*.8,hy=top+5;
   l(x,by,x+ln,top-1,1.2,EDGE);l(x,by,x+ln,top-1,.6,B[2]);e(hx,hy,2.1,4.6,EDGE);e(hx,hy,1.6,4,'#4a3020');e(hx-.5,hy-1,.6,2.5,'#6a4a30');}
  for(let i=8;i<14;i++)blade(i);},
 // A mossy boulder: a lumpy grey stone, lit on top, moss over its crown. variant 0 to 2 gives a different shape.
 boulder(g,o){const {p,e,l}=g,w=o.w,h=o.h,z=o.z,v=(o.variant|0)%3,S=ROCKS[v],H=z+h,pts=S.map(([u,t])=>[u*w,-z+t*H]),cx=w/2,top=-z;
  e(w/2,h-1,w/2+2,3.5,SHADOW);op(g,pts,ST[1]);
  const lift=(k,dx)=>pts.map(([x,y])=>[cx+(x-cx)*k+dx,top+(y-top)*k*.78]);p(lift(.9,-.5),ST[2]);p(lift(.72,-1.5),ST[3]);p(lift(.38,-3),ST[4]);
  // Cracks and moss on the crown.
  l(cx-w*.1,top+H*.35,cx+w*.05,top+H*.55,.6,ST[0]);l(cx+w*.05,top+H*.55,cx+w*.02,top+H*.72,.5,ST[0]);
  for(let i=0;i<4;i++){const mx=cx+(hash(v,i)-.55)*w*.55,my=top+H*(.12+hash(i,v+5)*.22),rx=w*(.08+hash(i+3,v)*.08);e(mx,my+.5,rx,rx*.55,MOSS[1]);e(mx-.5,my,rx*.8,rx*.42,MOSS[2]);e(mx-1,my-.5,rx*.4,rx*.22,MOSS[3]);}
  p([[pts[0][0]+1,pts[0][1]],...pts.slice(-3).reverse().map(([x,y])=>[x,y-1])],'#00000030');},
 // An octagonal park gazebo: a raised wooden floor with a step up at the front, white posts and railings, and an eight-sided roof
 // to a point with a finial, seen from above.
 gazebo(g,o){const {r,p,e,l}=g,w=o.w,h=o.h,z=o.z,cx=w/2,cy=h/2,fz=6,ez=Math.round(z*.68),rx=w/2,ry=h/2;
  e(cx,cy+4,rx+2,ry,SHADOW);
  // The floor: its skirt on the ground, the deck above with boards across it.
  const fl=oct(cx,cy,rx*.95,ry*.95),fd=fl.map(([x,y])=>[x,y-fz]);op(g,fl,WD[1]);
  op(g,fd,WD[3]);const ri=ry*.95,si=ri*Math.tan(Math.PI/8);for(let y=-ri+4;y<ri;y+=4){const hw=Math.abs(y)<=si?rx*.95:rx*.95-(Math.abs(y)-si)*(rx/ry);r(cx-hw+.5,cy-fz+y,hw*2-1,.5,WD[2]);}
  for(let i=0;i<8;i++){const a=fl[i],b=fl[(i+1)%8];if(a[1]>cy||b[1]>cy)l(a[0],a[1]-fz/2,b[0],b[1]-fz/2,.5,WD[0]);}
  // The step up at the open south side.
  const sw=rx*.5;r(cx-sw/2-.5,h-fz-2.5,sw+1,fz+3.5,EDGE);r(cx-sw/2,h-fz-2,sw,3,WD[3]);r(cx-sw/2,h-fz-2,sw,.5,WD[4]);r(cx-sw/2,h-fz+1,sw,fz-1.5,WD[1]);
  // Posts and railings, back to front, every side railed but the entrance.
  const po=oct(cx,cy,rx*.86,ry*.86),rz=24,post=i=>{const [x,y]=po[i];r(x-2.5,y-ez-.5,5,ez-fz+1,EDGE);r(x-2,y-ez,4,ez-fz,WH[2]);r(x-2,y-ez,1.25,ez-fz,WH[3]);r(x+1,y-ez,1,ez-fz,WH[1]);};
  const rail=i=>{if(i===1)return;const [x1,y1]=po[i],[x2,y2]=po[(i+1)%8];for(let t=.08;t<.95;t+=.08){const x=x1+(x2-x1)*t,y=y1+(y2-y1)*t;l(x,y-fz-3,x,y-rz,1,WH[1]);}
   for(const v of [rz,fz+3]){l(x1,y1-v,x2,y2-v,2.5,EDGE);l(x1,y1-v,x2,y2-v,1.5,v===rz?WH[3]:WH[2]);}};
  const order=[...Array(8).keys()].sort((a,b)=>Math.sin((a+1)/8*Math.PI*2)-Math.sin((b+1)/8*Math.PI*2));
  for(const i of order){rail(i);}for(const i of [...Array(8).keys()].sort((a,b)=>po[a][1]-po[b][1]))post(i);
  // The roof: eight panels from the eave to the point, shaded by which way each faces, with shingle courses and hips, a white
  // fascia along the near eaves and a finial on top.
  const ev=oct(cx,cy-ez,rx*1.02,ry*1.02),A=[cx,cy-z+12],RF=['#1a221d','#222c26','#2b3730','#35443b','#40514a'];
  p(grow(ev.map(([x,y])=>[x,y+(y>cy-ez?3:0)]),.6),EDGE);
  for(let i=0;i<8;i++){const a=ev[i],b=ev[(i+1)%8];if(Math.sin((i+1)/8*Math.PI*2)>.1){p([a,b,[b[0],b[1]+3],[a[0],a[1]+3]],WH[1]);p([a,b,[b[0],b[1]+.75],[a[0],a[1]+.75]],WH[3]);}}
  for(let i=0;i<8;i++){const a=ev[i],b=ev[(i+1)%8],m=(i+1)/8*Math.PI*2,sc=Math.sin(m)*1.4-Math.cos(m)*.8+2,c=RF[Math.max(0,Math.min(4,Math.round(sc)))];p([a,b,A],c);
   for(const t of [.2,.4,.6,.8]){const u=mix(a,A,t),q=mix(b,A,t);l(u[0],u[1],q[0],q[1],.5,RF[0]);}}
  for(let i=0;i<8;i++){const a=ev[i];l(a[0],a[1],A[0],A[1],1.25,RF[0]);l(a[0],a[1]-.5,A[0],A[1]-.5,.5,RF[4]);}
  r(A[0]-1.5,A[1]-8.5,3,9,EDGE);r(A[0]-1,A[1]-8,2,8,WH[2]);e(A[0],A[1]-9,2.6,2.6,EDGE);e(A[0],A[1]-9,2,2,WH[3]);},
 // A pond, flat on the ground: a muddy bank round dark water, deeper in the middle, the moon's streaks across it and a raft of
 // lily pads near one shore. variant 0 or 1 gives a different outline.
 pond(g,o){const {r,p,e,l}=g,w=o.w,h=o.h,v=(o.variant|0)%2,cx=w/2,cy=h/2;
  const T=v?[[2,.08,1],[3,.06,4],[5,.03,2]]:[[2,.06,2.5],[3,.08,.5],[4,.03,5]],amp=T.reduce((s,t)=>s+t[1],0);
  const shape=(k,dx=0,dy=0)=>Array.from({length:72},(_,i)=>{const a=i/72*Math.PI*2,f=(1+T.reduce((s,[n,m,ph])=>s+m*Math.sin(n*a+ph),0))/(1+amp)*k;return [cx+dx+Math.cos(a)*w/2*f,cy+dy+Math.sin(a)*h/2*f];});
  // The bank: mud, a wet dark rim, specks of stone and root.
  p(shape(1),MUD[2]);p(shape(.97),MUD[1]);for(let i=0;i<40;i++){const a=hash(i,v+20)*Math.PI*2,f=.93+hash(v+20,i)*.06,x=cx+Math.cos(a)*w/2*f,y=cy+Math.sin(a)*h/2*f;r(x,y,1+hash(i,3)*2,.5,i%3?MUD[3]:MUD[0]);}
  p(shape(.93),'#151a19');
  // The water: the bank's shadow along the north edge, the open water, the deep middle.
  p(shape(.91),WT[0]);p(shape(.88,0,3),WT[2]);p(shape(.62,-w*.03,6),WT[1]);p(shape(.35,-w*.05,8),WT[0]);
  // Moonlight: a column of streaks breaking up toward the shore, and a few ripples elsewhere.
  const mx=cx-w*.14,my=cy-h*.12;for(let i=0;i<9;i++){const y=my+i*4.5,ln=w*(.09-.0075*i)*(.7+hash(i,v)*.6),x=mx-ln/2+(hash(v,i)-.5)*6;r(x,y,ln,.75,i<3?'#8ea2b07a':'#7a8e9c55');}
  for(let i=0;i<10;i++){const a=hash(i,v+7)*Math.PI*2,f=.15+hash(v+7,i)*.6,x=cx+Math.cos(a)*w/2*f,y=cy+Math.sin(a)*h/2*f;r(x,y,6+hash(i,v+8)*10,.5,'#5a6e7c45');}
  // Lily pads: round leaves with a notch, a couple of pale flowers.
  const lx=cx+(v?-w*.24:w*.22),ly=cy+(v?-h*.16:h*.2);for(let i=0;i<9;i++){const x=lx+(hash(i,v+11)-.5)*w*.16,y=ly+(hash(v+11,i)-.5)*h*.14,q=4+hash(i,v+12)*4,a=hash(i,v+13)*Math.PI*2;
   e(x,y+.75,q,q*.55,'#0a1012');e(x,y,q,q*.55,MOSS[2]);e(x-q*.2,y-q*.12,q*.6,q*.3,MOSS[3]);p([[x,y],[x+Math.cos(a)*q*1.1,y+Math.sin(a)*q*.6],[x+Math.cos(a+.5)*q*1.1,y+Math.sin(a+.5)*q*.6]],WT[2]);
   if(i%4===1){e(x+q*.3,y-1,1.6,1.1,'#c8c0c6');e(x+q*.3,y-1.3,.7,.5,'#d8cc9a');}}}};
// Library entries: the default sizes the suburbs map uses, and each kind's options.
const S=(kind,name,group,samples)=>({set:'town',kind,name,group,samples:samples.map(o=>({kind,x:40,y:40,...o}))});
export const PARK_SAMPLES=[
 S('bench','Park bench','Park',[{w:44,h:12,z:18}]),
 S('picnic','Picnic table','Park',[{w:54,h:34,z:18}]),
 S('playset','Playground set','Park',[{w:150,h:70,z:90}]),
 S('footbridge','Footbridge','Park',[{w:140,h:56,z:22,flat:true}]),
 S('gazebo','Gazebo','Park',[{w:150,h:150,z:120}]),
 S('pond','Pond','Park',[{w:400,h:240,z:2,flat:true,variant:0},{w:400,h:240,z:2,flat:true,variant:1}]),
 S('boulder','Mossy boulder','Park',[{w:40,h:24,z:18,variant:0},{w:40,h:24,z:18,variant:1},{w:40,h:24,z:18,variant:2}]),
 S('cattails','Cattails','Park',[{w:40,h:10,z:26,seed:0},{w:40,h:10,z:26,seed:1}]),
 S('parkbin','Park trash can','Park',[{w:14,h:12,z:24}]),
 S('bleachers','Bleachers','Ball fields',[{w:220,h:70,z:56}]),
 S('backstop','Backstop','Ball fields',[{w:130,h:50,z:96}]),
 S('lighttower','Light tower','Ball fields',[{w:120,h:12,z:280},{w:120,h:12,z:280,lit:true}]),
 S('concession','Snack stand','Ball fields',[{w:130,h:80,z:84},{w:130,h:80,z:84,lit:true}]),
 S('dugout','Dugout','Ball fields',[{w:180,h:40,z:50}])];
