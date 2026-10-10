// Street props: parked cars and a police cruiser (crashed, with its light bar turning), utility poles, dark street lamps and
// fire hydrants. Same conventions as the other sets: footprint top left at (0, 0), height rising into negative y. Cars lie
// along the road (length w, depth h) and face right; the near side is the one you see. Kinds this file does not draw fall
// back to the house props.
import {painter,hash2 as hash} from '../core/paint.js';
import {EDGE,SHADOW,PROP_PAD} from './camp.js';
import {propArt as homePropArt} from './home.js';
// Car paint, dark to light: maroon, slate blue, silver, forest green, tan. The cruiser has its own black and white.
export const CAR_PAINTS=[['#3a1a1c','#5a2a2c','#753a3a','#8e4f4c'],['#1c2633','#2c3b4e','#3e5168','#566c86'],['#4a4e54','#6c7179','#8e939b','#b0b5bc'],['#16261c','#24382a','#344c3a','#486450'],['#4a3e2c','#6a5a40','#857258','#9e8a6c']];
const GLASS=['#0d1218','#1a2430','#2c3c4c'],TYRE='#0c0d10',HUB='#55585e',CHROME='#9aa0a6',LAMP='#e8e2c4',TAIL='#8a1c1c';
const POLICE=['#121317','#22242a','#d8d6cf','#f0eee8'];// black, black highlight, white, white highlight
// The shared car body, in the same view as the house props: the top of the body and the near side, with the glass cabin standing
// on it. The car is o.w long, o.h deep and o.z tall to the roof; the belt line sits at half that. P is [shade, body, top, highlight].
// Returns the measurements the cruiser draws its livery and damage with.
function carBody(g,o,P,{doors=P[1],doorsTop=P[2],roof=P[2]}={}){const {r,p,e,l}=g,L=o.w,D=o.h,Z=o.z,H0=5,Hb=Math.round(Z*.52),c0=Math.round(L*.27),c1=Math.round(L*.72),r0=c0+Math.round(L*.06),r1=c1-Math.round(L*.13),wx=[Math.round(L*.18),Math.round(L*.8)];
 e(L/2,D-1,L/2+4,5,SHADOW);r(2,D-H0-1,L-4,H0+1,'#0a0b0d');
 // The body: top (hood, trunk and the deck round the cabin) and near side, with rounded corners and a crease along the belt.
 p([[1,-Hb-.5],[L-1,-Hb-.5],[L+.5,-Hb+1],[L+.5,D-H0-1],[L-1,D-H0+.5],[1,D-H0+.5],[-.5,D-H0-1],[-.5,-Hb+1]],EDGE);
 r(0,-Hb+1,L,D-1,P[2]);r(1,-Hb,L-2,1,P[2]);r(1,-Hb,L-2,.5,P[3]);r(0,-Hb+1.5,.5,D-2,P[3]);
 r(0,D-Hb,L,Hb-H0,P[1]);r(0,D-Hb,L,1,P[3]);r(0,D-Hb+5,L,.5,P[0]);r(0,D-H0-3,L,2.5,P[0]);
 // The doors take their own colour (the cruiser's white), from just behind the rear pillar to the windscreen.
 if(doors!==P[1]){r(c0-2,D-Hb,c1-c0+4,Hb-H0-3,doors);r(c0-2,D-Hb,c1-c0+4,1,'#ffffff');r(c0-2,D-Hb+5,c1-c0+4,.5,P[0]);r(c0-2,-Hb+1,c1-c0+4,D-1,doorsTop);}
 // Lights on the ends: headlights and the grille on the right, tail lights on the left; the far ones show on the top.
 r(L-3,D-Hb+1.5,2.5,3,EDGE);r(L-2.5,D-Hb+2,2,2,LAMP);r(L-1.5,-Hb+3,1,4,LAMP);r(L-1.5,D-Hb-6,1,3,'#33363b');r(L-.5,D-Hb+6,1,4,CHROME);
 r(.5,D-Hb+1.5,2,3,EDGE);r(.5,D-Hb+2,1.5,2,TAIL);r(.5,-Hb+3,1,3,TAIL);r(-.5,D-Hb+6,1,4,'#33363b');
 // The cabin: roof, windscreen and rear window sloping down to the deck, and the near side glass between the pillars.
 const yt=5-Z,yb=D-5-Z,bt=5-Hb,bb=D-5-Hb;
 p([[r0-.5,yt-.5],[r1+.5,yt-.5],[c1+1,bt],[c1+1,bb+.5],[c0-1,bb+.5],[c0-1,bt]],EDGE);
 p([[r1,yt],[c1,bt],[c1,bb],[r1,yb]],GLASS[1]);p([[r1+1,yt+1],[r1+3,yt+2],[r1+3,yb-6],[r1+1,yb-8]],GLASS[2]);
 p([[r0,yt],[c0,bt],[c0,bb],[r0,yb]],GLASS[0]);p([[r0-1,yt+3],[r0-3,yt+5],[r0-3,yb-10],[r0-1,yb-12]],GLASS[1]);
 p([[c0,bb],[r0,yb],[r1,yb],[c1,bb]],GLASS[1]);p([[r0+6,yb+1],[r0+10,yb+1],[r0+4,bb-1],[r0,bb-1]],GLASS[2]);p([[r1-14,yb+1],[r1-12,yb+1],[r1-17,bb-1],[r1-19,bb-1]],GLASS[2]);
 l(c0,bb,r0,yb,1.5,P[0]);l(c1,bb,r1,yb,1.5,P[0]);
 const mid=Math.round((c0+c1)/2),ym=yb+(bb-yb)*0;p([[mid-1,yb],[mid+1,yb],[mid+1.5,bb],[mid-1.5,bb]],P[0]);
 r(r0,yt,r1-r0,yb-yt,roof);r(r0,yt,r1-r0,.5,P[3]);r(r0,yb-1,r1-r0,1,P[0]);
 // Near wheels in their arches, and the door seams and handles.
 for(const x of wx){e(x,D-H0-3,8,6,'#0a0b0d');e(x,D-6,7,6.5,EDGE);e(x,D-6,6.5,6,TYRE);e(x,D-6,3.5,3.25,HUB);e(x,D-6,1.5,1.4,'#33363b');r(x-2.5,D-9,2,.5,'#8a8e94');}
 r(mid-.25,D-Hb+1,.5,Hb-H0-4,P[0]);r(c0-2.5,D-Hb+1,.5,Hb-H0-4,P[0]);r(c1+1.5,D-Hb+1,.5,Hb-H0-4,P[0]);r(mid+3,D-Hb+3,3,1,CHROME);r(c0+1,D-Hb+3,3,1,CHROME);
 return {L,D,Z,H0,Hb,c0,c1,r0,r1,mid,yt,yb,bt,bb};}
