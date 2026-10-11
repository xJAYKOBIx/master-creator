// Civic props for the suburbs: the elementary school and its gym, the school bus, a flagpole and a bike rack; the white clapboard
// church, its gravestones, wrought-iron fence and cemetery gate; and the water tower, the biggest landmark on the map. Same
// conventions as street.js: footprint top left at (0, 0), height rising into negative y, roofs seen from above and the south face
// seen front on. The bus lies along the road like the cars (length w, depth h) and faces right.
import {hash2 as hash} from '../core/paint.js';
import {EDGE,SHADOW} from './camp.js';
const BRICK=['#2e1d1a','#432a24','#56352d','#684239'],ROOF=['#202226','#292c31','#33363c','#3f434a'],CONC=['#3c3d3a','#555652','#6e6f6a','#878881'],
 NIGHT=['#141b27','#1d2a3c','#2a3c55'],FRAME=['#3e4248','#5c6168','#7c828a'],BLIND=['#5e5a50','#7a766a','#948f82'],MET=['#2a2e33','#353a40','#41474e','#4e555d'],
 STEEL=['#252a31','#323942','#414a55','#525c68'],WOOD=['#2e2018','#432e20','#57402c','#6a4e36'],WHITE=['#5c5e5b','#787a76','#959791','#b0b1aa'],
 SHINGLE=['#1c1e23','#24272d','#2c3037','#363a42'],STONE=['#383a3a','#515456','#6a6d6f','#838688'],MOSS=['#2a3622','#36462c','#465a36'],IRON=['#101114','#1b1d21','#2b2e34','#41454c'],
 TANK=['#38404a','#4e5864','#66727f','#7f8b98'],RUST=['#5e3a24','#7a4c30'],YEL=['#5e4612','#87661c','#a6802a','#bc9638'],GLASS=['#0d1218','#1a2430','#2c3c4c'],
 SG=['#4a262a','#263252','#584a26','#283f32','#3e2848','#583222'],INK='#0a0b0d',TYRE='#0c0d10';
// A box seen from above and the south: footprint x..x+w by y..y+d (y at its foot), rising z. Top and front colours.
const box=(g,x,y,w,d,z,T,F)=>{const {r}=g;r(x-.5,y-z-.5,w+1,d+z+1,EDGE);r(x,y-z,w,d,T);r(x,y-z,w,.5,'#ffffff1c');r(x,y+d-z,w,z,F);r(x,y+d-z,w,.5,'#ffffff26');};
// An arch: a rectangle with a round top, as points.
const arch=(x,y,w,h)=>{const R=w/2,pts=[[x,y+h]];for(let i=0;i<=12;i++){const a=Math.PI*(1+i/12);pts.push([x+R+Math.cos(a)*R,y+R+Math.sin(a)*R]);}pts.push([x+w,y+h]);return pts;};
// Brickwork: courses every four units and a staggered joint here and there, a few bricks a shade lighter.
function brick(g,x0,x1,y0,y1,s){const {r}=g,w=x1-x0;r(x0,y0,w,y1-y0,BRICK[1]);
 for(let y=y0+4,k=0;y<y1;y+=4,k++){r(x0,y,w,.5,BRICK[0]);for(let x=x0+3+hash(k,s)*14,j=0;x<x1-1;x+=9+hash(j++,k+s)*22)r(x,y-3.5,.5,3.5,BRICK[0]);
  for(let j=0;j<w/70;j++)r(x0+hash(j,k*3+s)*(w-8),y-3.5,4+hash(k,j+s)*6,3.5,j%2?BRICK[2]:'#3c251f');}}
// A pane of glass at night: dark blue, lighter low down, a faint streak of reflected sky.
function pane(g,x,y,w,h){const {r,p}=g;r(x,y,w,h,NIGHT[1]);r(x,y+h*.6,w,h*.4,NIGHT[2]);r(x,y,w,.5,NIGHT[0]);p([[x+w*.15,y+h],[x+w*.4,y+h],[x+w*.85,y],[x+w*.6,y]],'#9fb4d014');}
// A smashed pane: the dark room behind, jagged shards left in the corners.
function smash(g,x,y,w,h){const {r,p}=g;r(x,y,w,h,'#06070a');p([[x,y],[x+w*.45,y],[x+w*.1,y+h*.2],[x,y+h*.38]],NIGHT[2]);p([[x+w,y+h],[x+w*.4,y+h],[x+w*.75,y+h*.82],[x+w,y+h*.55]],NIGHT[1]);p([[x+w,y],[x+w,y+h*.22],[x+w*.82,y+h*.08],[x+w*.68,y]],NIGHT[1]);r(x+w*.2,y+h*.1,.5,.5,'#9fb4d0');}
// A paper cutout taped to a classroom window: a star, a pumpkin, a tree, a heart or a snowflake.
function cutout(g,x,y,k){const {r,p,e,l}=g;
 if(k===0){const pts=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i%2?1.2:3;pts.push([x+Math.cos(a)*q,y+Math.sin(a)*q]);}p(pts,'#b49a48');}
 else if(k===1){e(x,y,2.8,2.3,'#a8602a');r(x-.25,y-3.2,.5,1.2,'#4e6a3a');r(x-.8,y-1,.5,2.5,'#8a4c22');r(x+.4,y-1,.5,2.5,'#8a4c22');}
 else if(k===2){p([[x,y-3.5],[x+3,y+2],[x-3,y+2]],'#4e7444');r(x-.5,y+2,1,1.2,'#6a4e36');}
 else if(k===3){e(x-1.2,y-.8,1.5,1.4,'#9a3e3e');e(x+1.2,y-.8,1.5,1.4,'#9a3e3e');p([[x-2.6,y-.4],[x+2.6,y-.4],[x,y+2.6]],'#9a3e3e');}
 else{for(const a of [0,1,2]){const c=Math.cos(a*Math.PI/3)*3,s=Math.sin(a*Math.PI/3)*3;l(x-c,y-s,x+c,y+s,.6,'#c8c6bc');}}}
// A classroom window: an aluminium frame, three tall panes under a row of transoms, a concrete sill. Some have their blinds half
// down, some have paper cutouts in them; broken smashes most of the lower panes.
function win(g,x,y,w,h,s,bk){const {r}=g,pw=w/3,th=Math.round(h*.28),bl=hash(s,3)>.64,ct=!bl&&hash(3,s)>.42;
 r(x-1,y-1,w+2,h+2,EDGE);r(x-.5,y-.5,w+1,h+1,FRAME[1]);r(x-.5,y-.5,w+1,.5,FRAME[2]);
 for(let i=0;i<3;i++){const px=x+i*pw+.75,q=pw-1.5,ly=y+th+.5,lh=h-th-1.25;pane(g,px,y+.75,q,th-1.25);
  if(bk&&hash(i,s+5)<.75){smash(g,px,ly,q,lh);continue;}pane(g,px,ly,q,lh);
  if(bl){const d=lh*(.25+hash(i,s+1)*.6);r(px,ly,q,d,BLIND[1]);for(let yy=ly+1.5;yy<ly+d-1;yy+=1.5)r(px,yy,q,.5,BLIND[0]);r(px,ly+d-1,q,1,BLIND[2]);}
  else if(ct&&hash(s,i+9)>.3){cutout(g,px+q/2+(hash(i,s+2)-.5)*3,ly+3.5+hash(s+2,i)*(lh-9),Math.floor(hash(s+i,4)*5));}}
 r(x-2.5,y+h+.5,w+5,3,EDGE);r(x-2,y+h+1,w+4,2,CONC[2]);r(x-2,y+h+1,w+4,.5,CONC[3]);r(x-2.5,y-4.5,w+5,3.5,BRICK[2]);for(let k=x-1;k<x+w+2;k+=2.5)r(k,y-4.5,.5,3.5,BRICK[0]);}
