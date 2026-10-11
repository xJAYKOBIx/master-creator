import {holds,heldGun,weaponArms,grenadeArt,facingOf} from '../weapons/equipment.js';
import {colorMaps,tint} from './palette.js';
import {smoothOn,smoothPainter} from '../core/paint.js';
import {zombieFace,zombieTorso,zombieBite,zombieLegs,zombieReach,reachPainter} from './zombie.js';
import {skull,faceFeatures,styledHead,hairBehind,facialHair as moreFacialHair} from './hair.js';
// Survivor 01: authored pixel silhouettes, rasterized once into directional frames.
// Source frames stay 160 × 192 and display at 80 × 96, anchored at (40, 85).
export const FRAME={w:160,h:192,displayW:80,displayH:96,footX:40,footY:85};
export const DIRECTIONS=['Right','Front right','Front','Front left','Left','Back left','Back','Back right'];
const C={ink:'#111319',edge:'#1c2027',hair:'#282328',hairDeep:'#201d23',hairMid:'#352a2e',hairLight:'#463439',skin:'#d99b73',skinHi:'#ecb18a',skinLo:'#ae7356',skinDeep:'#85513d',coat:'#29465a',coatHi:'#3d5c72',coatLight:'#47677c',coatMid:'#304f64',coatLo:'#1b3040',coatDeep:'#172731',shirt:'#b8a082',shirtHi:'#d3b897',shirtLo:'#8d755e',pants:'#213344',pantsHi:'#30495c',pantsLo:'#162531',leather:'#5b4030',leatherHi:'#806044',leatherLight:'#947353',leatherLo:'#3c2c25',metal:'#928c7a'};
const snap=v=>Math.round(v*2)/2;
// Scan-converted polygons keep every edge on the half-world-pixel grid (in smooth mode, anti-aliased paths instead: core/paint.js).
function painter(c){
 if(smoothOn(c)){const {r,p}=smoothPainter(c);return {r,p};}
 const r=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(snap(x),snap(y),snap(w),snap(h));};
 const p=(pts,col)=>{let top=Math.floor(Math.min(...pts.map(v=>v[1]))*2)/2,bottom=Math.ceil(Math.max(...pts.map(v=>v[1]))*2)/2;c.fillStyle=col;for(let y=top;y<bottom;y+=.5){let hits=[];for(let i=0;i<pts.length;i++){let a=pts[i],b=pts[(i+1)%pts.length],scan=y+.25;if((a[1]<=scan&&b[1]>scan)||(b[1]<=scan&&a[1]>scan))hits.push(a[0]+(scan-a[1])*(b[0]-a[0])/(b[1]-a[1]));}hits.sort((a,b)=>a-b);for(let i=0;i+1<hits.length;i+=2){let x=snap(hits[i]),end=snap(hits[i+1]);if(end>x)c.fillRect(x,y,end-x,.5);}}};
 return {r,p};
}
// Shoes: 0 work boots (original), 1 sneakers, 2 dress shoes, 3 hiking boots. Uppers use the leather ramp, so the shoe color dyes them.
const SOLE='#e3ded3',SOLE_LO='#aaa59b',LACE='#d9d3c6';
function shoe(g,x,y,side,near,style){if(!style){boot(g,x,y,side,near);return;}const {p,r}=g,tip=side?4:1,up=near?C.leather:C.leatherLo,hi=near?C.leatherHi:C.leather;
 if(style===1){p([[x-4,y-4.5],[x+2,y-4.5],[x+3.5,y-2.5],[x+5+tip,y-1.5],[x+6+tip,y+.5],[x+5.5+tip,y+2.5],[x-4,y+2.5],[x-5,y+.5]],C.ink);
  p([[x-3,y-3.5],[x+1.5,y-3.5],[x+3,y-1.5],[x+4.5+tip,y-.5],[x+5+tip,y+.5],[x-3.5,y+.5]],up);r(x-2.5,y-3,3,1.5,hi);
  r(x-3.5,y+.5,9+tip,1.5,SOLE);r(x-3.5,y+1.5,9+tip,.5,SOLE_LO);r(x+(side?3:0),y-2,side?3:2.5,.5,LACE);r(x+(side?2:-1),y-3,side?1.5:2,.5,LACE);r(x+2+tip,y-.5,2,.5,hi);return;}
 if(style===2){p([[x-3.5,y-3],[x+2.5,y-3],[x+4.5,y-1.5],[x+6+tip,y-.5],[x+6.5+tip,y+1],[x+5+tip,y+2],[x-3.5,y+2],[x-4.5,y+.5]],C.ink);
  p([[x-2.5,y-2],[x+2,y-2],[x+4,y-.5],[x+5.5+tip,y+.3],[x+5+tip,y+1],[x-3,y+1]],up);r(x+1,y-1,2.5+tip,.5,near?C.leatherLight:C.leatherHi);r(x-2,y-1.5,1.5,.5,hi);r(x-3,y+1,8.5+tip,.8,'#17171c');return;}
 // Hiking boots: taller padded collar, lug sole and laces up the front.
 p([[x-4.5,y-7.5],[x+3.5,y-7.5],[x+3.5,y-2.5],[x+5.5+tip,y-1.5],[x+6+tip,y+2.5],[x-4.5,y+2.5],[x-5.5,y]],C.ink);
 p([[x-3.5,y-6.5],[x+2.5,y-6.5],[x+2.5,y-1.5],[x+4.5+tip,y-.5],[x+5+tip,y+1],[x-3.5,y+1]],up);r(x-3.5,y-6.5,6,1.5,C.leatherLo);r(x-2.5,y-4.5,2.5,3,hi);
 for(let i=0;i<3;i++)r(x+(side?1.5:-1),y-5.5+i*1.5,side?1.5:2.5,.5,'#c99a4a');r(x-4,y+1,9.5+tip,1.5,'#26262b');for(let i=0;i<4;i++)r(x-3+i*2.5,y+2,1,.5,'#3a3a40');}
