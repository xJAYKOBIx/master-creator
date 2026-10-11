// Street props: parked cars and a police cruiser (crashed, with its light bar turning), utility poles, dark street lamps, fire
// hydrants, whole houses, trees and pines, stop signs, trash bins, sheds, and wooden and chain-link fences. Same conventions as
// the other sets: footprint top left at (0, 0), height rising into negative y. Cars lie along the road (length w, depth h) and
// face right; the near side is the one you see. Kinds this file does not draw fall back to the house props.
import {painter,hash2 as hash} from '../core/paint.js';
import {EDGE,SHADOW,PROP_PAD} from './camp.js';
import {propArt as homePropArt,HOME_ART} from './home.js';
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
  r(cx-6,t+6,12,3.5,EDGE);r(cx-5.5,t+6.5,11,2.5,R[1]);r(cx-5.5,t+6.5,11,.5,R[2]);r(cx-1,t+7,2,1.5,'#c9a24a');r(cx-3,t-.5,6,3,EDGE);r(cx-2.5,t,5,2,R[2]);r(cx-1,t-1.5,2,1.5,EDGE);r(cx-.5,t-1,1,1,R[2]);},
 // A whole house as you see it from the street: the roof running back from the eave, a chimney if it has one, and the front wall
 // built from the house set's own siding, windows and front door, with a garage door if it has one. o.w is the width, o.h the depth
 // from the back of the roof to the face of the front wall, o.z the wall height; windows are [from, to] pairs and door the door's
 // left edge along the front; garage is [from, to]. paint is a siding colour (5 and up in the house set), roof 0 to 3.
 house(g,o){const {r}=g,w=o.w,h=o.h,z=o.z,T=12,R=ROOFS[o.roof|0]||ROOFS[0],eave=h-T-z+2,top=-z;
  // The roof: shingle rows, darker up toward the ridge, a light edge at the eave and its shadow on the wall.
  r(-2,top-.5,w+4,eave-top+2.5,INK);
  for(let y=top,k=0;y<eave;y+=5,k++){const hy=Math.min(5,eave-y),col=R[Math.min(3,Math.floor((y-top)/(eave-top)*4))];r(0,y,w,hy,col);if(hy===5)r(0,y+4.5,w,.5,R[0]);for(let x=(k%2)*6;x<w;x+=12)r(x,y,.5,Math.max(0,hy-.5),R[0]);}
  // A hip roof: the ridge a third of the way back, the far slope in shade, the hips at the ends lit from the left and shaded right.
  const yr=top+Math.round((eave-top)*.34),ins=Math.min(Math.round((eave-top)*.62),Math.round(w*.3)),{p,l}=g;
  p([[0,top],[w,top],[w-ins,yr],[ins,yr]],'#00000038');p([[w,top],[w,eave],[w-ins,yr]],'#00000028');p([[0,top],[0,eave],[ins,yr]],'#ffffff0c');
  l(0,eave,ins,yr,1,R[0]);l(w,eave,w-ins,yr,1,R[0]);l(0,top,ins,yr,.5,R[0]);l(w,top,w-ins,yr,.5,R[0]);r(ins,yr-.5,w-ins*2,1,R[0]);r(ins,yr+.5,w-ins*2,.5,R[3]);
  r(0,eave-1.5,w,1.5,R[3]);r(0,eave,w,2,'#0d0e11');
  if(o.chimney!=null){const cx=o.chimney,cy=top+Math.round((eave-top)*.28);r(cx-.5,cy-14.5,15,21,INK);r(cx,cy-14,14,5,'#4a3a34');r(cx,cy-14,14,.5,'#5e4a42');r(cx,cy-9,14,14.5,'#3a2a24');for(let y=cy-6;y<cy+5;y+=3)r(cx,y,14,.5,'#2a1e1a');r(cx+3,cy-13,8,3,'#1a1412');}
  // The front wall, piece by piece: siding between the openings.
  const gaps=[...(o.windows||[]).map(([a,b])=>[a,b,'window']),...(o.door!=null?[[o.door,o.door+34,'frontdoor']]:[]),...(o.garage?[[o.garage[0],o.garage[1],'garage']]:[])].sort((a,b)=>a[0]-b[0]);
  const piece=(a,b,kind,k)=>{const q=at(g,a,h-T),pc={kind:kind==='garage'?'wall':kind,w:b-a,h:T,z,paint:o.paint??5,x:(o.x||0)+a,y:(o.y||0)+h-T,curtain:k%2};HOME_ART[pc.kind](q,pc);if(kind==='garage')garageDoor(q,b-a,T,z);};
  let cur=0,k=0;for(const [a,b,kind] of gaps){if(a>cur)piece(cur,a,'wall',k++);piece(a,b,kind,k++);cur=b;}if(w>cur)piece(cur,w,'wall',k);},
 // A tree: a trunk and a round, lumpy canopy, lit from the top left by the moon. w is the canopy's width, h the trunk's depth and z
 // the height to the top of the leaves; seed changes the shape.
 tree(g,o){const {r,e}=g,w=o.w,h=o.h,z=o.z,s=o.seed|0,cx=w/2,R=w/2,cy=-z+R*.95,L=['#0f1a12','#16261a','#1f3322','#2a432c','#385636'],B=['#1e1712','#2e231a','#3d2f22'];
  e(cx,h-1,R*.75,R*.22,SHADOW);r(cx-3.5,cy,7,h-cy-1,EDGE);r(cx-3,cy,6,h-cy-1.5,B[1]);r(cx-3,cy,2,h-cy-1.5,B[2]);r(cx+1.5,cy,1.5,h-cy-1.5,B[0]);e(cx,h-1.5,5,2,EDGE);e(cx,h-1.5,4.5,1.5,B[1]);
  const n=6+(s%3),blobs=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2+hash(s,i)*.6,d=R*(.42+hash(i,s)*.12);blobs.push([cx+Math.cos(a)*d,cy+Math.sin(a)*d*.8,R*(.42+hash(s+i,3)*.12)]);}blobs.push([cx,cy,R*.6]);
  for(const [x,y,q] of blobs)e(x,y,q+1,q*.9+1,EDGE);for(const [x,y,q] of blobs)e(x,y,q,q*.9,L[1]);for(const [x,y,q] of blobs)e(x-q*.12,y-q*.15,q*.78,q*.68,L[2]);
  for(const [x,y,q] of blobs)if(y<cy+R*.1)e(x-q*.25,y-q*.3,q*.5,q*.4,L[3]);for(const [x,y,q] of blobs)if(y<cy-R*.1&&x<cx+R*.2)e(x-q*.35,y-q*.4,q*.24,q*.18,L[4]);
  for(let i=0;i<w*1.4;i++){const a=hash(i,s+5)*Math.PI*2,d=Math.sqrt(hash(s+9,i))*R*.85,x=cx+Math.cos(a)*d,y=cy+Math.sin(a)*d*.8;r(x,y,.5,.5,y<cy?L[3+(i%2)]:L[i%2]);}},
 // A pine: tiers of needles stacked on a short trunk, the top tier drawn last.
 pine(g,o){const {r,e,p,l}=g,w=o.w,h=o.h,z=o.z,s=o.seed|0,cx=w/2,L=['#0e1a12','#16281c','#203826','#2c4a32','#3a5e40'],B=['#1e1712','#2e231a'];e(cx,h-1,w*.36,3,SHADOW);r(cx-2,h-16,4,15,EDGE);r(cx-1.5,h-15.5,3,14.5,B[1]);
  const tiers=4+(s%2),top=-z,bot=h-12;for(let i=tiers-1;i>=0;i--){const k=i/(tiers-1),y0=top+(bot-top)*k*.74,y1=y0+(bot-top)*.32,hw=w/2*(.32+.68*k),j=(hash(s,i)-.5)*3;
   p([[cx+j,y0-1.5],[cx+hw+1.5,y1+1],[cx-hw-1.5,y1+1]],EDGE);p([[cx+j,y0],[cx+hw,y1],[cx-hw,y1]],L[1]);p([[cx+j,y0],[cx-hw*.1,y1-1],[cx-hw,y1]],L[2]);p([[cx+j-.5,y0+3],[cx-hw*.35,y1-3],[cx-hw*.75,y1-1]],L[3]);l(cx+j,y0+.5,cx-hw+1,y1-.5,.5,L[4]);r(cx-hw+1,y1-.5,hw*2-2,1,L[0]);}},
 // A stop sign on its post.
 stopsign(g,o){const {r,p,e}=g,w=o.w,h=o.h,z=o.z,cx=w/2,cy=-z+8,oct=q=>Array.from({length:8},(_,i)=>{const a=(i+.5)/8*Math.PI*2;return [cx+Math.cos(a)*q,cy+Math.sin(a)*q];});
  e(cx,h-1,4,1.5,SHADOW);r(cx-1.5,cy,3,h-cy-1,EDGE);r(cx-1,cy,2,h-cy-1.5,'#5c6168');r(cx-1,cy,.5,h-cy-1.5,'#8e939b');
  p(oct(8.5),EDGE);p(oct(8),'#c8c2b6');p(oct(7),'#7a1a1a');p(oct(6),'#9a2622');r(cx-4,cy-.75,8,1.5,'#c8c2b6');r(cx-5,cy-4,3,1,'#b03a30');},
 // A wheeled trash bin out at the curb: green, grey or blue by paint.
 bin(g,o){const {r,e}=g,w=o.w,h=o.h,z=o.z,P=BINS[o.paint|0]||BINS[0];e(w/2,h,w/2+1.5,2,SHADOW);r(-.5,-z-.5,w+1,h+z+1,EDGE);r(0,-z,w,h,P[2]);r(0,-z,w,.5,P[3]);r(0,h-z-1,w,1,P[0]);
  r(.5,h-z,w-1,z-1,P[1]);r(.5,h-z,w-1,.5,P[2]);r(2.5,h-z+3,.5,z-6,P[0]);r(w-3,h-z+3,.5,z-6,P[0]);r(-1,h-z-1,w+2,2.5,EDGE);r(-.5,h-z-.5,w+1,1.5,P[2]);r(w/2-2,h-z+1.5,4,1,P[0]);e(2,h-1,1.5,1.5,'#0c0d10');e(w-2,h-1,1.5,1.5,'#0c0d10');},
 // A survivor's stash: an olive ammo can and a duffel bag, half under a tarp weighted with a brick, and a strip of orange flagging
 // tape tied to the can's handle so whoever left it could find it again in the dark.
 cache(g,o){const {r,p,e}=g,w=o.w,h=o.h,z=o.z,T=['#1e2619','#2b3623','#3a482f','#4b5b3c'],A=['#22281a','#323b25','#435033','#56653f'],D=['#141a26','#1f2838','#2c384c'];e(w/2,h-1,w/2+2,3,SHADOW);
  // The duffel along the back, its strap over the top.
  r(1,h-z-3.5,w-8,z-1,EDGE);r(1.5,h-z-3,w-9,z-2,D[1]);r(1.5,h-z-3,w-9,1,D[2]);r(1.5,h-5,w-9,1,D[0]);r(6,h-z-3,1,z-2,D[0]);r(w-11,h-z-3,1,z-2,D[0]);
  // The tarp over the left of it, its folds and the brick on its corner.
  p([[-1,h-z-1],[w*.55,h-z-2.5],[w*.62,h+.5],[-1.5,h+.5]],EDGE);p([[-.5,h-z-.5],[w*.55-.5,h-z-2],[w*.6-.5,h],[-1,h]],T[1]);p([[-.5,h-z-.5],[w*.55-.5,h-z-2],[w*.55-.5,h-z-1],[-.5,h-z+.5]],T[3]);
  r(3,h-z+1,.5,z-1,T[0]);r(8,h-z,.5,z,T[0]);r(5,h-z+1,1,z-2,T[2]);r(1,h-3,4,2.5,EDGE);r(1.5,h-2.5,3,1.5,'#7a3a2a');r(1.5,h-2.5,3,.5,'#9a5040');
  // The ammo can: a lid with its latch and handle, a stencil on the side.
  const x=w-11,yt=h-z-1;r(x-.5,yt-.5,11,z+1.5,EDGE);r(x,yt,10,3,A[2]);r(x,yt,10,.5,A[3]);r(x,yt+3,10,z-2.5,A[1]);r(x,yt+3,10,.5,A[2]);r(x,h-1,10,.5,A[0]);
  r(x+3,yt+.5,4,1,A[0]);r(x+3.5,yt+.5,3,.5,'#6b7a52');r(x+.5,yt+2.5,1,1.5,A[0]);r(x+2,yt+5,6,.5,'#c9b45a');r(x+2,yt+6,4,.5,'#c9b45a');
  r(x+4,yt-1.5,1,2,'#d0702e');r(x+4.5,yt-1,2.5,1,'#e8904a');r(x+6.5,yt-.5,1,5,'#d0702e');r(x+7.5,yt+3.5,1,2.5,'#e8904a');},
 // A portable generator on its frame: a yellow tank and engine block, a black tube frame, two wheels and the pull cord. on starts it:
 // the panel light goes green and smoke puffs from the exhaust.
 generator(g,o){const {r,e,p}=g,w=o.w,h=o.h,z=o.z,Y=['#7a5a10','#b08a1c','#d8b030','#f0d060'],F=['#141518','#26282c','#3a3d42'],t=h-z;e(w/2,h,w/2+2,2.5,SHADOW);
  // The frame: two loops of tube round the whole thing.
  r(-.5,t-.5,w+1,z+1,EDGE);r(0,t,w,z,F[1]);r(0,t,w,.5,F[2]);r(1.5,t+1.5,w-3,z-3,F[0]);
  // The tank on top and the engine below it, the panel with its sockets and light, the recoil starter and its cord.
  r(2,t+1,w-4,h-2-t-z*.45,EDGE);r(2.5,t+1.5,w-5,h-3-t-z*.45,Y[2]);r(2.5,t+1.5,w-5,1,Y[3]);r(w/2-2,t-.5,4,2,EDGE);r(w/2-1.5,t,3,1,F[2]);
  const ey=t+z*.55;r(2,ey,w*.55,h-ey-2,EDGE);r(2.5,ey+.5,w*.55-1,h-ey-3,Y[1]);r(3,ey+1.5,w*.55-2,.5,Y[0]);r(3,ey+3,w*.55-2,.5,Y[0]);
  e(w*.3,ey+(h-ey)/2-1,2.5,2.5,EDGE);e(w*.3,ey+(h-ey)/2-1,1.8,1.8,F[2]);r(w*.3-.25,ey+(h-ey)/2-1,3.5,.5,'#c84a2a');
  r(w*.62,ey,w*.38-2,h-ey-2,EDGE);r(w*.62+.5,ey+.5,w*.38-3,h-ey-3,F[2]);r(w*.62+1.5,ey+1.5,1.5,1.5,F[0]);r(w*.62+4,ey+1.5,1.5,1.5,F[0]);r(w-4.5,ey+1.5,1.5,1.5,o.on?'#7aff7a':'#2a3a2a');if(o.on)r(w-5,ey+1,2.5,2.5,'#7aff7a40');
  e(3,h-.5,2.5,2.5,EDGE);e(3,h-.5,1.8,1.8,'#0c0d10');e(w-3,h-.5,2.5,2.5,EDGE);e(w-3,h-.5,1.8,1.8,'#0c0d10');
  // The exhaust on the side, and its smoke when running.
  r(w-1,ey-2,2.5,1.5,EDGE);r(w-.5,ey-1.5,1.5,.5,F[2]);if(o.on)for(const [x,y,s] of [[w+2,ey-5,1.5],[w+4,ey-9,2],[w+3,ey-14,2.5]])e(x,y,s,s*.8,'#8a8a8a60');},
 // A work light on a tripod: three legs, a pole and a square lamp head angled down. on lights the face.
 floodlight(g,o){const {r,e,l}=g,w=o.w,h=o.h,z=o.z,cx=w/2,F=['#1e2024','#33363b','#55585e'];e(cx,h-1,7,2.5,SHADOW);
  for(const dx of [-6,0,6])l(cx,h-14,cx+dx,h-(dx?0:2),1.5,EDGE);for(const dx of [-6,6])l(cx,h-14,cx+dx,h,.75,F[2]);
  r(cx-1.5,-z+6,3,z+h-18,EDGE);r(cx-1,-z+6.5,2,z+h-19,F[1]);r(cx-1,-z+6.5,.5,z+h-19,F[2]);
  r(cx-6.5,-z-.5,13,9,EDGE);r(cx-6,-z,12,8,F[1]);r(cx-5,-z+1,10,6,o.on?'#fff6d8':'#2a2c30');if(o.on){r(cx-5,-z+1,10,1,'#ffffff');r(cx-4,-z+3,3,2,'#fffbe8');}r(cx-6,-z,12,.5,F[2]);},
 // An evacuation truck: an olive cargo truck with a canvas cover over the back, the cab on the right. Like the cars, w is its length,
 // h its depth and z its height to the top of the canvas. open drops the tailgate and ties back the canvas so you can climb in.
 truck(g,o){const {r,p,e,l}=g,L=o.w,D=o.h,Z=o.z,O=['#1e2416','#2c3420','#3c462c','#4e5a3a'],C=['#2a2a1e','#3e3e2c','#525038','#66634a'],H0=8,cab=Math.round(L*.27),cx0=L-cab,Hb=Math.round(Z*.46),Hc=Math.round(Z*.84);
  e(L/2,D-1,L/2+6,6,SHADOW);r(4,D-H0-1,L-8,H0+1,'#0a0b0d');
  // The cargo bed: the floor, the sides, and the canvas cover arching over it on its hoops.
  r(-.5,-Hb-.5,cx0-1,D+Hb-H0+1,EDGE);r(0,-Hb+1,cx0-2,D-2,O[2]);r(0,D-Hb,cx0-2,Hb-H0,O[1]);r(0,D-Hb,cx0-2,1,O[3]);r(0,D-H0-3,cx0-2,2.5,O[0]);
  p([[1,-Z+4],[cx0-3,-Z+4],[cx0-3,D-Hb],[1,D-Hb]],EDGE);p([[1.5,-Z+4.5],[cx0-3.5,-Z+4.5],[cx0-3.5,D-Hb-.5],[1.5,D-Hb-.5]],C[1]);r(1.5,-Z+4.5,cx0-5,D-8,C[2]);r(1.5,-Z+4.5,cx0-5,1,C[3]);
  for(let x=14;x<cx0-8;x+=22){r(x,-Z+5,1,D-7,C[1]);r(x,D-Z+2,1,Z-Hb-6,C[0]);}r(1.5,D-Hb-3,cx0-5,1,C[0]);
  // The tailgate on the left: down and open, or up with the canvas flap shut.
  if(o.open){r(-9,D-Hb+2,9,Hb-H0-2,EDGE);r(-8.5,D-Hb+2.5,8,Hb-H0-3,O[1]);r(-8.5,D-Hb+2.5,8,1,O[3]);p([[1.5,D-Z+2],[8,D-Z+2],[4,D-Hb-1],[1.5,D-Hb-1]],'#0a0b0d');r(-2,D-Hb-2,4,3,'#6a5a3a');}
  else{r(-1,D-Z+2,3,Z-Hb,C[0]);r(-1,D-Hb,3,Hb-H0,O[0]);}
  // The cab: hood and roof from the top, the door and window on the near side, the grille and a headlight on the front.
  r(cx0-1.5,-Hc-.5,cab*.55+2,D+Hc-H0+1,EDGE);r(cx0-1.5,-Hb-.5,cab+2,D+Hb-H0+1,EDGE);r(cx0-1,-Hb+1,cab+1,D-2,O[2]);r(cx0-1,D-Hb,cab+1,Hb-H0,O[1]);r(cx0-1,D-Hb,cab+1,1,O[3]);r(cx0-1,D-H0-3,cab+1,2.5,O[0]);
  r(cx0,-Hc,cab*.55,D-4,O[3]);r(cx0,-Hc,cab*.55,1,'#62704a');r(cx0-1,D-Hc,cab*.55+1,Hc-Hb,O[2]);r(cx0-1,D-Hc,cab*.55+1,1,O[3]);r(cx0+2,D-Hc+3,cab*.55-5,(Hc-Hb)*.6,EDGE);r(cx0+2.5,D-Hc+3.5,cab*.55-6,(Hc-Hb)*.6-1,'#1a2430');r(cx0+3,D-Hc+4,3,(Hc-Hb)*.6-2,'#2c3c4c');p([[cx0+cab*.55,D-Hc],[cx0+cab*.55+5,D-Hb],[cx0+cab*.55,D-Hb]],O[1]);
  r(cx0+2,D-Hb+3,cab*.55-4,Hb-H0-7,O[2]);r(cx0+cab*.55-5,D-Hb+8,3,1,'#9aa0a6');r(L-3,D-Hb+1,3,Hb-H0-3,EDGE);for(let y=D-Hb+2;y<D-H0-3;y+=2)r(L-2.5,y,2,.5,'#55585e');r(L-1,-Hb+3,1.5,4,'#e8e2c4');r(L-3,D-Hb+1,2.5,3,'#e8e2c4');
  // A white star on the door, and the big wheels: two at the back, one at the front.
  r(cx0+cab*.2,D-Hb+6,3,3,'#d8d6cf');for(const x of [L*.12,L*.3,L-cab*.45]){e(x,D-H0-3,10,7,'#0a0b0d');e(x,D-7,8.5,8,EDGE);e(x,D-7,8,7.5,'#0c0d10');e(x,D-7,4,3.8,'#3a3d42');e(x,D-7,1.5,1.4,'#1e2024');}
  l(cx0-2,-Hb+2,cx0-2,D-H0-2,1,O[0]);},
 // A garden shed: a tin roof with its ridge along the length, plank walls and double doors.
 shed(g,o){const {r,l}=g,w=o.w,h=o.h,z=o.z,zf=Math.round(z*.72),yb=-zf,yr=Math.round(h/2-z),yf=h-zf,W=['#231e1a','#322a24','#40362d','#4e4236'],R=['#1e2024','#2a2d33','#363a42','#454952'];
  r(-1.5,Math.min(yb,yr)-1,w+3,yf-Math.min(yb,yr)+2,EDGE);if(yr>yb)r(-1,yb,w+2,yr-yb,R[1]);r(-1,yr,w+2,yf-yr,R[2]);for(let x=1;x<w;x+=3){r(x,yr,.5,yf-yr,R[1]);r(x+1,yr,.5,yf-yr,R[3]);}r(-1,yr-.5,w+2,1.5,R[3]);r(-1,yf,w+2,1.5,'#0d0e11');
  r(-.5,yf+1,w+1,h-yf-.5,EDGE);r(0,yf+1.5,w,h-yf-2,W[1]);for(let x=2;x<w;x+=5){r(x,yf+1.5,.5,h-yf-2,W[0]);if(hash(x+(o.x|0),5)>.6)r(x+1,yf+2,1,h-yf-3,W[2]);}
  const dx=Math.round(w/2-12),dt=h-28;r(dx-.5,dt-.5,25,h-dt,EDGE);r(dx,dt,24,h-dt-.5,W[2]);r(dx+11.75,dt,.5,h-dt-.5,W[0]);l(dx+1,dt+1,dx+11,h-2,1,W[1]);l(dx+13,h-2,dx+23,dt+1,1,W[1]);r(dx+9,dt+12,1.5,2,'#8a8e94');r(dx+13.5,dt+12,1.5,2,'#8a8e94');
  r(5,yf+8,10,7,EDGE);r(5.5,yf+8.5,9,6,'#141b27');r(6,yf+9,3,2,'#2a3c55');},
 // A wooden privacy fence along its length (woodfence) or running away from you (woodfenceV): planks, a rail and posts. Each throws a
 // shadow along its foot and has a post at both ends, so where a fence stops and a gap starts reads even in the dark.
 woodfence(g,o){const {r}=g,w=o.w,h=o.h,z=o.z;r(-1,h,w+2,3,SHADOW);r(-.5,-z-.5,w+1,h+z+1,EDGE);r(0,-z,w,h,PLANK[2]);r(0,-z,w,.5,PLANK[3]);r(0,h-z,w,z-.5,PLANK[1]);
  for(let x=0;x<w;x+=5){const v=hash((x+(o.x|0))|0,(o.y|0)+3);r(x,h-z+(v>.8?1:0),.5,z-1,PLANK[0]);if(v<.3)r(x+1,h-z+1,1.5,z-2,PLANK[2]);}r(0,h-z+5,w,1,PLANK[0]);r(0,h-7,w,1,PLANK[0]);
  for(const x of [...Array(Math.floor(w/48)+1).keys()].map(k=>Math.min(k*48,w-2)).concat(w-2)){r(x-1,-z-1.5,4,h+z+1.5,EDGE);r(x-.5,-z-1,3,h+z,PLANK[2]);r(x-.5,-z-1,3,.5,PLANK[3]);r(x+1.5,-z-1,.5,h+z,PLANK[0]);}},
 woodfenceV(g,o){const {r}=g,w=o.w,h=o.h,z=o.z;r(w,0,6,h,SHADOW);r(w,0,3,h,SHADOW);r(-.5,-z-.5,w+1,h+z+1,EDGE);r(0,-z,w,h,PLANK[3]);for(let y=-z+2;y<h-z;y+=5)r(.5,y,w-1,.5,PLANK[2]);r(0,-z,.5,h,'#665645');r(w-.5,-z,.5,h,PLANK[1]);
  r(0,h-z,w,z-.5,PLANK[1]);r(0,h-z,w,.5,PLANK[3]);for(let x=1;x<w;x+=2)r(x,h-z+1,.5,z-2,PLANK[0]);
  // Posts stand proud of the boards every so often and at both ends.
  for(const y of [...Array(Math.floor(h/32)+1).keys()].map(k=>Math.min(k*32,h-3)).concat(h-3)){r(-2,y-z-.5,w+4,4,EDGE);r(-1.5,y-z,w+3,3,PLANK[2]);r(-1.5,y-z,w+3,.5,'#665645');}},
 // A chain-link fence: you see through the mesh to what is behind it. Posts, a top rail and a sagging bottom wire.
 chainlink(g,o){const {r}=g,w=o.w,h=o.h,z=o.z,S=['#3b3e43','#6c7179','#8e939b'];r(0,h,w,2,SHADOW);for(let y=h-z+2;y<h-.5;y+=2)for(let x=((y-h+z)/2|0)%2;x<w;x+=2)r(x,y,.5,.5,'#6c717970');
  r(0,h-z-.5,w,1.5,EDGE);r(0,h-z,w,.5,S[2]);r(0,h-1,w,.5,S[0]);for(let x=0;x<=w;x+=40){const px=Math.min(x,w-1.5);r(px-.5,h-z-1.5,2.5,z+1.5,EDGE);r(px,h-z-1,1.5,z,S[1]);r(px,h-z-1,.5,z,S[2]);}}};
