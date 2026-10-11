// Base props: LEET AF's staging hangar at Harlan Field, where the opening mission is briefed. The hangar's corrugated walls and its
// steel columns, the stage with its podium and the pull-down projector screen (six slides for the briefing), the folding chairs the
// unit sits in, the projector cart, the armory cage, a bank of lockers, the unit's banner, an armored personnel carrier with its ramp
// down, sample cases, a briefing board and the coffee table; and out in the Hollow, the containment beacon and its case, the Marrow
// courier on its roof at the crash, the ammo cans by the ramp and Gadget's drone. Same conventions as street.js: footprint top left
// at (0, 0), height rising into negative y, a box's top seen as y in [-z, h-z] and its front face below that. Kinds this file does
// not draw fall through to the town set and from there to every other set.
import {painter,hash2 as hash} from '../core/paint.js';
import {EDGE,SHADOW,PROP_PAD} from './camp.js';
import {propArt as townPropArt} from './town.js';
import {text as stencil,textWidth as stencilWidth} from './workshop.js';
import {GLYPHS} from '../ui/font5x7.js';
export {PROP_PAD};
// What the base is made of, shade to highlight: hangar steel, olive drab paint, the unit's navy and gold, walnut for the podium,
// screen white, hazard yellow, signal red, and Marrow Industries' teal (LZ-6 glows its palest).
const ST=['#16191d','#1f2328','#292e34','#343a41','#424a52','#55606a'],OD=['#1b2016','#262d1e','#323b27','#3f4a31','#4f5c3d','#62704c'];
const NV=['#0e1320','#151c2e','#1e2840','#2a3756','#3a4a70'],GD=['#5e4a1c','#8a6c28','#b8923a','#dcb85a','#f0d888'];
const WN=['#1c140f','#281d15','#36271c','#463324','#57412e'],SC=['#8e8c86','#b4b1a9','#d2cfc6','#e8e6df','#f6f5f0'];
const HZ=['#6a5414','#9c7e1e','#cca42a','#e8c444'],BLK='#141518',RED=['#5a1612','#8a2620','#b8402e','#e0644a'];
const TL=['#0f3a34','#1a5a4e','#2a8a74','#4cc0a0','#8ae8cc'],LZ='#b8ffd8',MAP=['#16211b','#1d2b23','#28392f','#3a4c40','#55685a'];
// Letters from the 5 × 7 screen font at k units a pixel, for the slides and small labels.
function type(g,s,x,y,k,col){[...s].forEach((ch,i)=>{const h=GLYPHS[ch]||GLYPHS[' '];for(let row=0;row<7;row++){const b=parseInt(h.slice(row*2,row*2+2),16);for(let c=0;c<5;c++)if(b>>(4-c)&1)g.r(x+(i*6+c)*k,y+row*k,k,k,col);}});}
const typeW=(s,k)=>(s.length*6-1)*k,mid=(g,s,cx,y,k,col)=>type(g,s,cx-typeW(s,k)/2,y,k,col);
// The same, turned upside down (on something lying on its roof): the whole line spun half a turn about its middle.
const type180=(g,s,x,y,k,col)=>{const W=typeW(s,k),H=7*k;type({r:(px,py,w,h,c)=>g.r(2*x+W-px-w,2*y+H-py-h,w,h,c)},s,x,y,k,col);};
// A box on footprint (x, y, w, d) from height z0 up to z1: its outline, top face and front face, the top edge lit.
function bx(g,x,y,w,d,z0,z1,top,front,hi){const {r}=g,yt=y-z1,yf=y+d-z1,yb=y+d-z0;r(x-.5,yt-.5,w+1,yb-yt+1,EDGE);r(x,yt,w,yf-yt,top);r(x,yf,w,yb-yf,front);if(hi)r(x,yt,w,.5,hi);return yf;}
// Yellow and black hazard stripes running down to the left, in a rectangle.
function hazard(g,x,y,w,h,step=3){g.r(x,y,w,h,HZ[2]);for(let yy=0;yy<h;yy+=.5)for(let k=-h-step*2;k<w;k+=step*2){const a=Math.max(0,k+yy),b=Math.min(w,k+yy+step);if(b>a)g.r(x+a,y+yy,b-a,.5,BLK);}}
// The LEET AF crest: a shield with a gold rim, a gold chevron pointing down and a white star over it. s is its height in units.
export function crest(g,cx,top,s,{rim=GD[2],field=NV[2],mark=GD[3],star=SC[4],edge=EDGE}={}){const {p}=g,w=s*.8,
  shield=(k,d)=>[[cx-w/2*k,top+d],[cx+w/2*k,top+d],[cx+w/2*k,top+s*.55],[cx,top+s-d],[cx-w/2*k,top+s*.55]];
 p(shield(1.14,-s*.06),edge);p(shield(1,0),rim);p(shield(.8,s*.09),field);
 p([[cx-w*.3,top+s*.42],[cx,top+s*.64],[cx+w*.3,top+s*.42],[cx+w*.3,top+s*.54],[cx,top+s*.76],[cx-w*.3,top+s*.54]],mark);
 const R=s*.15,st=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?R*.42:R;st.push([cx+Math.cos(a)*rr,top+s*.28+Math.sin(a)*rr]);}p(st,star);}
// The biohazard trefoil, about 2r across.
function trefoil(g,cx,cy,r,col,bg){const {e}=g;for(let i=0;i<3;i++){const a=-Math.PI/2+i*Math.PI*2/3;e(cx+Math.cos(a)*r*.55,cy+Math.sin(a)*r*.55,r*.5,r*.5,col);}
 for(let i=0;i<3;i++){const a=-Math.PI/2+i*Math.PI*2/3;e(cx+Math.cos(a)*r*.75,cy+Math.sin(a)*r*.75,r*.3,r*.3,bg);}e(cx,cy,r*.32,r*.32,col);e(cx,cy,r*.16,r*.16,bg);}
// The Hollow from the air, for the map slides: green ground, the creek, the street grid in blocks, Route 9 cutting across.
function hollowMap(g,x,y,w,h,dim=0){const {r,l}=g,c=k=>MAP[Math.max(0,k-dim)];r(x,y,w,h,c(1));for(let i=0;i<w*h/12;i++)r(x+hash(i,7)*w,y+hash(7,i)*h,.5,.5,c(i%3?0:2));
 for(let t=0;t<1;t+=.01){const cx=x+w*(.08+.06*Math.sin(t*9)),cy=y+t*h;r(cx,cy,2.5,h/100+.5,dim?'#1a2a3a':'#23405a');}
 for(let bx0=x+w*.2;bx0<x+w-8;bx0+=w*.11)for(let by=y+4;by<y+h-6;by+=h*.16){r(bx0,by,w*.09,h*.12,c(2));for(let k=0;k<3;k++)r(bx0+1+k*w*.03,by+1,w*.02,h*.04,c(3));}
 for(let bx0=x+w*.2-2;bx0<x+w;bx0+=w*.11)r(bx0,y,1,h,c(3));for(let by=y+2.5;by<y+h;by+=h*.16)r(x+w*.18,by,w*.82,1,c(3));
 l(x+w*.15,y+h,x+w,y+h*.18,2,dim?'#4a4430':'#8a7a3a');l(x+w*.15,y+h,x+w,y+h*.18,.5,dim?'#5a5438':'#c8b05a');}