function boot(g,x,y,side,near){let {p,r}=g,tip=side?4:1;p([[x-4,y-6],[x+3,y-6],[x+3,y-2],[x+5+tip,y-1],[x+5+tip,y+2],[x-4,y+2],[x-5,y]],C.ink);p([[x-3,y-5],[x+2,y-5],[x+2,y-1],[x+4+tip,y],[x+4+tip,y+1],[x-3,y+1]],near?C.leather:C.leatherLo);r(x-2,y-5,3,3,near?C.leatherHi:C.leather);r(x-3,y+1,8+tip,1,'#17171c');r(x+1,y-1,3+tip,.5,C.leatherHi);}
// Each foot follows the facing direction: forward/back along the stride, lifted while it swings through.
// Pants: 0 work trousers (original), 1 jeans, 2 cargo pants, 3 slacks, 4 shorts, 5 fatigue pants, 6 tactical pants.
function leg(g,x,foot,side,near,depth=0,bootG=g,bottom=0,shoeStyle=0){const {p,r}=g,{dx,dy,lift,knee}=foot,y=-2-lift-depth+dy;
 if(bottom){fittedLeg(g,x,foot,side,near,y,bottom);shoe(bootG,x+dx,y,side,near,shoeStyle);return;}
 p([[x-4,-27],[x+4,-27],[x+4+knee,-14],[x+3+dx,y-3],[x-4+dx,y-3],[x-5+knee,-14]],C.ink);
 p([[x-2.5,-25],[x+2.5,-25],[x+2.5+knee,-15],[x+1.5+dx,y-4],[x-2.5+dx,y-4],[x-3+knee,-14]],near?C.pants:C.pantsLo);
 p([[x-2,-24],[x,-24],[x-.5+knee,-15],[x-1+dx,y-6],[x-2.5+dx,y-6],[x-2+knee,-15]],near?C.pantsHi:C.pants);
 r(x-2+knee,-14,3,1,near?'#1b2d3b':'#13212c');if(near){r(x+.5,-23,2,5,'#263e50');r(x,-23,3,.5,'#40586a');}
 shoe(bootG,x+dx,y,side,near,shoeStyle);
}
const STITCH='#b58a4e90',SOCK='#d8d3c8';
function fittedLeg(g,x,foot,side,near,y,bottom){const {p,r}=g,{dx,knee}=foot,base=near?C.pants:C.pantsLo,hi=near?C.pantsHi:C.pants,lo=near?'#1b2d3b':'#13212c';
 // Outer side of the leg on screen: the pocket and seam sit there. In profile the near side faces the viewer.
 const out=side?0:x<0?-1:1;
 if(bottom===4){ // Shorts end mid-thigh; bare knees and shins below, socks above the shoe.
  const sk=near?C.skin:C.skinLo,skHi=near?C.skinHi:C.skin;
  p([[x-3.5,-19],[x+3.5,-19],[x+3.5+knee,-14],[x+2.5+dx,y-3],[x-3.5+dx,y-3],[x-4+knee,-14]],C.ink);
  p([[x-2.5,-18],[x+2.5,-18],[x+2.5+knee,-14.5],[x+1.5+dx,y-4],[x-2.5+dx,y-4],[x-3+knee,-14]],sk);
  p([[x-2,-18],[x-.5,-18],[x-1+knee,-14.5],[x-1.5+dx,y-5],[x-2.5+dx,y-5],[x-2.5+knee,-14.5]],skHi);r(x-1.5+knee,-14.5,2,1,near?C.skinLo:C.skinDeep);
  r(x-3+dx,y-6,5.5,1.5,SOCK);
  const k=knee*.62;p([[x-4,-27],[x+4,-27],[x+4.5+k,-17.5],[x-5.5+k,-17.5]],C.ink);p([[x-2.5,-25],[x+2.5,-25],[x+3+k,-18.5],[x-4+k,-18.5]],base);
  p([[x-2,-24],[x,-24],[x-.5+k,-18.5],[x-3+k,-18.5]],hi);r(x-4+k,-19,7.5,.5,lo);if(near){r(x+.5,-23,2,3,'#263e50');}return;}
 const w=bottom===2||bottom>=5?1:bottom===3?-.5:0; // cargo, fatigue and tactical pants are roomier, slacks a little slimmer
 p([[x-4-w,-27],[x+4+w,-27],[x+4+w+knee,-14],[x+3+w*.5+dx,y-3],[x-4-w*.5+dx,y-3],[x-5-w+knee,-14]],C.ink);
 p([[x-2.5-w,-25],[x+2.5+w,-25],[x+2.5+w+knee,-15],[x+1.5+w*.5+dx,y-4],[x-2.5-w*.5+dx,y-4],[x-3-w+knee,-14]],base);
 p([[x-2-w,-24],[x,-24],[x-.5+knee,-15],[x-1+dx,y-6],[x-2.5-w*.5+dx,y-6],[x-2-w+knee,-15]],hi);
 if(bottom===1){ // Jeans: contrast stitching on the outer seam and pocket, a rolled cuff.
  const sx=out<0?-2.5:out>0?2:0;p([[x+sx,-25],[x+sx+.5,-25],[x+sx+.5+knee,-14],[x+sx*.8+.5+dx,y-5],[x+sx*.8+dx,y-5],[x+sx+knee,-14]],STITCH);
  r(x-2+knee,-14,3,1,lo);if(near){r(x+.5,-23,2.5,.5,STITCH);r(x+2.5,-23,.5,2,STITCH);}
  r(x-3+dx,y-5.5,5.5,1.5,near?'#40586a':C.pantsHi);r(x-3+dx,y-4,5.5,.5,lo);return;}
 if(bottom===2||bottom>=5){ // Cargo: a flapped thigh pocket on the outer side and a reinforced knee. Fatigues add camouflage; tactical pants add knee pads.
  const cx=x+out*2.5,k=knee*.55;p([[cx-2,-22],[cx+2,-22],[cx+2+k,-16],[cx-2+k,-16]],near?'#263e50':lo);r(cx-2,-22,4,1.5,hi);r(cx-.5,-21,1,.5,lo);r(cx-2+k,-16.5,4,.5,lo);
  p([[x-2.5+knee,-14.5],[x+2+knee,-14.5],[x+1.5+knee*.9+dx*.25,-11],[x-2.5+knee*.9+dx*.25,-11]],near?'#263e50':lo);r(x-3+dx,y-4.5,6,1,lo);
  if(bottom===5){r(x-2.75+knee*.15,-24,2,1.5,lo);r(x-.5+knee*.5,-19.5,2,1,hi);r(x-2.5+knee*.7,-17.5,1.5,1.5,lo);r(x+.25+knee*.75+dx*.25,-10,1.5,1.5,lo);r(x-2+knee*.2+dx*.8,y-8,2,1,hi);}
  if(bottom===6){const k=knee*.95+dx*.1;p([[x-3.5+k,-16],[x+2.5+k,-16],[x+2.5+k,-11],[x-3.5+k,-11]],C.ink);p([[x-3+k,-15.5],[x+2+k,-15.5],[x+2+k,-11.5],[x-3+k,-11.5]],'#2a2b30');r(x-2.5+k,-15,2.5,1,'#44464d');r(x-3+k,-13,5,.5,'#1a1b1e');}
  return;}
 // Slacks: a pressed crease down the front and a clean break over the shoe.
 p([[x-.25,-25],[x+.25,-25],[x+.25+knee,-14],[x-.25+dx*.9,y-4.5],[x-.75+dx*.9,y-4.5],[x-.75+knee,-14]],near?'#40586a':C.pantsHi);r(x-2.5+dx,y-4,4.5,.5,lo);
}
// The sleeve bends progressively below the shoulder; forearm and hand move rigidly with the swing.
// Sleeves: 0 jacket (elbow patch), 1 short, 2 plain long, 3 ribbed hoodie cuff, 4 shirt cuff, 5 bare arm, 6 fatigue camo, 7 SWAT pads.
function arm(base,x,y,hand,near,sleeve=0){const warp=(px,py)=>{const t=Math.max(0,Math.min(1,(py-y-4)/9));return [px+hand.dx*t,py+hand.dy*t-hand.bend*t*t];};
 const g={p:(pts,col)=>base.p(pts.map(([a,b])=>warp(a,b)),col),r:(a,b,w,h,col)=>{const [nx,ny]=warp(a,b+h/2);base.r(nx,ny-h/2,w,h,col);}},{p,r}=g;
 p([[x-3,y],[x+2,y-1],[x+4,y+3],[x+4,y+14],[x+2,y+19],[x-3,y+18],[x-5,y+12],[x-5,y+4]],C.ink);
 const bare=sleeve===5;
 p([[x-2,y+1],[x+1,y+1],[x+2.5,y+4],[x+2.5,y+12],[x-3,y+13],[x-3,y+5]],bare?(near?C.skin:C.skinLo):near?C.coat:C.coatLo);
 p([[x-2,y+2],[x,y+2],[x,y+5],[x-1,y+12],[x-3,y+11],[x-3,y+5]],bare?(near?C.skinHi:C.skin):near?C.coatHi:C.coatMid);
 if(sleeve<2){r(x-2,y+11,4,2,C.coatLo);r(x-1,y+8,2,2,near?'#4b514f':'#303c40');}
 else if(sleeve===2)r(x-2,y+11,4,2,C.coatLo);
 // A suit sleeve ends in a pressed cuff with the shirt cuff just showing under it.
 else if(sleeve===8){r(x-2,y+11,4,1.5,C.coatLo);r(x-2,y+12.5,4,.5,C.shirtHi);}
 else if(sleeve===3){r(x-3,y+11,5.5,2.5,C.coatDeep);for(let i=0;i<3;i++)r(x-2.5+i*2,y+11.5,.5,1.5,C.coatLo);}
 else if(sleeve===4){r(x-3,y+11,5.5,2,near?C.coatLight:C.coatHi);r(x+1,y+11.5,.5,.5,C.coatLo);}
 // Fatigue sleeves carry camouflage blotches in the jacket's own shades; SWAT sleeves add shoulder and elbow pads.
 else if(sleeve===6){r(x-2,y+11,4,2,C.coatLo);r(x-2.5,y+2.5,2,2,near?C.coatDeep:C.coatLo);r(x,y+6,2,1.5,near?C.coatLight:C.coatHi);r(x-3,y+8.5,1.5,1.5,near?C.coatDeep:C.coatLo);r(x+.5,y+9.5,1.5,1,near?C.coatLo:C.coatDeep);}
 else if(sleeve===7){r(x-2,y+11,4,2,C.coatLo);r(x-3,y+8,5,2.5,C.ink);r(x-2.5,y+8.5,4,1.5,VESTS.swat[0]);r(x-2,y+8.5,2,.5,VESTS.swat[1]);
  p([[x-4,y-1],[x+2.5,y-2],[x+4.5,y+2.5],[x+3.5,y+6],[x-4.5,y+6],[x-5.5,y+2.5]],C.ink);p([[x-3.5,y-.25],[x+2,y-1.25],[x+3.75,y+2.5],[x+3,y+5.25],[x-3.75,y+5.25],[x-4.75,y+2.5]],VESTS.swat[0]);r(x-3,y+.5,3,1,VESTS.swat[1]);r(x-4,y+4,7,.5,VESTS.swat[2]);}
 p([[x-2,y+14],[x+2,y+13],[x+2.5,y+17],[x+.5,y+19],[x-2.5,y+18]],near?C.skin:C.skinLo);
 r(x-1.5,y+14,2,2,near?C.skinHi:C.skin);r(x+.5,y+17,1,1,C.skinLo);
 // Short sleeves end above the elbow; the forearm is bare skin down to the existing hand.
 if(sleeve===1){p([[x-3,y+7],[x+2.5,y+6.5],[x+2.5,y+13],[x-3,y+14]],near?C.skin:C.skinLo);p([[x-3,y+7],[x-1,y+7],[x-1,y+13],[x-3,y+13.5]],near?C.skinHi:C.skin);r(x-3,y+6,5.5,1,C.coatDeep);}
}
// Frame 0 is idle, 1-8 walk and 9-16 run. Both cycles run contact, down, passing, up for each foot.
export const WALK_FRAMES=[1,2,3,4,5,6,7,8],RUN_FRAMES=[9,10,11,12,13,14,15,16],FRAME_COUNT=17;
const WALK={stride:4,lift:2,arm:3.5,bend:1.5,carry:0,bob:.5,lean:0},RUN={stride:6.5,lift:3.5,arm:5,bend:2.5,carry:2,bob:1,lean:1};
// Zombies shamble: a short stride with the far foot dragging, an uneven dip on one step and a drunken sway; the lurch leans hard into a longer stride.
const SHAMBLE={stride:3,lift:1.5,drag:.2,bob:1,lean:.5,sway:.5},LURCH={stride:5.5,lift:3,drag:.45,bob:1.5,lean:2,sway:.5};
function gait(frame,side,back,quarter,zombie=false){
 const moving=frame>0,G=zombie?(frame>=9?LURCH:SHAMBLE):frame>=9?RUN:WALK,t=moving?((frame-1)%8)/8*Math.PI*2:0,s=moving?Math.sin(t):0,v=moving?Math.cos(t):0;
 // Facing direction projected onto the angled ground plane (local coordinates always face right).
 const fx=side?1.25:quarter?.65:0,fy=side?0:(back?-1:1)*(quarter?.5:.6);
 const foot=(sv,vv)=>{const lift=Math.max(0,vv)*G.lift;return {dx:fx*G.stride*sv,dy:fy*G.stride*sv,lift,knee:fx*(sv*G.stride*.35+lift*.7)};};
 const hand=a=>side?{dx:a*G.arm,dy:-Math.abs(a)*.5,bend:Math.max(0,a)*G.bend+G.carry}:quarter?{dx:a*G.arm*.75,dy:0,bend:Math.max(0,a)*G.bend*.8+a*.6+G.carry*.7}:{dx:0,dy:0,bend:a*G.arm*.35+G.carry*.6};
 if(zombie){const far=foot(-s,-v);far.lift*=G.drag;far.knee=fx*(-s*G.stride*.35+far.lift*.7);
  return {near:foot(s,v),far,swing:s,running:frame>=9,bob:moving?-Math.round(G.bob*Math.max(0,Math.sin(t))*2)/2:0,lean:(side?G.lean:Math.round(fx*G.lean*2)/2)+(moving&&!side?Math.round(G.sway*Math.sin(t)*2)/2:0)};}
 return {near:foot(s,v),far:foot(-s,-v),nearHand:hand(-s),farHand:hand(s),bob:moving?-G.bob*Math.sin(2*t):0,lean:side?G.lean:Math.round(fx*G.lean*2)/2};
}
// Packs by look.pack: 0 the leather pack (medium), 2 a canvas daypack (small), 3 a frame pack with a bedroll (large). 1 is no pack.
function backpack(g,back,quarter,side=false,kind=0){if(kind===2)return daypack(g,back,quarter,side);if(kind===3)return framePack(g,back,quarter,side);const {p,r}=g;
 if(side){p([[-12,-47],[-5,-46],[-4,-24],[-12,-23],[-16,-27],[-16,-42]],C.ink);p([[-12,-45],[-7,-44],[-6,-26],[-12,-25],[-14,-28],[-14,-41]],C.leather);r(-12,-42,3,12,C.leatherHi);r(-14,-42,2,11,C.leatherLo);r(-12,-40,5,2,C.leatherLight);r(-11,-35,3,6,C.leatherLo);r(-10,-34,1,2,C.metal);r(-8,-44,1,17,C.leatherLo);return;}
 if(!back){p([[-14,-46],[-10,-47],[-10,-25],[-15,-26],[-17,-30],[-17,-42]],C.ink);p([[-14,-44],[-11,-45],[-11,-27],[-14,-28],[-15,-31],[-15,-40]],C.leather);r(-14,-41,2,10,C.leatherHi);return;}
 let dx=quarter?-3:0;p([[-10+dx,-48],[6+dx,-48],[11+dx,-43],[11+dx,-26],[6+dx,-22],[-10+dx,-23],[-13+dx,-27],[-13+dx,-43]],C.ink);
 p([[-9+dx,-46],[6+dx,-46],[9+dx,-42],[9+dx,-27],[5+dx,-24],[-9+dx,-25],[-11+dx,-28],[-11+dx,-42]],C.leather);
 p([[6+dx,-44],[9+dx,-41],[9+dx,-28],[5+dx,-25],[5+dx,-40]],C.leatherLo);
 p([[-10+dx,-44],[4+dx,-44],[6+dx,-41],[5+dx,-36],[-9+dx,-36],[-11+dx,-39]],C.leatherHi);
 r(-9+dx,-43,12,1,C.leatherLight);r(-8+dx,-35,12,9,C.leatherLo);r(-7+dx,-34,10,7,'#694a36');r(-7+dx,-34,10,1,'#826047');
 for(let x of [-7+dx,3+dx]){r(x,-43,2,12,'#352a26');r(x,-42,1,8,C.leatherLight);r(x,-35,2,2,C.metal);r(x+.5,-34.5,1,1,C.leatherLo);}r(-4+dx,-31,4,2,'#8a8170');r(-3+dx,-30.5,2,1,'#4c4d49');r(-9+dx,-27,3,.5,C.leatherHi);
}
// The small pack: a soft canvas daypack that sits high between the shoulders, with a grab loop, a zip round the top and a front
// pocket. No buckles, so it reads as lighter than the leather pack.
function daypack(g,back,quarter,side){const {p,r}=g,seam='#352a26';
 if(side){p([[-11,-45],[-5,-44],[-4.5,-28],[-10,-27.5],[-13,-30.5],[-13,-41]],C.ink);p([[-10.5,-43.5],[-6,-42.5],[-5.5,-29.5],[-10,-29],[-11.5,-31.5],[-11.5,-40.5]],C.leather);
  r(-10,-41,2,9,C.leatherHi);r(-12,-37,2,6,C.leatherLo);r(-12,-37,2,.5,'#694a36');r(-7.5,-43,.5,13,C.leatherLo);r(-9.5,-43.5,3,1.5,C.ink);return;}
 if(!back){p([[-13,-44],[-10,-45],[-10,-29],[-13,-30],[-15,-33],[-15,-41]],C.ink);p([[-13,-42.5],[-11,-43.5],[-11,-30.5],[-13,-31.5],[-13.75,-34],[-13.75,-40]],C.leather);r(-13,-40,1.5,7,C.leatherHi);return;}
 const dx=quarter?-3:0,P=pts=>pts.map(([x,y])=>[x+dx,y]);
 r(-2.5+dx,-48,4,1,C.ink);r(-2.5+dx,-48,1,2.5,C.ink);r(.5+dx,-48,1,2.5,C.ink);
 p(P([[-6,-46],[4,-46],[8,-43],[9,-31],[6,-28],[-8,-28],[-11,-31],[-10,-43]]),C.ink);
 p(P([[-6,-44.5],[4,-44.5],[7,-42],[7.5,-31.5],[5,-29.5],[-7.5,-29.5],[-9.5,-31.5],[-8.5,-42]]),C.leather);
 p(P([[4,-44.5],[7,-42],[7.5,-31.5],[5,-29.5],[5,-41]]),C.leatherLo);p(P([[-6,-44.5],[3.5,-44.5],[5,-42.5],[-8,-42.5]]),C.leatherHi);
 r(-8+dx,-41.5,13,.5,seam);r(3+dx,-41.5,1,2,C.metal);
 p(P([[-6,-38],[4,-38],[5.5,-36],[5,-31],[-7,-31],[-7.5,-36]]),C.ink);p(P([[-5.5,-37.25],[3.5,-37.25],[4.75,-35.5],[4.25,-31.75],[-6.25,-31.75],[-6.75,-35.5]]),C.leatherLo);
 r(-5.5+dx,-37.25,9,.75,'#694a36');r(-1+dx,-37.75,1,1.5,C.metal);r(-8.5+dx,-40,.5,8,C.leatherHi);
}
// The large pack: a tall pack on a metal frame, with a lid, two compression straps, side pockets and a bedroll strapped under
// it. The frame's bars show above the shoulders. The bedroll is a red wool blanket whatever the pack dye, so it reads against every pack color.
const ROLL=['#7b4237','#94574a','#5a2f28'];
function bedroll(g,x0,x1,y0,y1){const {p,r}=g;p([[x0+2,y0],[x1-2,y0],[x1,y0+2],[x1,y1-2],[x1-2,y1],[x0+2,y1],[x0,y1-2],[x0,y0+2]],C.ink);
 p([[x0+2,y0+1],[x1-2,y0+1],[x1-1,y0+2.5],[x1-1,y1-2.5],[x1-2,y1-1],[x0+2,y1-1],[x0+1,y1-2.5],[x0+1,y0+2.5]],ROLL[0]);r(x0+2,y0+1.5,x1-x0-4,1.5,ROLL[1]);r(x0+2,y1-2.5,x1-x0-4,1,ROLL[2]);}
