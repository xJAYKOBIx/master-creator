// Shops and gas station: strip-mall units (a diner, a pharmacy, a hardware store, and one looted and boarded up), the gas
// station's store, its pump canopy, pumps and tall price sign, and the things that stand round them: dumpsters, an ice freezer,
// shopping carts, newspaper boxes and a payphone. Same view as the street set: footprint top left at (0, 0), height rising into
// negative y, roofs seen from above and fronts facing south.
import {hash2 as hash} from '../core/paint.js';
import {EDGE,SHADOW} from './camp.js';
// Flat roofs, the strip's stucco front, its brick piers, plate glass and the aluminium round it, the plywood the looters left.
const RF=['#26282a','#303234','#3a3c3e','#46484a','#55575a'],FA=['#2e2a26','#3e3832','#4e463e','#5e554b','#6c6256'],BR=['#2e201c','#3e2a24','#4e362e','#5e4438'];
const GL=['#0b0f14','#141c26','#22303e','#36485a'],AL=['#2a2c30','#4a4d52','#6c7179','#8e939b'],PW=['#3a3024','#4e4230','#62543c','#76664a'];
// Each shop's awning (dark to light) and stripe, and its sign: panel, lettering. Diner, pharmacy, hardware, looted.
const AWN=[['#3e1616','#5a2222','#743030','#8a4440'],['#14261c','#203828','#2c4a36','#3c5c46'],['#16223a','#22324c','#2e4262','#3e5478'],['#2e2422','#42322e','#54423c','#66544a']];
const STRIPE=[['#8a8478','#a8a296'],['#8a8a7c','#a8a89a'],['#8a8478','#a8a296'],['#5a524a','#6e665c']];
const SIGN=[['#5a1e1c','#c8b89a'],['#1e3a2a','#c8c8b8'],['#1e2e4a','#c8b060'],['#383634','#5c5852']];
// Gas station paint: the brand's red and amber, the canopy's white metal.
const CT=['#3e4042','#56585a','#66686a','#747678','#828486'];
const BRAND=['#4a1a18','#6a2624','#8a3a32'],AMBER='#9a6a2a',WH=['#4a4c4c','#62646a','#7c7e80','#9a9c9a','#b4b6b2'];
const DUMP=[['#14221a','#1e3226','#2a4434','#385640'],['#16203a','#20304c','#2c405e','#3c5272'],['#2e1c14','#44281a','#5c3822','#704a30']];
const NEWS=[['#16223a','#22324c','#2e4262','#3e5478'],['#3e1616','#5a2222','#743030','#8a4440'],['#14261c','#203828','#2c4a36','#3c5c46']];
const at=(g,dx,dy)=>({r:(x,y,w,h,c)=>g.r(x+dx,y+dy,w,h,c),p:(pts,c)=>g.p(pts.map(([x,y])=>[x+dx,y+dy]),c),e:(x,y,rx,ry,c)=>g.e(x+dx,y+dy,rx,ry,c),l:(x1,y1,x2,y2,w,c)=>g.l(x1+dx,y1+dy,x2+dx,y2+dy,w,c)});
// A box standing on something: x and the screen y of its front foot yb, w wide, d deep, hh tall; top face T, front face F.
function box(g,x,yb,w,d,hh,T,F,hi){const {r}=g;r(x-.5,yb-hh-d-.5,w+1,hh+d+1,EDGE);r(x,yb-hh-d,w,d,T);r(x,yb-hh,w,hh,F);if(hi)r(x,yb-hh-d,w,.5,hi);r(x,yb-hh,w,.5,'#ffffff18');}
// Rooftop gear: a condenser with its fan grille, and a mushroom vent, each throwing a short shadow down and right onto the roof.
function hvac(g,x,yb){const {r,e,l}=g;r(x+3,yb-20,34,22,'#0000002c');box(g,x,yb,32,20,10,RF[4],RF[2],'#6a6c70');const cx=x+16,cy=yb-20;
 e(cx,cy,7.5,6,EDGE);e(cx,cy,7,5.5,RF[1]);e(cx,cy,2,1.6,RF[3]);l(cx-6.5,cy,cx+6.5,cy,.5,RF[3]);l(cx,cy-5,cx,cy+5,.5,RF[3]);for(let y=yb-8;y<yb-1;y+=2)r(x+2,y,28,.5,RF[1]);}
function vent(g,x,yb){const {r,e}=g;e(x+3,yb+.5,5,2,'#0000002c');r(x-2,yb-7,4,7.5,EDGE);r(x-1.5,yb-7,3,7,RF[3]);r(x-1.5,yb-7,1,7,RF[4]);e(x,yb-7.5,4,2,EDGE);e(x,yb-8,3.5,1.6,RF[4]);}
// A flat roof from y top to y bot: tar membrane with seams and stains, a parapet along the back and front (and the ends when asked).
function roof(g,w,top,bot,endL,endR,s){const {r,e}=g;r(0,top,w,bot-top,RF[1]);for(let y=top+18;y<bot-8;y+=20){r(0,y,w,.5,RF[0]);r(0,y+.5,w,.5,RF[2]);}
 for(let i=0;i<3;i++)e(16+hash(i,s)*(w-32),top+12+hash(s,i)*(bot-top-28),10+hash(i,s+2)*14,4+hash(i+5,s)*4,'#00000016');
 r(0,top,w,3,RF[3]);r(0,top,w,.5,RF[4]);r(0,top+3,w,1.5,'#00000030');r(0,bot-4,w,4,RF[3]);r(0,bot-4,w,.5,RF[4]);r(0,bot-5.5,w,1.5,'#00000030');
 if(endL){r(0,top,4,bot-top,RF[3]);r(0,top,.5,bot-top,RF[4]);r(4,top+4.5,1.5,bot-top-10,'#00000030');}if(endR){r(w-4,top,4,bot-top,RF[2]);r(w-.5,top,.5,bot-top,RF[1]);}}
