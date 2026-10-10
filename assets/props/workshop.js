// Workshop props: a salvage yard and a tinkerer's workshop built from pallets, doors, tyres, sheet metal and plywood, plus the
// furniture inside (desks, servers, benches, shelves, cots). Same conventions as camp.js; kinds this file does not draw fall back
// to the camp props. Also the spray-paint block font and paint splats used for signs.
// Moved from Deadlight Hollow (grounds/art.js) unchanged.
import {painter,hash2 as hash,rgb} from '../core/paint.js';
import {box,EDGE,SHADOW,BONE,EMBER,EMBER_HI,W,M,R,RUST,GLASS,GLASS_HI,propArt as campPropArt,PROP_PAD} from './camp.js';
import {PAINT} from '../weapons/equipment.js';
import {drawBot} from '../characters/bots.js';
// Paint colors, gun by gun, and a dried-out version of each for old splats on the floor.
const PAINTS=Object.values(PAINT);
const fade=(h,k)=>{const [r,g,b]=rgb(h),m=(r+g+b)/3;return '#'+[r,g,b].map(v=>Math.round(v+(m-v)*k)*.62|0).map(v=>v.toString(16).padStart(2,'0')).join('');};
// A tiny block font for spray paint and signs: 3 to 5 pixels wide, 5 tall.
const FONT={A:['010','101','111','101','101'],B:['110','101','110','101','110'],C:['111','100','100','100','111'],D:['110','101','101','101','110'],E:['111','100','110','100','111'],F:['111','100','110','100','100'],G:['111','100','101','101','111'],H:['101','101','111','101','101'],I:['111','010','010','010','111'],K:['101','110','100','110','101'],L:['100','100','100','100','111'],M:['10001','11011','10101','10001','10001'],N:['1001','1101','1011','1001','1001'],O:['111','101','101','101','111'],P:['110','101','110','100','100'],R:['110','101','110','101','101'],S:['111','100','111','001','111'],T:['111','010','010','010','010'],U:['101','101','101','101','111'],V:['101','101','101','101','010'],W:['10001','10001','10101','11011','10001'],X:['101','101','010','101','101'],Y:['101','101','010','010','010'],'!':['1','1','1','0','1'],'-':['000','000','111','000','000'],' ':['00','00','00','00','00'],'0':['111','101','101','101','111'],'1':['01','11','01','01','01'],'2':['111','001','111','100','111'],'3':['111','001','111','001','111'],'4':['101','101','111','001','001'],'5':['111','100','111','001','111'],'6':['111','100','111','101','111'],'7':['111','001','010','010','010'],'8':['111','101','111','101','111'],'9':['111','101','111','001','111'],':':['0','1','0','1','0']};
export function text(g,s,x,y,px,col){let cx=x;for(const ch of s){const f=FONT[ch]||FONT[' '];for(let j=0;j<5;j++)for(let i=0;i<f[j].length;i++)if(f[j][i]==='1')g.r(cx+i*px,y+j*px,px,px,col);cx+=(f[0].length+1)*px;}return cx-x-px;}
export const textWidth=(s,px)=>[...s].reduce((n,ch)=>n+((FONT[ch]||FONT[' '])[0].length+1)*px,0)-px;
// A paint splat: a blob with a few droplets and a run or two.
export function splat(g,x,y,s,col,seed,flat=true){const {e,r}=g;e(x,y,s,s*(flat?.6:.9),col);for(let k=0;k<5;k++){const a=hash(seed,k)*6.28,d=s*(.7+hash(k,seed)*.7);e(x+Math.cos(a)*d,y+Math.sin(a)*d*(flat?.6:.9),.5+hash(seed+k,3)*s*.35,.4+hash(seed+k,4)*s*.25,col);}
 if(!flat)for(let k=0;k<2;k++)r(x-s*.4+hash(seed,9+k)*s*.8,y,.5,1+hash(seed,11+k)*s,col);}
