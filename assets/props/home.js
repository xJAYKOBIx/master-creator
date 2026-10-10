// House props: the walls, doors and windows of a small suburban house, and everything in it, from the couch and the TV to the
// fridge, the bed, the bathtub and the hall closet. Same conventions as camp.js: each prop draws with its footprint's top left
// corner at (0, 0) and its height rising into negative y. A house is clean, so these get no sand grime at the foot.
// Walls are cut away at one height. A horizontal wall shows its face, the side facing the room south of it, painted in that
// room's color (paint); a vertical wall shows its top and the end facing you. Wall decorations (pictures, a clock, hooks) take
// the footprint of the wall they hang on and draw onto its face.
import {painter,hash2 as hash} from '../core/paint.js';
import {EDGE,SHADOW,BONE,W,M,EMBER,EMBER_HI,PROP_PAD} from './camp.js';
import {propArt as workshopPropArt} from './workshop.js';
const INK='#111319';
// Wall paints, dark to light: living room beige, kitchen sage, bedroom blue, bathroom aqua, hall cream, and the outside siding.
export const HOUSE_PAINTS=[['#4f453b','#6b5f51','#7f7262','#948776'],['#3f4a3f','#55634f','#687862','#7c8c74'],['#3a4250','#4e5869','#626d80','#768297'],
 ['#3f5050','#566a69','#6b807e','#829694'],['#545044','#706a5a','#867e6c','#9a927f'],['#2f353d','#454d57','#59626d','#6d7682'],
 // More outside siding for the other houses on the street: pale, yellow, red, green and tan, all dimmed for the night.
 ['#3c3e40','#56595c','#6c7074','#82868a'],['#4a4430','#625a3e','#78704e','#8c8460'],['#3e2422','#56322e','#6a403a','#7e5048'],['#2a3830','#3a4c42','#4a5e52','#5a6e62'],['#463c30','#5e5242','#746654','#887a66']];
export const PAINT_NAMES=['Living room beige','Kitchen sage','Bedroom blue','Bathroom aqua','Hall cream','Outside siding','Pale siding','Yellow siding','Red siding','Green siding','Tan siding'];
const CAP=['#1f1c1a','#2e2925','#3e3832'],TRIM=['#7d786e','#a29c90','#c2bcaf'],OAK=['#4a3424','#664a32','#7f5e40','#9a7752'],
 FAB=['#2f2a3a','#433b52','#584e6b','#6e6384'],CREAM=['#8f8a7e','#b3ada0','#cfc9bb','#e6e0d2'],STEEL=['#3b4047','#59606a','#7c848e','#a3aab3'],
 NIGHT=['#141b27','#1d2a3c','#2a3c55'],GLASS='#22303f',PORC=['#8e8e88','#b4b3ab','#d2d1c8','#ecebe3'],BRASS='#c9a24a',WOOD=W;
// A box: footprint x..x+w by y..y+d, rising z. Top and front colors, with a thin light edge where they meet.
const bx=(g,x,y,w,d,z,top,front,hi='#ffffff22',base=0)=>{const {r}=g;r(x-.5,y-z-.5,w+1,d+z-base+1,EDGE);r(x+.5,y-z+.5,w-1,d-1,top);r(x+.5,y+d-z+.5,w-1,z-base-1,front);r(x+.5,y+d-z,w-1,.5,hi);};
// A wall face between x0 and x1, from screen y F (under the cap) down to the floor at B. Each paint has its own finish.
function face(g,x0,x1,F,B,paint,o){const {r}=g,P=HOUSE_PAINTS[paint]||HOUSE_PAINTS[0],w=x1-x0,sx=Math.round(o.x||0),sy=Math.round(o.y||0);
 r(x0+.5,F,w-1,B-F-.5,P[1]);
 if(paint>=5){for(let y=F+1;y<B-1;y+=4){r(x0+.5,y,w-1,1,P[2]);r(x0+.5,y,w-1,.5,P[3]);r(x0+.5,y+3.5,w-1,.5,P[0]);}r(x0+.5,B-2,w-1,1.5,P[0]);return;}
 r(x0+.5,F,w-1,1,P[0]);r(x0+.5,F+1,w-1,1.5,TRIM[0]);r(x0+.5,F+1,w-1,.5,TRIM[1]);
 if(paint===0||paint===2){for(let x=x0+3;x<x1-1;x+=6)r(x,F+3,.5,B-F-8,P[2]);for(let x=x0+6;x<x1-2;x+=6)for(let y=F+6+((x/6|0)%2)*4;y<B-8;y+=8)r(x-.25,y,.5,.5,P[3]);}
 else if(paint===1||paint===4){const t=paint===4?F+(B-F)*.52:B;for(let k=0;k<w*(t-F)/30;k++){const x=x0+1+hash(k+sx,sy+7)*(w-2),y=F+3+hash(sy+k,sx+3)*(t-F-6);r(x,y,.5,.5,k%3?P[2]:P[0]);}
  if(paint===4){r(x0+.5,t,w-1,B-t-4,P[2]);r(x0+.5,t,w-1,1,TRIM[1]);r(x0+.5,t+1,w-1,.5,TRIM[0]);for(let x=x0+3;x<x1-9;x+=13){r(x,t+3,9,B-t-9.5,P[1]);r(x,t+3,9,.5,P[0]);r(x,B-7,9,.5,P[3]);}}}
 else if(paint===3){const t=F+(B-F)*.42;r(x0+.5,t,w-1,B-t-4,P[2]);for(let y=t,i=0;y<B-4;y+=4,i++){r(x0+.5,y,w-1,.5,P[0]);for(let x=x0+(i%2?2.5:.5);x<x1-.5;x+=4)r(x,y,.5,4,P[0]);r(x0+1,y+.5,w-2,.5,P[3]);}r(x0+.5,t-1.5,w-1,1.5,TRIM[1]);}
 r(x0+.5,B-4.5,w-1,4,TRIM[1]);r(x0+.5,B-4.5,w-1,.5,TRIM[2]);r(x0+.5,B-1,w-1,.5,TRIM[0]);}
// The top of a wall, seen from above.
function cap(g,x,y,w,d){const {r}=g;r(x+.5,y+.5,w-1,d-1,CAP[1]);r(x+.5,y+.5,w-1,.5,CAP[2]);r(x+.5,y+d-1,w-1,.5,CAP[0]);}
// The night outside a window: deep blue with a few stars and a soft band of moonlight low in the glass.
function nightGlass(g,x,y,w,h,seed){const {r}=g;r(x,y,w,h,NIGHT[1]);r(x,y+h*.6,w,h*.4,NIGHT[2]);r(x,y,w,1,NIGHT[0]);for(let k=0;k<4;k++)r(x+1+hash(k,seed)*(w-2),y+1+hash(seed,k)*h*.5,.5,.5,'#a9b8cf');
 for(let k=0;k<3;k++){const gx=x+2+k*2.5+hash(seed,3)*(w-12);r(gx,y+h-1-k*2,4,.5,'#9fb4d088');}}