// Brick lines on a pier or a bulkhead; rows sit on fixed heights so neighbouring units line up.
function brick(g,x,y0,w,y1,B){const {r}=g;r(x,y0,w,y1-y0,B[1]);for(let y=Math.ceil(y0/3)*3;y<y1;y+=3)r(x,y,w,.5,B[0]);}
// A plate-glass pane with its frame, mullions and the moon's reflection running across it in diagonal streaks.
function pane(g,x0,y0,x1,y1,s,inside){const {r,p}=g,w=x1-x0,h=y1-y0;r(x0-1,y0-1,w+2,h+2,EDGE);r(x0-.5,y0-.5,w+1,h+1,AL[1]);r(x0+.5,y0+.5,w-1,h-1,GL[1]);r(x0+.5,y0+.5,w-1,h*.4,GL[0]);
 if(inside)inside(x0+.5,y0+.5,x1-.5,y1-.5);for(let i=0;i<Math.ceil(w/26);i++){const a=x0+8+hash(i,s)*(w-16),k=3+hash(s,i)*6;p([[a,y0+.5],[a+k,y0+.5],[Math.max(x0+.5,a+k-h*.5),y1-.5],[Math.max(x0+.5,a-h*.5),y1-.5]],'#c8d8e80c');}
 const n=Math.max(1,Math.round(w/52));for(let i=1;i<n;i++){const mx=x0+w*i/n;r(mx-1,y0,2,h,AL[1]);r(mx-1,y0,.5,h,AL[3]);}r(x0,y0,w,.5,AL[3]);r(x0,y1-1.5,w,1.5,AL[2]);}
// Sign lettering with no real text: words of upright blocks, each notched so it reads as a letter at a glance.
function letters(g,cx,cy,n,s,col,bg,miss=0){const {r}=g,words=[];let tot=0;for(let i=0,k=0;i<n;k++){const len=Math.min(n-i,3+Math.floor(hash(k,s)*4));words.push(len);i+=len;tot+=len*6+5;}
 let x=cx-(tot-5)/2;words.forEach((len,k)=>{for(let j=0;j<len;j++){const v=hash(j+k*9,s+1);if(hash(j,k+s)>=miss){r(x,cy-4,4.5,8,col);r(x+1.5,cy+(v<.5?-2.5:.5),1.5,2.5,bg);if(v>.8)r(x+1.5,cy-4,1.5,1.5,bg);}x+=6;}x+=5;});}
// The ICE freezer's cabinet, shared with the gas station's store: white, a blue band with a frost mark, two doors.
function freezer(g,w,h,z){const {r,l,e}=g,yf=h-z+Math.min(h,z*.2);e(w/2,h,w/2+2,2.5,SHADOW);r(-.5,-z-.5,w+1,h+z+1,EDGE);r(0,-z,w,h,WH[3]);r(0,-z,w,.5,WH[4]);for(let x=4;x<w-4;x+=3)r(x,-z+2,1.5,h-5,WH[2]);
 r(0,h-z,w,z,WH[2]);r(0,h-z,w,.5,WH[4]);const bh=Math.max(5,z*.26),by=h-z+1;r(0,by,w,bh,'#2c4466');r(0,by,w,.5,'#3e5a80');r(0,by+bh-.5,w,.5,'#1e304a');
 const fx=5,fy=by+bh/2,q=bh*.34;for(const a of [0,60,120]){const c=Math.cos(a*Math.PI/180)*q,s=Math.sin(a*Math.PI/180)*q;l(fx-c,fy-s,fx+c,fy+s,.75,'#c8d4e0');}letters(g,w/2+3,fy,Math.max(2,Math.floor((w-16)/7)),11,'#b8c4d0','#2c4466');
 const dy=by+bh+1.5,dh=h-dy-3;r(1.5,dy,w-3,dh,WH[3]);r(w/2-.25,dy,.5,dh,WH[0]);r(1.5,dy,w-3,.5,WH[4]);for(const x of [w/2-3,w/2+2])r(x,dy+2,1,Math.min(6,dh-4),WH[0]);r(1.5,h-3,w-3,2.5,WH[0]);for(let x=3;x<w-3;x+=2)r(x,h-2.5,1,1.5,'#2a2c2e');}