// A vent or exhaust stack standing on a flat roof: a short cylinder with a cap.
function vent(g,x,y,rad,ht){const {r,e}=g;e(x+rad*.6,y+.5,rad+1,rad*.7,'#00000040');r(x-rad-.5,y-ht,rad*2+1,ht,EDGE);r(x-rad,y-ht,rad*2,ht,MET[1]);r(x-rad,y-ht,rad*.7,ht,MET[2]);e(x,y-ht,rad+.5,rad*.6+.5,EDGE);e(x,y-ht,rad,rad*.6,MET[3]);e(x,y-ht,rad*.5,rad*.3,MET[0]);}
// One leaf of an iron gate or a run of fence between two points of its footprint (screen x along it, depth y), bars every 3.5
// units with spear tips, rails top and bottom; the height rises from ha at the start to hb at the end. Anything behind shows between bars.
function ironRun(g,ax,ay,bx,by,ha,hb,step=3.5){const {r,p,l}=g,n=Math.max(1,Math.round(Math.hypot(bx-ax,by-ay)/step));
 const at=t=>[ax+(bx-ax)*t,ay+(by-ay)*t,ha+(hb-ha)*t];
 for(const f of [.1,.55]){const [x1,y1,h1]=at(0),[x2,y2,h2]=at(1);l(x1,y1-h1*f-1,x2,y2-h2*f-1,1.5,IRON[1]);}
 for(let i=0;i<=n;i++){const [x,y,hh]=at(i/n);r(x-.6,y-hh+1,1.2,hh-1,IRON[1]);r(x-.6,y-hh+1,.4,hh-1,IRON[3]);p([[x-1.2,y-hh+2],[x,y-hh-1],[x+1.2,y-hh+2]],IRON[2]);}
 const [x1,y1,h1]=at(0),[x2,y2,h2]=at(1);l(x1,y1-h1+3,x2,y2-h2+3,1.4,IRON[1]);l(x1,y1-h1+2.6,x2,y2-h2+2.6,.4,IRON[3]);l(x1,y1-2,x2,y2-2,1.2,IRON[1]);}
