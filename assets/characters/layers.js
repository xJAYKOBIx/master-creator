// The survivor in layers for the Training Grounds (v0.29), the way twin-stick shooters draw their heroes: legs that face the way you
// walk, a body that turns to the nearest of eight facings toward your aim, and arms and gun drawn ahead of time at 64 angles, so the
// barrel points where you aim and stays crisp pixel art. Each layer is cropped to the part of the 160 × 192 frame it uses.
// With a gun (or the flashlight) in hand the body and head also come at the same 64 angles (turn.js), after the walking frames,
// so the face and chest follow your aim all the way round instead of snapping between eight.
import {survivorLegs,survivorBody,gunArms,bodyShift,FRAME,FRAME_COUNT} from './character.js';
import {holds} from '../weapons/equipment.js';
import {canvas} from '../core/kit.js';
import {TURNS,nearest,rowsOf,turnLayers} from './turn.js';
export const AIM_ANGLES=64;
// Crops in source pixels of the full frame, measured over every look with a little room to spare.
export const LAYERS={
 legs:{key:'tg-legs',x:40,y:108,w:80,h:76,cols:8,count:8*FRAME_COUNT},
 body:{key:'tg-body',x:24,y:40,w:112,h:92,cols:16,count:8*FRAME_COUNT+TURNS},
 arms:{key:'tg-arms',x:8,y:44,w:144,h:96,cols:8,count:AIM_ANGLES},
 head:{key:'tg-head',x:32,y:8,w:96,h:124,cols:8,count:8+TURNS}};
// Where the 64 turned frames start in the body and head sheets (an armed body does not move with the walk, only bobs, so one each).
export const TURNED={body:8*FRAME_COUNT,head:8};
export const ORDER=['legs','body','arms','head'];
export const aimIndex=a=>((Math.round(a/(Math.PI*2)*AIM_ANGLES)%AIM_ANGLES)+AIM_ANGLES)%AIM_ANGLES;
export const armed=look=>look.zombie!==1&&holds(look.gun);
const cell=(L,i)=>[(i%L.cols)*L.w,Math.floor(i/L.cols)*L.h];
export const sheetSize=L=>[L.cols*L.w,Math.ceil(L.count/L.cols)*L.h];
// Where the feet sit inside a cropped frame, as a sprite origin.
export const origin=L=>[(FRAME.w/2-L.x)/L.w,(FRAME.footY*2-L.y)/L.h];
// Frame ids match the full sheet: facing + frame × 8 for legs and body, the facing for the head, the angle step for the arms, and
// TURNED + the angle step for the turned body and head.
function paint(ctx,L,i,draw){const [x,y]=cell(L,i);ctx.save();ctx.beginPath();ctx.rect(x,y,L.w,L.h);ctx.clip();ctx.translate(x-L.x,y-L.y);ctx.scale(2,2);draw(ctx);ctx.restore();}
// Returns whether the turned frames are in the sheets (pose(m, true) needs them); false when unarmed or they could not be painted.
export function paintLayers(sheets,look){
 for(const k of ORDER){const L=LAYERS[k],c=sheets[k];c.clearRect(0,0,...sheetSize(L));c.imageSmoothingEnabled=false;}
 for(let f=0;f<FRAME_COUNT;f++)for(let d=0;d<8;d++){const i=f*8+d;paint(sheets.legs,LAYERS.legs,i,c=>survivorLegs(c,d,f,look));paint(sheets.body,LAYERS.body,i,c=>survivorBody(c,d,f,true,look,'under'));}
 for(let d=0;d<8;d++)paint(sheets.head,LAYERS.head,d,c=>survivorBody(c,d,0,true,look,'over'));
 if(!armed(look))return false;
 for(let a=0;a<AIM_ANGLES;a++)paint(sheets.arms,LAYERS.arms,a,c=>gunArms(c,a/AIM_ANGLES*Math.PI*2,look,0));
 return paintTurns(sheets,look);}
