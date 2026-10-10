// The survivor in layers for the Training Grounds (v0.29), the way twin-stick shooters draw their heroes: legs that face the way you
// walk, a body that turns to the nearest of eight facings toward your aim, and arms and gun drawn ahead of time at 64 angles, so the
// barrel points where you aim and stays crisp pixel art. Each layer is cropped to the part of the 160 × 192 frame it uses.
import {survivorLegs,survivorBody,gunArms,bodyShift,FRAME,FRAME_COUNT} from './character.js';
import {GUNS} from '../weapons/equipment.js';
export const AIM_ANGLES=64;
// Crops in source pixels of the full frame, measured over every look with a little room to spare.
export const LAYERS={
 legs:{key:'tg-legs',x:40,y:108,w:80,h:76,cols:8,count:8*FRAME_COUNT},
 body:{key:'tg-body',x:24,y:40,w:112,h:92,cols:8,count:8*FRAME_COUNT},
 arms:{key:'tg-arms',x:8,y:44,w:144,h:96,cols:8,count:AIM_ANGLES},
 head:{key:'tg-head',x:32,y:8,w:96,h:124,cols:8,count:8}};
export const ORDER=['legs','body','arms','head'];
export const aimIndex=a=>((Math.round(a/(Math.PI*2)*AIM_ANGLES)%AIM_ANGLES)+AIM_ANGLES)%AIM_ANGLES;
export const armed=look=>look.zombie!==1&&!!GUNS[look.gun];
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
