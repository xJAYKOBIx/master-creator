// Drawing primitives every painter shares. Art is drawn in world units with edges snapped to a half-unit grid, on 2x canvases,
// so one world unit is two screen pixels and half units are single pixels.
export const snap=v=>Math.round(v*2)/2;
// Smooth mode: the same shapes drawn as anti-aliased paths off the grid, for a game that scales its pictures smoothly
// (Deadlight Hollow from v0.57). Off by default, so every asset paints exactly as before; a game turns it on once, before it paints.
// Contexts without paths (the outline and mask recorders) keep the grid either way.
export const STYLE={smooth:false};
export const smoothOn=c=>STYLE.smooth&&typeof c.beginPath==='function';
export function smoothPainter(c){
 const r=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h);};
 const p=(pts,col)=>{c.fillStyle=col;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();};
 const e=(cx,cy,rx,ry,col)=>{if(rx<=0||ry<=0)return;c.fillStyle=col;c.beginPath();c.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);c.fill();};
 const l=(x1,y1,x2,y2,w,col)=>{const dx=x2-x1,dy=y2-y1,d=Math.hypot(dx,dy)||1,nx=-dy/d*w/2,ny=dx/d*w/2;p([[x1+nx,y1+ny],[x2+nx,y2+ny],[x2-nx,y2-ny],[x1-nx,y1-ny]],col);};
 return {r,p,e,l};
}
export function painter(c){
 if(smoothOn(c))return smoothPainter(c);
 const r=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(snap(x),snap(y),snap(w),snap(h));};
 const p=(pts,col)=>{let top=Math.floor(Math.min(...pts.map(v=>v[1]))*2)/2,bottom=Math.ceil(Math.max(...pts.map(v=>v[1]))*2)/2;c.fillStyle=col;for(let y=top;y<bottom;y+=.5){let hits=[];for(let i=0;i<pts.length;i++){let a=pts[i],b=pts[(i+1)%pts.length],scan=y+.25;if((a[1]<=scan&&b[1]>scan)||(b[1]<=scan&&a[1]>scan))hits.push(a[0]+(scan-a[1])*(b[0]-a[0])/(b[1]-a[1]));}hits.sort((a,b)=>a-b);for(let i=0;i+1<hits.length;i+=2){let x=snap(hits[i]),end=snap(hits[i+1]);if(end>x)c.fillRect(x,y,end-x,.5);}}};
 const e=(cx,cy,rx,ry,col)=>{const pts=[];for(let i=0;i<28;i++){const a=i/28*Math.PI*2;pts.push([cx+Math.cos(a)*rx,cy+Math.sin(a)*ry]);}p(pts,col);};
 // A line of the given width, for ropes, sticks and handles.
 const l=(x1,y1,x2,y2,w,col)=>{const dx=x2-x1,dy=y2-y1,d=Math.hypot(dx,dy)||1,nx=-dy/d*w/2,ny=dx/d*w/2;p([[x1+nx,y1+ny],[x2+nx,y2+ny],[x2-nx,y2-ny],[x1-nx,y1-ny]],col);};
 return {r,p,e,l};
}
// Deterministic noise, so art paints the same every time.
export const hash2=(x,y)=>{let h=Math.imul(x|0,374761393)+Math.imul(y|0,668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967296;};
export const smooth=(x,y)=>{const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy),a=hash2(ix,iy),b=hash2(ix+1,iy),c=hash2(ix,iy+1),d=hash2(ix+1,iy+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;};
export const fbm=(x,y)=>smooth(x,y)*.65+smooth(x*2.3+7,y*2.3+3)*.35;
export const BAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v=>(v+.5)/16);
export const bayer=(x,y)=>BAYER[(y&3)*4+(x&3)];
export const rgb=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
// A painter without the grid: plain rectangles and polygons, for art drawn large and scaled down (gun and grenade icons).
export const vectorPainter=c=>({r:(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h);},p:(pts,col)=>{c.fillStyle=col;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}});