function framePack(g,back,quarter,side){const {p,r}=g,seam='#352a26';
 if(side){r(-4.5,-54,1.5,30,C.ink);r(-4,-53.5,.5,29,C.metal);
  p([[-12,-51],[-4,-50],[-3.5,-25],[-12,-24],[-18,-28],[-18,-47]],C.ink);p([[-12,-49.5],[-5,-48.5],[-5,-26.5],[-12,-25.5],[-16.5,-29],[-16.5,-46]],C.leather);
  p([[-12,-49.5],[-5,-48.5],[-5,-46],[-16.5,-46.5],[-16.5,-46]],C.leatherHi);r(-15,-44,2,13,C.leatherHi);r(-16.5,-38,3,7,C.leatherLo);r(-16.5,-38,3,.5,'#694a36');
  r(-16.5,-42,11,1,seam);r(-16.5,-33,11,1,seam);r(-10,-42,1,1,C.metal);r(-10,-33,1,1,C.metal);
  p([[-16,-27],[-11,-27],[-9,-25],[-9,-20],[-11,-18],[-16,-18],[-18,-20],[-18,-25]],C.ink);p([[-15.5,-26],[-11.5,-26],[-10,-24.5],[-10,-20.5],[-11.5,-19],[-15.5,-19],[-17,-20.5],[-17,-24.5]],ROLL[0]);
  r(-15,-24.5,4,4,ROLL[2]);r(-14,-23.5,2,2,ROLL[1]);return;}
 if(!back){r(-15,-54,1.5,6,C.ink);r(-14.5,-53.5,.5,5,C.metal);
  p([[-15,-50],[-10,-51],[-10,-25],[-15,-26],[-18,-29],[-18,-46]],C.ink);p([[-15,-48.5],[-11,-49.5],[-11,-26.5],[-15,-27.5],[-16.75,-30],[-16.75,-45]],C.leather);r(-15,-48.5,4,2,C.leatherHi);r(-15,-45,1.5,13,C.leatherHi);
  bedroll(g,-19,-10,-27,-18);return;}
 const dx=quarter?-3:0,P=pts=>pts.map(([x,y])=>[x+dx,y]);
 for(const x of [-15,11.5]){r(x+dx,-54,2,29,C.ink);r(x+.5+dx,-53.5,1,28,C.metal);}r(-15+dx,-54,28.5,1.5,C.ink);r(-14.5+dx,-53.5,27.5,.5,C.metal);
 p(P([[-11,-51],[8,-51],[12,-47],[12,-26],[8,-23],[-11,-23],[-14,-26],[-14,-47]]),C.ink);
 p(P([[-10,-49.5],[7,-49.5],[10.5,-46.5],[10.5,-26.5],[7,-24.5],[-10,-24.5],[-12.5,-26.5],[-12.5,-46.5]]),C.leather);
 p(P([[7,-46],[10.5,-44],[10.5,-26.5],[7,-24.5]]),C.leatherLo);
 p(P([[-10,-49.5],[7,-49.5],[10.5,-46.5],[10.5,-44.5],[-12.5,-44.5],[-12.5,-46.5]]),C.leatherHi);r(-12.5+dx,-44.5,23,1,C.leatherLo);r(-9+dx,-48.5,14,.5,C.leatherLight);
 r(-12.5+dx,-38,3,9,C.ink);r(-12+dx,-37.5,2,8,C.leatherLo);r(8.5+dx,-38,3,9,C.ink);r(9+dx,-37.5,2,8,C.leatherLo);
 for(const y of [-41,-32]){r(-12.5+dx,y,23,1.5,seam);r(-2+dx,y-.25,2,2,C.metal);r(-1.5+dx,y+.25,1,1,C.leatherLo);}
 r(-8+dx,-30,3,.5,C.leatherHi);
 bedroll(g,-15+dx,13+dx,-26,-17);for(const x of [-9,5])r(x+dx,-26,2,9,seam);
}
// A pack on its own, seen from behind, for inventory icons: look.pack picks the pack (0, 2 or 3), look.packColor its dye.
// Drawn in world units with the wearer's foot at (0, 0), so the pack sits from about y -54 to y -17.
export function packArt(c,look={}){const g=tint(painter(c),colorMaps(look).pack);backpack(g,true,false,false,look.pack|0);}
// Tops: closed fronts share the T-shirt body; extra details are drawn on top of it.
// Uniforms: 7 fatigues with a plate carrier, 8 the same carrier taped LEET AF, 9 police patrol shirt, 10 SWAT armor.
// 11 is a suit: the open jacket over a shirt (in the shirt dye) and tie, buttoned at the waist.
const TOPS=[{sleeve:0},{sleeve:1,closed:1},{sleeve:2,closed:1},{sleeve:3,closed:1,hood:1},{sleeve:4,closed:1,collar:1},{sleeve:4,closed:1,collar:1,tie:1},{sleeve:5,closed:1,scoop:1},
 {sleeve:6,closed:1,vest:'mil'},{sleeve:6,closed:1,vest:'leet'},{sleeve:1,closed:1,collar:1,police:1},{sleeve:7,closed:1,vest:'swat'},
 {sleeve:8,suit:1}];
// Plate carriers keep their own colors whatever the jacket dye: base, light, shadow, webbing.
const VESTS={mil:['#6b6446','#837b58','#4f4a34','#3a3727'],leet:['#4a5136','#5f6845','#363b28','#272b1d'],swat:['#26272b','#3a3b41','#1a1b1e','#121215']};
const TAPE='#1a1c16',TAPE_TEXT='#e3dcc6',SWAT_TEXT='#e8e6df',DUTY='#16171b',DUTY_HI='#2e3036',BADGE=['#8a6d2a','#d9b54a','#f3df8f'];
// Stencil letters for vest tape, 3 × 5 half-unit pixels. Mirrored views reverse them so the words still read.
const GLYPH={L:[4,4,4,4,7],E:[7,4,6,4,7],T:[7,2,2,2,2],A:[2,5,7,5,5],F:[7,4,6,4,4],S:[3,4,2,1,6],W:[5,5,7,7,5]};
// Tape lettering skips the female tailoring warp (it would pinch letters together); SQUEEZE moves it to the tailored spot instead.
let MIRROR=false,FLAT=null,SQUEEZE=x=>x,TIGHT=false;
function stencil(g,str,x,y,col){const chars=[...str];if(MIRROR)chars.reverse();let cx=x;
 for(const ch of chars){if(ch===' '){cx+=1;continue;}GLYPH[ch].forEach((bits,i)=>{for(let c=0;c<3;c++)if(bits>>(MIRROR?c:2-c)&1)g.r(cx+c*.5,y+i*.5,.5,.5,col);});cx+=2;}}
