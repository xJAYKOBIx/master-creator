// Floors and ground, painted into a rectangle of world units: wood boards, kitchen and bathroom tile, carpet, lawn, concrete, asphalt,
// dirt, gravel, long field grass and still water.
// floorArt(g, {kind, x, y, w, h}) paints with a painter g already in world units; the pattern is tied to world position, so two
// rectangles of the same floor side by side line up. Lighting and shadows come later, from the game.
import {hash2 as hash} from '../core/paint.js';
export const FLOORS={
 wood:{name:'Wood boards',ramp:['#3d2a1e','#5a3e2a','#6a4a32','#7a573a','#8a6444']},
 tile:{name:'Kitchen tile',ramp:['#4a4a46','#8a867a','#a8a394','#6a6a64']},
 bathtile:{name:'Bathroom tile',ramp:['#5a6a6a','#9aaaa8','#b4c2c0','#7a8a88']},
 carpet:{name:'Carpet',ramp:['#2e3442','#3a4252','#465062','#525e72']},
 lawn:{name:'Lawn',ramp:['#141f16','#1c2b1e','#243826','#2e4730','#3b5a3a']},
 concrete:{name:'Concrete',ramp:['#2e3034','#3b3e43','#474a50','#55585e']},
 asphalt:{name:'Asphalt',ramp:['#141518','#1c1d21','#24262a','#2e3034']},
 dirt:{name:'Dirt',ramp:['#18140f','#221c15','#2c241b','#372d22']},
 gravel:{name:'Gravel',ramp:['#222326','#2e2f32','#3b3c40','#4a4b50']},
 field:{name:'Field',ramp:['#141710','#1b1f14','#23281a','#2d3320','#3a4128']},
 water:{name:'Water',ramp:['#0b1216','#101a1f','#16242a','#22343b','#3a5058']}};
