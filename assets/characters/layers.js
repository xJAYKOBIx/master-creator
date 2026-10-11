// The survivor in layers for the Training Grounds (v0.29), the way twin-stick shooters draw their heroes: legs that face the way you
// walk, a body that turns to the nearest of eight facings toward your aim, and arms and gun drawn ahead of time at 64 angles, so the
// barrel points where you aim and stays crisp pixel art. Each layer is cropped to the part of the 160 × 192 frame it uses.
import {survivorLegs,survivorBody,gunArms,bodyShift,FRAME,FRAME_COUNT} from './character.js';
import {holds} from '../weapons/equipment.js';
import {canvas} from '../core/kit.js';
export const AIM_ANGLES=64;
// Crops in source pixels of the full frame, measured over every look with a little room to spare.
export const LAYERS={
 legs:{key:'tg-legs',x:40,y:108,w:80,h:76,cols:8,count:8*FRAME_COUNT},
 body:{key:'tg-body',x:24,y:40,w:112,h:92,cols:8,count:8*FRAME_COUNT},
 arms:{key:'tg-arms',x:8,y:44,w:144,h:96,cols:8,count:AIM_ANGLES},
 head:{key:'tg-head',x:32,y:8,w:96,h:124,cols:8,count:8}};
export const ORDER=['legs','body','arms','head'];
export const aimIndex=a=>((Math.round(a/(Math.PI*2)*AIM_ANGLES)%AIM_ANGLES)+AIM_ANGLES)%AIM_ANGLES;
export const armed=look=>look.zombie!==1&&holds(look.gun);
const cell=(L,i)=>[(i%L.cols)*L.w,Math.floor(i/L.cols)*L.h];
export const sheetSize=L=>[L.cols*L.w,Math.ceil(L.count/L.cols)*L.h];
// Where the feet sit inside a cropped frame, as a sprite origin.
export const origin=L=>[(FRAME.w/2-L.x)/L.w,(FRAME.footY*2-L.y)/L.h];
// Frame ids match the full sheet: facing + frame × 8 for legs and body, the facing for the head, the angle step for the arms.
function paint(ctx,L,i,draw){const [x,y]=cell(L,i);ctx.save();ctx.beginPath();ctx.rect(x,y,L.w,L.h);ctx.clip();ctx.translate(x-L.x,y-L.y);ctx.scale(2,2);draw(ctx);ctx.restore();}
export function paintLayers(sheets,look){
 for(const k of ORDER){const L=LAYERS[k],c=sheets[k];c.clearRect(0,0,...sheetSize(L));c.imageSmoothingEnabled=false;}
 for(let f=0;f<FRAME_COUNT;f++)for(let d=0;d<8;d++){const i=f*8+d;paint(sheets.legs,LAYERS.legs,i,c=>survivorLegs(c,d,f,look));paint(sheets.body,LAYERS.body,i,c=>survivorBody(c,d,f,true,look,'under'));}
 for(let d=0;d<8;d++)paint(sheets.head,LAYERS.head,d,c=>survivorBody(c,d,0,true,look,'over'));
 if(armed(look))for(let a=0;a<AIM_ANGLES;a++)paint(sheets.arms,LAYERS.arms,a,c=>gunArms(c,a/AIM_ANGLES*Math.PI*2,look,0));}
// Which frame of each layer to show, and how far the head and arms ride with the body's bob and lean.
export function pose(m){const f=m.frame||0,dir=m.direction,s=bodyShift(dir,f);return {legs:(m.legDir??dir)+f*8,body:dir+f*8,head:dir,arms:aimIndex(m.aim??dir*Math.PI/4),dx:s.x,dy:s.y};}
// Stack the layers into a 2D canvas: (x, y) is where the feet go and scale is destination pixels per source pixel.
export function drawLayers(c,sheets,m,x,y,scale,withArms=true){const p=pose(m);
 for(const k of ORDER){if(k==='arms'&&!withArms)continue;const L=LAYERS[k],[sx,sy]=cell(L,p[k]),ride=k==='arms'||k==='head',ox=ride?p.dx*2:0,oy=ride?p.dy*2:0;
  c.drawImage(sheets[k].canvas,sx,sy,L.w,L.h,x+(L.x-FRAME.w/2+ox)*scale,y+(L.y-FRAME.footY*2+oy)*scale,L.w*scale,L.h*scale);}}