const textWidth=str=>[...str].reduce((w,ch)=>w+(ch===' '?1:2),0)-.5;
function vest(g,view,quarter,kind){const {p,r}=g,V=VESTS[kind];
 // On the narrower tailored chest a two-word tape stacks into two lines so the arms never cover it.
 const label=(word,x,y,bg,col)=>{const f=FLAT||g;x=Math.round(SQUEEZE(x)*2)/2;const lines=TIGHT&&word.includes(' ')?word.split(' '):[word],w=Math.max(...lines.map(textWidth));
  if(lines.length>1)y-=1;f.r(x-w/2-.75,y-.5,w+1.5,lines.length*3+.5,bg);lines.forEach((t,i)=>stencil(f,t,x-textWidth(t)/2,y+i*3,col));};
 if(view==='side'){
  p([[-8.5,-46],[-5.5,-49.5],[-2.5,-49.5],[-1,-46],[2,-48.5],[4.5,-48],[7.5,-43],[8,-28.5],[-9.5,-28.5],[-10,-43]],C.ink);
  p([[-7.75,-45.5],[-5,-48.75],[-3,-48.75],[-1.5,-45],[2.25,-47.75],[4,-47.25],[6.75,-42.75],[7.25,-29.25],[-8.75,-29.25],[-9.25,-42.75]],V[0]);
  p([[-8.5,-44.5],[-5.5,-44.5],[-6.5,-31],[-9,-31]],V[1]);r(-5,-48.5,2,3.5,V[3]);r(3,-47.5,1.5,3.5,V[3]);
  r(-9,-32,16,2.5,V[2]);for(let x=-8.5;x<6;x+=2)r(x,-31.25,1.5,.5,V[3]);
  r(5,-37,4,7.5,C.ink);r(5.5,-36.5,3,6.5,V[0]);r(5.5,-36.5,3,2,V[1]);r(6.5,-35,1,.75,V[3]);
  if(kind==='swat'){r(-1,-41,6,3,'#141417');stencil(g,'S',.25,-40.5,SWAT_TEXT);}else if(kind==='leet'){r(-.5,-41,5.5,3,TAPE);r(0,-40.5,4.5,.5,TAPE_TEXT);r(0,-39.5,3,.5,TAPE_TEXT);}
  return;}
 if(view==='back'){const dx=quarter?-1.5:0;
  p([[-11.5,-49],[9.5,-49],[11,-42],[10.5,-28],[-11.5,-28],[-12.5,-42]],C.ink);p([[-10.75,-48.25],[8.75,-48.25],[10.25,-42],[9.75,-28.75],[-10.75,-28.75],[-11.75,-42]],V[0]);
  p([[-10.75,-47.5],[-7,-47.5],[-8,-30],[-11,-30]],V[1]);p([[6.5+dx,-47.5],[8.75,-47.5],[10,-42],[9.5,-29],[6.5+dx,-29]],V[2]);
  r(-10.5,-48.25,19.5,1.5,V[3]);r(-2.5+dx,-50.5,4.5,2,C.ink);r(-2+dx,-50,3.5,1,V[3]);
  for(const y of [-35,-33,-31])for(let x=-9.5;x<8;x+=2)r(x+dx,y,1.5,.5,V[3]);r(-11,-29.5,20.5,1.25,V[3]);
  if(kind==='leet')label('LEET AF',-1+dx,-45,TAPE,TAPE_TEXT);else if(kind==='swat')label('SWAT',-1+dx,-45,'#141417',SWAT_TEXT);else for(const y of [-45,-43,-41])for(let x=-8.5;x<7;x+=2)r(x+dx,y,1.5,.5,V[3]);
  return;}
 const q=quarter?1.5:0;
 p([[-10.5,-47.5],[-9+q,-51],[-4.5+q,-51],[-3.5+q,-47.5],[1.5+q,-47.5],[2.5+q,-51],[7+q,-51],[8.5+q,-47.5],[10.5,-42],[10.5,-28],[-11.5,-28],[-12,-42]],C.ink);
 p([[-9.75,-47],[-8.5+q,-50.25],[-5+q,-50.25],[-4+q,-46.75],[2+q,-46.75],[3+q,-50.25],[6.5+q,-50.25],[7.75+q,-47],[9.75,-41.5],[9.75,-28.75],[-10.75,-28.75],[-11.25,-41.5]],V[0]);
 r(-8+q,-50.25,2.5,3.5,V[3]);r(3.5+q,-50.25,2.5,3.5,V[3]);
 p([[-9.75,-46.5],[-7+q,-46.5],[-8+q,-30],[-10.75,-30]],V[1]);p([[7+q,-46],[9.75,-41],[9.75,-29],[7+q,-29]],V[2]);
 r(-10.75,-29.5,20.5,1.25,V[3]);
 for(const px of [-8.5,-3.5,1.5]){const x=px+q;r(x-.5,-36.5,5.5,7,C.ink);r(x,-36,4.5,6,V[0]);r(x,-36,4.5,2,V[1]);r(x+1.75,-34.5,1,.75,V[3]);r(x,-30.5,4.5,.5,V[2]);}
 for(let x=-9;x<8;x+=2)r(x+q,-38,1.5,.5,V[3]);
 if(kind==='leet')label('LEET AF',-1+q,-45,TAPE,TAPE_TEXT);
 else if(kind==='swat')label('SWAT',-1+q,-45,'#141417',SWAT_TEXT);
 else{r(-8+q,-45.5,5.5,3,V[3]);r(-7.5+q,-45,4.5,2,V[2]);r(1+q,-45.5,5.5,1.5,V[3]);r(1.5+q,-43.5,4.5,.5,V[2]);}
}
// Patrol shirt kit: badge, name bar, a second pocket, a shoulder radio and the duty belt.
function policeKit(g,view,quarter,x){const {p,r}=g;
 if(view==='side'){r(-8,-29.5,15,2.5,DUTY);r(-8,-29.5,15,.5,DUTY_HI);r(-2,-32,3.5,5,DUTY);r(-1.5,-31.5,2.5,.5,DUTY_HI);p([[3,-45],[5,-45],[5.25,-43],[4,-42],[2.75,-43]],BADGE[0]);r(3.25,-44.5,1.5,1.5,BADGE[1]);r(-4.5,-48,2,3,'#1b1c20');return;}
 if(view==='back'){r(-9.5,-29.5,19,2.5,DUTY);r(-9.5,-29.5,19,.5,DUTY_HI);r(-4,-29,3.5,2.5,'#24252a');r(2,-29.5,3,3,'#24252a');r(-10,-49,4,1,C.coatLo);r(5,-49,4,1,C.coatLo);return;}
 p([[x-6,-44],[x-3,-44],[x-3,-40.5],[x-6,-40.5]],C.coatMid);r(x-6,-44,3,.5,C.coatLo);r(x-5.75,-45.25,2.5,.75,'#d8d0b8');
 p([[x+4,-45],[x+6,-45],[x+6.25,-43],[x+5,-41.75],[x+3.75,-43]],BADGE[0]);p([[x+4.25,-44.75],[x+5.75,-44.75],[x+5.9,-43.1],[x+5,-42.25],[x+4.1,-43.1]],BADGE[1]);r(x+4.5,-44.5,.5,.5,BADGE[2]);
 r(-9.5,-29.5,19,2.5,DUTY);r(-9.5,-29.5,19,.5,DUTY_HI);r(x-.5,-29,2.5,1.5,'#9ea3a8');r(6.5,-32,3,5,DUTY);r(7,-31.5,2,.5,DUTY_HI);r(-9.5,-32,2.5,3,DUTY);
 r(-8.5,-48,2,3,'#1b1c20');r(-8,-47.5,1,1,'#3b3d44');}