// The six slides of the briefing, each painted into the screen's picture (x, y, w, h).
export const SLIDES=[
 // 0: the title card: the crest on navy, LEET AF under it, the operation's name, and the classification bars.
 (g,x,y,w,h)=>{const {r}=g;r(x,y,w,h,NV[1]);for(let i=1;i<h;i+=3)r(x,y+i,w,.5,'#ffffff06');r(x,y,w,5,RED[1]);r(x,y+h-5,w,5,RED[1]);
  mid(g,'TOP SECRET // BELL JAR',x+w/2,y+.75,.5,SC[4]);mid(g,'LEET AF EYES ONLY',x+w/2,y+h-4.25,.5,SC[4]);
  crest(g,x+w/2,y+8,24);mid(g,'LEET AF',x+w/2,y+34,1,GD[3]);mid(g,'OPERATION BELL JAR',x+w/2,y+43,.5,SC[2]);},
 // 1: the Hollow on the map, the cordon round it in red, and its name and size.
 (g,x,y,w,h)=>{const {r,e}=g;hollowMap(g,x,y,w,h);for(let i=0;i<64;i++){const a=i/64*Math.PI*2;if(i%2)continue;r(x+w*.56+Math.cos(a)*w*.36,y+h*.5+Math.sin(a)*h*.4,1.5,1,RED[3]);}
  r(x+2,y+2,typeW('DEADLIGHT HOLLOW',.5)+3,10,'#0b100dcc');type(g,'DEADLIGHT HOLLOW',x+3.5,y+3,.5,SC[4]);type(g,'POP 11,204',x+3.5,y+7.5,.5,RED[3]);
  for(const [px,py] of [[.42,.35],[.66,.62],[.5,.7]]){e(x+w*px,y+h*py,1.5,1.5,RED[3]);r(x+w*px-.25,y+h*py-.25,.5,.5,SC[4]);}},
 // 2: Marrow Industries' advert for LZ-6: the glowing vial, its name, and the promise.
 (g,x,y,w,h)=>{const {r,e,p}=g;r(x,y,w,h,'#0d1a19');for(let k=0;k<6;k++)e(x+w*.3,y+h*.5,26-k*3.5,24-k*3.5,['#0f2622','#123029','#163a31','#1a4639','#1f5444','#24624f'][k]);
  const vx=x+w*.3,vy=y+h*.16,vh=h*.66;r(vx-5.5,vy-.5,11,vh+1,EDGE);r(vx-5,vy+6,10,vh-7,'#cfe8e0');r(vx-4,vy+vh*.38,8,vh*.62-2,TL[3]);r(vx-4,vy+vh*.38,8,1.5,LZ);r(vx-3,vy+vh*.42,1.5,vh*.5,'#e8fff4');
  r(vx-5,vy,10,6,SC[1]);r(vx-5,vy,10,1,SC[3]);for(let k=1;k<5;k++)r(vx-5+k*2,vy+1,.5,5,SC[0]);type(g,'LZ',vx-2.75,vy+vh*.62,.5,TL[0]);
  type(g,'LZ-6',x+w*.5,y+h*.16,2,SC[4]);type(g,'MARROW INDUSTRIES',x+w*.5,y+h*.16+17,.5,TL[4]);
  type(g,'NOBODY HAS TO',x+w*.5,y+h*.62,.5,SC[2]);type(g,'STAY DEAD.',x+w*.5,y+h*.62+5,.5,SC[2]);p([[x+w*.5,y+h*.84],[x+w*.5+4,y+h*.84],[x+w*.5+2,y+h*.84+3]],TL[3]);},
 // 3: the crash, from a drone at night: Route 9, Marrow's courier van on its side with its wheels in the air, skid marks and
 //    debris, a red ring round it, the time burned into the corner.
 (g,x,y,w,h)=>{const {r,l,e,p}=g;r(x,y,w,h,'#262c22');for(let i=0;i<w*h/5;i++)r(x+hash(i,3)*w,y+hash(3,i)*h,.5,.5,i%4?'#1e231b':'#30372b');
  p([[x,y+h*.75],[x+w,y+h*.08],[x+w,y+h*.42],[x,y+h]],'#3a3c3c');for(let t=.05;t<1;t+=.1)l(x+w*t,y+h*(.875-.73*t),x+w*(t+.04),y+h*(.875-.73*(t+.04)),.75,'#a89a50');
  for(let i=0;i<w*h/10;i++){const px=x+hash(i,9)*w,py=y+hash(9,i)*h;if(py>y+h*(.75-.67*(px-x)/w)&&py<y+h*(1-.58*(px-x)/w))r(px,py,.5,.5,'#4a4c4a');}
  l(x+w*.2,y+h*.86,x+w*.48,y+h*.6,.75,'#1a1b1c');l(x+w*.22,y+h*.9,x+w*.5,y+h*.64,.75,'#1a1b1c');
  const vx=x+w*.55,vy=y+h*.38;p([[vx,vy+2],[vx+22,vy-6],[vx+26,vy+4],[vx+4,vy+12]],EDGE);p([[vx+.5,vy+2.5],[vx+21.5,vy-5.5],[vx+25,vy+3.5],[vx+4.5,vy+11.5]],SC[3]);p([[vx+2,vy+6],[vx+23,vy-2],[vx+24,vy+.5],[vx+3,vy+8.5]],TL[2]);
  for(const [a,b] of [[4,1],[18,-4]])e(vx+a,vy+b,2,1.5,BLK);for(let i=0;i<9;i++)r(vx-8+hash(i,1)*40,vy-6+hash(1,i)*24,1,.5,i%2?SC[2]:'#8a8c88');
  for(let i=0;i<48;i++){const a=i/48*Math.PI*2;if(i%3===2)continue;r(vx+13+Math.cos(a)*22,vy+3+Math.sin(a)*14,1,1,RED[3]);}
  for(const [cx,cy,sx,sy] of [[x+2,y+2,1,1],[x+w-2,y+2,-1,1],[x+2,y+h-2,1,-1],[x+w-2,y+h-2,-1,-1]]){r(Math.min(cx,cx+sx*5),cy,5,.5,SC[3]);r(cx,Math.min(cy,cy+sy*5),.5,5,SC[3]);}
  type(g,'RT 9  MILE 4',x+5,y+4,.5,HZ[3]);type(g,'23:41:07',x+5,y+8.5,.5,HZ[3]);r(x+w-18,y+4,3,3,RED[3]);type(g,'REC',x+w-14,y+4,.5,SC[4]);},
 // 4: the containment beacon, as a blueprint: a tripod and mast, the battery box, the strobe head lit red, a dimension line.
 (g,x,y,w,h)=>{const {r,l,e}=g,B='#d8e6f4';r(x,y,w,h,'#173a6a');for(let gx=x+6;gx<x+w;gx+=6)r(gx,y,.5,h,'#1f4a80');for(let gy=y+6;gy<y+h;gy+=6)r(x,gy,w,.5,'#1f4a80');
  const cx=x+w*.32,base=y+h-6,top=y+10;l(cx,base-18,cx-12,base,.75,B);l(cx,base-18,cx+12,base,.75,B);l(cx,base-18,cx+3,base+1,.75,B);r(cx-.5,top+6,1,base-18-top-6,B);
  r(cx-5,base-26,10,7,B);r(cx-4.5,base-25.5,9,6,'#173a6a');type(g,'+',cx-1.25,base-25,.5,B);e(cx,top+3,4.5,4,B);e(cx,top+3,3.5,3,RED[3]);e(cx-1,top+2,1,1,'#ffd0c0');
  for(const k of [-1,1])l(cx+k*6,top+3,cx+k*10,top+1,.5,RED[3]);l(cx+16,top,cx+16,base,.5,B);r(cx+14,top,4,.5,B);r(cx+14,base-.5,4,.5,B);type(g,'1.8 M',cx+18,y+h*.45,.5,B);
  type(g,'CONTAINMENT',x+w*.58,y+8,.5,B);type(g,'BEACON MK II',x+w*.58,y+13,.5,B);type(g,'STROBE + RADIO',x+w*.58,y+22,.5,'#9ab8d8');type(g,'RANGE 2 KM',x+w*.58,y+27,.5,'#9ab8d8');type(g,'72 HR CELL',x+w*.58,y+32,.5,'#9ab8d8');},
 // 5: the Hollow cut into eight sectors, one pair to each; sector 6, yours, lit in amber, with the drop point and the crash in it.
 (g,x,y,w,h)=>{const {r,p}=g;hollowMap(g,x,y,w,h,1);const sw=w/4,sh=h/2;for(let i=1;i<4;i++)r(x+i*sw-.25,y,.5,h,SC[3]);r(x,y+sh-.25,w,.5,SC[3]);
  r(x+sw,y+sh,sw,sh,'#d08a2a40');for(const [a,b,c,d] of [[x+sw,y+sh,sw,.75],[x+sw,y+h-.75,sw,.75],[x+sw,y+sh,.75,sh],[x+2*sw-.75,y+sh,.75,sh]])r(a,b,c,d,HZ[3]);
  for(let i=0;i<8;i++){const cx=x+(i%4)*sw+sw/2,cy=y+Math.floor(i/4)*sh+5;mid(g,String(i+1),cx,cy,1,i===5?HZ[3]:SC[2]);}
  mid(g,'HOLLOW 6',x+sw*1.5,y+h-9,.5,HZ[3]);p([[x+sw*1.25,y+sh+12],[x+sw*1.25+3,y+sh+17],[x+sw*1.25-3,y+sh+17]],SC[4]);
  const sx=x+sw*1.72,sy=y+sh+14;p([[sx,sy-3],[sx+1,sy-1],[sx+3,sy-1],[sx+1.5,sy+.5],[sx+2,sy+3],[sx,sy+1.5],[sx-2,sy+3],[sx-1.5,sy+.5],[sx-3,sy-1],[sx-1,sy-1]],RED[3]);}];
export const SLIDE_NAMES=['Title','The Hollow','LZ-6','The crash','The beacon','Sectors'];
// The truck's inside (apcbay): its paint, a pale olive, and the tread plate of its floor.
const IN=['#232823','#2f362f','#3c443b','#4c564a','#5f6a5c','#78836f'],FL=['#1d2023','#272b2f','#33383d','#41474d','#535a61'];
// How the inside of the truck is laid out along its length: the walls' thickness T, the cut walls' height C, the dash's depth FW, the
// front wall at xf and the partition at xp, and each bench's n seats, SW apart.
export function apcFrame(o){const T=6,C=8,FW=10,xf=o.w-14-T,xp=xf-(o.cab||66)-4,SW=26;return {T,C,FW,xf,xp,SW,n:Math.floor((xp-T-6)/SW)};}
// Where everyone sits, in the truck's own units: x along it, y the middle of the cushion, hip where a seated body's hips are drawn
// (the cushion's top), and for the north bench feet, where the boots rest on the floor in front of it.
export function apcSeats(o){const {T,FW,xf,xp,n,SW}=apcFrame(o),H=o.h,at=i=>T+3+i*SW+(SW-1)/2,dx=xf-FW-24;
 return {north:[...Array(n)].map((_,i)=>({x:at(i),y:T+6.5,hip:T-4.5,feet:T+16})),south:[...Array(n)].map((_,i)=>({x:at(i),y:H-T-6.5,hip:H-T-17.5})),
  driver:{x:dx,y:T+11,hip:T+1},commander:{x:dx,y:H-T-11,hip:H-T-21}};}
