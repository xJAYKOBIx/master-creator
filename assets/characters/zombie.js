// Zombie infection layers for Survivor 01: face, torn and bloodied clothes, and wounds.
// Local coordinates face right like the rest of the character. Skin parts use the base skin hexes,
// so the rot ramp from palette.js recolors them along with the face and hands.
// Clothing marks are stamped with source-atop: they land only on pixels already painted, so they follow
// every top, pair of pants and body type without their own outlines.
const SKIN='#d99b73',SKIN_LO='#ae7356',SKIN_DEEP='#85513d',INK='#111319';
const BLOOD='#6e1a1d',BLOOD_HI='#8f2a28',BLOOD_DK='#3d0f12',MOUTH='#2b1215',TEETH='#d6ccb0',BONE='#d8cdb0',BONE_LO='#a3977a',CAVITY='#240b0e';
const EYE={clouded:['#c7cdc2','#8d958e'],glow:['#c9e84a','#f4ffb0','#d6f06038'],hollow:['#0d0a0c','#7d1d20']};

function atop(c,draw){const op=c.globalCompositeOperation;c.globalCompositeOperation='source-atop';draw();c.globalCompositeOperation=op;}

function eye(g,x,y,w,style){const {r}=g;
 if(style===1){r(x-.5,y-.5,w+1,4,EYE.glow[2]);r(x,y,w,3,EYE.glow[0]);r(x+.5,y+.5,Math.max(.5,w-1),1.5,EYE.glow[1]);return;}
 if(style===2){r(x-.5,y-.5,w+1,4,SKIN_DEEP);r(x,y,w,3,EYE.hollow[0]);r(x+.5,y+1.5,.5,.5,EYE.hollow[1]);return;}
 r(x,y,w,3,INK);r(x,y+.5,w,2.5,EYE.clouded[0]);r(x+.5,y+1.5,.5,1,EYE.clouded[1]);}

// Painted after the hair and face, before facial hair and hats, so beards and brims still sit on top.
export function zombieFace(g,back,quarter,side,look){const {r}=g,decay=look.decay??1,style=look.eyes||0;
 if(back&&!quarter)return;
 if(back){r(5.5,-55,1.5,1,SKIN_DEEP);if(decay>1)r(6,-53,1,1,SKIN_DEEP);return;}
 if(side){r(5,-58,2,3,SKIN);eye(g,5,-58,1.5,style);r(5,-55,2,.5,SKIN_DEEP);
  r(5.5,-51.5,3,1,MOUTH);r(7,-51.5,.5,.5,TEETH);r(6,-50.5,.5,2,BLOOD);
  if(decay>0){r(-1,-61,.5,2,SKIN_DEEP);r(-.5,-59,.5,1,SKIN_DEEP);}
  if(decay>1){r(1,-54,2,1.5,SKIN_DEEP);r(1.5,-53.5,1,.5,MOUTH);r(3,-62,1.5,1,SKIN_LO);}
  return;}
 const x=quarter?2:0;
 eye(g,-3+x,-58,2,style);eye(g,3+x,-58,1.5,style);r(-3.5+x,-55,3,.5,SKIN_DEEP);r(2.5+x,-55,2.5,.5,SKIN_DEEP);
 r(x,-51.5,3,.5,SKIN);r(x-.5,-52.5,4,1.5,MOUTH);r(x,-52.5,1,.5,TEETH);r(x+1.5,-52.5,1,.5,TEETH);r(x+.5,-51.5,.5,.5,TEETH);r(x+3,-51.5,.5,2,BLOOD);r(x+3,-49.5,.5,.5,BLOOD_DK);
 if(decay>0){r(-7+x,-61,.5,2,SKIN_DEEP);r(-6.5+x,-59,.5,.5,SKIN_DEEP);r(6+x,-61,.5,1.5,SKIN_DEEP);}
 if(decay>1){r(-7+x,-54,2,1.5,SKIN_DEEP);r(-6.5+x,-53.5,1,.5,MOUTH);r(3+x,-62,1.5,1,SKIN_LO);r(4+x,-53,1,1,SKIN_DEEP);}
}

function rip(g,pts,fill){const cx=pts.reduce((s,v)=>s+v[0],0)/pts.length,cy=pts.reduce((s,v)=>s+v[1],0)/pts.length;
 g.p(pts,INK);g.p(pts.map(([x,y])=>[x+(cx-x)*.35,y+(cy-y)*.35]),fill);}