export const SHOP_ART={
 // One unit of a strip mall: flat roof with a parapet and a condenser or vent, a sign band, a striped awning, plate glass and a glass
 // door. variant 0 diner, 1 pharmacy, 2 hardware, 3 looted (boarded, glass on the walk, awning in rags). Units butt side by side;
 // endL / endR give the strip its end walls. The sign, door and rooftop gear move with the variant and x so a strip does not repeat.
 storefront(g,o){const {r,p,e,l}=g,w=o.w,h=o.h,z=o.z,v=Math.min(3,Math.max(0,o.variant|0)),y0=h-z,L=!!o.endL,R=!!o.endR,s=(o.x|0)*7+v*31+3,A=AWN[v],S=STRIPE[v],SG=SIGN[v],dead=v===3;
  r(L?-3:0,h,w+(L?3:0)+(R?3:0),3,SHADOW);r(L?-2:0,h,w+(L?2:0)+(R?2:0),1.5,SHADOW);
  r(0,-z-.5,w,h+z+1,EDGE);if(L)r(-.5,-z-.5,.5,h+z+1,EDGE);if(R)r(w,-z-.5,.5,h+z+1,EDGE);
  // The roof, its gear, and the front parapet's coping.
  roof(g,w,-z,y0,L,R,s);const hx=24+Math.floor(hash(v+3,s)*(w-90));hvac(g,hx,-z+40+hash(s,2)*(h-66));vent(g,hx>w/2?hx-30-hash(s,4)*30:hx+60+hash(s,4)*40,y0-12-hash(s,5)*30);
  {const kx=hx>w/2?30+hash(s,6)*40:w-70-hash(s,6)*40,ky=-z+30+hash(s,7)*40;r(kx+2,ky-14,18,16,'#0000002c');box(g,kx,ky,16,14,3,RF[3],RF[2],RF[4]);r(kx+2,ky-15,12,9,RF[2]);r(kx+2,ky-15,12,.5,RF[1]);}
  // The front: stucco with a cornice, a half brick pier at each edge (two neighbours make a whole one) or a full pier at an end.
  r(0,y0,w,z,FA[2]);r(0,y0,w,1.5,FA[4]);r(0,y0+2.5,w,.5,FA[1]);r(0,y0+22,w,.5,FA[1]);
  const pl=L?10:5,pr=R?10:5;brick(g,0,y0+3,pl,h,BR);brick(g,w-pr,y0+3,pr,h,BR);if(L)r(0,y0+3,1,z-3,BR[3]);if(R)r(w-1,y0+3,1,z-3,BR[0]);r(pl,y0+3,.5,z-3,FA[1]);r(w-pr-.5,y0+3,.5,z-3,FA[1]);
  // The sign band: a lit-box panel with block lettering; the pharmacy's has a cross, the looted one is faded and missing pieces.
  const sx0=pl+10,sx1=w-pr-10,sy=y0+5,sh=15;r(sx0-1,sy-1,sx1-sx0+2,sh+2,EDGE);r(sx0,sy,sx1-sx0,sh,SG[0]);r(sx0,sy,sx1-sx0,.5,'#ffffff22');r(sx0,sy+sh-1,sx1-sx0,1,'#00000030');
  const nl=Math.min(16,Math.floor((sx1-sx0-40)/7));letters(g,(sx0+sx1)/2+(v===1?8:0),sy+sh/2,nl,v*13+5,SG[1],SG[0],dead?.35:0);
  if(v===1){const cx=sx0+12,cy=sy+sh/2;e(cx,cy,6,6,SG[1]);r(cx-1.5,cy-4.5,3,9,'#2e6a44');r(cx-4.5,cy-1.5,9,3,'#2e6a44');}
  if(dead){l(sx0+30,sy,sx0+46,sy+sh,.75,'#1a1a1a');r(sx1-40,sy+3,9,7,'#141416');p([[sx1-8,sy+sh],[sx1,sy+sh],[sx1,sy+sh+6],[sx1-3,sy+sh+5]],SG[0]);}
  // Plate glass either side of the door, with a hint of the shop inside; the looted shop's are boarded over.
  const ay=y0+25,av=ay+11,wy0=av+5,wy1=h-9,dw=28,dx=Math.round([w*.62,pl+26,w*.5-14,w*.62][v]+(hash(s,9)-.5)*20);
  const inside=(x0,y0_,x1,y1)=>{const ww=x1-x0,ih='#2a3644';if(v===0){r(x0,y1-11,ww,1.5,ih);for(let x=x0+6;x<x1-4;x+=12){r(x,y1-9.5,1,6,'#1e2832');e(x+.5,y1-10,2.5,1,ih);}for(let x=x0+12;x<x1-6;x+=30){r(x,y0_,.5,6,ih);p([[x-3,y0_+9],[x+3.5,y0_+9],[x+2,y0_+6],[x-1.5,y0_+6]],ih);}}
   else if(v===1||v===2){for(let y=y0_+8;y<y1-3;y+=8){r(x0,y,ww,1,ih);for(let x=x0+2;x<x1-4;x+=4+hash(x|0,y|0)*5)r(x,y-3,2.5,3,v===1?(hash(y|0,x|0)>.5?'#2e3e3a':'#3a3440'):'#2c3038');}}};
  for(const [a,b] of [[pl+3,dx-3],[dx+dw+3,w-pr-3]])if(b-a>8){if(!dead)pane(g,a,wy0,b,wy1,s+a,inside);else{
   // Plywood sheets over the windows: seams, nail rows, a missing sheet with the smashed glass behind, and a spray-paint scrawl.
   r(a-1,wy0-1,b-a+2,wy1-wy0+2,EDGE);r(a-.5,wy0-.5,b-a+1,wy1-wy0+1,'#07090c');const n=Math.max(1,Math.round((b-a)/24)),sw=(b-a)/n;
   for(let i=0;i<n;i++){const x=a+i*sw,gone=n>2&&i===1+Math.floor(hash(a,s)*(n-2)),tilt=(hash(i,a)-.5)*3;if(gone){for(let k=0;k<5;k++)p([[x+hash(k,a)*sw,wy0],[x+hash(k,a)*sw+4,wy0],[x+hash(k+3,a)*sw,wy0+4+hash(a,k)*14]],GL[2]);continue;}
    p([[x+.5,wy0+tilt],[x+sw-.5,wy0-tilt],[x+sw-.5,wy1],[x+.5,wy1]],PW[1]);r(x+.5,wy0+Math.abs(tilt),sw-1,1,PW[3]);r(x+sw-1.5,wy0+1,1,wy1-wy0-1,PW[0]);r(x+.5,(wy0+wy1)/2,sw-1,.5,PW[0]);
    for(let k=0;k<3;k++){r(x+2+hash(k,i+a)*(sw-5),wy0+3+k*(wy1-wy0-6)/2,.75,.75,PW[0]);r(x+sw-3,wy0+3+k*(wy1-wy0-6)/2,.75,.75,PW[0]);}}
   for(let k=0;k<3;k++){const x=a+6+hash(k,s+a)*(b-a-20),y=wy0+6+hash(s+a,k)*12;l(x,y+6,x+5,y,1,'#7a3030');l(x+5,y,x+9,y+7,1,'#7a3030');l(x+9,y+7,x+14,y+1,1,'#7a3030');}}}
  // The bulkhead under the glass: brick with a concrete sill.
  brick(g,pl,wy1,dx-pl,h,BR);brick(g,dx+dw,wy1,w-pr-dx-dw,h,BR);r(pl,wy1,dx-pl,1.5,FA[4]);r(dx+dw,wy1,w-pr-dx-dw,1.5,FA[4]);r(pl,wy1+1.5,w-pl-pr,.5,FA[1]);
  // The door: a pair of glass leaves in an aluminium frame with push bars. Looted, the glass is gone and a board is nailed across.
  r(dx-1,wy0-1,dw+2,h-wy0+1,EDGE);r(dx-.5,wy0-.5,dw+1,h-wy0+.5,AL[1]);r(dx-.5,wy0-.5,dw+1,.5,AL[3]);for(const x of [dx+2,dx+dw/2+1]){r(x,wy0+2,dw/2-3,h-wy0-6,dead?'#07090c':GL[1]);if(!dead){r(x,wy0+2,dw/2-3,(h-wy0)*.35,GL[0]);p([[x+3,wy0+2],[x+6,wy0+2],[x+3,h-4],[x,h-4]],'#c8d8e80c');}r(x,h-4,dw/2-3,3.5,AL[0]);}
  r(dx+dw/2-.5,wy0,1,h-wy0,AL[0]);if(!dead){r(dx+dw/2-3.5,wy0+(h-wy0)*.45,2,6,AL[3]);r(dx+dw/2+1.5,wy0+(h-wy0)*.45,2,6,AL[3]);}
  else{for(let k=0;k<4;k++)p([[dx+2+hash(k,s)*6,wy0+2],[dx+5+hash(k,s)*6,wy0+2],[dx+3+hash(s,k)*4,wy0+6+hash(k,7)*6]],GL[2]);p([[dx-3,wy0+12],[dx+dw+3,wy0+18],[dx+dw+3,wy0+23],[dx-3,wy0+17]],EDGE);p([[dx-2.5,wy0+12.5],[dx+dw+2.5,wy0+18.5],[dx+dw+2.5,wy0+22.5],[dx-2.5,wy0+16.5]],PW[2]);}
  // The awning's shadow on the glass, then the awning: the sloped top lit from above, a valance with scalloped hem. Torn, it is a bare
  // frame with rags of fabric hanging from it.
  const a0=pl+3,a1=w-pr-3,sw=8;r(a0,av+4,a1-a0,7,'#00000038');r(a0,av+4,a1-a0,3,'#00000030');
  if(!dead){r(a0-.5,ay-.5,a1-a0+1,av-ay+5.5,EDGE);for(let x=a0,k=0;x<a1;x+=sw,k++){const ww=Math.min(sw,a1-x),st=k%2;r(x,ay,ww,av-ay,st?S[1]:A[2]);r(x,av,ww,4,st?S[0]:A[1]);e(x+ww/2,av+4,ww/2,1.6,EDGE);e(x+ww/2,av+4,ww/2-.5,1.1,st?S[0]:A[1]);}
   r(a0,ay,a1-a0,.5,'#ffffff30');r(a0,av-.5,a1-a0,.5,'#00000030');r(a0,ay+(av-ay)*.55,a1-a0,.5,'#ffffff10');}
  else{l(a0,ay,a1,ay,1.5,EDGE);l(a0,av,a1,av,1.5,EDGE);r(a0,ay-.25,a1-a0,.5,AL[2]);r(a0,av-.25,a1-a0,.5,AL[2]);for(let x=a0;x<=a1;x+=24){l(x,ay,x,av,1.5,EDGE);r(x-.25,ay,.5,av-ay,AL[2]);}
   for(let x=a0,k=0;x<a1-2;x+=sw,k++){if(hash(k,s)<.4)continue;const ww=Math.min(sw,a1-x)-.5,st=k%2,d=4+hash(s,k)*9,j=hash(k+1,s);
    p([[x,ay-.5],[x+ww,ay-.5],[x+ww,av+d*.4],[x+ww*j,av+d],[x,av+d*.6]],EDGE);p([[x+.5,ay],[x+ww-.5,ay],[x+ww-.5,av+d*.4-.5],[x+ww*j,av+d-.8],[x+.5,av+d*.6-.5]],st?S[1]:A[2]);r(x+.5,av,ww-1,.5,'#00000030');}
   // Broken glass glinting on the walk below the windows.
   for(let i=0;i<40;i++){const x=pl+hash(i,s+1)*(w-pl-pr),y=h+1.5+hash(s+1,i)*9,k=1+hash(i,s+2)*1.8;p([[x,y],[x+k,y-.4],[x+k*.6,y+k*.5]],i%3?'#8aa0b0':'#c8d8e4');}}},
 // The gas station's convenience store: flat roof, big windows plastered with faded posters, a glass door, the ICE freezer by the
 // door and a propane cage at the end, both on the concrete apron along the front (the last 12 units of the footprint). lit leaves
 // one dim battery light on inside.
 gasstore(g,o){const {r,p,e,l}=g,w=o.w,h=o.h,z=o.z,A=12,hb=h-A,y0=hb-z,s=(o.x|0)+17;
  r(-4,hb,w+8,A+2,'#ffffff07');r(-4,h+1.5,w+8,.5,'#ffffff06');r(-2,hb,w+4,2.5,SHADOW);r(0,-z-.5,w,hb+z+1,EDGE);r(-.5,-z-.5,w+1,hb+z+1,EDGE);
  roof(g,w,-z,y0,1,1,s);hvac(g,w*.62,-z+36);hvac(g,w*.62+40,-z+36);vent(g,w*.2,-z+50);vent(g,w*.3,y0-14);
  // The front: block wall, the brand band across the top, brick piers at the corners.
  r(0,y0,w,z,WH[1]);r(0,y0,w,1.5,WH[3]);const fb=14;r(0,y0+1.5,w,fb,BRAND[1]);r(0,y0+1.5,w,.5,BRAND[2]);r(0,y0+4,w,1.5,'#a8a296');r(0,y0+fb-2.5,w,1.5,AMBER);r(0,y0+fb+1.5,w,1,'#00000040');
  for(let y=y0+fb+5;y<hb;y+=4)r(0,y,w,.5,WH[0]);brick(g,0,y0+fb+1.5,8,hb,BR);brick(g,w-8,y0+fb+1.5,8,hb,BR);r(0,y0+fb+1.5,1,hb-y0-fb-1.5,BR[3]);
  const wy0=y0+fb+6,wy1=hb-10,dw=30,dx=Math.round(w*.56);
  // The dim light inside, drawn before the glass so it glows through it and the posters stand dark against it.
  const lx=w*.24,ly=wy0+14,glow=(x0,y0_,x1,y1)=>{if(!o.lit||lx<x0||lx>x1)return;for(let i=9;i>0;i--)e(lx,ly+4,i*4.5,i*3,'#d8c8900a');r(lx-4,wy0+1,8,1.5,'#e8dcb0');e(lx,ly-2,6,3,'#e8dcb030');};
  for(const [a,b] of [[11,dx-3],[dx+dw+3,w-11]]){pane(g,a,wy0,b,wy1,s+a,glow);
   // Posters taped up inside the glass, sun-faded, one or two with a corner peeled down.
   const n=Math.floor((b-a)/30);for(let i=0;i<n;i++){const pw=14+hash(i,s+a)*10,ph=16+hash(s+a,i)*10,x=a+4+i*(b-a-8)/n+hash(i+2,a)*((b-a-8)/n-pw),y=wy0+3+hash(a,i+3)*(wy1-wy0-ph-6);if(hash(i,a+5)<.25)continue;
    const P=['#6e6450','#56646e','#6e5248','#5e6e52','#7a7262'][Math.floor(hash(i+a,s)*5)],Q=['#4a5a66','#6a4a3e','#5a5a3a','#3e4e5a'][Math.floor(hash(a,i+s)*4)];
    r(x,y,pw,ph,P);r(x+1.5,y+1.5,pw-3,3,Q);if(hash(i,a)>.5)e(x+pw/2,y+ph*.5,pw*.28,ph*.18,Q);else r(x+2,y+6,pw-4,ph*.36,Q);for(let k=0;k<3;k++)r(x+2,y+ph-7+k*2,(pw-4)*(1-k*.25),.75,'#2a2a26');
    if(hash(a,i)>.6){p([[x+pw,y+ph],[x+pw-5,y+ph],[x+pw,y+ph-5]],GL[1]);p([[x+pw-5,y+ph],[x+pw,y+ph-5],[x+pw-4,y+ph-4]],'#8a8270');}}}
  brick(g,8,wy1,dx-8,hb,BR);brick(g,dx+dw,wy1,w-8-dx-dw,hb,BR);r(8,wy1,dx-8,1.5,WH[3]);r(dx+dw,wy1,w-8-dx-dw,1.5,WH[3]);
  // The glass door.
  r(dx-1,wy0-1,dw+2,hb-wy0+1,EDGE);r(dx-.5,wy0-.5,dw+1,hb-wy0+.5,AL[1]);r(dx-.5,wy0-.5,dw+1,.5,AL[3]);r(dx+2,wy0+2,dw-4,hb-wy0-6,GL[1]);r(dx+2,wy0+2,dw-4,(hb-wy0)*.4,GL[0]);p([[dx+6,wy0+2],[dx+10,wy0+2],[dx+6,hb-4],[dx+2,hb-4]],'#c8d8e80c');
  r(dx+2,hb-4,dw-4,3.5,AL[0]);r(dx+4,wy0+(hb-wy0)*.45,dw-8,1.5,AL[3]);r(dx+5,wy0+5,10,7,'#6e6450');r(dx+6,wy0+6,8,2,'#4a5a66');
  if(o.lit)e(dx+dw/2,hb+5,40,5,'#d8c89010');
  // The propane cage at the left end: white frame, mesh, and two shelves of tanks behind it, a red panel across the top.
  {const cx=6,cw=40,cd=10,ch=34,yb=h-.5;e(cx+cw/2,yb,cw/2+3,2.5,SHADOW);box(g,cx,yb,cw,cd,ch,WH[3],'#121416','#c8cac4');const fy=yb-ch;
   for(const [ty,th] of [[fy+4,13],[fy+19,13]])for(let i=0;i<5;i++){const tx=cx+3+i*7.4;r(tx,ty+2,6,th-2,WH[2]);r(tx,ty+2,1.5,th-2,WH[4]);r(tx+1.5,ty,3,2.5,WH[1]);r(tx,ty+th-2,6,.75,'#2a2c2e');}
   r(cx,fy+17.5,cw,1.5,WH[2]);for(let x=cx+2;x<cx+cw;x+=2.5)r(x,fy,.5,ch,'#c8cac438');for(let y=fy+2;y<yb;y+=2.5)r(cx,y,cw,.5,'#c8cac430');
   r(cx,fy,1.5,ch,WH[4]);r(cx+cw-1.5,fy,1.5,ch,WH[2]);r(cx+cw/2-.75,fy,1.5,ch,WH[3]);r(cx,yb-1.5,cw,1.5,WH[2]);r(cx+3,fy-cd+2,cw-6,5,BRAND[1]);r(cx+3,fy-cd+2,cw-6,.5,BRAND[2]);r(cx+8,fy-cd+4,cw-16,1.2,'#c8b89a');}
  // The ICE freezer by the door.
  freezer(at(g,dx+dw+8,hb+1),42,10,30);},
 // The pump canopy: a flat slab on square pillars. The roof is seen from above, its coloured fascia along the front, and the ground
 // under it shows through, shaded. The back pillars stand hidden under the roof in this view. lit makes the lights under the front
 // edge glow and throws their pools onto the ground.
 canopy(g,o){const {r,p,e,l}=g,w=o.w,h=o.h,z=o.z,t=10,yt=-z,yf=h-z,yb=yf+t,pw=10,ins=14,lit=!!o.lit,n=Math.max(3,Math.round(w/50));
  r(0,yb,w,h-yb,'#100e0c22');if(lit)for(let i=0;i<n;i++){const x=24+i*(w-48)/(n-1);for(let k=8;k>0;k--)e(x,h-26,6+k*3.5,4+k*2.2,'#e8ecdc07');}
  // The front pillars: brick at the foot, white metal cladding up into the roof.
  for(const x of [ins,w-ins-pw]){e(x+pw/2,h-3,pw,2.5,SHADOW);r(x-.5,yb,pw+1,h-3-yb+.5,EDGE);r(x,yb,pw,h-3-yb,WH[3]);r(x,yb,2,h-3-yb,WH[4]);r(x+pw-2.5,yb,2.5,h-3-yb,WH[1]);brick(g,x,h-19,pw,h-3,BR);r(x,h-19,pw,1,WH[2]);r(x,h-19,pw,.5,'#000000');}
  if(lit)for(let i=0;i<n;i++){const x=24+i*(w-48)/(n-1);p([[x-5,yb+2],[x+5,yb+2],[x+20,h-22],[x-20,h-22]],'#f0ecd808');}
  // The roof slab: metal panels with seams running back, a lip round the edge.
  r(-.5,yt-.5,w+1,h+t+1,EDGE);r(0,yt,w,h,CT[2]);for(let x=10;x<w-4;x+=10){r(x,yt+2,.5,h-4,CT[1]);r(x+.5,yt+2,.5,h-4,CT[3]);}
  for(let i=0;i<4;i++)e(20+hash(i,7)*(w-40),yt+16+hash(7,i)*(h-36),14+hash(i,8)*14,5+hash(i,9)*4,'#00000012');
  r(0,yt,w,2,CT[4]);r(0,yt,2,h,CT[4]);r(w-2,yt,2,h,CT[1]);r(0,yf-2,w,2,CT[3]);r(2,yt+2,w-4,1,'#00000020');r(2,yt+2,1,h-4,'#00000018');
  // The fascia: brand red with a white and an amber stripe.
  r(0,yf,w,t,BRAND[1]);r(0,yf,w,.5,BRAND[2]);r(0,yf+2.5,w,1.5,'#a8a296');r(0,yf+t-3,w,1.5,AMBER);r(0,yb-1,w,1,BRAND[0]);
  // The lights under the front edge.
  for(let i=0;i<n;i++){const x=24+i*(w-48)/(n-1);r(x-7.5,yb-.5,15,3,EDGE);r(x-7,yb,14,2,lit?'#f4f0dc':'#3e4044');r(x-7,yb,14,.5,lit?'#ffffff':'#55575c');if(lit)r(x-9,yb+2,18,1.5,'#f4f0dc40');}},
 // A gas pump on its concrete island end: body, a dead display, buttons, the nozzle in its holster on the side and its hose. variant 1
 // has the hose pulled out and lying on the ground with the nozzle at the end of it.
 pump(g,o){const {r,p,e,l}=g,w=o.w,h=o.h,z=o.z,v=o.variant|0,x0=2,x1=w-2,d=h-4,yb=h-2,top=yb-z,ft=top+d;e(w/2,h,w/2+3,2.5,SHADOW);
  box(g,-1,h,w+2,h,2.5,'#5a5a56','#3e3e3c','#6a6a66');
  if(v===1){const pts=[[x1+1,ft+8],[x1+4,ft+14],[x1+5,ft+22],[x1+3,h-2],[x1+1,h+5],[x1+5,h+9],[x1+9,h+8.5]];for(let i=1;i<pts.length;i++)l(...pts[i-1],...pts[i],2,EDGE);for(let i=1;i<pts.length;i++)l(...pts[i-1],...pts[i],1,'#1c1d20');
   p([[x1+8,h+6.5],[x1+13,h+6],[x1+13.5,h+8.5],[x1+8.5,h+10]],EDGE);r(x1+9,h+7,4,2,'#2a2c30');r(x1+12,h+6.5,2.5,1,'#6c7179');}
  // The cabinet: top, front with a brand header, the display, buttons, and a louvred lower door.
  r(x0-.5,top-.5,x1-x0+1,yb-top+.5,EDGE);r(x0,top,x1-x0,d,WH[4]);r(x0,ft,x1-x0,yb-ft,WH[3]);r(x0,ft,1,yb-ft,WH[4]);r(x1-1.5,ft,1.5,yb-ft,WH[2]);
  r(x0,ft,x1-x0,5,BRAND[1]);r(x0,ft,x1-x0,.5,BRAND[2]);r(x0,ft+4,x1-x0,.75,AMBER);const dy=ft+7;r(x0+1.5,dy,x1-x0-3,8,EDGE);r(x0+2,dy+.5,x1-x0-4,7,'#1a221e');r(x0+3,dy+1.5,x1-x0-8,1,'#2a3a30');r(x0+3,dy+4,x1-x0-10,1,'#2a3a30');
  for(let k=0;k<3;k++)r(x0+2+k*3.5,dy+10,2.5,1.5,['#3a5a3a','#5a3a3a','#3a3a5a'][k]);r(x0+2,dy+13,x1-x0-4,.5,WH[2]);
  r(x0+1.5,dy+16,x1-x0-3,yb-dy-19,WH[2]);for(let y=dy+18;y<yb-4;y+=2)r(x0+2.5,y,x1-x0-5,.5,WH[1]);
  // The hose loops from the top of the side down to the holstered nozzle.
  if(v!==1){l(x1,ft+3,x1+3,ft+10,1.5,EDGE);l(x1+3,ft+10,x1+2,ft+20,1.5,EDGE);l(x1,ft+3,x1+3,ft+10,.75,'#1c1d20');l(x1+3,ft+10,x1+2,ft+20,.75,'#1c1d20');r(x1-1,ft+18,3.5,7,EDGE);r(x1-.5,ft+18.5,2.5,6,'#2a2c30');r(x1-.5,ft+18.5,2.5,.75,'#4a4d52');}
  else{r(x1-1,ft+18,2.5,6,'#1a1b1e');l(x1,ft+3,x1+1,ft+8,1.5,EDGE);}},
 // The tall price sign: one pole up the middle and a big box sign at the top, a brand header over three rows of grade bars and blank
 // price digits. lit makes the box glow.
 pricesign(g,o){const {r,p,e,l}=g,w=o.w,h=o.h,z=o.z,cx=w/2,bw=Math.min(90,w-6),bx=cx-bw/2,top=-z,bd=5,bh=50,fy=top+bd,by=fy+bh,lit=!!o.lit,face=lit?'#d8d6c8':'#6a6c68';
  e(cx,h-1,14,3,SHADOW);if(lit)for(let i=6;i>0;i--)e(cx,fy+bh/2-2,bw/2+i*3,bh/2+i*3,'#f0ecd808');
  // The pole and its footing.
  r(cx-3.5,by,7,h-2-by,EDGE);r(cx-3,by,6,h-2.5-by,WH[1]);r(cx-3,by,1.5,h-2.5-by,WH[2]);r(cx+1.5,by,1.5,h-2.5-by,WH[0]);box(g,cx-7,h,14,6,4,'#5a5a56','#3e3e3c');r(cx-6,by,12,3,EDGE);r(cx-5.5,by,11,2.5,WH[0]);
  // The box: its top, a metal frame and the lit face.
  r(bx-.5,top-.5,bw+1,bd+bh+1,EDGE);r(bx,top,bw,bd,WH[2]);r(bx,top,bw,.5,WH[3]);r(bx,fy,bw,bh,'#2a2c30');r(bx+2,fy+2,bw-4,bh-4,face);
  r(bx+2,fy+2,bw-4,13,lit?BRAND[2]:BRAND[1]);r(bx+2,fy+14,bw-4,1.5,AMBER);e(bx+14,fy+8.5,6,5,lit?'#e8e2d0':'#a8a296');e(bx+14,fy+8.5,3.5,2.8,lit?BRAND[2]:BRAND[1]);letters(g,cx+8,fy+8.5,8,41,lit?'#e8e2d0':'#a8a296',lit?BRAND[2]:BRAND[1]);
  for(let i=0;i<3;i++){const ry=fy+19+i*10.5,gc=['#3a6a44','#2e4e7a','#8a6a2a'][i];r(bx+5,ry+2,18,5,lit?gc:'#4a4c48');r(bx+5,ry+2,18,.5,'#ffffff20');
   for(let k=0;k<4;k++){const dx=bx+30+k*13-(k===3?2:0),dw=k===3?7:10.5;r(dx,ry,dw,9,'#16181c');const sc=lit?'#3a3c38':'#2a2c2e';r(dx+2,ry+1.2,dw-4,1,sc);r(dx+2,ry+4,dw-4,1,sc);r(dx+2,ry+6.8,dw-4,1,sc);r(dx+1.2,ry+1.5,1,6,sc);r(dx+dw-2.2,ry+1.5,1,6,sc);}
   if(i<2)r(bx+4,ry+9.8,bw-8,.5,lit?'#b8b6a8':'#5a5c58');}
  r(bx+2,fy+2,bw-4,.5,'#ffffff30');r(bx+2,fy+bh-2.5,bw-4,.5,'#00000030');},
 // A steel dumpster with two plastic lids. paint 0 green, 1 blue, 2 rust brown; open flips the left lid back so the bags show.
 dumpster(g,o){const {r,p,e,l}=g,w=o.w,h=o.h,z=o.z,P=DUMP[o.paint|0]||DUMP[0],top=-z,ft=h-z,lw=(w-2)/2,LD=['#1c1e22','#2a2d32','#3a3e44'];
  e(w/2,h,w/2+3,3,SHADOW);r(-.5,top-.5,w+1,h+z+1,EDGE);if(o.open)p([[1,top],[1+lw,top],[1+lw,top-10],[1,top-10]],EDGE);
  // The body: the rim on top, the ribbed front, rust streaks and scuffs, casters at the foot.
  r(0,top,w,h,P[2]);r(0,ft,w,z,P[1]);r(0,ft,w,1.5,P[3]);r(0,h-2,w,2,P[0]);for(let x=6;x<w-3;x+=8){r(x,ft+2,1.5,z-5,P[2]);r(x+1.5,ft+2,.5,z-5,P[0]);}r(-1,ft+4,w+2,3,EDGE);r(-.5,ft+4.5,w+1,2,P[2]);r(-.5,ft+4.5,w+1,.5,P[3]);
  for(let i=0;i<5;i++){const x=3+hash(i,o.x|0)*(w-6),y=ft+8+hash(o.x|0,i)*6;r(x,y,1,4+hash(i,3)*8,'#5a3420a0');}for(const x of [4,w-6])e(x+1,h-.5,2,1.5,'#0c0d10');
  // The lids: two dark panels with ribs; the open one stands up behind the rim, its underside showing, and the bags inside.
  const lid=(x,on)=>{if(on){r(x,top+1,lw,h-2,'#0a0b0d');for(let k=0;k<4;k++)e(x+5+hash(k,7)*(lw-10),top+6+hash(7,k)*(h-14),6,4,k%2?'#1e2a20':'#16181c');e(x+lw*.6,top+8,4,2.5,'#22262a');
     p([[x,top],[x+lw,top],[x+lw,top-9.5],[x,top-9.5]],LD[2]);r(x,top-9.5,lw,.5,LD[2]);for(let k=1;k<4;k++)r(x+k*lw/4,top-9,.5,9,LD[0]);return;}
   r(x+1,top+1.5,lw-2,h-4,LD[1]);r(x+1,top+1.5,lw-2,.5,LD[2]);for(let k=1;k<5;k++){r(x+k*lw/5,top+3,.5,h-8,LD[0]);r(x+k*lw/5+.5,top+3,.5,h-8,LD[2]);}r(x+lw-1.5,top+1.5,.5,h-4,LD[0]);r(x+1,ft-2.5,lw-2,2,LD[2]);r(x+1,ft-.5,lw-2,.5,LD[0]);};
  lid(1,!!o.open);lid(1+lw,false);},
 // A standalone ICE freezer: white cabinet, a blue band with a frost mark and no readable lettering, two doors.
 icebox(g,o){freezer(g,o.w,o.h,o.z);},
 // A shopping cart side on, the handle to the left: a wire basket over a wheeled frame. tipped lays it on its side, wheels up.
 shopcart(g,o){const {r,p,e,l}=g,w=o.w,h=o.h,z=o.z,M=['#4a4d52','#8e939b','#b0b5bc'],mesh=(pts,c)=>{p(pts,c);},
  wire=(x1,y1,x2,y2,k=.6,c=M[1])=>{l(x1,y1,x2,y2,k+.8,EDGE);l(x1,y1,x2,y2,k,c);};
  if(!o.tipped){const nd=h-2,fd=2,rt=z-2,bt=z*.45,yN=nd-rt,yF=fd-rt;e(w/2+1,h-.5,w/2+2,2,SHADOW);
   // The far wheels and frame, then the basket (far rim, mesh, near rim), then the near frame, wheels and handle.
   for(const x of [7,w-3])e(x,fd+.5,1.4,1.4,'#0c0d10');wire(6,fd-2,w-3,fd-2,.6,M[0]);
   p([[4,yF],[w-1,yF],[w-1,yN],[4,yN]],'#0d0e1060');for(let x=6;x<w-1;x+=2.5)r(x,yF,.4,yN-yF,'#8e939b40');for(let y=yF+2;y<yN;y+=2.5)r(4,y,w-5,.4,'#8e939b40');
   p([[4,yN],[w-1,yN],[w-2,nd-bt],[8,nd-bt]],'#0d0e1040');for(let k=0;k<6;k++){const f=k/5;l(4+f*(w-5),yN,8+f*(w-10),nd-bt,.4,'#8e939b70');}for(let k=1;k<4;k++){const f=k/4;l(4+f*4,yN+f*(rt-bt),w-1-f,yN+f*(rt-bt),.4,'#8e939b70');}
   wire(4,yF,w-1,yF);wire(4,yF,4,yN);wire(w-1,yF,w-1,yN);wire(4,yN,w-1,yN,.8,M[2]);wire(4,yN,8,nd-bt);wire(w-1,yN,w-2,nd-bt);wire(8,nd-bt,w-2,nd-bt);
   wire(8,nd-bt,6,nd-2);wire(w-2,nd-bt,w-3,nd-2);wire(6,nd-2,w-3,nd-2);for(const x of [6,w-3]){e(x,nd,2,2,EDGE);e(x,nd,1.5,1.5,'#141518');e(x,nd,.6,.6,M[1]);}
   wire(4,yN,1,yN-3);wire(4,yF,1,yF-3);wire(1,yF-3,1,yN-3,1.6,EDGE);l(1,yF-3,1,yN-3,1.4,'#6a2624');}
  else{// On its side: the open top faces you, the far wall of mesh behind it, the wheels pointing up and back.
   const yb=h-1,bh=12,x0=3,x1=w-1;e(w/2,h,w/2+2,2,SHADOW);for(const x of [7,w-4]){wire(x,yb-bh-1,x,yb-bh-6,.6,M[0]);e(x,yb-bh-7,1.2,2,EDGE);e(x,yb-bh-7,.8,1.6,'#141518');}
   p([[x0,yb-bh],[x1,yb-bh],[x1,yb],[x0,yb]],'#0d0e1050');for(let x=x0+2;x<x1;x+=2.5)r(x,yb-bh,.4,bh,'#8e939b40');for(let y=yb-bh+2;y<yb;y+=2.5)r(x0,y,x1-x0,.4,'#8e939b40');
   p([[x0,yb-bh],[x1,yb-bh],[x1-1,yb-bh-4],[x0+4,yb-bh-4]],'#0d0e1040');for(let k=0;k<6;k++){const f=k/5;l(x0+f*(x1-x0),yb-bh,x0+4+f*(x1-x0-5),yb-bh-4,.4,'#8e939b70');}
   wire(x0,yb-bh,x1,yb-bh,.8,M[2]);wire(x0,yb,x1,yb,.8,M[2]);wire(x0,yb-bh,x0,yb);wire(x1,yb-bh,x1,yb);wire(x0+4,yb-bh-4,x1-1,yb-bh-4);wire(x0,yb-bh,x0+4,yb-bh-4);wire(x1,yb-bh,x1-1,yb-bh-4);
   wire(x0,yb-3,x0-3,yb-2);wire(x0,yb-bh+2,x0-3,yb-bh+3);l(x0-3,yb-bh+3,x0-3,yb-2,1.8,EDGE);l(x0-3,yb-bh+3,x0-3,yb-2,1.4,'#6a2624');}},
 // A newspaper vending box on its stand: a window with the paper behind it, the coin slot and the pull handle. paint 0 blue, 1 red,
 // 2 green.
 newsbox(g,o){const {r,e}=g,w=o.w,h=o.h,z=o.z,P=NEWS[o.paint|0]||NEWS[0],ft=h-z,bb=h-5;e(w/2,h,w/2+2,2,SHADOW);
  r(1.5,bb,1.5,5,EDGE);r(w-3,bb,1.5,5,EDGE);r(-.5,-z-.5,w+1,bb+z+1,EDGE);r(0,-z,w,h,P[3]);r(0,-z,w,.5,'#ffffff30');r(0,ft,w,bb-ft,P[2]);r(0,ft,w,.5,P[3]);r(0,bb-1,w,1,P[0]);
  r(1.5,ft+2,w-3,8,EDGE);r(2,ft+2.5,w-4,7,'#9a988c');r(2,ft+2.5,w-4,1.5,'#6a685e');for(let k=0;k<3;k++)r(3,ft+5+k*1.5,w-6-(k%2)*3,.5,'#5a584e');r(2,ft+2.5,w-4,7,'#c8d8e814');
  r(2,ft+11,w-4,1.5,P[0]);r(w/2-2,ft+11.5,4,.75,'#8e939b');r(w-5,ft+13,3,2,'#8e939b');r(2,ft+13.5,4,4,P[1]);r(3,ft+14.5,2,.75,'#141518');},
 // A payphone on its post under a little steel hood: the phone with its handset, keypad and coin slot, the cord hanging.
 payphone(g,o){const {r,e,l}=g,w=o.w,h=o.h,z=o.z,cx=w/2,top=-z,hd=h-2,fy=top+hd,hb=fy+26,S=['#26282c','#3e4146','#5a5e64','#7a7e84'];
  e(cx,h-1,6,2,SHADOW);r(cx-2,hb,4,h-1-hb,EDGE);r(cx-1.5,hb,3,h-1.5-hb,S[1]);r(cx-1.5,hb,1,h-1.5-hb,S[2]);r(cx-3.5,h-2.5,7,2,EDGE);r(cx-3,h-2,6,1,S[1]);
  // The hood: its top, a sign strip, and the two sides standing forward round the phone.
  r(-.5,top-.5,w+1,hb-top+1,EDGE);r(0,top,w,hd,S[2]);r(0,top,w,.5,S[3]);r(0,fy,w,3.5,'#2c4466');r(3,fy+1.25,w-6,1,'#a8b4c0');r(0,fy+3.5,w,hb-fy-3.5,S[0]);r(0,fy+3.5,1.5,hb-fy-3.5,S[2]);r(w-1.5,fy+3.5,1.5,hb-fy-3.5,S[1]);
  // The phone: handset on the left in its cradle, keypad, coin slot and the return; the armoured cord loops down.
  const px=2.5,py=fy+5,pw=w-5;r(px,py,pw,hb-py-1,S[2]);r(px,py,pw,.5,S[3]);r(px+.5,py+1,2.5,11,EDGE);r(px+1,py+1.5,1.5,10,'#141518');for(let i=0;i<4;i++)for(let k=0;k<3;k++)r(px+4.5+k*1.6,py+3+i*1.8,1,1,S[0]);
  r(px+pw-2.5,py+1.5,1.5,.75,S[0]);r(px+4,py+11,4,1.5,S[0]);l(px+1.75,py+11.5,px+2.5,py+17,.75,'#141518');l(px+2.5,py+17,px+4,py+15,.75,'#141518');}};