const TIE=['#7a2f36','#9a4249','#5a2228'],STRING='#d8d0c0';
function torso(g,back,quarter,side,T=TOPS[0],strapG=g){let {p,r}=g;const top=T.closed?1:0;
 if(side){p([[-5,-50],[4,-49],[7,-43],[7,-28],[4,-24],[-7,-25],[-9,-30],[-9,-43]],C.ink);p([[-4,-48],[3,-47],[5,-43],[5,-29],[3,-26],[-6,-27],[-7,-31],[-7,-42]],C.coat);p([[-5,-47],[-2,-48],[0,-44],[-1,-28],[-6,-28],[-7,-33]],C.coatHi);r(3,-44,2,15,C.coatLo);if(!T.hood)r(3,-38,2,6,C.shirtLo);r(-5,-28,9,2,C.coatLo);r(-6,-47,9,3,C.coatDeep);
  if(T.hood){p([[2,-37],[6,-37],[6.5,-31],[2,-31]],C.coatLo);r(2,-37,4.5,.5,C.coatDeep);r(-6,-28,11,1.5,C.coatDeep);}
  if(T.collar){r(4,-41,.5,.5,C.coatLight);r(4,-36,.5,.5,C.coatLight);r(4,-31,.5,.5,C.coatLight);}
  if(T.tie)p([[4,-47],[6,-46.5],[6.5,-37],[5,-35.5],[4,-37]],TIE[0]);
  if(T.suit){p([[3,-48],[5.5,-47.5],[5,-38],[3,-38]],C.shirt);p([[4.5,-47],[6,-46.5],[6,-38.5],[5.25,-37.5],[4.5,-38.5]],TIE[0]);r(5,-46,.5,7,TIE[1]);r(2.5,-38,.5,9,C.coatDeep);r(2,-33,1,1,C.coatDeep);}
  if(T.vest)vest(g,'side',quarter,T.vest);if(T.police)policeKit(g,'side',quarter,0);
  return;}
 p([[-8,-51],[5,-51],[11,-47],[13,-39],[11,-25],[-10,-25],[-14,-33],[-13,-45]],C.ink);
 p([[-7,-49],[5,-49],[9,-45],[11,-38],[9,-27],[-9,-27],[-12,-34],[-11,-44]],C.coat);
 p([[-7,-48],[-3,-49],[-2,-42],[-5,-28],[-9,-28],[-11,-35],[-10,-44]],C.coatHi);
 p([[7,-46],[10,-39],[9,-28],[6,-28],[6,-39]],C.coatLo);
 r(-8,-28,16,2,C.coatDeep);
 if(!back&&top===1){let x=quarter?1:-2;p([[x-1,-49],[x+3,-49],[x+2,-46],[x,-46]],C.coatDeep);if(!T.hood){r(x-3,-27,7,1,C.leather);r(x,-27,2,1,C.metal);}
  // Kangaroo pocket and drawstrings; a placket with buttons; a tie over the placket.
  if(T.hood){p([[x-5,-37],[x+6,-37],[x+7.5,-30],[x-6.5,-30]],C.coatMid);r(x-5,-37,11,.5,C.coatDeep);p([[x-5,-37],[x-4,-37],[x-5.5,-32],[x-6.5,-32]],C.coatDeep);p([[x+5,-37],[x+6,-37],[x+7.5,-32],[x+6.5,-32]],C.coatDeep);r(-9,-28.5,18,1.5,C.coatDeep);
   r(x-1,-47,.5,5,STRING);r(x+3,-47,.5,4.5,STRING);r(x-1.5,-42,1,.5,STRING);r(x+3,-42.5,1,.5,STRING);}
  if(T.collar){r(x+1,-46,.5,18,C.coatLo);for(const y of [-44,-40,-36,-32])r(x+1.5,y,.5,.5,C.coatLight);if(!T.tie){p([[x+3.5,-44],[x+6.5,-44],[x+6.5,-40.5],[x+3.5,-40.5]],C.coatMid);r(x+3.5,-44,3,.5,C.coatLo);}}
  if(T.tie){p([[x+.3,-47],[x+2.2,-47],[x+2.8,-37],[x+1.2,-35],[x-.3,-37]],TIE[0]);r(x+1,-45,.5,7,TIE[1]);r(x+.3,-37.5,2.4,.5,TIE[2]);}if(T.vest)vest(g,'front',quarter,T.vest);if(T.police)policeKit(g,'front',quarter,x);if(strapG&&!T.vest){strapG.p([[-9,-48],[-7,-48],[-6,-40],[-6,-31],[-8,-32]],C.leatherLo);strapG.r(-8,-46,1,10,C.leatherHi);if(!quarter){strapG.r(7,-46,1.5,11,C.leatherLo);strapG.r(7,-44,.5,7,C.leatherHi);}}}
 // The suit: a V of shirt and tie down to the one button at the waist, a lapel either side of it, a pocket square and two flaps.
 else if(!back&&T.suit){const x=quarter?1:-2;p([[x-2.5,-48.5],[x+4.5,-48],[x+2.25,-33.5],[x+.25,-33.5]],C.shirtLo);p([[x-1.5,-48],[x+3.5,-47.5],[x+1.75,-35],[x+.5,-35]],C.shirt);r(x-1,-46,1,3,C.shirtHi);
  p([[x+.25,-46.5],[x+1.75,-46.5],[x+2.25,-37.5],[x+1,-36],[x-.25,-37.5]],TIE[0]);r(x+.75,-45.5,.5,7,TIE[1]);
  p([[x-3.5,-49.5],[x-.5,-48.5],[x+.75,-33],[x-.25,-33],[x-4.5,-40],[x-5.5,-44],[x-3.75,-45]],C.coatDeep);p([[x-3,-48.75],[x-1,-48],[x+.25,-34.5],[x-3.75,-40.25],[x-4.5,-43.75],[x-3,-44.5]],C.coatMid);
  p([[x+4.5,-49.5],[x+7.5,-46],[x+6,-44.5],[x+7,-43],[x+2.25,-33],[x+1.25,-33],[x+3.75,-48.5]],C.coatHi);
  r(x+1,-33,.5,6,C.coatLo);r(x+.5,-31.5,1.5,1.5,C.coatDeep);r(x+.75,-31.25,.75,.75,C.coatLight);
  r(-8,-42.5,3.5,.5,C.coatDeep);p([[-7.5,-43.75],[-5.5,-44],[-5.25,-42.5],[-7.5,-42.5]],'#e9e4d8');r(-8.5,-31,4.5,.5,C.coatDeep);r(6,-31,3,.5,C.coatDeep);
  if(strapG){strapG.p([[-9,-48],[-7,-48],[-6,-40],[-6,-31],[-8,-32]],C.leatherLo);strapG.r(-8,-46,1,10,C.leatherHi);if(!quarter){strapG.r(7,-46,1.5,11,C.leatherLo);strapG.r(7,-44,.5,7,C.leatherHi);}}}
 else if(!back){let x=quarter?1:-2;p([[x-2,-48],[x+4,-47],[x+5,-28],[x-3,-28]],C.shirtLo);p([[x-1,-47],[x+3,-46],[x+3,-30],[x-2,-30]],C.shirt);r(x-1,-44,3,3,C.shirtHi);r(x-1,-37,3,1,C.shirtHi);r(x-2,-32,5,1,C.shirtLo);p([[x-3,-49],[x,-48],[x-1,-42],[x-4,-39]],C.coatDeep);p([[x+4,-49],[x+7,-46],[x+4,-39],[x+3,-43]],C.coatHi);r(x-3,-27,7,1,C.leather);r(x,-27,2,1,C.metal);
  r(-8,-37,4,5,C.coatLo);r(-8,-37,4,1,C.coatLight);r(6,-35,2,5,C.coatDeep);r(6,-35,2,.5,C.coatHi);
  if(strapG){strapG.p([[-9,-48],[-7,-48],[-6,-40],[-6,-31],[-8,-32]],C.leatherLo);strapG.r(-8,-46,1,10,C.leatherHi);if(!quarter){strapG.r(7,-46,1.5,11,C.leatherLo);strapG.r(7,-44,.5,7,C.leatherHi);}}
 }else{r(-8,-46,14,1,C.coatLight);r(-1,-44,1,13,C.coatLo);if(T.vest)vest(g,'back',quarter,T.vest);if(T.police)policeKit(g,'back',quarter,0);}
}
function head(g,back,quarter,side){const {p,r}=g;
 // Face and ear planes underneath the swept, irregular hair mass.
 if(side){p([[-7,-67],[7,-66],[9,-60],[9,-56],[10.5,-54],[10,-51],[8,-50],[7,-47],[1,-46],[-4,-49],[-8,-56]],C.ink);p([[-5,-65],[6,-64],[7,-59],[7,-54],[9.5,-53],[8,-52],[6,-51],[6,-48],[1,-48],[-3,-51],[-6,-56]],C.skin);p([[3,-62],[6,-61],[6,-54],[9,-53],[6,-52],[6,-49],[2,-49]],C.skinHi);r(5,-58,2,3,C.ink);r(7,-52,1,1,C.skinLo);r(5,-50,2,.5,C.skinDeep);}
 else{let offset=quarter?2:0;p([[-9,-66],[7,-66],[10,-61],[10,-54],[7,-48],[1,-46],[-6,-48],[-10,-54],[-11,-61]],C.ink);p([[-7,-64],[6,-64],[8,-60],[8,-54],[5,-49],[1,-48],[-5,-50],[-8,-55],[-9,-60]],C.skin);p([[-5,-62],[5,-63],[7,-59],[7,-54],[4,-50],[0,-50],[-5,-52]],C.skinHi);p([[-8,-60],[-5,-58],[-5,-52],[0,-49],[-4,-50],[-8,-55]],C.skinLo);
 if(!back){r(-4+offset,-58,2,3,C.ink);r(3+offset,-58,1.5,3,C.ink);r(1+offset,-55,1,2,C.skinLo);r(2+offset,-54,1,1,C.skin);r(offset,-51,3,.5,C.skinDeep);} }
 if(back){p([[-8,-65],[7,-65],[9,-56],[6,-50],[-1,-49],[-7,-51],[-10,-57]],C.hairDeep);}
 // Rounded silhouette is deliberately asymmetrical, with broad pixel clusters.
 const points=[[-9,-70],[-5,-73],[1,-74],[5,-73],[9,-71],[11,-67],[12,-63],[10,-59],[8,-57],[5,-59],[3,-61],[0,-60],[-2,-56],[-5,-54],[-9,-56],[-11,-60],[-12,-65]];
 p(points,C.ink);
 p([[-8,-69],[-4,-71],[1,-72],[5,-71],[8,-69],[9,-66],[10,-63],[8,-60],[6,-60],[4,-63],[0,-62],[-3,-58],[-6,-57],[-8,-58],[-10,-62],[-10,-65]],C.hair);
 p([[-8,-67],[-6,-69],[-2,-70],[1,-69],[3,-70],[7,-68],[8,-65],[5,-64],[2,-66],[-1,-65],[-4,-63],[-8,-63]],C.hairMid);
 p([[-6,-67],[-3,-69],[-1,-69],[-2,-67],[-4,-65],[-6,-64]],C.hairLight);p([[1,-68],[4,-68],[6,-66],[4,-66],[3,-67],[1,-66]],'#3c2f33');
 r(-8,-63,2,2,'#30272c');r(-6,-60,1,2,'#3a2e33');r(7,-64,1,2,C.hairDeep);r(-2,-71,3,.5,'#4c383b');
 // Forward views expose the face; rear views retain the full hair silhouette.
 if(!back&&!side){let x=quarter?2:0;p([[-5+x,-61],[0+x,-62],[3+x,-60],[6+x,-61],[7+x,-59],[7+x,-54],[4+x,-50],[x,-50],[-5+x,-53]],C.skin);p([[-3+x,-60],[x,-61],[3+x,-59],[5+x,-59],[5+x,-54],[2+x,-51],[-2+x,-52]],C.skinHi);r(-3+x,-58,2,3,C.ink);r(3+x,-58,1.5,3,C.ink);r(1+x,-55,1,2,C.skinLo);r(2+x,-54,1,1,C.skinHi);r(x,-51.5,3,.5,C.skinDeep);p([[-7,-64],[-3,-64],[-2,-61],[-4,-58],[-6,-58]],C.hair);}
 if(side){p([[3,-65],[7,-64],[7,-60],[5,-59],[5,-62],[3,-61]],C.hair);r(-1,-56,3,4,C.skinLo);r(0,-56,2,3,C.skin);r(0,-55,1,1,C.skinHi);r(6,-58,1.5,2.5,C.ink);r(8,-52,1,.5,C.skinDeep);}
 else if(quarter){r(back?7:-9,-56,2,4,C.skinLo);r(back?7:-8,-56,1.5,2.5,C.skin);}
 if(back){p([[-9,-60],[6,-61],[8,-57],[6,-52],[1,-50],[-5,-51],[-9,-54]],C.hair);p([[-8,-58],[-6,-57],[-5,-54],[-1,-53],[1,-54],[3,-52],[-1,-51],[-6,-52]],C.hairDeep);r(-7,-60,1,3,C.hairMid);r(5,-58,1,3,C.hairMid);if(quarter){p([[7,-61],[9,-60],[9,-55],[11,-53],[10,-51],[8,-49],[5,-50],[5,-55]],C.skinLo);p([[8,-59],[9,-58],[9,-54],[10,-53],[9,-51],[7,-50],[7,-54]],C.skin);r(8,-57,1,2,C.ink);r(5,-55,2,3,C.skin);r(5.5,-54.5,1,1,C.skinHi);p([[5,-63],[9,-63],[9,-60],[7,-57],[6,-59]],C.hair);}}
}
// Crop crown art under fitted headwear instead of stacking a hat on the hair volume.
function belowHatBand(g,band){return {r:(x,y,w,h,col)=>{const top=Math.max(y,band);if(y+h>top)g.r(x,top,w,y+h-top,col);},p:(pts,col)=>{const out=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length],inside=a[1]>=band,next=b[1]>=band;if(inside)out.push(a);if(inside!==next)out.push([a[0]+(b[0]-a[0])*(band-a[1])/(b[1]-a[1]),band]);}if(out.length>2)g.p(out,col);}};}
// The approved swept head is retained intact. Other choices use the same face planes.
// Hair tones: base, deep, mid, light. The first entry is the swatch color.
export const HAIR_TONES=[['#282328','#201d23','#352a2e','#463439'],['#694936','#402f29','#80573e','#9c7252'],['#ab8755','#71593e','#c19d68','#d4b482'],['#9b969e','#66636f','#b2acb5','#ccc3ca'],['#7a3a26','#4e2419','#93492f','#ad5e3c'],['#d6cdb6','#9f957f','#e4ddca','#f2ecdc']];
function hairPalette(look){
 const tones=HAIR_TONES[look.color||0]||HAIR_TONES[0];
 return {...C,hair:tones[0],hairDeep:tones[1],hairMid:tones[2],hairLight:tones[3]};}