export const BASE_ART={
 // The hangar's back wall, face on: its cap from above, then corrugated steel with a rib every 4 units, panel seams and rivets, rain
 // and rust run down from the seams, a steel girder near the top with clerestory windows over it (night outside), and a painted dado
 // along the bottom with a kick rail, scuffed. o.sign stencils big letters on the face at o.signX.
 hangarwall(g,o){const {r}=g,w=o.w,h=o.h,z=o.z,s=(o.x|0)+(o.y|0)*7,yf=h-z;
  r(-.5,-z-.5,w+1,h+z+1,EDGE);r(0,-z,w,h,ST[1]);r(0,-z,w,.5,ST[4]);r(0,yf-1,w,1,ST[0]);
  r(0,yf,w,z,ST[2]);for(let x=0;x<w;x+=4){r(x,yf,1.5,z,ST[3]);r(x+.5,yf,.5,z,ST[4]);r(x+3.5,yf,.5,z,ST[1]);}
  for(let x=48;x<w;x+=48){r(x-.25,yf,.75,z,ST[0]);for(let y=yf+3;y<h-20;y+=6)r(x+1,y,.5,.5,ST[5]);}
  for(let i=0;i<w/12;i++){const x=Math.floor(hash(i,s)*w/48)*48+1+hash(s,i)*3,y=yf+24,n=8+hash(i,s+1)*30;r(x,y,.5,n,i%3?'#00000026':'#6a402434');}
  const gy=yf+16;r(0,gy-.5,w,8,EDGE);r(0,gy,w,7,ST[1]);r(0,gy,w,1.5,ST[4]);r(0,gy+5.5,w,1.5,ST[2]);r(0,gy+1.5,w,.5,ST[0]);for(let x=5;x<w;x+=10){r(x,gy+.5,.5,.5,ST[5]);r(x,gy+6,.5,.5,ST[3]);}
  for(let x=40;x+56<w;x+=140){r(x-.5,yf+2.5,57,11,EDGE);r(x,yf+3,56,10,'#0b1019');for(let k=1;k<4;k++)r(x+k*14,yf+3,.75,10,ST[1]);r(x,yf+7.5,56,.75,ST[1]);r(x,yf+3,56,.5,'#18233a');r(x+3+hash(x,s)*36,yf+4,1.5,.5,'#2a3a5a');}
  const dy=h-20;r(0,dy,w,20,OD[2]);r(0,dy,w,1,OD[4]);r(0,dy+1,w,.5,OD[1]);for(let x=0;x<w;x+=4)r(x+3.5,dy+1.5,.5,18.5,OD[1]);
  r(0,h-5,w,5,ST[1]);r(0,h-5,w,.5,ST[4]);r(0,h-1,w,1,ST[0]);for(let i=0;i<w/16;i++)r(hash(i,s+3)*w,h-7-hash(s+3,i)*8,2+hash(i,9)*8,.5,OD[0]);
  if(o.sign)stencil(g,o.sign,o.signX??8,yf+28,o.signK||3,'#a49e8066');},
 // A side wall running away from you: its cap from above with column flanges standing proud along it, and its end facing you.
 hangarwallV(g,o){const {r}=g,w=o.w,h=o.h,z=o.z;r(-.5,-z-.5,w+1,h+z+1,EDGE);r(0,-z,w,h,ST[1]);r(0,-z,.5,h,ST[4]);r(w-.5,-z,.5,h,ST[0]);
  for(let y=-z+40;y<h-z-4;y+=48){r(-1,y-.5,w+2,4,EDGE);r(-.5,y,w+1,3,ST[3]);r(-.5,y,w+1,.5,ST[5]);}
  r(0,h-z,w,z,ST[2]);for(let x=0;x<w;x+=3)r(x,h-z,.5,z,ST[4]);r(0,h-20,w,20,OD[2]);r(0,h-20,w,1,OD[4]);r(0,h-5,w,5,ST[1]);r(0,h-5,w,.5,ST[4]);},
 // A steel column where the big door's frame meets the floor: the flange facing you with its rivets, a cap plate on top, and a yellow
 // and black guard round its foot against forklifts.
 column(g,o){const {r}=g,w=o.w,h=o.h,z=o.z,yf=h-z;r(-1.5,h-1,w+3,3,SHADOW);r(-.5,-z-.5,w+1,h+z+1,EDGE);r(0,-z,w,h,ST[3]);r(0,-z,w,.5,ST[5]);
  r(0,yf,w,z,ST[2]);r(0,yf,1.5,z,ST[4]);r(w-1.5,yf,1.5,z,ST[1]);r(w/2-.75,yf,1.5,z,ST[1]);for(let y=yf+4;y<h-16;y+=7){r(2,y,.5,.5,ST[5]);r(w-2.5,y,.5,.5,ST[5]);}
  r(-.5,h-16.5,w+1,17,EDGE);hazard(g,0,h-16,w,16,2.5);r(0,h-16,w,.5,HZ[3]);},
 // The pull-down projector screen on the wall: the aluminium roller case, the matte face in a black border showing o.slide (SLIDES),
 // the weighted bar and the pull handle on its cord. o.drop is how far the face hangs below the case; o.off shows it blank.
 screen(g,o){const {r,l}=g,w=o.w,h=o.h,z=o.z,drop=o.drop||66,y0=h-z;
  r(-2.5,y0-.5,w+5,6,EDGE);r(-2,y0,w+4,5,'#8f949a');r(-2,y0,w+4,1,'#c4c8cc');r(-2,y0+4,w+4,1,'#55595e');r(-3,y0+1,1.5,3,'#3a3d42');r(w+1.5,y0+1,1.5,3,'#3a3d42');
  const x0=3,x1=w-3,fy=y0+5,px=x0+2.5,py=fy+5,pw=x1-x0-5,ph=drop-8;r(x0-.5,fy,x1-x0+1,drop+.5,EDGE);r(x0,fy,x1-x0,drop,BLK);
  if(o.off){r(px,py,pw,ph,SC[1]);r(px,py,pw,.5,SC[3]);}else SLIDES[(o.slide|0)%SLIDES.length](g,px,py,pw,ph,o);
  r(x0,fy+drop-1.5,x1-x0,1.5,'#2a2b2e');r(x0,fy+drop-1.5,x1-x0,.5,'#4a4c50');l(w/2,fy+drop,w/2,fy+drop+5,.5,'#55595e');r(w/2-1.5,fy+drop+5,3,1.5,'#2a2b2e');},
 // The podium: a walnut lectern with its reading top sloped toward the speaker, papers on it, a recessed front panel with the crest in
 // gold, a plinth, a gooseneck microphone and a small reading lamp.
 podium(g,o){const {r,p,e,l}=g,w=o.w,h=o.h,z=o.z,yf=h-z;e(w/2,h,w/2+3,3,SHADOW);
  r(-1.5,h-4,w+3,4.5,EDGE);r(-1,h-3.5,w+2,3.5,WN[1]);r(-1,h-3.5,w+2,.5,WN[3]);
  r(-.5,-z-.5,w+1,h+z-3,EDGE);r(0,-z,w,h,WN[3]);r(0,-z,w,.5,WN[4]);p([[1,-z+1],[w-1,-z+1],[w-1,-z+h*.55],[1,-z+h*.55]],WN[4]);
  p([[3,-z+2],[11,-z+1.5],[11.5,-z+7],[3.5,-z+7.5]],SC[3]);for(let k=0;k<3;k++)r(4.5,-z+3+k*1.5,5.5-k,.5,SC[0]);
  r(0,yf,w,z-3.5,WN[2]);r(0,yf,w,1,WN[4]);r(2,yf+2.5,w-4,z-9,EDGE);r(2.5,yf+3,w-5,z-10,WN[1]);r(2.5,yf+3,w-5,.5,WN[0]);crest(g,w/2,yf+6,Math.min(14,z-16));
  l(5,-z+2,4.5,-z-7,.75,EDGE);l(4.5,-z-7,7.5,-z-10,.75,EDGE);r(7,-z-11.5,2.5,2,'#1a1b1e');r(8.5,-z-11.5,1,.5,RED[3]);
  l(w-4,-z+2,w-4,-z-5,.75,'#3a3d42');p([[w-7,-z-5],[w-1,-z-5],[w-2.5,-z-7.5],[w-5.5,-z-7.5]],GD[1]);r(w-6.5,-z-5,5,.5,'#fff2c0');},
 // The briefing stage: a low riser with navy carpet on top, an aluminium nosing and a black skirt, and a step up at each end.
 stage(g,o){const {r}=g,w=o.w,h=o.h,z=o.z,s=(o.x|0)+(o.y|0)*3;r(-1.5,h-1,w+3,3,SHADOW);
  for(const x of [-16,w+1])bx(g,x,h-16,15,15,0,z/2,NV[2],BLK,'#9aa0a6');
  r(-.5,-z-.5,w+1,h+z+1,EDGE);r(0,-z,w,h,NV[2]);for(let ty=0;ty<h;ty+=10)for(let tx=0;tx<w;tx+=10){const across=((tx+ty)/10)%2,tw=Math.min(10,w-tx),th=Math.min(10,h-ty);
   if(across)for(let k=1;k<th;k+=2)r(tx,-z+ty+k,tw,.5,'#2a37561c');else for(let k=1;k<tw;k+=2)r(tx+k,-z+ty,.5,th,'#0e13201f');r(tx,-z+ty,tw,.25,'#0e132040');r(tx,-z+ty,.25,th,'#0e132040');}
  for(let i=0;i<w*h/90;i++)r(hash(i,s)*w,-z+hash(s,i)*h,.5,.5,i%2?NV[1]:NV[3]);
  r(0,-z,w,.5,NV[4]);r(0,h-z-1.5,w,1.5,'#7a8088');r(0,h-z-1.5,w,.5,'#b8bec4');r(0,h-z,w,z,BLK);for(let x=24;x<w;x+=48)r(x,h-z+.5,.5,z-1,'#26272b');},
 // A steel folding chair seen from behind, as the unit sits facing the stage: the backrest panel (17 to 28 high) with its stencilled
 // number, the tube frame, the seat behind it and the four legs with their braces. o.n is the number.
 foldchair(g,o){const {r,e}=g,w=o.w,h=o.h,F=['#202327','#2e3237','#41464c','#5a6068'],yb=h-1,yf=1.5;e(w/2,h-1,w/2+1.5,2,SHADOW);
  for(const x of [1.5,w-2.5]){r(x-.25,yf-16.25,1.5,16.5,EDGE);r(x,yf-16,1,16,F[1]);}r(1.5,yf-6,w-3,.75,F[0]);
  r(.5,yf-16.5,w-1,yb-yf+1,EDGE);r(1,yf-16,w-2,yb-yf,F[2]);
  for(const x of [.5,w-2]){r(x-.25,yb-28.5,2,29,EDGE);r(x,yb-28,1.5,28,F[2]);r(x,yb-28,.5,28,F[3]);}r(1,yb-9,w-2,.75,F[1]);
  r(-.5,yb-29,w+1,11,EDGE);r(0,yb-28.5,w,10,OD[2]);r(0,yb-28.5,w,.5,OD[4]);r(0,yb-19,w,.5,OD[1]);r(w-1,yb-28,.5,9,OD[1]);
  if(o.n!==undefined){const t=String(o.n);stencil(g,t,w/2-stencilWidth(t,1)/2,yb-26,1,'#b8b296');}},
 // The projector on its AV cart: a two-shelf steel cart on casters, a laptop on the lower shelf, and the projector on top with its lens
 // toward the screen, so you see its back: vents, the leads and a green running light.
 projector(g,o){const {r,e,l}=g,w=o.w,h=o.h,z=o.z,F=['#1d1f23','#2a2d32','#3b3f45','#525760'];e(w/2,h,w/2+2,2.5,SHADOW);
  for(const x of [.5,w-2])for(const d of [1,h-1]){r(x-.25,d-z+6,1.5,z-6,EDGE);r(x,d-z+6,1,z-6,F[2]);e(x+.5,d,1.2,.8,BLK);}
  bx(g,0,1,w,h-2,9,10,F[1],F[0],F[2]);r(3,1-11.5,10,h-6,EDGE);r(3.5,1-11,9,h-7,'#2a2c30');r(4,1-10.5,8,h-9,'#4a6a8a');
  bx(g,0,1,w,h-2,z-7,z-6,F[2],F[1],F[3]);const t=bx(g,3,3,w-6,h-6,z-6,z,'#3a3d42','#26282c','#5a5e64');
  for(let x=5;x<w-5;x+=1.5)r(x,t+1,.5,3,'#141518');r(w-6,t+1,1,1,'#5aff8a');l(w/2,t+5,w/2+2,h-z+8,.75,BLK);l(w/2+2,h-z+8,w/2+1,h,.75,BLK);},
 // The armory: a chain-link cage against the wall. Inside, a rack of rifles standing upright and shelves of ammo cans; the front is
 // mesh on steel posts with a service window in the middle (a steel counter at 30) and the ARMORY plate over it. o.taken leaves that
 // many gaps in the rack.
 armory(g,o){const {r,l,e,p}=g,w=o.w,h=o.h,z=o.z,s=(o.x|0)+3,cx=w/2,win=[cx-22,cx+22];r(-1.5,h-1,w+3,3,SHADOW);
  r(0,-z,w,h+z,'#191b1f');r(0,-z,w,h,'#202328');for(let x=0;x<w;x+=6)r(x,-z,.5,h,'#2a2d32');
  // The rack: a frame along the back with rifles in it, and shelves of olive ammo cans at each end.
  const rd=6,rx0=34,rx1=w-34;r(rx0-2,rd-46,rx1-rx0+4,2,EDGE);r(rx0-2,rd-45.5,rx1-rx0+4,1,ST[3]);r(rx0-2,rd-12,rx1-rx0+4,2,EDGE);r(rx0-2,rd-11.5,rx1-rx0+4,1,ST[3]);
  let n=0;for(let x=rx0+1;x<rx1-3;x+=5.5,n++){if(n<(o.taken|0))continue;const v=hash(n,s)>.7;
   r(x-.5,rd-44.5,3,39,EDGE);r(x,rd-14,2,8,v?'#3a2c20':BLK);r(x,rd-26,2.5,12,'#26282c');r(x+.5,rd-26,.5,12,'#3e4248');r(x+2,rd-22,1.5,5,'#1a1b1d');r(x,rd-30,2,4,'#2e3136');r(x+.75,rd-44,.75,14,'#1a1b1d');r(x,rd-29,2,.5,'#4a4e54');}
  for(const sx of [2,w-30]){for(const sy of [16,30,44]){r(sx-.5,rd-sy-.5,29,2,EDGE);r(sx,rd-sy,28,1,ST[3]);}
   for(const sy of [16,30,44])for(let k=0;k<3;k++){const ax=sx+1+k*9,ay=rd-sy-7;r(ax-.5,ay-.5,8,7.5,EDGE);r(ax,ay,7,7,OD[3]);r(ax,ay,7,1.5,OD[4]);r(ax+2,ay-1,3,1,OD[1]);r(ax+1,ay+3,5,1,'#c8c098');}}
  // The counter in the window, and the front: posts, rails, the mesh with the window cut out of it, and the plate over the window.
  bx(g,win[0],h-10,win[1]-win[0],10,0,30,ST[3],ST[2],ST[5]);r(win[0]+4,h-30-6,8,5,'#e8e4d8');r(win[0]+5,h-30-5,6,.5,'#8a867a');r(win[0]+26,h-30-7,10,6,OD[3]);r(win[0]+26,h-30-7,10,1,OD[4]);
  const top=h-z,inWin=(x,y)=>x>win[0]&&x<win[1]&&y>h-58&&y<h-30;
  for(let y=top+2;y<h-1;y+=2)for(let x=((y-top)/2|0)%2;x<w;x+=2)if(!inWin(x,y))r(x,y,.5,.5,'#8e939b88');
  for(const x of [0,win[0]-2,win[1],w-2]){r(x-.5,top-.5,3,z+.5,EDGE);r(x,top,2,z,ST[3]);r(x,top,.5,z,ST[5]);}
  for(const y of [top,h-58-2,h-2]){r(-.5,y-.5,w+1,3,EDGE);r(0,y,w,2,ST[3]);r(0,y,w,.5,ST[5]);}r(win[0],h-30,win[1]-win[0],1,ST[5]);
  r(-.5,-z-.5,w+1,h+1,EDGE);for(let y=-z+1;y<top-1;y+=2)for(let x=(y/2|0)%2;x<w;x+=3)r(x,y,.5,.5,'#8e939b55');r(0,-z,w,.5,ST[5]);
  const pw=stencilWidth('ARMORY',1.5)+8;r(cx-pw/2-.5,top+6.5,pw+1,12,EDGE);r(cx-pw/2,top+7,pw,11,OD[2]);r(cx-pw/2,top+7,pw,.5,OD[4]);stencil(g,'ARMORY',cx-pw/2+4,top+9,1.5,'#d8d0b0');},
 // A bank of steel lockers in olive drab: each door with vents top and bottom, a handle, a name tape and its number. o.open swings that
 // locker's door out to the right and shows what is inside: a jacket on a hanger, a helmet on the shelf, boots, a photo taped up.
 lockers(g,o){const {r,l,e,p}=g,w=o.w,h=o.h,z=o.z,n=Math.max(1,Math.round(w/14)),lw=w/n,yf=h-z,s=(o.x|0)+(o.y|0);r(-1.5,h-1,w+3,3,SHADOW);
  r(-.5,-z-.5,w+1,h+z+1,EDGE);r(0,-z,w,h,OD[2]);r(0,-z,w,.5,OD[4]);r(0,yf,w,z,OD[1]);r(0,h-4,w,4,BLK);
  for(let i=0;i<n;i++){const x=i*lw,x1=x+lw;if(o.open===i){r(x+.5,yf+.5,lw-1,z-5,'#0d0f10');r(x+1,yf+8,lw-2,.75,OD[3]);p([[x+lw/2-2.5,yf+11],[x+lw/2+2.5,yf+11],[x+lw/2+2,yf+3],[x+lw/2-2,yf+3]],OD[3]);e(x+lw/2,yf+5,3,2.5,OD[4]);
    l(x+lw/2,yf+10,x+lw/2,yf+12,.5,'#8a8e94');p([[x+2,yf+13],[x+lw-2,yf+13],[x+lw-1.5,yf+34],[x+1.5,yf+34]],OD[3]);r(x+lw/2-.25,yf+13,.5,21,OD[1]);r(x+3,yf+16,2,1.5,'#d8d0b0');r(x+lw-6,yf+18,3.5,4,'#e8e4d8');r(x+lw-5.5,yf+18.5,2.5,2.5,'#6a8aa8');
    r(x+2,h-11,4,5,BLK);r(x+lw-6,h-11,4,5,BLK);r(x1-.5,yf-2,3,z-2,EDGE);r(x1,yf-1.5,2,z-3,OD[3]);r(x1,yf-1.5,.5,z-3,OD[5]);continue;}
   r(x+.5,yf+.5,lw-1,z-5,OD[3]);r(x+.5,yf+.5,lw-1,.5,OD[5]);r(x1-1,yf+.5,.5,z-5,OD[1]);for(const vy of [yf+3,h-12])for(let k=0;k<3;k++)r(x+3,vy+k*1.5,lw-6,.5,OD[0]);
   r(x+2.5,yf+10,lw-5,2.5,'#cfc9b4');for(let k=0;k<3;k++)r(x+3+hash(i+k,s)*(lw-8),yf+10.75,1+hash(k,i+s)*2,.75,'#3a3a34');r(x1-3.5,yf+24,1,5,'#8a8e94');r(x1-3.5,yf+24,1,.5,'#c4c8cc');
   const t=String((o.from|0)+i+1);stencil(g,t,x+lw/2-stencilWidth(t,.5)/2,yf+6,.5,'#c8c2a8');}},
 // The unit's banner on the wall: a navy pennant on a gold rod with finials, a gold border, the crest, LEET AF under it in gold, and a
 // swallowtail end. len is how far it hangs.
 crestbanner(g,o){const {r,p,e}=g,w=o.w,h=o.h,z=o.z,y0=h-z,len=o.len||60,b=y0+1.5,e2=b+len;
  p([[0,b],[w,b],[w,e2],[w/2,e2-7],[0,e2]],EDGE);p([[.5,b],[w-.5,b],[w-.5,e2-1],[w/2,e2-7.5],[.5,e2-1]],NV[2]);
  p([[2,b+2],[w-2,b+2],[w-2,e2-3.5],[w/2,e2-9.5],[2,e2-3.5]],GD[2]);p([[3,b+3],[w-3,b+3],[w-3,e2-4.5],[w/2,e2-10.5],[3,e2-4.5]],NV[2]);
  for(let x=5;x<w-4;x+=6)r(x,b+3,2,len-12,'#ffffff07');r(w-6,b+3,3,len-12,'#00000022');crest(g,w/2,b+7,w*.55);mid(g,'LEET',w/2,b+9+w*.55,.5,GD[3]);mid(g,'AF',w/2,b+13.5+w*.55,.5,GD[3]);
  r(-3,y0-.5,w+6,2,EDGE);r(-2.5,y0,w+5,1,GD[2]);r(-2.5,y0,w+5,.5,GD[4]);e(-3.5,y0+.5,1.5,1.5,GD[3]);e(w+3.5,y0+.5,1.5,1.5,GD[3]);},
 // An armored personnel carrier, side on like the cars: eight big wheels under an angled olive hull with darker blotches, vision
 // blocks, a side door, jerry cans and a tow hook, a remote weapon station and two antennas on the roof, the crest and o.mark (its call
 // sign) stencilled on. The rear is on the left: o.open drops the ramp onto the ground. w is the length, h the depth, z the roof.
 apc(g,o){const {r,p,e,l}=g,L=o.w,D=o.h,Z=o.z,H0=9,Hh=Math.round(Z*.6),Hc=Math.round(Z*.78),xr=Math.round(L*.7),xn=Math.round(L*.86),s=(o.x|0)+(o.y|0)*5;
  e(L/2,D-1,L/2+8,7,SHADOW);r(6,D-H0-1,L-14,H0+1,'#0a0b0d');
  if(o.open){p([[-1,1-H0],[-1,D-1-H0],[-27,D-1],[-27,1]],EDGE);p([[-.5,1.5-H0],[-.5,D-1.5-H0],[-26,D-1.5],[-26,1.5]],OD[2]);for(let k=0;k<6;k++){const t=k/6;r(-24+t*23,2+(-H0+1)*t,.75,D-4,OD[1]);}
   r(-26,D-2.5,25,1,OD[4]);r(-3,-H0-1,3,D-2,'#3a0c0a');}
  // Lower hull the whole length, then the troop compartment, the driver's cab and the sloped nose.
  bx(g,0,0,xn,D,H0,Hh,OD[3],OD[2],OD[4]);
  p([[xn-.5,-Hh-.5],[L+.5,-H0-9.5],[L+.5,D-H0+.5],[xn-.5,D-H0+.5]],EDGE);p([[xn,-Hh],[L,-H0-9],[L,D-H0-9],[xn,D-Hh]],OD[5]);p([[xn,-Hh],[L,-H0-9],[L,-H0-8.5],[xn,-Hh+.5]],'#76845e');l(xn+.5,D-Hh-.5,xn+.5,-Hh+.5,.5,OD[3]);l(xn+(L-xn)*.55,-Hh+(Hh-H0-9)*.55+1,xn+(L-xn)*.55,D-Hh+(Hh-H0-9)*.55-1,.5,OD[4]);p([[xn,D-Hh],[L,D-H0-9],[L,D-H0],[xn,D-H0]],OD[2]);
  bx(g,0,2,xr,D-4,Hh,Z,OD[4],OD[3],OD[5]);bx(g,xr,3,xn-xr,D-6,Hh,Hc,OD[4],OD[3],OD[5]);p([[xn-1,D-3-Hc],[xn+10,D-3-Hh+2],[xn-1,D-3-Hh+2]],OD[2]);
  for(let i=0;i<14;i++){const bx0=hash(i,s)*(L-30)+4,by=D-Hh+3+hash(s,i)*(Hh-H0-10),bw=6+hash(i,s+1)*14;p([[bx0,by],[bx0+bw,by-1],[bx0+bw-2,by+4],[bx0+2,by+5]],i%2?OD[1]:'#2a2418');}
  for(let i=0;i<10;i++){const bx0=hash(i,s+4)*(xr-20)+4,by=2-Z+hash(s+4,i)*(D-8);e(bx0,by,4+hash(i,2)*6,2+hash(2,i)*2,i%2?OD[3]:'#3a3424');}
  // Vision blocks along the compartment, the side door, the cab window, a headlight and the tow hook.
  for(const x of [L*.14,L*.3,L*.46]){r(x-.5,D-2-Z+5.5,9,4,EDGE);r(x,D-2-Z+6,8,3,'#1a2430');r(x+.5,D-2-Z+6.5,2,1,'#3a5068');}
  const dx=Math.round(L*.56);r(dx-.5,D-2-Z+12,20,Z-Hh-10,EDGE);r(dx,D-2-Z+12.5,19,Z-Hh-11,OD[3]);r(dx,D-2-Z+12.5,19,.5,OD[5]);r(dx+15,D-2-Z+20,2.5,1,'#8a8e94');for(const y of [D-2-Z+15,D-Hh-6])r(dx-1.5,y,2,2,OD[1]);
  r(xr+3,D-3-Hc+4,xn-xr-6,6,EDGE);r(xr+3.5,D-3-Hc+4.5,xn-xr-7,5,'#1a2430');r(xr+4,D-3-Hc+5,4,1,'#3a5068');r(L-2.5,D-H0-14,3,3,EDGE);r(L-2,D-H0-13.5,2,2,'#f0e6c0');r(L-1,D-H0-4,2.5,2.5,'#2a2b2e');
  for(let k=0;k<2;k++){const jx=8+k*9;r(jx-.5,D-Hh+4,8,13,EDGE);r(jx,D-Hh+4.5,7,12,OD[2]);r(jx,D-Hh+4.5,7,.5,OD[4]);l(jx+1,D-Hh+6,jx+6,D-Hh+15,.5,OD[1]);l(jx+6,D-Hh+6,jx+1,D-Hh+15,.5,OD[1]);}
  crest(g,L*.38,D-Hh+4,12);if(o.mark)stencil(g,o.mark,L*.62,D-Hh+6,1.5,'#d8d0b0');stencil(g,'LEET AF',L*.13,D-2-Z+12.5,1,'#c8c2a8');
  // Wheels under an armored skirt.
  for(const x of [L*.12,L*.27,L*.6,L*.75]){e(x,D-8,10,9.5,EDGE);e(x,D-8,9.5,9,'#111214');e(x,D-8,5,4.8,'#34373c');e(x,D-8,2,1.9,'#1c1d20');for(let k=0;k<6;k++){const a=k*Math.PI/3;r(x+Math.cos(a)*3.5-.25,D-8+Math.sin(a)*3.4-.25,.5,.5,'#55595e');}}
  r(2,D-H0-8.5,xn-4,4,EDGE);r(2,D-H0-8,xn-4,3,OD[2]);r(2,D-H0-8,xn-4,.5,OD[4]);
  // On the roof: hatches, the weapon station with its barrel forward, and two antennas whipping back from the rear corners.
  const ry=2-Z;for(const hx of [L*.12,L*.36]){e(hx,ry+D/2-2,5,3.5,EDGE);e(hx,ry+D/2-2,4.5,3,OD[3]);e(hx-1,ry+D/2-3,2,1,OD[5]);}
  const wx=Math.round(L*.52);r(wx-.5,ry+D/2-14.5,15,12,EDGE);r(wx,ry+D/2-14,14,5,OD[4]);r(wx,ry+D/2-9,14,6,OD[2]);r(wx+2,ry+D/2-8,4,2,'#1a2430');l(wx+14,ry+D/2-11,wx+32,ry+D/2-11,1.25,EDGE);l(wx+14,ry+D/2-11,wx+32,ry+D/2-11,.5,'#3a3d42');
  for(const ay of [ry+3,ry+D-8]){l(4,ay,1,ay-34,.75,EDGE);l(4,ay,1,ay-34,.4,'#55595e');r(3,ay-1,2.5,2,EDGE);}},
 // A hard case for biological samples: a moulded shell with ribs, two latches and a handle, the biohazard trefoil on the front. o.cold
 // makes it the white cryo case with a blue band, a misting vent and a green readout; o.marrow adds Marrow's teal stripe and name.
 hazcase(g,o){const {r,e}=g,w=o.w,h=o.h,z=o.z,C=o.cold?[SC[0],SC[1],SC[2],SC[3]]:[HZ[0],HZ[1],HZ[2],HZ[3]],yf=h-z;e(w/2,h,w/2+2,2.5,SHADOW);
  r(-.5,-z-.5,w+1,h+z+1,EDGE);r(0,-z,w,h,C[2]);r(0,-z,w,.5,C[3]);for(let x=4;x<w-2;x+=5)r(x,-z+1,.5,h-2,C[1]);r(w/2-4,-z+h/2-1,8,2,EDGE);r(w/2-3.5,-z+h/2-.5,7,1,'#2a2b2e');
  r(0,yf,w,z,C[1]);r(0,yf,w,.5,C[3]);r(0,yf+3,w,.5,C[0]);for(const x of [3,w-6]){r(x-.5,yf+.5,4,3.5,EDGE);r(x,yf+1,3,2.5,'#55595e');}
  if(o.cold){r(0,yf+5,w,2,o.marrow?TL[2]:'#3a6a9a');r(w-8,yf+8,5,3,EDGE);r(w-7.5,yf+8.5,4,2,'#0d1a10');r(w-7,yf+9,3,.75,'#5aff8a');for(let k=0;k<3;k++)e(4+k*2,yf+9-k*1.5,1.5+k*.5,1,'#e8f0f840');}
  if(o.marrow){if(!o.cold)r(0,yf+5,w,1.5,TL[2]);const lw=typeW('MARROW',.5)+3;r(w/2-lw/2-.5,-z+h-6.5,lw+1,5.5,C[0]);r(w/2-lw/2,-z+h-6,lw,4.5,SC[4]);mid(g,'MARROW',w/2,-z+h-5.5,.5,TL[1]);}
  trefoil(g,w/2,yf+(z-3)/2+3,Math.min(4,z*.28),o.cold?RED[2]:BLK,C[1]);},
 // The briefing board: a rolling whiteboard with the operation's name, the eight pairs and where each goes, and Hollow 6 ringed in red.
 briefboard(g,o){const {r,e,l}=g,w=o.w,h=o.h,z=o.z,B='#2e4a8a',RD='#b33a2a',bh=38;e(w/2,h,w/2+3,3,SHADOW);
  for(const x of [5,w-5]){l(x,h,x,-z+bh,1.5,EDGE);l(x,h,x,-z+bh,.7,ST[4]);for(const d of [-4,4])l(x,h-1,x+d,h,1,EDGE);}
  r(-.5,-z-.5,w+1,bh+1,EDGE);r(.5,-z+.5,w-1,bh-1,'#d8d6ce');r(.5,-z+.5,w-1,.5,'#f2f0e8');r(.5,-z+bh-2,w-1,1.5,'#8a8f94');
  type(g,'BELL JAR',3,-z+2.5,.5,B);r(3,-z+7,typeW('BELL JAR',.5),.5,B);
  for(let k=0;k<8;k++){const col=k<4?3:w/2+1,y=-z+10+(k%4)*6;type(g,String(k+1),col,y,.5,k===5?RD:B);r(col+4,y+1.5,6+hash(k,5)*(w/2-16),.5,B);}
  e(w/2+2.5,-z+17.5,4.5,3.5,RD);e(w/2+2.5,-z+17.5,3.75,2.75,'#d8d6ce');type(g,'6',w/2+1,-z+16,.5,RD);r(w-12,-z+bh-5,6,1.5,RD);r(w-5,-z+bh-5,2,1.5,B);},
 // The coffee table by the door: a folding table with a steel urn and its tap, a sleeve of paper cups, a box of doughnuts left open and
 // a sugar caddy.
 urntable(g,o){const {r,e,l,p}=g,w=o.w,h=o.h,z=o.z;e(w/2,h,w/2+3,3,SHADOW);for(const x of [2,w-3])l(x,h-1,x+.5,h-z,1,EDGE);
  const t=bx(g,0,0,w,h,z-1.5,z,'#c9c4b6','#7a766c','#e4e0d4');
  const ux=6,uy=t-4;r(ux-.5,uy-17.5,11,18.5,EDGE);r(ux,uy-17,10,18,'#8e939b');r(ux,uy-17,2,18,'#c4c8cc');r(ux+7,uy-17,3,18,'#5a5f66');r(ux-.5,uy-19,11,2.5,EDGE);r(ux,uy-18.5,10,1.5,BLK);r(ux+4,uy-4,2,3,BLK);r(ux+3.5,uy-1,3,1,'#2a1a10');
  for(let k=0;k<3;k++){r(20+k*.5,t-9+k*2.5,4,3,'#f0ece2');r(20+k*.5,t-9+k*2.5,4,.5,'#b8b2a4');}r(19.5,t-9.5,5,.5,EDGE);
  p([[27,t-5],[w-4,t-5],[w-3,t-1],[26,t-1]],'#d87a96');p([[27.5,t-4.5],[w-4.5,t-4.5],[w-3.5,t-1.5],[26.5,t-1.5]],'#f2e4d0');for(const [dx,dy,c] of [[30,-3.5,'#8a5a32'],[34.5,-3,'#e88aa8'],[39,-3.5,'#8a5a32'],[43,-3,'#f0e0b0']]){e(dx,t+dy,2,1.2,c);e(dx,t+dy,.6,.4,'#f2e4d0');}
  r(w-9,t-11,4,4,EDGE);r(w-8.5,t-10.5,3,3,'#8a2a22');r(w-8.5,t-10.5,3,.5,'#e8e4d8');},
 // The armored truck from above with its roof cut away, for the ride in. The footprint is the whole hull: the ramp at the west end,
 // the troop bay with a bench down each side, the partition, the cab (the driver's seat on the north side, the commander's on the
 // south), the dash and the vision blocks across the front, and the sloped nose. The north wall stands full height behind it all, with
 // the grab rail, the red dome light, the seat backs and their harnesses, and what is stowed on it; every other wall is cut low so you
 // can see in, its armor shown in section. o.cab is the cab's length and o.mark the truck's number, stencilled on the outside. The
 // driver's seat back is its own prop (cabseat), drawn over whoever is driving. apcSeats(o) says where everyone sits.
 apcbay(g,o){const {r,p,e,l}=g,L=o.w,H=o.h,Z=o.z,{T,C,FW,xf,xp,n,SW}=apcFrame(o),s=(o.x|0)+(o.y|0)*3,yn=T-Z;
  e(L/2,H+1,L/2+6,5,SHADOW);
  // The north wall: its top in section (the olive skin, the steel, the inside paint) and its inside face, ribbed and seamed.
  r(-.5,-Z-.5,xf+T+1,Z+T+1,EDGE);r(0,-Z,xf+T,T,OD[3]);r(0,-Z,xf+T,.5,OD[5]);r(0,-Z+T-2,xf+T,1,ST[2]);r(0,-Z+T-1,xf+T,1,IN[4]);
  for(let x=4;x<xf+T;x+=12)r(x,-Z+2,1,1,OD[1]);
  r(T,yn,xf-T,Z,IN[2]);r(T,yn,xf-T,1,IN[0]);for(let x=T+20;x<xf;x+=26){r(x,yn,1.5,Z,IN[1]);r(x+1.5,yn,.5,Z,IN[4]);for(let y=yn+4;y<T-4;y+=9)r(x+.5,y,.5,.5,IN[5]);}
  r(T,yn+12,xf-T,.5,IN[1]);r(T,yn+12.5,xf-T,.5,IN[3]);r(T,T-8,xf-T,1.5,'#1c201c');r(T,T-6.5,xf-T,.5,IN[3]);
  for(let i=0;i<9;i++){const x=T+hash(i,s)*(xf-T-10),y=yn+14+hash(s,i)*(Z-26);r(x,y,2+hash(i,s+1)*6,.5,i%2?IN[1]:IN[3]);}
  // The partition's end of the wall is the cab: a vision block, the radio stack with its handset on a coiled cord.
  const cx0=xp+4,vb=xf-24;r(vb-.5,yn+9.5,13,9,EDGE);r(vb,yn+10,12,8,'#1a2430');r(vb+1,yn+11,4,1,'#3a5068');r(vb+1,yn+12,2,1,'#2c3e52');r(vb-1,yn+18,14,1,IN[1]);
  r(cx0+5.5,yn+15.5,16,20,EDGE);r(cx0+6,yn+16,15,19,'#24272b');for(let k=0;k<3;k++){r(cx0+7,yn+18+k*5.5,13,4,'#1a1c1f');r(cx0+8,yn+19+k*5.5,2,1,k===1?'#e8a03a':'#5aff8a');r(cx0+11,yn+19+k*5.5,7,.5,'#3a3d42');r(cx0+17,yn+20+k*5.5,2,1.5,'#55595e');}
  for(let k=0;k<8;k++)e(cx0+12+Math.sin(k*1.3)*2,yn+37+k*1.6,1.6,.9,'#141518');r(cx0+9.5,yn+49.5,6,5,EDGE);r(cx0+10,yn+50,5,4,'#2a2d32');
  // Over the bay: the grab rail on its brackets, the dome light (lit red), a pack hung at each end, the first aid kit and an
  // extinguisher by the partition.
  r(T+3,yn+6.5,xp-T-6,2,EDGE);r(T+3,yn+7,xp-T-6,1,ST[4]);r(T+3,yn+7,xp-T-6,.5,ST[5]);for(let x=T+8;x<xp-4;x+=40){r(x-.5,yn+4,2,5,EDGE);r(x,yn+4.5,1,4,ST[3]);}
  const dl=Math.round((T+xp)/2);r(dl-6.5,yn+.5,13,5,EDGE);r(dl-6,yn+1,12,4,'#2a2b2e');e(dl,yn+3,4.5,1.6,RED[1]);e(dl,yn+2.8,3.5,1.1,RED[3]);r(dl-2,yn+2.5,2,.5,'#ffc8b8');
  for(const px of [T+6,xp-34]){l(px+8,yn+8,px+8,yn+12,.75,EDGE);r(px+.5,yn+11.5,15,19,EDGE);r(px+1,yn+12,14,18,OD[3]);r(px+1,yn+12,14,.5,OD[5]);r(px+1,yn+12,14,6,OD[4]);r(px+1,yn+18,14,.5,OD[1]);r(px+6,yn+17,4,2,'#8a8e94');
   r(px+3,yn+21,1,9,OD[1]);r(px+12,yn+21,1,9,OD[1]);r(px+5,yn+23,6,5,OD[2]);r(px+5,yn+23,6,.5,OD[4]);}
  const fa=T+46;r(fa-.5,yn+13.5,15,11,EDGE);r(fa,yn+14,14,10,SC[2]);r(fa,yn+14,14,.5,SC[4]);r(fa,yn+21.5,14,2.5,SC[1]);r(fa+5.5,yn+15.5,3,7,RED[2]);r(fa+3.5,yn+17.5,7,3,RED[2]);
  const fx=xp-12;r(fx-3,yn+16,8,2,EDGE);r(fx-.5,yn+16.5,6,23,EDGE);r(fx,yn+18,5,21,RED[2]);r(fx,yn+18,1.5,21,RED[3]);r(fx+3.5,yn+18,1.5,21,RED[1]);r(fx,yn+17,5,1.5,'#2a2b2e');l(fx+5,yn+18,fx+7,yn+30,.75,'#141518');r(fx,yn+33,5,1,'#e8e4d8');
  // The seat backs on the wall, a harness hanging over each from the rail.
  for(let i=0;i<n;i++){const x0=T+3+i*SW+1,w=SW-2;r(x0-.5,T-31.5,w+1,22,EDGE);r(x0,T-31,w,21,OD[2]);r(x0,T-31,w,.5,OD[4]);r(x0+w/2-.25,T-30,.5,19,OD[1]);r(x0,T-11,w,1,OD[1]);
   for(const k of [6,w-7]){l(x0+k,yn+9,x0+k+(k<w/2?2:-2),T-14,1.25,'#141518');l(x0+k,yn+9,x0+k+(k<w/2?2:-2),T-14,.5,'#3a3424');}r(x0+w/2-2,T-15,4,3,EDGE);r(x0+w/2-1.5,T-14.5,3,2,'#8a8e94');}
  // The floor: tread plate, its seams, and the tie-down rings either side of the aisle.
  r(T,T,xf-T,H-2*T,FL[2]);for(let y=T+1.5,row=0;y<H-T-1;y+=3,row++)for(let x=T+1.5+(row%2)*3;x<xf-2;x+=6){r(x,y,2,.5,FL[3]);r(x+.5,y+.5,1.5,.5,FL[1]);}
  for(const x of [T+52,T+104,T+156,xp+36])r(x,T,.5,H-2*T,FL[0]);for(let i=0;i<14;i++){const x=T+hash(i,s+7)*(xf-T-12),y=T+14+hash(s+7,i)*(H-2*T-28);e(x,y,3+hash(i,2)*5,1+hash(2,i)*1.5,'#00000020');}
  for(let x=T+18;x<xp-8;x+=36)for(const y of [T+16,H-T-16]){e(x,y,2,1.2,EDGE);e(x,y-.3,1.3,.6,ST[4]);}
  // The benches: a folding seat for each place, its cushion and the steel frame under the front edge. The north one faces you; of
  // the south one you see the cushions and the top of the back, above the cut wall.
  for(let i=0;i<n;i++){const x0=T+3+i*SW,w=SW-1;bx(g,x0,T,w,13,0,11,OD[3],'#141518',OD[4]);r(x0+1,T-10,w-2,.5,OD[5]);r(x0+w/2-.25,T-10,.5,11,OD[2]);r(x0,T+2,w,1.5,ST[3]);r(x0,T+2,w,.5,ST[4]);for(const k of [1,w-2.5])r(x0+k,T+3.5,1.5,9.5,ST[2]);
   r(x0+3,T+3.5,4,5,'#14161a');r(x0+w-7,T+3.5,4,5,'#14161a');r(x0+4,T+7.5,2,2,'#8a8e94');
   const ys=H-T-13;r(x0-.5,ys-11.5,w+1,16,EDGE);r(x0,ys-11,w,13,OD[3]);r(x0,ys-11,w,.5,OD[5]);r(x0+w/2-.25,ys-10,.5,11,OD[2]);r(x0,ys+2,w,2,OD[1]);r(x0,ys+2,w,.5,OD[2]);}
  // The cab: the commander's seat (empty, a headset on it), the console between, the dash with the driver's screens, and the wheel.
  const S=apcSeats(o),cm=S.commander,dv=S.driver;bx(g,cm.x-8,cm.y-7,16,14,0,10,OD[3],'#141518',OD[4]);bx(g,cm.x-12,cm.y-7,4,14,10,30,OD[2],OD[1],OD[4]);bx(g,cm.x-12,cm.y-4,4,8,30,35,OD[1],OD[1],OD[3]);
  e(cm.x+1,cm.y-11,4,2.5,'#141518');e(cm.x+1,cm.y-11,2.6,1.5,OD[3]);e(cm.x+5,cm.y-9,1.6,1.6,'#2a2b2e');
  bx(g,dv.x-8,dv.y-7,16,14,0,10,OD[3],'#141518',OD[4]);
  bx(g,xp+24,H/2-7,18,14,0,9,'#2a2d32','#1c1e22','#3b3f45');r(xp+28,H/2-15,3,6,EDGE);e(xp+29.5,H/2-15,2,1.5,'#3b3f45');r(xp+34,H/2-14,6,4,'#1a1c1f');r(xp+35,H/2-13,1,1,'#e8a03a');
  const dy=bx(g,xf-FW,T,FW,H-2*T,0,18,'#26292d','#1c1e22','#3b3f45');r(xf-FW+1,T-17,FW-2,16,'#1c1e22');
  r(xf-FW+1.5,dv.y-18,FW-3,11,EDGE);r(xf-FW+2,dv.y-17.5,FW-4,10,'#10261a');for(let k=0;k<4;k++)r(xf-FW+3,dv.y-16+k*2.2,FW-7-k,.5,k===2?'#8affb0':'#3acf6a');
  r(xf-FW+1.5,H/2-24,FW-3,8,EDGE);r(xf-FW+2,H/2-23.5,FW-4,7,'#1a1c1f');for(let k=0;k<4;k++)r(xf-FW+3+k*2,H/2-22,1,1,k%2?'#e8a03a':'#5aff8a');
  r(xf-FW+1.5,cm.y-20,FW-3,9,EDGE);r(xf-FW+2,cm.y-19.5,FW-4,8,'#101a28');r(xf-FW+3,cm.y-18,FW-7,.5,'#4a8acf');r(xf-FW+3,cm.y-15,FW-9,.5,'#4a8acf');
  l(xf-FW,dv.y-14,xf-FW-3,dv.y-17,2,EDGE);e(xf-FW-4,dv.y-18,3.2,6.8,EDGE);e(xf-FW-4,dv.y-18,2.4,6,'#2a2b2e');e(xf-FW-4,dv.y-18,1.2,4.4,EDGE);e(xf-FW-4,dv.y-18,.6,1.2,'#3b3f45');r(xf-FW-6,dv.y-24,1,1.5,'#55595e');
  // The partition, cut low with its doorway, and the ramp and the front wall in section; the vision blocks set in the front wall.
  for(const [y,d] of [[T,20],[H-T-20,20]])bx(g,xp,y,4,d,0,22,IN[3],IN[2],IN[4]);
  bx(g,0,T,T,H-2*T,0,C,OD[3],OD[2],OD[4]);r(T-1.5,T-C,1.5,H-2*T,IN[4]);for(let y=T+6;y<H-T-6;y+=14){r(1.5,y-C,2,2,OD[1]);r(2,y-C+.5,1,1,OD[5]);}
  r(T,T+20,3,H-2*T-40,'#00000030');
  bx(g,xf,T,T,H-2*T,0,14,OD[3],OD[2],OD[4]);for(const y of [T+3,H/2-8,H-T-19]){r(xf+.5,y-14,T-1,13,EDGE);r(xf+1,y-13.5,T-2,12,'#1a2430');r(xf+1.5,y-13,1,4,'#3a5068');}
  // The nose, sloping down to the headlights.
  p([[xf+T-.5,T-14.5],[L+.5,T-6.5],[L+.5,H-T+.5],[xf+T-.5,H-T+.5]],EDGE);p([[xf+T,T-14],[L,T-6],[L,H-T-6],[xf+T,H-T-14]],OD[4]);p([[xf+T,T-14],[L,T-6],[L,T-5.5],[xf+T,T-13.5]],OD[5]);
  p([[xf+T,H-T-14],[L,H-T-6],[L,H-T],[xf+T,H-T]],OD[2]);for(const y of [T,H-T-8]){r(L-3,y-4,3,3.5,EDGE);r(L-2.5,y-3.5,2,2.5,'#f0e6c0');}
  // The south wall, cut to the height of the benches' backs: its top in section, and outside, the truck's number and the unit.
  bx(g,0,H-T,xf+T,T,0,C,OD[3],OD[2],OD[4]);r(0,H-T-C,xf+T,1,IN[4]);r(0,H-T-C+2,xf+T,1,ST[2]);for(let x=4;x<xf+T;x+=12)r(x,H-C-2,1,1,OD[1]);
  r(0,H-1,xf+T,1,OD[1]);for(let i=0;i<8;i++){const x=hash(i,s+3)*(xf-10)+4;e(x,H-C+3+hash(s+3,i)*4,3+hash(i,4)*5,1.2,i%2?OD[1]:'#2a2418');}
  if(o.mark)stencil(g,o.mark,T+20,H-C+1.5,1,'#d8d0b0');stencil(g,'LEET AF',T+44,H-C+1.5,1,'#c8c2a8');},
 // The driver's seat back and its headrest, drawn over whoever is in the seat: seen from the south it is a narrow upright slab.
 cabseat(g,o){const {r}=g,w=o.w,h=o.h,z=o.z;bx(g,0,0,w,h,10,z,OD[2],OD[1],OD[4]);bx(g,0,3,w,h-6,z,z+6,OD[1],OD[1],OD[3]);r(w-1,-z+1,1,h-2,OD[3]);},
 // The containment beacon, standing: a tripod, its mast with the battery box and radio, and the strobe on top (o.on lights it red).
 beacon(g,o){const {r,e,l}=g,w=o.w,h=o.h,z=o.z,cx=w/2,hub=h/2-14,top=h/2-z+4;e(cx,h-1,w/2+2,2.5,SHADOW);
  for(const [fx,fy] of [[1,h-1.5],[w-1,h-1.5],[cx,1.5]]){l(cx,hub,fx,fy,1.75,EDGE);l(cx,hub,fx,fy,.75,ST[4]);r(fx-1,fy-.5,2,1,EDGE);}
  r(cx-1.25,top+4,2.5,hub-top-4,EDGE);r(cx-.75,top+4,1.5,hub-top-4,ST[4]);r(cx-.75,top+4,.5,hub-top-4,ST[5]);
  r(cx-5.5,hub-13.5,11,10,EDGE);r(cx-5,hub-13,10,9,OD[3]);r(cx-5,hub-13,10,.5,OD[5]);r(cx-4,hub-11,8,3,HZ[2]);r(cx-4,hub-8,8,.5,BLK);r(cx+3,hub-6.5,1.5,1.5,o.on?'#5aff8a':'#2a4a30');
  l(cx+2,top+6,cx+6,top-8,.5,EDGE);r(cx+5.5,top-8.5,1,1,EDGE);
  e(cx,top+3,4.5,4,EDGE);e(cx,top+3,3.8,3.4,o.on?RED[3]:RED[1]);e(cx-1,top+2,1.3,1,o.on?'#ffd8c8':RED[2]);r(cx-4,top+5,8,2,EDGE);r(cx-3.5,top+5.5,7,1,ST[3]);},
 // The beacon packed in its hard case: shut, with the stencil and the latches, or (o.open) the lid up and the parts in their foam,
 // the strobe head, the mast in two lengths, the folded tripod and the battery box.
 beaconcase(g,o){const {r,e,l}=g,w=o.w,h=o.h,z=o.z,yf=h-z;e(w/2,h,w/2+2,2.5,SHADOW);
  if(o.open){const lh=h*.6;r(-.5,-z-lh-.5,w+1,lh+1,EDGE);r(0,-z-lh,w,lh,OD[2]);r(1.5,-z-lh+1.5,w-3,lh-3,'#2a2b2e');r(0,-z-lh,w,.5,OD[4]);for(let x=4;x<w-3;x+=6)r(x,-z-lh+2,3,lh-4,'#323438');}
  r(-.5,-z-.5,w+1,h+z+1,EDGE);r(0,yf,w,z,OD[2]);r(0,yf,w,.5,OD[4]);for(const x of [4,w-8]){r(x-.5,yf+1.5,5,3.5,EDGE);r(x,yf+2,4,2.5,'#8a8e94');}
  if(!o.open){r(0,-z,w,h,OD[3]);r(0,-z,w,.5,OD[5]);for(let x=3;x<w-1;x+=5)r(x,-z+1,.5,h-2,OD[2]);r(w/2-5,-z+h/2-1.5,10,3,EDGE);r(w/2-4.5,-z+h/2-1,9,2,'#2a2b2e');stencil(g,'BEACON',w/2-stencilWidth('BEACON',.5)/2,yf+4.5,.5,'#d8d0b0');return;}
  r(0,-z,w,h,OD[3]);r(1.5,-z+1.5,w-3,h-3,'#2a2b2e');for(let i=0;i<10;i++)r(2+hash(i,5)*(w-5),-z+2+hash(5,i)*(h-5),1,.5,'#34363a');
  e(6,-z+h/2,3.6,3.2,EDGE);e(6,-z+h/2,3,2.6,RED[1]);e(5.2,-z+h/2-.8,1,.8,RED[2]);
  for(const y of [-z+3,-z+6])r(11,y,w-14,1.5,ST[4]);r(11,-z+h-6,9,4,OD[3]);r(11,-z+h-6,9,.5,OD[5]);r(12,-z+h-5,7,1.5,HZ[2]);
  for(let k=0;k<3;k++)l(22+k*1.5,-z+h-3,26+k*1.5,-z+h-10,.75,ST[3]);stencil(g,'BEACON',w/2-stencilWidth('BEACON',.5)/2,yf+4.5,.5,'#d8d0b0');},
 // Steel ammo cans in olive drab, o.n of them side by side: the lid with its carry handle and latch, AMMO stencilled on the
 // front. o.open throws the lids back on rows of brass.
 ammocan(g,o){const {r,e,l}=g,w=o.w,h=o.h,z=o.z,n=o.n||1,cw=w/n;e(w/2,h,w/2+2,2.5,SHADOW);
  for(let i=0;i<n;i++){const x=i*cw+.5,W=cw-1;if(o.open){r(x-.5,-z-h*.7-.5,W+1,h*.7+1,EDGE);r(x,-z-h*.7,W,h*.7,OD[2]);r(x,-z-h*.7,W,.5,OD[4]);}
   const yf=bx(g,x,0,W,h,0,z,OD[3],OD[2],OD[4]);r(x,yf,W,1,OD[4]);r(x,yf+1,W,.5,OD[1]);r(x+W-2.5,yf+1.5,1.5,3,EDGE);r(x+W-2,yf+2,.5,2,'#8a8e94');
   if(o.open){r(x+1,-z+1,W-2,h-2,'#2a2418');for(let yy=-z+1.5;yy<h-z-1.5;yy+=1.5)for(let xx=x+1.5;xx<x+W-1.5;xx+=1.5){r(xx,yy,1,1,'#b8923a');r(xx,yy,.5,.5,'#f0d888');}}
   else{l(x+W*.28,-z+h/2,x+W*.72,-z+h/2,1.25,EDGE);l(x+W*.28,-z+h/2,x+W*.72,-z+h/2,.5,'#55595e');}
   stencil(g,'AMMO',x+W/2-stencilWidth('AMMO',.5)/2,yf+(z-1)/2-.5,.5,HZ[3]);}},
 // Gadget's drone, a quadcopter seen from above and a little to the south: the grey body with its camera slung under the nose, four
 // arms out to the motors and each rotor a pale blur (o.f turns the blades between frames), red and green running lights at the
 // front and a white one behind. o.can hangs an ammo can under it on two straps. It is drawn at the top of its box; the game lifts it.
 drone(g,o){const {r,e,l}=g,w=o.w,h=o.h,z=o.z,cx=w/2,cy=-z+5,f=o.f|0,can=!!o.can;
  if(can){const cw=7,ch=2.5,cz=4.5,x=cx-cw/2,y=cy+12;for(const dx of [-2,2])l(cx+dx*.6,cy+1,cx+dx,y-cz+.5,.5,'#5a5e64');const yf=bx(g,x,y,cw,ch,0,cz,OD[3],OD[2],OD[4]);
   r(x,yf,cw,.75,OD[4]);r(x+1.5,y-cz+ch/2-.25,cw-3,.5,EDGE);r(x+cw-1.5,yf+1.25,1,1.75,EDGE);r(x+1,yf+2,2.5,.5,HZ[3]);}
  for(const [sx,sy] of [[-1,-1],[1,-1],[-1,1],[1,1]]){const mx=cx+sx*8,my=cy+sy*4;l(cx+sx*2,cy+sy*1.2,mx,my,1.5,EDGE);l(cx+sx*2,cy+sy*1.2,mx,my,.5,ST[3]);}
  for(const [sx,sy] of [[-1,-1],[1,-1],[-1,1],[1,1]]){const mx=cx+sx*8,my=cy+sy*4;e(mx,my-1,5,2.5,'rgba(200,206,214,.16)');e(mx,my-1,3.4,1.7,'rgba(220,226,232,.14)');
   const a=(f+(sx*sy>0?0:1))%2?.5:-.5,c=Math.cos(a)*4.6,s=Math.sin(a)*2.3;l(mx-c,my-1-s,mx+c,my-1+s,.75,'rgba(236,240,244,.5)');e(mx,my-.75,.9,.7,EDGE);r(mx-.25,my-1.25,.5,.5,ST[5]);}
  e(cx,cy+2.5,1.6,1.3,EDGE);e(cx,cy+2.5,1,.8,'#2a2b2e');r(cx-.25,cy+2.25,.5,.5,'#8ab4d8');
  r(cx-3.5,cy-2.5,7,5,EDGE);r(cx-3,cy-2,6,4,ST[2]);r(cx-3,cy-2,6,1.5,ST[3]);r(cx-3,cy-2,6,.5,ST[5]);r(cx-1,cy-.5,2,1,ST[1]);
  r(cx-3.5,cy+1.5,1,1,RED[3]);r(cx+2.5,cy+1.5,1,1,'#5aff8a');r(cx-.5,cy-3,1,1,'#f6f5f0');},
 // The Marrow courier that went off Route 9: a white box van on its roof. Its underside faces the sky (the frame rails, the axles, the
 // driveshaft, the exhaust and the tank), its wheels in the air, its near side upside down with the teal stripe and MARROW read the
 // wrong way up, the cab crushed down onto its roof and the glass all over the road. The crash tore the side of the hold open: through
 // it, the samples' cold cases where they fell, venting cold. o.open swings the rear door ajar; o.taken empties the hold.
 wreck(g,o){const {r,p,e,l}=g,L=o.w,D=o.h,Z=o.z,Hb=Math.min(44,Z-14),xb=Math.round(L*.72),xc=xb+2,s=(o.x|0)+(o.y|0)*7,yt=D-Hb,GL='#1a2430',RU='#4a3a2c',TY='#0c0d10';
  e(L/2,D-1,L/2+6,6,SHADOW);e(L-22,D+4,16,4.5,'#0a0b0d88');e(L-30,D+6,7,2,'#0a0b0d66');
  // The near rear door, hanging open off its hinge at the back corner of the box.
  if(o.open){p([[.5,yt-1],[.5,D-.5],[-11.5,D-6],[-11.5,yt-12]],EDGE);p([[0,yt-.5],[0,D-1],[-11,D-6.5],[-11,yt-11]],SC[1]);p([[-1.5,yt+3],[-1.5,D-4],[-9.5,D-8],[-9.5,yt-6]],SC[2]);l(-2,yt+20,-9,yt+12,.5,SC[0]);r(-11,yt-11,.5,Hb+5,SC[3]);}
  // The underside, now the top: grimy steel, the frame rails, cross members, both axles, the driveshaft, the tank and the exhaust.
  r(-.5,-Hb-.5,L+1,D+1,EDGE);r(0,-Hb,L,D,'#1c1f23');for(let i=0;i<40;i++)r(hash(i,s)*(L-4)+1,-Hb+hash(s,i)*(D-2)+.5,1+hash(i,s+3)*3,.5,i%3?'#24282d':'#2c2620');
  for(const d of [14,44]){r(1,d-Hb-1.5,L-2,3,EDGE);r(1,d-Hb-1,L-2,2,'#2c3036');r(1,d-Hb-1,L-2,.5,'#40464e');}for(let x=12;x<L-10;x+=22)r(x,14-Hb,2,30,'#262a2f');
  const ra=Math.round(L*.24),fa=Math.round(L*.86);for(const x of [ra,fa]){r(x-2.5,-Hb+1,5,D-2,EDGE);r(x-2,-Hb+1,4,D-2,'#30353b');r(x-2,-Hb+1,4,.5,'#454b53');e(x,29-Hb,5.5,4.5,EDGE);e(x,29-Hb,5,4,'#383d44');e(x-1,28-Hb,2,1.4,'#4c535b');}
  l(ra+5,29-Hb,fa-8,29-Hb,2.5,EDGE);l(ra+5,29-Hb,fa-8,29-Hb,1.5,'#3a3f46');r(xb-38,20-Hb,26,13,EDGE);r(xb-37.5,20.5-Hb,25,12,'#2a2e34');r(xb-37.5,20.5-Hb,25,.5,'#3c424a');
  r(fa-24,6-Hb,26,16,'#16181b');r(fa-22,8-Hb,10,6,'#22262b');l(L-10,49-Hb,8,49-Hb,1.75,EDGE);l(L-10,49-Hb,8,49-Hb,1,RU);r(xb-70,46-Hb,24,6,EDGE);r(xb-69.5,46.5-Hb,23,5,RU);r(xb-69.5,46.5-Hb,23,.5,'#6a5640');
  // The far wheels, up in the air at the back of it.
  const wheel=(x,y,big)=>{const R=big?9:8.5;e(x,y,R+.5,R,EDGE);e(x,y,R,R-.5,TY);e(x,y,R-2.5,R-3,'#17181b');e(x,y,4.6,4.4,'#55585e');e(x,y,2,1.9,'#2a2b2e');for(let k=0;k<5;k++){const a=k*Math.PI*2/5+.4;r(x+Math.cos(a)*3.2-.25,y+Math.sin(a)*3.1-.25,.5,.5,'#8a8e94');}r(x-R+1.5,y-2,.5,4,'#26282c');};
  for(const x of [ra,fa])wheel(x,-Hb-8,x===ra);
  // The box's near side, upside down: white panels with their seams, the floor rail along the top, the teal stripe and the name.
  r(-.5,yt-.5,xb+1,Hb+1,EDGE);r(0,yt,xb,Hb,SC[2]);r(0,yt,xb,3,ST[2]);r(0,yt,xb,.5,ST[4]);r(0,yt+3,xb,.5,ST[0]);r(0,D-2.5,xb,2.5,SC[0]);
  for(let x=16;x<xb-2;x+=19)r(x,yt+3,.5,Hb-5.5,SC[1]);for(let i=0;i<18;i++)r(hash(i,s+9)*(xb-6)+2,yt+4+hash(s+9,i)*(Hb-8),2+hash(i,s+2)*5,.5,i%2?SC[1]:'#9a968c');
  r(0,yt+9,xb,3,TL[2]);r(0,yt+9,xb,.5,TL[3]);r(0,yt+12,xb,.5,TL[0]);
  const N='MARROW',T='NOBODY HAS TO STAY DEAD',nx=xb*.66;type180(g,N,nx-typeW(N,1.5)/2,yt+21,1.5,TL[1]);type180(g,T,nx-typeW(T,.5)/2,yt+15.5,.5,TL[1]);
  // Where the side tore open: the dark hold, its shelving down, and the cold cases on what was the ceiling, misting.
  const gx=7,gw=Math.round(xb*.33);p([[gx,yt+6],[gx+9,yt+4],[gx+16,yt+8],[gx+27,yt+5],[gx+gw,yt+9],[gx+gw-3,yt+20],[gx+gw+2,yt+30],[gx+gw-4,D-5],[gx+12,D-4],[gx+2,D-7],[gx-2,yt+24]],SC[3]);
  p([[gx+1.5,yt+7.5],[gx+9,yt+6],[gx+16,yt+10],[gx+26,yt+7],[gx+gw-1.5,yt+10.5],[gx+gw-4.5,yt+20],[gx+gw,yt+30],[gx+gw-5.5,D-6.5],[gx+12,D-5.5],[gx+3,D-8.5],[gx,yt+24]],'#0b0d10');
  r(gx+2,D-9,gw-6,1,'#22252a');l(gx+4,yt+12,gx+gw-8,yt+26,.75,'#3a3f46');l(gx+10,yt+9,gx+16,D-10,.75,'#2c3036');r(gx+gw-10,yt+14,6,.75,'#2c3036');
  if(!o.taken)for(const [cx,cw,tl] of [[gx+5,12,0],[gx+19,10,1]]){const cy=D-9-7;r(cx-.5,cy-.5-tl,cw+1,8,EDGE);r(cx,cy-tl,cw,7,SC[3]);r(cx,cy-tl,cw,.5,SC[4]);r(cx,cy+3-tl,cw,1.5,TL[2]);r(cx+cw-4,cy+5-tl,2.5,1,'#5aff8a');r(cx+1.5,cy+1-tl,.5,5,SC[1]);}
  else{r(gx+6,D-11,9,2,SC[1]);r(gx+6,D-11,9,.5,SC[3]);r(gx+17,D-12,1,3,'#2c3036');}
  if(!o.taken)for(let k=0;k<3;k++)e(gx+10+k*5,yt+5-k*3,2+k*.9,1+k*.45,k?'#eef6fa30':'#eef6fa60');
  for(const [x0,y0,x1,y1] of [[gx+9,yt+4,gx+12,yt+1],[gx+gw,yt+9,gx+gw+4,yt+7],[gx+gw+2,yt+30,gx+gw+6,yt+32],[gx+2,D-7,gx-2,D-4]]){l(x0,y0,x1,y1,1.25,EDGE);l(x0,y0,x1,y1,.6,SC[4]);}
  // The cab, crushed down onto its roof: the door, the window flattened near the ground and burst, the nose upside down at the
  // east end (bumper up top, headlights under it), the mirror hanging.
  const cy0=yt,cab=[[xc,cy0],[L,cy0],[L,cy0+15],[L-7,cy0+20],[L-12,D-6],[L-16,D-1],[xc+30,D-.5],[xc+22,D-2.5],[xc+10,D-.5],[xc,D]];
  p(cab.map(([x,y])=>[x+(x>xc?.5:-.5),y+(y>cy0?.5:-.5)]),EDGE);p(cab,SC[2]);r(xc,cy0,L-xc,3,ST[2]);r(xc,cy0,L-xc,.5,ST[4]);r(xc,cy0+9,L-xc-1,2,TL[2]);
  p([[xc+3,D-15],[L-19,D-14],[L-15,D-5],[xc+28,D-3.5],[xc+20,D-5],[xc+4,D-4]],EDGE);p([[xc+3.5,D-14.5],[L-19.5,D-13.5],[L-16,D-5.5],[xc+28,D-4.5],[xc+20,D-5.5],[xc+4,D-4.5]],GL);
  for(const [x0,y0,x1,y1] of [[xc+10,D-12,xc+16,D-6],[xc+16,D-12,xc+9,D-7],[xc+22,D-13,xc+30,D-6],[L-24,D-12,L-20,D-6]])l(x0,y0,x1,y1,.5,'#5a7088');
  r(xc+2,cy0+4,.5,D-cy0-20,SC[0]);r(xc+12,cy0+5,4,1,'#8a8e94');r(xc+20,cy0+13,7,5,TL[2]);r(xc+20.5,cy0+13.5,6,4,TL[1]);r(xc+22,cy0+14.5,3,2,SC[4]);
  r(L-2.5,cy0+3,3,5,'#2a2b2e');r(L-2,cy0+3.5,2,4,'#3a3d42');r(L-6,cy0+9.5,4,3,EDGE);r(L-5.5,cy0+10,3,2,'#e8e2c4');l(L-7,cy0+17,L-12,D-6,.75,'#9a968c');
  l(xc+30,D-14,xc+34,D-6,1,EDGE);r(xc+32,D-7,4,3,EDGE);r(xc+32.5,D-6.5,3,2,GL);
  // Arches in the near side and the near wheels in the air over them.
  for(const x of [ra,fa]){e(x,yt+1,11,4.5,'#0a0b0d');wheel(x,yt-7,x===ra);}r(ra-2,yt-7,4,1,'#2a2b2e');
  // Glass and bits of the van all over the road in front of it.
  for(let i=0;i<46;i++){const x=hash(i,s+31)*(L+16)-8,y=D+1+hash(s+31,i)*11,big=i%9===0;r(x,y,big?1.5:.5,.5,i%4?'#a8bccb':'#d8e6ee');}
  for(let i=0;i<5;i++){const x=hash(i,s+41)*(L-30)+10,y=D+3+hash(s+41,i)*8;r(x-.5,y-.5,4,2.5,EDGE);r(x,y,3,1.5,i%2?SC[2]:'#6a5a40');}}};