export const STREET_ART={
 // A parked car, paint by index.
 car(g,o){carBody(g,o,CAR_PAINTS[o.paint|0]||CAR_PAINTS[0]);},
 // The cruiser: black hood and trunk, white doors and roof, a light bar across the roof. lit 0 is dark, 1 red, 2 blue. crashed
 // crumples the front and swings the near front door open; trunk opens the trunk lid.
 policecar(g,o){const {r,p,l}=g,m=carBody(g,o,[POLICE[0],POLICE[0],POLICE[1],'#3a3c44'],{doors:POLICE[2],doorsTop:POLICE[2],roof:POLICE[3]}),{L,D,Z,H0,Hb,c0,c1,mid,yt,yb,bb}=m;
  // Door badge, the stripe and a push bar on the front.
  r(c0+4,D-Hb+7,4,4,'#c9a24a');r(c0+5,D-Hb+8,2,2,'#e8c56a');r(mid+2,D-Hb+8,c1-mid-3,1.5,'#2a4a7a');r(c0,D-Hb+8,3,1.5,'#2a4a7a');
  if(!o.crashed){r(L,D-Hb+2,2.5,Hb-H0-3,EDGE);r(L+.5,D-Hb+2.5,1.5,Hb-H0-4,'#2a2c31');}
  // The light bar: a box across the roof, red on the far end and blue on the near; the lit one glows.
  const bw=8,bx0=mid-bw/2-1,h=4;r(bx0-.5,yt+1.5-h,bw+1,yb-yt-3+h+1,EDGE);const half=(yb-yt-3)/2;
  r(bx0,yt+2-h,bw,half,o.lit===1?'#ff4a4a':'#6a1e1e');r(bx0,yt+2-h+half,bw,half,o.lit===2?'#4a8aff':'#1e2e66');r(bx0,yb-1.5-h+.5,bw,h,'#26282c');r(bx0,yb-1.5-h+.5,bw,.5,'#3a3c44');
  if(o.lit===1){r(bx0+1,yt+3-h,3,half-2,'#ffd0d0');}if(o.lit===2){r(bx0+1,yt+3-h+half,3,half-2,'#d0e0ff');}
  if(o.trunk){// The trunk lid stands up off the back of the cabin; the boot under it is dark.
   r(3,-Hb+4,c0-8,D-12,'#0a0b0e');r(4,-Hb+5,c0-10,2,'#1e2026');
   p([[c0-2.5,-Hb+3],[c0-2.5,D-Hb-6],[c0-7,D-Hb-6-20],[c0-7,-Hb+3-20]],EDGE);p([[c0-3,-Hb+3.5],[c0-3,D-Hb-6.5],[c0-6.5,D-Hb-6.5-19],[c0-6.5,-Hb+3.5-19]],'#2a2c31');r(c0-6,-Hb-12,1,D-16,'#3a3c44');}
  if(o.crashed){// The front folds in: a jagged hood edge, the near headlight out, the bumper hanging, glass on the hood.
   const f=L-12;r(f,-Hb-.5,L-f+1,D-H0+Hb+1,'#3b3d42');
   p([[f-6,-Hb-.5],[L-3,-Hb+1],[L-1,-Hb+6],[L-4,-Hb+14],[L-2,-Hb+24],[L-5,D-Hb-2],[L-3,D-Hb+5],[L-6,D-H0],[f-6,D-H0+.5]],EDGE);
   p([[f-6,-Hb+.5],[L-3.5,-Hb+1.5],[L-1.5,-Hb+6],[L-4.5,-Hb+14],[L-2.5,-Hb+24],[L-5.5,D-Hb-2.5],[f-6,D-Hb-.5]],POLICE[0]);
   // The hood buckles up in a ridge across the car, lit on its front face.
   p([[f-4,-Hb+2],[f+1,-Hb+1.5],[f+3,D-Hb-2],[f-2,D-Hb-1.5]],'#3a3c44');l(f+1,-Hb+1.5,f+3,D-Hb-2,1,'#5a5d66');l(f-8,-Hb+8,f-4,-Hb+20,.5,'#3a3c44');
   p([[L-5.5,D-Hb+.5],[L-3,D-Hb+5],[L-6,D-H0-.5],[f-6,D-H0-.5],[f-6,D-Hb+.5]],POLICE[0]);l(f-4,D-Hb+2,L-6,D-Hb+8,.5,'#3a3c44');
   p([[L-6,D-Hb+5],[L+2,D-Hb+12],[L+1.5,D-Hb+14],[L-6.5,D-Hb+8]],EDGE);p([[L-6,D-Hb+5.5],[L+1.5,D-Hb+12.5],[L+1,D-Hb+13.5],[L-6.5,D-Hb+7.5]],CHROME);r(L-5.5,D-Hb+1.5,2,2,'#2a2a24');
   for(let i=0;i<7;i++)r(f-6+hash(i,7)*16,-Hb+3+hash(9,i)*(D-10),1,.5,'#cfe0ea');
   // The near front door hangs open toward you, hinged at the windscreen pillar; the seat shows through the gap.
   r(mid+1,D-Hb+.5,c1-mid,Hb-H0-4,'#0a0b0e');r(mid+2,D-Hb+3,c1-mid-3,4,'#3a2c20');r(mid+2,D-Hb+3,c1-mid-3,.5,'#55412f');p([[mid+1,bb],[c1,bb],[c1-2,bb-6],[mid+1,bb-6]],'#0a0b0e');
   const hx=c1+1,ox=hx-16,dy=26;p([[hx+.5,bb-7],[hx+.5,D-H0-3],[ox-.5,D-H0-3+dy],[ox-.5,bb-7+dy]],EDGE);
   p([[hx,D-Hb],[hx,D-H0-3.5],[ox,D-H0-3.5+dy],[ox,D-Hb+dy]],POLICE[2]);p([[hx,D-Hb],[hx,D-Hb+.5],[ox,D-Hb+.5+dy],[ox,D-Hb+dy]],'#ffffff');
   p([[hx,bb-6.5],[hx,D-Hb-.5],[ox,D-Hb-.5+dy],[ox,bb-6.5+dy]],GLASS[1]);r(ox+3,D-Hb+3+dy*.6,2,1,CHROME);}},
 // A wooden utility pole with a crossarm and three insulators. lean tips the top over by that many units (after a hit).
 pole(g,o){const {p,r,e}=g,w=o.w,h=o.h,z=o.z,ln=o.lean||0,cx=w/2,W=['#2a2018','#3d2e22','#55412f'];e(cx,h,w,2.5,SHADOW);
  p([[cx-2.5,h],[cx+2.5,h],[cx+2+ln,-z],[cx-2+ln,-z]],EDGE);p([[cx-2,h-.5],[cx+2,h-.5],[cx+1.5+ln,-z+.5],[cx-1.5+ln,-z+.5]],W[1]);p([[cx-2,h-.5],[cx-1,h-.5],[cx-.5+ln,-z+.5],[cx-1.5+ln,-z+.5]],W[2]);
  const ay=-z+8,ax=cx+ln*(1-8/(z+h));r(ax-12,ay-.5,24,3,EDGE);r(ax-11.5,ay,23,2,W[0]);r(ax-11.5,ay,23,.5,W[2]);for(const k of [-9,-1,8]){r(ax+k-.5,ay-2.5,2,2.5,EDGE);r(ax+k,ay-2,1,2,'#6f8a7a');}
  for(let i=0;i<4;i++)r(cx-1+hash(i,3)*2+ln*(i*.2+.5)*.5,h-6-i*14,1,.5,W[0]);},
 // A street lamp, dark with the power out: a grey post, an arm and a hooded head.
 streetlamp(g,o){const {r,e,p}=g,w=o.w,h=o.h,z=o.z,cx=w/2,M=['#26282c','#3b3e43','#55585e'];e(cx,h,6,2.5,SHADOW);r(cx-3.5,h-5.5,7,6,EDGE);r(cx-3,h-5,6,5,M[1]);r(cx-3,h-5,6,.5,M[2]);
  r(cx-2,-z,4,z+h-5,EDGE);r(cx-1.5,-z+.5,3,z+h-5.5,M[1]);r(cx-1.5,-z+.5,1,z+h-5.5,M[2]);r(cx+.5,-z+.5,1,z+h-5.5,M[0]);
  r(cx-1.5,-z-.5,18,3,EDGE);r(cx-1,-z,17,2,M[1]);r(cx-1,-z,17,.5,M[2]);p([[cx+11,-z-2.5],[cx+23,-z-2.5],[cx+25,-z+2.5],[cx+9,-z+2.5]],EDGE);p([[cx+11.5,-z-2],[cx+22.5,-z-2],[cx+24,-z+1],[cx+10,-z+1]],M[0]);r(cx+11,-z+1,12,1,'#4a4c44');},
 // A fire hydrant.
 hydrant(g,o){const {r,e}=g,w=o.w,h=o.h,z=o.z,cx=w/2,R=['#5a1414','#8a2222','#b03a30'],t=h-z;e(cx,h,6,2.5,SHADOW);r(cx-4,t+2,8,z-1.5,EDGE);r(cx-3.5,t+2.5,7,z-2.5,R[1]);r(cx-3.5,t+2.5,2,z-2.5,R[2]);r(cx+2,t+2.5,1.5,z-2.5,R[0]);r(cx-4.5,h-2.5,9,2.5,EDGE);r(cx-4,h-2,8,1.5,R[0]);
  r(cx-6,t+6,12,3.5,EDGE);r(cx-5.5,t+6.5,11,2.5,R[1]);r(cx-5.5,t+6.5,11,.5,R[2]);r(cx-1,t+7,2,1.5,'#c9a24a');r(cx-3,t-.5,6,3,EDGE);r(cx-2.5,t,5,2,R[2]);r(cx-1,t-1.5,2,1.5,EDGE);r(cx-.5,t-1,1,1,R[2]);}};
export function propArt(c,o){if(!STREET_ART[o.kind])return homePropArt(c,o);c.save();c.scale(2,2);c.translate(PROP_PAD,o.z+PROP_PAD);STREET_ART[o.kind](painter(c),o);c.restore();}
export const STREET_KINDS=Object.keys(STREET_ART);
export {PROP_PAD};