// The turned body and head: each facing drawn once, whole-frame, on one scratch canvas and read back, then turned to the angles
// nearest it and written straight into the sheet cells with putImageData. Nothing is drawn from a scratch canvas into a sheet:
// Safari can draw an OffscreenCanvas from before its last change, which put other cells' pixels (or none) into the turned frames.
// Every cell is read back and checked; if any is wrong the turned cells are cleared and false is returned, so a game falls back
// to the eight facings rather than show a body with parts missing.
const scratch=(like,w,h)=>{for(const make of [()=>Object.assign(document.createElement('canvas'),{width:w,height:h}),()=>canvas(w,h),()=>new like.canvas.constructor(w,h)]){
 try{const c=make(),x=c?.getContext?.('2d',{willReadFrequently:true});if(x?.getImageData&&x.createImageData)return x;}catch{}}return null;};
const same=(got,want,w,h,F,x0,y0)=>{let bad=0;for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4,j=((y+y0)*F+x+x0)*4,A=want[j+3];
 if(Math.abs(got[i+3]-A)>2||A>0&&(Math.abs(got[i]-want[j])>8||Math.abs(got[i+1]-want[j+1])>8||Math.abs(got[i+2]-want[j+2])>8))bad++;}return bad<=w*h/200;};
function paintTurns(sheets,look){const [W,H]=[FRAME.w,FRAME.h],x=scratch(sheets.body,W,H);if(!x)return false;x.imageSmoothingEnabled=false;
 const full=part=>d=>{x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,W,H);x.scale(2,2);survivorBody(x,d,0,true,look,part);return x.getImageData(0,0,W,H);};
 const under=[...Array(8).keys()].map(full('under')),over=[...Array(8).keys()].map(full('over')),rows=under.map((u,d)=>rowsOf([u,over[d]]));
 const img=x.createImageData(W,H),cells=[];let ok=true;
 for(let a=0;a<TURNS;a++){const {d,delta}=nearest(a/TURNS*Math.PI*2),[u,v]=turnLayers([under[d],over[d]],delta,rows[d]);
  for(const [k,px] of [['body',u],['head',v]]){const L=LAYERS[k],[cx,cy]=cell(L,TURNED[k]+a);img.data.set(px);sheets[k].putImageData(img,cx-L.x,cy-L.y,L.x,L.y,L.w,L.h);cells.push([k,cx,cy,px]);}}
 const back={};try{for(const k of ['body','head'])back[k]=sheets[k].getImageData(0,0,...sheetSize(LAYERS[k]));}catch{}
 if(back.head)for(const [k,cx,cy,px] of cells){const L=LAYERS[k],B=back[k],got=new Uint8ClampedArray(L.w*L.h*4);
  for(let y=0;y<L.h;y++)got.set(B.data.subarray(((cy+y)*B.width+cx)*4,((cy+y)*B.width+cx+L.w)*4),y*L.w*4);if(!same(got,px,L.w,L.h,W,L.x,L.y)){ok=false;break;}}
 if(!ok){for(const [k,cx,cy] of cells)sheets[k].clearRect(cx,cy,LAYERS[k].w,LAYERS[k].h);if(typeof console!=='undefined')console.warn('survivor turns: read back wrong, using the eight facings');}
 return ok;}
// Which frame of each layer to show, and how far the head and arms ride with the body's bob and lean (rides: the layers that
// move with it; a turned body is the standing frame, so it rides too).
// turn: the look is armed and painted with the turned frames, so the body and head follow the aim at 64 angles.
export function pose(m,turn=false){const f=m.frame||0,dir=m.direction,s=bodyShift(dir,f),arms=aimIndex(m.aim??dir*Math.PI/4);
 return {legs:(m.legDir??dir)+f*8,body:turn?TURNED.body+arms:dir+f*8,head:turn?TURNED.head+arms:dir,arms,dx:s.x,dy:s.y,rides:turn?['body','arms','head']:['arms','head']};}
// Stack the layers into a 2D canvas: (x, y) is where the feet go and scale is destination pixels per source pixel.
export function drawLayers(c,sheets,m,x,y,scale,withArms=true,turn=false){const p=pose(m,turn);
 for(const k of ORDER){if(k==='arms'&&!withArms)continue;const L=LAYERS[k],[sx,sy]=cell(L,p[k]),ride=p.rides.includes(k),ox=ride?p.dx*2:0,oy=ride?p.dy*2:0;
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
