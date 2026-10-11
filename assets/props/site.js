// Building site props: a house going up in three stages, a bare slab, scaffolding, a portable toilet, lumber and plywood stacks,
// concrete drainage pipes, the site office trailer, a tracked excavator, site fencing hung with privacy mesh, striped barricades,
// traffic cones, a dirt pile with a shovel in it and a bundle of rebar. Same conventions as street.js: footprint top left at (0, 0),
// height rising into negative y, a box's top seen as y in [-z, h-z] and its front face below that.
import {hash2 as hash} from '../core/paint.js';
import {EDGE,SHADOW} from './camp.js';
// What the site is made of, shade to highlight: framing lumber, fresh lumber, plank decks, concrete, galvanised steel, machine
// yellow, dirt and clay, cone orange and barricade white, glass, rust, privacy mesh, tarp, and the toilets' blue and green plastic.
const WD=['#3a2f22','#55452f','#705c40','#8a7454','#a08a68'],WDK=['#2a2219','#3b3023','#4f412f','#62523c','#74624a'],LUM=['#4e4230','#6a5a40','#857258','#9e8a6c','#b09c7c'],PK=['#2e2a24','#433c32','#585042','#6c6352'];
const CN=['#2c2e31','#3c3e41','#4d4f52','#5f6164','#727477'],ST=['#26282c','#3b3e43','#55585e','#6c7179','#8e939b'];
const YL=['#4a3c16','#6c5a24','#8c7632','#a68e40','#baa252'],DT=['#231c15','#30261c','#3e3124','#4d3d2c','#5e4b36'],CLAY=['#55392a','#6a4832','#7e5a3e'];
const OR=['#6e3216','#9a4620','#b85c2c','#d07440'],WH=['#8e8c84','#b8b6ae','#d4d1c8'],GLASS=['#0d1218','#1a2430','#2c3c4c'],RUST=['#3e2418','#58321f','#6e4029','#845034'];
const MESH=['#15221a','#1c2e22','#253a2c','#304836'],TARP=['#1c2c42','#26405c','#325274','#44668c'];
const PJ=[['#16253a','#203450','#2c4466','#3a567c','#4c6a92'],['#162a1e','#203a2a','#2c4c38','#3a5e48','#4c725a']];
const MUD='#3a2e22',WARM='#e8c27a';
// A box on footprint (x, y, w, d) from height z0 up to z1: its outline, top face and front face, the top edge lit. Returns where the
// front face starts.
function bx(g,x,y,w,d,z0,z1,top,front,hi){const {r}=g,yt=y-z1,yf=y+d-z1,yb=y+d-z0;r(x-.5,yt-.5,w+1,yb-yt+1,EDGE);r(x,yt,w,yf-yt,top);r(x,yf,w,yb-yf,front);if(hi)r(x,yt,w,.5,hi);return yf;}
// A thick bent bar through points, widths per point: the outline of a boom or an arm, as a polygon.
function beam(pts,ws){const A=[],B=[];pts.forEach((q,i)=>{const a=pts[Math.max(0,i-1)],b=pts[Math.min(pts.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],n=Math.hypot(dx,dy)||1,k=(ws[i]??ws[0])/2;A.push([q[0]-dy/n*k,q[1]+dx/n*k]);B.unshift([q[0]+dy/n*k,q[1]-dx/n*k]);});return A.concat(B);}
// A side profile (points as [x, height]) made solid between depths d0 and d1: outlined, its top as a band, then its near face.
function ext(g,pts,d0,d1,top,side){const at=d=>pts.map(([x,t])=>[x,d-t]);for(const q of at(d0).concat(at(d1)))g.e(q[0],q[1],.75,.75,EDGE);
 const ol=d=>{const a=at(d);a.forEach((q,i)=>g.l(q[0],q[1],a[(i+1)%a.length][0],a[(i+1)%a.length][1],1.5,EDGE));};ol(d0);ol(d1);for(const q of at(d0))g.l(q[0],q[1],q[0],q[1]+d1-d0,1.5,EDGE);
 for(let d=d0;d<d1;d+=.75)g.p(at(d),top);g.p(at(d1),side);}
export const SITE_ART={
 // A house going up, on the same footprint as the finished house: the slab, the walls framed in studs (the back wall seen through
 // the front), the trusses over the top. variant 0 is the slab with its bottom plates down and a few studs up; 1 all the walls framed
 // with trusses over the left half; 2 trusses all on, the front sheathed in OSB and part of it wrapped, a tarp flapping on the roof.
 // The walls are o.wall high (48, the game's house height); windows [[from, to]] and door (left edge) place the front openings.
 houseframe(g,o){const {r,l,p,e}=g,w=o.w,h=o.h,v=o.variant|0,Z=o.wall||48,SL=4,df=h-4,dm=Math.round(h*.46),xq=Math.round(w*.42),xs=Math.round(w*.8),s=(o.x|0)+(o.y|0)*3,
   win=o.windows||[[Math.round(w*.09),Math.round(w*.09)+44],[Math.round(w*.6),Math.round(w*.6)+44]],door=o.door??Math.round(w*.375),
   ops=[...win.map(([a,b])=>[a,b,20]),[door,door+34,SL]].sort((a,b)=>a[0]-b[0]);
  // The slab: a pale concrete pad with its edge showing, a few damp stains and blue chalk lines snapped where the walls go.
  r(-1.5,h-1,w+3,3.5,SHADOW);bx(g,0,0,w,h,0,SL,CN[3],CN[1],CN[4]);r(0,h-SL,w,.5,CN[4]);for(let i=0;i<8;i++)e(14+hash(i,s)*(w-28),6+hash(s,i)*(h-24),8+hash(i,4)*16,2.5+hash(4,i)*4,'#00000012');
  const ch='#8aa2bc70';for(const d of [6,dm+4,df-4])r(2,d-SL,w-4,.5,ch);for(const x of [5,xq+4,xs+4,w-6])r(x,-SL+2,.5,h-4,ch);
  // The pieces: a stud in an east-west wall at depth d, a plate (or header, sill) along one with its top at height t and th thick,
  // and a north-south wall seen from above, its top plate a strip with the end stud below it.
  // Walls behind the front one are in deeper shade (P), so the front wall stands out against them.
  let P=WDK;const stud=(x,d,t=Z,b=SL)=>{r(x-.5,d-t,2.5,t-b,EDGE);r(x,d-t,1.5,t-b,P[3]);r(x,d-t,.5,t-b,P[4]);r(x+1,d-t,.5,t-b,P[1]);},
   pl=(x0,x1,d,t,th=1.5)=>{if(x1<=x0)return;r(x0-.5,d-2-t,x1-x0+1,4+th,EDGE);r(x0,d-1.5-t,x1-x0,3,P[3]);r(x0,d-1.5-t,x1-x0,.5,P[4]);r(x0,d+1.5-t,x1-x0,th,P[2]);for(let x=x0+60;x<x1-6;x+=96)r(x,d-1.5-t,.5,3+th,P[1]);},
   ns=(x,d0,d1,t=Z)=>{r(x-.5,d0-t-.5,4,d1-d0+t-SL+1,EDGE);r(x,d0-t,3,d1-d0,P[3]);r(x,d0-t,.5,d1-d0,P[4]);r(x,d1-t,3,t-SL,P[2]);r(x+2.5,d1-t,.5,t-SL,P[1]);},
   // An east-west wall from x0 to x1 at depth d: the bottom plate (cut at doors), studs every 12, each opening with its king studs,
   // header and sill on cripples, and the doubled top plate.
   ew=(x0,x1,d,holes)=>{let c=x0;for(const [a,b,t] of holes)if(t<=SL){pl(c,a,d,SL+1.5);c=b;}pl(c,x1,d,SL+1.5);
    for(let x=x0;x<x1-6;x+=12)if(!holes.some(([a,b])=>x+3>a&&x<b+1.5))stud(x,d);stud(x1-1.5,d);
    for(const [a,b,t] of holes){stud(a-1.5,d);stud(b,d);if(t>SL){pl(a,b,d,t);for(let x=a+8;x<b-4;x+=12)stud(x,d,t-1.5);}pl(a-1.5,b+1.5,d,Z-3,5);}
    pl(x0,x1,d,Z,3);r(x0,d+3-Z,x1-x0,.5,WD[1]);};
  if(v===0){// Plates down on every wall line, the back left corner studded up and braced, a bundle of studs waiting on the slab.
   pl(0,w,1.5,SL+1.5);pl(xq,xq+30,dm,SL+1.5);pl(xq+64,w-3,dm,SL+1.5);ns(xq,1.5,dm,SL+1.5);ns(xs,dm,df,SL+1.5);ns(0,1.5,df,SL+1.5);ns(w-3,1.5,df,SL+1.5);
   for(let x=0;x<=48;x+=12)stud(x,1.5);pl(0,50,1.5,Z,3);l(50,1.5-Z+6,74,1.5-SL-1,2.5,EDGE);l(50,1.5-Z+6,74,1.5-SL-1,1.5,WD[2]);
   const bxl=Math.round(w*.55),byl=Math.round(h*.22);bx(g,bxl,byl,72,12,SL,SL+7,LUM[3],LUM[2],LUM[4]);for(let y=byl-SL-7+3;y<byl+12-SL-7;y+=3)r(bxl,y,72,.5,LUM[1]);for(let t=SL+2.5;t<SL+7;t+=2)r(bxl,byl+12-t,72,.5,LUM[1]);r(bxl+14,byl-SL-7,1.5,19,ST[3]);r(bxl+54,byl-SL-7,1.5,19,ST[3]);
   P=WD;pl(0,door,df,SL+1.5);pl(door+34,w,df,SL+1.5);for(const x of [0,12,24])stud(x,df);pl(0,26,df,Z,3);l(25.5,df-Z+8,50,df-SL-1,2.5,EDGE);l(25.5,df-Z+8,50,df-SL-1,1.5,WD[3]);return;}
  // Every wall framed: back, the inside walls, the ends, then the front with its openings.
  ew(0,w,1.5,[]);ew(xq,w-3,dm,[[xq+30,xq+64,SL]]);ns(xq,1.5,dm);ns(xs,dm,df);ns(0,1.5,df);ns(w-3,1.5,df);P=WD;ew(0,w,df,ops);
  if(v===2){// Sheathing: OSB sheets on most of the front, house wrap over the left of it, each cut round the openings.
   const skin=(X0,X1,f)=>{let c=X0;for(const [a,b,t] of ops){if(b<=X0||a>=X1)continue;const a1=Math.max(a,X0),b1=Math.min(b,X1);if(a1>c)f(c,a1,SL,Z);f(a1,b1,Z-8,Z);if(t>SL)f(a1,b1,SL,t);c=b1;}if(X1>c)f(c,X1,SL,Z);},y=t=>df+2-t;
   skin(0,Math.round(w*.74),(x0,x1,t0,t1)=>{r(x0-.5,y(t1)-.5,x1-x0+1,t1-t0+1,EDGE);r(x0,y(t1),x1-x0,t1-t0,'#6e5c40');r(x0,y(t1),x1-x0,.5,'#8a7656');
    for(let i=0;i<(x1-x0)*(t1-t0)/40;i++){const fx=x0+1+hash(i+x0,9)*(x1-x0-3),fy=y(t1)+1+hash(9,i+x0)*(t1-t0-2);r(fx,fy,1.5+hash(i,x0)*1.5,.5,i%2?'#806a4a':'#5e4e36');}
    for(let x=Math.ceil(x0/34)*34;x<x1;x+=34)if(x>x0)r(x-.25,y(t1),.5,t1-t0,'#3e3324');for(let x=Math.ceil(x0/12)*12+.5;x<x1;x+=12)for(let t=t0+3;t<t1-2;t+=5)r(x,y(t),.5,.5,'#4e4130');});
   skin(0,Math.round(w*.34),(x0,x1,t0,t1)=>{r(x0,y(t1),x1-x0,t1-t0,'#7c8183');r(x0,y(t1),x1-x0,.5,'#90959a');for(let t=t0+11;t<t1;t+=22)r(x0,y(t),x1-x0,.5,'#666b6e');
    for(let t=t0+5;t<t1-3;t+=11)for(let x=x0+4+(t%22?9:0);x<x1-6;x+=18)r(x,y(t),5,.5,'#4e5c70');});
   const fx=Math.round(w*.34);p([[fx,y(Z-6)],[fx+6,y(Z-11)],[fx+3,y(SL+20)],[fx,y(SL+16)]],'#6a6f72');l(fx,y(Z-6),fx+6,y(Z-11),.5,'#90959a');}
  // The trusses, every 12 along the walls, overhanging both eaves: the back slope in shade and the front lit, steel plates at the
  // ridge and the heel, a brace along the ridge and a long diagonal one across the front slope.
  const yr=-Z+Math.round((h-10)*.34),tx=v===1?Math.floor(w/48)*24:w,TC=['#5e4e38','#86704e','#a48c66','#bca47c'],tr=x=>{r(x-.5,-Z-3,3.5,h+4,EDGE);r(x,-Z-2.5,2.5,yr+Z+2.5,TC[1]);r(x,yr,2.5,h-Z+.5-yr,TC[2]);r(x,yr,.5,h-Z+.5-yr,TC[3]);r(x+2,yr,.5,h-Z+.5-yr,TC[0]);r(x-.25,yr-1,3,2,ST[3]);r(x-.25,df-Z-1.5,3,2,ST[3]);r(x-.25,-Z,3,2,ST[2]);};
  for(let x=0;x<tx-12;x+=24)tr(x);tr(tx-2.5);for(const y of [-Z-3.5,h-Z-1.5]){r(-.5,y-.5,tx+1,4,EDGE);r(0,y,tx,3,TC[2]);r(0,y,tx,.5,TC[3]);r(0,y+2.5,tx,.5,TC[0]);}r(0,yr-1.25,tx,2.5,EDGE);r(0,yr-.75,tx,1.5,TC[2]);r(0,yr-.75,tx,.5,TC[3]);l(4,yr+6,tx-4,df-Z-6,2.5,EDGE);l(4,yr+6,tx-4,df-Z-6,1.5,TC[1]);
  if(v===2){// A blue tarp tied over part of the roof, the trusses printing through it, its front corner torn loose and lifting.
   const a=Math.round(w*.55),b=Math.round(w*.85),t0=-Z-2,t1=yr+26;
   p([[a-.5,t0-.5],[b+.5,t0-1.5],[b+2.5,t1+.5],[a+30,t1+3.5],[a+14,yr+8],[a-1.5,yr+6]],EDGE);p([[a,t0],[b,t0-1],[b+2,t1],[a+30,t1+3],[a+14,yr+7.5],[a-1,yr+5.5]],TARP[2]);
   for(let x=Math.ceil(a/12)*12;x<b;x+=12)r(x,t0+1,1.5,t1-t0-(x<a+30?24:2),TARP[1]);r(a,t0,b-a,.5,TARP[3]);for(let i=0;i<5;i++)l(a+8+i*16,t0+3,a+4+i*15,yr+4,.5,TARP[3]);
   for(const [x,y] of [[a+2,t0+2],[b-2,t0+1],[b,t1-2]])e(x,y,1,1,WH[1]);l(b,t1-2,b+3,df-Z-2,.5,WH[0]);l(b-2,t0+1,b+3,t0-4,.5,WH[0]);
   p([[a+14,yr+8],[a+30,t1+3],[a+6,t1+14],[a-8,yr+24]],EDGE);p([[a+14,yr+8.5],[a+29,t1+3],[a+6,t1+13],[a-7,yr+24]],TARP[3]);p([[a+14,yr+8.5],[a+20,t1-6],[a+3,t1+4],[a-7,yr+24]],'#5a7a9e');l(a+14,yr+9,a-6,yr+23.5,.5,'#7a96b6');}},
 // A bare concrete foundation slab, flat to the ground: chalk lines where the walls will stand, rebar stubs along them, and the
 // plumbing poking up, white drain pipes, a black stack and a toilet flange.
 slab(g,o){const {r,l,e}=g,w=o.w,h=o.h,z=o.z,s=(o.x|0)+(o.y|0)*3;r(-1.5,h-1,w+3,3.5,SHADOW);bx(g,0,0,w,h,0,z,CN[3],CN[1],CN[4]);r(0,h-z,w,.5,CN[4]);
  for(let i=0;i<10;i++)e(14+hash(i,s)*(w-28),6+hash(s,i)*(h-20)-z,8+hash(i,4)*18,2.5+hash(4,i)*4,'#00000012');  for(let i=0;i<5;i++){const x=10+hash(i,s+2)*(w-50),y=hash(s+2,i)*(h-10)-z+4;r(x,y,18+hash(i,7)*20,.5,'#ffffff10');}
  const ch='#8aa2bc80',X=[6,Math.round(w*.4),Math.round(w*.72),w-7],D=[6,Math.round(h*.48),h-7];for(const d of D)r(3,d-z,w-6,.5,ch);for(const x of X)r(x,-z+3,.5,h-6,ch);
  // Rebar stubs at the corners and along the middle wall line, and anchor bolts along the edges.
  const bar=(x,d)=>{const y=d-z;l(x,y,x+.3,y-6,1.6,EDGE);l(x,y,x+.3,y-6,1,RUST[2]);r(x-.25,y-6.5,1,.5,RUST[3]);};
  for(const x of X)for(const d of D)bar(x+1,d+1);for(let x=X[0]+14;x<X[1];x+=14)bar(x,D[1]+1);for(let x=12;x<w-10;x+=30){r(x,6-z-1.5,1,2,EDGE);r(x+.25,6-z-1.5,.5,1.5,ST[4]);}
  // The plumbing: a pipe stub stands up out of the slab, its open end on top.
  const pipe=(x,d,rad,ht,P)=>{const y=d-z;r(x-rad-.5,y-ht,rad*2+1,ht+.5,EDGE);e(x,y,rad+.5,rad*.6+.5,EDGE);r(x-rad,y-ht,rad*2,ht,P[1]);e(x,y,rad,rad*.6,P[1]);r(x-rad,y-ht,rad*.6,ht,P[2]);e(x,y-ht,rad+.5,rad*.6+.5,EDGE);e(x,y-ht,rad,rad*.6,P[2]);e(x,y-ht,rad*.6,rad*.36,'#0e0f11');};
  const PVC=['#8e8c86','#b4b2aa','#d2d0c8'],ABS=['#141518','#26282c','#3b3e43'];
  pipe(w*.22,h*.3,1.6,6,PVC);pipe(w*.25,h*.33,1.6,5,PVC);pipe(w*.58,h*.62,2.6,9,ABS);pipe(w*.62,h*.26,1.6,6,PVC);pipe(w*.86,h*.7,1.6,5,PVC);pipe(w*.84,h*.73,1,4,PVC);
  const fx=w*.5,fy=h*.78-z;e(fx,fy,4.5,3,EDGE);e(fx,fy,4,2.5,PVC[2]);e(fx,fy,2.5,1.5,'#0e0f11');},
 // Tube-and-clamp scaffolding three lifts high: two rows of standards on sole boards, ledgers along both rows, a plank deck on each
 // lift with a toe board, guard rails, a sway brace, and ladders up through the decks. Open, so whatever is behind shows through.
 scaffold(g,o){const {r,l,e}=g,w=o.w,h=o.h,z=o.z,n=Math.max(1,Math.round(w/44)),bay=(w-1.5)/n,X=[...Array(n+1).keys()].map(k=>k*bay),L=[Math.round(z*.3),Math.round(z*.6),z-14];
  const tube=(x,y,ww,hh,c)=>{r(x-.5,y-.5,ww+1,hh+1,EDGE);r(x,y,ww,hh,c);},clamp=(x,y)=>{r(x-1.25,y-1.25,4,2.5,EDGE);r(x-.75,y-.75,3,1.5,ST[2]);},
   row=(d,c,hi)=>{r(-3,d-1.5,w+6,3,EDGE);r(-2.5,d-1,w+5,2,PK[1]);r(-2.5,d-1,w+5,.5,PK[3]);for(const x of X){tube(x,d-z,1.5,z,c);r(x,d-z,.5,z,hi);r(x-1.5,d-1,4.5,1.5,ST[1]);}
    for(const t of [...L,z-1,L[0]+14,L[1]+14])tube(-1,d-t-.75,w+2,1.5,c);for(const x of X)for(const t of [...L,z-1])clamp(x,d-t);},
   ladder=(x,y0,y1,x1=x)=>{for(const dx of [0,6]){l(x+dx,y0,x1+dx,y1,2,EDGE);l(x+dx,y0,x1+dx,y1,1.1,WD[3]);}for(let y=y0-3;y>y1+1;y-=4){const k=(y-y0)/(y1-y0),xx=x+(x1-x)*k;r(xx+.5,y-.5,5,1.5,EDGE);r(xx+.5,y-.25,5,1,WD[2]);}};
  r(-3,h-1,w+6,3.5,SHADOW);r(-3,-1.5,w+6,3,SHADOW);row(0,ST[2],ST[3]);
  // The decks, low to high: planks along the run with staggered butt joints, the deck's front edge, a hatch where a ladder comes up.
  L.forEach((t,k)=>{const y0=-t,hb=h/4;r(-1,y0-.5,w+2,h+2,EDGE);for(let j=0;j<4;j++){const y=y0+j*hb;r(-1,y,w+2,hb-.5,PK[2+(j+k)%2]);r(-1,y+hb-.5,w+2,.5,PK[0]);for(let x=bay*((j+k)%2?.5:1);x<w-4;x+=bay)r(x,y,.5,hb-.5,PK[0]);}
   r(-1,h-t,w+2,1.5,PK[1]);if(k>0){const hx=k%2?X[n-1]+bay*.35:bay*.35;r(hx-1,h-t-14,9,10,'#0c0d10');}r(-1,h-1.5-t-4.5,w+2,4.5,EDGE);r(-1,h-1.5-t-4,w+2,3.5,PK[2]);r(-1,h-1.5-t-4,w+2,.5,PK[3]);
   if(k>0){const hx=k%2?X[n-1]+bay*.35:bay*.35;ladder(hx,h-8-L[k-1],h-6-t-8,hx+.5);}});
  // The front row over the decks, a sway brace across it, and the ladder from the ground.
  row(h,ST[3],ST[4]);l(X[0]+1,h-1,X[n]+.5,h-L[2],2.5,EDGE);l(X[0]+1,h-1,X[n]+.5,h-L[2],1.5,ST[3]);ladder(bay*.35,h+4,h-L[0]-8,bay*.35+1);},
 // A portable toilet: a moulded plastic box with a pale roof, a vent stack, ribbed sides and a door with its occupied/vacant slot
 // (o.occupied shows red). variant 0 blue, 1 green, 2 blue tipped over on its back, floor to the left (lie it in a 58 x 24 footprint).
 portajohn(g,o){const {r,p,e,l}=g,v=o.variant|0,w=o.w,h=o.h,z=o.z,P=PJ[v===1?1:0],RF=['#6a7076','#868c90','#a2a8aa'],sl=o.occupied?'#a83a2a':'#4a8a4a';
  if(v===2){// On its back: the door looks up at the sky, the side wall faces you, the roof and vent at the right end. Blue leaks out.
   const H=Math.min(z-2,22),t=h-H;e(w*.25,h+3,w*.3,3,'#2a5a7a50');e(w/2,h,w/2+3,3,SHADOW);r(-.5,-H-.5,w+1,h+H+1,EDGE);r(w,-H+5,6,3,EDGE);r(w,-H+5.5,5.5,2,P[1]);
   r(0,-H,w,h,P[3]);r(0,-H,w,.5,P[4]);r(0,t,w,H,P[2]);r(0,t,w,1.5,P[3]);r(0,h-2,w,2,P[1]);for(let x=8;x<w-6;x+=5)r(x,t+3,.5,H-6,P[1]);
   r(0,-H,3,h+H,P[0]);r(w-4,-H,4,h+H,RF[1]);r(w-4,-H,4,.5,RF[2]);r(w-4,t,4,H,RF[0]);
   r(8,-H+3,w-18,h-6,P[1]);r(8.5,-H+3.5,w-19,h-7,P[2]);for(let x=13;x<w-12;x+=6)r(x,-H+4,.5,h-8,P[1]);r(w-16,-H+h/2-3,2,4,EDGE);r(w-15.5,-H+h/2-2.5,1,3,sl);r(w-14,-H+h/2+2,4,1,ST[3]);return;}
  // Standing: the shadow, the shell with the roof's rounded corners, the roof panel seen from above and the vent stack at the back.
  const t=h-z;e(w/2,h,w/2+3,2.5,SHADOW);p([[-.5,-z+1.5],[1.5,-z-.5],[w-1.5,-z-.5],[w+.5,-z+1.5],[w+.5,h+.5],[-.5,h+.5]],EDGE);
  p([[0,-z+1.5],[1.5,-z],[w-1.5,-z],[w,-z+1.5],[w,t],[0,t]],P[3]);r(2,-z+2,w-4,h-5,RF[1]);r(2,-z+2,w-4,.5,RF[2]);r(2,t-3.5,w-4,.5,RF[0]);r(w/2-.25,-z+2,.5,h-5,RF[0]);
  r(w-7,-z-5,4,7,EDGE);r(w-6.5,-z-4.5,3,6,P[1]);r(w-6.5,-z-4.5,1,6,P[3]);e(w-5,-z-4.5,1.5,1,P[0]);
  // The front: corner posts, the roof lip, louvres at the top, the door panel with its ribs, the slot and the handle, the skid.
  r(0,t,w,z,P[2]);r(0,t,2.5,z,P[1]);r(w-2.5,t,2.5,z,P[1]);r(0,t,.5,z,P[3]);r(-.5,t-.5,w+1,2,P[4]);r(0,t+1.5,w,.5,P[0]);for(let i=0;i<3;i++)r(5,t+3.5+i*1.5,w-10,.5,P[0]);
  r(3.5,t+9,w-7,z-11,P[1]);r(4,t+9.5,w-8,z-12,P[2]);for(let y=t+14;y<h-3;y+=7)r(5,y,w-10,.5,P[1]);r(4,t+9.5,w-8,.5,P[3]);
  r(w-8.5,t+z*.42,4,2.5,EDGE);r(w-8,t+z*.42+.5,3,1.5,sl);r(w-7,t+z*.42+5,1.5,4,EDGE);r(w-6.75,t+z*.42+5.25,1,3.5,ST[3]);r(-.5,h-2,w+1,2,P[0]);},
 // A stack of lumber on three sleepers, bound with steel straps, a few boards longer than the rest. variant 1: a smaller pile of
 // plywood sheets, the top one knocked askew.
 lumber(g,o){const {r,p,e}=g,w=o.w,h=o.h,z=o.z,v=o.variant|0,s=(o.x|0)+(o.y|0)*7;r(-2,h-1,w+4,3.5,SHADOW);for(const x of [5,w/2-4,w-13])bx(g,x,-1,8,h+2,0,3,WD[2],WD[1],WD[3]);
  if(v===1){const PL=['#5c4c34','#76644a','#8e7a5c','#a28e6e'];bx(g,1,0,w-2,h,3,z-2,PL[2],PL[1],PL[3]);for(let t=4.25;t<z-2.5;t+=1.25)r(1,h-t,w-2,.5,t%2.5?PL[0]:'#6a5a42');
   for(let i=0;i<3;i++){const t=4+i*2;r(-1-hash(i,s)*3,h-t-1,3,1.5,PL[1]);}
   const ox=3,oy=-1.5;p([[ox-.5,oy-z-.5],[w-1+ox+.5,oy-z-1.5],[w-1+ox+.5,oy+h-z+.5],[ox-.5,oy+h-z+1.5]],EDGE);p([[ox,oy-z],[w-1+ox,oy-z-1],[w-1+ox,oy+h-z],[ox,oy+h-z+1]],PL[3]);
   p([[ox,oy+h-z+1],[w-1+ox,oy+h-z],[w-1+ox,oy+h-z+1.5],[ox,oy+h-z+2.5]],PL[1]);for(let i=0;i<9;i++){const y=oy-z+2+hash(i,s+3)*(h-4);r(ox+3+hash(s+3,i)*20,y,10+hash(i,1)*(w-30),.5,i%2?PL[2]:'#b29e7e');}return;}
  // The boards: their edges along the top, the layers on the front with stickers between, a few longer boards poking out.
  for(let i=0;i<4;i++){const t=4+Math.floor(hash(i,s)*(z-8)/3.5)*3.5,ln=2+hash(s,i)*6,R=i%2;r(R?w-1:1-ln,h-t-3.5,ln,3.5,EDGE);r(R?w-1:1-ln+.5,h-t-3,ln-.5,2.5,LUM[2]);}
  bx(g,1,0,w-2,h,3,z,LUM[3],LUM[2],LUM[4]);for(let y=-z+4.5;y<h-z-1;y+=4.5)r(1,y,w-2,.5,LUM[1]);for(let t=6.5;t<z;t+=3.5)r(1,h-t,w-2,.5,LUM[1]);r(1,h-z+.5,w-2,.5,LUM[4]);
  for(let i=0;i<6;i++){const x=4+hash(i,s+5)*(w-12),t=5+Math.floor(hash(s+5,i)*(z-9)/3.5)*3.5;r(x,h-t-2,1.5+hash(i,2)*2,.5,i%2?'#4e5e7a':'#7a3a2e');}
  for(const x of [w*.2,w*.78]){r(x-.5,-z-.5,2.5,h+z-2,EDGE);r(x,-z,1.5,h+z-3,ST[3]);r(x,-z,.5,h+z-3,ST[4]);r(x-.75,h-z+4,3,2.5,ST[1]);}},
 // Big concrete drainage pipes stacked two on the ground and one on top, lying north-south so their round open ends face you:
 // each a long concrete barrel lit along its top left, the end a thick ring round a dark bore, wooden chocks under the bottom two.
 pipes(g,o){const {r,e,p}=g,w=o.w,h=o.h,R=Math.round((w-10)/4),A=R+1,B=w-R-1,dx=(B-A)/2,zc=R+Math.sqrt(Math.max(0,4*R*R-dx*dx)),s=(o.x|0)+(o.y|0)*5;
  e(w/2,h,w/2+3,4,SHADOW);r(-2,-4,w+4,h+3,'#100e0c22');
  const pipe=(cx,c,k0)=>{const yb=-c,yf=h-c;e(cx,yb,R+.5,R+.5,EDGE);r(cx-R-.5,yb,2*R+1,yf-yb,EDGE);e(cx,yf,R+.5,R+.5,EDGE);
   e(cx,yb,R,R,CN[1]);e(cx-.6,yb-.6,R-1.6,R-1.6,CN[3]);e(cx+.4,yb+.4,R-2.4,R-2.4,CN[2]);
   for(const [k,col] of [[1,CN[1]],[.9,CN[2]],[.66,CN[3]],[.34,CN[4]]]){const ox=-(1-k)*R*.55;r(cx+ox-R*k,yb,2*R*k,yf-yb,col);}r(cx-R,yb,2*R,1.5,CN[1]);r(cx-R,yb+1.5,2*R,.5,CN[4]);
   for(let i=0;i<4;i++){const x=cx-R*.8+hash(i,s+k0)*R*1.6;r(x,yb+4+hash(k0,i)*8,.5,h*.5,'#00000018');}
   e(cx,yf,R,R,CN[3]);e(cx+.8,yf+.8,R-.8,R-.8,CN[2]);const ri=R-4.5;e(cx,yf,ri+.6,ri+.6,CN[1]);e(cx,yf,ri,ri,'#131416');e(cx,yf+ri*.42,ri*.72,ri*.48,'#222428');e(cx-ri*.3,yf-ri*.55,ri*.25,ri*.1,'#1c1d20');};
  for(const x of [A,B]){const side=x<w/2?-1:1,cx=x+side*R*.8;p([[cx-3,h+.5],[cx+3,h+.5],[cx,h-5]],EDGE);p([[cx-2.5,h],[cx+2.5,h],[cx,h-4]],WD[2]);}
  pipe(A,R,1);pipe(B,R,2);pipe(w/2,zc,3);},
 // The site office: a long box trailer up on block piers with a flat roof, ribbed walls, small windows with their frames, a steel
 // door at the top of wooden steps, a sign by it and the hitch at the left end. lit: one window glows warm.
 sitetrailer(g,o){const {r,p,e,l}=g,w=o.w,h=o.h,z=o.z,D=h-12,B=8,dx=Math.round(w*.47),TW=['#42403a','#57544d','#6e6b63','#837f75','#979388'];
  // Underneath: the shadow, the dark crawl space, the piers and the hitch.
  r(-2,D-2,w+4,6,SHADOW);r(2,D-B,w-4,B,'#0c0d0f');for(const x of [8,w*.3,w*.55,w*.8,w-18])bx(g,x,D-7,10,6,0,B-.5,CN[3],CN[2]);
  l(-11,D-4,1,D-B-2,2.5,EDGE);l(-11,D-4,1,D-1,2.5,EDGE);l(-11,D-4,1,D-B-2,1.5,ST[2]);l(-11,D-4,1,D-1,1.5,ST[2]);e(-11,D-4,2.5,2,EDGE);e(-11,D-4,2,1.5,ST[3]);
  // The body: the flat roof with its seams and a rooftop air conditioner, the walls ribbed, a stripe along them.
  const yf=bx(g,0,0,w,D,B,z,TW[3],TW[2],TW[4]);for(let x=24;x<w;x+=24)r(x,-z+.5,.5,D-1,TW[2]);r(0,yf-1.5,w,1.5,TW[4]);r(0,yf,w,.5,TW[0]);
  bx(g,w*.7,12,26,18,z,z+7,ST[3],ST[2],ST[4]);e(w*.7+13,12-z-7+9,6,6,ST[1]);e(w*.7+13,12-z-7+9,1.5,1.5,ST[3]);r(w*.18,20-z-4,3,4,EDGE);r(w*.18+.5,20-z-4,2,3.5,ST[2]);
  for(let x=4;x<w-2;x+=4)r(x,yf+1,.5,D-B-yf-3,TW[1]);r(0,yf+6,w,2.5,'#3e4c60');r(0,D-B-2,w,2,TW[1]);
  // Windows: alloy frame, dark glass with a gleam, or lit and showing its blinds, light spilling on the ground below.
  const W=[w*.08,w*.24,w*.66,w*.84];W.forEach((x,i)=>{const lit=o.lit&&i===1,y0=D-52,hh=15;if(lit){r(x-4,y0-4,28,hh+8,'#ffc06a22');}
   r(x-1,y0-1,22,hh+2,EDGE);r(x-.5,y0-.5,21,hh+1,ST[3]);r(x+.5,y0+.5,19,hh-1,lit?WARM:GLASS[1]);r(x+10,y0+.5,.5,hh-1,ST[3]);
   if(lit){for(let y=y0+2;y<y0+hh-1;y+=2)r(x+.5,y,19,.5,'#c49a58');r(x+.5,y0+.5,19,.5,'#f8e2b0');}else{p([[x+3,y0+hh-.5],[x+6,y0+hh-.5],[x+9,y0+.5],[x+6,y0+.5]],GLASS[2]);}r(x-1,y0+hh+.5,22,1.5,TW[4]);});
  // The door, its sign, and the steps up to it with a hand rail.
  r(dx-1,D-56,20,D-B-(D-56),EDGE);r(dx-.5,D-55.5,19,D-B-(D-55.5),ST[2]);r(dx+.5,D-54.5,17,D-B-1-(D-54.5),ST[3]);r(dx+5,D-50,7,8,GLASS[1]);r(dx+5,D-50,7,.5,GLASS[2]);r(dx+14,D-33,2.5,1.5,WH[1]);r(dx+.5,D-54.5,17,.5,ST[4]);
  const sx=dx-32;r(sx,D-50,26,11,EDGE);r(sx+.5,D-49.5,25,10,WH[1]);r(sx+.5,D-49.5,25,2.5,'#3e4c60');for(const [yy,ww] of [[D-45,19],[D-42.5,13]])r(sx+3,yy,ww,1,TW[0]);
  bx(g,dx-4,D,26,6,0,B,WD[3],WD[2],WD[4]);bx(g,dx-4,D+6,26,6,0,B/2,WD[3],WD[2],WD[4]);for(const x of [dx+3,dx+12])r(x,D+.5-B,.5,5,WD[1]);
  l(dx+23,h-1,dx+23,h-24,2.5,EDGE);l(dx+23,h-1,dx+23,h-24,1.5,WD[3]);l(dx+23,h-24,dx+18,D-B-16,2.5,EDGE);l(dx+23,h-24,dx+18,D-B-16,1.5,WD[3]);},
 // A tracked excavator facing right: two tracks, the turning upper body with its rounded counterweight, engine cover and exhaust, the
 // glass cab on the far side, and the boom raised beside it with the arm reaching down to the bucket resting on the ground at the
 // front. Machine yellow, mud on the tracks and the bucket. Drawn at its default size.
 excavator(g,o){const {r,p,e,l}=g,h=o.h,s=(o.x|0)+(o.y|0)*3,TR=['#141518','#202226','#2e3035','#3c3e44'];
  e(84,h-2,80,6,SHADOW);e(188,h-9,20,3.5,SHADOW);
  // A track: its top run seen from above, the near side as a long loop of shoes round the idler and sprocket, rollers, mud.
  const track=(d0,d1)=>{const yt=d0-19,yf=d1-19,yb=d1,x0=14,x1=146;p([[x0+6,yt-.5],[x1-6,yt-.5],[x1+.5,yt+4],[x1+.5,yb-6],[x1-6,yb+.5],[x0+6,yb+.5],[x0-.5,yb-6],[x0-.5,yt+4]],EDGE);
   p([[x0+6,yt],[x1-6,yt],[x1,yt+4],[x1,yf],[x0,yf],[x0,yt+4]],TR[2]);for(let x=x0+3;x<x1-2;x+=3.5)r(x,yt+1,.5,yf-yt-1,TR[0]);r(x0+3,yt,x1-x0-6,.5,TR[3]);
   p([[x0,yf],[x1,yf],[x1,yb-6],[x1-6,yb],[x0+6,yb],[x0,yb-6]],TR[1]);for(let x=x0+2;x<x1;x+=3.5)r(x,yf,.5,yb-yf,TR[0]);r(x0,yf,x1-x0,.5,TR[3]);
   r(x0+12,yf+4,x1-x0-24,7,EDGE);r(x0+12.5,yf+4.5,x1-x0-25,6,YL[1]);r(x0+12.5,yf+4.5,x1-x0-25,.5,YL[2]);e(x0+8,yf+9.5,6.5,6.5,EDGE);e(x0+8,yf+9.5,5.5,5.5,TR[2]);e(x1-8,yf+9.5,6.5,6.5,EDGE);e(x1-8,yf+9.5,5.5,5.5,TR[2]);
   for(const x of [x0+8,x1-8]){e(x,yf+9.5,2,2,ST[2]);}for(let x=x0+22;x<x1-16;x+=19){e(x,yb-4,3,2.5,EDGE);e(x,yb-4,2.5,2,TR[3]);}
   for(let i=0;i<9;i++)e(x0+4+hash(i,s+d0)*(x1-x0-8),yb-3-hash(s+d0,i)*9,2+hash(i,3)*4,1.2+hash(3,i)*1.5,MUD);};
  track(6,30);bx(g,48,30,62,32,5,20,TR[2],TR[1]);track(64,88);
  // The upper body: the deck, the counterweight curving round the back with warning stripes, the engine cover and its grille.
  const yf=bx(g,24,12,108,64,21,54,YL[3],YL[2],YL[4]);r(24,yf,108,.5,YL[4]);r(24,76-23,108,2,YL[1]);for(const x of [66,90,112])r(x,yf+3,.5,26,YL[1]);for(let y=yf+6;y<yf+20;y+=2.5)r(70,y,16,1,YL[1]);r(116,yf+12,10,1.5,ST[2]);r(54,76-24,16,2,ST[2]);
  e(28,(12+76)/2-56,10.5,32.5,EDGE);r(28,12-56-.5,18,64+1,EDGE);r(17.5,76-56,28.5,35,EDGE);e(28,(12+76)/2-56,10,32,YL[3]);r(30,12-56,16,64,YL[3]);r(30,12-56,16,.5,YL[4]);
  p([[18,76-56],[46,76-56],[46,76-21],[23,76-21],[18,76-28]],YL[2]);r(18,76-56,28,.5,YL[4]);for(let i=0;i<4;i++)p([[20+i*6,76-54],[23+i*6,76-54],[19+i*6,76-24],[16+i*6,76-24]].map(([x,y])=>[Math.max(18.5,x),y]),'#1e1a12');
  bx(g,48,18,38,52,54,58,YL[3],YL[2],YL[4]);for(let x=52;x<82;x+=3)r(x,18-58+4,1.5,40,YL[1]);r(73,26-74,3.5,14,EDGE);r(73.5,26-73.5,2.5,13,ST[1]);e(74.75,26-74,1.75,1,'#0c0d10');
  // The cab: its roof, then the side door all glass between yellow posts, the seat dark inside.
  const cy=bx(g,88,14,36,30,54,98,YL[3],YL[2],YL[4]);r(89.5,14-96.5,33,27,'#34342e');r(92,14-94,28,15,GLASS[1]);r(93,14-93,6,13,GLASS[2]);r(89.5,14-96.5,33,.5,'#4a4a42');r(88,cy,36,.5,YL[4]);r(90.5,cy+2,31,40,GLASS[1]);r(98,cy+16,12,10,'#0a0d12');r(91,cy+2.5,4,38,GLASS[2]);p([[100,cy+40],[104,cy+40],[116,cy+2],[112,cy+2]],GLASS[2]);
  r(105,cy+2,1.5,40,YL[2]);r(90.5,cy+18,31,1.5,YL[2]);r(118,cy+24,2,3,ST[3]);r(121,14-96,1.5,1.5,WARM);for(const x of [50,68,86])l(x,72-54,x,72-64,1,EDGE);l(50,72-64,86,72-64,1.5,EDGE);l(50,72-64,86,72-64,.75,YL[4]);
  // The boom raised beside the cab, the arm dropping from its tip to the bucket, the hydraulic rams along them, the pins.
  const boom=beam([[116,46],[138,94],[160,112]],[12,10,9]),stick=beam([[157,110],[181,30]],[8,6.5]),q=(x,t,d=61)=>[x,d-t],ram=(a,b,k)=>{const A=q(...a),B=q(...b),m=[A[0]+(B[0]-A[0])*k,A[1]+(B[1]-A[1])*k];l(...A,...B,3,EDGE);l(...A,...m,2.5,YL[1]);l(...A,...m,1,YL[2]);l(...m,...B,1.5,ST[4]);};
  ext(g,boom,51,60,YL[3],YL[2]);ram([126,40],[140,84],.55);ext(g,stick,52,59,YL[3],YL[2]);ram([146,104],[166,118],.5);ram([162,102],[182,40],.55);
  for(const [x,t] of [[118,48],[158,110],[181,30]]){const [a,b]=q(x,t);e(a,b,2.5,2.5,EDGE);e(a,b,1.8,1.8,ST[3]);e(a-.4,b-.4,.7,.7,ST[4]);}
  // The bucket on the ground: its back curling up to the arm, the teeth biting the dirt, mud caked on it.
  const bk=[[172,32],[186,34],[195,25],[200,10],[199,1],[186,0],[176,4],[170,16]];for(let d=57;d<=79;d+=7){p([[199,d-3],[205,d-1],[199,d+.5]],EDGE);p([[199,d-2.5],[204,d-1],[199,d]],ST[3]);}ext(g,bk,56,80,YL[1],YL[2]);
  for(let i=0;i<8;i++)e(176+hash(i,s)*22,80-2-hash(s,i)*14,2+hash(i,5)*3,1.2+hash(5,i)*1.5,MUD);for(let i=0;i<7;i++)e(168+hash(i,s+1)*38,83-hash(s+1,i)*6,1.5+hash(i,8)*2,1,DT[3]);},
 // Temporary site fencing running east-west: steel mesh panels on concrete feet, hung with green privacy mesh so you cannot see
 // through, clamps at the joints and a warning sign on one panel. gap: the middle panel pushed over, lying flat behind the line.
 sitefence(g,o){const {r,p,l}=g,w=o.w,h=o.h,z=o.z,n=Math.max(1,Math.round(w/66)),pw=w/n,gi=o.gap&&n>1?Math.floor(n/2):o.gap?0:-1,d=h/2,s=(o.x|0)+(o.y|0)*3;
  r(-1,h,w+2,2.5,SHADOW);
  // A panel's mesh face: dark green cloth, a faint weave, a few folds, the steel frame round it and cable ties along the top.
  const face=(pts,a,b,yt,yb,M=MESH)=>{p(pts.map(([x,y],i)=>[x+(i===0||i===3?-.5:.5),y+(i<2?-.5:.5)]),EDGE);p(pts,M[1]);for(let y=yt+3;y<yb-1;y+=3)r(a+1.5,y,b-a-3,.5,M[2]);
   for(let i=0;i<3;i++){const x=a+6+hash(i,s+a|0)*(b-a-14);l(x,yt+2,x+4+hash(a|0,i)*6,yb-2,1,MESH[0]);}};
  if(gi>=0){const a=gi*pw+3,b=(gi+1)*pw-2,y0=d+.5,y1=d-z+3;for(const x of [a+3,b-3]){l(x,y0,x+.5,y0+3.5,2,EDGE);l(x,y0,x+.5,y0+3.5,1.2,ST[3]);}face([[a+2,y1-1],[b-1,y1+1],[b+.5,y0],[a,y0+.5]],a+1,b-1,y1,y0,['#1e3024','#2c4434','#365240']);
   for(const [x0,y0a,x1,y1a] of [[a+2,y1-1,b-1,y1+1],[a,y0+.5,b+.5,y0],[a+2,y1-1,a,y0+.5],[b-1,y1+1,b+.5,y0]]){l(x0,y0a,x1,y1a,2,EDGE);l(x0,y0a,x1,y1a,1.2,ST[3]);}}
  for(let i=0;i<n;i++){if(i===gi)continue;const a=i*pw+1,b=(i+1)*pw-1,yt=d-z,yb=d-3;face([[a,yt],[b,yt],[b,yb],[a,yb]],a,b,yt,yb);
   r(a,yt,b-a,1.5,ST[3]);r(a,yt,b-a,.5,ST[4]);r(a,yt,1.5,yb-yt,ST[2]);r(b-1.5,yt,1.5,yb-yt,ST[2]);r(a,yb-1.5,b-a,1.5,ST[2]);for(let x=a+5;x<b-3;x+=8)r(x,yt+1.5,.5,1,WH[1]);
   if(i===(gi===0?1:0)&&b-a>40){const sx=a+(b-a)/2-10,sy=yt+8;r(sx-.5,sy-.5,21,15,EDGE);r(sx,sy,20,14,WH[1]);r(sx,sy,20,4,'#8a2a22');r(sx+3,sy+6.5,14,1,ST[1]);r(sx+3,sy+9.5,10,1,ST[1]);}}
  // The feet at every joint, with the clamps that tie neighbouring panels together.
  for(let k=0;k<=n;k++){const x=Math.min(w-7,Math.max(7,k*pw)),fallen=gi>=0&&(k===gi||k===gi+1);bx(g,x-7,d-3,14,6,0,4,CN[3],CN[2],CN[4]);r(x-1.5,d-5,3,1,'#0c0d10');
   if(!fallen&&k>0&&k<n)for(const t of [z-8,10]){r(x-2,d-t-1.5,4,3,EDGE);r(x-1.5,d-t-1,3,2,ST[3]);}}},
 // A sawhorse barricade: two boards striped orange and white on a pair of steel A-frame legs seen end on, feet on the ground.
 // lit: the amber flasher clipped to the top is on.
 barrier(g,o){const {r,p,l,e}=g,w=o.w,h=o.h,z=o.z,d=h/2,yt=d-z+3;r(-1,h-1,w+2,2.5,SHADOW);
  for(const x of [5,w-7]){r(x-2,-1,6,2,EDGE);r(x-1.5,-.5,5,1,ST[1]);l(x+1,yt,x+1,0,2.5,EDGE);l(x+1,yt,x+1,0,1.5,ST[1]);l(x+1,yt,x+1,h,2.5,EDGE);l(x+1,yt,x+1,h,1.5,ST[2]);r(x+.5,yt,.5,h-yt,ST[3]);r(x-2,h-1.5,6,2,EDGE);r(x-1.5,h-1,5,1,ST[1]);}
  for(const t of [z-3,z-11]){const y=d+1-t,hh=5;r(-1.5,y-.5,w+3,hh+1,EDGE);r(-1,y,w+2,hh,WH[1]);
   for(let a=-6;a<w+2;a+=8)p([[a,y],[a+4,y],[a-1,y+hh],[a-5,y+hh]].map(([x,yy])=>[Math.min(w+1,Math.max(-1,x)),yy]),OR[2]);r(-1,y,w+2,.5,'#ffffff30');r(-1,y+hh-.5,w+2,.5,'#00000030');}
  const fx=6,fy=yt-3;r(fx-3,fy-1,6,5,EDGE);r(fx-2.5,fy-.5,5,4,ST[1]);if(o.lit){e(fx,fy-1.5,8,6,'#ffb03030');e(fx,fy-1.5,4,3.5,'#ffb03050');}e(fx,fy-1.5,2.8,2.6,EDGE);e(fx,fy-1.5,2.2,2,o.lit?'#ffb030':'#6a4a1a');if(o.lit)e(fx-.6,fy-2.2,.9,.8,'#fff0c0');},
 // A traffic cone on its square base, a reflective white band round it. variant 1: knocked over, lying with its tip to the right.
 cone(g,o){const {r,p,e}=g,w=o.w,h=o.h,cx=w/2;
  if((o.variant|0)===1){const y=h-3;e(cx+2,h,9,1.8,SHADOW);p([[1,y-4],[14,y-1],[14,y],[1,y+3]],EDGE);p([[1.5,y-3.5],[13.5,y-1],[13.5,y-.25],[1.5,y+2.5]],OR[2]);p([[1.5,y-3.5],[13.5,y-1],[13.5,y-.6],[1.5,y-1.5]],OR[3]);
   p([[6,y-2.5],[9,y-1.9],[9,y+.9],[6,y+1.6]],WH[2]);r(-1.5,y-7,3,12,EDGE);r(-1,y-6.5,2,11,'#1e2024');r(-1,y-6.5,.5,11,'#3a3d42');return;}
  const zt=o.z,cyb=h/2-1.5,ty=h/2-zt;e(cx,h,w/2+1.5,1.8,SHADOW);bx(g,-1,0,w+2,h,0,1.5,'#26282c','#1a1c1f','#3a3d42');
  const sil=k=>[[cx,ty-k],[cx+3.6+k,cyb],[cx-3.6-k,cyb]];p(sil(.6),EDGE);e(cx,cyb,3.6+.6,2+.6,EDGE);e(cx,cyb,3.6,2,OR[1]);p(sil(0),OR[2]);p([[cx,ty],[cx-1,cyb+1],[cx-3.6,cyb]],OR[3]);p([[cx,ty],[cx+3.6,cyb],[cx+1.6,cyb+1.5]],OR[1]);
  const hw=y=>3.6*(y-ty)/(cyb-ty);p([[cx-hw(ty+4.5),ty+4.5],[cx+hw(ty+4.5),ty+4.5],[cx+hw(ty+7),ty+7],[cx-hw(ty+7),ty+7]],WH[2]);r(cx+hw(ty+4.5)-1,ty+4.5,1,2.5,WH[0]);},
 // A heap of excavated dirt and clay: lumpy, lit from the top left, orange clay turned up in it, stones and clods round its foot,
 // and a shovel stuck in near the top.
 dirtpile(g,o){const {r,e,l,p}=g,w=o.w,h=o.h,z=o.z,s=(o.x|0)+(o.y|0)*3,sx=w/130,sy=h/70,sz=z/40,
   B=[[65,46,63,22],[36,40,32,20],[94,38,34,20],[60,26,40,24],[86,18,30,20],[48,14,26,16],[66,4,22,14]].map(([x,y,a,b],i)=>[x*sx,y*sy-(i>2?(sz-1)*(i-2)*6:0),a*sx,b*Math.min(sx,sy)]);
  e(w/2,h-6*sy,w/2+2,8,SHADOW);for(const [x,y,a,b] of B)e(x,y,a+1,b+1,EDGE);for(const [x,y,a,b] of B)e(x,y,a,b,DT[1]);for(const [x,y,a,b] of B)e(x-a*.08,y-b*.12,a*.9,b*.82,DT[2]);
  for(const [x,y,a,b] of B)if(y<B[0][1]-6)e(x-a*.2,y-b*.28,a*.6,b*.5,DT[3]);for(const [x,y,a,b] of B.slice(4))e(x-a*.3,y-b*.42,a*.32,b*.22,DT[4]);
  for(let i=0;i<5;i++){const x=(24+hash(i,s)*80)*sx,y=(8+hash(s,i)*32)*sy;const a=6+hash(i,2)*9;e(x,y,a,1.6+hash(2,i)*1.4,CLAY[0]);e(x-a*.25,y-.5,a*.55,.8,CLAY[1]);}
  for(let i=0;i<60;i++){const x=(10+hash(i,s+4)*110)*sx,y=(4+hash(s+4,i)*54)*sy;r(x,y,.5+hash(i,1),.5,i%3?DT[0]:DT[4]);}
  for(let i=0;i<9;i++){const a=hash(i,s+6)*Math.PI,x=w/2+Math.cos(a)*(w/2-2)*(.9+hash(i,9)*.12),y=B[0][1]+Math.sin(a)*B[0][3]*1.02,q=1+hash(9,i)*2;e(x,y,q+.5,q*.7+.5,EDGE);e(x,y,q,q*.7,i%3?DT[2]:CN[2]);e(x-q*.3,y-q*.3,q*.4,q*.25,i%3?DT[3]:CN[4]);}
  // The shovel: the blade half sunk in the dirt, the handle leaning out with its D grip.
  const bx0=86*sx,by0=10*sy-(sz-1)*10;p([[bx0-4.5,by0+.5],[bx0+4.5,by0+.5],[bx0+3.5,by0-5],[bx0-3.5,by0-5]],EDGE);p([[bx0-4,by0],[bx0+4,by0],[bx0+3,by0-4.5],[bx0-3,by0-4.5]],ST[3]);r(bx0-3,by0-4.5,6,.5,ST[4]);
  e(bx0,by0+.5,6,1.6,DT[2]);const hx=bx0+14,hy=by0-36;l(bx0,by0-4,hx,hy,2.6,EDGE);l(bx0,by0-4,hx,hy,1.6,WD[3]);l(bx0,by0-4,hx,hy,.5,WD[4]);for(const [x0,y0,x1,y1] of [[hx-1,hy,hx-1,hy-5],[hx+4,hy-1,hx+4,hy-6],[hx-1,hy-5.5,hx+4,hy-6.5]])l(x0,y0,x1,y1,2.5,EDGE);l(hx-1,hy,hx-1,hy-5,1.5,WD[2]);l(hx+4,hy-1,hx+4,hy-6,1.5,WD[2]);l(hx-1,hy-5.5,hx+4,hy-6.5,1.5,WD[3]);},
 // A bundle of rebar on two wooden blocks: rusty rods along its length, a few longer or bent at the ends, wire ties round it.
 rebar(g,o){const {r,l,e}=g,w=o.w,h=o.h,z=o.z,s=(o.x|0)+(o.y|0)*3;r(-2,h-1,w+4,3,SHADOW);for(const x of [12,w-20])bx(g,x,1,8,h-2,0,3,WD[2],WD[1],WD[3]);
  const rows=[];for(let d=4;d<h-3;d+=1.4)rows.push([d,z]);for(let t=z-1.4;t>3.5;t-=1.4)rows.push([h-3,t]);
  rows.forEach(([d,t],i)=>{const y=d-t,x0=-2+hash(i,s)*5,x1=w+2-hash(s,i)*5,c=RUST[1+(i%3)];l(x0,y,x1,y,1.7,EDGE);l(x0,y,x1,y,1,c);if(hash(i,s+3)>.88)l(x1,y,x1+4,y-4,1,c);r(x1-1,y-.5,1,1,RUST[0]);});
  for(const x of [w*.3,w*.7]){r(x-.5,-z+3,1.5,h-1,EDGE);r(x-.25,-z+3.5,1,h-2,ST[3]);}}};
// Library entries: each kind at its default size, with its variants and options.
const S=(kind,name,samples)=>({set:'town',kind,name,group:'Building site',samples:samples.map(o=>({kind,x:40,y:40,...o}))});
export const SITE_SAMPLES=[
 S('houseframe','House frame',[{w:320,h:150,z:110,variant:0},{w:320,h:150,z:110,variant:1},{w:320,h:150,z:110,variant:2}]),
 S('slab','Concrete slab',[{w:280,h:140,z:4}]),
 S('scaffold','Scaffolding',[{w:130,h:26,z:104}]),
 S('portajohn','Portable toilet',[{w:24,h:24,z:58,variant:0},{w:24,h:24,z:58,variant:1,occupied:true},{w:58,h:24,z:26,variant:2}]),
 S('lumber','Lumber stack',[{w:96,h:26,z:22},{w:70,h:36,z:10,variant:1}]),
 S('pipes','Concrete pipes',[{w:90,h:44,z:72}]),
 S('sitetrailer','Site office trailer',[{w:250,h:86,z:72},{w:250,h:86,z:72,lit:true}]),
 S('excavator','Excavator',[{w:200,h:90,z:120}]),
 S('sitefence','Site fencing',[{w:200,h:4,z:38},{w:200,h:4,z:38,gap:true}]),
 S('barrier','Barricade',[{w:52,h:8,z:24},{w:52,h:8,z:24,lit:true}]),
 S('cone','Traffic cone',[{w:8,h:8,z:13},{w:8,h:8,z:13,variant:1}]),
 S('dirtpile','Dirt pile',[{w:130,h:70,z:40}]),
 S('rebar','Rebar bundle',[{w:80,h:20,z:12}])];
