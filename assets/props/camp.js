// Camp props: everything a survivors' camp is built from, in the camp painter's style. Each prop draws with its footprint's
// top left corner at (0, 0) and its height rising into negative y; propArt adds the padding, the scale and the grime at its foot.
// A prop is described by {kind, w, h, z, x, y}: footprint width and depth, height, and a position that seeds its variation.
// Moved from Deadlight Hollow (camp/art.js) unchanged, so every prop paints exactly as it does there.
import {painter,snap,hash2 as hash,rgb} from '../core/paint.js';
export const EDGE='#191b21',SHADOW='#100e0c66',EMBER='#dd6f2c',EMBER_HI='#ff9a52',BONE='#e8e0d1';
const W=['#2b2320','#4a3a2e','#6b5440','#8d7255','#a88a66'],CV=['#3a362e','#5f584a','#857c69','#a39a84','#bdb39b'],M=['#23262c','#3e434b','#5c636b','#838a8f'],R=['#1d1f27','#2b2e38','#3a3e4b','#4b5060','#5f6575'];
// Bedding colors per sleeping spot, dark to light. Spot 0 is yours.
export const BED_COLORS=[['#5e3a26','#7d5236','#9a6a48','#71492f'],['#2d3d52','#3f5670','#56708c','#384d66'],['#34402c','#4b5b3e','#62744f','#435237'],['#4a3550','#664a6c','#80628a','#5c4262']];
const RUST='#7a4a30',GLASS='#e8b45a',GLASS_HI='#ffe4a0',TEAL='#2f6f69',TEAL_HI='#4b9a91';
const MOSS_HEX=['#34422c','#435437','#566a40'];
// Props. Each draws with the footprint's top left corner at (0, 0); height rises into negative y.
function box(g,w,h,z,top,front,edge=EDGE){const {r}=g;r(-.5,-z-.5,w+1,h+z+1,edge);r(.5,-z+.5,w-1,h-1,top);r(.5,h-z+.5,w-1,z-1,front);r(.5,h-z,w-1,.5,'#ffffff22');}
const ART={
 fire(g,o){const {e,r,p,l}=g,cx=28,cy=14,stones=[];for(let i=0;i<14;i++){const a=i/14*Math.PI*2;stones.push([cx+Math.cos(a)*24,cy+Math.sin(a)*10,i]);}
  const stone=([x,y,i])=>{e(x,y+.5,4.5,3.3,EDGE);e(x,y,3.6,2.5,i%3?R[3]:R[4]);r(x-2,y-1.5,2.5,.5,'#808796');};
  stones.filter(s=>s[1]<cy).forEach(stone);e(cx,cy,20,8,'#2e2a27');e(cx,cy+1,13,5,'#5a2416');
  for(let i=0;i<16;i++)r(cx-11+hash(i,1)*22,cy-3+hash(i,2)*7,1,.5,i%3?'#c94f1f':'#f28a2e');
  l(cx-15,cy+4,cx+13,cy-5,4.5,EDGE);l(cx-14,cy+3.5,cx+12,cy-5,3,W[1]);l(cx-14,cy-4,cx+15,cy+4,4.5,EDGE);l(cx-13,cy-4,cx+14,cy+3.5,3,W[2]);r(cx-14,cy-5,3,2,'#1e1a18');r(cx+12,cy+3,3,2,'#1e1a18');
  stones.filter(s=>s[1]>=cy).forEach(stone);},
 logH(g,o){const {e,r,p}=g,w=o.w,s=o.x;e(w/2,10,w/2+4,6,SHADOW);p([[3,-10],[w-3,-10],[w,-6],[w,5],[w-3,8],[3,8],[0,5],[0,-6]],EDGE);r(2,-9,w-4,6,W[3]);r(2,-3,w-4,8,W[2]);r(2,5,w-4,2,W[1]);
  for(let i=0;i<w/8;i++){const x=6+hash(i,s)*(w-16);r(x,-7+hash(i,s+1)*10,6+hash(i,s+2)*10,.5,W[1]);}r(10,-8,w*.3,.5,W[4]);r(w*.6,-8,w*.22,.5,W[4]);e(w*.3,0,2.5,1.5,W[1]);r(1,-7,1.5,12,W[4]);r(w-2,-7,1,12,W[4]);},
 board(g,o){const {e,r,p}=g;e(50,10,54,5,SHADOW);
  for(const x of [6,88]){r(x,-71,6,81,EDGE);r(x+1,-70,4,79,W[2]);r(x+1,-70,1.5,79,W[3]);r(x+1,6,4,2,W[1]);}
  r(0,-68,100,46,EDGE);r(1,-67,98,44,W[2]);r(1,-67,98,1,W[3]);r(4,-63,92,37,'#7d6044');
  for(let i=0;i<70;i++)r(5+hash(i,14)*90,-62+hash(i,15)*35,1,.5,i%2?'#6a5039':'#93744f');
  const notes=[[9,-60,16,20,'#cfc6b0'],[30,-58,14,17,'#b8ae95'],[50,-61,18,14,'#d6cdb8'],[73,-57,15,19,'#c3b9a1'],[48,-44,12,13,'#a9a089']];
  notes.forEach(([x,y,w,h,col],k)=>{r(x+1,y+1,w,h,'#3d2f22');r(x,y,w,h,col);for(let j=0;j<Math.floor(h/3)-1;j++)r(x+2,y+3+j*3,w-4-((j+k)%2)*3,.5,'#6c6556');r(x+w/2-.5,y+.5,1.5,1.5,k===2?EMBER:'#a33b2e');});
  r(52,-49,10,.5,EMBER);
  p([[-5,-75],[105,-75],[101,-68],[-1,-68]],EDGE);p([[-4,-74],[104,-74],[100.5,-69],[-.5,-69]],W[3]);r(-3,-74,106,1,W[4]);
  // A lantern hangs from the corner: the board's namesake.
  r(-2.5,-68,.5,6,M[1]);r(-6,-62,7,9,EDGE);r(-5,-61,5,7,GLASS);r(-4,-60,2,5,GLASS_HI);r(-6.5,-63,8,1.5,M[1]);r(-6,-53.5,7,1,M[1]);},
 cart(g,o){const {e,r,p,l}=g;e(70,42,76,9,SHADOW);
  l(-16,14,10,14,2.5,EDGE);l(-15,14,10,14,1.5,W[2]);l(-16,28,10,28,2.5,EDGE);l(-15,28,10,28,1.5,W[2]);
  r(4,-26,132,50,EDGE);r(5,-25,130,34,W[3]);for(let i=1;i<6;i++)r(5,-25+i*6,130,.5,W[2]);r(5,-25,130,1,W[4]);r(5,9,130,14,W[2]);r(5,9,130,1,W[1]);for(let x=30;x<135;x+=26)r(x,9,.5,14,W[1]);r(5,15,130,1.5,M[1]);
  for(const x of [22,118]){e(x,22,14,14,EDGE);e(x,22,12.5,12.5,W[1]);e(x,22,10,10,EDGE);for(let k=0;k<6;k++){const a=k/6*Math.PI;l(x+Math.cos(a)*10,22+Math.sin(a)*10,x-Math.cos(a)*10,22-Math.sin(a)*10,1.5,W[2]);}e(x,22,3,3,M[1]);r(x-1,21,1,1,M[3]);r(x-11,14,3,.5,W[3]);}
  // Workbench clutter: vise, sheet metal, a hammer, a wrench and a coil of wire.
  r(14,-28,20,14,EDGE);r(15,-27,18,12,M[1]);r(15,-27,18,2,M[2]);r(20,-31,8,4,EDGE);r(21,-30,6,3,M[2]);r(33,-23,6,2,M[3]);
  p([[46,-22],[78,-24],[80,-8],[48,-6]],EDGE);p([[47,-21],[77,-23],[79,-9],[49,-7]],M[2]);r(55,-19,6,4,RUST);r(68,-14,5,3,RUST);r(50,-20,20,.5,M[3]);
  l(88,-10,106,-18,2,EDGE);l(88,-10,105,-17.5,1,W[4]);r(104,-21,5,6,EDGE);r(104.5,-20.5,4,5,M[2]);
  l(90,-2,110,0,2,EDGE);l(90,-2,110,0,1,M[3]);e(111,0,2.5,2,M[3]);e(111,0,1,1,W[3]);
  e(124,-14,7,4.5,'#5a4128');e(124,-14,4,2.5,W[3]);e(124,-14,2,1,'#5a4128');},
 scrap(g,o){const {e,r,p,l}=g;e(26,22,28,7,SHADOW);e(14,10,12,7,EDGE);e(14,9,10.5,5.8,'#2a2b2f');e(14,9,5,2.6,'#16171a');r(6,5,8,.5,'#4a4c52');
  p([[16,20],[22,-12],[34,-18],[46,-6],[52,20]],EDGE);p([[18,19],[23,-10],[33,-16],[44,-5],[50,19]],M[1]);
  p([[20,8],[38,-8],[46,4],[30,16]],M[2]);r(30,0,5,3,RUST);r(24,10,4,2,RUST);p([[34,-15],[42,-12],[40,-4],[33,-6]],M[3]);
  l(26,-8,50,-2,3,EDGE);l(26,-8,50,-2,1.8,M[3]);r(48,-4,2,3,M[0]);r(22,14,10,.5,M[3]);r(40,12,8,.5,RUST);},
 tent(g,o){const {e,r,p,l}=g,w=o.w,h=o.h,z=o.z,D=h*.75,m=w/2;e(m+4,h-2,m+6,h/3,SHADOW);
  p([[2,h+1],[2,h-D],[m,h-z-D-2],[w-2,h-D],[w-2,h+1]],EDGE);
  p([[3.5,h],[3.5,h-D+.5],[m,h-z-D],[m,h-z]],CV[1]);p([[w-3.5,h],[w-3.5,h-D+.5],[m,h-z-D],[m,h-z]],CV[3]);
  p([[3.5,h],[w-3.5,h],[m,h-z]],EDGE);p([[5,h-.5],[w-5,h-.5],[m,h-z+2]],CV[2]);
  for(let i=1;i<4;i++){const t=i/4;l(3.5+(m-3.5)*t,h-(z)*t,3.5+(m-3.5)*t,h-z*t-D,.5,CV[0]);l(w-3.5-(w-3.5-m)*t,h-z*t,w-3.5-(w-3.5-m)*t,h-z*t-D,.5,CV[2]);}
  l(m,h-z,m,h-z-D,1,CV[4]);
  p([[m+8,h-z*.55-D*.4],[m+20,h-z*.4-D*.45],[m+20,h-z*.4-D*.15],[m+8,h-z*.55-D*.1]],'#6f6a55');r(m+10,h-z*.48-D*.28,8,.5,CV[1]);
  p([[m-11,h],[m+11,h],[m,h-z*.62]],'#14120f');p([[m-6,h],[m+6,h],[m,h-z*.3]],'#2a241e');r(m-4,h-3,8,3,'#4d3d30');
  p([[m-14,h-.5],[m-11,h],[m-1,h-z*.6],[m-3,h-z*.62]],CV[3]);p([[m+14,h-.5],[m+11,h],[m+1,h-z*.6],[m+3,h-z*.62]],CV[1]);
  l(3.5,h-D+2,-8,h-4,.5,'#5b5446');l(w-3.5,h-D+2,w+8,h-4,.5,'#5b5446');r(-9,h-5,2,3,W[1]);r(w+7,h-5,2,3,W[1]);},
 medtent(g,o){const {e,r,p,l}=g,w=o.w,h=o.h,D=h*.7,m=w/2,wall=44,top=80,C=['#6e6c61','#8b887a','#a7a493','#bdbaa7','#cfccb9'];e(m+4,h-2,m+8,h/3,SHADOW);
  p([[4,h+1],[4,h-wall-D],[m,h-top-D-2],[w-4,h-wall-D],[w-4,h+1]],EDGE);
  p([[5.5,h-wall],[5.5,h-wall-D],[m,h-top-D],[m,h-top]],C[1]);p([[w-5.5,h-wall],[w-5.5,h-wall-D],[m,h-top-D],[m,h-top]],C[3]);
  r(5.5,h-wall-.5,w-11,wall,EDGE);r(6.5,h-wall+.5,w-13,wall-1.5,C[2]);p([[5.5,h-wall],[w-5.5,h-wall],[m,h-top]],EDGE);p([[7,h-wall-.5],[w-7,h-wall-.5],[m,h-top+2]],C[2]);
  l(m,h-top,m,h-top-D,1,C[4]);for(let x=24;x<w-10;x+=24)r(x,h-wall+1,.5,wall-2,C[1]);r(6.5,h-wall+.5,w-13,1,C[4]);
  // A teal plus marks the medic. Teal stays reserved for care across the camp.
  r(22,h-38,9,24,EDGE);r(14.5,h-30.5,24,9,EDGE);r(23,h-37,7,22,TEAL);r(15.5,h-29.5,22,7,TEAL);r(24,h-36,2,20,TEAL_HI);r(16.5,h-28.5,20,1.5,TEAL_HI);
  r(92,h-41,34,41,EDGE);r(93,h-40,32,40,'#1a1916');e(109,h-16,13,10,'#e8b45a33');r(107,h-27,4,6,EDGE);r(107.5,h-26.5,3,5,GLASS_HI);r(96,h-8,26,8,'#2a2622');r(98,h-12,10,6,'#6e5a44');r(110,h-10,9,5,'#8b887a');
  p([[88,h-40],[93,h-40],[93,h],[86,h-6]],C[3]);p([[125,h-40],[130,h-40],[132,h-6],[125,h]],C[1]);
  r(128,h-14,16,14,EDGE);r(129,h-13,14,6,'#8d7255');r(129,h-7,14,6,'#6b5440');r(129,h-10,14,1.5,TEAL);
  l(5.5,h-wall-D+4,-8,h-6,.5,'#6b685c');l(w-5.5,h-wall-D+4,w+8,h-6,.5,'#6b685c');},
 cot(g,o){const {e,r,l}=g;e(36,22,38,5,SHADOW);l(4,0,12,14,1.5,EDGE);l(12,0,4,14,1.5,EDGE);l(60,0,68,14,1.5,EDGE);l(68,0,60,14,1.5,EDGE);
  r(1,-11,70,20,EDGE);r(2,-10,68,18,CV[3]);r(2,4,68,4,CV[2]);r(1,6,70,2,M[1]);r(4,-9,13,11,CV[4]);r(4,-1,13,3,CV[2]);r(19,-10,50,18,'#4d5a6b');r(19,-10,50,3,'#61708a');r(19,4,50,4,'#3d4858');r(40,-7,.5,12,'#3d4858');},
 pot(g,o){const {e,r,l}=g;e(22,22,24,6,SHADOW);l(22,-48,22,8,2,EDGE);l(22,-48,22,8,1,W[1]);
  e(22,18,11,4.5,'#3c2a20');e(22,18,7,3,'#5a2416');for(let i=0;i<6;i++)r(16+hash(i,3)*12,16+hash(i,4)*4,1,.5,'#f28a2e');for(let i=0;i<7;i++){const a=i/7*Math.PI*2;e(22+Math.cos(a)*11,19+Math.sin(a)*4.5,2.4,1.6,R[3]);}
  l(22,-47,22,-24,.5,M[3]);e(22,-11,12.5,10.5,EDGE);e(22,-11.5,11.5,9.5,M[1]);r(13,-14,2,8,M[2]);e(22,-20,12,3.8,EDGE);e(22,-20,11,3,M[2]);e(22,-19.5,9,2,'#8a6a3c');r(18,-20,2,1,'#b58a4e');r(25,-19.5,2,1,'#6b8a4a');
  l(22,-48,2,22,2,EDGE);l(22,-48,2,22,1,W[2]);l(22,-48,42,22,2,EDGE);l(22,-48,42,22,1,W[3]);r(20,-50,4,3,'#5b4030');},
 crate(g,o){const {e,r}=g,w=o.w,h=o.h,z=o.z;e(w/2+3,h,w/2+5,5,SHADOW);box(g,w,h,z,'#3a2c22','#6d5746');r(.5,h-z+.5,w-1,1.5,'#8a7055');for(let x=8;x<w-2;x+=12)r(x,h-z+1,1.5,z-2,'#463a34');
  for(let i=0;i<5;i++){const x=3+i*7,y=-z+3+(i%2)*6;e(x+4,y+2,4.5,2.2,EDGE);e(x+4,y+1.8,3.6,1.5,i%2?'#9aa3a6':'#b9c1c3');r(x+1,y+1.5,1,1,'#2b3134');}r(1,-z+.5,w-2,1,'#b2936c');},
 barrel(g,o){const {e,r}=g;e(15,18,15,5,SHADOW);r(1,-24,26,38,EDGE);e(14,14,13,4,EDGE);r(2,-24,24,38,W[2]);e(14,14,12,3.2,W[2]);r(2,-24,5,38,W[3]);r(21,-24,5,38,W[1]);for(let x=9;x<22;x+=5)r(x,-22,.5,36,W[1]);
  for(const y of [-17,4]){r(1,y,26,2.5,EDGE);r(2,y+.5,24,1.5,M[2]);}e(14,-24,13,4.5,EDGE);e(14,-24,12,3.6,W[3]);e(14,-24,9,2.4,'#2b2320');r(9,-25,6,.5,'#6a7f84');},
 // The shared shelter: a patched tarp pitched from a ridge pole, room for four sleepers underneath.
 shelter(g,o){const {e,r,p,l}=g,w=o.w,h=o.h,T=['#2f3629','#3e4738','#4f5a46','#66725a','#7a8668'],posts=[-2,w/2-2,w-2];
  // (Its shade on the sand is painted with the ground, so it never darkens the beds.)
  // The back wall, seen under the front edge of the roof, with a coat and a pack hung on it.
  r(.5,-26,w-1,27,EDGE);r(1.5,-25,w-3,25,'#2e2c25');for(let x=12;x<w-4;x+=20)r(x,-25,.5,25,'#24231e');r(1.5,-2.5,w-3,2.5,'#201f1a');
  r(40,-24,1,1.5,M[3]);p([[37,-23],[44,-23],[45,-10],[36,-10]],EDGE);p([[38,-22.5],[43,-22.5],[44,-11],[37,-11]],'#5a4a3c');r(40.25,-22,.5,10,'#4a3c30');
  r(128,-24,1,1.5,M[3]);r(124,-22,10,11,EDGE);r(125,-21,8,9,'#5f6844');r(125,-21,8,2.5,'#4b5236');r(127,-16,4,2,'#4b5236');
  for(const x of posts){r(x-.5,-21,5,h+22,EDGE);r(x+.5,-20,3,h+20,W[2]);r(x+.5,-20,1,h+20,W[3]);r(x,h-1,4,2,W[1]);}
  // The tarp sags between the posts along its front edge; tension folds run up to the ridge.
  const sag=x=>{const k=x<w/2?(x+11)/(w/2+11):(x-w/2)/(w/2+11);return -18+Math.sin(Math.max(0,Math.min(1,k))*Math.PI)*3.5;},front=[];for(let x=w+11;x>=-11;x-=4)front.push([x,sag(x)]);front.push([-11,sag(-11)]);
  p([[-8,-55],[w+8,-55],...front],EDGE);p([[-7,-54],[w+7,-54],...front.map(([x,y])=>[x+(x>w/2?-1:1),y-1])],T[2]);
  p([[-7,-54],[w+7,-54],[w+7.6,-47],[-7.6,-47]],T[1]);p(front.map(([x,y])=>[x*.997,y-1]).concat([[-10,-26],[w+10,-26]].reverse()),T[3]);
  for(let x=-10;x<w+10;x+=2)r(x,sag(x)-2.5,2,1.2,T[4]);
  for(const x of posts){const px=x+2;l(px,-20,px-14,-50,.6,T[1]);l(px,-20,px+14,-50,.6,T[1]);l(px+1,-21,px+5,-40,.5,T[4]);}
  for(const [x,y,pw,ph,col] of [[24,-46,14,9,'#5d6950'],[104,-40,13,10,'#6b5f48'],[146,-50,11,7,'#5d6950']]){r(x-.5,y-.5,pw+1,ph+1,T[0]);r(x,y,pw,ph,col);r(x,y,pw,1,'#ffffff14');for(let s=1;s<pw;s+=2){r(x+s,y-.5,.5,.5,'#a39a84');r(x+s,y+ph,.5,.5,'#a39a84');}}
  r(-11,-58,w+22,4,EDGE);r(-10,-57,w+20,2,W[2]);r(-10,-57,w+20,.5,W[3]);e(-11,-56,2.2,2.2,EDGE);e(-11,-56,1.5,1.5,W[4]);e(w+11,-56,2.2,2.2,EDGE);e(w+11,-56,1.5,1.5,W[4]);
  // Guy ropes to stakes out front.
  l(-10,-18,-13,h+10,.5,'#7a735f');l(w+10,-18,w+13,h+10,.5,'#7a735f');r(-14,h+8,2,3,W[1]);r(w+12,h+8,2,3,W[1]);
  // A lantern hangs from the front corner.
  r(w-3.5,-17,.5,5,M[1]);r(w-7,-12.5,7,1.5,M[1]);r(w-6.5,-11,6,9,EDGE);r(w-5.5,-10,4,7,GLASS);r(w-4.5,-9,2,5,GLASS_HI);r(w-6.5,-2.5,6,1,M[1]);},
 // A sleeping pad, a plump pillow and a patchwork quilt with its corner turned back. The colors are the sleeper's; an ember band marks yours.
 bed(g,o){const {e,r,p,l}=g,w=o.w,h=o.h,[c0,c1,c2,c3]=BED_COLORS[o.slot||0],round=(x,y,a,b,k)=>[[x+k,y],[x+a-k,y],[x+a,y+k],[x+a,y+b-k],[x+a-k,y+b],[x+k,y+b],[x,y+b-k],[x,y+k]];
  e(w/2+1.5,h,w/2+3,3.5,SHADOW);p(round(-.5,-.5,w+1,h+1,2.5),EDGE);p(round(.5,.5,w-1,h-1,2),'#75664e');r(2,1,w-4,.5,'#8f7f63');
  // Pillow: soft corners, a lit top, a dent where a head goes.
  p(round(3,2,w-6,11,3),'#57503f');p(round(3.5,2.5,w-7,10,2.5),'#b3aa94');p(round(4,2.5,w-8,7,2.5),'#cfc6b0');e(w/2-3,5,4,1.6,'#e0d8c4');e(w/2+1,8,4,1.8,'#b3aa94');r(5,11.5,w-10,.5,'#8f8774');
  // Quilt: drapes a little past the pad, patchwork squares with stitching.
  const top=15,qb=h-1;p(round(-1.5,top-.5,w+3,qb-top+1,2.5),EDGE);p(round(-1,top,w+2,qb-top,2),c1);
  for(let row=0;row<5;row++)for(let col=0;col<3;col++){const pw=(w+2)/3,ph=(qb-top-6)/5,x=-1+col*pw,y=top+5+row*ph;if((row+col)%2)r(x,y,pw,ph,c3);r(x,y,pw,.5,c0);r(x,y,.5,ph,c0);}
  r(-1,top+3,1.5,qb-top-5,c2);r(w-.5,top+3,1.5,qb-top-5,c0);
  for(const [x0,y0,x1,y1] of [[4,26,7,40],[16,30,19,46],[9,46,12,54]]){l(x0,y0,x1,y1,.6,c2);l(x0+1,y0+.5,x1+1,y1+.5,.5,c0);}
  // The turned-down sheet along the top, and the top corner folded back to show the lining.
  r(-1,top,w+2,5,'#d8d0bc');r(-1,top,w+2,1,'#ece5d4');for(let x=0;x<w;x+=3)r(x,top+4.5,2,.5,'#a89f8a');r(-1,top+5,w+2,.5,c0);
  const fold=(o.slot||0)%2?-1:1,fx=fold>0?w+1:-1,F=x=>fold>0?x:w-x;p([[F(w-7),top+5.5],[fx,top+5.5],[fx,top+13]],EDGE);p([[F(w-5.5),top+6],[fx-fold*.5,top+6],[fx-fold*.5,top+11.5]],'#d8d0bc');l(F(w-5.5),top+6,fx-fold*.5,top+11.5,.5,'#a89f8a');
  if(o.slot===0){r(-7,4,5,6,EDGE);r(-6.5,4.5,4,5,'#8fa6a6');r(-5.5,5.5,2,3,'#e8dcc0');r(-4.75,3.5,.5,2,'#2a2320');r(-8,12,6,4,EDGE);r(-7.5,12.5,5,3,'#6e3b2c');r(-7.5,12.5,5,.5,'#d8d0bc');}
  const band=top+24;if(o.slot===0){r(-1,band,w+2,3,EMBER);r(-1,band,w+2,.5,EMBER_HI);for(let x=1;x<w;x+=4)r(x,band+2,1,.5,'#8a3d1a');}else{r(-1,band,w+2,2,'#cfc6b055');}},
 // A footlocker at the end of each bed: a plank lid with a rounded top, iron straps and corners, a lock. Yours is your stash.
 chest(g,o){const {e,r}=g,w=o.w,h=o.h,z=o.z,mine=o.slot===0,[c0,c1]=BED_COLORS[o.slot||0];e(w/2+2,h+1,w/2+5,4.5,SHADOW);
  r(-.5,-z-1.5,w+1,h+z+2,EDGE);r(.5,-z-.5,w-1,h-.5,'#7a6250');r(.5,-z-.5,w-1,2,'#8f7660');r(.5,-z+h-3,w-1,2,'#5f4c3c');for(const y of [-z+3,-z+6.5])r(.5,y,w-1,.5,'#5a4636');
  r(.5,h-z,w-1,4,'#5d4a38');r(.5,h-z,w-1,.5,'#7a6250');r(.5,h-z+4,w-1,.5,EDGE);r(.5,h-z+4.5,w-1,z-5,'#4e3d30');for(const x of [9,17])r(x,h-z+4.5,.5,z-5,'#3d3027');
  r(.5,h-z+8,w-1,3,mine?EMBER:c1);r(.5,h-z+8,w-1,.5,mine?EMBER_HI:c0);
  for(const x of [3.5,w-5.5]){r(x,-z-.5,2,h+z,'#3b2c22');r(x+.5,-z-.5,.5,h+z,'#5a4434');r(x+.5,h-z+1,1,1,M[3]);}
  for(const [x,y] of [[.5,-z-.5],[w-3.5,-z-.5],[.5,h-3],[w-3.5,h-3],[.5,h-z],[w-3.5,h-z]])r(x,y,3,2.5,M[2]);
  r(w/2-2.5,h-z+2,5,6,EDGE);r(w/2-2,h-z+2.5,4,5,mine?'#c99a4e':'#8a8f94');r(w/2-.25,h-z+4,.5,2,EDGE);r(w/2-1.5,h-z+2.5,3,.5,mine?'#e8c27a':'#b0b5b9');
  r(-1.5,h-z+6,1.5,3,M[1]);r(w,h-z+6,1.5,3,M[1]);},
 gate(g,o){const {e,r,p,l}=g;
  for(const [y,x0,x1,col] of [[-82,-6,112,W[2]],[-70,0,108,W[3]],[-58,-4,104,W[2]],[-46,2,110,W[3]],[-34,-2,106,W[2]],[-22,4,102,W[3]]]){const t=(hash(y,1)-.5)*4;p([[x0,y+t],[x1,y-t],[x1,y+9-t],[x0,y+9+t]],EDGE);p([[x0+1,y+1+t],[x1-1,y+1-t],[x1-1,y+8-t],[x0+1,y+8+t]],col);r(x0+2,y+1.5+t,x1-x0-4,.5,W[4]);r(x0+3,y+4+t,1,1,M[0]);r(x1-5,y+4-t,1,1,M[0]);}
  // A car door wedged into the middle.
  p([[30,-66],[72,-68],[74,-14],[32,-12]],EDGE);p([[31.5,-64.5],[70.5,-66.5],[72.5,-15.5],[33.5,-13.5]],'#4c5c64');p([[35,-62],[68,-63.5],[68,-44],[35,-43]],'#1a262e');l(40,-60,60,-46,.5,'#6c7f88');r(36,-40,34,.5,'#6c7f88');r(60,-36,7,2,M[3]);r(44,-28,6,4,RUST);
  // Sandbags along the foot, and a warning plank.
  for(let i=0;i<7;i++){const x=4+i*15;e(x+7,4,9,6,EDGE);e(x+7,3,8,5,i%2?'#8a7f62':'#7a7057');r(x+2,1,6,.5,'#a39a7a');}
  p([[76,-56],[100,-58],[100,-44],[76,-42]],EDGE);p([[77,-55],[99,-57],[99,-45],[77,-43]],'#c9c0aa');l(80,-53,96,-46,2,'#a33b2e');l(80,-46,96,-53,2,'#a33b2e');
  l(-4,-30,110,-38,1,M[3]);r(50,-38,5,6,EDGE);r(50.5,-37.5,4,5,M[3]);},
 boat(g,o){const {e,r,p,l}=g,cx=26;e(cx+4,98,32,14,SHADOW);
  const hull=(dy,sx)=>[[cx,-12+dy],[cx+14*sx,0+dy],[cx+24*sx,26+dy],[cx+25*sx,70+dy],[cx+20*sx,104+dy],[cx-20*sx,104+dy],[cx-25*sx,70+dy],[cx-24*sx,26+dy],[cx-14*sx,0+dy]];
  p(hull(8,1.04),EDGE);p(hull(7,1),'#3f5f5c');p(hull(0,1.04),EDGE);p(hull(0,1),'#55706a');p(hull(0,.84).map(([x,y])=>[x,y+3]),W[1]);
  for(let y=16;y<100;y+=10)r(cx-19,y,38,.5,W[0]);for(const y of [34,72])r(cx-22,y,44,6,EDGE),r(cx-21,y+.5,42,4.5,W[3]),r(cx-21,y+.5,42,1,W[4]);
  r(cx-6,50,9,7,'#1f1d1c');r(cx+9,86,6,5,'#1f1d1c');for(let y=8;y<100;y+=18)r(cx+22,y,2,4,'#7a6a52');
  l(cx-30,58,cx+18,18,2.5,EDGE);l(cx-30,58,cx+18,18,1.5,W[3]);p([[cx+14,14],[cx+22,10],[cx+26,18],[cx+18,22]],EDGE);p([[cx+15,15],[cx+22,11.5],[cx+24.5,17.5],[cx+18,20.5]],W[3]);},
 rack(g,o){const {e,r,l}=g;e(31,8,34,4,SHADOW);for(const x of [2,56]){r(x,-56,5,64,EDGE);r(x+1,-55,3,62,W[2]);}r(-2,-56,66,3.5,EDGE);r(-1,-55.5,64,2.5,W[3]);
  for(let i=0;i<9;i++){const x=6+i*6;l(x,-53,x+3,-26+Math.sin(i)*3,.5,'#3b4044');l(x+6,-53,x+3,-26+Math.sin(i)*3,.5,'#3b4044');}
  for(let y=-48;y<-28;y+=5)r(6,y,50,.5,'#3b404488');
  // One drying fish per basket fish, up to nine: the camp shows its own food stock.
  for(let i=0;i<Math.min(9,o.fish||0);i++){const x=8.5+i*5.6,y=-49,len=9+hash(i,5)*3,col=i%3===2?'#8a5a43':i%3===1?'#5f8a8a':'#b9a77d';r(x,-53,.5,4,M[3]);
   // Hung by the tail: a forked tail at the top, the body widening, the head at the bottom.
   const {p}=g;p([[x-2,y],[x+.25,y+2],[x+2.5,y],[x+1.5,y+3],[x+2.5,y+6],[x+2,y+len-1],[x+.25,y+len+.5],[x-1.5,y+len-1],[x-2,y+6],[x-1,y+3]],EDGE);
   p([[x-1.5,y+.8],[x+.25,y+2.6],[x+2,y+.8],[x+1,y+3.2],[x+2,y+6],[x+1.5,y+len-1.2],[x+.25,y+len-.2],[x-1,y+len-1.2],[x-1.5,y+6],[x-.5,y+3.2]],col);r(x-1,y+5,1,len-6,'#d8d4c855');r(x-.5,y+len-2.5,1,1,'#14161a');}},
 pier(g,o){const {e,r,p,l}=g,w=o.w,h=o.h,z=o.z,top=-z,deck=h-z;
  for(let x=10;x<w;x+=30){r(x,deck-2,5,z+12,EDGE);r(x+1,deck,3,z+10,W[1]);e(x+2.5,h+10,6,2,'#9fb0ab66');}
  r(-.5,top-.5,w+1,h+1,EDGE);for(let x=0,i=0;x<w;x+=6,i++){const miss=i===19;if(miss){r(x,top,6,deck-top,'#0f2532');continue;}r(x+.5,top+.5,5,deck-top-1,i%3?W[2]:W[3]);r(x+.5,top+.5,5,.5,W[4]);r(x+1.5,top+3,1,1,M[1]);r(x+1.5,deck-4,1,1,M[1]);if(hash(i,3)>.6)r(x+2,top+8+hash(i,4)*14,.5,6,W[1]);}
  r(0,deck,w,z,W[1]);r(0,deck,w,1,W[0]);for(let x=4;x<w;x+=12)r(x,deck+1,.5,z-2,W[0]);
  // Bait bucket, a coil of rope and the pier lantern at the end.
  r(w-30,top+2,10,9,EDGE);r(w-29.5,top+2.5,9,8,M[2]);e(w-25,top+3,4.5,1.6,'#3b3530');r(w-29.5,top+5,9,1,M[1]);
  e(20,top+10,7,4,'#5a4128');e(20,top+10,4,2.2,W[3]);e(20,top+10,1.5,.8,'#5a4128');
  r(w-8,top-58,3.5,60,EDGE);r(w-7.5,top-57,2.5,58,W[2]);r(w-14,top-58,9,2,EDGE);r(w-13.5,top-57.5,8,1,W[2]);r(w-13,top-56,.5,3,M[1]);r(w-16,top-53,6,8,EDGE);r(w-15,top-52,4,6,GLASS);r(w-14.5,top-51,2,4,GLASS_HI);r(w-16.5,top-54,7,1.5,M[1]);},
 // The Training Grounds: a storm-bunker portal poured into the back wall. Steel doors with one leaf ajar and warm light behind it,
 // a bullseye sign, sandbag walls, a gun rack and a shot-up paper target, and a floodlight on the corner.
 // Gadget's generator on a pallet by the steel doors: a yellow cage around a diesel engine, a tank on top and a taped note.
 generator(g,o){const {e,r,p,l}=g,w=o.w,h=o.h,z=o.z,F=h-z,Y=['#5e4a1c','#8f7026','#c9a23a','#e6c766'],D=['#1c1e22','#2a2d32','#3a3e44','#4f545b'];e(w/2+2,h,w/2+7,5,SHADOW);
  r(-1,h-6.5,w+2,6.5,EDGE);r(-.5,h-6,w+1,5.5,W[2]);for(let x=1;x<w-2;x+=7)r(x,h-5,3.5,4.5,W[1]);r(-.5,h-6,w+1,.5,W[4]);
  // The engine and the tank, inside the cage.
  r(1.5,-z+5,w-3,h-1,EDGE);r(2,-z+5.5,w-4,h-2,D[2]);r(2,-z+5.5,w-4,1,D[3]);e(11,-z+11,3,2,EDGE);e(11,-z+10.6,2.4,1.5,'#b33a2a');r(20,-z+9,14,6,D[1]);r(20.5,-z+9.5,13,.5,D[3]);
  r(1.5,F+3,w-3,h-F-9.5,EDGE);r(2,F+3.5,w-4,h-F-10.5,D[1]);for(let x=4;x<26;x+=3)r(x,F+5,1.5,h-F-14,D[2]);r(4,F+5,22,.5,D[3]);
  // Control panel: two dials, a red switch and the outlet strip the cords come out of.
  r(28,F+4.5,13,12,EDGE);r(28.5,F+5,12,11,D[0]);for(const x of [31.5,37])e(x,F+8.5,2.2,2.2,'#d6d0c2');l(31.5,F+8.5,32.5,F+7.2,.5,EDGE);l(37,F+8.5,36,F+7.4,.5,EDGE);r(30,F+12,3,2.5,'#c43a2a');r(35,F+12,4,2.5,'#8a8f94');r(35.5,F+12.5,1,1,EDGE);r(37.5,F+12.5,1,1,EDGE);
  // The yellow cage: corner posts and rails.
  for(const x of [.5,w-3]){r(x-.5,-z+3.5,3.5,h+z-9,EDGE);r(x,-z+4,2.5,h+z-10,Y[2]);r(x,-z+4,.8,h+z-10,Y[3]);}
  for(const y of [-z+3.5,F+1.5,h-8]){r(.5,y,w-1,2.5,EDGE);r(1,y+.4,w-2,1.6,Y[2]);r(1,y+.4,w-2,.5,Y[3]);}
  // Exhaust pipe, black with soot, and Gadget's note.
  r(5,-z-6,3.5,11,EDGE);r(5.5,-z-5.5,2.5,10,D[3]);r(5.5,-z-6,2.5,1.5,'#111214');e(7,-z-9,3,2,'#2a2b2f88');e(9,-z-13,4,2.5,'#3a3b4066');
  r(10,F+6,14,6.5,'#d6d0c2');r(10,F+6,14,1,'#c2bba9');for(let k=0;k<3;k++)r(11.5,F+8+k*1.5,8+((k*5)%4),.5,'#2a2a2e');
  e(w-8,F+17,1.6,1.1,'#e0457b');e(w-5.5,F+18.5,.6,.5,'#e0457b');r(w-8.2,F+17,.6,2.5,'#e0457b');},
 // Gadget's cords: from the generator, along the rock and under the steel doors, taped down every so often.
 gencords(g,o){const {l,r}=g;for(const [col,pts] of [['#c9622a',[[0,9],[14,13],[30,11],[46,15],[62,4],[66,-2]]],['#c9a23a',[[0,12],[16,18],[34,16],[52,19],[70,6],[72,-2]]]]){
   for(let i=1;i<pts.length;i++){const [ax,ay]=pts[i-1],[bx,by]=pts[i];l(ax,ay+.5,bx,by+.5,1.6,'#141416');l(ax,ay,bx,by,1,col);}
   for(const k of [2,4]){const [x,y]=pts[k];r(x-1.5,y-1.5,3,3,'#6b6e72');r(x-1.5,y-1.5,3,.5,'#9a9ea2');}}},
 range(g,o){const {e,r,p,l}=g,C=['#3d3f44','#55585e','#6d7076','#868990','#a0a3a8'],OLIVE=['#2b3122','#3c4430','#4e5840','#626d50'];
  e(56,15,64,5,SHADOW);
  // The concrete portal, set into the rock: a heavy lintel and two piers, stained and chipped.
  p([[-4,14],[-6,-80],[4,-92],[108,-92],[118,-80],[116,14]],EDGE);p([[-3,13],[-5,-79],[4.5,-90.5],[107.5,-90.5],[116.5,-79],[115,13]],C[1]);
  r(2,-86,108,16,C[2]);r(2,-86,108,1,C[3]);r(2,-71,108,1,C[0]);
  for(let i=0;i<14;i++){const x=hash(i,41)*104+4,y=-84+hash(i,42)*90,w=2+hash(i,43)*6;r(x,y,w,.5,hash(i,44)>.5?C[0]:C[3]);}
  for(const x of [6,98])r(x,-70,8,84,C[2]),r(x,-70,1,84,C[3]),r(x+7,-70,1,84,C[0]);
  r(14,-70,84,84,'#16171b');
  // The sign: a bullseye between stencil bars, on a plate bolted to the lintel.
  r(24,-84,64,12,EDGE);r(25,-83,62,10,'#c9c0aa');r(25,-83,62,1,'#e2dccb');for(const x of [28,72])r(x,-80,12,1.5,'#3a3630'),r(x,-77,9,1.5,'#3a3630');
  e(56,-78,6,4.5,EDGE);e(56,-78,5,3.6,'#a33b2e');e(56,-78,3.4,2.4,'#e8e0d1');e(56,-78,1.8,1.3,'#a33b2e');
  for(const x of [26,85])r(x,-82.5,1,1,M[1]),r(x,-75.5,1,1,M[1]);
  // Two steel doors; the right one stands open a hand's width and the range's light spills out.
  r(30,-62,52,74,EDGE);r(31,-61,24.5,72,OLIVE[2]);r(57,-61,24,72,OLIVE[1]);r(55.5,-61,1.5,72,GLASS);r(55.5,-61,.5,72,GLASS_HI);
  p([[56,12],[46,22],[64,22],[57,12]],'#ffb36a33');
  for(const [x,w,c] of [[31,24.5,OLIVE[3]],[57,24,OLIVE[2]]]){r(x+2,-58,w-4,22,c);r(x+2,-34,w-4,40,c);r(x+2,-58,w-4,.5,'#ffffff22');r(x+2,-36,w-4,1,OLIVE[0]);for(const y of [-56,-38,-32,4])for(const dx of [3,w-4])r(x+dx,y,1,1,OLIVE[0]);}
  r(50,-26,3,8,EDGE);r(50.5,-25.5,2,7,M[3]);r(59,-26,3,8,EDGE);r(59.5,-25.5,2,7,M[3]);
  for(let x=31;x<81;x+=6){p([[x,6],[x+3,6],[x+6,11],[x+3,11]],'#d9b23a');p([[x+3,6],[x+6,6],[x+9,11],[x+6,11]],EDGE);}r(31,5.5,50,.5,EDGE);
  // The lamp over the door is lit: this door is open to you.
  r(50,-68,12,5,EDGE);r(51,-67,10,3.5,M[2]);r(52,-64,8,3,EDGE);r(53,-63.5,6,2,EMBER_HI);r(54,-63.5,3,1,GLASS_HI);
  // Floodlight on the right corner, angled down at the doorstep.
  l(108,-88,114,-96,2,EDGE);r(110,-102,12,8,EDGE);r(111,-101,10,6,M[2]);r(112,-99,8,3,'#dfe7ea');r(113,-98.5,4,1,'#ffffff');
  // Sandbag walls either side of the doorstep.
  for(const [x0,n] of [[-10,3],[84,3]])for(let row=0;row<2;row++)for(let i=0;i<n-row;i++){const x=x0+i*13+row*6.5,y=6-row*7;e(x+6.5,y+1,8,5,EDGE);e(x+6.5,y,7,4.2,(i+row)%2?'#8a7f62':'#7a7057');r(x+2,y-2,6,.5,'#a39a7a');r(x+6,y-3.5,1,7,'#6b6250');}
  // A rifle rack on the left pier.
  r(-2,-46,14,30,EDGE);r(-1,-45,12,28,W[1]);r(-1,-45,12,1,W[3]);r(-1,-32,12,1.5,W[2]);for(const x of [1.5,5.5]){r(x,-44,2,24,EDGE);r(x+.5,-43,1,22,M[2]);r(x-.5,-28,3,6,EDGE);r(x,-27.5,2,5,W[2]);}
  // A paper target on a stand by the right pier, shot through.
  l(98,-4,102,-48,1.5,EDGE);l(110,-4,104,-48,1.5,EDGE);r(94,-52,20,26,EDGE);r(95,-51,18,24,'#d8d0bc');e(104,-40,6.5,7.5,'#3a3630');e(104,-40,4.5,5.5,'#d8d0bc');e(104,-40,2.5,3,'#a33b2e');
  for(const [x,y] of [[101,-44],[106,-37],[103,-40],[108,-46],[99,-33]])r(x,y,1,1,'#16171b');},
 // The garden: a fenced plot of tilled rows under its own lamp. Potatoes, staked beans, squash and seedlings, a scarecrow in a hard hat,
 // and the rain barrel, watering can and tools on the west side. The fence's north and sides are drawn first, the crops, then the south rail.
 // Stan's forge: a brick hearth with a hood and chimney, live coals, bellows, an anvil on a stump and a quench bucket.
 forge(g,o){const {e,r,p,l}=g,BR=['#3b2422','#5a3329','#74443a','#8c5a4a'];e(38,28,44,7,SHADOW);
  // Hood and chimney rise from the back of the hearth.
  p([[0,-22],[40,-22],[32,-42],[8,-42]],EDGE);p([[1.5,-22.5],[38.5,-22.5],[31,-41],[9,-41]],M[1]);p([[9,-41],[16,-41],[11,-23],[2,-23]],M[2]);r(1,-24,38,1.5,M[0]);
  r(14.5,-64.5,11,24,EDGE);r(15,-64,10,23,M[1]);r(15,-64,3,23,M[2]);r(13,-67,14,3.5,EDGE);r(13.5,-66.5,13,2.5,M[2]);for(let y=-60;y<-42;y+=6)r(15,y,10,.5,M[0]);
  // The hearth: coal bed on top, bricks down the front.
  r(-.5,-22.5,41,53,EDGE);r(0,-22,40,24,BR[1]);r(0,-22,40,1,BR[3]);
  e(20,-11,14,6.5,'#22150f');e(20,-11.5,11,4.8,EMBER);e(19,-12,7,3,EMBER_HI);for(let k=0;k<9;k++){const x=9+hash(k,301)*22,y=-14+hash(k,302)*6;r(x,y,1.5,1,k%3?'#3b2422':'#ffe4a0');}
  r(0,2,40,28,BR[1]);for(let row=0;row<7;row++){const y=2.5+row*4,off=row%2?4:0;for(let x=-4+off;x<40;x+=8){const x0=Math.max(.5,x),x1=Math.min(39.5,x+7);if(x1>x0)r(x0,y,x1-x0,3.5,row%3===0?BR[3]:BR[2]);}}
  r(12,10,16,11,EDGE);r(13,11,14,10,'#22150f');e(20,20,6,2,EMBER);r(14,18,12,.5,EMBER_HI);
  // Bellows on the left, the anvil and bucket on the right.
  p([[-12,6],[-1,2],[-1,14],[-12,12]],EDGE);p([[-11,6.5],[-1.5,3],[-1.5,13],[-11,11.5]],'#5b4030');r(-11,8,9,.5,'#3c2c25');r(-11,10,9,.5,'#3c2c25');l(-12,9,-15,9,1.5,W[3]);
  e(62,29,11,3.5,SHADOW);r(53.5,11.5,17,17,EDGE);r(54,12,16,16,W[2]);r(54,12,4,16,W[3]);e(62,12,8,3,EDGE);e(62,11.5,7.5,2.5,W[3]);for(let k=0;k<3;k++)e(62,11.5,2+k*2,.8+k*.6,W[2]);
  p([[49,1],[72,1],[78,2.5],[72,4.5],[67,5],[67,9],[57,9],[57,5],[52,4.5],[48,3]],EDGE);p([[50,1.5],[71.5,1.5],[76,2.6],[71.5,3.8],[66,4.2],[66,8.5],[58,8.5],[58,4.2],[51,3.8]],M[2]);r(50,1.5,21,.5,M[3]);
  l(55,-1,64,1,1.2,W[3]);r(63,-1,3,2.5,M[3]);r(63,-1,3,.5,BONE);
  r(42.5,18.5,10,12,EDGE);r(43,19,9,11,M[1]);r(43,19,2,11,M[2]);e(47.5,19.5,4.5,1.5,'#1b2a30');r(45,19,3,.5,'#4f6a74');l(46,18,52,6,.8,M[3]);l(48,18,53,7,.8,M[3]);},
 // A camp table with stools; the mess table holds bowls and a pot, the other cards and mugs.
 table(g,o){const {e,r,p,l}=g,w=o.w,mess=o.id==='mess';e(w/2,24,w/2+12,5,SHADOW);
  const stool=x=>{e(x+5,26,6,2,SHADOW);r(x+.5,10.5,9,3,EDGE);r(x+1,11,8,2,W[3]);r(x+1.5,13.5,1.5,11,EDGE);r(x+7,13.5,1.5,11,EDGE);r(x+1.5,13.5,1,10.5,W[2]);r(x+7,13.5,1,10.5,W[2]);};stool(-13);stool(w+3);
  r(-.5,-14.5,w+1,22,EDGE);r(0,-14,w,15,W[3]);for(let y=-10;y<1;y+=4)r(0,y,w,.5,W[2]);r(0,-14,w,.5,W[4]);r(0,1,w,5.5,W[2]);r(0,6,w,.5,W[1]);
  for(const x of [2,w-6]){r(x-.5,6.5,4.5,18,EDGE);r(x,7,3.5,17,W[2]);r(x,7,1,17,W[3]);}
  const mug=(x,y,col)=>{r(x-.5,y-.5,4,5,EDGE);r(x,y,3,4,col);r(x,y,3,1,'#2a211b');r(x+3,y+1,1.5,2,EDGE);};
  if(mess){for(const x of [6,22,44]){e(x+4,-6,5,2.4,EDGE);e(x+4,-6.4,4.2,1.8,'#8a7a5a');e(x+4,-6.6,3,1.1,'#c9a24a');}r(30,-15,10,9,EDGE);r(31,-14,8,7,M[1]);r(31,-14,8,1.5,M[2]);l(32,-15,38,-15,1,M[3]);mug(52,-12,'#7a3a2a');l(12,-9,18,-3,.8,BONE);}
  else{for(let k=0;k<5;k++){const x=10+k*5+hash(k,311)*3,y=-11+hash(k,312)*5;r(x-.5,y-.5,4,5.5,EDGE);r(x,y,3,4.5,k%2?'#e8e0d1':'#c9c0aa');r(x+1,y+1.5,1,1,k%2?'#8b3a33':'#191b21');}mug(40,-11,'#5f6f80');mug(48,-6,'#7a3a2a');r(54,-13,7,5,EDGE);r(54.5,-12.5,6,4,'#8a7a5a');r(55,-11,5,.5,'#5a4a38');}},
 // Garden fence: rails between posts. Long sides run across the screen; short sides run down it in segments.
 fence(g,o){const {e,r,l}=g,w=o.w,h=o.h,base=h-1;
  const post=(x,y,ht=15,cap=false)=>{r(x-1.5,y-ht,3.5,ht+1.5,EDGE);r(x-1,y-ht+.5,2.5,ht,W[2]);r(x-1,y-ht+.5,1,ht,W[3]);r(x-1.5,y-ht-.5,3.5,1,W[1]);if(cap){r(x-2.5,y-ht-2,5.5,2,EDGE);r(x-2,y-ht-1.5,4.5,1,W[3]);}};
  if(w>h){e(w/2,base+2,w/2,2.5,'#100e0c44');for(const [k,c] of [[11,W[3]],[5,W[2]]]){r(0,base-k,w,2.5,EDGE);r(0,base-k+.5,w,1.5,c);}
   for(let x=0;x<=w;x+=24)post(Math.min(x,w-1),base);if(o.post==='end'){post(w-1,base,26,true);r(w-9,base-24,8,6,EDGE);r(w-8.5,base-23.5,7,5,W[3]);r(w-6,base-22,1,3,'#3f5a2e');r(w-7,base-21.5,1.5,1,'#6f9446');r(w-5,base-22.5,1.5,1,'#6f9446');r(w-5.5,base-25,.5,1.5,EDGE);}
   if(o.post==='start'){post(1,base,26,true);for(const [k,c] of [[12,W[3]],[5,W[2]]])l(2,base-k,14,base-k-16,2.5,EDGE),l(2,base-k,14,base-k-16,1.2,c);l(13,base-28,13,base-10,2,EDGE);l(13,base-28,13,base-10,1,W[2]);}
   return;}
  for(const [k,c] of [[11,W[3]],[5,W[2]]]){r(1.5,-k,2.5,h,EDGE);r(2,-k,1.5,h,c);}post(3,0);post(3,h);},
 // A raised bed of one crop. Flat: people walk on its edges and between the rows.
 plot(g,o){const {e,r,p,l}=g,w=o.w,h=o.h,LEAF=['#2c3b22','#3f5a2e','#567a3a','#6f9446','#8bb05a'],SOIL=['#2e2219','#3d2c20','#4d3a2a','#5d4834','#6e5840'];
  r(-.5,-.5,w+1,h+1,EDGE);r(0,0,w,h,SOIL[1]);for(let y=1;y<h;y+=2)for(let x=1;x<w;x+=3)if(hash(x+o.x,y+o.y)>.84)r(x,y,1,.5,SOIL[hash(y,x)>.5?0:2]);
  r(0,0,w,1.5,W[2]);r(0,h-1.5,w,1.5,W[1]);r(0,0,1.5,h,W[2]);r(w-1.5,0,1.5,h,W[1]);
  const rows=[13,35,57];for(const y of rows){r(5,y-3,w-10,6,SOIL[3]);r(5,y-3,w-10,1,SOIL[4]);r(5,y+3,w-10,.5,SOIL[0]);}
  const each=(step,fn)=>{for(const y of rows)for(let x=10;x<w-8;x+=step)fn(x+(hash(x,y+o.x)-.5)*2,y);};
  if(o.crop==='potato')each(12,(x,y)=>{e(x,y-1,6,4.5,EDGE);e(x,y-1.5,5,3.8,LEAF[1]);e(x-1.5,y-2.5,3,2.2,LEAF[2]);e(x+1.5,y-3,2,1.5,LEAF[3]);if(hash(x|0,y)>.55)r(x,y-5,1,1,'#e8e0d1'),r(x+.5,y-4.5,.5,.5,'#d9b23a');});
  if(o.crop==='cabbage')each(14,(x,y)=>{e(x,y,6,4.2,EDGE);e(x,y-.3,5.2,3.6,'#4f7a5a');e(x,y-.8,3.4,2.4,'#7fa77a');e(x-.5,y-1.4,1.6,1,'#a7c79a');r(x-4,y,2,1,'#3d5e46');r(x+2.5,y-.5,2,1,'#3d5e46');});
  if(o.crop==='squash')each(18,(x,y)=>{for(const [dx,dy,s] of [[-4,-1,4.2],[4,-.5,4],[0,-3,3.6]]){e(x+dx,y+dy,s+1,s*.75+1,EDGE);e(x+dx,y+dy-.4,s,s*.75,LEAF[2]);r(x+dx-s*.5,y+dy-.5,s,.5,LEAF[1]);}
   if(hash(x|0,9)>.3){const sx=x+(hash(x|0,10)>.5?5:-5);e(sx,y+2.5,4,3,EDGE);e(sx,y+2,3.2,2.3,'#b8743a');e(sx-1,y+1.3,1.4,1,'#d0904c');r(sx-.25,y-1,.5,1.5,LEAF[0]);}});
  if(o.crop==='carrot')each(6,(x,y)=>{r(x-1,y,2.5,1.5,'#c86a2e');r(x-.5,y,1,.5,'#e08a44');for(const [dx,ht] of [[-1.5,5],[0,7],[1.5,5]]){l(x+.25,y,x+.25+dx,y-ht,.8,LEAF[3]);r(x+dx-.5,y-ht,1,1,LEAF[4]);}});
  if(o.crop==='tilled'){for(const y of rows)for(let x=8;x<w-8;x+=4)r(x,y-.5,2.5,1,SOIL[0]);for(let x=12;x<w*.45;x+=8){const y=rows[0];r(x,y-3,.5,3,LEAF[3]);e(x-1.2,y-3.5,1.5,.8,LEAF[4]);e(x+1.6,y-4,1.5,.8,LEAF[3]);}
   r(w-30,rows[2]-9,10,9,EDGE);r(w-29.5,rows[2]-8.5,9,8,'#a08f6a');r(w-28,rows[2]-6,6,.5,'#6b5d40');r(w-27,rows[2]-10,4,1.5,'#8a7a5a');l(w-18,rows[1]+4,w-10,rows[1]-4,1.5,EDGE);l(w-18,rows[1]+4,w-10,rows[1]-4,.8,W[3]);r(w-11,rows[1]-6,3,3,M[2]);}},
 // Pole beans on stakes: the one tall crop, so it stands up like a hedge.
 trellis(g,o){const {e,r,l}=g,w=o.w,h=o.h,LEAF=['#2c3b22','#3f5a2e','#567a3a','#6f9446','#8bb05a'];e(w/2,h,w/2+4,4,SHADOW);
  r(-.5,-.5,w+1,h+1,EDGE);r(0,0,w,h,'#3d2c20');r(0,0,w,1.5,W[2]);r(0,h-1.5,w,1.5,W[1]);
  for(const y of [14,34]){r(4,y-2,w-8,4,'#5d4834');for(let x=10;x<w-6;x+=13){l(x-3,y+1,x,y-26,1.5,EDGE);l(x+3,y+1,x,y-26,1.5,EDGE);l(x-3,y+1,x,y-26,.6,W[3]);l(x+3,y+1,x,y-26,.6,W[3]);r(x-1,y-25,2,1,'#c9c0aa');
   for(let k=0;k<6;k++){const ly=y-2-k*4,lx=x+(k%2?2.5:-2.5);e(lx,ly,2.6,1.8,EDGE);e(lx,ly-.3,2,1.3,LEAF[k%2?2:3]);}r(x+1,y-9,.5,3,'#9ab05a');r(x-1.5,y-15,.5,3,'#9ab05a');if(hash(x,y)>.5)r(x+2,y-19,.5,.5,'#e8e0d1');}
   l(6,y-20,w-6,y-20,.5,'#c9c0aa');}},
 // The garden's scarecrow: a tall, crooked hat in faded purple, a burlap head with a stitched grin and no eyes.
 scarecrow(g,o){const {e,r,p,l}=g,cx=7,PUR=['#2e2738','#43395a','#56496e','#6d5f86'],SACK=['#2f2820','#3d3329','#4b4034'],STRAW=['#a0803a','#c9a24a','#e0bc66'],STITCH='#d6ccb0',COAT=['#24232b','#32313c','#41404c'];
  e(cx,7,11,3,SHADOW);r(cx-1.5,-31,3,38,EDGE);r(cx-1,-30,2,36,W[2]);r(cx-1,-30,.5,36,W[3]);
  r(cx-17,-37,34,2.5,EDGE);r(cx-16.5,-36.5,33,1.5,W[3]);
  // Ragged coat and sleeves along the crossbar, straw poking out of the cuffs.
  p([[cx-16,-38.5],[cx-6,-40],[cx-5,-34],[cx-16,-33]],EDGE);p([[cx-15.5,-38],[cx-6.5,-39.3],[cx-5.8,-34.5],[cx-15.5,-33.7]],COAT[1]);
  p([[cx+16,-38.5],[cx+6,-40],[cx+5,-34],[cx+16,-33]],EDGE);p([[cx+15.5,-38],[cx+6.5,-39.3],[cx+5.8,-34.5],[cx+15.5,-33.7]],COAT[1]);
  for(const s of [-1,1])for(let k=0;k<3;k++)l(cx+s*15.5,-36+k*1.2,cx+s*(19+k*.8),-38+k*2.4,.8,STRAW[1+(k%2)]);
  p([[cx-7,-41],[cx+7,-41],[cx+9,-24],[cx+5,-19],[cx+2,-22],[cx-1,-19],[cx-5,-22],[cx-9,-24]],EDGE);p([[cx-6.3,-40.3],[cx+6.3,-40.3],[cx+8.2,-24.3],[cx+5,-20.5],[cx+2,-23.3],[cx-1,-20.5],[cx-4.7,-23],[cx-8.2,-24.3]],COAT[1]);
  p([[cx-6.3,-40.3],[cx-2,-40.3],[cx-4,-23],[cx-8.2,-24.3]],COAT[2]);p([[cx+4,-40.3],[cx+6.3,-40.3],[cx+8.2,-24.3],[cx+5,-20.5]],COAT[0]);
  r(cx+1,-33,3.5,3.5,PUR[2]);for(let k=0;k<3;k++){r(cx+.5,-32.5+k*1.2,1,.4,STITCH);r(cx+4,-32.5+k*1.2,1,.4,STITCH);}r(cx-5,-27,3,2.5,SACK[2]);r(cx-5.5,-26,1,.4,STITCH);r(cx-2.5,-25.5,1,.4,STITCH);
  // A straw ruff at the neck.
  p([[cx-8,-41],[cx-6,-44],[cx-4.5,-41.5],[cx-2.5,-44.5],[cx-.5,-41.5],[cx+1.5,-44.5],[cx+3,-41.5],[cx+5,-44],[cx+6.5,-41.5],[cx+8.5,-43],[cx+8,-39.5],[cx-8,-39.5]],STRAW[0]);
  for(const x of [-6,-2.5,1.5,5])l(cx+x,-40,cx+x+(x>0?1:-1),-43.5,.6,STRAW[2]);
  // Burlap head: no eyes, just the stitched grin.
  e(cx,-49,7,6.5,EDGE);e(cx,-49,6.2,5.7,SACK[1]);e(cx+1.8,-48,3.8,4.2,SACK[0]);e(cx-2.2,-51,2.5,2,SACK[2]);for(let k=0;k<8;k++)r(cx-4+hash(k,321)*8,-53+hash(k,322)*8,.5,.5,k%2?SACK[2]:SACK[0]);
  for(let k=0;k<=8;k++){const t=k/8,x=cx-4.5+t*9,y=-47.2+Math.sin(t*Math.PI)*1.6;r(x-.25,y,.75,.5,STITCH);if(k%2===0)r(x,y-.75,.4,2,STITCH);}
  // The tall, bent hat with a patch on the crown and a frayed brim.
  e(cx,-54.5,11.5,3,EDGE);e(cx,-54.8,10.5,2.3,PUR[1]);for(const x of [-9,-4,3,8])r(cx+x,-53,1,1,EDGE);r(cx-8,-55.5,6,.5,PUR[3]);
  p([[cx-6,-55.5],[cx+6,-55.5],[cx+4,-62],[cx+3.5,-67],[cx+6.5,-71],[cx+10,-72],[cx+6,-72.5],[cx+1.5,-68.5],[cx-.5,-63],[cx-4,-58]],EDGE);
  p([[cx-5,-56],[cx+5,-56],[cx+3,-62],[cx+2.6,-66.5],[cx+5.5,-70.3],[cx+8,-71.6],[cx+5.5,-71.7],[cx+2,-68.3],[cx+.3,-63],[cx-3.3,-58.2]],PUR[1]);p([[cx-5,-56],[cx-1.5,-56],[cx-.5,-62.5],[cx-3.3,-58.2]],PUR[2]);
  r(cx-5,-57.5,10,1.5,PUR[0]);r(cx-1.5,-63.5,3.5,3,PUR[3]);for(let k=0;k<3;k++){r(cx-2,-63+k*1,1,.4,STITCH);r(cx+1.5,-63+k*1,1,.4,STITCH);}
  // A crow keeps him company on the crossbar.
  e(cx+13,-39,2.3,1.8,'#111319');r(cx+15,-40,1.5,.5,'#5a5040');r(cx+12.5,-37.5,.5,1.5,'#111319');},
 // Clyde's shed: plank walls, a tin roof, the door propped open, seed sacks and tools.
 shed(g,o){const {e,r,p,l}=g,w=o.w,h=o.h,TIN=['#3b3f45','#51565e','#6a7078','#868c93'];e(w/2+4,h+1,w/2+8,6,SHADOW);
  p([[-3,-24],[w+3,-24],[w-6,-64],[6,-64]],EDGE);p([[-1.5,-25],[w+1.5,-25],[w-6.5,-63],[6.5,-63]],TIN[1]);for(let x=4;x<w;x+=6)l(x,-25,x+(w/2-x)*.12,-63,.8,TIN[0]);p([[6.5,-63],[w-6.5,-63],[w-5.5,-60],[7.5,-60]],TIN[3]);
  for(let k=0;k<6;k++){const x=8+hash(k,331)*(w-20),y=-58+hash(k,332)*30;r(x,y,3,1.5,RUST);}
  r(-.5,-24.5,w+1,h+25,EDGE);r(0,-24,w,h+24,W[2]);for(let x=0;x<w;x+=8){r(x,-24,.5,h+24,W[1]);r(x+.5,-24,1,h+24,W[3]);}r(0,-24,w,2,W[1]);r(0,h-3,w,3,W[1]);
  r(37,-12,24,h+12,EDGE);r(38,-11,22,h+11,'#14110e');r(40,-6,8,4,'#5a4a38');r(52,4,6,9,'#a08f6a');r(41,h-8,14,8,'#3a2c22');
  p([[61,-12],[74,-6],[74,h+4],[61,h]],EDGE);p([[62,-10.5],[73,-5.5],[73,h+3],[62,h-1]],W[3]);l(62,h/2-6,73,h/2-1,1,W[1]);
  r(10,-8,18,14,EDGE);r(11,-7,16,12,GLASS);r(11,-7,16,4,GLASS_HI);r(18.5,-7,1,12,EDGE);r(11,-1.5,16,1,EDGE);r(9,6,20,2.5,EDGE);r(9.5,6.5,19,1.5,W[3]);for(const x of [11,17,23]){r(x,3.5,4,3,'#6b4a36');r(x+.5,1.5,1,2,'#6f9446');r(x+2,2,1.5,1,'#8bb05a');}
  l(80,h-2,86,-14,2,EDGE);l(80,h-2,86,-14,1,W[3]);r(83,-18,6,5,EDGE);r(83.5,-17.5,5,4,M[2]);l(88,h-2,90,-10,2,EDGE);l(88,h-2,90,-10,1,W[4]);for(let k=0;k<4;k++)r(86+k*1.5,-13,.5,3,M[3]);
  for(const [x,y,col] of [[2,h-14,'#8a7a5a'],[12,h-12,'#a08f6a']]){p([[x,y+14],[x+1,y+3],[x+3,y],[x+9,y],[x+11,y+3],[x+12,y+14]],EDGE);p([[x+1,y+13],[x+2,y+3.5],[x+4,y+1],[x+8,y+1],[x+10,y+3.5],[x+11,y+13]],col);r(x+3,y+6,6,3,'#e8e0d1');r(x+4.5,y+7,1,1,'#3f5a2e');r(x+6,y+7,1.5,1,'#6f9446');}
  r(42,-22,14,6,EDGE);r(42.5,-21.5,13,5,W[3]);r(46,-20,1,3,'#3f5a2e');r(45,-19.5,1.5,1,'#6f9446');r(47,-20.5,1.5,1,'#6f9446');l(44,-22,46,-26,.5,EDGE);l(54,-22,52,-26,.5,EDGE);},
 // Compost: a slatted bin of dark scraps with a fork stuck in it.
 compost(g,o){const {e,r,l}=g,w=o.w,h=o.h;e(w/2+2,h,w/2+5,4,SHADOW);r(-.5,-12.5,w+1,h+13,EDGE);r(0,-12,w,h+12,'#2a2018');e(w/2,-6,w/2-3,6,'#3a2c20');for(let k=0;k<14;k++)r(3+hash(k,341)*(w-8),-10+hash(k,342)*10,1.5,1,k%3?'#567a3a':'#8a6a44');
  for(let y=-12;y<h;y+=6){r(0,y,w,3.5,W[2]);r(0,y,w,.5,W[3]);}for(const x of [0,w-3])r(x,-14,3,h+14,W[1]);l(w-10,-6,w-4,-24,1.5,EDGE);l(w-10,-6,w-4,-24,.8,W[3]);r(w-6,-27,5,2,M[2]);for(let k=0;k<3;k++)r(w-6+k*2,-26,.5,3,M[3]);},
 // A wheelbarrow of fresh soil, parked by the shed.
 wheelbarrow(g,o){const {e,r,p,l}=g;e(20,17,22,4,SHADOW);l(30,2,46,10,2,EDGE);l(30,0,46,6,2,EDGE);l(30,2,46,10,1,W[3]);l(30,0,46,6,1,W[3]);
  p([[0,-8],[30,-8],[26,6],[6,6]],EDGE);p([[1,-7.5],[29,-7.5],[25.5,5],[6.5,5]],'#3f5a4a');p([[1,-7.5],[29,-7.5],[28,-4],[2,-4]],'#5a7a68');e(15,-7.5,13,3,'#3d2c20');e(15,-8,10,2,'#4d3a2a');for(const x of [9,15,21])e(x,-9,2.2,1.6,'#b8935a');
  e(4,10,5,5,EDGE);e(4,10,4,4,M[1]);e(4,10,1.5,1.5,M[3]);r(8,8,4,8,EDGE);r(24,6,2,10,EDGE);},
 laundry(g,o){const {e,r,l,p}=g;e(50,6,52,4,SHADOW);for(const x of [0,94]){r(x,-62,5,70,EDGE);r(x+1,-61,3,68,W[2]);r(x+1,-61,1,68,W[3]);}
  const sag=x=>-58+Math.sin(x/96*Math.PI)*7;for(let x=4;x<94;x+=1)r(x,sag(x),1,.5,'#a39a84');
  // The scene redraws this with a sway (-1 to 1) a few times a second: the hems swing, the pegs stay put. Longer cloth swings further.
  const sw=o.sway||0,cloth=(x,w,h,col,hi)=>{const y=sag(x+w/2)+.5,d=snap(sw*h*.14);p([[x,y],[x+w,y],[x+w-.5+d,y+h],[x+.5+d,y+h]],EDGE);p([[x+.5,y+.5],[x+w-.5,y+.5],[x+w-1+d,y+h-.5],[x+1+d,y+h-.5]],col);r(x+.5,y+.5,w-1,1.5,hi);r(x+1,y-1,1,2,'#c9c0aa');r(x+w-2,y-1,1,2,'#c9c0aa');return d;};
  const d1=cloth(10,16,18,'#5f6f80','#73859a');r(14+d1*.6,-30,8,.5,'#4c5a6a');const d2=cloth(32,12,24,'#5a4a3c','#6e5c4b');r(37.5+d2*.5,-36,1,13,'#4a3c30');cloth(50,18,14,'#a39a84','#bdb39b');cloth(74,6,9,'#7a3a2a','#8f4a38');cloth(82,6,9,'#7a3a2a','#8f4a38');},
 sacks(g,o){const {e,r,p}=g;e(15,20,17,4,SHADOW);for(const [x,y,col] of [[2,-6,'#8a7a5a'],[14,-4,'#a08f6a'],[7,-16,'#968563']]){p([[x,y+18],[x+1,y+4],[x+3,y],[x+11,y],[x+13,y+4],[x+14,y+18]],EDGE);p([[x+1,y+17],[x+2,y+4.5],[x+4,y+1],[x+10,y+1],[x+12,y+4.5],[x+13,y+17]],col);r(x+5,y-2,4,3,EDGE);r(x+5.5,y-1.5,3,2,'#6b5d40');r(x+3,y+8,8,.5,'#6b5d40');r(x+3,y+12,8,.5,'#6b5d40');r(x+2,y+5,1,10,'#ffffff18');}},
 tidepool(g,o){const {e,r}=g,w=o.w,h=o.h;e(w/2,h/2,w/2+2,h/2+2,R[1]);e(w/2,h/2-.5,w/2,h/2,R[3]);e(w/2,h/2,w/2-3,h/2-2.5,'#1a3a4b');e(w/2-2,h/2-1,w/2-7,h/2-5,'#22485a');r(w*.3,h*.3,4,.5,'#7fa3ad');r(w*.55,h*.55,3,.5,'#5d8693');
  r(w*.62,h*.35,1.5,1.5,'#c46a4a');r(w*.62-1.5,h*.35+.5,4.5,.5,'#c46a4a');r(w*.3,h*.6,1.5,1,'#6b8a5a');r(w*.3+2,h*.62,1,1,'#7f9f6a');for(let i=0;i<6;i++){const a=i/6*6.28;r(w/2+Math.cos(a)*(w/2+1),h/2+Math.sin(a)*(h/2+1)-1,2,1,R[4]);}},
 lantern(g,o){const {e,r}=g;e(5,6,8,3,SHADOW);e(5,5,5,2.5,R[2]);r(3.5,-70,3,76,EDGE);r(4,-69,2,74,W[2]);r(4,-69,.5,74,W[3]);r(4,-71,10,2,EDGE);r(4,-70.5,9,1,W[2]);r(11.5,-69,.5,3,M[1]);
  r(8.5,-66.5,7,1.5,M[1]);r(9,-65,6,9,EDGE);r(10,-64,4,7,GLASS);r(11,-63,2,5,GLASS_HI);r(9,-56.5,6,1,M[1]);},
 rock(g,o){const {e,p,r}=g,w=o.w,h=o.h,z=o.z;e(w/2+2,h-1,w/2+3,h/3,SHADOW);const pts=[[1,h-2],[2,h-z*.5-4],[w*.3,-z+h*.4],[w*.68,-z+h*.3],[w-2,h-z*.55],[w,h-3],[w*.6,h],[w*.2,h]];
  p(pts,EDGE);p(pts.map(([x,y])=>[x+(x<w/2?1:-1),y+(y<h/2?1:-1)]),R[2]);p([[3,h-z*.5-3],[w*.3,-z+h*.4+1],[w*.68,-z+h*.3+1],[w-3,h-z*.55],[w*.6,h-z*.3],[w*.2,h-z*.25]],R[3]);r(w*.3,-z+h*.4+1.5,w*.3,.5,R[4]);r(w*.5,h-z*.3,.5,z*.4,R[1]);},
 // Split logs stacked between two stakes, cut ends out, and a chopping stump with the axe left in it.
 woodpile(g,o){const {e,r,l,p}=g;e(30,18,32,5,SHADOW);for(const x of [1,37]){r(x,-27,4,44,EDGE);r(x+1,-26,2,42,W[2]);r(x+1,-26,.5,42,W[3]);}
  const rows=[[13,[8,16,24,32]],[6,[12,20,28]],[-1,[8,16,24,32]],[-8,[12,20,28]],[-15,[16,24]]];
  for(const [y,xs] of rows)for(const x of xs){e(x,y+.5,4.6,4,EDGE);e(x,y,3.8,3.2,hash(x,y)>.5?W[3]:'#9a7c5a');e(x,y,2.2,1.8,W[4]);r(x-.25,y-.25,.5,.5,W[1]);r(x-3,y+2.2,4,.5,W[1]);}
  e(51,15,7,3.4,EDGE);r(44.5,7,13,8,EDGE);r(45.5,8,11,7,W[1]);r(46,8,1.5,7,W[2]);e(51,7.5,6,2.6,EDGE);e(51,7.3,5.2,2,'#9a7c5a');e(51,7.3,3,1.1,W[4]);
  l(50,7,57,-6,2,EDGE);l(50,7,57,-6,1,W[3]);p([[54,-8],[60,-9],[61,-4],[56,-2]],EDGE);p([[55,-7.5],[59.5,-8],[60,-4.5],[56.5,-3]],M[2]);r(55.5,-7.5,4,.5,M[3]);
  for(let i=0;i<7;i++)r(42+hash(i,3)*18,14+hash(i,4)*5,1.5,.5,'#a88a66');},
 // A blue drum under the drip by the medic tent, with a tarp funnel. Clean water is scarce.
 drum(g,o){const {e,r,l,p}=g;e(14,16,16,5,SHADOW);r(1,-27,24,40,EDGE);e(13,13,12,4,EDGE);r(2,-27,22,40,'#34495a');e(13,13,11,3.2,'#34495a');r(2,-27,5,40,'#435b6e');r(19,-27,5,40,'#2a3a48');
  for(const y of [-18,-2,9])r(1.5,y,23,1.5,'#2a3a48');e(13,-27,12,4.5,EDGE);e(13,-27,11,3.6,'#435b6e');e(13,-27,8,2.5,'#1c2a35');e(13,-27.3,6,1.6,'#3b5a66');r(10,-28,4,.5,'#8fb0b8');
  p([[4,-38],[22,-38],[15,-29],[11,-29]],EDGE);p([[5.5,-37.5],[20.5,-37.5],[14.5,-30],[11.5,-30]],'#5d6950');r(6,-37.5,14,1,'#6f7d5f');l(4,-38,-2,-44,.5,'#5b5446');l(22,-38,28,-44,.5,'#5b5446');
  e(32,12,5,2.5,EDGE);r(27.5,4,9,8,EDGE);r(28.5,5,7,7,M[2]);e(32,5,4,1.5,EDGE);e(32,5,3.2,1,'#1c2a35');r(28.5,5,1.5,7,M[3]);l(28,5,32,1,.5,M[3]);l(32,1,36,5,.5,M[3]);},
 // A heap of net with cork floats and a faded buoy, by the pier steps.
 nets(g,o){const {e,r,l,p}=g,w=o.w;e(w/2,11,w/2+3,5,SHADOW);const lumps=[[11,7,10,5],[23,5,12,6.5],[34,8,9,5]];
  for(const [x,y,a,b] of lumps)e(x,y+1,a+1,b+1,EDGE);for(const [x,y,a,b] of lumps){e(x,y,a,b,'#4a4538');e(x-1,y-1.5,a*.75,b*.55,'#5d5747');}
  for(let i=0;i<26;i++){const x=3+hash(i,1)*(w-6),y=1+hash(i,2)*11,s=hash(i,3)>.5?1:-1;l(x,y,x+2.5,y+2.5*s,.5,'#7a735f');}
  for(const [x,y] of [[6,8],[17,2],[29,3],[38,10],[24,11]]){e(x,y,2.4,1.6,EDGE);e(x,y-.2,1.8,1.1,'#b8a27a');r(x-1,y-.8,1,.5,'#d4c39a');}
  l(-6,14,40,-4,2.5,EDGE);l(-6,14,40,-4,1.4,W[3]);p([[36,-2],[46,-7],[48,-4],[39,1]],EDGE);p([[37,-2],[45.5,-6],[47,-4.2],[39,0]],W[3]);
  e(w-3,4,5,4.4,EDGE);e(w-3,3.6,4.2,3.6,'#8a4a3e');r(w-7,2.5,8.4,1.6,'#c4bca8');r(w-5.5,.5,2,1,'#b06a5a');},
 // A stack of salvage by Hollis's cart: crates, an ammo can and a coil of hose.
 salvage(g,o){const {e,r,l}=g;e(22,16,24,5,SHADOW);box(g,26,12,18,'#5a4a38','#3d3027');r(.5,-17.5,25,1,'#76614a');for(const x of [8,17])r(x,-5.5,1,17,'#33281f');
  r(4,-24,16,8,EDGE);r(5,-23,14,7,'#5a4a38');r(5,-23,14,3,'#76614a');r(5,-20,14,.5,'#33281f');r(10,-18,4,2,M[1]);
  r(28,-2,14,14,EDGE);r(29,-1,12,5,'#5f6844');r(29,4,12,7,'#4b5236');r(33,-3,4,2,EDGE);r(33.5,-2.5,3,1,M[2]);r(30,7,10,.5,'#3a3f2a');
  e(36,15,7,3,EDGE);e(36,14.5,6,2.4,'#2a2b2f');e(36,14.5,3.6,1.3,'#3f4247');e(36,14.5,2,.6,'#2a2b2f');l(30,14,24,17,1,'#2a2b2f');},
 // The way deeper in: a mine frame in a rock outcrop, choked with fallen stone. Green things push through the gaps.
 passage(g,o){const {e,r,l,p}=g,h=o.h;e(40,h,50,7,SHADOW);
  const rock=[[-12,h+2],[-14,h-24],[-8,-22],[6,-46],[26,-58],[52,-58],[72,-46],[86,-22],[90,h-20],[88,h+2]];
  p(rock,EDGE);p(rock.map(([x,y])=>[x+(x<40?1.2:-1.2),y+1.2]),R[1]);p([[-6,h-26],[-2,-20],[10,-42],[28,-54],[50,-54],[66,-44],[78,-24],[60,-30],[40,-38],[20,-32]],R[2]);
  p([[10,-42],[28,-54],[50,-54],[40,-46],[24,-44]],R[3]);r(26,-54,18,.5,R[4]);r(12,-40,8,.5,R[4]);for(const [x,y,w] of [[0,-6,10],[70,-12,12],[64,6,10],[-8,10,8]])r(x,y,w,.5,R[0]);
  for(let i=0;i<8;i++){const x=8+hash(i,7)*64,y=-50+hash(i,8)*12;e(x,y,2.5+hash(i,9)*2,1.2,MOSS_HEX[hash(i,10)>.5?1:0]);}
  // The opening, its timbers and the rubble filling it.
  p([[18,h],[19,-18],[24,-26],[56,-26],[61,-18],[62,h]],'#0b0c10');
  for(const x of [16,58]){r(x,-24,6,h+25,EDGE);r(x+1,-23,4,h+23,W[1]);r(x+1,-23,1.2,h+23,W[2]);}
  p([[12,-31],[68,-27],[68,-21],[12,-25]],EDGE);p([[13,-30],[67,-26],[67,-22],[13,-26]],W[2]);r(14,-29.5,52,.5,W[3]);p([[36,-28.5],[40,-28],[38,-23],[35,-24]],EDGE);
  const stones=[[24,h-2,8],[36,h-1,9],[50,h-3,8],[28,h-11,7],[42,h-12,8],[54,h-13,6],[32,h-21,6],[46,h-22,6],[38,h-30,5],[26,h-28,4]];
  for(const [x,y,s] of stones){e(x,y+1,s+1,s*.7+1,EDGE);e(x,y,s,s*.7,R[hash(x,y)>.5?2:3]);r(x-s*.5,y-s*.45,s*.6,.5,R[4]);}
  l(20,h-36,60,h-14,3,EDGE);l(20,h-36,60,h-14,1.8,W[1]);r(30,-12,1,4,M[1]);
  // Sprouts through the rubble: the only green thing in camp that is not moss.
  for(const [x,y] of [[30,h-26],[48,h-31],[41,h-17]]){l(x,y,x,y-5,.8,'#4f6b34');e(x-1.6,y-5,1.8,1,'#6f9a45');e(x+1.6,y-6,1.8,1,'#86b356');}
  // A pick leans on the frame for whoever clears it someday.
  l(66,h+1,74,h-24,1.5,EDGE);l(66,h+1,74,h-24,.8,W[3]);p([[66,-26],[80,-22],[81,-20],[74,-21],[67,-24]],EDGE);r(68,-24.5,10,1,M[3]);},
 driftwood(g,o){const {l,r}=g;l(2,8,78,4,4,EDGE);l(2,7.5,78,3.5,2.8,'#8f8576');l(4,6.5,76,2.5,.8,'#a9a090');l(40,6,52,-2,2.5,EDGE);l(40,6,52,-2,1.5,'#8f8576');for(const x of [16,34,60])r(x,5,.5,2,'#6d665b');}
};
export const PROP_PAD=14;
export function propArt(c,o){c.save();c.scale(2,2);c.translate(PROP_PAD,o.z+PROP_PAD);ART[o.kind](painter(c),o);if(!o.flat&&!NO_WEAR.has(o.kind))wear(c,o);c.restore();}
// v0.28 wear: painted only over the prop's own pixels. A grimy band darkens the foot of everything that stands on the sand,
// and canvas and wood pick up specks of dirt toward the bottom.
const NO_WEAR=new Set(['lantern','fence','gencords','pier','boat','tidepool','rock','laundry','plot','trellis','scarecrow']),SPECKLED=new Set(['tent','medtent','shelter','crate','cart','shed','board','sacks','table','woodpile']);
function wear(c,o){c.save();c.globalCompositeOperation='source-atop';const tall=o.z+o.h,band=Math.min(16,Math.max(5,tall*.28)),g=c.createLinearGradient(0,o.h+2,0,o.h-band);
 g.addColorStop(0,'rgba(24,17,11,.42)');g.addColorStop(1,'rgba(24,17,11,0)');c.fillStyle=g;c.fillRect(-PROP_PAD,o.h-band,o.w+PROP_PAD*2,band+PROP_PAD);
 if(SPECKLED.has(o.kind)){const n=Math.round(o.w*tall/40);for(let i=0;i<n;i++){const x=hash(i,o.x|0)*o.w,y=o.h-Math.pow(hash(o.y|0,i),1.8)*tall;c.fillStyle=hash(i,i+o.w)>.7?'rgba(232,224,209,.12)':'rgba(30,22,14,.28)';c.fillRect(snap(x),snap(y),.5,hash(i,3)>.6?1:.5);}}
 c.restore();}