// The library's samples: real sizes from the hangar in Deadlight Hollow.
export const BASE_SAMPLES=[
 {set:'base',kind:'hangarwall',name:'Hangar wall',group:'Hangar',samples:[{kind:'hangarwall',x:0,y:0,w:300,h:10,z:100,sign:'HANGAR 3',signX:20}]},
 {set:'base',kind:'hangarwallV',name:'Hangar wall, side on',group:'Hangar',samples:[{kind:'hangarwallV',x:0,y:0,w:10,h:200,z:100}]},
 {set:'base',kind:'column',name:'Door column',group:'Hangar',samples:[{kind:'column',x:0,y:0,w:12,h:10,z:110}]},
 {set:'base',kind:'screen',name:'Projector screen',group:'Briefing',samples:[0,1,2,3,4,5].map(slide=>({kind:'screen',x:0,y:0,w:160,h:6,z:96,drop:66,slide}))},
 {set:'base',kind:'podium',name:'Podium',group:'Briefing',samples:[{kind:'podium',x:0,y:0,w:26,h:14,z:36}]},
 {set:'base',kind:'stage',name:'Stage',group:'Briefing',samples:[{kind:'stage',x:0,y:0,w:200,h:50,z:6}]},
 {set:'base',kind:'foldchair',name:'Folding chair',group:'Briefing',samples:[{kind:'foldchair',x:0,y:0,w:14,h:12,z:28,n:6}]},
 {set:'base',kind:'projector',name:'Projector cart',group:'Briefing',samples:[{kind:'projector',x:0,y:0,w:22,h:16,z:30}]},
 {set:'base',kind:'briefboard',name:'Briefing board',group:'Briefing',samples:[{kind:'briefboard',x:0,y:0,w:60,h:10,z:62}]},
 {set:'base',kind:'crestbanner',name:'Unit banner',group:'Briefing',samples:[{kind:'crestbanner',x:0,y:0,w:30,h:6,z:92,len:60}]},
 {set:'base',kind:'armory',name:'Armory cage',group:'Armory',samples:[{kind:'armory',x:0,y:0,w:150,h:40,z:74},{kind:'armory',x:0,y:0,w:150,h:40,z:74,taken:3}]},
 {set:'base',kind:'lockers',name:'Lockers',group:'Armory',samples:[{kind:'lockers',x:0,y:0,w:112,h:14,z:64},{kind:'lockers',x:0,y:0,w:112,h:14,z:64,open:2}]},
 {set:'base',kind:'hazcase',name:'Sample case',group:'Armory',samples:[{kind:'hazcase',x:0,y:0,w:26,h:16,z:16},{kind:'hazcase',x:0,y:0,w:26,h:16,z:16,cold:true,marrow:true}]},
 {set:'base',kind:'urntable',name:'Coffee table',group:'Armory',samples:[{kind:'urntable',x:0,y:0,w:52,h:18,z:26}]},
 {set:'base',kind:'apc',name:'Armored personnel carrier',group:'Vehicles',samples:[{kind:'apc',x:0,y:0,w:230,h:66,z:72,mark:'H6'},{kind:'apc',x:0,y:0,w:230,h:66,z:72,mark:'H6',open:true}]},
 {set:'base',kind:'apcbay',name:'Armored truck, inside',group:'Vehicles',samples:[{kind:'apcbay',x:0,y:0,w:300,h:76,z:60,cab:66,mark:'H6'}]},
 {set:'base',kind:'cabseat',name:'Driver\'s seat back',group:'Vehicles',samples:[{kind:'cabseat',x:0,y:0,w:4,h:14,z:30}]},
 {set:'base',kind:'beaconcase',name:'Beacon case',group:'Operation',samples:[{kind:'beaconcase',x:0,y:0,w:34,h:18,z:12},{kind:'beaconcase',x:0,y:0,w:34,h:18,z:12,open:true}]},
 {set:'base',kind:'beacon',name:'Containment beacon',group:'Operation',samples:[{kind:'beacon',x:0,y:0,w:16,h:12,z:46},{kind:'beacon',x:0,y:0,w:16,h:12,z:46,on:true}]},
 {set:'base',kind:'ammocan',name:'Ammo cans',group:'Operation',samples:[{kind:'ammocan',x:0,y:0,w:30,h:10,z:11,n:2},{kind:'ammocan',x:0,y:0,w:30,h:10,z:11,n:2,open:true}]},
 {set:'base',kind:'wreck',name:'Courier wreck',group:'Operation',samples:[{kind:'wreck',x:0,y:0,w:180,h:58,z:62,open:true},{kind:'wreck',x:0,y:0,w:180,h:58,z:62,open:true,taken:true}]},
 {set:'base',kind:'drone',name:'Drone',group:'Operation',samples:[{kind:'drone',x:0,y:0,w:24,h:12,z:20},{kind:'drone',x:0,y:0,w:24,h:12,z:20,f:1,can:true}]}];
export function propArt(c,o){if(!BASE_ART[o.kind])return townPropArt(c,o);c.save();c.scale(2,2);c.translate(PROP_PAD,o.z+PROP_PAD);BASE_ART[o.kind](painter(c),o);c.restore();}