const PLY=['#3d3226','#5a4a36','#7a6548','#937c5a','#a8916c'],OLIVE=['#232a1c','#323b27','#424d33','#56623f'];
const DOORS=[['#7d7a70','#9a968a','#b3afa2'],['#3b4a38','#4b5b45','#5f7058'],['#5a2e2a','#6a3530','#82443c'],['#33414f','#3d4f63','#4f6479'],['#5a4630','#6d5638','#856a46']];
const TIRE=['#141518','#1f2024','#2b2c31','#3a3b41'],BAG=['#3d372b','#4d4535','#655b45','#7d7257','#948a6c'];
// A block with its footprint's top left at (x, y), depth d and height z: top face, then the face toward you.
const blk=(g,x,y,w,d,z,top,front,hi='#ffffff22')=>{const {r}=g;r(x-.5,y-z-.5,w+1,d+z+1,EDGE);r(x+.5,y-z+.5,w-1,d-1,top);r(x+.5,y+d-z+.5,w-1,z-1,front);r(x+.5,y+d-z,w-1,.5,hi);};
const ring=(g,cx,cy,rx,ry,col,bg)=>{g.e(cx,cy,rx,ry,col);g.e(cx,cy,rx-.6,ry-.6,bg);};
// Where the little lights are, so the scene can blink them above the lighting.
export const DESK={T:26,crt:[13,-41,22,15],lcd:[48,-43,28,17],lap:[88,-36,20,11],cam:[120,-41,24,15]};
const SRV={F:-64};
export const SERVER_LEDS=[[6,SRV.F+17],[9,SRV.F+17],[12,SRV.F+17],[7,SRV.F+29],[24,SRV.F+29],...Array.from({length:14},(_,i)=>[5+i*3,SRV.F+61]),[23,SRV.F+51]];
const TG_ART={
 pallets(g,o){const {e,r}=g,w=o.w,h=o.h,z=o.z,n=Math.max(1,Math.round(w/40)),U=w/n;e(w/2,h,w/2+4,5,SHADOW);
  for(let i=0;i<n;i++){const x0=i*U,dz=Math.floor(hash(o.x+i,o.y)*3),top=-z+dz,F0=top+h,F1=h;
   // The top edges of two pallets standing back to back.
   r(x0,top,U,h,EDGE);r(x0+.5,top+.5,U-1,h-1,'#1d1712');for(const sx of [x0+2,x0+U/2-2,x0+U-6])r(sx,top+1,4,h-2,W[2]);for(const yy of [top+1,top+h-4]){r(x0+.5,yy,U-1,2.5,W[3]);r(x0+.5,yy,U-1,.5,W[4]);}
   // The deck facing you: slats over three stringers, a missing board here and there.
   r(x0,F0,U,F1-F0,EDGE);r(x0+.5,F0,U-1,F1-F0-.5,'#1a140f');for(const sx of [x0+2,x0+U/2-2,x0+U-6])r(sx,F0,4,F1-F0-.5,W[1]);
   const sh=(F1-F0-1)/5;for(let k=0;k<5;k++){if(hash(o.x+i*7,k)>.9)continue;const y=F0+.5+k*sh,col=[W[2],W[3],W[2]][(k+i)%3];r(x0+.5,y,U-1,sh-1.5,col);r(x0+.5,y,U-1,.5,W[4]);r(x0+2.5,y+1,.5,.5,'#2a2b2f');r(x0+U-3,y+1,.5,.5,'#2a2b2f');if(hash(k,i+o.y)>.7)r(x0+4+hash(k,i)*(U-12),y+sh*.4,4+hash(i,k)*6,.5,W[1]);}
   if(hash(i,o.x+o.y)>.55)splat(g,x0+6+hash(i,3)*(U-12),F0+5+hash(3,i)*(F1-F0-12),1.5+hash(i,4)*2,PAINTS[Math.floor(hash(i,o.y)*5)],i+o.x,false);}},
 palletsV(g,o){const {e,r}=g,w=o.w,h=o.h,z=o.z;e(w/2+2,h,w/2+6,4,SHADOW);r(-.5,-z-.5,w+1,h+z+1,EDGE);r(0,-z,w,h,'#1d1712');
  for(let y=-z+1;y<h-z-2;y+=8){r(.5,y,w-1,6,W[3]);r(.5,y,w-1,.5,W[4]);r(3,y+2,.5,.5,'#2a2b2f');}r(.5,-z+.5,2.5,h-1,W[2]);r(w-3,-z+.5,2.5,h-1,W[1]);
  r(.5,h-z,w-1,z-.5,'#1a140f');for(let k=0;k<5;k++){r(.5,h-z+1+k*6.5,w-1,5,k%2?W[2]:W[3]);r(.5,h-z+1+k*6.5,w-1,.5,W[4]);}r(w/2-2,h-z+1,4,z-2,W[1]);},
 doors(g,o){const {e,r}=g,w=o.w,h=o.h,z=o.z,n=Math.max(1,Math.round(w/72)),U=w/n;e(w/2,h,w/2+4,5,SHADOW);
  for(let i=0;i<n;i++){const x0=i*U,[c0,c1,c2]=DOORS[Math.floor(hash(o.x+i,o.y+3)*DOORS.length)],F0=h-z;
   // The top edge, and a 2x4 brace behind it.
   r(x0,-z,U,h,EDGE);r(x0+.5,-z+.5,U-1,3,c2);r(x0+.5,-z+3.5,U-1,h-4,'#1a1714');r(x0+4,-z+5,U-8,3,W[2]);r(x0+4,-z+5,U-8,.5,W[3]);
   r(x0,F0,U,z,EDGE);r(x0+.5,F0+.5,U-1,z-1,c1);r(x0+.5,F0+.5,U-1,1,c2);r(x0+.5,h-2,U-1,1.5,c0);
   // Six panels, the door lying on its side; a knob at one end, hinges at the other, paint peeling.
   const pw=(U-14)/3,ph=(z-10)/2-1;for(let k=0;k<3;k++)for(let j=0;j<2;j++){const px=x0+5+k*(pw+2),py=F0+4+j*(ph+2);r(px,py,pw,ph,c0);r(px+.5,py+.5,pw-1,ph-1,c1);r(px+.5,py+ph-1,pw-1,.5,c2);r(px+.5,py+.5,.5,ph-1,c2);}
   const left=hash(i,o.x)>.5,kx=left?x0+3.5:x0+U-5.5;e(kx,F0+z*.55,1.6,1.6,EDGE);e(kx,F0+z*.55-.3,1.1,1.1,'#c9a24a');for(const hy of [F0+5,h-8])r(left?x0+U-2.5:x0+1,hy,1.5,3,'#8a8f94');
   for(let k=0;k<4;k++){const px=x0+4+hash(k,o.x+i)*(U-10),py=F0+3+hash(o.y+i,k)*(z-8);r(px,py,2+hash(k,i)*4,1+hash(i,k)*1.5,c0);r(px+.5,py,1,.5,W[2]);}
   if(hash(o.y,i)>.5)splat(g,x0+10+hash(i,8)*(U-20),F0+8+hash(8,i)*(z-16),2+hash(i,9)*2,PAINTS[Math.floor(hash(o.x,i)*5)],i+o.y,false);}},
 sheet(g,o){const {e,r}=g,w=o.w,h=o.h,z=o.z,F0=h-z,posts=[2,w/2-2,w-6];e(w/2,h,w/2+4,5,SHADOW);
  for(const x of posts){r(x-.5,-z-4.5,5,z+h+4,EDGE);r(x,-z-4,4,z+h+3,W[2]);r(x,-z-4,1,z+h+3,W[3]);}
  r(0,-z,w,h,EDGE);r(.5,-z+.5,w-1,h-1,'#15171b');for(let x=1;x<w-1;x+=3)r(x,-z+.5,1.5,1,M[3]);
  r(0,F0,w,z,EDGE);for(let x=.5;x<w-.5;x+=3){r(x,F0+.5,1.5,z-1,M[2]);r(x+1.5,F0+.5,Math.min(1.5,w-.5-x-1.5),z-1,M[1]);}
  // Rust runs down from the bolts.
  for(let k=0;k<7;k++){const x=4+hash(k,o.x)*(w-10),y=F0+2+hash(o.y,k)*z*.4;r(x,y,1.5,z*.3+hash(k,9)*z*.4,RUST);r(x,y,.5,.5,'#c9874f');}
  for(const x of posts)for(const y of [F0+4,h-6]){r(x+1,y,1.5,1.5,'#1a1b1f');r(x+1,y,.5,.5,'#a9aeb3');}
  for(let k=0;k<3;k++)splat(g,6+hash(k,o.x+2)*(w-12),F0+5+hash(o.y+2,k)*(z-12),1.5+hash(k,6)*2,PAINTS[(k+Math.floor(o.y))%5],k+o.y,false);},
 plywood(g,o){const {e,r,l}=g,w=o.w,h=o.h,z=o.z,F0=h-z,n=Math.max(1,Math.round(w/46)),U=w/n;e(w/2,h,w/2+4,5,SHADOW);
  r(0,-z,w,h,EDGE);r(.5,-z+.5,w-1,h-1,'#1c1712');r(.5,-z+.5,w-1,2,PLY[4]);r(2,-z+3,w-4,h-5,W[2]);r(0,F0,w,z,EDGE);
  for(let i=0;i<n;i++){const x0=i*U+.5,uw=U-1;r(x0,F0+.5,uw,z-1,PLY[2+(i%2)]);r(x0,F0+.5,uw,.5,PLY[4]);r(x0+uw-.5,F0+.5,.5,z-1,PLY[1]);
   for(let k=0;k<6;k++){const y=F0+3+hash(k,o.x+i)*(z-6);r(x0+2,y,uw-4,.5,PLY[1]);r(x0+2+hash(i,k)*uw*.5,y+.5,uw*.3,.5,PLY[3]);}
   for(const nx of [x0+2,x0+uw-3])for(let y=F0+3;y<h-2;y+=9)r(nx,y,.5,.5,'#2a2b2f');}
  // Spray paint: a zombie to aim at, a big X, or the unit's name.
  const tag=Math.floor(hash(o.x,o.y)*3),cx=w/2,cy=F0+z/2,zz=Math.min(z,w*.9);
  if(tag===0){const col='#c96a2c';e(cx,cy-zz*.28,zz*.11,zz*.12,col);r(cx-zz*.12,cy-zz*.16,zz*.24,zz*.34,col);l(cx-zz*.1,cy-zz*.12,cx-zz*.32,cy-zz*.02,1.5,col);l(cx+zz*.1,cy-zz*.12,cx+zz*.3,cy-zz*.04,1.5,col);l(cx-zz*.06,cy+zz*.17,cx-zz*.1,cy+zz*.36,1.6,col);l(cx+zz*.06,cy+zz*.17,cx+zz*.1,cy+zz*.36,1.6,col);e(cx,cy-zz*.02,3,3,BONE);e(cx,cy-zz*.02,1.5,1.5,col);}
  else if(tag===1){l(cx-10,cy-10,cx+10,cy+10,2,'#b94a3a');l(cx-10,cy+10,cx+10,cy-10,2,'#b94a3a');}
  else{const s='LEET AF',tw=textWidth(s,1.5);r(cx-tw/2-2,cy-5,tw+4,10.5,'#1a1b1e');text(g,s,cx-tw/2,cy-3.5,1.5,'#d6d0c2');}
  for(let k=0;k<5;k++)splat(g,4+hash(k,o.x+5)*(w-8),F0+4+hash(o.y,k+5)*(z-10),1.5+hash(k,7)*2.5,PAINTS[(k+Math.floor(o.x))%5],k+o.x,false);},
 plywoodV(g,o){const {e,r}=g,w=o.w,h=o.h,z=o.z;e(w/2+3,h,w/2+6,4,SHADOW);r(-.5,-z-.5,w+1,h+z+1,EDGE);r(0,-z,w,h,'#1c1712');r(0,-z,2.5,h,PLY[4]);r(w-2.5,-z,2.5,h,PLY[3]);r(3,-z+1,w-6,h-2,W[2]);for(let y=-z+6;y<h-z;y+=16)r(3,y,w-6,2,W[3]);
  r(0,h-z,w,z,PLY[2]);r(0,h-z,w,.5,PLY[4]);r(w/2-.25,h-z,.5,z,PLY[1]);for(let y=h-z+4;y<h;y+=9)r(1.5,y,.5,.5,'#2a2b2f');splat(g,w/2,h-z+12,2,PAINTS[Math.floor(hash(o.x,1)*5)],o.x,false);},
 tires(g,o){const {e,r}=g,w=o.w,h=o.h,z=o.z,cx=w/2,base=h-6,th=z/3;e(cx+2,h-2,cx+3,6,SHADOW);
  for(let k=0;k<3;k++){const y=base-k*th,dx=(hash(k,o.x)-.5)*3;e(cx+dx,y,cx-.5,7,EDGE);r(dx+.5,y-th,w-1,th,EDGE);e(cx+dx,y-.5,cx-1,6.4,TIRE[1]);r(dx+1,y-th,w-2,th,TIRE[1]);for(let x=2;x<w-2;x+=3)r(dx+x,y-th+1.5,1.5,th-3,TIRE[2]);
   e(cx+dx,y-th,cx-.5,7,EDGE);e(cx+dx,y-th,cx-1,6.4,TIRE[2]);e(cx+dx,y-th,cx-6,3.4,TIRE[0]);e(cx+dx,y-th-.3,cx-6.5,2.8,'#0b0b0d');r(dx+4,y-th-4,6,.5,TIRE[3]);}
  splat(g,cx+4,base-th*1.5,1.8,PAINTS[Math.floor(hash(o.x,o.y)*5)],o.y,false);},
 spool(g,o){const {e,r}=g,w=o.w,h=o.h,z=o.z,cx=w/2,cy=h/2,top=cy-z;e(cx+2,h-1,cx+4,7,SHADOW);
  e(cx,cy,cx,9,EDGE);r(0,cy-4,w,4,EDGE);e(cx,cy-4,cx-.5,8.5,W[1]);
  r(cx-12,top+4,24,cy-8-top,EDGE);r(cx-11.5,top+4,23,cy-8-top,'#7a3a22');for(let y=top+6;y<cy-5;y+=2.5){r(cx-11.5,y,23,1,'#b5582c');r(cx-11.5,y+1,23,.5,'#4a2416');}r(cx-11.5,top+4,3,cy-8-top,'#00000033');
  e(cx,top+4,cx,9,EDGE);r(0,top,w,4.5,EDGE);r(.5,top+.5,w-1,3.5,W[2]);e(cx,top,cx,9,EDGE);e(cx,top,cx-.5,8.5,W[3]);
  for(let k=-2;k<=2;k++)r(cx+k*7-3,top-7,.5,14,W[2]);e(cx,top,4,2.4,EDGE);e(cx,top,3,1.6,'#2a2420');for(let k=0;k<6;k++){const a=k/6*6.28;r(cx+Math.cos(a)*6.5,top+Math.sin(a)*3.6,1,.5,'#8a8f94');}
  text(g,'LEET',cx-textWidth('LEET',1)/2,top-7,1,'#232428');splat(g,cx-10,top+1,2,PAINTS[Math.floor(hash(o.x,o.y)*5)],o.x,true);},
 sandbags(g,o){const {e,r}=g,w=o.w,h=o.h;e(w/2,h,w/2+4,5,SHADOW);const bw=16;
  for(let j=0;j<2;j++){const y=h-4-j*9,off=j%2?bw/2:0;for(let x=-off+2;x<w-4;x+=bw){const x0=Math.max(1,x),x1=Math.min(w-1,x+bw-1),cx=(x0+x1)/2,rx=(x1-x0)/2,tone=hash(x,j+o.x)>.5;
   e(cx,y,rx+.5,5.5,EDGE);e(cx,y-.5,rx,4.8,BAG[tone?2:1]);e(cx-1,y-2,Math.max(1,rx-2),2.6,BAG[tone?3:2]);r(cx-rx*.6,y-4,rx*.6,.5,BAG[4]);for(let s=0;s<3;s++)r(cx-rx+1.5,y-2+s*1.5,.5,.5,BAG[0]);}}},
 cartpile(g,o){const {e,r:r0,l:l0,p:p0}=g,w=o.w,h=o.h,oy=h-16,r=(x,y,a,b,c)=>r0(x,y+oy,a,b,c),l=(a,b,c,d,k,col)=>l0(a,b+oy,c,d+oy,k,col),p=(pts,col)=>p0(pts.map(([x,y])=>[x,y+oy]),col);e(w/2,h-2,w/2+4,6,SHADOW);const wire=M[3],dk=M[1];
  const basket=(x,y,bw,bh,lean)=>{p([[x,y],[x+bw,y+lean],[x+bw-3,y+bh+lean],[x+3,y+bh]],'#1a1c2033');
   for(let k=0;k<=bw;k+=3)l(x+k,y+k/bw*lean,x+3+k*(bw-6)/bw,y+bh+k/bw*lean,.5,wire);for(let k=0;k<=bh;k+=3)l(x+k/bh*3,y+k,x+bw-k/bh*3,y+k+lean,.5,wire);
   l(x,y,x+bw,y+lean,1,BONE);l(x+3,y+bh,x+bw-3,y+bh+lean,1,dk);};
  // The lower cart, frame bare where its wheels went to Gadget.
  basket(4,-14,40,22,-2);l(4,8,46,6,1.5,EDGE);l(4,8,46,6,.8,M[2]);for(const x of [8,40]){r(x,8,1.5,6,M[2]);r(x-1,13,3.5,1,EDGE);}
  l(42,-16,50,-22,1.5,EDGE);l(42,-16,50,-22,.8,M[2]);r(46,-25,8,3,EDGE);r(46.5,-24.5,7,2,'#b33a2a');r(47,-24.5,5,.5,'#d9604a');
  basket(10,-32,28,16,3);r(36,-36,3,8,EDGE);r(36.5,-35.5,2,7,'#b33a2a');},
 worklight(g,o){const {e,r,l}=g,cx=6;e(cx,8,12,4,SHADOW);
  for(const [fx,fy] of [[-6,10],[18,10],[cx,13]]){l(cx,-50,fx,fy,1.8,EDGE);l(cx,-50,fx,fy,.8,M[2]);}
  r(cx-1,-66,2,18,EDGE);r(cx-.5,-66,1,18,M[3]);
  // The lamp head: a yellow housing and a hot lens facing you.
  r(cx-9,-78,18,13,EDGE);r(cx-8.5,-77.5,17,12,'#c9a23a');r(cx-8.5,-77.5,17,1,'#e6c35a');r(cx-7,-76,14,9,'#2a2b2f');r(cx-6,-75,12,7,'#f4ecd2');r(cx-5,-74,6,2,'#ffffff');for(let x=cx-6;x<cx+6;x+=2)r(x,-75,.5,7,'#d8cfb0');
  r(cx-10.5,-72,1.5,4,EDGE);r(cx+9,-72,1.5,4,EDGE);l(cx+1,-64,cx+8,6,.8,'#c9622a');},
 gatepost(g,o){const {e,r}=g,w=o.w,h=o.h,z=o.z,cx=w/2;e(cx,h-2,cx+6,5,SHADOW);
  r(cx-3,-z,6,h+z-4,EDGE);r(cx-2.5,-z+.5,5,h+z-5,W[2]);r(cx-2.5,-z+.5,1.5,h+z-5,W[3]);for(let y=-z+16;y<-z+40;y+=6){r(cx-2.5,y,5,3,'#c9a23a');r(cx-2.5,y+3,5,3,'#1c1d21');}
  r(cx-4,-z-4,8,5,EDGE);r(cx-3.5,-z-3.5,7,4,'#5a1f1a');r(cx-2,-z-3,3,2,'#c0392b');
  for(const [x,y] of [[0,h-3],[w-2,h-3],[cx-1,h-8]]){e(x+1,y,6.5,4.5,EDGE);e(x+1,y-.5,6,4,BAG[2]);e(x,y-1.5,4,2,BAG[3]);}},
 banner(g,o){const {r,l}=g,w=o.w,y=-62;l(-6,y-6,w/2-26,y,.6,'#2a2b2f');l(w+6,y-6,w/2+26,y,.6,'#2a2b2f');
  for(let k=0;k<9;k++){const t=k/8,x=-6+t*(w+12),yy=y-6+Math.sin(t*Math.PI)*6;r(x-.75,yy,1.5,2,'#f2c46a');}
  r(w/2-27,y-1,54,15,EDGE);r(w/2-26.5,y-.5,53,14,PLY[3]);r(w/2-26.5,y-.5,53,1,PLY[4]);const tw=textWidth('ARENA',2);text(g,'ARENA',w/2-tw/2,y+2,2,'#b33a2a');
  for(let k=0;k<3;k++)splat(g,w/2-20+hash(k,4)*40,y+3+hash(4,k)*8,1.4,PAINTS[k+1],k+40,false);},
 pegboard(g,o){const {r,e}=g,w=o.w,h=o.h,z=o.z,F=h-z;r(-.5,-z-.5,w+1,h+z+1,EDGE);r(0,-z,w,h,'#2a2118');r(0,F,w,z,'#6b5236');r(0,F,w,.5,'#8a6c48');
  if(o.label){const tw=textWidth(o.label,1.5);r(w/2-tw/2-4.5,F-14.5,tw+9,12,EDGE);r(w/2-tw/2-4,F-14,tw+8,11,'#1a1b1e');text(g,o.label,w/2-tw/2,F-11,1.5,'#f2c46a');for(const x of [w/2-tw/2-1,w/2+tw/2+1])r(x-.5,F-3,1,3,'#8a8f94');}
  for(let y=F+3;y<h-2;y+=4)for(let x=3;x<w-2;x+=4)r(x,y,.5,.5,'#3a2c1e');
  // A paintball twin of every gun, each with its hopper of paint.
  Object.entries(PAINT).forEach(([id,col],i)=>{const x=8+i*28,y=F+16,rifle=id.endsWith('ar'),len=rifle?22:15;
   r(x+2,y-6,.5,6,'#8a8f94');r(x+14,y-6,.5,6,'#8a8f94');
   r(x,y,len,4,EDGE);r(x+.5,y+.5,len-1,3,'#3a3d44');r(x+.5,y+.5,len-1,.5,'#6a6f78');r(x+len-.5,y+1,3,2,EDGE);r(x+3,y+3.5,3.5,5,EDGE);r(x+3.5,y+4,2.5,4,'#2a2c31');
   if(rifle){r(x-4,y,5,3.5,EDGE);r(x-3.5,y+.5,4,2.5,'#3a3d44');}e(x+8,y-3,4,3.5,EDGE);e(x+8,y-3.2,3.3,2.9,col);e(x+7,y-4.2,1.3,1,'#ffffff88');r(x+7,y-.5,2,1,EDGE);r(x+len-3,y+1,2,1,col);});
  // Goggle masks and paint pods hang underneath.
  for(let k=0;k<4;k++){const x=12+k*36,y=F+36;r(x,y-6,.5,6,'#8a8f94');r(x-6,y,12,7,EDGE);r(x-5.5,y+.5,11,6,'#2a2c31');r(x-4.5,y+1.5,9,2.5,'#6fa8b8');r(x-4.5,y+1.5,3,1,'#c4e2ea');r(x-2,y+4.5,4,2,'#1a1b1f');}
  for(let k=0;k<6;k++){const x=18+k*22,y=F+50;r(x,y,4,9,EDGE);r(x+.5,y+.5,3,8,'#d6d0c2');r(x+.5,y+2,3,5,PAINTS[k%5]);r(x+.5,y+.5,3,1,'#2a2b2f');}},
 counter(g,o){const {e,r,l}=g,w=o.w,h=o.h,top=28;e(w/2,h,w/2+6,6,SHADOW);
  // A plywood slab across two ammo crates, an open shelf between them.
  r(-.5,-top-.5,w+1,h+4,EDGE);r(.5,-top+.5,w-1,h-1,PLY[3]);r(.5,-top+.5,w-1,.5,PLY[4]);for(let k=0;k<5;k++)r(4+hash(k,2)*(w-30),-top+3+hash(2,k)*(h-6),12+hash(k,5)*14,.5,PLY[2]);
  r(.5,h-top,w-1,3,PLY[2]);r(.5,h-top+2.5,w-1,.5,PLY[1]);const F=h-top+3;r(56,F,w-112,top-3.5,'#14120f');r(60,F+10,w-120,1.5,PLY[1]);
  for(let k=0;k<5;k++){r(64+k*10,F+4,6,6,PAINTS[k]);r(64+k*10,F+4,6,1,'#ffffff44');}
  for(const x of [6,w-50]){r(x-.5,F,45,top-3.5,EDGE);r(x,F,44,top-4,OLIVE[1]);r(x,F,44,.5,OLIVE[2]);r(x+2,F+3,40,.5,OLIVE[3]);text(g,'AMMO',x+22-textWidth('AMMO',1.5)/2,F+9,1.5,'#c9c3a0');r(x+2,F+5,4,1.5,'#1a1b1e');r(x+38,F+5,4,1.5,'#1a1b1e');}
  // On top: a radio, a desk lamp, a clipboard, paint pods, a hopper and a mug.
  blk(g,8,-24,14,6,7,'#2a2c31','#1c1d21');l(19,-31,22,-42,.5,EDGE);r(10,-22,4,1,'#c0392b');
  l(36,-12,40,-30,1,EDGE);l(40,-30,46,-36,1,EDGE);r(43,-40,9,5,EDGE);r(43.5,-39.5,8,4,'#c9a23a');r(44,-36,7,1,'#fff0c0');e(36,-12,4,1.5,EDGE);
  r(60,-22,14,12,EDGE);r(60.5,-21.5,13,11,'#d6d0c2');r(64,-23,6,2,'#8a8f94');for(let k=0;k<4;k++)r(62,-18+k*2.2,9,.5,'#6a6f78');
  for(let k=0;k<5;k++){const x=86+k*9,y=-18+(k%2)*3;r(x,y,8,3,EDGE);r(x+.5,y+.5,7,2,PAINTS[k]);r(x+.5,y+.5,1.5,2,'#d6d0c2');}
  e(142,-16,6,5,EDGE);e(142,-16.3,5.3,4.3,'#26272b');e(142,-17,4,2.5,'#3f8fe0');e(141,-18,1.2,.8,'#ffffff88');r(140,-12,4,2,EDGE);
  r(156,-24,6,7,EDGE);r(156.5,-23.5,5,6,'#d6cfbf');r(162,-22,1.5,3,EDGE);},
 paintcrate(g,o){const {e,r}=g,w=o.w,h=o.h,z=o.z;e(w/2+2,h,w/2+5,5,SHADOW);r(-.5,-z-.5,w+1,h+z+1,EDGE);r(.5,-z+.5,w-1,h-1,'#1e1812');r(.5,h-z+.5,w-1,z-1,W[2]);r(.5,h-z,w-1,1,W[3]);for(let x=8;x<w-2;x+=9)r(x,h-z+1,1,z-2,W[1]);
  for(let k=0;k<14;k++){const x=2+hash(k,1)*(w-9),y=-z+2+hash(1,k)*(h-6);r(x,y,6,2.5,EDGE);r(x+.5,y+.5,5,1.5,PAINTS[k%5]);r(x+.5,y+.5,1,1.5,'#d6d0c2');}
  for(let k=0;k<10;k++)e(1.5+hash(k,2)*(w-3),-z+2+hash(2,k)*(h-4),1,1,PAINTS[(k+2)%5]);r(4,h-z+5,w-8,8,'#1a1b1e');text(g,'PAINT',w/2-textWidth('PAINT',1.5)/2,h-z+6.5,1.5,BONE);},
 desk(g,o){const {e,r,l}=g,w=o.w,h=o.h,T=DESK.T;e(w/2,h,w/2+6,6,SHADOW);
  // Two old doors laid flat on sawhorses, cables looping underneath.
  for(const x of [14,w-14]){l(x-8,h,x-2,h-T+4,1.6,EDGE);l(x+8,h,x+2,h-T+4,1.6,EDGE);l(x-8,h,x-2,h-T+4,.8,W[3]);l(x+8,h,x+2,h-T+4,.8,W[3]);r(x-10,h-T+3,20,2,EDGE);r(x-9.5,h-T+3.5,19,1,W[2]);}
  for(let k=0;k<5;k++){const x=34+k*22;l(x,h-T+3,x+6,h-7+hash(k,1)*4,.6,'#141416');l(x+6,h-7+hash(k,1)*4,x+12,h-T+3,.6,k%2?'#c9622a':'#141416');}
  r(-.5,-T-.5,w+1,h+4,EDGE);r(.5,-T+.5,w/2-1,h-1,'#9a968a');r(w/2+.5,-T+.5,w/2-1,h-1,'#6d5638');r(w/2,-T,.5,h,EDGE);r(6,-T+4,w/2-12,h-10,'#8f8b7f');r(w/2+4,-T+3,w/2-8,.5,'#856a46');
  r(.5,h-T,w/2-1,3,'#7d7a70');r(w/2+.5,h-T,w/2-1,3,'#5a4630');r(.5,h-T+2.5,w-1,.5,'#3a3630');
  // Cables up the back to everything.
  for(const x of [24,62,98,132])l(x,-T+2,x+(hash(x,1)-.5)*8,-T+6,.8,'#141416');
  // A beige CRT, a flat screen on a stack of books, a laptop and a camera monitor, all facing her.
  {const [x,y,sw,sh]=DESK.crt;r(x-3.5,y-3.5,sw+7,sh+9,EDGE);r(x-3,y-3,sw+6,sh+8,'#b8b09a');r(x-3,y-3,sw+6,1,'#d0c8b0');r(x-1,y-1,sw+2,sh+2,'#5a5648');r(x,y,sw,sh,'#0d1a1c');for(let k=0;k<6;k++)r(x+2,y+2+k*2.2,4+hash(k,11)*14,1,k%3?'#3fa8b0':'#9fe0d8');r(x+sw-5,y+sh+2,3,1.5,'#3a3d44');r(x+5,y+sh+5,sw-10,3,EDGE);r(x+5.5,y+sh+5,sw-11,2.5,'#a39a84');r(x+sw-1,y-5,5,4,'#e6c35a');}
  {const [x,y,sw,sh]=DESK.lcd;for(let k=0;k<3;k++){r(x-2,-T+1+k*2.5-4,sw+4,2.5,EDGE);r(x-1.5,-T+1.5+k*2.5-4,sw+3,1.5,['#7a3a30','#3d4f63','#5f7058'][k]);}r(x+sw/2-2,y+sh,4,3,EDGE);
   r(x-1.5,y-1.5,sw+3,sh+3,EDGE);r(x-1,y-1,sw+2,sh+2,'#1c1d21');r(x,y,sw,sh,'#08140e');const cx=x+sw/2,cy=y+sh/2;ring(g,cx,cy,8,6,'#2f7a4a','#08140e');ring(g,cx,cy,4.5,3.4,'#2f7a4a','#08140e');r(cx-9,cy-.25,18,.5,'#2f7a4a');r(cx-.25,cy-7,.5,14,'#2f7a4a');for(const [dx,dy] of [[-5,-3],[3,2],[6,-4],[-2,4]])r(cx+dx,cy+dy,1,1,'#e0503a');}
  {const [x,y,sw,sh]=DESK.lap;r(x-1.5,y-1.5,sw+3,sh+3,EDGE);r(x-1,y-1,sw+2,sh+2,'#2a2c31');r(x,y,sw,sh,'#123a46');for(let k=0;k<4;k++)r(x+2,y+2+k*2.4,3+hash(k,21)*12,.8,'#5ac0d0');p8(g,x,y,sw,sh);}
  {const [x,y,sw,sh]=DESK.cam;r(x-2.5,y-2.5,sw+5,sh+5,EDGE);r(x-2,y-2,sw+4,sh+4,'#26272b');r(x,y,sw,sh,'#38403f');for(let k=0;k<sh;k+=2)r(x,y+k,sw,.5,'#2c3332');r(x+3,y+sh-4,sw-6,2,'#4a524f');r(x+sw/2-2,y+4,4,6,'#1c1f20');r(x+sw/2-1.5,y+2.5,3,2.5,'#1c1f20');text(g,'CAM2',x+1.5,y+1.5,.5,'#c9e0d8');r(x+sw-3,y+1.5,1.5,1.5,'#e0503a');r(x+sw/2-2,y+sh+2.5,4,2,EDGE);}
  // Keyboard, mouse, cans, a soldering iron and a spare robot head.
  r(26,-15,32,7,EDGE);r(26.5,-14.5,31,6,'#2a2c31');for(let y=-13.5;y<-9;y+=1.5)for(let x=27.5;x<57;x+=2)r(x,y,1,.75,'#4a4d54');e(64,-11,2,1.5,EDGE);e(64,-11.3,1.4,1,'#3a3d44');
  for(const [x,y,c] of [[76,-12,'#3f6a3a'],[81,-9,'#1c1d21'],[150,-6,'#3f6a3a']]){r(x,y-5,3.5,6,EDGE);r(x+.5,y-4.5,2.5,5,c);r(x+.5,y-4.5,2.5,1,'#c4c9ce');}
  r(112,-12,8,4,EDGE);r(112.5,-11.5,7,3,'#3a3d44');l(114,-12,120,-20,.8,'#c4c9ce');l(120,-20,126,-24,1.2,'#c9622a');
  e(138,-8,7,5,EDGE);e(138,-8.3,6.3,4.4,'#b5ad9c');for(const x of [135.5,140.5]){l(x-1,-9.5,x+1,-7.5,.6,'#1c1d22');l(x-1,-7.5,x+1,-9.5,.6,'#1c1d22');}r(135,-5.5,6,.5,'#1c1d22');},
 server(g,o){const {e,r,l}=g,w=o.w,h=o.h,z=o.z,F=SRV.F;e(w/2,h,w/2+5,5,SHADOW);
  // The top shelf from above, with a desk fan clamped on.
  r(-.5,-z-.5,w+1,h+1,EDGE);r(.5,-z+.5,w-1,h-1,'#1c1d21');for(let x=2;x<w-1;x+=3)r(x,-z+1,.5,h-2,M[2]);for(let y=-z+2;y<F-1;y+=3)r(1,y,w-2,.5,M[2]);
  e(30,-z+2,8,8,EDGE);e(30,-z+2,7,7,'#3a3d44');for(let k=-6;k<=6;k+=2)r(30+k-.25,-z-5,.5,14,'#5c636b');e(30,-z+2,2,2,'#c9a23a');r(28,-z+9,4,4,EDGE);
  // Four bays on a chrome wire shelf.
  r(-.5,F-.5,w+1,h-F+.5,EDGE);r(0,F,w,h-F,'#121316');for(const x of [0,w-2.5]){r(x,F,2.5,h-F,M[3]);r(x+.5,F,.5,h-F,'#c4c9ce');}
  for(const y of [F,F+22,F+44,F+66,h-3]){r(0,y,w,1.5,M[3]);r(0,y+1.5,w,.5,M[1]);}
  // Bay 1: a router with three antennas, a modem and a taped note.
  r(4,F+15,16,6,EDGE);r(4.5,F+15.5,15,5,'#2a2c31');for(const x of [6,12,18])l(x,F+15,x+(x-12)*.3,F+4,.6,EDGE);r(24,F+8,10,13,EDGE);r(24.5,F+8.5,9,12,'#d6d0c2');r(26,F+11,6,.5,'#8a8f94');r(37,F+6,9,11,'#e8e0d1');r(38,F+8,7,.5,'#b33a2a');r(38,F+10,5,.5,'#b33a2a');r(38,F+12,6,.5,'#b33a2a');r(39,F+5,5,1.5,'#8d9196');
  // Bay 2: two PC towers, one beige, one black.
  r(4,F+24,14,20,EDGE);r(4.5,F+24.5,13,19,'#b8b09a');r(6,F+27,9,2,'#8a8270');r(6,F+30,9,2,'#8a8270');r(21,F+24,13,20,EDGE);r(21.5,F+24.5,12,19,'#26272b');r(23,F+27,8,1,'#3a3d44');for(let y=F+33;y<F+42;y+=1.5)r(23,y,8,.5,'#3a3d44');r(36,F+36,11,8,EDGE);r(36.5,F+36.5,10,7,'#5c636b');
  // Bay 3: a battery backup box and a network switch.
  r(5,F+47,20,10,EDGE);r(5.5,F+47.5,19,9,'#3e434b');r(7,F+50,10,1,'#5c636b');r(3,F+58,44,7,EDGE);r(3.5,F+58.5,43,6,'#1c1d21');for(let i=0;i<14;i++)r(4.5+i*3,F+62,1.5,1.5,'#0b0b0d');
  // Bay 4: a car battery and coils of cord.
  r(6,F+73,14,10,EDGE);r(6.5,F+73.5,13,9,'#2a2c31');r(8,F+72,2,1.5,'#c0392b');r(15,F+72,2,1.5,'#141416');for(let k=0;k<3;k++){e(34,F+79-k*1.5,9-k,3.5,EDGE);e(34,F+79-k*1.5,8-k,2.8,k%2?'#c9622a':'#c9a23a');e(34,F+79-k*1.5,6-k,1.6,'#121316');}},
 batteries(g,o){const {e,r,l}=g,w=o.w,h=o.h;e(w/2,h,w/2+4,4,SHADOW);r(-.5,h-5.5,w+1,6,EDGE);r(0,h-5,w,2,W[2]);r(0,h-3,w,2.5,W[1]);
  for(let k=0;k<4;k++){const x=2+k*12;blk(g,x,1,11,9,10,'#2a2c31','#1c1d21');r(x+1.5,-9,2,1.5,'#c0392b');r(x+7.5,-9,2,1.5,'#141416');r(x+1,4,9,2,'#c9a23a');}
  for(let k=0;k<3;k++)l(2+k*12+8.5,-8.5,2+(k+1)*12+2.5,-8.5,.8,'#141416');
  blk(g,50,1,14,9,9,'#8a8f94','#6a6f78');for(let x=52;x<62;x+=1.5)r(x,2,.5,5,'#3a3d44');},
 whiteboard(g,o){const {e,r,l}=g,w=o.w,h=o.h,z=o.z,B='#2e4a8a',RED='#b33a2a';e(w/2,h,w/2+3,3,SHADOW);
  for(const x of [6,w-6]){const lean=x<w/2?2:-2;l(x,h,x+lean,-z+30,1.5,EDGE);l(x,h,x+lean,-z+30,.7,M[3]);}
  r(-.5,-z-.5,w+1,36,EDGE);r(.5,-z+.5,w-1,34,'#d8d6ce');r(.5,-z+.5,w-1,.5,'#f2f0e8');r(.5,-z+33,w-1,1.5,'#8a8f94');
  text(g,'HOLDOUT',3,-z+3,1,B);for(let k=0;k<3;k++){const y=-z+13+k*6;text(g,String(k+1),4,y,1,B);r(9,y+2,10+hash(k,3)*14,.6,B);r(33,y+2,6,.6,RED);}
  r(w-17,-z+5,12,11,B);r(w-16,-z+6,10,9,'#d8d6ce');for(const x of [w-13,w-8]){l(x-1,-z+8,x+1,-z+10,.5,B);l(x+1,-z+8,x-1,-z+10,.5,B);}r(w-14,-z+13,6,.5,B);r(w-15,-z+16,1,3,B);r(w-8,-z+16,1,3,B);
  r(4,-z+31,6,1.5,RED);r(12,-z+31,6,1.5,B);},
 chair(g,o){const {e,r,l}=g,w=o.w,h=o.h,cx=w/2;e(cx,h-2,11,4,SHADOW);
  for(const [x,y] of [[-3,h-1],[w+3,h-1],[cx-6,h+2],[cx+6,h+2],[cx,h-5]]){l(cx,h-4,x,y,1.4,EDGE);r(x-1,y-1,2,2,'#141416');}
  r(cx-1,-6,2,h+2,EDGE);r(cx-.5,-6,1,h+2,M[3]);e(cx,-6,9,4,EDGE);e(cx,-6.5,8.3,3.4,'#26272b');
  r(cx-7,-26,14,18,EDGE);r(cx-6.5,-25.5,13,17,'#2c2d32');r(cx-6.5,-25.5,13,1,'#44464c');r(cx-3,-20,7,3,'#8d9196');r(cx-3,-20,7,.5,'#b5b9bd');r(cx-1,-8,2,3,EDGE);},
 carseat(g,o){const {e,r}=g,w=o.w,h=o.h,UP=['#2b2f38','#363b46','#424856','#525a6a'];e(w/2,h,w/2+6,6,SHADOW);
  r(-.5,-26.5,w+1,h+17,EDGE);r(.5,-26,w-1,h+5,UP[2]);for(let x=6;x<w-4;x+=8)r(x,-24,.5,h+2,UP[1]);r(.5,-26,w-1,1,UP[3]);
  for(const x of [18,w-30]){r(x-.5,-36.5,13,11,EDGE);r(x,-36,12,10,UP[2]);r(x,-36,12,1,UP[3]);r(x+3,-27,1,2,M[2]);r(x+8,-27,1,2,M[2]);}
  r(-.5,h-12.5,w+1,13,EDGE);r(.5,h-12,w-1,12,UP[1]);r(.5,h-12,w-1,4,UP[2]);for(let x=w/3;x<w-2;x+=w/3)r(x,h-12,.5,12,UP[0]);
  r(w-34,-22,30,h+14,'#5e2a26');for(let k=0;k<6;k++)r(w-34,-18+k*6,30,1,'#7a3a30');r(w-34,h-14,30,4,'#4a201d');
  e(14,h-14,10,5,EDGE);e(14,h-14.5,9,4.3,'#b5ad9c');r(8,h-17,10,.5,'#d6cfbf');},
 stove(g,o){const {e,r}=g,w=o.w,h=o.h,cz=16;e(w/2,h,w/2+3,4,SHADOW);blk(g,0,4,w,h-4,cz,'#3a2c22','#6d5746');
  // A green two-burner stove on the crate, a dented percolator, two mugs.
  const t=4-cz;blk(g,2,t+2,26,8,4,'#3a5a3a','#2e4a2e');r(5,t-1,8,.5,'#141416');r(17,t-1,8,.5,'#141416');r(17,t-3,6,1.5,'#3a78c8');r(18,t-4,4,1,'#8ac0ff');
  r(6,t-14,7,13,EDGE);r(6.5,t-13.5,6,12,'#9aa0a6');r(6.5,t-13.5,1.5,12,'#c4c9ce');r(8,t-16,3,2,EDGE);r(12.5,t-10,2.5,1,EDGE);
  for(const x of [19,24]){r(x,t-9,4,5,EDGE);r(x+.5,t-8.5,3,4,'#d6cfbf');r(x+4,t-8,1,2,EDGE);}},
 cordreel(g,o){const {e,r,l}=g,w=o.w,h=o.h,cx=w/2;e(cx,h,w/2+3,4,SHADOW);
  r(cx-11,-14,2,h+12,EDGE);r(cx+9,-14,2,h+12,EDGE);r(cx-10.5,-13.5,1,h+11,M[3]);r(cx+9.5,-13.5,1,h+11,M[3]);
  e(cx,0,9,9,EDGE);for(let k=0;k<5;k++)e(cx,0,8-k*1.4,8-k*1.4,k%2?'#a54e22':'#c9622a');e(cx,0,2,2,'#3a3d44');l(cx,0,cx+5,-6,1,'#3a3d44');r(cx+4,-8,3,2,EDGE);
  l(cx+8,4,cx+14,h-2,1,'#c9622a');r(-2,h-4,11,4,EDGE);r(-1.5,h-3.5,10,3,'#d6d0c2');r(0,h-2.5,1.5,1,'#3a3a3e');r(3,h-2.5,1.5,1,'#3a3a3e');},
 botbench(g,o){const {e,r,l}=g,w=o.w,h=o.h,T=28;e(w/2,h,w/2+6,6,SHADOW);
  for(const x of [4,w-8]){r(x-.5,h-T,5,T,EDGE);r(x,h-T,4,T-.5,W[2]);r(x,h-T,1,T-.5,W[3]);}r(8,h-8,w-16,3,EDGE);r(8.5,h-7.5,w-17,2,W[1]);
  r(-.5,-T-.5,w+1,h+4,EDGE);r(.5,-T+.5,w-1,h-1,PLY[2]);r(.5,-T+.5,w-1,.5,PLY[4]);r(.5,h-T,w-1,3,PLY[1]);
  // A robot in pieces: the pillow body half wrapped, the battery open, the wheels off.
  e(46,-14,22,9,EDGE);e(46,-14.5,21,8.3,'#b5ad9c');e(42,-17,12,4,'#d6cfbf');e(58,-13,12,7,'#46607c');r(52,-18,10,.5,'#6582a0');for(let k=0;k<5;k++)r(50+hash(k,1)*14,-16+hash(1,k)*6,1,1,'#c9b9a0');
  r(24,-16,46,2,EDGE);r(24.5,-15.5,45,1,'#8d9196');l(66,-10,96,-6,1.6,EDGE);l(66,-10,96,-6,.8,W[3]);
  blk(g,78,-18,14,8,7,'#2a2c31','#1c1d21');r(80,-27,2,1.5,'#c0392b');r(87,-27,2,1.5,'#141416');l(80,-26,72,-20,.6,'#c0392b');l(88,-26,74,-18,.6,'#141416');
  for(const [x,y] of [[104,-14],[114,-10]]){e(x,y,3.5,3.5,EDGE);e(x,y,2.6,2.6,'#1f2024');e(x,y,1,1,'#8a9096');}
  e(126,-18,5,3,EDGE);e(126,-18,4,2.3,'#8d9196');e(126,-18,2,1.2,PLY[2]);r(16,-12,10,3,EDGE);r(16.5,-11.5,6,2,'#c9a23a');r(22.5,-11.5,3,2,'#1c1d21');
  // A clamp lamp over the work.
  l(132,-T,128,-T-12,1,EDGE);r(122,-T-15,10,5,EDGE);r(122.5,-T-14.5,9,4,'#5c636b');r(123,-T-11,8,1,'#fff0c0');},
 parts(g,o){const {e,r,l}=g,w=o.w,h=o.h;e(w/2,h-2,w/2+4,6,SHADOW);
  r(28,-10,22,h+6,EDGE);r(28.5,-9.5,21,h+5,'#5a8ab0');for(let x=30;x<49;x+=3)r(x,-6,1.5,h,'#3e6a8c');r(28.5,-9.5,21,1.5,'#7aa8c8');e(39,-10,9,3,'#d6cfbf');e(36,-12,6,3,'#c08a9a');
  e(14,h-8,13,7,EDGE);e(14,h-8.5,12,6.2,'#b5ad9c');e(11,h-10,7,3,'#d6cfbf');e(18,h-14,10,5,EDGE);e(18,h-14.5,9,4.3,'#7d97b0');r(12,h-16,10,.5,'#c9b9a0');
  l(2,h-2,20,-8,1.5,EDGE);l(2,h-2,20,-8,.8,W[3]);r(17,-14,9,6,EDGE);r(17.5,-13.5,8,5,'#c9a24a');for(let x=18;x<25;x+=1.5)r(x,-9,.5,3,'#a0803a');
  for(const [x,y] of [[6,h-2],[46,h],[40,h-4]]){e(x,y,3,3,EDGE);e(x,y,2.2,2.2,'#1f2024');e(x,y,.9,.9,'#8a9096');}},
 botparked(g,o){drawBot(g,o.w/2,o.h-2,o.variant||0,0);},
 charger(g,o){const {e,r}=g,w=o.w,h=o.h;e(w/2,h,w/2+4,4,SHADOW);blk(g,0,2,w,h-2,18,OLIVE[2],OLIVE[1]);
  for(let k=0;k<2;k++){const y=-14+k*5;r(3,y,26,4,EDGE);r(3.5,y+.5,25,3,'#d6d0c2');for(let i=0;i<5;i++)r(5+i*5,y+1.5,2,1,'#3a3a3e');}
  text(g,'CHARGE',w/2-textWidth('CHARGE',1)/2,4,1,'#c9c3a0');},
 sheetV(g,o){const {e,r}=g,w=o.w,h=o.h,z=o.z;e(w/2+2,h,w/2+6,4,SHADOW);r(-.5,-z-.5,w+1,h+z+1,EDGE);r(0,-z,w,h,M[1]);
  // The top edges of two sheets on a 2x4 frame, seen from above, and the end of the panel facing you.
  for(const x of [.5,w-2.5]){r(x,-z,2,h,M[3]);r(x,-z,2,.5,'#c4c9ce');}for(let y=-z+2;y<h-z-1;y+=3)r(3,y,w-6,1,M[2]);for(let y=-z+10;y<h-z;y+=40){r(3,y,w-6,3,W[2]);r(3,y,w-6,.5,W[3]);}
  r(0,h-z,w,z,EDGE);for(let x=.5;x<w-.5;x+=3){r(x,h-z+.5,1.5,z-1,M[2]);r(x+1.5,h-z+.5,Math.min(1.5,w-.5-x-1.5),z-1,M[1]);}
  for(let k=0;k<3;k++){const x=2+hash(k,o.y)*(w-4),y=h-z+2+hash(o.x,k)*z*.4;r(x,y,1,z*.3+hash(k,9)*z*.3,RUST);}
  for(let k=0;k<4;k++){const y=-z+6+hash(k,o.y+1)*(h-14);r(-.5,y,1.5,4+hash(o.x,k)*6,RUST);}splat(g,w/2,h-z+10,1.8,PAINTS[Math.floor(hash(o.y,2)*5)],o.y,false);},
 // A window: a sill of planks you can shoot over, the wall's uprights either side and a 2x4 header. Robots climb through.
 window(g,o){const {e,r,l}=g,w=o.w,h=o.h,z=o.z,H=50;e(w/2,h,w/2+3,4,SHADOW);
  blk(g,0,0,w,h,z,W[2],W[1]);for(let k=0;k<3;k++){r(.5,h-z+1+k*5.5,w-1,4.5,[W[2],W[3],W[2]][k]);r(.5,h-z+1+k*5.5,w-1,.5,W[4]);}r(.5,-z+.5,w-1,1,W[3]);
  for(let k=0;k<5;k++){const x=4+hash(k,o.x)*(w-10);p3(g,x,-z+3+hash(o.x,k)*(h-6));}
  for(const x of [0,w-4]){r(x-.5,-H-.5,5,h+H+1,EDGE);r(x,-H,4,h,W[3]);r(x,h-H,4,H,W[2]);r(x,h-H,1,H,W[3]);}
  r(-.5,-H-.5,w+1,h+6.5,EDGE);r(0,-H,w,h,W[2]);r(0,-H,w,.5,W[4]);r(0,h-H,w,5.5,W[1]);r(0,h-H,w,.5,W[3]);
  // A torn tarp still nailed to the header on one side.
  const s=hash(o.x,o.y)>.5,tx=s?4:w-22;r(tx,h-H+5,18,10+hash(o.x,3)*8,'#435646');for(let k=0;k<4;k++)r(tx+k*4.5,h-H+5,.5,10+hash(k,o.x)*10,'#26302a');r(tx,h-H+5,18,1,'#56705c');
  splat(g,w*.6,h-z+6,1.6,PAINTS[Math.floor(hash(o.x,8)*5)],o.x,false);},
 windowV(g,o){const {e,r}=g,w=o.w,h=o.h,z=o.z,H=50;e(w/2+2,h,w/2+5,4,SHADOW);
  blk(g,0,0,w,h,z,W[2],W[1]);for(let y=-z+2;y<h-z-1;y+=6){r(.5,y,w-1,5,W[3]);r(.5,y,w-1,.5,W[4]);}for(let k=0;k<3;k++)r(.5,h-z+1+k*5.5,w-1,4.5,[W[2],W[3],W[2]][k]);
  for(let k=0;k<4;k++)p3(g,3+hash(k,o.y)*(w-6),-z+4+hash(o.y,k)*(h-8));
  // The uprights either side of the opening.
  r(-.5,-H-.5,w+1,H+4.5,EDGE);r(0,-H,w,3,W[3]);r(0,3-H,w,H-.5,W[2]);r(0,3-H,1,H-.5,W[3]);
  r(-.5,h-3-H-.5,w+1,H+4,EDGE);r(0,h-3-H,w,3,W[3]);r(0,h-H,w,H,W[2]);r(0,h-H,1,H,W[3]);},
 cot(g,o){const {e,r,l}=g,w=o.w,h=o.h,z=o.z;e(w/2,h,w/2+3,4,SHADOW);
  // An army cot: X legs, two wooden rails and olive canvas, with a pillow and a folded blanket.
  for(const x of [4,w-12]){l(x,h-z,x+8,h,1.4,EDGE);l(x+8,h-z,x,h,1.4,EDGE);l(x,h-z,x+8,h,.7,W[2]);l(x+8,h-z,x,h,.7,W[2]);}
  r(-.5,-z-.5,w+1,h+3,EDGE);r(0,-z,w,h,OLIVE[2]);r(2,-z+3,w-4,h-6,OLIVE[1]);for(const y of [-z,h-z-2]){r(0,y,w,2,W[2]);r(0,y,w,.5,W[3]);}r(0,h-z,w,2,OLIVE[1]);
  r(3,-z+3,14,h-6,'#b5ad9c');r(3,-z+3,14,1,'#d6cfbf');r(4,h-z-4,12,1,'#8a8270');
  const c=hash(o.x,o.y)>.5?['#5a2e2a','#7a3a30']:['#33414f','#4f6479'];r(w-26,-z+1.5,22,h-3,c[0]);for(let y=-z+3;y<h-z-2;y+=4)r(w-26,y,22,1,c[1]);r(w-26,h-z-2,22,2,'#1a1714');},
 shelf(g,o){const {e,r}=g,w=o.w,h=o.h,z=o.z,F=h-z;e(w/2,h,w/2+5,5,SHADOW);
  // Wire shelving from a supermarket stockroom, loaded with what LEET AF could carry.
  r(-.5,-z-.5,w+1,h+1,EDGE);r(.5,-z+.5,w-1,h-1,'#1c1d21');for(let x=2;x<w-1;x+=3)r(x,-z+1,.5,h-2,M[2]);
  r(-.5,F-.5,w+1,z+.5,EDGE);r(0,F,w,z,'#121316');for(const x of [0,w-2.5]){r(x,F,2.5,z,M[3]);r(x+.5,F,.5,z,'#c4c9ce');}
  const rows=[F+1,F+20,F+40,h-3];for(const y of rows){r(0,y,w,1.5,M[3]);r(0,y+1.5,w,.5,M[1]);}
  for(let j=0;j<3;j++){let x=4;const y=rows[j+1];while(x<w-10){const kind=Math.floor(hash(x+o.x,j+o.y)*5),k=hash(j,x);
   if(kind===0){for(let i=0;i<3;i++){r(x+i*5,y-7,4,7,EDGE);r(x+i*5+.5,y-6.5,3,6,['#b33a2a','#c9a23a','#3f6a3a'][(i+j)%3]);r(x+i*5+.5,y-6.5,3,1,'#c4c9ce');}x+=17;}
   else if(kind===1){const bw=12+k*8,bh=9+k*6;r(x,y-bh,bw,bh,EDGE);r(x+.5,y-bh+.5,bw-1,bh-1,'#8a7258');r(x+.5,y-bh+.5,bw-1,1,'#a88e6c');r(x+bw/2-.5,y-bh+.5,1,bh-1,'#c9b9a0');x+=bw+2;}
   else if(kind===2){r(x,y-13,9,13,EDGE);r(x+.5,y-12.5,8,12,'#d6d0c2');r(x+2.5,y-15,4,2.5,EDGE);r(x+3,y-14.5,3,2,'#3f8fe0');r(x+.5,y-8,8,3,'#3f8fe0');x+=11;}
   else if(kind===3){r(x,y-9,14,9,EDGE);r(x+.5,y-8.5,13,8,'#e8e0d1');r(x+5.5,y-7.5,3,6,'#c0392b');r(x+4,y-6,6,3,'#c0392b');x+=16;}
   else{e(x+7,y-5,7,5,EDGE);e(x+7,y-5.3,6.3,4.4,'#435646');e(x+7,y-6,4,2.4,'#56705c');x+=16;}}}},
 table(g,o){const {e,r,l}=g,w=o.w,h=o.h,z=o.z,T=z;e(w/2,h,w/2+5,5,SHADOW);
  // A door on two crates, with whatever was being done when the robots came.
  for(const x of [4,w-26]){r(x-.5,h-T,23,T,EDGE);r(x,h-T,22,T-.5,OLIVE[1]);r(x,h-T,22,.5,OLIVE[2]);r(x+2,h-T+4,18,.5,OLIVE[3]);}
  r(-.5,-T-.5,w+1,h+4,EDGE);const [c0,c1,c2]=DOORS[Math.floor(hash(o.x,o.y)*DOORS.length)];r(.5,-T+.5,w-1,h-1,c1);r(4,-T+4,w-8,h-8,c2);r(6,-T+6,w-12,h-12,c1);r(.5,h-T,w-1,3,c0);r(.5,h-T+2.5,w-1,.5,'#1a1714');
  const kind=Math.floor(hash(o.y,o.x)*3);
  if(kind===0){// Cards, mugs and a lantern.
   for(let k=0;k<6;k++){const x=16+hash(k,o.x)*40,y=-T+6+hash(o.x,k)*(h-14);r(x,y,4,5.5,EDGE);r(x+.5,y+.5,3,4.5,'#e8e0d1');r(x+1,y+1.5,1,1,k%2?'#b33a2a':'#1c1d22');}
   for(const x of [w-20,w-30]){r(x,-T+8,5,6,EDGE);r(x+.5,-T+8.5,4,5,'#d6cfbf');r(x+5,-T+9.5,1,2.5,EDGE);}
   r(w-14,-T-6,8,12,EDGE);r(w-13.5,-T-5.5,7,11,'#3a3d44');r(w-12.5,-T-3.5,5,6,'#f2c46a');r(w-11.5,-T-2.5,2,3,'#fff0c0');}
  else if(kind===1){// A map of the county, pinned flat, with red marks.
   r(10,-T+4,46,h-8,EDGE);r(10.5,-T+4.5,45,h-9,'#c9bfa0');for(let k=0;k<4;k++)l(12,-T+8+k*5,54,-T+6+k*6,.5,'#7a9a7a');l(20,-T+5,30,-T+h-5,.5,'#3a6a9a');for(let k=0;k<5;k++){const x=14+hash(k,3)*38,y=-T+7+hash(3,k)*(h-14);r(x,y,1.5,1.5,'#b33a2a');}
   r(62,-T+6,12,8,EDGE);r(62.5,-T+6.5,11,7,'#2a2c31');r(64,-T+8,4,1,'#c0392b');}
  else{// A robot arm half built, with tools.
   e(30,-T+12,14,6,EDGE);e(30,-T+11.5,13,5.3,'#b5ad9c');l(42,-T+12,62,-T+6,1.6,EDGE);l(42,-T+12,62,-T+6,.8,W[3]);r(60,-T+3,6,6,EDGE);r(60.5,-T+3.5,5,5,'#c9a24a');
   for(const [x,y] of [[12,-T+18],[20,-T+20]]){e(x,y,3,3,EDGE);e(x,y,2.2,2.2,'#1f2024');}l(66,-T+16,76,-T+20,1,'#c9622a');r(70,-T+8,6,2,'#8a8f94');}},
 // Gadget's parts counter: a slab across two crates, bins of sorted parts on the shelf, and the token tin on top.
 partscounter(g,o){const {e,r,l}=g,w=o.w,h=o.h,top=28;e(w/2,h,w/2+6,6,SHADOW);
  r(-.5,-top-.5,w+1,h+4,EDGE);r(.5,-top+.5,w-1,h-1,'#8f8b7f');r(.5,-top+.5,w-1,.5,'#b3afa2');for(let k=0;k<5;k++)r(4+hash(k,7)*(w-30),-top+3+hash(7,k)*(h-6),12+hash(k,8)*14,.5,'#7d7a70');
  r(.5,h-top,w-1,3,'#7d7a70');r(.5,h-top+2.5,w-1,.5,'#3a3630');const F=h-top+3;r(56,F,w-112,top-3.5,'#14120f');r(60,F+10,w-120,1.5,'#3a3630');
  // Bins: wheels, batteries, sheet scraps, broom heads.
  for(let k=0;k<4;k++){const x=60+k*16;r(x,F+3,14,7,EDGE);r(x+.5,F+3.5,13,6,['#3a5a8a','#b33a2a','#c9a23a','#3f6a3a'][k]);r(x+.5,F+3.5,13,1,'#ffffff44');}
  for(let k=0;k<4;k++){const x=62+k*16;if(k===0){e(x+3,F+3,2,2,'#1f2024');e(x+8,F+3,2,2,'#1f2024');}else if(k===1){r(x+1,F+1,4,3,'#2a2c31');r(x+6,F+1,4,3,'#2a2c31');}else if(k===2){r(x,F+1,10,2,'#46607c');}else{r(x+1,F,8,3,'#a0803a');}}
  for(const x of [6,w-50]){r(x-.5,F,45,top-3.5,EDGE);r(x,F,44,top-4,OLIVE[1]);r(x,F,44,.5,OLIVE[2]);r(x+2,F+3,40,.5,OLIVE[3]);const s=x<w/2?'PARTS':'TOKENS';text(g,s,x+22-textWidth(s,1.5)/2,F+9,1.5,'#c9c3a0');r(x+2,F+5,4,1.5,'#1a1b1e');r(x+38,F+5,4,1.5,'#1a1b1e');}
  // On top: a bathroom scale, the token tin and a roll of tickets, a bell, a clipboard and a robot head with its eyes crossed out.
  r(10,-22,22,14,EDGE);r(10.5,-21.5,21,13,'#d6d0c2');r(14,-19,14,5,'#2a2c31');r(16,-18,10,3,'#9fe0d8');r(20,-18,.5,3,'#b33a2a');
  r(42,-20,26,12,EDGE);r(42.5,-19.5,25,11,'#5c636b');r(42.5,-19.5,25,1,'#8a8f94');for(let k=0;k<6;k++){r(45+k*3.5,-17,3,6,'#e07a2c');r(45+k*3.5,-17,3,.5,'#f2c46a');}e(80,-12,6,3,EDGE);e(80,-12.5,5.3,2.4,'#e07a2c');e(80,-12.5,2,1,'#c4c9ce');
  e(100,-12,5,2.5,EDGE);e(100,-14,3.5,3,EDGE);e(100,-14.3,3,2.5,'#c9a24a');r(99.5,-18,1,2,EDGE);
  r(114,-22,14,16,EDGE);r(114.5,-21.5,13,15,'#d6cfbf');r(118,-23,6,2,'#8a8f94');for(let k=0;k<5;k++)r(116,-18+k*2.4,8+hash(k,2)*2,.5,k%2?'#b33a2a':'#6a6f78');
  e(150,-12,9,7,EDGE);e(150,-12.3,8.3,6.3,'#b5ad9c');e(148,-14,5,3,'#d6cfbf');for(const x of [147,153]){l(x-1.2,-13.7,x+1.2,-11.3,.6,'#1c1d22');l(x-1.2,-11.3,x+1.2,-13.7,.6,'#1c1d22');}r(146,-8,8,.5,'#1c1d22');l(156,-16,160,-26,.6,EDGE);e(160,-26.5,1.2,1.2,'#5a1f1a');},
 // The gate: a chain-link panel on a pipe frame, padlocked while a Holdout runs.
 gatedoor(g,o){const {e,r,l}=g,w=o.w,h=o.h,z=o.z,F=h-z;e(w/2,h,w/2+2,3,SHADOW);
  r(-.5,-z-.5,w+1,3,EDGE);r(0,-z,w,2,M[3]);r(0,-z,w,.5,'#c4c9ce');
  for(const x of [0,w/2-1.5,w-3]){r(x-.5,F-.5,4,z+1,EDGE);r(x,F,3,z,M[2]);r(x,F,1,z,'#c4c9ce');}for(const y of [F,F+z/2,h-3]){r(0,y-.5,w,3,EDGE);r(0,y,w,2,M[2]);r(0,y,w,.5,'#c4c9ce');}
  for(let k=-z;k<w;k+=4){l(Math.max(0,k),F+Math.max(0,-k),Math.min(w,k+z),F+Math.min(z,w-k),.5,'#9aa0a688');l(Math.min(w,k+z),F+Math.max(0,k+z-w),Math.max(0,k),F+Math.min(z,z+k),.5,'#7a808688');}
  r(w/2-4,F+z/2+1,8,7,EDGE);r(w/2-3.5,F+z/2+1.5,7,6,'#c9a24a');r(w/2-2,F+z/2-2,4,3.5,EDGE);r(w/2-.5,F+z/2+3,1,2,'#3a3a3e');
  r(12,F+6,20,10,'#e8e0d1');r(12,F+6,20,2,'#b33a2a');text(g,'HOT',14,F+9,1.5,'#b33a2a');},
 crate(g,o){const {e,r}=g,w=o.w,h=o.h,z=o.z;e(w/2+3,h,w/2+5,5,SHADOW);blk(g,0,0,w,h,z,OLIVE[2],OLIVE[1]);
  r(.5,-z+.5,w-1,1,OLIVE[3]);for(let x=w/3;x<w-2;x+=w/3)r(x,-z+1,.5,h-2,OLIVE[0]);r(2,h-z+2,w-4,.5,OLIVE[3]);r(2,h-3,w-4,.5,OLIVE[0]);for(const x of [3,w-6])r(x,h-z+3,3,z-6,OLIVE[0]);
  const s=hash(o.x,o.y)>.5?'LEET':'AMMO';if(z>=20)text(g,s,w/2-textWidth(s,1.5)/2,h-z/2-3.5,1.5,'#c9c3a0');splat(g,w*.3,h-z+5,1.8,PAINTS[Math.floor(hash(o.y,o.x)*5)],o.x+1,false);},
 drum(g,o){const {e,r}=g,cols=hash(o.x,o.y)>.5?['#2a3a5a','#34496e','#435b84']:['#5a2a24','#6e342c','#84443a'];e(14,16,16,5,SHADOW);r(1,-27,24,40,EDGE);e(13,13,12,4,EDGE);r(2,-27,22,40,cols[1]);e(13,13,11,3.2,cols[1]);r(2,-27,5,40,cols[2]);r(19,-27,5,40,cols[0]);
  for(const y of [-16,-2])r(1.5,y,23,1.5,cols[0]);e(13,-27,12,4.5,EDGE);e(13,-27,11,3.6,cols[2]);e(16,-27.5,2,1,EDGE);
  for(let k=0;k<4;k++)r(3+hash(k,o.x)*18,-24+hash(o.y,k)*30,1.5,2+hash(k,3)*5,RUST);r(9,-10,8,6,'#c9a23a');r(10,-9,6,4,'#1c1d21');splat(g,6+hash(o.x,2)*14,-12+hash(2,o.y)*16,2,PAINTS[Math.floor(hash(o.x,5)*5)],o.x,false);}};
// Broken glass left on a sill.
function p3(g,x,y){g.p([[x,y],[x+2.5,y-.5],[x+1,y+1.5]],'#9fc4cc');g.r(x+.5,y,.5,.5,'#e0f0f4');}
// A lit laptop also gets a sticker or two.
function p8(g,x,y,sw,sh){g.r(x+sw-5,y+sh+1,4,2,'#2a2c31');g.r(x-2,y+sh+1.5,sw+4,3,EDGE);g.r(x-1.5,y+sh+2,sw+3,2,'#3a3d44');}
export function propArt(c,o){if(!TG_ART[o.kind])return campPropArt(c,o);c.save();c.scale(2,2);c.translate(PROP_PAD,o.z+PROP_PAD);TG_ART[o.kind](painter(c),o);c.restore();}
export {PROP_PAD};
export const WORKSHOP_KINDS=Object.keys(TG_ART);
