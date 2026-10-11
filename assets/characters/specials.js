// The special dead: a screamer, a bloater and a spitter. Each is a zombie look (any of them works) with one change of shape painted
// over the body, so it reads from across a dark street: the screamer's jaw hangs open to its chest, the bloater's belly and back
// are swollen tight and covered in pustules, and the spitter has a sac of acid under its chin and burns down its front. act is the
// moment before it does its thing: the scream at full stretch, the belly about to burst, the sac full and the mouth open.
// Painted in the same units as survivor(), on the same 160 × 192 frame, with the foot at (40, 85); the body's rise and lean on each
// walking frame is followed, and the facings that mirror are mirrored.
import {survivor,bodyShift} from './character.js';
import {SKIN_TONES,rotRamp} from './palette.js';
import {painter} from '../core/paint.js';
import {hash} from '../core/kit.js';
export const SPECIAL_KINDS=['screamer','bloater','spitter'];
// Looks that suit each one: a screamer in a nightgown with long hair and glowing eyes, a bloater in a stretched tank top, a spitter
// in a work shirt gone green. Games can use any look; these are only what the library shows.
export const SPECIAL_LOOKS={screamer:{body:1,skin:0,top:2,shirt:1,bottom:3,pants:2,shoes:2,hair:7,color:3,rot:0,decay:1,eyes:1,wounds:2},
 bloater:{body:0,skin:2,top:6,shirt:2,bottom:1,pants:1,shoes:0,hair:3,beard:1,rot:1,decay:2,eyes:0,wounds:0},
 spitter:{body:0,skin:4,top:4,shirt:0,bottom:2,pants:3,shoes:1,hair:4,color:0,rot:1,decay:1,eyes:2,wounds:2}};
const INK='#111319',MOUTH='#2b1215',CAVITY='#1a080a',TEETH='#d6ccb0',BLOOD='#6e1a1d',BLOOD_DK='#3d0f12';
// Pus and acid, dark to light.
const PUS=['#3c4a16','#6f8a2a','#a8c246','#e4f08c'],ACID=['#2e3d0c','#5c7a12','#9ad13a','#e2ff8a'],BURN=['#1f2410','#38401a'];
const view=d=>{const dir=((d%8)+8)%8;return {side:dir===0||dir===4,back:dir>=5,quarter:dir%2===1,mirror:dir===3||dir===4||dir===5};};
// The look's skin, rotted the way the rest of it is.
const skinOf=look=>rotRamp((SKIN_TONES[look.skin]||SKIN_TONES[0]).ramp,look.rot??1,look.decay??1);
export function special(c,kind,direction=2,frame=0,look={},act=0){const L={...SPECIAL_LOOKS[kind],...look,zombie:1};survivor(c,direction,frame,false,L);
 const V=view(direction),s=bodyShift(direction,frame,true),g=painter(c),sk=skinOf(L);c.save();c.translate(40,85);if(V.mirror)c.scale(-1,1);c.translate(V.mirror?-s.x:s.x,s.y);
 ({screamer,bloater,spitter})[kind]?.(g,V,sk,act,direction,shirtAt(c,V));c.restore();}