function appearanceHead(g,back,quarter,side,look){
 const H=hairPalette(look),style=look.hat===5&&look.hair===2?1:look.hair||0;
 const base=g;if(look.hat>=3)g=belowHatBand(g,-62);else if(look.hat&&style>=4)g=belowHatBand(g,-64);
 if(style===0){const map=look.color?new Map([[C.hair,H.hair],[C.hairDeep,H.hairDeep],[C.hairMid,H.hairMid],[C.hairLight,H.hairLight],['#3c2f33',H.hairMid],['#30272c',H.hair],['#3a2e33',H.hairMid],['#4c383b',H.hairLight]]):null;const tinted=map?{p:(pts,col)=>g.p(pts,map.get(col)||col),r:(x,y,w,h,col)=>g.r(x,y,w,h,map.get(col)||col)}:g;head(tinted,back,quarter,side);}
 else if(style<4)alternativeHead(g,back,quarter,side,style,H);
 else styledHead(g,back,quarter,side,style,H);
 if(look.zombie)zombieFace(base,back,quarter,side,look);
 g=base;facialHair(g,back,quarter,side,look.beard||0,H);
 headwear(g,back,quarter,side,look.hat||0,H);
}
function alternativeHead(g,back,quarter,side,style,H){const {p,r}=g;
 skull(g,H);
 if(style!==3){
  p([[-9,-68],[-5,-72],[3,-72],[8,-69],[10,-65],[9,-60],[6,-61],[3,-63],[-3,-62],[-7,-59],[-10,-62]],H.ink);
  p([[-8,-67],[-4,-70],[3,-70],[7,-67],[8,-64],[7,-62],[3,-65],[-3,-64],[-7,-61],[-9,-63]],H.hair);
  p([[-7,-66],[-3,-69],[2,-69],[5,-67],[3,-67],[-1,-68],[-5,-65]],H.hairMid);r(-3,-69,3,.5,H.hairLight);
  if(style===1){for(let x=-6;x<7;x+=2){r(x,-66+(Math.abs(x)>4?1:0),1,2,H.hairMid);}r(-8,-61,2,5,H.hair);if(!side)r(7,-61,1.5,4,H.hair);}
  if(back){p([[-9,-63],[8,-63],[8,-56],[5,-51],[-1,-50],[-6,-52],[-9,-56]],H.hair);p([[-8,-60],[-6,-55],[-1,-52],[4,-54],[6,-57],[6,-53],[2,-51],[-4,-52],[-8,-56]],H.hairDeep);r(-6,-61,1,3,H.hairMid);}
  if(style===2){
   p([[-8,-69],[-4,-73],[3,-73],[8,-70],[10,-65],[8,-61],[4,-63],[-3,-64],[-8,-60],[-10,-64]],H.ink);
   p([[-7,-68],[-3,-71],[3,-71],[7,-68],[8,-65],[6,-63],[2,-65],[-3,-66],[-7,-63],[-8,-65]],H.hair);
   p([[-6,-67],[-2,-70],[3,-70],[6,-68],[3,-68],[-1,-69],[-5,-65]],H.hairMid);r(-2,-70,3,.5,H.hairLight);
   let x=back&&!quarter?-1:-10;
   p([[x-2,-61],[x+2,-60],[x+3,-54],[x+2,-47],[x,-41],[x-3,-44],[x-4,-50],[x-3,-57]],H.ink);
   p([[x-1,-60],[x+1,-59],[x+1.5,-54],[x+.5,-48],[x-1,-44],[x-2,-47],[x-2.5,-51]],H.hair);r(x-2,-58,4,2,'#90734f');r(x-1.5,-55,1,7,H.hairMid);
  }
 }
 faceFeatures(g,back,quarter,side,H,style!==3?H.hair:null);
}
// Broad connected beard planes follow the jaw; the mouth is only a dark seam.
function fullBeard(g,back,quarter,side,H){const {p,r}=g;
 if(back){
  if(!quarter)return;
  p([[5,-56],[7,-55],[7,-52],[11,-52],[11,-48],[9,-46],[5,-47],[4,-51]],H.ink);
  p([[5,-55],[6,-54],[6,-51],[10,-51],[10,-48],[8,-47],[5,-48]],H.hair);
  r(7,-49,3,1.5,H.hairMid);return;
 }
 if(side){
  p([[-3,-58],[0,-57],[1,-54],[4,-53],[8,-53],[10,-51],[10,-46],[1,-45],[-4,-49],[-5,-54]],H.ink);
  p([[-3,-57],[-1,-56],[0,-53],[3,-51],[7,-52],[9,-51],[9,-47],[2,-46],[-3,-49],[-4,-53]],H.hair);
  p([[-3,-55],[-1,-52],[2,-50],[3,-47],[1,-47],[-3,-50]],H.hairDeep);
  p([[3,-50],[8,-50],[8,-47],[4,-47]],H.hairMid);
  r(6,-51,3,.5,H.hairDeep);return;
 }
 const x=quarter?2:0;
 p([[-8+x,-58],[-5+x,-57],[-4+x,-54],[-1+x,-53],[2+x,-53],[5+x,-54],[6+x,-57],[8+x,-56],[8+x,-48],[5+x,-45],[-4+x,-45],[-8+x,-48],[-9+x,-53]],H.ink);
 p([[-7+x,-57],[-6+x,-56],[-5+x,-52],[-2+x,-51],[1+x,-52],[4+x,-52],[6+x,-54],[7+x,-55],[7+x,-49],[4+x,-46],[-3+x,-46],[-7+x,-49],[-8+x,-53]],H.hair);
 p([[-7+x,-55],[-5+x,-51],[-3+x,-49],[-3+x,-46],[-6+x,-48],[-8+x,-52]],H.hairDeep);
 p([[-2+x,-49],[2+x,-50],[6+x,-49],[4+x,-47],[-2+x,-47]],H.hairMid);
 // Short, level mustache merges into the beard without a skin-colored mouth ring.
 p([[-2+x,-54],[2+x,-54],[5+x,-53],[5+x,-51],[-3+x,-51]],H.hair);
 r(x,-51.5,3,.5,H.hairDeep);
}
function facialHair(g,back,quarter,side,style,H){if(!style||back&&!quarter)return;const {p,r}=g;
 if(style===3){fullBeard(g,back,quarter,side,H);return;}
 moreFacialHair(g,back,quarter,side,style,H);return;
 if(back){if(style===1){r(8,-51,1,.5,H.hairMid);return;}r(8,-52,2,.75,H.hair);if(style===3){p([[6,-52],[7,-50],[10,-51],[8,-48],[6,-49]],H.hair);r(7,-50,.5,1,H.hairMid);}return;}
 if(side){if(style===1){for(let [x,y]of [[2,-51],[4,-50],[6,-50],[1,-53]])r(x,y,.5,.5,H.hairMid);return;}r(6,-52,3,1,H.hair);r(8,-51,1,1,H.hairDeep);if(style===3){p([[0,-54],[2,-51],[5,-49],[8,-51],[8,-48],[5,-46],[1,-48],[-1,-51]],H.hair);p([[1,-51],[4,-48],[6,-48],[4,-47],[1,-49]],H.hairMid);r(6,-50,2,.5,H.skinDeep);}return;}
 let x=quarter?2:0;if(style===1){for(let [xx,y]of [[-4,-53],[-3,-51],[-1,-50],[1,-49.5],[3,-50],[5,-52]])r(xx+x,y,.5,.5,H.hairMid);return;}
 p([[-2+x,-53.5],[1+x,-54],[4+x,-53],[5+x,-51.5],[3+x,-52],[1+x,-52.5],[-1+x,-52],[-3+x,-51.5]],H.hair);
 if(style===3){p([[-6+x,-54],[-3+x,-51],[x,-50],[3+x,-50],[6+x,-53],[5+x,-49],[2+x,-46],[-2+x,-47],[-5+x,-50]],H.hair);p([[-3+x,-50],[x,-48],[3+x,-49],[2+x,-47],[-1+x,-48]],H.hairMid);r(x,-51,3,.5,H.skinDeep);r(x,-48,1,.5,H.hairLight);}
}
function headwear(g,back,quarter,side,style,H){if(!style)return;if(style>=3){fittedHeadwear(g,back,quarter,side,style,H);return;}const {p,r}=g;
 if(style===1){
  p([[-12,-65],[-11,-70],[-7,-75],[3,-76],[9,-73],[12,-68],[12,-62],[-11,-62]],H.ink);
  p([[-10,-65],[-9,-70],[-5,-73],[3,-74],[8,-71],[10,-67],[10,-64]],'#334f65');p([[-8,-69],[-4,-72],[2,-73],[5,-71],[0,-70],[-4,-66],[-10,-65]],'#46637b');r(0,-72,1,7,'#263d50');r(-2,-74,3,1,'#688097');
  if(back){p([[-10,-64],[10,-65],[11,-61],[4,-61],[3,-64],[-2,-64],[-3,-61],[-10,-61]],'#203445');r(-2,-63,5,1,'#a39474');}
  else if(side||quarter){p([[-1,-65],[11,-65],[17,-62],[17,-60],[9,-60],[0,-62],[-4,-62]],H.ink);p([[0,-64],[10,-64],[15,-62],[10,-61],[1,-63]],'#3e5c74');r(8,-62,7,.5,'#668298');r(3,-69,3,2,'#b5a480');}
  else{p([[-12,-65],[10,-65],[13,-62],[12,-60],[-11,-60],[-14,-62]],H.ink);p([[-10,-64],[9,-64],[11,-62],[-10,-61],[-12,-62]],'#3e5c74');r(-9,-62,17,.5,'#668298');r(-1,-69,3,2,'#b5a480');}
 }else{
  p([[-12,-65],[-11,-70],[-7,-75],[1,-77],[8,-74],[11,-70],[13,-64],[11,-60],[-10,-60],[-13,-63]],H.ink);
  p([[-10,-65],[-9,-70],[-5,-73],[1,-75],[7,-72],[9,-69],[11,-64],[9,-62],[-9,-62]],'#77717e');p([[-9,-65],[-7,-70],[-3,-73],[1,-74],[4,-72],[-1,-70],[-4,-64]],'#928996');
  for(let x=-7;x<10;x+=3)r(x,-69+(Math.abs(x)>5?2:0),.5,5,'#aea2ac');p([[-12,-65],[11,-65],[12,-62],[9,-60],[-10,-60],[-12,-62]],'#464651');r(-10,-63,20,1,'#686371');for(let x=-9;x<10;x+=2)r(x,-63,.5,2,'#8c8291');r(side?6:-4,-63,3,2,'#b2a082');
 }
}