export const FLOOR_KINDS=Object.keys(FLOORS);
export function floorArt(g,f){const {r}=g,{x,y,w,h}=f,k=f.kind,P=(FLOORS[k]||FLOORS.wood).ramp,x1=x+w,y1=y+h;
 if(k==='wood'){// Boards run east to west, 6 units wide, with staggered joints and a little grain.
  const BH=6;for(let by=Math.floor(y/BH)*BH;by<y1;by+=BH){const row=by/BH|0;let bx=x-((hash(row,7)*60)|0);
   while(bx<x1){const len=48+((hash(row,bx|0)*60)|0),col=P[1+((hash(bx|0,row)*3)|0)],a=Math.max(x,bx),b=Math.min(x1,bx+len),t=Math.max(y,by),u=Math.min(y1,by+BH);
    if(b>a&&u>t){r(a,t,b-a,u-t,col);if(by+BH<=y1&&by+BH-.5>=y)r(a,by+BH-.5,b-a,.5,P[0]);if(bx>=x&&bx<x1)r(bx,t,.5,u-t,P[0]);
     for(let i=0;i<len/14;i++){const gx=bx+3+hash(i,(bx|0)+row)*(len-8);if(gx>a&&gx<b-4&&by+2>=y&&by+2<y1)r(gx,by+1.5+hash(row,i)*3,3+hash(i,row)*5,.5,P[(col===P[3]?2:3)]);}}
    bx+=len;}}}
 else if(k==='tile'||k==='bathtile'){const T=k==='tile'?12:7;for(let ty=Math.floor(y/T)*T;ty<y1;ty+=T)for(let tx=Math.floor(x/T)*T;tx<x1;tx+=T){const a=Math.max(x,tx),b=Math.min(x1,tx+T),t=Math.max(y,ty),u=Math.min(y1,ty+T);if(b<=a||u<=t)continue;
   const odd=((tx/T|0)+(ty/T|0))%2,col=k==='tile'?(odd?P[1]:P[3]):(hash(tx|0,ty|0)>.85?P[2]:P[1]);r(a,t,b-a,u-t,col);if(tx>=x)r(tx,t,.5,u-t,P[0]);if(ty>=y)r(a,ty,b-a,.5,P[0]);if(hash(ty|0,tx|0)>.6&&tx+2>=x&&ty+2>=y&&tx+3<x1&&ty+3<y1)r(tx+1.5,ty+1.5,1,.5,'#ffffff22');}}
 else if(k==='carpet'){r(x,y,w,h,P[1]);for(let i=0;i<w*h/6;i++){const px=x+hash(i,(x|0)+3)*w,py=y+hash((y|0)+5,i)*h;r(px,py,.5,.5,P[(i%3===0)?0:(i%3===1?2:3)]);}}
 else if(k==='lawn'){r(x,y,w,h,P[1]);for(let i=0;i<w*h/10;i++){const px=x+hash(i,(x|0)+11)*w,py=y+hash((y|0)+13,i)*h,c=P[(hash(i,3)*5)|0];r(px,py,.5,1,c);if(i%4===0)r(px+.5,py-.5,.5,1,P[4]);}}
 // Asphalt: dark and fine-grained, with a few hairline cracks. Grain is tied to world position so strips line up.
 else if(k==='asphalt'){r(x,y,w,h,P[1]);for(let gy=Math.floor(y);gy<y1;gy+=2)for(let gx=Math.floor(x);gx<x1;gx+=2){const v=hash(gx,gy);if(v>.82)r(gx+(v*7%1)*1.5,gy+(v*13%1)*1.5,.5,.5,v>.95?P[3]:P[2]);else if(v<.08)r(gx,gy,.5,.5,P[0]);}
  for(let cy=Math.floor(y/60)*60;cy<y1;cy+=60)for(let cx=Math.floor(x/90)*90;cx<x1;cx+=90){if(hash(cx,cy)<.55)continue;let px=cx+hash(cy,cx)*80,py=cy+hash(cx+1,cy)*50;for(let i=0;i<9;i++){px+=1+hash(i,cx)*1.5;py+=hash(cy,i)*2-1;if(px>=x&&px<x1-.5&&py>=y&&py<y1-.5)r(px,py,1,.5,P[0]);}}}
 // Dirt: bare earth with clods and the odd pebble. Gravel: packed stones, a few lighter. Field: long dry grass in tufts.
 // All three tie their pattern to world position, so pieces painted separately line up.
 else if(k==='dirt'||k==='gravel'){const S=k==='gravel'?1.5:3;r(x,y,w,h,P[1]);for(let gy=Math.floor(y/S)*S;gy<y1;gy+=S)for(let gx=Math.floor(x/S)*S;gx<x1;gx+=S){if(gx<x||gy<y)continue;const v=hash(gx*2|0,gy*2|0);
   if(k==='gravel'){if(v>.45)r(gx,gy,1,.5,v>.9?P[3]:P[2]);else if(v<.12)r(gx,gy+.5,.5,.5,P[0]);}else{if(v>.86)r(gx,gy,v>.97?1:.5,.5,v>.95?P[3]:P[2]);else if(v<.1)r(gx,gy,1,.5,P[0]);}}}
 else if(k==='field'){r(x,y,w,h,P[1]);for(let gy=Math.floor(y/3)*3;gy<y1;gy+=3)for(let gx=Math.floor(x/3)*3;gx<x1;gx+=3){if(gx<x||gy<y)continue;const v=hash(gx|0,(gy|0)+71);if(v<.45)continue;
   const t=1+((v*17)%1)*2.5,c=P[2+((v*31%1)*3|0)];r(gx,Math.max(y,gy-t),.5,Math.min(t,gy-y)+.5,c);if(v>.9)r(gx+.5,Math.max(y,gy-t+1),.5,Math.min(t-1,gy-y)+.5,P[4]);else if(v<.5)r(gx+1,gy,.5,.5,P[0]);}}
 // Water: dark and still, with ripples drawn as short pale streaks across the flow, tied to world position so a creek painted
 // in pieces lines up.
 else if(k==='water'){r(x,y,w,h,P[1]);for(let gy=Math.floor(y/5)*5;gy<y1;gy+=5)for(let gx=Math.floor(x/23)*23;gx<x1;gx+=23){if(gy<y)continue;const v=hash(gx|0,(gy|0)+307);if(v<.55)continue;
   const len=3+v*9,a=Math.max(x,gx+((v*13)%1)*12),b=Math.min(x1,a+len);if(b>a)r(a,gy,b-a,.5,v>.92?P[4]:v>.75?P[3]:P[2]);}}
 else{r(x,y,w,h,P[1]);for(let sx=Math.floor(x/40)*40;sx<x1;sx+=40)if(sx>=x)r(sx,y,.5,h,P[0]);for(let sy=Math.floor(y/40)*40;sy<y1;sy+=40)if(sy>=y)r(x,sy,w,.5,P[0]);for(let i=0;i<w*h/30;i++)r(x+hash(i,17)*w,y+hash(19,i)*h,.5,.5,i%2?P[2]:P[0]);}}