function splat(g,pts,drip){const cx=pts.reduce((s,v)=>s+v[0],0)/pts.length,cy=pts.reduce((s,v)=>s+v[1],0)/pts.length;
 g.p(pts,BLOOD);g.p(pts.map(([x,y])=>[x+(cx-x)*.5,y+(cy-y)*.5]),BLOOD_HI);if(drip)g.r(drip[0],drip[1],.5,drip[2],BLOOD);}

// Torso stamps run right after the torso, so arms, packs and the head are painted over them.
export function zombieTorso(c,g,back,quarter,side,look){const decay=look.decay??1,wound=look.wounds||0,{p,r}=g;
 atop(c,()=>{
  if(side){
   if(decay>0){splat(g,[[-2,-45],[2,-44],[3,-40],[1,-37],[-1,-39],[-3,-42]],[1,-37,3]);rip(g,[[-6,-30],[-4,-33],[-2,-31],[0,-33.5],[1,-29],[-6,-28]],SKIN_LO);}
   if(decay>1){splat(g,[[-6,-38],[-3,-39],[-3,-35],[-6,-34]]);rip(g,[[1,-46],[4,-47],[5,-43],[3,-41],[1,-43]],SKIN_LO);}
   if(wound===2)for(let i=0;i<3;i++){const x=-5+i*2.5;p([[x,-45],[x+1.5,-45],[x+4.5,-36],[x+3,-36]],BLOOD_DK);p([[x+.5,-44.5],[x+1,-44.5],[x+4,-36.5],[x+3.5,-36.5]],BLOOD_HI);}
   if(wound===3){p([[-4,-44],[0,-45],[3,-42],[3,-36],[0,-34],[-4,-35],[-5,-40]],INK);p([[-3.5,-43],[0,-44],[2.5,-41.5],[2.5,-36.5],[0,-35],[-3.5,-36],[-4.5,-40]],BLOOD);p([[-2.5,-42],[0,-43],[1.5,-41],[1.5,-37],[0,-36],[-3,-37],[-3.5,-40]],CAVITY);for(const y of [-41,-38.5])r(-3,y,4.5,1,BONE),r(-3,y+.5,4.5,.5,BONE_LO);}
   return;}
  if(back){
   if(decay>0){splat(g,[[-7,-46],[-2,-47],[-1,-42],[-4,-40],[-7,-42]],[-3,-40,3]);rip(g,[[3,-30],[5,-33],[7,-31],[9,-33.5],[9,-28],[3,-28]],SKIN_LO);}
   if(decay>1){splat(g,[[4,-44],[8,-45],[9,-40],[6,-38],[4,-40]]);rip(g,[[-10,-36],[-7,-38],[-6,-34],[-9,-32]],SKIN_LO);}
   if(wound===2)for(let i=0;i<3;i++){const x=-7+i*3;p([[x,-46],[x+1.5,-46],[x+7.5,-35],[x+6,-35]],BLOOD_DK);p([[x+.5,-45.5],[x+1,-45.5],[x+7,-35.5],[x+6.5,-35.5]],BLOOD_HI);}
   if(wound===3){p([[-4,-45],[1,-46],[3,-42],[2,-35],[-2,-33],[-5,-36],[-6,-41]],INK);p([[-3.5,-44],[1,-45],[2.5,-42],[1.5,-35.5],[-2,-34],[-4.5,-36.5],[-5,-41]],BLOOD);p([[-2.5,-43],[.5,-44],[1.5,-42],[1,-36.5],[-2,-35],[-3.5,-37],[-4,-41]],CAVITY);for(const y of [-42.5,-40,-37.5])r(-4.5,y,6.5,1,BONE),r(-4.5,y+.5,6.5,.5,BONE_LO);r(-1.5,-43.5,1.5,8,BONE);r(-1,-43.5,.5,8,BONE_LO);}
   return;}
  const q=quarter?1:0;
  if(decay>0){splat(g,[[2+q,-47],[6+q,-46],[7+q,-42],[5+q,-39],[4+q,-41],[1+q,-43]],[5+q,-39,3.5]);rip(g,[[-9,-30],[-7,-33],[-5,-31],[-4,-34],[-2,-30],[-1,-28],[-9,-28]],SKIN_LO);}
  if(decay>1){splat(g,[[-10,-38],[-6,-39],[-5,-35],[-7,-32],[-10,-33]],[-7,-32,2]);rip(g,[[6+q,-45],[9+q,-46],[10+q,-42],[8+q,-40],[6+q,-42]],SKIN_LO);r(1+q,-36,2,1,BLOOD_DK);}
  if(wound===2)for(let i=0;i<3;i++){const x=-8+q+i*3;p([[x,-46],[x+1.5,-46],[x+7.5,-36],[x+6,-36]],BLOOD_DK);p([[x+.5,-45.5],[x+1,-45.5],[x+7,-36.5],[x+6.5,-36.5]],BLOOD_HI);}
  if(wound===3){const o=q;p([[-8+o,-44],[-5+o,-46],[-2+o,-45],[0+o,-42],[-1+o,-38],[0+o,-35],[-3+o,-33],[-6+o,-34],[-8+o,-37],[-9+o,-41]],INK);
   p([[-7.5+o,-43.5],[-5+o,-45],[-2.5+o,-44.5],[-.5+o,-42],[-1.5+o,-38],[-.5+o,-35.5],[-3+o,-34],[-6+o,-35],[-7.5+o,-37.5],[-8.5+o,-41]],BLOOD);
   p([[-6.5+o,-43],[-4.5+o,-44],[-2.5+o,-43.5],[-1.5+o,-41.5],[-2.5+o,-38],[-1.5+o,-36],[-3+o,-35],[-6+o,-36],[-7+o,-38],[-7.5+o,-41]],CAVITY);
   for(const y of [-42.5,-40,-37.5])p([[-7+o,y+.5],[-2.5+o,y],[-1.5+o,y+.5],[-1.5+o,y+1],[-7+o,y+1.5]],BONE),r(-6.5+o,y+1,4.5,.5,BONE_LO);}
 });}