function fittedHeadwear(g,back,quarter,side,style,H){const {p,r}=g;
 if(style===3){ // Peaked police cap: fitted band, structured crown, projected leather peak.
  p([[-12,-65],[-14,-70],[-10,-74],[-3,-76],[6,-75],[12,-72],[13,-68],[10,-63],[-9,-62]],H.ink);
  p([[-11,-66],[-12,-70],[-8,-73],[-2,-74],[6,-73],[10,-71],[11,-68],[8,-65],[-8,-64]],'#293e58');
  p([[-11,-70],[-7,-72],[-1,-73],[5,-72],[8,-70],[1,-70],[-5,-68],[-10,-67]],'#405773');
  p([[-10,-65],[10,-66],[11,-61],[-9,-60],[-11,-62]],'#151f30');r(-8,-64,16,1,'#566176');
  if(back){r(-7,-62,13,1,'#252f41');r(-1,-63,3,1,'#8d8571');if(quarter){p([[8,-63],[14,-61],[15,-59],[10,-59],[8,-60]],H.ink);r(10,-60,3,.5,'#43566b');}}
  else if(side||quarter){p([[-2,-62],[10,-63],[17,-60],[17,-58],[10,-58],[1,-60],[-3,-60]],H.ink);p([[0,-62],[9,-62],[15,-60],[10,-59],[2,-60]],'#263244');r(9,-60,6,.5,'#58677a');p([[3,-70],[6,-70],[7,-68],[5,-65],[3,-66]],'#bfa468');r(4,-69,1,2,'#e1c58b');}
  else{p([[-11,-62],[10,-62],[14,-60],[12,-58],[-11,-58],[-14,-60]],H.ink);p([[-9,-61],[9,-61],[11,-60],[-10,-59],[-12,-60]],'#29364a');r(-8,-60,16,.5,'#58677a');p([[-2,-70],[2,-70],[3,-68],[0,-65],[-3,-68]],'#bfa468');r(-1,-69,2,2,'#e1c58b');}return;
 }
 if(style===4){ // Low leather band and broad curled brim surround the skull.
  if(side){p([[-11,-63],[-10,-72],[-6,-77],[1,-76],[6,-74],[10,-69],[11,-62]],H.ink);p([[-9,-64],[-8,-71],[-5,-75],[1,-74],[5,-72],[8,-68],[9,-63]],'#8b6541');p([[-7,-71],[-4,-74],[0,-73],[4,-71],[5,-68],[-2,-69]],'#ad8559');p([[3,-73],[6,-71],[8,-67],[9,-64],[5,-64],[4,-69]],'#62482f');}
  else{p([[-11,-63],[-10,-72],[-7,-77],[-2,-77],[1,-74],[4,-77],[8,-76],[11,-70],[11,-62]],H.ink);
  p([[-9,-64],[-8,-71],[-6,-75],[-3,-75],[0,-72],[4,-75],[7,-74],[9,-69],[9,-63]],'#8b6541');
  p([[-7,-71],[-5,-74],[-3,-73],[0,-70],[5,-73],[7,-71],[4,-68],[-3,-68]],'#ad8559');p([[4,-74],[7,-74],[9,-69],[9,-64],[5,-64],[6,-68]],'#62482f');}
  p([[-10,-65],[10,-66],[11,-62],[-10,-61]],'#392a24');r(-8,-63,16,1,'#745137');
  if(side){p([[-19,-66],[-14,-65],[-11,-63],[5,-63],[13,-64],[19,-66],[20,-62],[15,-59],[-11,-58],[-18,-61]],H.ink);p([[-17,-64],[-12,-62],[4,-62],[13,-63],[18,-64],[17,-62],[13,-60],[-10,-60],[-16,-62]],'#92704c');r(-9,-61,20,1,'#b18b60');p([[-17,-64],[-12,-62],[-10,-61],[-16,-62]],'#c19b6b');}
  else{p([[-20,-66],[-15,-65],[-11,-62],[9,-63],[15,-65],[20,-67],[20,-62],[15,-59],[6,-58],[-10,-58],[-17,-60],[-21,-63]],H.ink);p([[-18,-64],[-14,-63],[-10,-61],[9,-62],[15,-63],[18,-65],[18,-62],[14,-60],[5,-59],[-10,-59],[-16,-61]],'#92704c');p([[-18,-64],[-14,-63],[-10,-61],[5,-61],[13,-62],[17,-63],[14,-60],[-10,-60],[-16,-62]],'#ac855a');r(-8,-60,16,.5,'#c6a272');}
  return;
 }
 if(style===6){ // Combat helmet: rounded shell with ear cut-outs, a cover band, chin strap and a night-vision mount.
  const S='#4d5236',SH='#636a46',SL='#383c27',SD='#2a2c1f',MOUNT='#6f7377';
  if(side){
   p([[-12,-61],[-12,-69],[-8,-75],[-1,-77],[6,-76],[11,-71],[12,-65],[11,-61]],H.ink);
   p([[-11,-62],[-11,-68],[-7.5,-73.5],[-1,-75.5],[5.5,-74.5],[10,-70.5],[11,-65],[10,-62.5]],S);
   p([[-9,-69],[-6,-73],[-1,-74.5],[4,-73.5],[0,-72],[-5,-70],[-8,-67]],SH);r(-11,-65,21.5,1.5,SL);
   p([[-12,-62],[-3,-62],[-2,-57],[-5,-55],[-11,-56]],H.ink);p([[-11,-61.5],[-3.5,-61.5],[-3,-57.5],[-5,-56],[-10.5,-57]],S);r(-9,-60,4,2,SL);
   r(-1,-61,1,8,SD);r(-1,-53.5,6,1,SD);p([[10,-68.5],[13.5,-68.5],[14,-64],[10,-64]],H.ink);r(10.5,-68,3,3.5,SD);r(11.5,-67,1,1,MOUNT);return;}
  p([[-13,-60],[-12.5,-69],[-8,-75],[-2,-77],[5,-76],[11,-72],[13,-66],[12.5,-60]],H.ink);
  p([[-12,-61],[-11.5,-68.5],[-7.5,-73.5],[-2,-75.5],[4.5,-74.5],[10,-71],[11.5,-66],[11.5,-61]],S);
  p([[-10,-68],[-6.5,-72.5],[-1,-74.5],[3,-73.5],[-1,-72],[-5.5,-69],[-9,-65]],SH);r(-12,-65,23.5,1.5,SL);
  if(back){p([[-12,-61],[11.5,-61],[10.5,-55.5],[-11,-55.5]],H.ink);p([[-11,-60.5],[10.5,-60.5],[9.5,-56.5],[-10,-56.5]],S);r(-9,-58.5,17,1,SL);r(-2.5,-70,5,3,SL);r(-1,-72.5,2,2,'#7a7f5a');
   if(quarter){r(9.5,-56,.75,5,SD);}return;}
  const dx=quarter?1.5:0;r(-11,-61.5,22.5,1,SD);
  p([[-3+dx,-70],[3+dx,-70],[3+dx,-65.5],[-3+dx,-65.5]],H.ink);r(-2.5+dx,-69.5,5,3.5,SD);r(-1+dx,-68.5,2,1.5,MOUNT);
  p([[-13,-61],[-9.5,-61],[-9.5,-55.5],[-12.5,-55.5]],H.ink);r(-12.5,-60.5,2.5,4.5,S);
  p([[9.5,-61],[12.5,-61],[12,-55.5],[9.5,-55.5]],H.ink);r(10,-60.5,2,4.5,S);r(-10.5,-56,.75,4.5,SD);r(9.5,-56,.75,4.5,SD);return;
 }
 // Riot shell extends over the temples and nape; the visor sits in front of the face.
 p([[-13,-61],[-12,-70],[-8,-75],[-2,-77],[5,-76],[11,-72],[13,-66],[12,-60],[-12,-60]],H.ink);
 // Only the shell's crown spans the face; lower protection wraps around its sides.
 p([[-11,-63],[-10,-69],[-6,-73],[-1,-75],[5,-74],[9,-70],[11,-65],[9,-61],[-9,-60]],'#263541');
 p([[-10,-65],[-8,-70],[-4,-73],[1,-73],[5,-72],[7,-69],[0,-70],[-6,-66]],'#435563');r(-5,-73,6,1,'#617380');
 if(back){p([[-11,-63],[11,-64],[10,-55],[7,-52],[-8,-52],[-11,-56]],'#263541');p([[-9,-62],[-5,-64],[6,-64],[8,-60],[6,-55],[-7,-55]],'#344754');r(-7,-55,13,2,'#15212b');r(-3,-58,6,1,'#71828a');if(quarter){p([[9,-62],[14,-61],[15,-50],[11,-47],[9,-49]],'#8ab7c330');r(13,-59,1,9,'#607d89');r(10,-49,3,1,'#9eafb0');}return;}
 if(side){
  p([[-12,-63],[-2,-63],[1,-59],[0,-54],[-3,-51],[-8,-51],[-12,-55]],H.ink);
  p([[-10,-62],[-3,-62],[-1,-59],[-2,-55],[-4,-53],[-8,-53],[-10,-56]],'#30434f');r(-8,-59,4,3,'#1c2a34');r(-3,-60,2,2,'#829099');
  p([[0,-62],[11,-62],[14,-59],[14,-50],[10,-47],[2,-49]],'#92c6d129');
  p([[0,-63],[11,-63],[15,-60],[15,-58],[13,-59],[10,-61],[0,-61]],'#17232c');r(13,-58,1,8,'#7c9ba5');p([[2,-49],[10,-47],[14,-50],[13,-49],[10,-46],[2,-48]],'#607e8a');r(10,-57,1,6,'#c0dbe54d');
  p([[-2,-54],[0,-53],[2,-48],[6,-47],[5,-46],[0,-47],[-2,-51]],'#18252d');return;
 }
 p([[-12,-62],[-8,-62],[-8,-55],[-6,-52],[-9,-51],[-12,-55]],H.ink);p([[-11,-61],[-9,-61],[-9,-56],[-8,-54],[-10,-54]],'#3c505c');
 p([[9,-62],[12,-61],[12,-55],[9,-52],[7,-53],[9,-56]],H.ink);r(10,-60,1,5,'#3c505c');
 const dx=quarter?1:0;
 p([[-8+dx,-61],[10+dx,-61],[12+dx,-57],[11+dx,-49],[6+dx,-47],[-7+dx,-48],[-10+dx,-53]],'#92c6d129');
 p([[-10+dx,-63],[10+dx,-63],[13+dx,-60],[12+dx,-58],[9+dx,-61],[-8+dx,-61],[-10+dx,-59]],'#17232c');
 p([[-10+dx,-58],[-9+dx,-52],[-7+dx,-49],[6+dx,-48],[10+dx,-50],[11+dx,-58],[12+dx,-57],[11+dx,-49],[6+dx,-47],[-8+dx,-48],[-11+dx,-53]],'#627e89');
 r(-6+dx,-58,1,6,'#cee5eb66');r(-4+dx,-58,.5,4,'#cee5eb33');r(-11+dx,-61,2,2,'#8f9c9f');r(10+dx,-61,2,2,'#8f9c9f');

}

// Hips sit on one ground plane with the stride: in diagonals the near (right) hip is offset perpendicular to the facing
// direction, so each foot travels its own parallel track and the legs never scissor through each other.
// Facing down-right the near leg is screen-left and lower; facing up-right it is screen-right and lower.
export function legLayout(direction,frame,zombie=false){const dir=((direction%8)+8)%8,side=dir===0||dir===4,back=dir>=5,quarter=dir%2===1,G=gait(frame,side,back,quarter,zombie);
 // In profile both hips share one centre while moving, so each foot reaches equally far forward and back.
 const centre=side&&frame>0?2:0,farX=side?1:quarter?(back?-4.5:4.5):4,nearX=side?-3:quarter?(back?4.5:-4.5):-5;
 return {far:{x:farX,depth:quarter?4:0,foot:{...G.far,dx:G.far.dx-centre}},near:{x:nearX,depth:0,foot:{...G.near,dx:G.near.dx+centre}}};}
// Female tailoring: the same authored parts, pinched horizontally by a smooth profile (shoulders, chest, waist, hips).
// Edges are subdivided before warping so long vertical outlines follow the waist curve.
const lerpProfile=(pts,y)=>{if(y<=pts[0][0])return pts[0][1];for(let i=1;i<pts.length;i++)if(y<=pts[i][0]){const [y0,k0]=pts[i-1],[y1,k1]=pts[i];return k0+(k1-k0)*(y-y0)/(y1-y0);}return pts[pts.length-1][1];};
const TORSO_FRONT=[[-51,.84],[-45,.84],[-41,.86],[-34,.74],[-28,.9],[-22,.94]],TORSO_SIDE=[[-51,.9],[-41,.94],[-34,.84],[-25,.94]],JAW=[[-56,1],[-53,.94],[-49,.86],[-45,.84]];
function tailor(g,cx,profile,lift=0){const k=y=>lerpProfile(profile,y),w=(x,y)=>[cx+(x-cx)*k(y),y+(lift&&y>-54?lift*Math.min(1,(y+54)/6):0)];
 const split=pts=>{const out=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length],n=Math.max(1,Math.ceil(Math.abs(b[1]-a[1])/1.5));for(let j=0;j<n;j++)out.push([a[0]+(b[0]-a[0])*j/n,a[1]+(b[1]-a[1])*j/n]);}return out;};
 return {p:(pts,col)=>g.p(split(pts).map(([x,y])=>w(x,y)),col),r:(x,y,wd,h,col)=>{const [x0,y0]=w(x,y+h/2),[x1]=w(x+wd,y+h/2);g.r(x0,y0-h/2,Math.max(.5,x1-x0),h,col);}};}
// Lashes and a softer mouth sit on top of the tailored face.
function femaleFace(g,back,quarter,side,zombie){if(back&&!(quarter))return;const {r}=g;
 if(side){r(7,-58.5,1,.5,C.ink);if(!zombie)r(7.5,-52,1,.5,C.skinLo);return;}
 if(back){r(9.5,-57.5,.5,.5,C.ink);return;}
 const x=quarter?2:0;r(-4.5+x,-58.5,1,.5,C.ink);r(4+x,-58.5,1,.5,C.ink);if(!zombie)r(x+.5,-50.5,2,.5,C.skinLo);}