// Six flame frames, 48 x 60 units each, anchored at the bottom center (24, 56).
export const FLAME={w:48,h:60,ax:24,ay:56,frames:6};
export function flameArt(c){c.save();c.scale(2,2);const {p,r}=painter(c);
 for(let f=0;f<FLAME.frames;f++){c.save();c.translate(f*FLAME.w,0);const tongue=(k,hgt,wid,col)=>{const sway=Math.sin(f/FLAME.frames*Math.PI*2+k*1.7)*3,x=24+(k-1)*wid*.55;p([[x-wid,56],[x+wid,56],[x+wid*.55,56-hgt*.45],[x+sway,56-hgt],[x-wid*.55,56-hgt*.5]],col);};
  const s=1+.12*Math.sin(f*2.1);tongue(0,26*s,8,'#c94f1f');tongue(2,24/s,8,'#c94f1f');tongue(1,40*s,11,'#c94f1f');tongue(1,32*s,9,'#f28a2e');tongue(0,18/s,6,'#f28a2e');tongue(2,20*s,6,'#f28a2e');tongue(1,20*s,6,'#ffc456');tongue(1,10,4,'#ffe9a8');
  r(22+Math.sin(f)*4,56-44*s-hashF(f)*6,1.5,1.5,'#ffc456');r(27-Math.sin(f)*3,56-36*s,1,1,'#f28a2e');c.restore();}
 c.restore();}
