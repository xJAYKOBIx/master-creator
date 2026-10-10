// Small tools the intro's painters share.
export const R=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w,h);};
export function rng(seed){let a=seed>>>0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
export const hash=n=>{n=Math.imul(n^n>>>15,2246822507);n=Math.imul(n^n>>>13,3266489909);return((n^n>>>16)>>>0)/4294967296;};
export const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),ease=k=>k*k*(3-2*k),lerp=(a,b,k)=>a+(b-a)*k;
// Rows of palette letters, one pixel each; '.' or an unknown letter is left clear.
export function sprite(c,rows,pal,x,y,flip=false){const w=Math.max(...rows.map(r=>r.length));rows.forEach((row,j)=>{for(let i=0;i<row.length;i++){const col=pal[row[i]];if(col)R(c,x+(flip?w-1-i:i),y+j,1,1,col);}});}
export function canvas(w,h){return typeof OffscreenCanvas!=='undefined'?new OffscreenCanvas(w,h):Object.assign(document.createElement('canvas'),{width:w,height:h});}