// The bite sits on the neck and shoulder, painted after the collar so the neckline cannot cover it.
export function zombieBite(c,g,back,quarter,side,look){if(look.wounds!==1)return;const {p,r}=g;
 const [x,y]=side?[-3,-50]:back?[-7,-50]:[3.5+(quarter?1:0),-49.5];
 atop(c,()=>{p([[x,y],[x+4.5,y+.5],[x+5,y+3.5],[x+2.5,y+4.5],[x,y+3]],INK);p([[x+.5,y+.5],[x+4,y+1],[x+4.5,y+3],[x+2.5,y+4],[x+.5,y+2.5]],BLOOD);
  r(x+1,y+1,.5,.5,BLOOD_DK);r(x+2,y+1,.5,.5,BLOOD_DK);r(x+3,y+1.5,.5,.5,BLOOD_DK);r(x+1.5,y+2.5,1.5,.5,BLOOD_HI);r(x+2.5,y+4.5,.5,2,BLOOD);});}

// Torn knees and scrapes on the legs; shorts already show bare knees, so they only take the scrape.
export function zombieLegs(c,g,L,bottom,look){const decay=look.decay??1;if(!decay)return;
 atop(c,()=>{const legs=decay>1?[L.near,L.far]:[L.near];for(const leg of legs){const k=leg.x+leg.foot.knee;
  if(bottom!==4)rip(g,[[k-3,-16],[k-1,-17.5],[k+1,-16],[k+2.5,-17],[k+2,-12.5],[k-1,-12],[k-3,-13]],SKIN_LO);
  g.r(k-.5,-14.5,1.5,1,BLOOD);if(decay>1&&leg===L.near){g.r(leg.x-2,-24,3,2,BLOOD_DK);g.r(leg.x-1.5,-23.5,2,1,BLOOD);}}});}

// Arms held out in front. b is the arm's length axis on screen (shoulder to hand, per unit of arm length);
// the thickness axis stays perpendicular and full width, so a turned arm never thins out.
export function zombieReach(x,side,back,quarter,near,G){
 let [bx,by]=side?[1,0]:quarter?(back?[.7,-.45]:[.7,.38]):back?[0,-.38]:[0,.3];by+=.16;
 if(!side)bx+=(x<0?1:-1)*(quarter?.06:.1);
 const d=(near?1:-1)*(G.swing||0)*(G.running?.2:.08)-(side&&!near?.07:0),c=Math.cos(d),s=Math.sin(d);[bx,by]=[bx*c-by*s,bx*s+by*c];
 const l=Math.hypot(bx,by);return {ax:by/l,ay:-bx/l,bx,by};}
export function reachPainter(g,x,y,R){const T=([px,py])=>{const u=px-x,v=py-y;return [x+u*R.ax+v*R.bx,y+u*R.ay+v*R.by];};
 return {p:(pts,col)=>g.p(pts.map(T),col),r:(rx,ry,w,h,col)=>g.p([[rx,ry],[rx+w,ry],[rx+w,ry+h],[rx,ry+h]].map(T),col)};}