// The arms and gun mid-action (v0.41), the same 64 angles as the arms layer: a pistol's slide locked back, a shotgun's pump pulled
// back. A game swaps to it for a moment as each shot goes off (or as the pump is worked), so the gun visibly cycles.
export function paintRacked(c,look){const L=LAYERS.arms;c.clearRect(0,0,...sheetSize(L));c.imageSmoothingEnabled=false;
 if(armed(look))for(let a=0;a<AIM_ANGLES;a++)paint(c,L,a,x=>gunArms(x,a/AIM_ANGLES*Math.PI*2,look,0,1));}
// The dive (v0.41), built from the layers above so every look gets it: three phases for each of the eight ways you can go, the
// leap (tipping forward mid-stride), the slide (flat out along the ground) and the rise (pushing back up). Going left or right
// you go over onto your side, head first; going up or down the screen you lie along it, foreshortened, seen from behind (heading
// down, head toward you). Each cell is drawn round the ground point under you, at (x, y) in the cell, so a game draws it at the
// feet; frame ids are facing + phase × 8.
export const DIVE={w:256,h:216,x:128,y:140,cols:8,count:24,phases:3};
const HIPS=40,LIFT=[26,8,22],LEAN=[.35,1,.5];
export function paintDive(c,sheets,look){const S=canvas(FRAME.w,FRAME.h),s=S.getContext('2d');s.imageSmoothingEnabled=false;c.clearRect(0,0,...sheetSize(DIVE));c.imageSmoothingEnabled=false;
 for(let d=0;d<8;d++)for(let ph=0;ph<3;ph++){const a=d*Math.PI/4,vert=d===2||d===6,up=-Math.PI/2;
  // Lying on the ground, a body's length up the screen is foreshortened: it turns to that line, not the line it travels.
  const tx=Math.cos(a),ty=.6*Math.sin(a),turn=vert?0:Math.atan2(tx,-ty)*LEAN[ph];
  const face=vert?(d===2&&ph===2?2:6):tx>0?0:4,aim=vert?(face===2?Math.PI/2:up):face*Math.PI/4,sy=vert?[.9,.5,.8][ph]*(d===2&&ph<2?-1:1):1;
  s.clearRect(0,0,FRAME.w,FRAME.h);drawLayers(s,sheets,{direction:face,legDir:face,frame:ph===0?11:0,aim},FRAME.w/2,FRAME.footY*2,1,armed(look));
  const i=d+ph*8,cx=(i%DIVE.cols)*DIVE.w,cy=Math.floor(i/DIVE.cols)*DIVE.h;
  // A shadow on the ground under the body, along the line it lies on, so a body flat out reads as on the ground and not floating.
  const n=Math.hypot(tx,ty)||1,ax=vert?0:tx/n,ay=vert?(d===2?1:-1):ty/n,len=[30,64,44][ph],wide=vert?[18,24,20][ph]:[14,16,15][ph],mid=[.2,.55,.35][ph]*len;
  c.fillStyle='rgba(8,9,12,.34)';for(let y=-len-4;y<=len+4;y+=2)for(let x=-len-4;x<=len+4;x+=2){const u=x*ax+y*ay-mid,v=-x*ay+y*ax;if((u/len)**2+(v/wide)**2<=1)c.fillRect(cx+DIVE.x+x,cy+DIVE.y+y,2,2);}
  c.save();c.beginPath();c.rect(cx,cy,DIVE.w,DIVE.h);c.clip();c.translate(cx+DIVE.x,cy+DIVE.y-LIFT[ph]);c.rotate(turn);c.scale(1,sy);c.drawImage(S,-FRAME.w/2,-(FRAME.footY*2-HIPS));c.restore();}}
// Builds every layer and the dive for a look into fresh canvases (for previews and tools; a game keeps its own sheets).
export function layerSheets(look){const sheets={};for(const k of ORDER)sheets[k]=canvas(...sheetSize(LAYERS[k])).getContext('2d');paintLayers(sheets,look);return sheets;}