// The colour of the top, read off the chest just painted (the middle of the torso, clear of arms and wounds).
function shirtAt(c,V){const p=c.getTransform().transformPoint({x:V.side?-2:-5,y:V.side?-36:V.back?-38:-42}),d=c.getImageData(Math.round(p.x),Math.round(p.y),1,1).data;return d[3]?`rgb(${d[0]},${d[1]},${d[2]})`:'#5a5550';}
// A pustule: a dome of pus with a hard highlight; big ones glow when the bloater is about to go.
const pustule=(g,x,y,r,hot)=>{g.e(x,y,r+.5,r+.5,INK);g.e(x,y,r,r,hot?PUS[2]:PUS[1]);g.e(x-r*.25,y-r*.25,r*.55,r*.55,hot?PUS[3]:PUS[2]);g.r(x-r*.45,y-r*.5,.5,.5,'#fbffe0');};
// Veins under stretched skin.
const vein=(g,pts,col)=>{for(let i=1;i<pts.length;i++)g.l(pts[i-1][0],pts[i-1][1],pts[i][0],pts[i][1],.5,col);};
// The bloater: a belly (from the front) or a back (from behind) swollen tight, sagging over the belt, with its top too small to cover
// it: the shirt rides up over the top of the swelling and ends in a torn hem, and below it is bare skin with veins and pustules.
// shirt is the top's colour, picked up off the body it was painted on.
function bloater(g,V,sk,act,dir,shirt){const k=1+act*.12,hot=act>0;
 // The swelling's outline: wider and heavier at the bottom, joining the chest at the top.
 const bag=(cx,top,rx,bottom,lean=0)=>{const pts=[],h=bottom-top,mid=top+h*.42;for(let i=0;i<32;i++){const a=i/32*Math.PI*2,u=Math.cos(a),v=Math.sin(a),up=v<0,w=rx*k*(up?.86:1),ry=up?h*.42:h*.58;pts.push([cx+u*w+lean*(.5+.5*v),mid+v*ry]);}return pts;};
 const body=(cx,top,rx,bottom,lean=0)=>{const o=bag(cx,top-.5,rx+1,bottom+1,lean),m=bag(cx,top,rx,bottom,lean),h=bottom-top;g.p(o,INK);g.p(m,sk[2]);
  // Shade: dark under the sag and down the far side, light on the near top.
  g.p(m.filter(([,y])=>y>top+h*.62).concat([[cx+rx*k*.9+lean,top+h*.62],[cx-rx*k*.9,top+h*.62]]),sk[3]);
  g.e(cx-rx*.28+lean*.3,top+h*.42,rx*k*.42,h*.2,sk[1]);g.e(cx-rx*.38+lean*.3,top+h*.36,rx*k*.16,h*.07,sk[0]);
  // The top, ridden up: its colour over the upper third, ending in a ragged hem.
  const hem=top+h*.3,cut=[];for(let i=0;i<=10;i++){const x=cx-rx*k*.95+i*rx*k*.19;cut.push([x,hem+((i%2)?1.2:-.2)+(hash(i,dir)-.5)]);}
  const shirtPts=[...m.filter(([,y])=>y<hem-1),...cut.reverse()];g.p(shirtPts,shirt);g.p(cut.map(([x,y])=>[x,y+.5]).concat(cut.slice().reverse().map(([x,y])=>[x,y-.5])),INK);};
 if(V.side){body(3,-42,9.5,-16,4);vein(g,[[4,-30],[7,-27],[6,-23],[9,-21]],sk[3]);pustule(g,9.5,-27,1.5,hot);pustule(g,5,-21.5,1.1,hot);if(hot)pustule(g,11,-23,1,true);g.r(10.5,-24.5,.5,.5,INK);return;}
 if(V.back){const x=V.quarter?-2:0;body(x,-46,13,-22);vein(g,[[x-6,-34],[x-3,-31],[x-4,-27]],sk[3]);vein(g,[[x+5,-35],[x+4,-29]],sk[3]);pustule(g,x+4,-32,1.6,hot);pustule(g,x-5,-28,1.2,hot);pustule(g,x+7,-27,1,hot);return;}
 const x=V.quarter?2:0;body(x,-42,14.5,-15,V.quarter?2:0);g.e(x+1,-25,1,.7,sk[3]);g.r(x+.5,-25.5,1,.5,INK);
 vein(g,[[x-7,-31],[x-4,-28],[x-5,-23]],sk[3]);vein(g,[[x+6,-31],[x+8,-27],[x+6,-23],[x+8,-20]],sk[3]);
 pustule(g,x-5,-27,1.7,hot);pustule(g,x+7,-29,1.3,hot);pustule(g,x+3,-20.5,1.1,hot);if(hot){pustule(g,x+9,-23,1.1,true);pustule(g,x-8,-22,1,true);pustule(g,x-1,-30,.9,true);}}