// The library entries, with the sizes the suburbs map uses.
export const SHOP_SAMPLES=[
 {set:'town',kind:'storefront',name:'Strip mall unit',group:'Shops',samples:[{kind:'storefront',x:40,y:40,w:240,h:150,z:86,variant:0,endL:true},{kind:'storefront',x:280,y:40,w:240,h:150,z:86,variant:1},{kind:'storefront',x:520,y:40,w:240,h:150,z:86,variant:2},{kind:'storefront',x:760,y:40,w:240,h:150,z:86,variant:3,endR:true}]},
 {set:'town',kind:'dumpster',name:'Dumpster',group:'Shops',samples:[{kind:'dumpster',x:40,y:40,w:60,h:34,z:36,paint:0},{kind:'dumpster',x:41,y:40,w:60,h:34,z:36,paint:1,open:true},{kind:'dumpster',x:42,y:40,w:60,h:34,z:36,paint:2}]},
 {set:'town',kind:'shopcart',name:'Shopping cart',group:'Shops',samples:[{kind:'shopcart',x:40,y:40,w:24,h:14,z:22},{kind:'shopcart',x:40,y:40,w:24,h:14,z:22,tipped:true}]},
 {set:'town',kind:'newsbox',name:'Newspaper box',group:'Shops',samples:[{kind:'newsbox',x:40,y:40,w:14,h:10,z:24,paint:0},{kind:'newsbox',x:40,y:40,w:14,h:10,z:24,paint:1}]},
 {set:'town',kind:'gasstore',name:'Gas station store',group:'Gas station',samples:[{kind:'gasstore',x:40,y:40,w:260,h:140,z:80},{kind:'gasstore',x:40,y:40,w:260,h:140,z:80,lit:true}]},
 {set:'town',kind:'canopy',name:'Pump canopy',group:'Gas station',samples:[{kind:'canopy',x:40,y:40,w:300,h:130,z:110},{kind:'canopy',x:40,y:40,w:300,h:130,z:110,lit:true}]},
 {set:'town',kind:'pump',name:'Gas pump',group:'Gas station',samples:[{kind:'pump',x:40,y:40,w:18,h:12,z:40,variant:0},{kind:'pump',x:40,y:40,w:18,h:12,z:40,variant:1}]},
 {set:'town',kind:'pricesign',name:'Price sign',group:'Gas station',samples:[{kind:'pricesign',x:40,y:40,w:96,h:10,z:210},{kind:'pricesign',x:40,y:40,w:96,h:10,z:210,lit:true}]},
 {set:'town',kind:'icebox',name:'Ice freezer',group:'Gas station',samples:[{kind:'icebox',x:40,y:40,w:44,h:20,z:34}]},
 {set:'town',kind:'payphone',name:'Payphone',group:'Gas station',samples:[{kind:'payphone',x:40,y:40,w:14,h:8,z:60}]}];