const hashF=f=>hash(f,77);
export const ICON={w:20,h:24};
export const ICONS=['hammer','cross','bowl','lantern','chevron','target','sprout'];
export function iconArt(c){c.save();c.scale(2,2);const {r,p,l,e}=painter(c);
 ICONS.forEach((kind,i)=>{c.save();c.translate(i*ICON.w,0);
  if(kind==='chevron'){p([[3,6],[17,6],[10,15]],EDGE);p([[5,7.5],[15,7.5],[10,13]],EMBER);p([[7,7.5],[13,7.5],[10,10.5]],EMBER_HI);c.restore();return;}
  r(2,1,16,16,EMBER);r(3,2,14,14,'#1c1a17');p([[7,17],[13,17],[10,21]],EMBER);p([[8.5,17],[11.5,17],[10,19.5]],'#1c1a17');
  if(kind==='hammer'){l(6,14,13,6,2,BONE);r(9,3.5,8,4,BONE);r(9,6.5,8,1,'#a2998a');}
  if(kind==='cross'){r(8.5,4,3,10,TEAL_HI);r(5,7.5,10,3,TEAL_HI);}
  if(kind==='bowl'){p([[4.5,9],[15.5,9],[13,13.5],[7,13.5]],BONE);r(4.5,9,11,1,'#a2998a');l(8,8,7,4,.8,'#a2998a');l(11,8,12,4,.8,'#a2998a');}
  if(kind==='target'){e(10,9,5.5,5.5,BONE);e(10,9,4.5,4.5,'#1c1a17');e(10,9,2.5,2.5,BONE);e(10,9,1.5,1.5,EMBER_HI);r(9.5,2,1,3,BONE);r(9.5,13,1,3,BONE);r(3,8.5,3,1,BONE);r(14,8.5,3,1,BONE);}
  if(kind==='sprout'){r(9.5,7,1,8,'#8bb05a');e(7,7.5,3,1.6,'#8bb05a');e(13,6,3,1.6,'#a7c97a');r(5,14,10,1.5,'#8a6a44');}
  if(kind==='lantern'){r(9.5,3,1,2,BONE);r(7,5,6,1,BONE);r(7,6,6,7,BONE);r(8,7,4,5,GLASS);r(9,8,2,3,GLASS_HI);r(7,13,6,1,BONE);}
  c.restore();});c.restore();}