// A gravestone's slab, by shape: its outline grown by k units. Round top (0), square (2).
const slabPts=(v,x0,x1,yb,yt,k)=>{if(v===2)return [[x0-k,yb+k],[x0-k,yt-k],[x1+k,yt-k],[x1+k,yb+k]];const R=(x1-x0)/2,cx=x0+R,pts=[[x0-k,yb+k]];for(let i=0;i<=12;i++){const a=Math.PI*(1+i/12);pts.push([cx+Math.cos(a)*(R+k),yt+R+Math.sin(a)*(R+k)]);}pts.push([x1+k,yb+k]);return pts;};
export const CIVIC_ART={
 // The elementary school: one long brick storey under a flat tar roof with its parapet, rooftop units and vents; a row of classroom
 // windows, the double glass doors at door under a flat canopy, and a blank plaque with an apple over the entry. broken smashes some.
 school(g,o){const {r,p,e,l}=g,w=o.w,h=o.h,z=o.z,F=h-z,dx=o.door??w/2,s=((o.x|0)*7+(o.y|0)*3)&1023;
  r(dx-32,h,64,9,CONC[1]);r(dx-32,h,64,.5,CONC[2]);r(-3,h-1,w+6,4,SHADOW);r(-1,h-1,w+2,2,SHADOW);r(-.5,-z-.5,w+1,h+z+1,EDGE);
  // The roof: membrane in long strips, a few tar patches, gravel specks; the coping round the parapet and its shadow inside.
  r(0,-z,w,h,ROOF[1]);for(let x=26;x<w-6;x+=32)r(x,-z+4,.5,h-8,ROOF[0]);
  for(let i=0;i<Math.max(3,w/110);i++)r(10+hash(i,s+1)*(w-50),-z+10+hash(s+2,i)*(h-36),16+hash(i,s+3)*24,8+hash(s,i+3)*12,ROOF[0]);
  for(let i=0;i<w*h/110;i++)r(3+hash(i,s+4)*(w-6),-z+3+hash(s+5,i)*(h-6),.5,.5,i%3?ROOF[2]:ROOF[0]);
  for(let i=0;i<3;i++)e(40+hash(i,s+6)*(w-80),-z+30+hash(s+6,i)*(h-60),14+hash(i,s+7)*10,7,'#00000022');
  r(0,-z,w,3,CONC[2]);r(0,F-3,w,3,CONC[2]);r(0,-z,3,h,CONC[2]);r(w-3,-z,3,h,CONC[2]);r(0,-z,w,.5,CONC[3]);r(0,-z,.5,h,CONC[3]);r(3,-z+3,w-6,1.5,'#00000048');r(3,-z+3,1.5,h-6,'#00000030');
  // Rooftop units: boxy air handlers with a fan grille on top, a hatch, vent stacks.
  for(const [fx,fy,uw,ud,uz] of [[.14,50,32,24,14],[.58,92,36,26,16],[.83,40,28,22,12]]){const x=Math.round(w*fx),y=fy-z;r(x+3,y,uw+4,4,'#00000040');box(g,x,y,uw,ud,uz,MET[3],MET[1]);
   for(let k=x+3;k<x+uw-2;k+=3)r(k,y+ud-uz+2,.5,uz-4,MET[0]);const fc=x+uw*.62,fyc=y-uz+ud/2;e(fc,fyc,ud*.36,ud*.3,EDGE);e(fc,fyc,ud*.32,ud*.26,MET[0]);l(fc-ud*.3,fyc,fc+ud*.3,fyc,.6,MET[2]);l(fc,fyc-ud*.25,fc,fyc+ud*.25,.6,MET[2]);r(x+3,y-uz+3,uw*.3,ud-6,MET[2]);}
  box(g,Math.round(w*.34),60-z,16,14,3,MET[2],MET[1]);
  for(const [fx,fy,rd,ht] of [[.07,30,2.5,7],[.27,110,3,8],[.44,40,2,6],[.49,120,2.5,7],[.71,130,3,9],[.94,110,2,6]])vent(g,Math.round(w*fx),fy-z,rd,ht);
  // The front wall: brick, the coping along its top, a concrete footing, downspouts at the ends.
  brick(g,0,w,F,h,s);r(0,F,w,2.5,CONC[1]);r(0,F,w,.5,CONC[3]);r(0,F+2.5,w,1,'#00000050');r(0,h-4,w,4,CONC[0]);r(0,h-4,w,.5,CONC[1]);
  for(const x of [4,w-7]){r(x-.5,F+3,3,h-F-5,EDGE);r(x,F+3,2,h-F-5,MET[1]);r(x,F+3,.5,h-F-5,MET[3]);}
  // Classroom windows in a long row out from the entry each way.
  const ww=44,wh=36,wy=h-64,xs=[];for(let x=dx-56-ww;x>14;x-=60)xs.push(x);for(let x=dx+56;x+ww<w-14;x+=60)xs.push(x);
  xs.forEach(x=>win(g,x,wy,ww,wh,(x|0)+s,o.broken&&hash(x|0,s+11)<.4));
  // The entry: double glass doors in an aluminium frame, push bars across, the pad in front.
  const ex=dx-22,ey=h-44;r(ex-1.5,ey-1.5,47,45.5,EDGE);r(ex-1,ey-1,46,45,FRAME[1]);r(ex-1,ey-1,46,.5,FRAME[2]);
  for(const [i,x] of [[0,ex+.5],[1,dx+.5]]){r(x,ey+.5,21,43,FRAME[1]);if(o.broken&&i===1)smash(g,x+2,ey+2.5,17,38.5);else pane(g,x+2,ey+2.5,17,38.5);r(x+2,ey+20,17,2,EDGE);r(x+2,ey+20.5,17,1,FRAME[2]);r(x+2,ey+20.5,17,.5,'#a8aeb6');}
  r(dx-.5,ey,1,43,EDGE);
  // The plaque over the entry: cast stone with a border, an apple in a blue disc and a rule each side; no lettering.
  const py=F+14;r(dx-33.5,py-.5,67,21,EDGE);r(dx-33,py,66,20,CONC[2]);r(dx-33,py,66,.5,CONC[3]);r(dx-31,py+2,62,16,CONC[1]);r(dx-30.5,py+2.5,61,15,CONC[2]);
  e(dx,py+10,6.5,6.5,EDGE);e(dx,py+10,6,6,'#2c3a56');e(dx,py+10.5,3.2,3,'#8a2e2a');e(dx-1,py+9.5,1,.8,'#b05048');l(dx,py+7.5,dx+.5,py+6,.6,'#4a3424');e(dx+1.6,py+6.6,1.3,.6,'#4e7444');
  for(const sx of [-1,1]){r(dx+sx*18-8,py+9.5,16,1,CONC[0]);r(dx+sx*18-8,py+10.5,16,.5,CONC[3]);}
  // The canopy: a flat slab on two posts, its top seen from above, a fascia and its shadow on the wall.
  const cx0=dx-37,cw=74;r(cx0+3,h-41,cw-6,3,'#00000044');for(const x of [cx0+2,cx0+cw-4.5]){r(x-.5,h-42,3.5,h+9.5-(h-42),EDGE);r(x,h-42,2.5,h+9-(h-42),FRAME[1]);r(x,h-42,.5,h+9-(h-42),FRAME[2]);}
  r(cx0-.5,h-56.5,cw+1,15,EDGE);r(cx0,h-56,cw,10,CONC[2]);r(cx0,h-56,cw,.5,CONC[3]);r(cx0,h-46,cw,4,FRAME[1]);r(cx0,h-46,cw,.5,FRAME[2]);r(cx0,h-42.5,cw,.5,FRAME[0]);},
 // The school gym: a tall brick box under a low metal roof (ridge across the middle, standing seams), a ribbon of high windows,
 // a faded paw-print crest and the double steel doors in the middle of the front. boarded nails planks over the doors; open bursts them.
 gym(g,o){const {r,p,e,l}=g,w=o.w,h=o.h,z=o.z,F=h-z,s=((o.x|0)*5+(o.y|0)*9)&1023,yr=Math.round(h/2)-z-10,dx=w/2;
  r(dx-30,h,60,8,CONC[1]);r(dx-30,h,60,.5,CONC[2]);r(-3,h-1,w+6,4,SHADOW);r(-1,h-1,w+2,2,SHADOW);r(-2,-z-.5,w+4,h+z+1,EDGE);
  // The roof: the far slope in shade, the near slope lit, seams down both, a ridge cap and two turbine vents on it.
  r(-1.5,-z,w+3,yr+z,MET[1]);r(-1.5,yr,w+3,F-yr,MET[2]);for(let x=2;x<w;x+=6){r(x,-z,.5,yr+z,MET[0]);r(x,yr,.5,F-yr,MET[0]);r(x+.5,yr,.5,F-yr,MET[3]);}
  for(let i=0;i<5;i++){const x=10+hash(i,s)*(w-30);r(x,yr+4+hash(s,i)*20,1,10+hash(i,s+1)*30,'#5e443244');}
  r(-1.5,yr-1.5,w+3,3,MET[3]);r(-1.5,yr+1.5,w+3,.5,MET[0]);r(-1.5,-z,w+3,.5,MET[2]);r(-1.5,F-1.5,w+3,1.5,MET[3]);r(-1.5,F,w+3,1.5,'#0d0e11');
  for(const x of [w*.3,w*.7]){e(x,yr,6,4,'#00000040');r(x-4.5,yr-8,9,8,EDGE);r(x-4,yr-8,8,8,MET[2]);for(let k=-3;k<4;k+=2)r(x+k,yr-8,.5,8,MET[0]);e(x,yr-8,4.5,3,EDGE);e(x,yr-8,4,2.5,MET[3]);}
  // The front wall: brick between pilasters, a concrete block base, downspouts at the corners.
  brick(g,0,w,F+1.5,h,s);for(let x=8;x<w;x+=Math.round((w-16)/6)){r(x,F+1.5,5,h-F-6,BRICK[2]);r(x,F+1.5,.5,h-F-6,BRICK[3]);r(x+5,F+1.5,.75,h-F-6,'#00000040');}
  r(0,h-20,w,16,CONC[1]);for(let y=h-16;y<h-4;y+=4)r(0,y,w,.5,CONC[0]);for(let x=4,k=0;x<w;x+=8,k++)for(let y=h-20;y<h-4;y+=8)r(x+((y/4|0)%2)*4,y,.5,4,CONC[0]);r(0,h-20,w,.5,CONC[2]);r(0,h-4,w,4,CONC[0]);
  for(const x of [3,w-6]){r(x-.5,F+2,3,h-F-4,EDGE);r(x,F+2,2,h-F-4,MET[1]);r(x,F+2,.5,h-F-4,MET[3]);}
  // The clerestory: a ribbon of wired glass high up, mullions every so often, a sill under it.
  const cy=F+14,ch=20;r(10.5,cy-1,w-21,ch+2,EDGE);r(11,cy-.5,w-22,ch+1,FRAME[1]);for(let x=12;x<w-12;x+=18){const q=Math.min(16,w-12-x);if(q<4)continue;if(o.open&&hash(x|0,s+5)<.3)smash(g,x,cy,q,ch);else pane(g,x,cy,q,ch);for(let k=x+3;k<x+q;k+=4)r(k,cy,.25,ch,'#00000030');r(x,cy+ch/2,q,.25,'#00000030');}
  r(9,cy+ch+1,w-18,2.5,CONC[2]);r(9,cy+ch+1,w-18,.5,CONC[3]);
  // The crest: a faded painted disc with a paw print, centred over the doors.
  const my=F+(h-F)*.46;e(dx,my,19,19,'#5e4e3444');e(dx,my,16.5,16.5,'#2e221c55');e(dx,my+3,6,5,'#7a6a4466');for(const [ax,ay] of [[-7,-4],[-2.5,-8],[2.5,-8],[7,-4]])e(dx+ax,my+ay,2.4,2.8,'#7a6a4466');
  // The doors: two steel leaves with narrow vision panels and push bars, a frame, a dark lamp over them.
  const ex=dx-22,ey=h-46;r(ex-2,ey-2,48,48,EDGE);r(ex-1.5,ey-1.5,47,47.5,STEEL[0]);r(dx-4,ey-8,8,4,EDGE);r(dx-3.5,ey-7.5,7,3,STEEL[2]);r(dx-3,ey-5,6,1,'#3a3c34');
  for(const x of [ex,dx+.5]){r(x,ey,21.5,46,STEEL[2]);r(x,ey,21.5,.5,STEEL[3]);r(x+.5,ey+38,20.5,7,STEEL[1]);r(x+(x<dx?14:3),ey+5,4,14,EDGE);pane(g,x+(x<dx?14.5:3.5),ey+5.5,3,13);r(x+2,ey+23,17.5,2.5,EDGE);r(x+2.5,ey+23.5,16.5,1.5,FRAME[2]);}
  r(dx-.25,ey,.5,46,EDGE);
  // open: burst outward from inside, the leaves flung back against the wall either side, the gym black behind them, smears
  // dragged out across the step and some of the high windows broken.
  if(o.open){r(ex-.5,ey-.5,45,46.5,EDGE);r(ex,ey,44,46,'#060708');r(ex,ey+32,44,14,'#0d0e11');r(ex,ey,44,.5,'#1c1e22');
   for(const x of [ex-8,dx+23]){r(x-.5,ey-.5,8,47,EDGE);r(x,ey,7,46,STEEL[1]);r(x,ey,7,.5,STEEL[3]);r(x+(x<dx?.5:4.5),ey+5,2,14,'#1a1b1e');r(x+.5,ey+23,6,2,FRAME[2]);}
   for(let i=0;i<4;i++){const x=dx-15+i*9+hash(i,s)*4;l(x,ey+40,x+(hash(s,i)-.5)*12,h+7,2+hash(i,s+3),'#4a1612a0');}}
  if(o.boarded){// Planks nailed across both leaves, one on the slant.
   const pl=(x1,y1,x2,y2,t)=>{p([[x1,y1-.5],[x2,y2-.5],[x2,y2+t+.5],[x1,y1+t+.5]],EDGE);p([[x1+.5,y1],[x2-.5,y2],[x2-.5,y2+t],[x1+.5,y1+t]],WOOD[2]);l(x1+.5,y1+.5,x2-.5,y2+.5,.5,WOOD[3]);l(x1+.5,y1+t-.5,x2-.5,y2+t-.5,.5,WOOD[0]);for(const f of [.06,.94]){r(x1+(x2-x1)*f-.5,y1+(y2-y1)*f+t/2-.5,1,1,'#8a8e94');}};
   pl(ex-6,ey+6,ex+50,ey+8,5);pl(ex-5,ey+20,ex+49,ey+19,5.5);pl(ex-6,ey+34,ex+50,ey+35,5);pl(ex-2,ey+42,ex+46,ey+2,5);}},
 // The church: a white clapboard nave under a steep shingled roof (ridge running away from you), a square bell tower at the front
 // with a louvred belfry and a tall white spire with a cross at the top, arched windows of dim stained glass, wooden doors and steps.
 church(g,o){const {r,p,e,l}=g,w=o.w,h=o.h,cx=w/2,x0=6,x1=w-6,yn=h-26,Wz=70,Rz=140,eF=yn-Wz,rF=yn-Rz,ty1=h-12,ty0=ty1-46,Tz=150,Bz=205,ax=cx,ay=(ty0+ty1)/2-465;
  e(cx,h-2,w/2+4,8,SHADOW);r(x0-4,yn-2,x1-x0+8,4,SHADOW);
  // The nave roof: two slopes from the eaves up to the ridge, shingle courses running back, the near rake over the gable.
  p([[x0-4,-Wz-.5],[cx,-Rz-1.5],[x1+4,-Wz-.5],[x1+4,eF+4],[x1+.5,eF+4],[x1+.5,yn+.5],[x0-.5,yn+.5],[x0-.5,eF+4],[x0-4,eF+4]],EDGE);
  p([[x0-3,-Wz],[cx,-Rz],[cx,rF+3],[x0-3,eF+3]],SHINGLE[2]);p([[cx,-Rz],[x1+3,-Wz],[x1+3,eF+3],[cx,rF+3]],SHINGLE[1]);
  for(let x=x0;x<x1;x+=5){const t=x<cx?(x-x0+3)/(cx-x0+3):(x1+3-x)/(x1+3-cx),yt=-Wz-(Rz-Wz)*t;r(x,yt+1,.5,yn+1,x<cx?SHINGLE[1]:SHINGLE[0]);}
  for(let i=0;i<10;i++){const x=x0+hash(i,7)*(x1-x0),t=x<cx?(x-x0)/(cx-x0):(x1-x)/(x1-cx),yt=-Wz-(Rz-Wz)*t;r(x,yt+10+hash(7,i)*(yn-30),4,3,x<cx?SHINGLE[3]:SHINGLE[2]);}
  r(cx-1,-Rz,2,yn+3,SHINGLE[3]);r(cx+1,-Rz,.5,yn+3,SHINGLE[0]);
  // The front of the nave: the gable and wall in white clapboard, corner boards, a stone footing.
  const gab=[[x0,eF],[cx,rF],[x1,eF],[x1,yn],[x0,yn]];p(gab,WHITE[2]);
  for(let y=rF+4;y<yn-3;y+=4){const hw=y<eF?(y-rF)/(eF-rF)*(cx-x0):cx-x0;r(cx-hw,y,hw*2,.5,WHITE[0]);r(cx-hw,y+.5,hw*2,.5,WHITE[3]);}
  r(x0,eF,3,yn-eF,WHITE[3]);r(x1-3,eF,3,yn-eF,WHITE[1]);r(x0,yn-4,x1-x0,4,STONE[1]);r(x0,yn-4,x1-x0,.5,STONE[2]);
  l(x0-3,eF+2,cx,rF+2,3.5,EDGE);l(x1+3,eF+2,cx,rF+2,3.5,EDGE);l(x0-3,eF+1.5,cx,rF+1.5,2.5,WHITE[3]);l(x1+3,eF+1.5,cx,rF+1.5,2.5,WHITE[2]);
  // Arched windows of stained glass either side of the tower: lead lines, dim coloured panes, a rosette in the arch.
  const sg=(x,y,ww,hh,k)=>{p(arch(x-1.5,y-1.5,ww+3,hh+3),EDGE);p(arch(x-1,y-1,ww+2,hh+2),WHITE[3]);p(arch(x,y,ww,hh),'#15141c');const c=4,pw=(ww-1)/c;
   for(let i=0;i<c;i++)for(let j=0;(y+ww/2+1+j*5)<y+hh-1;j++){const yy=y+ww/2+1+j*5;r(x+.5+i*pw+.25,yy,pw-.5,Math.min(4.5,y+hh-1-yy),SG[(i+j*3+k)%6]);}
   e(x+ww/2,y+ww/2,ww/2-1.5,ww/2-1.5,'#15141c');e(x+ww/2,y+ww/2+.5,ww/2-2.5,ww/2-3,SG[(k+2)%6]);e(x+ww/2,y+ww/2+.5,ww/4,ww/4-.5,SG[(k+4)%6]);r(x-2,y+hh+1,ww+4,2,WHITE[3]);r(x-2,y+hh+3,ww+4,.5,WHITE[0]);};
  sg(cx-88,eF+12,22,46,0);sg(cx+66,eF+12,22,46,3);
  // The tower: clapboard, corner boards, a round window and a little arched one, the doors at its foot.
  r(cx-30.5,ty1-Tz-.5,61,Tz+1,EDGE);r(cx-30,ty0-Tz,60,ty1-ty0,WHITE[3]);r(cx-30,ty1-Tz,60,Tz,WHITE[2]);for(let y=ty1-Tz+4;y<ty1-2;y+=4){r(cx-30,y,60,.5,WHITE[0]);r(cx-30,y+.5,60,.5,WHITE[3]);}
  r(cx-30,ty1-Tz,3,Tz,WHITE[3]);r(cx+27,ty1-Tz,3,Tz,WHITE[1]);r(cx-30,ty1-Tz,60,.5,'#ffffff30');
  e(cx,ty1-82,9.5,9.5,EDGE);e(cx,ty1-82,9,9,WHITE[3]);e(cx,ty1-82,7,7,'#15141c');for(let i=0;i<8;i++){const a=i/8*Math.PI*2;e(cx+Math.cos(a)*4.2,ty1-82+Math.sin(a)*4.2,1.8,1.8,SG[i%6]);}e(cx,ty1-82,1.8,1.8,SG[2]);
  sg(cx-6,ty1-136,12,26,1);
  p(arch(cx-15,ty1-45,30,45.5),EDGE);p(arch(cx-14,ty1-44,28,44),WHITE[3]);p(arch(cx-12,ty1-42,24,42),WOOD[1]);for(const x of [cx-11,cx+1]){r(x+1.5,ty1-28,7,10,WOOD[2]);r(x+1.5,ty1-14,7,10,WOOD[2]);r(x+1.5,ty1-28,7,.5,WOOD[3]);r(x+1.5,ty1-14,7,.5,WOOD[3]);}
  r(cx-.5,ty1-42,1,42,WOOD[0]);r(cx-3,ty1-21,1,3,'#c9a24a');r(cx+2,ty1-21,1,3,'#c9a24a');
  // The steps up to the doors.
  box(g,cx-19,ty1,38,6,4,STONE[3],STONE[1]);box(g,cx-23,ty1+6,46,6,2,STONE[3],STONE[1]);
  // The belfry: a narrower stage on a ledge, an arched louvred opening, then the spire's flared foot.
  r(cx-32,ty1-Tz-4,64,4.5,EDGE);r(cx-31.5,ty1-Tz-3.5,63,3.5,WHITE[3]);r(cx-31.5,ty1-Tz-.5,63,.5,WHITE[0]);
  const by1=ty1-4,bh=Bz-Tz;r(cx-25.5,by1-Bz-.5,51,bh+.5,EDGE);r(cx-25,by1-Bz,50,bh,WHITE[2]);r(cx-25,by1-Bz,3,bh,WHITE[3]);r(cx+22,by1-Bz,3,bh,WHITE[1]);
  p(arch(cx-12.5,by1-Bz+11.5,25,bh-15),EDGE);p(arch(cx-12,by1-Bz+12,24,bh-16),'#0c0c10');for(let y=by1-Bz+20;y<by1-Tz-5;y+=3.5){r(cx-11,y,22,1.5,WHITE[1]);r(cx-11,y+1.5,22,.5,WHITE[0]);}
  // The spire: a tall four-sided point, the front face mid, the left sliver lit, the right in shade, courses across it.
  const sb=by1-Bz+2,sk=sb-42,sw=29;p([[cx-sw-1,sb+1],[cx-sw-1,sk],[ax,ay-1.5],[cx+sw+1,sk],[cx+sw+1,sb+1]],EDGE);
  p([[cx-sw,sb],[cx-sw,sk],[ax,ay]],WHITE[3]);p([[cx+sw,sb],[cx+sw,sk],[ax,ay]],WHITE[0]);p([[cx-sw,sb],[cx+sw,sb],[ax,ay]],WHITE[2]);
  for(let y=sb-7;y>ay+10;y-=7){const hw=sw*(y-ay)/(sb-ay);r(cx-hw,y,hw*2,.5,WHITE[1]);}l(cx-sw,sb,ax,ay,.5,WHITE[3]);l(cx+sw,sb,ax,ay,.5,WHITE[1]);r(cx-sw-1,sb-.5,sw*2+2,2,WHITE[3]);r(cx-sw-1,sb+1,sw*2+2,.5,WHITE[0]);
  // The cross at the very top.
  r(ax-1.5,ay-31,3,32,EDGE);r(ax-6.5,ay-25,13,3,EDGE);r(ax-1,ay-30.5,2,31,WHITE[3]);r(ax-6,ay-24.5,12,2,WHITE[3]);r(ax,ay-30.5,1,31,WHITE[1]);},
 // A gravestone, weathered grey with moss at the foot: variant 0 round-topped slab, 1 stone cross, 2 square slab, 3 low flat marker,
 // 4 tall obelisk.
 gravestone(g,o){const {r,p,e,l}=g,w=o.w,h=o.h,z=o.z,v=o.variant|0,cx=w/2,s=((o.x|0)*3+(o.y|0)*7)&1023;e(cx,h-.5,w/2+1.5,2.5,SHADOW);
  const moss=(x0,x1,y)=>{for(let i=0;i<6;i++)e(x0+hash(i,s)*(x1-x0),y-hash(s,i)*2,.8+hash(i,s+1),.6,MOSS[i%3]);};
  if(v===3){// A low marker, its face tilted up toward the sky.
   p([[.5,h-z-.5],[w-.5,h-z-.5],[w+.5,h-2],[w+.5,h+.5],[-.5,h+.5],[-.5,h-2]],EDGE);p([[1,h-z],[w-1,h-z],[w,h-2.5],[0,h-2.5]],STONE[3]);r(0,h-2.5,w,2.5,STONE[1]);
   r(2,h-z+2,w-4,.5,STONE[1]);r(3,h-z+3.5,w-6,.5,STONE[1]);r(2,h-z+.5,w-4,.5,'#ffffff20');moss(0,w,h-2);return;}
  // The plinth.
  const pz=v===4?4:2.5;r(-.5,1-pz-.5,w+1,h+pz,EDGE);r(0,1-pz,w,h-1,STONE[2]);r(0,h-pz,w,pz,STONE[1]);r(0,h-pz,w,.5,STONE[3]);
  const yb=h-pz-1,top=yb-(z-pz)+2,x0=2,x1=w-2;
  if(v===4){// The obelisk: a tapering shaft and its pointed cap.
   const bw=4,tw=2.6,ty=top+6;p([[cx-bw-.5,yb+.5],[cx-tw-.5,ty],[cx,top-1],[cx+tw+.5,ty],[cx+bw+.5,yb+.5]],EDGE);p([[cx-bw,yb],[cx-tw,ty],[cx+tw,ty],[cx+bw,yb]],STONE[2]);
   p([[cx-bw,yb],[cx-tw,ty],[cx-tw+1.2,ty],[cx-bw+1.5,yb]],STONE[3]);p([[cx+bw,yb],[cx+tw,ty],[cx+tw-1,ty],[cx+bw-1.2,yb]],STONE[1]);p([[cx-tw,ty],[cx,top-.5],[cx+tw,ty]],STONE[3]);p([[cx,top-.5],[cx+tw,ty],[cx,ty]],STONE[2]);
   r(cx-1.5,ty+6,3,.5,STONE[1]);r(cx-1,ty+7.5,2,.5,STONE[1]);moss(cx-bw,cx+bw,yb);return;}
  if(v===1){// The cross: an upright and its arm, the top of each catching the light.
   const aw=5,ay=top+4;r(cx-1.75-.5,top-.5,4.5,yb-top+1,EDGE);r(cx-aw-.5,ay-.5,aw*2+1,4,EDGE);r(cx-1.75,top,3.5,yb-top,STONE[2]);r(cx-aw,ay,aw*2,3,STONE[2]);
   r(cx-1.75,top,3.5,1,STONE[3]);r(cx-aw,ay,aw*2,1,STONE[3]);r(cx+1,top+1,.75,yb-top-1,STONE[1]);r(cx-aw,ay+2.5,aw*2,.5,STONE[1]);moss(cx-3,cx+3,yb);return;}
  // A slab: its top edge lit, a face with a carved panel and lines, a crack, moss at the foot.
  p(slabPts(v,x0,x1,yb,top,.5),EDGE);p(slabPts(v,x0,x1,yb-1.5,top,0),STONE[3]);p(slabPts(v,x0,x1,yb,top+1.5,0),STONE[2]);r(x0,top+3,1,yb-top-3,STONE[3]);r(x1-1,top+3,1,yb-top-3,STONE[1]);
  r(cx-3,top+6,6,.5,STONE[1]);r(cx-2.5,top+8,5,.5,STONE[1]);r(cx-3.5,top+10.5,7,.5,STONE[1]);if(hash(s,1)>.4)l(x0+2,top+4+hash(s,2)*6,x0+4,top+9,.4,STONE[0]);moss(x0,x1,yb);},
 // A black wrought-iron fence along its length: spear-topped bars you can see through, rails, posts with ball caps every 40.
 ironfence(g,o){const {r,e}=g,w=o.w,h=o.h,z=o.z,yb=h-1;r(-1,h-1,w+2,3,SHADOW);ironRun(g,0,yb,w,yb,z-4,z-4,4);
  for(const x of [...Array(Math.floor(w/40)+1).keys()].map(k=>Math.min(k*40,w-3)).concat(w-3)){r(x-.5,yb-z+2.5,4,z-1.5,EDGE);r(x,yb-z+3,3,z-2,IRON[1]);r(x,yb-z+3,.75,z-2,IRON[3]);r(x-1,yb-z+2.5,5,1.5,EDGE);r(x-.5,yb-z+3,4,.5,IRON[2]);e(x+1.5,yb-z+1,2,2,EDGE);e(x+1.5,yb-z+1,1.5,1.5,IRON[2]);e(x+1,yb-z+.5,.5,.5,IRON[3]);}},
 // The same fence running away from you: the bars line up into a thin dark line, the spear tips a row of points along its top,
 // the posts standing proud of it every 40, and the ground showing either side.
 ironfenceV(g,o){const {r,e}=g,w=o.w,h=o.h,z=o.z,cx=w/2,H=z-4;r(cx+.5,0,4,h,SHADOW);r(cx-.75,-H+2,1.5,h+H-2,'#1b1d21b0');r(cx-.5,-H+3,1,h-.5,IRON[0]);r(cx-.25,-H+3,.5,h-.5,IRON[3]);r(cx-.75,-.5,1.5,h,IRON[1]);
  for(let y=0;y<=h;y+=4){e(cx,y-H+.5,1,1.6,IRON[1]);r(cx-.25,y-H,.5,.5,IRON[3]);}
  for(const y of [...Array(Math.floor(h/40)+1).keys()].map(k=>Math.min(k*40,h-3)).concat(h-3)){r(cx-2.5,y-z+2.5,5,z-1,EDGE);r(cx-2,y-z+3,4,z-2,IRON[1]);r(cx-2,y-z+3,1,z-2,IRON[3]);e(cx,y-z+1.5,2.5,2,EDGE);e(cx,y-z+1.5,2,1.5,IRON[2]);}},
 // A two-leaf iron cemetery gate between stone pillars with caps and ball finials; the leaves rise to the middle. open swings them in.
 irongate(g,o){const {r,e}=g,w=o.w,h=o.h,z=o.z,pw=10,y=h/2,L=(w-pw*2)/2,H=z-6;e(w/2,h,w/2+3,3,SHADOW);
  if(o.open){const a=Math.PI*.36,c=Math.cos(a)*L,sn=Math.sin(a)*L;ironRun(g,pw,y,pw+c,y-sn,H,H+3,3.5);ironRun(g,w-pw,y,w-pw-c,y-sn,H,H+3,3.5);}
  else{ironRun(g,pw,y,pw+L,y,H,H+4,3.5);ironRun(g,w-pw,y,w-pw-L,y,H,H+4,3.5);r(w/2-.5,y-H-3,1,H+3,IRON[1]);}
  for(const x of [0,w-pw]){r(x-.5,-z+4.5,pw+1,h+z-4,EDGE);r(x,-z+5,pw,h,STONE[2]);r(x,h-z+5,pw,z-5.5,STONE[1]);r(x,h-z+5,1.5,z-5.5,STONE[2]);r(x+pw-1.5,h-z+5,1.5,z-5.5,STONE[0]);
   for(let yy=h-z+13;yy<h-1;yy+=8)r(x,yy,pw,.5,STONE[0]);r(x-2,-z+2,pw+4,h+3.5,EDGE);r(x-1.5,-z+2.5,pw+3,h,STONE[3]);r(x-1.5,h-z+2.5,pw+3,2,STONE[1]);
   e(x+pw/2,-z+3,3.5,3.5,EDGE);e(x+pw/2,-z+3,3,3,STONE[2]);e(x+pw/2-1,-z+2,1.2,1.2,STONE[3]);e(x+pw/2,h-.5,3,1,MOSS[1]);}},
 // The water tower: four splayed steel legs with X bracing, a ladder, a catwalk round the bowl, the big tank with its cone roof,
 // pale grey-blue with rust running down from the seams. lit turns on the red beacon at the top.
 watertower(g,o){const {r,p,e,l}=g,w=o.w,h=o.h,cx=w/2,cy=h/2,R=42,Z0=282,Z1=350,Zl=268,Za=372,s=((o.x|0)+(o.y|0)*5)&1023;
  e(cx,h-6,w/2+6,12,SHADOW);
  // The legs: foot and head of each, back pair first; braces between them at four levels, the back ones darker.
  const leg=(fx,fy,tx,ty)=>t=>[fx+(tx-fx)*t,fy+(ty-fy)*t-Zl*t],BL=leg(8,10,30,cy-15),BR=leg(w-8,10,w-30,cy-15),FL=leg(8,h-8,30,cy+15),FR=leg(w-8,h-8,w-30,cy+15),lv=[.04,.3,.56,.82,1];
  const brace=(A,B,col,wd)=>{for(let i=0;i<lv.length-1;i++){const [a,b,c,d]=[A(lv[i]),B(lv[i]),A(lv[i+1]),B(lv[i+1])];l(a[0],a[1],d[0],d[1],wd,col);l(b[0],b[1],c[0],c[1],wd,col);l(c[0],c[1],d[0],d[1],wd*1.4,col);}};
  const legd=(A,col,hi)=>{const [a,b]=[A(0),A(1)];l(a[0],a[1],b[0],b[1],4.5,EDGE);l(a[0],a[1],b[0],b[1],3.2,col);l(a[0]-1,a[1],b[0]-1,b[1],.7,hi);r(a[0]-3,a[1]-2,6,3,EDGE);r(a[0]-2.5,a[1]-1.5,5,2,CONC[1]);};
  brace(BL,BR,TANK[0],.8);legd(BL,TANK[0],TANK[1]);legd(BR,TANK[0],TANK[1]);brace(BL,FL,TANK[1],.7);brace(BR,FR,TANK[1],.7);
  // The ladder up to the catwalk, between the front legs.
  const lx=cx+8,ly=h-6;r(lx-.5,ly-Zl-14,1,Zl+14,EDGE);r(lx+4,ly-Zl-14,1,Zl+14,EDGE);for(let y=ly-3;y>ly-Zl-14;y-=4)r(lx,y,4.5,.75,TANK[2]);r(lx-.25,ly-Zl-14,.5,Zl+14,TANK[2]);r(lx+4.25,ly-Zl-14,.5,Zl+14,TANK[2]);
  brace(FL,FR,TANK[2],1);legd(FL,TANK[2],TANK[3]);legd(FR,TANK[1],TANK[2]);
  // The bowl under the tank, the catwalk round it, then the tank: a band of steel between two lower half circles and the cone roof.
  const yb=cy-Z0,yt=cy-Z1,ya=cy-Za;e(cx,yb,R+1,R+16,EDGE);e(cx,yb,R,R+15,TANK[1]);e(cx+12,yb+8,R-14,R+3,TANK[0]);e(cx-14,yb+2,R-24,R+4,TANK[2]);
  e(cx,yb,R+8,R+8,EDGE);e(cx,yb,R+7.5,R+7.5,STEEL[1]);
  const half=(y0,n=24)=>Array.from({length:n+1},(_,i)=>{const a=Math.PI*i/n;return [cx+Math.cos(a)*R,y0+Math.sin(a)*R];});
  p([...half(yt).map(([x,y])=>[x,y]),...half(yb).reverse()].map(([x,y])=>[x,y]),EDGE);
  for(let i=0;i<16;i++){const a0=Math.PI*i/16,a1=Math.PI*(i+1)/16,c=i<3?TANK[1]:i<6?TANK[2]:i<12?TANK[3]:TANK[2],pt=(a,y0)=>[cx+Math.cos(a)*(R-.5),y0+Math.sin(a)*(R-.5)];p([pt(a0,yt),pt(a1,yt),pt(a1,yb),pt(a0,yb)],c);}
  // Seams round the tank and up it, and rust running down from the top seam.
  for(const f of [.33,.66]){const y0=yt+(yb-yt)*f;for(let i=0;i<24;i++){const a0=Math.PI*i/24,a1=Math.PI*(i+1)/24;l(cx+Math.cos(a0)*R,y0+Math.sin(a0)*R,cx+Math.cos(a1)*R,y0+Math.sin(a1)*R,.5,TANK[0]+'aa');}}
  for(const a of [.25,.5,.75])l(cx+Math.cos(a*Math.PI)*R,yt+Math.sin(a*Math.PI)*R+1,cx+Math.cos(a*Math.PI)*R,yb+Math.sin(a*Math.PI)*R,.5,TANK[0]+'aa');
  for(let i=0;i<9;i++){const a=(.1+hash(i,s)*.8)*Math.PI,x=cx+Math.cos(a)*R,y=yt+Math.sin(a)*R+1,len=8+hash(s,i)*34;l(x,y,x,y+len,.6+hash(i,s+1)*.8,RUST[i%2]+'aa');}
  // The roof: a shallow cone seen from above, lit on the upper left, a hatch and a finial at its point.
  e(cx,yt,R+.5,R+.5,EDGE);e(cx,yt,R,R,TANK[2]);p([[cx,ya],...Array.from({length:13},(_,i)=>{const a=Math.PI*(1+i/12);return [cx+Math.cos(a)*R,yt+Math.sin(a)*R];})],TANK[3]);
  p([[cx,ya],...Array.from({length:9},(_,i)=>{const a=Math.PI*(-.1+i/8*.7);return [cx+Math.cos(a)*R,yt+Math.sin(a)*R];})],TANK[1]);
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2;l(cx,ya,cx+Math.cos(a)*R,yt+Math.sin(a)*R,.5,TANK[1]+'aa');}e(cx,yt,R,R,'#00000000');
  for(let i=0;i<5;i++){const a=(1.1+hash(i,s+3)*.8)*Math.PI;r(cx+Math.cos(a)*R*.7,yt+Math.sin(a)*R*.7,1.5,1,RUST[1]+'88');}
  r(cx-14,yt-8,8,6,EDGE);r(cx-13.5,yt-7.5,7,5,TANK[1]);r(cx-13.5,yt-7.5,7,.5,TANK[3]);
  // The ladder up the tank and over the roof to the top.
  const tx=cx+14,ty=Math.sqrt(R*R-14*14);r(tx-.5,yt+ty,5,yb-yt,EDGE);r(tx,yt+ty,4,yb-yt,TANK[2]);for(let y=yb+ty-3;y>yt+ty;y-=3.5)r(tx,y,4,.75,TANK[0]);l(tx+2,yt+ty,cx+2,ya+4,4.5,EDGE);l(tx+2,yt+ty,cx+2,ya+4,3.5,TANK[1]);
  // The catwalk's rail round the front: a top rail and posts.
  const rh=8,rail=a=>[cx+Math.cos(a)*(R+7),yb+Math.sin(a)*(R+7)];for(let i=0;i<=12;i++){const [x,y]=rail(Math.PI*i/12);r(x-.5,y-rh,1.25,rh,EDGE);r(x-.25,y-rh,.75,rh,STEEL[3]);}
  for(let i=0;i<24;i++){const [x1,y1]=rail(Math.PI*i/24),[x2,y2]=rail(Math.PI*(i+1)/24);l(x1,y1-rh,x2,y2-rh,1.6,EDGE);l(x1,y1-rh,x2,y2-rh,.8,STEEL[3]);l(x1,y1-rh/2,x2,y2-rh/2,.6,STEEL[2]);}
  // The finial and the beacon.
  r(cx-.75,ya-6,1.5,6.5,EDGE);r(cx-2.5,ya-9,5,4,EDGE);r(cx-2,ya-8.5,4,3,o.lit?'#ff4a3a':'#4a1a1a');if(o.lit){e(cx,ya-7,9,9,'#ff3a2a30');e(cx,ya-7,4,4,'#ff6a5a60');r(cx-1,ya-8,2,1.5,'#ffd0c8');}},
 // A yellow school bus parked facing right, like the cars: the roof and the near side, the slanted windscreen and the hood in front,
 // black rub rails, the row of square windows, the door and the folded stop arm. crashed stoves in the front.
 schoolbus(g,o){const {r,p,e,l}=g,L=o.w,D=o.h,Z=o.z,H0=6,Hh=Math.round(Z*.56),hood=24,fx=L-hood,ws=7,sy=D-Z;
  e(L/2,D-1,L/2+5,5,SHADOW);r(3,D-H0-1,L-6,H0+1,INK);
  // The silhouette and the body: roof, windscreen, hood top, and the near side under them.
  p([[-.5,-Z+1],[1,-Z-.5],[fx-ws,-Z-.5],[fx+.5,-Hh-.5],[L-1,-Hh-.5],[L+.5,-Hh+1],[L+.5,D-H0-1],[L-1,D-H0+.5],[1,D-H0+.5],[-.5,D-H0-1]],EDGE);
  r(0,-Z+.5,fx-ws,D-.5,YEL[3]);r(0,-Z+.5,fx-ws,.5,'#d4b052');for(let x=14;x<fx-ws-4;x+=16)r(x,-Z+1,.5,D-2,YEL[2]);
  for(const x of [L*.22,L*.5]){r(x,-Z+D*.25,14,D*.45,EDGE);r(x+.5,-Z+D*.25+.5,13,D*.45-1,YEL[2]);r(x+.5,-Z+D*.25+.5,13,.5,'#d4b052');}
  for(const y of [-Z+2,sy-3]){r(fx-ws-4,y,2,1.5,'#c08020');r(1,y,2,1.5,TAIL);}
  p([[fx-ws,-Z+.5],[fx,-Hh],[fx,sy+Z-Hh],[fx-ws,sy]],GLASS[1]);p([[fx-ws+1.5,-Z+4],[fx-ws+3.5,-Z+6],[fx-ws+3.5,sy-8],[fx-ws+1.5,sy-10]],GLASS[2]);
  r(fx,-Hh,hood,D,YEL[2]);r(fx,-Hh,hood,.5,YEL[3]);for(let y=-Hh+6;y<D-Hh-4;y+=5)r(L-6,y,4,.5,YEL[1]);
  p([[0,sy],[fx-ws,sy],[fx,D-Hh],[L,D-Hh],[L,D-H0],[0,D-H0]],YEL[1]);r(0,sy,fx-ws,.5,YEL[3]);l(fx-ws,sy+.25,fx,D-Hh+.25,.5,YEL[3]);r(fx,D-Hh,hood,.5,YEL[3]);
  // The windows: a row of square panes with their sashes, the door with its glass, the warning lights at the corners.
  const wy=sy+4,wh=14,dx0=fx-17;for(let x=5;x+12<dx0-2;x+=15){r(x-.5,wy-.5,13,wh+1,EDGE);r(x,wy,12,wh,GLASS[1]);r(x,wy+wh*.45,12,.75,EDGE);r(x,wy,12,.5,GLASS[0]);r(x+1,wy+wh*.45+1,3,wh*.5,GLASS[2]);}
  r(dx0-.5,wy-.5,13,D-H0-wy-1,EDGE);r(dx0,wy,12,D-H0-wy-2,'#1a1c20');for(const x of [dx0+.75,dx0+6.25]){r(x,wy+.5,5,wh,GLASS[1]);r(x,wy+wh+1.5,5,D-H0-wy-wh-4.5,GLASS[1]);r(x+.5,wy+1,1.5,wh-1,GLASS[2]);}
  for(const x of [2,fx-ws-6]){e(x+1.5,sy+1.5,1.6,1.4,EDGE);e(x+1.5,sy+1.5,1.1,.9,x<10?'#6a1a1a':'#9a6a1a');}
  // Rub rails along the side, the skirt, the stop arm folded flat under the windows, the lights and bumpers.
  for(const y of [wy+wh+5,wy+wh+13,wy+wh+21]){r(0,y,dx0-1,1.5,'#141416');r(0,y+1.5,dx0-1,.5,YEL[3]);}r(fx,D-Hh+8,L-fx,1.5,'#141416');r(0,D-H0-4,L,3,YEL[0]);
  const sx=dx0-16,sa=wy+wh+9.5,oct=q=>Array.from({length:8},(_,i)=>{const a=(i+.5)/8*Math.PI*2;return [sx+Math.cos(a)*q,sa+Math.sin(a)*q];});r(sx+3,sa-1,6,2,'#141416');p(oct(5),EDGE);p(oct(4.5),'#c8c2b6');p(oct(3.8),'#8a2020');r(sx-2.5,sa-.4,5,.8,'#c8c2b6');
  r(-2,D-H0-9,3,6,EDGE);r(-1.5,D-H0-8.5,2.5,5,'#1e2024');r(.5,sy+8,1.5,4,TAIL);
  if(!o.crashed){r(L-1,D-H0-10,3.5,6.5,EDGE);r(L-.5,D-H0-9.5,2.5,5.5,'#1e2024');r(L-1,-Hh+2,1.5,D-4,'#1e2024');r(L-2.5,D-Hh+3,2.5,3,EDGE);r(L-2,D-Hh+3.5,1.5,2,LAMP);r(L-1.5,-Hh+3,1,3,LAMP);r(L-1.5,D-Hh-6,1,3,LAMP);}
  // The wheels in their arches.
  for(const x of [L*.27,L-13]){e(x,D-H0-3,10,7,INK);e(x,D-7,8.5,8,EDGE);e(x,D-7,8,7.5,TYRE);e(x,D-7,4,3.8,'#3a3d42');e(x,D-7,1.5,1.4,'#1e2024');r(x-3,D-10.5,2,.5,'#7a7e84');}
  if(o.crashed){// The hood folds up, the grille and a lamp are gone, the bumper hangs, the windscreen is starred and glass lies on the hood.
   const f=L-14;p([[f-4,-Hh-.5],[L-4,-Hh+1],[L-1,-Hh+8],[L-4,-Hh+18],[L-2,-Hh+30],[L-5,D-Hh-2],[L-2.5,D-Hh+6],[L-6,D-H0],[f-4,D-H0+.5]],EDGE);
   p([[f-4,-Hh+.5],[L-4.5,-Hh+1.5],[L-1.5,-Hh+8],[L-4.5,-Hh+18],[L-2.5,-Hh+30],[L-5.5,D-Hh-2.5],[f-4,D-Hh-.5]],YEL[2]);p([[f-3,-Hh+2],[f+2,-Hh+1.5],[f+4,D-Hh-2],[f-1,D-Hh-1.5]],YEL[3]);l(f+2,-Hh+1.5,f+4,D-Hh-2,1,'#d4b052');
   p([[L-5.5,D-Hh+.5],[L-3,D-Hh+6],[L-6,D-H0-.5],[f-4,D-H0-.5],[f-4,D-Hh+.5]],YEL[1]);l(f-2,D-Hh+3,L-6,D-Hh+12,.6,YEL[0]);r(L-6,D-Hh+2,2.5,2.5,'#2a2a24');
   p([[L-6,D-H0-6],[L+3,D-H0+1],[L+2.5,D-H0+3.5],[L-6.5,D-H0-3]],EDGE);p([[L-6,D-H0-5.5],[L+2.5,D-H0+1.5],[L+2,D-H0+3],[L-6.5,D-H0-3.5]],'#2a2c30');
   const gx=fx-ws/2,gy=-Z/2-Hh/2+D*.4;for(let i=0;i<6;i++){const a=i/6*Math.PI*2;l(gx,gy,gx+Math.cos(a)*5,gy+Math.sin(a)*9,.4,'#9fb4c8');}
   for(let i=0;i<8;i++)r(f-6+hash(i,7)*14,-Hh+3+hash(9,i)*(D-8),1,.5,'#cfe0ea');}},
 // A flagpole on a concrete base, its flag hanging limp near the top in the still night air.
 flagpole(g,o){const {r,p,e,l}=g,w=o.w,h=o.h,z=o.z,cx=w/2,top=h/2-z+4;e(cx,h,w/2+3,2.5,SHADOW);box(g,0,h,w,h,4,CONC[2],CONC[1]);
  r(cx-1.25,top,2.5,h/2-4-top+.5,EDGE);r(cx-.75,top+.5,1.5,h/2-4-top,'#8e939b');r(cx-.75,top+.5,.5,h/2-4-top,'#b0b5bc');r(cx+.25,top+.5,.5,h/2-4-top,'#6c7179');e(cx,top-.5,2,2,EDGE);e(cx,top-.5,1.4,1.4,'#c9a24a');
  l(cx+1,top+1,cx+1.2,h/2-12,.3,'#a8a49a');r(cx+.75,h/2-14,1.5,1,'#55585e');
  // The flag: hoisted to the top and hanging in folds, stripes drooping, the blue canton by the pole.
  const fy=top+2,fp=[[cx+.75,fy],[cx+7,fy+1],[cx+8,fy+8],[cx+7.5,fy+18],[cx+5.5,fy+26],[cx+3,fy+24],[cx+.75,fy+16]];p(fp.map(([x,y])=>[x+(x>cx+1?.5:0),y-.5]),EDGE);p(fp,'#a8a59c');
  for(let i=0;i<4;i++){const x=cx+1.5+i*1.6;p([[x,fy+.5+i*.3],[x+.8,fy+.5+i*.3],[x+.9-i*.2,fy+18+i*2-(i>2?3:0)],[x+.1-i*.2,fy+16+i*2-(i>2?3:0)]],'#7a2a2a');}
  p([[cx+.75,fy],[cx+4.5,fy+.5],[cx+4,fy+9],[cx+.75,fy+8]],'#283456');r(cx+2,fy+3,.5,.5,'#c8c6bc');r(cx+3,fy+5,.5,.5,'#c8c6bc');l(cx+6.5,fy+2,cx+7.2,fy+16,.5,'#00000030');},
 // A steel hoop bike rack on its rail, with one rusty bike left leaning in it, its back tyre flat.
 bikerack(g,o){const {r,e,l}=g,w=o.w,h=o.h,z=o.z,yb=h-5,rh=z-2;r(-1,h-3,w+2,4,SHADOW);r(-.5,yb-1,w+1,2.5,EDGE);r(0,yb-.5,w,1.5,STEEL[2]);
  const hoop=x=>{const pts=[];for(let i=0;i<=10;i++){const a=Math.PI*(1+i/10);pts.push([x+5+Math.cos(a)*5,yb-rh+5+Math.sin(a)*5]);}return pts;},bar=(x,col,wd)=>{const pt=hoop(x);l(x,yb,x,yb-rh+5,wd,col);l(x+10,yb,x+10,yb-rh+5,wd,col);for(let i=0;i<pt.length-1;i++)l(pt[i][0],pt[i][1],pt[i+1][0],pt[i+1][1],wd,col);};
  for(let x=3;x+10<w;x+=Math.max(12,(w-16)/4)){bar(x,EDGE,2.4);bar(x,STEEL[3],1.3);}
  // The bike: two wheels, a rusty frame, the seat and the bars.
  const bx=w*.32,wy=h-5.5,R=5,f=bx+19,RU=['#4a2a1a','#6a3c24','#8a5232'];for(const x of [bx,f]){e(x,wy,R+.5,R+.5,EDGE);e(x,wy,R,R,TYRE);e(x,wy,R-1.2,R-1.2,'#2a2c30');e(x,wy,R-1.6,R-1.6,'#00000000');}
  for(const x of [bx,f]){e(x,wy,R-1.6,R-1.6,'#24262a');e(x,wy,.8,.8,'#55585e');for(let i=0;i<4;i++){const a=i*Math.PI/4;l(x-Math.cos(a)*(R-1.6),wy-Math.sin(a)*(R-1.6),x+Math.cos(a)*(R-1.6),wy+Math.sin(a)*(R-1.6),.25,'#55585e');}}
  r(bx-R-.5,wy+R-1.5,R*2+1,1.5,TYRE);const bb=[bx+9,wy+1],st=[bx+7,wy-7.5],ht=[f-3,wy-7.5];
  for(const [col,wd] of [[EDGE,2],[RU[1],1.1]]){l(bx,wy,bb[0],bb[1],wd,col);l(bx,wy,st[0],st[1],wd,col);l(bb[0],bb[1],st[0],st[1],wd,col);l(st[0],st[1],ht[0],ht[1],wd,col);l(bb[0],bb[1],ht[0],ht[1]+1.5,wd,col);l(ht[0],ht[1],f,wy,wd,col);}
  l(st[0]+.5,st[1]-.5,ht[0],ht[1]-.5,.4,RU[2]);e(bb[0],bb[1],1.6,1.6,EDGE);e(bb[0],bb[1],1.1,1.1,'#3a3d42');l(st[0],st[1],st[0]-.5,st[1]-2,.8,EDGE);e(st[0]-.8,st[1]-2.3,2.2,.9,EDGE);e(st[0]-.8,st[1]-2.4,1.8,.6,'#26282c');
  l(ht[0],ht[1],ht[0]-.5,ht[1]-2.5,.9,EDGE);l(ht[0]-2.5,ht[1]-2.8,ht[0]+1.5,ht[1]-2.2,1,EDGE);l(ht[0]-2.5,ht[1]-2.8,ht[0]+1.5,ht[1]-2.2,.5,'#55585e');for(let i=0;i<4;i++)r(bx+hash(i,3)*16,wy-6+hash(3,i)*6,.75,.5,RU[2]);}};