// What the house and the fences are made of, and the garage door the house draws into its front wall.
const ROOFS=[['#1c1e23','#24272d','#2c3037','#363a42'],['#201812','#2c2219','#382c21','#45372a'],['#181c24','#20262f','#29303b','#333b48'],['#16201a','#1e2a22','#27352b','#314034']];
const PLANK=['#241e19','#332a22','#42372c','#524537'],BINS=[['#10201a','#1a3226','#244434','#2e5440'],['#202226','#30333a','#40444b','#50555c'],['#141c28','#1e2a3c','#2a3a52','#364a66']],INK='#111319';
const at=(g,dx,dy)=>({r:(x,y,w,h,c)=>g.r(x+dx,y+dy,w,h,c),p:(pts,c)=>g.p(pts.map(([x,y])=>[x+dx,y+dy]),c),e:(x,y,rx,ry,c)=>g.e(x+dx,y+dy,rx,ry,c),l:(x1,y1,x2,y2,w,c)=>g.l(x1+dx,y1+dy,x2+dx,y2+dy,w,c)});
function garageDoor(g,w,h,z){const {r}=g,t=h-40,x0=4,x1=w-4;r(x0-.5,t-.5,x1-x0+1,40.5,EDGE);r(x0,t,x1-x0,40,'#3a3d42');for(let y=t+7;y<h;y+=8){r(x0,y,x1-x0,.5,'#26282c');r(x0,y+.5,x1-x0,.5,'#4c5056');}for(let x=x0+6;x<x1-5;x+=10)r(x,t+2,6,3,'#141b27');r(x0,t,x1-x0,.5,'#55585e');r((x0+x1)/2-3,h-6,6,1,'#8a8e94');}
export function propArt(c,o){if(!STREET_ART[o.kind])return homePropArt(c,o);c.save();c.scale(2,2);c.translate(PROP_PAD,o.z+PROP_PAD);STREET_ART[o.kind](painter(c),o);c.restore();}
export const STREET_KINDS=Object.keys(STREET_ART);
export {PROP_PAD};