// Fish for the basket, the catch card and the spit. Facing right, about 26 x 12 units, centered on (0, 0).
// cook (0..1) browns the fish; past the burn mark it chars.
const mix=(a,b,t)=>{const A=rgb(a),B=rgb(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('');};
export const FISH_COLORS={perch:['#8a7a55','#b9a77d','#d8cfb4','#6b5d40','#9a8a60'],mackerel:['#2f5a5f','#5f8a8a','#c9d0cc','#1f3d40','#4a7072'],cod:['#6b4030','#8a5a43','#c9a98a','#5a3424','#7a4a35'],moonfin:['#8aa0bf','#b9c8dc','#e6eef5','#7088a8','#8fd3ff']};
export function fishArt(c,id,cook=null,scale=1){const {p,r,e}=painter(c);let [back,body,belly,mark,fin]=FISH_COLORS[id]||FISH_COLORS.perch;
 if(cook!==null){const t=cook<.55?cook/.55*.55:cook<.84?.55+(cook-.55)/.29*.45:1,burn=Math.max(0,(cook-.84)/.16);const tone=(col)=>mix(mix(col,'#c08a46',Math.min(1,t)),'#2a2220',Math.min(1,burn));back=tone(back);body=tone(body);belly=tone(belly);mark=tone(mark);fin=tone(fin);}
 const s=scale,P=pts=>pts.map(([x,y])=>[x*s,y*s]);
 p(P([[-13,0],[-9,-4.5],[0,-6],[8,-4.5],[13,-1],[13,1.5],[8,5],[0,6],[-9,4.5]]),EDGE);p(P([[-13,0],[-18,-6],[-16.5,0],[-18,6]]),EDGE);
 p(P([[-12,0],[-9,-3.8],[0,-5],[8,-3.8],[12,-.5],[12,1],[8,4],[0,5],[-9,3.8]]),body);p(P([[-12,0],[-9,-3.8],[0,-5],[8,-3.8],[11,-1.5],[0,-2.2],[-9,-1.5]]),back);p(P([[-9,2],[0,2.8],[8,2.5],[11,1.2],[8,4],[0,5],[-9,3.8]]),belly);
 p(P([[-12.5,0],[-17,-5],[-15.5,0],[-17,5]]),fin);p(P([[-4,-5],[2,-8.5],[5,-5]]),EDGE);p(P([[-3,-5],[2,-7.5],[4,-5]]),fin);
 if(id==='perch')for(const x of [-6,-2,2,6])r(x*s,-4*s,1*s,6*s,mark);
 if(id==='mackerel')for(let x=-8;x<8;x+=3)r(x*s,(-4+(x%2?1:0))*s,2*s,1*s,mark);
 if(id==='cod')for(const [x,y] of [[-6,-2],[-2,-3],[3,-1.5],[6,-3],[-4,1]])r(x*s,y*s,1.5*s,1*s,mark);
 if(id==='moonfin'&&cook===null){r(-4*s,-1*s,12*s,.5*s,'#d9f3ff');p(P([[-12.5,0],[-17,-5],[-15.5,0],[-17,5]]),'#8fd3ffcc');}
 r(8*s,-2*s,2*s,2*s,'#14161a');r(8.5*s,-2*s,.6*s,.6*s,'#e8e0d1');r(10.5*s,1*s,2*s,.5*s,mark);}
export {box,W,CV,M,R,RUST,GLASS,GLASS_HI,TEAL,TEAL_HI};
export const CAMP_KINDS=Object.keys(ART);