// The screamer: the jaw unhinged down onto the chest, a black hole with teeth along the top; wider still mid-scream.
function screamer(g,V,sk,act){const d=act?5:0,w=act?1.5:0;
 if(V.back){if(act){g.r(-1,-48,2,.5,sk[3]);}return;}
 if(V.side){g.p([[3.5,-53],[8.5+w,-53.5],[8+w,-45-d],[5,-44-d],[3.5,-47]],INK);g.p([[4.5,-52.5],[7.5+w,-52.5],[7+w,-46-d],[5.5,-45.5-d],[4.5,-47.5]],CAVITY);
  g.r(5,-52.5,2.5+w,.5,TEETH);g.r(6,-46-d,1,.5,TEETH);g.r(5,-44.5-d,2.5,.5,sk[2]);g.l(8+w,-48-d,8.5+w,-41-d,.5,BLOOD);return;}
 const x=V.quarter?2:0;g.p([[x-3-w,-53.5],[x+3.5+w,-53.5],[x+3+w,-46-d],[x+1,-43.5-d],[x-1.5,-43.5-d],[x-3-w,-46-d]],INK);
 g.p([[x-2-w,-53],[x+2.5+w,-53],[x+2+w,-46.5-d],[x+.5,-44.5-d],[x-1,-44.5-d],[x-2-w,-46.5-d]],CAVITY);g.r(x-1.5-w,-50,3.5+w*2,2,MOUTH);
 for(let i=0;i<4+(act?1:0);i++)g.r(x-1.5-w+i*1.1,-53,.5,.5+(i%2)*.5,TEETH);g.r(x-.5,-45-d,1,.5,TEETH);g.r(x+1,-45-d,.5,.5,TEETH);
 g.r(x-3.5-w,-46-d,.5,1.5,sk[3]);g.r(x+3.5+w,-46-d,.5,1.5,sk[3]);g.l(x+2.5+w,-45-d,x+3,-39-d,.5,BLOOD);g.r(x+2.5,-39-d,.5,.5,BLOOD_DK);}
// The spitter: a swollen sac of acid hanging under the chin, green drool, and burns where it has run down its front; mid-spit the sac
// is full and the mouth is open on a glob.
function spitter(g,V,sk,act){const k=act?1.35:1;
 const sac=(x,y,rx,ry)=>{g.e(x,y,rx*k+.5,ry*k+.5,INK);g.e(x,y,rx*k,ry*k,ACID[1]);g.e(x-.5,y-.4,rx*k*.7,ry*k*.65,ACID[2]);g.r(x-rx*.45,y-ry*.5,.5,.5,ACID[3]);vein(g,[[x-rx*.6,y-ry*.2],[x,y+ry*.3],[x+rx*.5,y]],ACID[0]);};
 const burn=(x,y,w,h)=>{g.p([[x,y],[x+w,y+h*.2],[x+w*.8,y+h],[x+w*.1,y+h*.8]],BURN[0]);g.r(x+w*.3,y+h*.3,w*.4,h*.3,BURN[1]);g.r(x+w*.2,y+h*.15,.5,.5,ACID[2]);};
 if(V.back){const x=V.quarter?-2:0;g.e(x-6,-48,1.5,1.5,INK);g.e(x-6,-48,1,1,ACID[1]);g.e(x+6,-48,1.5,1.5,INK);g.e(x+6,-48,1,1,ACID[1]);return;}
 if(V.side){sac(5,-46.5,4,3.8);burn(4,-41,4,5);burn(6,-33,3,4);g.l(7,-51.5,7.5,-46,.5,ACID[2]);if(act){g.e(8.5,-52,1.5,1.2,INK);g.e(8.5,-52,1,.8,ACID[3]);}return;}
 const x=V.quarter?2:0;sac(x+.5,-46.5,5,3.8);burn(x-6,-40,4,5);burn(x+3,-34,4,4);burn(x-2,-29,3,3);g.l(x+2,-51,x+2.5,-43,.5,ACID[2]);g.r(x+2.5,-43,.5,1,ACID[3]);
 if(act){g.e(x+.5,-51.5,2.2,1.5,INK);g.e(x+.5,-51.5,1.6,1,ACID[2]);g.r(x,-52,.5,.5,ACID[3]);}}