// A lowered hood lies behind the neck: a rim over the shoulders from the front, a folded hood on the upper back from behind.
function hood(g,back,quarter,side){const {p,r}=g;
 if(side){p([[-11,-49],[-9,-54],[-3,-54],[-2,-47],[-6,-43],[-10,-44]],C.ink);p([[-10,-49],[-8.5,-53],[-4,-53],[-3,-47.5],[-6,-44.5],[-9,-45.5]],C.coat);p([[-8,-51],[-4.5,-51],[-4,-48],[-6,-46.5]],C.coatDeep);return;}
 if(back){const dx=quarter?-1:0;p([[-10+dx,-52],[9+dx,-52],[10.5+dx,-46],[4+dx,-39],[-5+dx,-39],[-11.5+dx,-46]],C.ink);p([[-9+dx,-51],[8+dx,-51],[9.5+dx,-46],[3.5+dx,-40.5],[-4.5+dx,-40.5],[-10.5+dx,-46]],C.coat);
  p([[-6+dx,-50],[5+dx,-50],[6+dx,-46.5],[2+dx,-43.5],[-3+dx,-43.5],[-7+dx,-46.5]],C.coatDeep);r(-4+dx,-42,7,1,C.coatHi);return;}
 p([[-13,-46],[-12.5,-51.5],[-9,-55],[8,-55],[11.5,-51.5],[12,-46],[8,-46.5],[-9,-46.5]],C.ink);p([[-12,-47],[-11.5,-51],[-8.5,-54],[7.5,-54],[10.5,-51],[11,-47],[-9,-47.5]],C.coat);
 p([[-10,-48],[-9.5,-51.5],[-7,-53],[6,-53],[8.5,-51.5],[9,-48]],C.coatDeep);r(-11.5,-50,1.5,3,C.coatHi);
}
// Shirt collars, tie knot and the tank top's scoop neck sit over the plain crew collar.
function neckline(g,back,quarter,side,T){const {p,r}=g;
 if(T.scoop&&!back){if(!side){const x=quarter?1:0;p([[-6.5+x,-51],[6.5+x,-51],[4+x,-42.5],[-4+x,-42.5]],C.coatDeep);p([[-5.5+x,-51],[5.5+x,-51],[3.3+x,-43.5],[-3.3+x,-43.5]],C.skin);r(-2+x,-47,4,1,C.skinLo);r(-1+x,-45,2,.5,C.skinLo);
  p([[-7,-49],[-6,-49],[-6,-46],[-9.5,-44.5],[-10.5,-44.5]],C.skin);p([[5.5,-49],[7,-48.5],[9.5,-45],[6.5,-45.5]],C.skin);}else p([[1,-50],[5,-49],[4,-45],[1,-46]],C.skin);return;}
 // A suit shows the shirt's collar points and the tie knot in its V, and a strip of collar above the jacket at the back.
 if(T.suit){if(back){r(-5,-51.5,10,1,C.shirtHi);return;}if(side){p([[1,-50.5],[4.5,-49],[3.5,-46.5],[1,-48]],C.shirtHi);return;}const x=quarter?2:-1;
  p([[x-3,-48.75],[x-.25,-47.25],[x-1.25,-44.75],[x-3.5,-46.75]],C.shirtHi);p([[x+.25,-47.25],[x+3,-48.75],[x+3.5,-46.75],[x+1.25,-44.75]],C.shirtHi);p([[x-1,-47.25],[x+1,-47.25],[x+.75,-45.25],[x-.75,-45.25]],TIE[2]);return;}
 if(!T.collar)return;
 if(back){r(-6,-51,12,1.5,C.coatLight);return;}
 if(side){p([[1,-50.5],[5,-49],[3.5,-46],[1,-48]],C.coatLight);return;}
 if(T.tie)p([[-1.5+(quarter?1:0),-47.5],[1.5+(quarter?1:0),-47.5],[1+(quarter?1:0),-44.5],[-1+(quarter?1:0),-44.5]],TIE[2]);
 const x=quarter?1:0;
 p([[-7+x,-48.5],[-.5+x,-46.5],[-2+x,-42.5],[-7.5+x,-45.5]],C.ink);p([[-6.5+x,-47.8],[-1+x,-46.2],[-2.2+x,-43.5],[-6.8+x,-45.7]],C.coatLight);
 p([[.5+x,-46.5],[6.5+x,-48.5],[7+x,-45.5],[1.5+x,-42.5]],C.ink);p([[1+x,-46.2],[6+x,-47.8],[6.3+x,-45.7],[1.7+x,-43.5]],C.coatLight);
}
// The survivor is painted in layers so the game can turn them separately, as in a twin-stick shooter: the legs face the way you
// walk, the body the nearest of the eight facings toward your aim, and the arms and gun the exact aim angle. The gun sits between
// the body and a top layer of neck and head (and, from behind, the backpack), as it always has. survivor() stacks them for one facing.
export function survivor(c,direction=1,frame=0,pack=true,look={}){const dir=((direction%8)+8)%8;
 survivorLegs(c,dir,frame,look);survivorBody(c,dir,frame,pack,look,'under');gunArms(c,dir*Math.PI/4,look,frame);survivorBody(c,dir,frame,pack,look,'over');}
const view=direction=>{const dir=((direction%8)+8)%8;return {dir,side:dir===0||dir===4,back:dir>=5,quarter:dir%2===1,mirror:dir===3||dir===4||dir===5};};
// How far the upper body rises, dips and leans on this frame, on screen. The gun layer follows it, and so do the special dead's
// changes of shape (zombie: true for the shamble).
export function bodyShift(direction,frame,zombie=false){const {side,back,quarter,mirror}=view(direction),G=gait(frame,side,back,quarter,zombie);return {x:mirror?-G.lean:G.lean,y:G.bob};}
// Shadow, legs and shoes. Feet keep their own ground plane.
export function survivorLegs(c,direction=1,frame=0,look={}){const zombie=look.zombie===1,{dir,side,mirror}=view(direction),maps=colorMaps(look);MIRROR=mirror;
 c.save();c.translate(40,85);if(mirror)c.scale(-1,1);const g=tint(painter(c),maps.main),boots=tint(painter(c),maps.boots);
 g.p([[-16,0],[-11,-3],[11,-3],[17,0],[15,3],[-12,3]],'#11152230');g.p([[-11,0],[-6,-2],[9,-2],[13,1],[9,3],[-9,2]],'#11152242');
 const L=legLayout(dir,frame,zombie);
 leg(g,L.far.x,L.far.foot,side,false,L.far.depth,boots,look.bottom||0,look.shoes||0);leg(g,L.near.x,L.near.foot,side,true,0,boots,look.bottom||0,look.shoes||0);if(zombie)zombieLegs(c,g,L,look.bottom||0,look);c.restore();}
// The arms and gun at any angle: shoulders from the body's facing, hands on the gun, the gun along the aim.
export function gunArms(c,angle,look={},frame=0,act=0){if(look.zombie===1||!holds(look.gun))return;const {side,back,quarter,mirror}=view(facingOf(angle)),G=gait(frame,side,back,quarter),maps=colorMaps(look),T=TOPS[look.top]||TOPS[0],female=look.body===1;
 const shoulder=x=>female&&!side?-.5+(x+.5)*.86:x;
 c.save();c.translate(40,85);if(mirror)c.scale(-1,1);c.translate(G.lean,G.bob);const g=tint(painter(c),maps.main);weaponArms(g,look.gun,angle,T.sleeve,shoulder,act);heldGun(g,look.gun,angle,look.paint,act,!!look.light);c.restore();}
// Everything above the legs. 'under' is the torso, walking arms (when no gun is held) and belt grenade; 'over' is the neck and head,
// and from behind the backpack when a gun is held, so the arms and gun show between the coat and the pack. 'over' never changes
// from frame to frame except by bodyShift, so the game draws it once per facing.
export function survivorBody(c,direction=1,frame=0,pack=true,look={},part='all'){
 // Zombies drop whatever the survivor was carrying.
 const zombie=look.zombie===1;if(zombie)look={...look,gun:null,grenade:null};
 const {side,back,quarter,mirror}=view(direction);MIRROR=mirror;
 const G=gait(frame,side,back,quarter,zombie),maps=colorMaps(look),T=TOPS[look.top]||TOPS[0],sleeve=T.sleeve,female=look.body===1;
 // Pack choice 1 removes the pack and its straps; the legacy pack argument only hides the pack itself.
 const straps=look.pack!==1;pack=pack&&straps;const U=part!=='over',O=part!=='under',packOver=back&&holds(look.gun);
 c.save();c.translate(40,85);if(mirror)c.scale(-1,1);
 // The upper body rises, dips and (when running) leans into the stride.
 c.save();c.translate(G.lean,G.bob);let g=tint(painter(c),maps.main),packG=tint(painter(c),maps.pack);
 // Upper-body parts draw through the tailoring warp; arms keep their thickness and move in with the shoulders.
 const body=female?tailor(g,-.5,side?TORSO_SIDE:TORSO_FRONT):g,headG=female?tailor(g,side?2:quarter?1.5:-.5,JAW,-.5):g,shoulder=x=>female&&!side?-.5+(x+.5)*.86:x;FLAT=g;TIGHT=female&&!side;SQUEEZE=TIGHT?x=>-.5+(x+.5)*.84:x=>x;if(female)packG=tailor(packG,-.5,side?TORSO_SIDE:TORSO_FRONT);
 // Zombie arms reach forward: the same arm art, turned and foreshortened toward the facing direction.
 const armAt=(pg,x,y,hand,near)=>zombie?arm(reachPainter(pg,x,y,zombieReach(x,side,back,quarter,near,G)),x,y,{dx:0,dy:0,bend:0},near,sleeve):arm(pg,x,y,hand,near,sleeve);
 // Other views need a visible far sleeve and hand outside the torso/pack.
 // Quarter views foreshorten that arm instead of hiding the whole limb.
  // Front diagonals turn the left (far) side away on screen-right; back diagonals put it on screen-left.
 const farArm=()=>{const x=shoulder(back&&quarter?-14:quarter?11:-11),width=quarter?(back?.75:.85):1;
  const far={p:(pts,col)=>g.p(pts.map(([px,py])=>[x+(px-x)*width,py]),col),r:(px,py,w,h,col)=>g.r(x+(px-x)*width,py,w*width,h,col)};
  armAt(far,x,-46,G.farHand,false);
 },nearArm=()=>armAt(g,side?0:shoulder(quarter&&!back?-11:11),-45,G.nearHand,true);
 // From behind, arms held out in front rise up the screen past the shoulders; the torso and head cover the rest.
 const reachBehind=zombie&&back;if(U&&reachBehind){farArm();nearArm();}
 // In profile the far arm is genuinely behind the body.
 if(U){if(side&&!holds(look.gun))armAt(g,3,-46,G.farHand,false);}
 if(U){if(pack&&!back)backpack(packG,false,quarter,side,look.pack|0);}
 // Long hair falls behind the shoulders in forward views, so that part is painted before the torso.
 if(U&&look.hair===7)hairBehind(headG,back,quarter,side,look.hair,hairPalette(look));
 if(U){torso(body,back,quarter,side,T,straps?packG:null);if(zombie)zombieTorso(c,body,back,quarter,side,look);}
 if(pack&&back&&(packOver?O:U))backpack(packG,true,quarter,false,look.pack|0);
 if(U){if(!side&&!holds(look.gun)&&!reachBehind)farArm();}
 if(U){if(!holds(look.gun)&&!reachBehind)nearArm();}
 if(U){if(look.grenade&&!back){const belt={p:(pts,col)=>g.p(pts.map(([x,y])=>[x*.6-8,y*.6-25]),col),r:(x,y,w,h,col)=>g.r(x*.6-8,y*.6-25,w*.6,h*.6,col)};grenadeArt(belt,look.grenade);}}
 // Neck/collar connect torso and skull; the head is the final silhouette layer.
 if(O){if(T.hood)hood(body,back,quarter,side,true);if(female)g.r(side?.5:-2.5,-51,5,4,C.skinLo);else g.r(side?0:-3,-51,6,4,C.skinLo);body.p([[-6,-51],[1,-50],[6,-51],[8,-48],[4,-46],[-5,-47],[-8,-49]],C.coatDeep);body.r(-5,-49,5,1,C.coatHi);neckline(body,back,quarter,side,T);if(zombie)zombieBite(c,body,back,quarter,side,look);}
 // The female head narrows the jaw and lifts the chin slightly; crown, hair volume and hats are unchanged above the cheekbones.
 if(O){appearanceHead(headG,back,quarter,side,look);if(female)femaleFace(g,back,quarter,side,zombie);}c.restore();c.restore();
}