export const HOME_ART={
 // ---------- Walls ----------
 wall(g,o){const {r}=g,w=o.w,h=o.h,z=o.z;r(-.5,-z-.5,w+1,h+z+1,EDGE);cap(g,0,-z,w,h);face(g,0,w,h-z,h,o.paint|0,o);},
 wallV(g,o){const {r}=g,w=o.w,h=o.h,z=o.z;r(-.5,-z-.5,w+1,h+z+1,EDGE);cap(g,0,-z,w,h);r(.5,-z+.5,.5,h-1,CAP[2]);face(g,0,w,h-z,h,o.paint|0,o);},
 // A doorway: only the header over the opening and the casing round it. You walk through.
 doorway(g,o){const {r}=g,w=o.w,h=o.h,z=o.z,top=h-42;r(-.5,-z-.5,w+1,top+z+.5,EDGE);cap(g,0,-z,w,h);face(g,0,w,h-z,top+.5,o.paint|0,{...o,y:o.y+1});
  if((o.paint|0)!==5){r(-.5,top-.5,w+1,2,TRIM[1]);r(-.5,top-.5,w+1,.5,TRIM[2]);for(const x of [-.5,w-1.5]){r(x,top,2,h-top,TRIM[1]);r(x,top,.5,h-top,TRIM[2]);}}},
 // A doorway in a wall that runs away from you: no header over the gap, so it reads as an opening, with the end of the wall
 // behind it showing and a pale casing along its top edge. (A header here hid the opening behind the wall south of it.)
 doorwayV(g,o){const {r}=g,w=o.w,z=o.z;r(-1,-z-.5,w+2,1.5,EDGE);r(-.5,-z,w+1,1,TRIM[1]);r(-.5,-z,w+1,.5,TRIM[2]);},
 // A window in a horizontal wall. From inside (view 'in') you see the night through it and the curtains; from outside, shutters.
 window(g,o){const {r}=g,w=o.w,h=o.h,z=o.z,paint=o.paint|0,out=paint>=5,x0=5,x1=w-5,t=h-40,b=h-17,cx=w/2;
  HOME_ART.wall(g,o);r(x0-1.5,t-1.5,x1-x0+3,b-t+3,EDGE);r(x0-1,t-1,x1-x0+2,b-t+2,TRIM[1]);
  if(out){r(x0+.5,t+.5,x1-x0-1,b-t-1,GLASS);for(let k=0;k<3;k++)r(x0+2+k*3,b-3-k*3,5,.5,'#4a5a6b');for(const x of [x0-7.5,x1+1.5]){r(x,t-.5,6,b-t+1,EDGE);r(x+.5,t,5,b-t,'#2e3b33');for(let y=t+1.5;y<b-1;y+=2)r(x+.5,y,5,.5,'#3c4d42');}}
  else nightGlass(g,x0+.5,t+.5,x1-x0-1,b-t-1,Math.round(o.x||0));
  r(cx-.5,t,1,b-t,TRIM[1]);r(x0,(t+b)/2-.5,x1-x0,1,TRIM[1]);r(x0-3,b,x1-x0+6,2,TRIM[2]);r(x0-3,b+2,x1-x0+6,.5,TRIM[0]);
  if(!out){const C=o.curtain===1?['#3a4a3a','#4f6450','#647c64']:o.curtain===2?['#4a3a2a','#6a5238','#866a4a']:['#5a2e2e','#7a3e3a','#94524a'];r(x0-6,t-4,x1-x0+12,1,STEEL[2]);
   for(const [x,s] of [[x0-5,1],[x1-1,-1]]){r(x-.5,t-3.5,7,b-t+9,EDGE);r(x,t-3,6,b-t+8,C[1]);for(let k=0;k<3;k++)r(x+.5+k*2,t-3,.5,b-t+8,C[0]);r(x+(s>0?5:0),t-3,1,b-t+8,C[2]);}}},
 windowV(g,o){const {r}=g,w=o.w,h=o.h,z=o.z;HOME_ART.wallV(g,o);r(w/2-2,-z+3,4,h-6,EDGE);r(w/2-1.5,-z+3.5,3,h-7,NIGHT[2]);r(w/2-1.5,-z+3.5,1,h-7,'#9fb4d066');r(w/2-2.5,-z+3,5,.5,TRIM[1]);r(w/2-2.5,h-z-3.5,5,.5,TRIM[1]);},
 // The front door, closed, in the outside wall: a panel door with a little window, a brass knob and a porch light over it.
 frontdoor(g,o){const {r,e}=g,w=o.w,h=o.h,z=o.z,top=h-42,dx=3,dw=w-6;HOME_ART.wall(g,o);
  r(dx-2,top-2,dw+4,h-top+2,EDGE);r(dx-1.5,top-1.5,dw+3,h-top+1.5,TRIM[1]);r(dx-.5,top-.5,dw+1,h-top+.5,EDGE);const D=['#3c1c18','#5a2a22','#743a2e','#8c4c3a'];r(dx,top,dw,h-top,D[1]);r(dx,top,dw,.5,D[3]);
  for(const [px,py,pw,ph] of [[dx+3,top+4,dw-6,8],[dx+3,top+16,dw/2-4.5,10],[dx+dw/2+1.5,top+16,dw/2-4.5,10],[dx+3,top+29,dw/2-4.5,10],[dx+dw/2+1.5,top+29,dw/2-4.5,10]]){r(px,py,pw,ph,D[0]);r(px+.5,py+.5,pw-1,ph-1,D[2]);r(px+.5,py+ph-1,pw-1,.5,D[3]);}
  r(dx+5,top+5,dw-10,6,GLASS);r(dx+5,top+5,dw-10,.5,'#4a5a6b');e(dx+dw-4,top+24,1.6,1.6,EDGE);e(dx+dw-4,top+23.7,1.1,1.1,BRASS);r(dx+dw/2-3,top+1.5,6,1,BRASS);
  r(w/2-3,top-9,6,6,EDGE);r(w/2-2.5,top-8.5,5,5,M[2]);r(w/2-1.5,top-7.5,3,3,'#e8dcb0');},
 // ---------- Living room ----------
 // The couch, seen from behind as you look at the TV over it: the backrest toward you, the seat and the arms beyond.
 sofa(g,o){const {r,e}=g,w=o.w,h=o.h,z=o.z,S=14,A=21,B=10,U=o.color===1?['#2e3a2c','#3f5040','#526a52','#688468']:o.color===2?['#3c2a22','#55392c','#704c3a','#8a624c']:FAB;e(w/2,h,w/2+6,4,SHADOW);
  bx(g,9,0,w-18,h-B,S,U[2],U[1]);for(let i=1;i<3;i++)r(9+i*(w-18)/3,-S+.5,.5,h-B-1,U[1]);r(10,-S+.5,w-20,1,U[3]);
  for(const [x,c] of [[16,'#a8763e'],[w-30,'#7a8a9a']]){e(x+7,-S-5,7,5,EDGE);e(x+7,-S-5.5,6.2,4.2,c);r(x+3,-S-8,6,.5,'#ffffff33');}
  for(const x of [0,w-10]){bx(g,x,0,10,h,A,U[2],U[1]);r(x+1,-A+1,8,.5,U[3]);}
  bx(g,0,h-B,w,B,z,U[2],U[1]);r(1,h-B-z+1,w-2,.5,U[3]);for(let i=1;i<3;i++)r(i*w/3,h-z+1,.5,z-4,U[0]);for(let i=0;i<6;i++)e(w/6*(i+.5),h-z+z*.45,.6,.6,U[0]);r(1,h-3,w-2,1.5,U[0]);for(const x of [2,w-5])r(x,h-.5,3,1.5,EDGE);},
 // An armchair facing you: backrest at the back, a cushion and arms, a crocheted throw.
 armchair(g,o){const {r,e}=g,w=o.w,h=o.h,z=o.z,U=o.color===1?['#3c2a22','#55392c','#704c3a','#8a624c']:FAB;e(w/2,h,w/2+4,4,SHADOW);
  bx(g,2,0,w-4,9,z,U[2],U[1]);r(3,-z+1,w-6,.5,U[3]);bx(g,7,9,w-14,h-9,13,U[2],U[1]);r(8,9-13+1,w-16,.5,U[3]);r(8,h-13+2,w-16,.5,U[3]);
  for(const x of [0,w-7]){bx(g,x,4,7,h-4,19,U[2],U[1]);r(x+1,4-19+1,5,.5,U[3]);}r(9,-z+3,w-18,9,'#a8763e');for(let y=-z+4;y<-z+12;y+=2)r(9,y,w-18,.5,'#c9a05a');for(const x of [2,w-5])r(x,h-.5,3,1.5,EDGE);},
 // The TV: a big old CRT on a low cabinet, off since the power went. The VCR clock is dark too.
 tv(g,o){const {r,e,l}=g,w=o.w,h=o.h,S=18,cw=w-16,ch=h-4,cx=8,cy=2,T=30;e(w/2,h,w/2+5,4,SHADOW);
  bx(g,0,0,w,h,S,OAK[2],OAK[1]);r(1,-S+1,w-2,.5,OAK[3]);r(3,h-S+3,w/2-4,S-6,OAK[0]);r(w/2+1,h-S+3,w/2-4,S-6,OAK[0]);r(3.5,h-S+3.5,w/2-5,S-7,OAK[1]);r(w/2+1.5,h-S+3.5,w/2-5,S-7,OAK[1]);
  r(6,h-S+5,w/2-10,4,'#1b1c20');r(7,h-S+6.5,6,1,'#2a2c31');r(w/2+4,h-S+5,w/2-10,4,'#1b1c20');for(const x of [w/2-3,w/2+2])r(x,h-S+10,1,2,BRASS);
  const top=cy-S-T,face=cy+ch-S-T;r(cx-.5,top-.5,cw+1,ch+T+1,EDGE);r(cx+.5,top+.5,cw-1,ch-1,'#2b2d32');r(cx+.5,top+.5,cw-1,.5,'#45484f');r(cx+.5,face,cw-1,T-.5,'#232529');r(cx+.5,face,cw-1,.5,'#3a3d44');
  r(cx+3,face+3,cw-14,T-7,EDGE);r(cx+3.5,face+3.5,cw-15,T-8,'#151a1e');r(cx+5,face+5,cw-18,T-11,'#1a2128');r(cx+5,face+4.5,7,1,'#3a4650');r(cx+4.5,face+5,1,5,'#33404a');
  for(let y=face+5;y<face+T-4;y+=2)r(cx+cw-9,y,5,.5,'#3a3d44');r(cx+cw-8,face+T-6,2,1,'#5c636b');r(cx+cw-5,face+T-6,1,1,'#7a2a22');
  l(cx+cw/2,top+3,cx+cw/2-10,top-14,.6,STEEL[2]);l(cx+cw/2,top+3,cx+cw/2+9,top-15,.6,STEEL[2]);e(cx+cw/2,top+4,3,1.5,EDGE);e(cx+cw/2,top+3.7,2.4,1,STEEL[1]);},
 coffeetable(g,o){const {r,e}=g,w=o.w,h=o.h,z=o.z;e(w/2,h,w/2+4,4,SHADOW);for(const x of [2,w-5]){r(x-.5,h-z,4,z,EDGE);r(x,h-z,3,z-.5,OAK[1]);}
  bx(g,0,0,w,h,z,OAK[2],OAK[1],'#ffffff22',z-4);r(1,-z+1,w-2,.5,OAK[3]);for(let k=0;k<4;k++)r(3+hash(k,o.x|0)*(w-12),-z+3+hash(o.y|0,k)*(h-6),6,.5,OAK[1]);
  // A mug, the remote, a magazine and the candle lit when the power went.
  r(5,-z+3,14,9,'#c9c0aa');r(6,-z+4,12,1,'#a33b2e');r(6,-z+6,8,.5,'#6c6556');r(6,-z+8,10,.5,'#6c6556');r(w-20,-z+8,9,3,EDGE);r(w-19.5,-z+8.5,8,2,'#2a2c31');r(w-18,-z+9,1,1,'#a33b2e');
  e(w-26,-z+5,2.6,2,EDGE);e(w-26,-z+4.7,2,1.4,'#5a7a9a');if(o.candle!==false){r(w-9,-z+1,3.5,6,EDGE);r(w-8.5,-z+1.5,2.5,5,BONE);r(w-7.5,-z,.5,1.5,INK);r(w-8,-z-2.5,1.5,2.5,EMBER_HI);r(w-7.5,-z-3.5,.5,1,'#ffe4a0');}},
 endtable(g,o){const {r,e,p}=g,w=o.w,h=o.h,z=o.z;e(w/2,h,w/2+3,3,SHADOW);bx(g,0,0,w,h,z,OAK[2],OAK[1]);r(2,h-z+3,w-4,5,OAK[0]);r(2.5,h-z+3.5,w-5,4,OAK[2]);r(w/2-1,h-z+5,2,1,BRASS);
  const cx=w/2,t=-z+h/2;e(cx,t,4,2,EDGE);e(cx,t-.3,3.4,1.5,'#7a6a58');r(cx-.5,t-10,1,10,EDGE);p([[cx-6,t-10],[cx+6,t-10],[cx+4,t-18],[cx-4,t-18]],EDGE);p([[cx-5,t-10.5],[cx+5,t-10.5],[cx+3.5,t-17.5],[cx-3.5,t-17.5]],CREAM[1]);r(cx-4,t-17,8,.5,CREAM[3]);},
 floorlamp(g,o){const {r,e,p}=g,w=o.w,h=o.h,z=o.z,cx=w/2,b=h/2;e(cx,h,6,2.5,SHADOW);e(cx,b,4.5,2.2,EDGE);e(cx,b-.3,3.8,1.6,M[2]);r(cx-.75,b-z+12,1.5,z-12,EDGE);r(cx-.25,b-z+12,.5,z-12,STEEL[3]);
  p([[cx-7,b-z+13],[cx+7,b-z+13],[cx+4.5,b-z],[cx-4.5,b-z]],EDGE);p([[cx-6,b-z+12.5],[cx+6,b-z+12.5],[cx+4,b-z+.5],[cx-4,b-z+.5]],CREAM[1]);r(cx-3.5,b-z+1,7,.5,CREAM[3]);r(cx-6,b-z+12,12,.5,CREAM[0]);},
 bookshelf(g,o){const {r}=g,w=o.w,h=o.h,z=o.z,F=h-z,BK=['#7a2a22','#2e4a6a','#3f5a3a','#8a6a2a','#5a3a5a','#a8763e','#3a3d44','#6a7a8a'];
  bx(g,0,0,w,h,z,OAK[1],OAK[0]);const rows=4,sh=(z-6)/rows;for(let j=0;j<rows;j++){const y0=F+3+j*sh;r(2,y0,w-4,sh-1.5,'#1a1410');r(1,y0+sh-1.5,w-2,1.5,OAK[2]);r(1,y0+sh-1.5,w-2,.5,OAK[3]);
   let x=2.5;while(x<w-4){const bw=1.5+Math.floor(hash(x*3+j,o.x|0)*3)*.5,bh=sh-3-hash(j,x*7)*3,col=BK[Math.floor(hash(x,j+(o.y|0))*BK.length)];if(hash(j*5,x)>.88){x+=3;continue;}r(x,y0+sh-1.5-bh,bw,bh,col);r(x,y0+sh-1.5-bh,bw,.5,'#ffffff33');x+=bw+.5;}}
  r(.5,F,1.5,z,OAK[2]);r(w-2,F,1.5,z,OAK[2]);},
 plant(g,o){const {r,e,l}=g,w=o.w,h=o.h,z=o.z,cx=w/2,b=h-3,LF=['#1f3a24','#2c5232','#3d6c40','#56884f'];e(cx,h,cx+2,3,SHADOW);
  r(cx-6,b-12,12,12,EDGE);r(cx-5.5,b-11.5,11,11,'#8a4a2e');r(cx-5.5,b-11.5,11,2,'#a85e3a');r(cx-5.5,b-2,11,1.5,'#6a3a24');
  for(let k=0;k<9;k++){const a=-Math.PI/2+(hash(k,o.x|0)-.5)*2.6,len=10+hash(o.y|0,k)*(z-20),x2=cx+Math.cos(a)*len*.8,y2=b-12+Math.sin(a)*len;l(cx,b-12,x2,y2,.7,LF[0]);e(x2,y2,4.2,2.8,EDGE);e(x2,y2-.3,3.6,2.2,LF[1+k%2]);r(x2-2,y2-1,2.5,.5,LF[3]);}},
 // Rugs lie flat. Style 0 a red rug with a border, 1 a blue-gray stripe, 2 a round braided rug, 3 a fluffy bath mat.
 rug(g,o){const {r,e}=g,w=o.w,h=o.h,s=o.style|0;
  if(s===2){for(let k=0;k<6;k++){const c=['#4a3a2a','#6a5238','#866a4a','#5a4a3a','#7a6248','#94785a'][k];e(w/2,h/2,w/2-k*w/14,h/2-k*h/14,c);}return;}
  if(s===3){// A fluffy bath mat.
   r(0,0,w,h,'#4a7a7a');r(.5,.5,w-1,h-1,'#6a9a98');for(let i=0;i<w*h/5;i++)r(1+hash(i,5)*(w-2),1+hash(7,i)*(h-2),.5,.5,i%2?'#8ab8b4':'#5a8a88');return;}
  const C=s===1?['#26303c','#34424f','#46586a','#8a9aa8']:['#4a1e1c','#6a2a26','#8a3a30','#c9a24a'];r(0,0,w,h,C[0]);r(1,1,w-2,h-2,C[1]);r(4,4,w-8,h-8,C[0]);r(5,5,w-10,h-10,C[2]);
  if(s===1)for(let y=7;y<h-7;y+=5)r(5,y,w-10,1.5,C[1]);else{e(w/2,h/2,Math.min(w/4,16),h/4,C[1]);e(w/2,h/2,Math.min(w/6,10),h/7,C[3]);for(const [x,y] of [[8,8],[w-8,8],[8,h-8],[w-8,h-8]])r(x-1.5,y-1.5,3,3,C[3]);}
  for(let x=1;x<w-1;x+=2){r(x,-1.5,.5,1.5,C[3]);r(x,h,.5,1.5,C[3]);}},
 // The dog's bed: a plaid cushion with a raised rim. Flat enough to walk over.
 dogbed(g,o){const {r,e}=g,w=o.w,h=o.h,cx=w/2,cy=h/2;e(cx,cy+1.5,cx+1,cy+1,SHADOW);e(cx,cy,cx,cy,EDGE);e(cx,cy-.5,cx-.5,cy-.5,'#5a3a2a');e(cx,cy-1,cx-1.5,cy-1.5,'#7a5238');e(cx,cy+.5,cx-6,cy-4,EDGE);e(cx,cy+.5,cx-6.5,cy-4.5,'#3a4a5a');
  for(let x=cx-cx+8;x<w-8;x+=4)r(x,cy-cy+5.5,.5,h-11,'#4f6479');for(let y=6;y<h-6;y+=4)r(8,y,w-16,.5,'#4f6479');r(cx-4,cy-2,8,.5,'#c9b9a0');},
 cattree(g,o){const {r,e}=g,w=o.w,h=o.h,z=o.z,CP=['#4a4038','#6a5e52','#857a6c','#a3978a'],SI='#a8936a',cx=w/2;e(cx,h-2,w/2+2,4,SHADOW);
  // A carpeted base, one sisal post and three round perches, the top one a cup bed. A toy mouse hangs off the lowest.
  const disc=(x,y,rx,ry,t)=>{e(x,y+t,rx+.5,ry+.5,EDGE);r(x-rx,y,rx*2,t,CP[1]);e(x,y+t,rx,ry,CP[1]);e(x,y,rx+.5,ry+.5,EDGE);e(x,y,rx,ry,CP[2]);e(x-rx*.3,y-ry*.3,rx*.45,ry*.35,CP[3]);};
  disc(cx,h-6,w/2-1,5,3);r(cx-2.5,h-6-z+4,5,z-4,EDGE);r(cx-2,h-6-z+4,4,z-4,SI);for(let y=h-6-z+5;y<h-6;y+=1.5)r(cx-2,y,4,.5,'#8a7650');
  disc(cx-5,h-6-22,9,4,2.5);disc(cx+5,h-6-42,8,3.5,2.5);disc(cx,h-6-z+4,8,3.5,3);e(cx,h-6-z+4,5,2,CP[0]);r(cx-12,h-6-22+3,.5,7,'#c9a24a');e(cx-11.8,h-6-22+11,1.6,1.3,'#8a8a8a');},

 // ---------- Kitchen ----------
 // A run of base cabinets with a counter. Kitchen bits along the top, picked by position.
 counter(g,o){const {r,e}=g,w=o.w,h=o.h,z=o.z,CB=['#3a4a5a','#4f6479','#647c94','#7a94ac'],TOP=['#6a675e','#8c887c','#a8a395'];e(w/2,h,w/2+4,3,SHADOW);
  bx(g,0,2,w,h-2,z-2,TOP[1],CB[1]);bx(g,-1,0,w+2,h,z,TOP[1],TOP[0]);r(0,-z+.5,w,.5,TOP[2]);for(let k=0;k<w*h/18;k++)r(hash(k,o.x|0)*w,-z+1+hash(o.y|0,k)*(h-2),.5,.5,k%2?TOP[2]:TOP[0]);
  const n=Math.max(1,Math.round(w/18)),U=w/n,F=h-z+2.5;for(let i=0;i<n;i++){const x0=i*U+1;r(x0,F,U-2,4,CB[2]);r(x0+U/2-3,F+1.5,6,1,STEEL[3]);r(x0,F+5,U-2,z-10,CB[2]);r(x0+1,F+6,U-4,z-12,CB[1]);r(x0+(i%2?2:U-5),F+8,1,4,STEEL[3]);}
  r(0,h-3,w,3,'#1a1c20');
  let x=3;const top=-z+h/2;while(x<w-12){const k=Math.floor(hash(x,(o.x|0)+(o.y|0))*6);
   if(k===0){r(x,top-6,10,7,EDGE);r(x+.5,top-5.5,9,6,STEEL[2]);r(x+.5,top-5.5,9,1,STEEL[3]);r(x+2,top-6.5,2,1,INK);r(x+6,top-6.5,2,1,INK);x+=14;}
   else if(k===1){for(let i=0;i<3;i++){r(x+i*4,top-7+i,3.5,7-i,EDGE);r(x+i*4+.5,top-6.5+i,2.5,6-i,['#c9c0aa','#a8763e','#5a7a9a'][i]);}x+=15;}
   else if(k===2){e(x+6,top,6,2.6,EDGE);e(x+6,top-.4,5.3,2,'#d6d0c2');for(const [dx,c] of [[3,'#c0392b'],[6,'#d9b23a'],[8.5,'#6a9a3a']])e(x+dx,top-1.8,1.8,1.8,c);x+=15;}
   else if(k===3){r(x,top-12,8,13,EDGE);r(x+.5,top-11.5,7,12,'#2a2c31');r(x+1.5,top-4,5,4,'#45484f');r(x+2,top-10,4,4,'#3a4650');r(x+1,top-11,6,.5,'#5c636b');x+=12;}
   else if(k===4){r(x,top-3,12,5,EDGE);r(x+.5,top-2.5,11,4,OAK[3]);r(x+2,top-6,3,4,EDGE);r(x+2.5,top-5.5,2,3,'#7a4a30');x+=16;}else x+=8;}},
 sink(g,o){const {r,e,l}=g,w=o.w,h=o.h,z=o.z;HOME_ART.counter(g,{...o,x:-999});const top=-z,cx=w/2;
  r(cx-14,top+3,28,h-6,EDGE);r(cx-13.5,top+3.5,13,h-7,STEEL[1]);r(cx+.5,top+3.5,13,h-7,STEEL[1]);r(cx-13,top+4,12,2,STEEL[0]);r(cx+1,top+4,12,2,STEEL[0]);e(cx-7,top+h/2+1,1,.6,INK);e(cx+7,top+h/2+1,1,.6,INK);
  r(cx-1,top-1,2,5,EDGE);r(cx-.5,top-.5,1,4,STEEL[3]);l(cx,top-1,cx,top+5,1.2,EDGE);l(cx,top-1,cx+2,top+5,.6,STEEL[3]);r(cx-4,top+.5,2,1.5,STEEL[3]);r(cx+2,top+.5,2,1.5,STEEL[3]);
  r(cx+16,top+2,4,6,EDGE);r(cx+16.5,top+2.5,3,5,'#6a9a3a');r(cx-22,top+3,6,5,EDGE);r(cx-21.5,top+3.5,5,4,'#d9b23a');},
 // The range: four burners, the knobs on a back panel and the oven door. Gas, so it would still light.
 stove(g,o){const {r,e}=g,w=o.w,h=o.h,z=o.z;e(w/2,h,w/2+3,3,SHADOW);bx(g,0,0,w,h,z,'#2a2c31',CREAM[2]);r(1,-z+.5,w-2,.5,'#45484f');
  for(const [x,y] of [[w*.28,-z+h*.35],[w*.72,-z+h*.35],[w*.28,-z+h*.72],[w*.72,-z+h*.72]]){e(x,y,w*.17,h*.16,'#141416');e(x,y,w*.1,h*.09,'#3a3d44');e(x,y,w*.04,h*.04,'#141416');}
  bx(g,0,0,w,4,z+8,CREAM[2],CREAM[1]);for(let i=0;i<4;i++){e(4+i*(w-8)/3,4-z-4,1.2,1.2,EDGE);e(4+i*(w-8)/3,4-z-4.3,.8,.8,STEEL[3]);}
  const F=h-z;r(2,F+3,w-4,1.5,STEEL[3]);r(3,F+7,w-6,z-12,EDGE);r(3.5,F+7.5,w-7,z-13,'#1a1c20');r(4.5,F+8.5,w-9,2,'#2a2c31');r(1,h-4,w-2,3,CREAM[1]);},
 fridge(g,o){const {r}=g,w=o.w,h=o.h,z=o.z,F=h-z,split=F+z*.34;e2(g,w,h);bx(g,0,0,w,h,z,CREAM[2],CREAM[2]);r(1,-z+.5,w-2,.5,CREAM[3]);
  r(1,F+1,w-2,split-F-1,CREAM[2]);r(1,split,w-2,.75,CREAM[0]);r(1,split+.75,w-2,h-split-2,CREAM[2]);r(1,F+1,1,z-2,CREAM[3]);r(w-2.5,F+4,1.5,split-F-7,STEEL[2]);r(w-2.5,split+4,1.5,18,STEEL[2]);
  // Magnets, a takeout menu and a drawing.
  r(6,split+6,9,11,'#d6d0c2');r(7,split+8,4,4,'#3f8fe0');r(10,split+11,4,3,'#c0392b');r(9,split+5.5,2,1.5,'#c0392b');r(16,split+20,7,9,'#e8e0d1');for(let k=0;k<4;k++)r(17,split+22+k*1.6,5,.5,'#6c6556');r(19,split+19.5,2,1.5,'#d9b23a');
  r(5,F+6,3,3,'#6a9a3a');r(10,F+7,3,2,'#d9b23a');r(1,h-3,w-2,2,'#2a2c31');},
 dtable(g,o){const {r,e}=g,w=o.w,h=o.h,z=o.z;e(w/2,h,w/2+5,4,SHADOW);for(const x of [3,w-6]){r(x-.5,h-z,4,z,EDGE);r(x,h-z,3,z-.5,OAK[1]);}
  bx(g,0,0,w,h,z,OAK[2],OAK[1],'#ffffff22',z-3);r(1,-z+1,w-2,.5,OAK[3]);for(let k=0;k<5;k++)r(2+hash(k,o.x|0)*(w-10),-z+2+hash(o.y|0,k)*(h-4),8,.5,OAK[1]);
  for(const [x,y] of [[6,-z+4],[w-20,-z+h-14]]){r(x,y,14,10,'#8a3a30');r(x+.5,y+.5,13,9,'#a8483a');}e(w/2,-z+h/2,7,3,EDGE);e(w/2,-z+h/2-.4,6.3,2.4,'#d6d0c2');for(const [dx,c] of [[-3,'#c0392b'],[0,'#d9b23a'],[3,'#c0392b']])e(w/2+dx,-z+h/2-1.6,1.8,1.8,c);
  r(w-14,-z+4,4,4,EDGE);r(w-13.5,-z+4.5,3,3,'#e8e0d1');},
 // A dining chair. face is the way you would sit: 's' faces you (backrest at the back), 'n' faces away (you see the backrest).
 chair(g,o){const {r,e}=g,w=o.w,h=o.h,z=o.z,S=13,SEAT='#7a3a30';e(w/2,h,w/2+2,2.5,SHADOW);
  // The backrest is two posts, a top rail and a slat, with gaps you can see through.
  const back=y=>{for(const x of [1,w-3]){r(x-.5,y-z-.5,3,z-S+1,EDGE);r(x,y-z,2,z-S,OAK[2]);}r(.5,y-z-.5,w-1,4,EDGE);r(1,y-z,w-2,3,OAK[2]);r(1,y-z,w-2,.5,OAK[3]);r(.5,y-z+8,w-1,2.5,EDGE);r(1,y-z+8.5,w-2,1.5,OAK[1]);};
  const seat=y=>{for(const x of [1,w-3]){r(x-.5,h-S,3,S,EDGE);r(x,h-S,2,S-.5,OAK[1]);}bx(g,0,y,w,h-y,S,OAK[2],OAK[1],'#ffffff22',S-3);r(1.5,y-S+1.5,w-3,h-y-4,SEAT);r(1.5,y-S+1.5,w-3,.5,'#94524a');};
  if(o.face==='n'){seat(0);back(h-1);}else{back(2);seat(2);}},

 trash(g,o){const {r,e}=g,w=o.w,h=o.h,z=o.z;e(w/2,h,w/2+2,2.5,SHADOW);bx(g,0,0,w,h,z,STEEL[2],STEEL[1]);r(1,-z+1,w-2,.5,STEEL[3]);r(1,h-z+3,w-2,.5,STEEL[3]);r(w/2-2,h-2,4,1.5,INK);r(1.5,h-z+2,1,z-4,STEEL[3]);},
 // Two bowls on a mat: kibble and water.
 petbowls(g,o){const {r,e}=g,w=o.w,h=o.h;r(0,0,w,h,'#5a2e2a');r(.5,.5,w-1,h-1,'#7a3e3a');for(const [x,c,in2] of [[w*.28,STEEL[2],'#8a5a30'],[w*.72,STEEL[2],'#4a7aa0']]){e(x,h/2,w*.2,h*.36,EDGE);e(x,h/2-.3,w*.18,h*.3,c);e(x,h/2,w*.13,h*.2,in2);}
  for(let k=0;k<6;k++)r(w*.2+hash(k,3)*w*.14,h/2-1.5+hash(3,k)*3,.5,.5,'#5a3a20');r(w*.66,h/2-1,2,.5,'#8ab4d8');},
 // ---------- Bedroom ----------
 bed(g,o){const {r,e}=g,w=o.w,h=o.h,z=o.z,HB=34,Q=o.color===1?['#2a3a2a','#3a5040','#4f6a54','#6a8a6e']:['#3a2e4a','#4e4068','#665484','#7e6ca0'];e(w/2,h,w/2+5,4,SHADOW);
  bx(g,0,4,w,h-4,z,'#d6d0c2',OAK[1]);r(1,h-z,w-2,z-.5,OAK[1]);r(1,h-z,w-2,.5,OAK[3]);
  for(const x of [5,w/2+2])r(x-.5,4-z+3.5,w/2-6,11,EDGE),r(x,4-z+4,w/2-7,10,CREAM[3]),r(x,4-z+12,w/2-7,2,CREAM[1]);
  const qt=4-z+18;r(.5,qt,w-1,h-4-18,Q[1]);r(.5,qt,w-1,3,Q[3]);r(.5,qt+3,w-1,.5,Q[0]);for(let y=qt+7;y<h-z;y+=8)r(.5,y,w-1,.5,Q[0]);for(let x=8;x<w;x+=10)r(x,qt+3.5,.5,h-z-qt-3.5,Q[0]);
  for(let y=qt+7;y<h-z-3;y+=8)for(let x=8;x<w-4;x+=10)if(hash(x,y)>.5)r(x+2,y+2,5,3,Q[2]);r(-.5,qt+3,1.5,h-z-qt+1,Q[1]);r(w-1,qt+3,1.5,h-z-qt+1,Q[0]);r(.5,h-z,w-1,1,Q[0]);
  bx(g,-1,0,w+2,4,HB,OAK[2],OAK[1]);r(0,4-HB+1,w,.5,OAK[3]);for(let x=6;x<w-4;x+=8)r(x,4-HB+5,4,HB-z-6,OAK[2]);},
 // The nightstand: one drawer, a lamp, a clock that went dark with the power, and a paperback. open shows the drawer pulled out,
 // with the pistol in it while gun is set.
 nightstand(g,o){const {r,e,p}=g,w=o.w,h=o.h,z=o.z,F=h-z;e(w/2,h,w/2+3,3,SHADOW);bx(g,0,0,w,h,z,OAK[2],OAK[1]);r(1,-z+1,w-2,.5,OAK[3]);r(2,F+3,w-4,6,OAK[0]);r(2.5,F+3.5,w-5,5,OAK[2]);r(w/2-1.5,F+5.5,3,1,BRASS);r(2,F+11,w-4,z-14,OAK[0]);
  if(o.open){r(1,F+2,w-2,8,EDGE);r(1.5,F+2.5,w-3,3,'#1a1410');r(1.5,F+5.5,w-3,4,OAK[3]);r(w/2-1.5,F+7,3,1,BRASS);
   // gun: the pistol lying in the drawer, seen from above.
   if(o.gun){r(w/2-5,F+3,7,1.2,EDGE);r(w/2-4.5,F+3.2,6,.8,STEEL[2]);r(w/2+1,F+3.4,1.6,1.8,'#38646d');}}
  const cx=w*.35,t=-z+h*.45;e(cx,t,3.4,1.8,EDGE);e(cx,t-.3,2.8,1.3,CREAM[1]);r(cx-.5,t-8,1,8,EDGE);p([[cx-5,t-8],[cx+5,t-8],[cx+3.5,t-14],[cx-3.5,t-14]],EDGE);p([[cx-4.2,t-8.5],[cx+4.2,t-8.5],[cx+3,t-13.5],[cx-3,t-13.5]],'#c9b088');
  r(w-9,t-3,7,4.5,EDGE);r(w-8.5,t-2.5,6,3.5,'#2a2c31');r(w-8,t-2,5,2,'#151a1e');r(4,-z+h-6,9,4,'#3f6a8a');r(4,-z+h-6,9,.5,'#5a8aaa');},
 dresser(g,o){const {r,e}=g,w=o.w,h=o.h,z=o.z,F=h-z;e(w/2,h,w/2+4,3,SHADOW);bx(g,0,0,w,h,z,OAK[2],OAK[1]);r(1,-z+1,w-2,.5,OAK[3]);
  for(let j=0;j<3;j++)for(let i=0;i<2;i++){const x=2+i*(w-4)/2,y=F+3+j*(z-6)/3,dw=(w-4)/2-1,dh=(z-6)/3-1;r(x,y,dw,dh,OAK[0]);r(x+.5,y+.5,dw-1,dh-1,OAK[2]);r(x+.5,y+.5,dw-1,.5,OAK[3]);r(x+dw/2-2,y+dh/2-.5,4,1,BRASS);}
  r(4,-z+2,12,9,EDGE);r(4.5,-z+2.5,11,8,BRASS);r(5.5,-z+3.5,9,6,'#5a7a9a');r(5.5,-z+7,9,2.5,'#3f5a3a');e(w-12,-z+h/2,6,2.6,EDGE);e(w-12,-z+h/2-.3,5.4,2,'#5a3a5a');r(w-26,-z+4,8,6,'#7a2a22');},
 laundry(g,o){const {r,e}=g,w=o.w,h=o.h,z=o.z;e(w/2,h,w/2+2,2.5,SHADOW);bx(g,0,0,w,h,z,'#a8936a','#8a7650');for(let y=h-z+2;y<h-1;y+=2)r(1,y,w-2,.5,'#6a5a3a');
  for(const [x,y,c] of [[3,-z+1,'#3f6a8a'],[w/2,-z+2,'#c0392b'],[w-6,-z,'#d6d0c2'],[w/2-3,-z-2,'#4a4a4a']])e(x,y,4,3,EDGE),e(x,y-.3,3.4,2.4,c);},
 // ---------- Bathroom ----------
 tub(g,o){const {r,e}=g,w=o.w,h=o.h,z=o.z;e(w/2,h,w/2+4,3,SHADOW);bx(g,0,0,w,h,z,PORC[2],PORC[1]);r(1,-z+1,w-2,.5,PORC[3]);
  r(4,-z+3,w-8,h-6,PORC[0]);r(5,-z+4,w-10,h-8,'#9ab0b4');r(5,-z+4,w-10,2,'#7a9094');r(8,-z+h-6,w-18,1,'#b8d0d4');e(w-8,-z+h/2,1.2,.8,INK);
  r(4,-z-2,3,5,EDGE);r(4.5,-z-1.5,2,4,STEEL[3]);r(2,-z,7,1.5,STEEL[3]);for(let x=w/4;x<w;x+=w/4)r(x,h-z+2,.5,z-4,PORC[0]);},
 toilet(g,o){const {r,e}=g,w=o.w,h=o.h,z=o.z,cx=w/2;e(cx,h,cx+2,3,SHADOW);
  // The tank against the wall, then the pedestal and the bowl in front of it, lid down.
  bx(g,1,0,w-2,7,28,PORC[2],PORC[1]);r(2,-27,w-4,.5,PORC[3]);r(w-5,7-28+3,3,1,STEEL[3]);
  r(cx-4.5,4,9,h-6,EDGE);r(cx-4,4,8,h-6.5,PORC[1]);r(cx-4,4,2,h-6.5,PORC[2]);e(cx,h-2.5,cx-3,2.5,EDGE);e(cx,h-2.8,cx-3.5,2,PORC[1]);
  const by=7-z+(h-7)/2;e(cx,by,cx-.5,(h-7)/2,EDGE);e(cx,by-.5,cx-1,(h-7)/2-.5,PORC[2]);e(cx,by-1,cx-2.5,(h-7)/2-2,PORC[3]);r(cx-3,by-1,6,.5,PORC[1]);},

 vanity(g,o){const {r,e,l}=g,w=o.w,h=o.h,z=o.z,F=h-z;e(w/2,h,w/2+3,3,SHADOW);bx(g,0,0,w,h,z,PORC[2],'#ccc6b8');r(1,-z+1,w-2,.5,PORC[3]);
  for(const x of [2,w/2+1]){r(x,F+3,w/2-3,z-6,'#a8a294');r(x+.5,F+3.5,w/2-4,z-7,'#d6d0c2');}r(w/2-3,F+z/2,1,3,STEEL[3]);r(w/2+2,F+z/2,1,3,STEEL[3]);
  e(w/2,-z+h/2+1,9,4,EDGE);e(w/2,-z+h/2+.7,8.3,3.4,PORC[1]);e(w/2,-z+h/2+1.2,6,2.2,'#9ab0b4');r(w/2-1,-z+1,2,4,EDGE);r(w/2-.5,-z+1.5,1,3,STEEL[3]);l(w/2,-z+2,w/2,-z+5,.8,STEEL[3]);
  r(w-7,-z+2,4,6,EDGE);r(w-6.5,-z+2.5,3,5,'#d97a9a');r(3,-z+3,6,3,'#c9c0aa');},
 // ---------- Hall ----------
 // The hall closet: bifold doors, louvered. open folds them back on coats, a shelf of boxes and the lockbox on the floor; box
 // opens the lockbox ('open' with the shotgun inside, 'empty' after).
 closet(g,o){const {r,e}=g,w=o.w,h=o.h,z=o.z,F=h-z,D=['#a29c90','#c2bcaf','#d8d2c4'];e(w/2,h,w/2+4,3,SHADOW);bx(g,-2,0,w+4,h,z,'#3a3430','#5a524a');r(-1,-z+1,w+2,.5,'#5a524a');
  const ix=2,iw=w-4,it=F+4,ib=h-1;r(ix-1,it-1,iw+2,ib-it+1,TRIM[1]);r(ix,it,iw,ib-it,'#15120f');
  if(o.open){r(ix,it+3,iw,1.5,STEEL[2]);for(const [x,c] of [[ix+5,'#5a2e2a'],[ix+12,'#3a4a5a'],[ix+19,'#4a4a3a'],[ix+26,'#6a5238']]){if(x>ix+iw-6)continue;r(x-.5,it+4,1,2,STEEL[3]);r(x-3.5,it+6,8,22,EDGE);r(x-3,it+6.5,7,21,c);r(x-.5,it+7,1,20,'#00000033');}
   r(ix+1,it+.5,iw-2,2,OAK[2]);for(const [x,bw,c] of [[ix+2,10,'#8a7258'],[ix+14,8,'#a88e6c']])r(x,it-4,bw,4.5,EDGE),r(x+.5,it-3.5,bw-1,3.5,c);
   const lx=ix+iw/2-9,ly=ib-11;r(lx-.5,ly-.5,19,11,EDGE);r(lx,ly,18,4,STEEL[1]);r(lx,ly+4,18,6,STEEL[0]);r(lx,ly,18,.5,STEEL[2]);r(lx+12,ly+5.5,4,3,'#1b1c20');r(lx+12.5,ly+6,1,1,'#7fd18b');r(lx+3,ly+6,6,1.5,STEEL[2]);
   // box: 'open' lifts the lid on the shotgun and a carton of shells; 'empty' once they are taken.
   if(o.box){r(lx-.5,ly-6.5,19,6.5,EDGE);r(lx,ly-6,18,5.5,STEEL[0]);r(lx,ly-6,18,.5,STEEL[2]);r(lx+.5,ly+.5,17,3,'#101114');
    if(o.box==='open'){r(lx+1,ly+1,15,1.2,'#6b3f27');r(lx+6,ly+1,10,.8,STEEL[2]);r(lx+1,ly+1,4,1.6,'#4a2a1a');r(lx+13,ly+2,3.5,1.5,'#a0302a');r(lx+13,ly+2,3.5,.5,'#d9c27a');}}
   for(let k=0;k<3;k++)e(ix+4+k*5,ib-1.5,2.4,1.4,['#2a2c31','#5a2e2a','#3a3d44'][k]);
   for(const x of [ix-3,ix+iw-3])r(x-.5,it-.5,7,ib-it+1,EDGE),r(x,it,6,ib-it,D[1]);}
  else{for(const x of [ix,ix+iw/2]){const dw=iw/2;r(x,it,dw-.5,ib-it,D[1]);r(x,it,dw-.5,.5,D[2]);r(x+dw/2-.25,it,.5,ib-it,D[0]);for(let y=it+3;y<ib-3;y+=2){r(x+1.5,y,dw/2-2.5,.5,D[0]);r(x+dw/2+1,y,dw/2-2.5,.5,D[0]);}}r(ix+iw/2-2.5,it+(ib-it)/2,1,3,BRASS);r(ix+iw/2+1.5,it+(ib-it)/2,1,3,BRASS);}},
 // The gun safe on its own: a steel box with a keypad, for when it is lifted out of the closet.
 lockbox(g,o){const {r,e}=g,w=o.w,h=o.h,z=o.z,F=h-z;e(w/2,h,w/2+2,2.5,SHADOW);bx(g,0,0,w,h,z,STEEL[1],STEEL[0]);r(1,-z+1,w-2,.5,STEEL[2]);r(w-7,F+2,5,z-4,'#1b1c20');for(let k=0;k<3;k++)r(w-6.5+k*1.5,F+3,1,1,STEEL[2]);r(w-6,F+z-3,1,1,o.open?'#7fd18b':'#c0392b');r(2,F+z/2-1,6,1.5,STEEL[2]);r(1,-z+h/2,w-2,.5,STEEL[0]);},
 console(g,o){const {r,e}=g,w=o.w,h=o.h,z=o.z;e(w/2,h,w/2+3,3,SHADOW);for(const x of [1,w-4]){r(x-.5,h-z,4,z,EDGE);r(x,h-z,3,z-.5,OAK[1]);}r(3,h-8,w-6,2,OAK[1]);
  bx(g,0,0,w,h,z,OAK[2],OAK[1],'#ffffff22',z-4);r(1,-z+1,w-2,.5,OAK[3]);e(9,-z+h/2,6,2.4,EDGE);e(9,-z+h/2-.3,5.4,1.8,'#2e4a6a');r(7,-z+h/2-1.5,3,1,BRASS);r(11,-z+h/2-1,2,.5,STEEL[3]);
  for(let k=0;k<3;k++)r(w-20+k,-z+2+k,12,7,EDGE),r(w-19.5+k,-z+2.5+k,11,6,['#e8e0d1','#d6cdb8','#c9c0aa'][k]);r(w-16,-z+6,5,.5,'#6c6556');},
 shoes(g,o){const {r,e}=g,w=o.w,h=o.h;r(0,0,w,h,'#2a2c31');r(.5,.5,w-1,h-1,'#3a3d44');for(const [x,c,l2] of [[3,'#4a3424','#664a32'],[w/2+1,'#3f5a7a','#d6d0c2']])for(let i=0;i<2;i++){const yy=1.5+i*(h/2-.5);e(x+5,yy+2.5,5.5,2.6,EDGE);e(x+5,yy+2.2,5,2,c);e(x+3,yy+2,2,1.3,l2);}},
 doormat(g,o){const {r}=g,w=o.w,h=o.h;r(0,0,w,h,'#3a2c1e');r(1,1,w-2,h-2,'#7a5a34');for(let y=2;y<h-2;y+=1.5)r(2,y,w-4,.5,'#8a6a40');for(let x=2;x<w-2;x+=3)r(x,1,.5,h-2,'#6a4a28');},
 // ---------- On the walls ----------
 // A framed picture. pic 0 a family photo, 1 a mountain print, 2 the dog, 3 a beach.
 frame(g,o){const {r,e,p}=g,w=o.w,h=o.h,z=o.z,fw=o.fw||14,fh=o.fh||11,x=(w-fw)/2,y=h-z+(o.top||8);r(x-.5,y-.5,fw+1,fh+1,EDGE);r(x,y,fw,fh,o.gold?BRASS:'#2a2420');r(x+1.5,y+1.5,fw-3,fh-3,'#d6d0c2');const ix=x+2,iy=y+2,iw=fw-4,ih=fh-4,k=o.pic|0;
  if(k===1){r(ix,iy,iw,ih,'#7a94ac');p([[ix,iy+ih],[ix+iw*.35,iy+ih*.25],[ix+iw*.6,iy+ih*.6],[ix+iw*.8,iy+ih*.35],[ix+iw,iy+ih]],'#46586a');r(ix+iw*.3,iy+ih*.3,1.5,.5,'#e6e0d2');}
  else if(k===2){r(ix,iy,iw,ih,'#8aa070');e(ix+iw/2,iy+ih*.6,iw*.28,ih*.32,'#8a5a30');e(ix+iw/2,iy+ih*.32,iw*.18,ih*.22,'#9a6a3a');r(ix+iw/2-1,iy+ih*.3,.5,.5,INK);r(ix+iw/2+.5,iy+ih*.3,.5,.5,INK);}
  else if(k===3){r(ix,iy,iw,ih*.5,'#8ab4d8');r(ix,iy+ih*.5,iw,ih*.2,'#3f6a8a');r(ix,iy+ih*.7,iw,ih*.3,'#d9c08a');e(ix+iw*.75,iy+ih*.2,1.2,1.2,'#f2e0a0');}
  else{r(ix,iy,iw,ih,'#a8936a');for(const [dx,c,s] of [[.25,'#5a3a2a',.9],[.5,'#2e1e18',1],[.75,'#c9a07a',.8]]){e(ix+iw*dx,iy+ih*(.75-s*.38),1.6*s,1.6*s,c);r(ix+iw*dx-1.6*s,iy+ih*(.75-s*.38)+1.4*s,3.2*s,ih,['#3a4a5a','#7a2a22','#3f5a3a'][Math.round(dx*4)-1]);}}},
 clock(g,o){const {r,e,l}=g,w=o.w,h=o.h,z=o.z,cx=w/2,cy=h-z+13;e(cx,cy,6,6,EDGE);e(cx,cy,5.3,5.3,'#d6d0c2');e(cx,cy,4.4,4.4,'#e8e0d1');for(let i=0;i<12;i++){const a=i/12*Math.PI*2;r(cx+Math.cos(a)*3.6-.25,cy+Math.sin(a)*3.6-.25,.5,.5,INK);}
  l(cx,cy,cx+.5,cy-3,.6,INK);l(cx,cy,cx+2.5,cy+1,.6,INK);l(cx,cy,cx-2,cy+2.5,.3,'#a33b2e');},
 calendar(g,o){const {r}=g,w=o.w,h=o.h,z=o.z,x=(w-12)/2,y=h-z+9;r(x-.5,y-.5,13,17,EDGE);r(x,y,12,7,'#7a94ac');r(x,y+7,12,9,'#e8e0d1');r(x+1,y+1,10,5,'#5a7a9a');for(let j=0;j<3;j++)for(let i=0;i<4;i++)r(x+1.5+i*2.5,y+8.5+j*2.4,1.5,1.2,(i+j*4)===6?'#a33b2e':'#b8b2a6');r(x+5.5,y-1.5,1,2,STEEL[3]);},
 mirror(g,o){const {r}=g,w=o.w,h=o.h,z=o.z,mw=o.fw||18,x=(w-mw)/2,y=h-z+5;r(x-.5,y-.5,mw+1,19,EDGE);r(x,y,mw,18,STEEL[2]);r(x+1,y+1,mw-2,16,'#5a6a74');r(x+1,y+1,mw-2,8,'#6a7c86');for(let k=0;k<3;k++)r(x+3+k*2,y+12-k*3,4,.5,'#9ab0b8');},
 // Coat hooks: a rail with a raincoat, a scarf and the dog's leash.
 hooks(g,o){const {r,e,l}=g,w=o.w,h=o.h,z=o.z,y=h-z+8;r(0,y-.5,w,3,EDGE);r(.5,y,w-1,2,OAK[2]);r(.5,y,w-1,.5,OAK[3]);const n=Math.max(2,Math.round(w/8));for(let i=0;i<n;i++)r(3+i*(w-6)/(n-1)-.5,y+1.5,1.5,2,STEEL[3]);
  r(2,y+3,9,18,EDGE);r(2.5,y+3.5,8,17,'#c9a23a');r(6,y+4,.5,15,'#a8862a');if(w>18){r(w/2-2,y+3,5,14,EDGE);r(w/2-1.5,y+3.5,4,13,'#7a2a22');}l(w-4,y+3,w-6,y+16,1,'#c0392b');e(w-6,y+16.5,1.5,1,'#c0392b');},
 // ---------- Outside ----------
 bush(g,o){const {e,r}=g,w=o.w,h=o.h,z=o.z,L=['#14251a','#1f3a24','#2c5232','#3d6c40'];e(w/2,h,w/2+2,3,SHADOW);const n=Math.max(2,Math.round(w/10));
  for(let i=0;i<n;i++){const x=w*(i+.5)/n,s=w/n*.75+hash(i,o.x|0)*3,y=h-4-z*.5+hash(o.y|0,i)*4;e(x,y,s+1,z*.5+1,EDGE);}for(let i=0;i<n;i++){const x=w*(i+.5)/n,s=w/n*.75+hash(i,o.x|0)*3,y=h-4-z*.5+hash(o.y|0,i)*4;e(x,y,s,z*.5,L[1]);e(x-s*.2,y-z*.15,s*.65,z*.3,L[2]);e(x-s*.35,y-z*.3,s*.3,z*.14,L[3]);}
  for(let k=0;k<w/3;k++)r(hash(k,o.x|0)*w,h-z+hash(o.y|0,k)*z*.8,1,.5,L[0]);},
 // The front step: a concrete slab with two steps down to the path.
 porch(g,o){const {r}=g,w=o.w,h=o.h,C=['#3a3b3f','#4b4d52','#5f6166','#6a6c70'];r(-.5,-.5,w+1,h+1,EDGE);r(0,0,w,h*.5,C[2]);r(0,0,w,.5,C[3]);r(4,h*.5,w-8,h*.25,C[1]);r(4,h*.5,w-8,.5,C[3]);r(8,h*.75,w-16,h*.25,C[0]);r(8,h*.75,w-16,.5,C[2]);for(let k=0;k<6;k++)r(2+hash(k,9)*(w-6),1+hash(9,k)*h*.4,2,.5,C[1]);},
 mailbox(g,o){const {r,e}=g,w=o.w,h=o.h,z=o.z;e(w/2,h,4,2,SHADOW);r(w/2-1,h-z+8,2,z-8,EDGE);r(w/2-.5,h-z+8,1,z-8,OAK[2]);r(-2,h-z-.5,w+4,9,EDGE);r(-1.5,h-z,w+3,8,'#2e3b4a');r(-1.5,h-z,w+3,1.5,'#3f5266');r(w+1,h-z+1,1.5,4,'#c0392b');r(w/2-2,h-z+3,4,1,'#c9c0aa');},
 picket(g,o){const {r,p}=g,w=o.w,h=o.h,z=o.z,PK=['#6a675e','#8c887c','#a8a395'];r(0,h-z+5,w,2,EDGE);r(0,h-z+5.5,w,1,PK[0]);r(0,h-z+14,w,2,EDGE);r(0,h-z+14.5,w,1,PK[0]);
  for(let x=1;x<w-3;x+=5){const t=h-z+(hash(x,o.y|0)>.9?2:0);p([[x-.5,t+2],[x+1.5,t-.5],[x+3.5,t+2],[x+3.5,h+.5],[x-.5,h+.5]],EDGE);p([[x,t+2],[x+1.5,t],[x+3,t+2],[x+3,h],[x,h]],PK[1]);r(x,t+2,.5,h-t-2,PK[2]);}},
 // An inside door standing half open, beside a doorway in a wall that runs away from you, so the opening reads. The hinge is at
 // the bottom left of the footprint and the door swings up and to the right: a wooden slab, two sunk panels and a brass knob.
 doorleaf(g,o){const {p,e,l}=g,w=o.w,h=o.h,z=o.z,at=(u,v)=>[u*w,h-u*h-v],quad=(u0,u1,v0,v1,c)=>p([at(u0,v0),at(u1,v0),at(u1,v1),at(u0,v1)],c);e(w/2,h/2+2,w/2+2,4,SHADOW);
  p([[-.5,h+.5],[w+1,-.5],[w+1,-z-.5],[-.5,h-z-.5]],EDGE);quad(0,1,0,z,OAK[1]);quad(.94,1,0,z,OAK[2]);l(0,h-z,w,-z,.5,OAK[3]);
  for(const [v0,v1] of [[z*.08,z*.44],[z*.54,z*.9]]){quad(.18,.78,v0,v1,OAK[0]);quad(.2,.76,v0+1,v1-1,OAK[1]);}
  const [kx,ky]=at(.86,z*.48);p([[kx-1,ky-1],[kx+1,ky-2],[kx+1,ky],[kx-1,ky+1]],EDGE);p([[kx-.5,ky-.5],[kx+.5,ky-1],[kx+.5,ky-.5],[kx-.5,ky]],'#c9a24a');},
};
// Everything that stands on the floor gets a soft contact shadow; this helper is for the few tall things drawn without one above.
function e2(g,w,h){g.e(w/2,h,w/2+3,3,SHADOW);}
export const HOME_KINDS=Object.keys(HOME_ART);
// Wall pieces, decorations and things that lie flat, so a game can sort them: walls block, decorations hang, flat things are walked over.
export const HOME_WALLS=new Set(['wall','wallV','doorway','doorwayV','window','windowV','frontdoor']),HOME_DECOR=new Set(['frame','clock','calendar','mirror','hooks']),HOME_FLAT=new Set(['rug','dogbed','petbowls','shoes','doormat','porch']);
export {PROP_PAD};
// Kinds this file does not draw fall back to the workshop and camp props.
export function propArt(c,o){if(!HOME_ART[o.kind])return workshopPropArt(c,o);c.save();c.scale(2,2);c.translate(PROP_PAD,o.z+PROP_PAD);HOME_ART[o.kind](painter(c),o);c.restore();}