const LAMP='#e8e2c4',TAIL='#8a1c1c';
// Library samples: the sizes the suburbs map uses, with each option shown.
export const CIVIC_SAMPLES=[
 {set:'town',kind:'school',name:'Elementary school',group:'School',samples:[{kind:'school',x:40,y:40,w:720,h:170,z:96},{kind:'school',x:40,y:40,w:720,h:170,z:96,broken:true,door:250}]},
 {set:'town',kind:'gym',name:'School gym',group:'School',samples:[{kind:'gym',x:40,y:40,w:380,h:220,z:150},{kind:'gym',x:40,y:40,w:380,h:220,z:150,boarded:true},{kind:'gym',x:40,y:40,w:380,h:220,z:150,open:true}]},
 {set:'town',kind:'schoolbus',name:'School bus',group:'School',samples:[{kind:'schoolbus',x:40,y:40,w:230,h:56,z:66},{kind:'schoolbus',x:40,y:40,w:230,h:56,z:66,crashed:true}]},
 {set:'town',kind:'flagpole',name:'Flagpole',group:'School',samples:[{kind:'flagpole',x:40,y:40,w:8,h:8,z:170}]},
 {set:'town',kind:'bikerack',name:'Bike rack',group:'School',samples:[{kind:'bikerack',x:40,y:40,w:60,h:10,z:14}]},
 {set:'town',kind:'church',name:'Church',group:'Church',samples:[{kind:'church',x:40,y:40,w:260,h:200,z:330}]},
 {set:'town',kind:'gravestone',name:'Gravestone',group:'Church',samples:[{kind:'gravestone',x:40,y:40,w:14,h:6,z:20,variant:0},{kind:'gravestone',x:60,y:40,w:14,h:6,z:20,variant:1},{kind:'gravestone',x:100,y:40,w:14,h:6,z:8,variant:3},{kind:'gravestone',x:120,y:40,w:14,h:6,z:36,variant:4}]},
 {set:'town',kind:'ironfence',name:'Iron fence',group:'Church',samples:[{kind:'ironfence',x:40,y:40,w:120,h:4,z:30}]},
 {set:'town',kind:'ironfenceV',name:'Iron fence, running away',group:'Church',samples:[{kind:'ironfenceV',x:40,y:40,w:6,h:80,z:30}]},
 {set:'town',kind:'irongate',name:'Cemetery gate',group:'Church',samples:[{kind:'irongate',x:40,y:40,w:60,h:4,z:40},{kind:'irongate',x:40,y:40,w:60,h:4,z:40,open:true}]},
 {set:'town',kind:'watertower',name:'Water tower',group:'Landmarks',samples:[{kind:'watertower',x:40,y:40,w:110,h:70,z:360},{kind:'watertower',x:40,y:40,w:110,h:70,z:360,lit:true}]}];
