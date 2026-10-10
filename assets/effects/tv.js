// What a modern set does on its own: the maker's logo when it wakes, the channel number after a flip, digital breakup when a signal
// fails (the picture freezes and cracks into blocks, never static), and the NO SIGNAL box drifting round a black screen.
import {R,hash,clamp,ease} from '../core/kit.js';
import {text,width} from '../ui/font5x7.js';
export function logo(c,w,h,k,s='VESPERA'){R(c,0,0,w,h,'#000');if(k<=0)return;c.globalAlpha=Math.min(1,k);const x=Math.round((w-width(s))/2),y=Math.round(h/2-4);
 text(c,s,x,y,'#d8dce6');R(c,x,y+10,width(s),1,'#3a6aff');c.globalAlpha=1;}
// The channel number in the top-right corner, under the station's LIVE bug, as the set draws it after a flip.
export function osd(c,ch,name,k,w){if(k<=0)return;c.globalAlpha=Math.min(1,k);const label=`CH ${ch}`,x=w-6-width(label)-6;R(c,x,16,width(label)+6,11,'#000000b0');text(c,label,x+3,18,'#7fe07f');
 if(name){const nx=w-6-width(name)-6;R(c,nx,28,width(name)+6,10,'#000000b0');text(c,name,nx+3,29,'#e8e8e8');}c.globalAlpha=1;}
// Blocks of the frame shifted, smeared and miscoloured. k is how broken it is (0 to 1); fr picks which blocks.
export function breakup(c,src,k,fr,w,h){c.drawImage(src,0,0);if(k<=0)return;const B=8;
 for(let by=0;by<h;by+=B)for(let bx=0;bx<w;bx+=B){const n=hash(bx*73+by*151+Math.floor(fr/2)*977);if(n>k)continue;const m=hash(n*1e6|0);
  if(m<.45){const dx=Math.round((hash(by+fr)-.5)*6)*B,dy=m<.2?-B:0;c.drawImage(src,clamp(bx-dx,0,w-B),clamp(by+dy,0,h-B),B,B,bx,by,B,B);}
  else if(m<.75){c.drawImage(src,bx,by,1,1,bx,by,B,B);c.globalAlpha=.35;R(c,bx,by,B,B,m<.6?'#00ff60':'#ff00c0');c.globalAlpha=1;}
  else{c.drawImage(src,bx,by,B,1,bx,by,B*(1+(m*3|0)),B);}}}
// A flip between channels: a few frames where blocks of the old picture and the new one mix, darkened.
export function flip(c,from,to,k,fr,w,h){const B=8;c.drawImage(k<.5?from:to,0,0);for(let by=0;by<h;by+=B)for(let bx=0;bx<w;bx+=B){const n=hash(bx*31+by*17+fr*101);
  const src=n<k?to:from;if(n<.35)c.drawImage(src,bx,by,1,1,bx,by,B,B);else c.drawImage(src,bx,by,B,B,bx,by,B,B);}
 c.globalAlpha=.55*Math.sin(k*Math.PI);R(c,0,0,w,h,'#000');c.globalAlpha=1;}
// NO SIGNAL: the set's own grey box, drifting and bouncing off the edges.
export function noSignal(c,w,h,t){R(c,0,0,w,h,'#000');const bw=104,bh=30,sx=w-bw,sy=h-bh,px=t*14,py=t*9;
 const x=Math.round(Math.abs((px%(2*sx))-sx)),y=Math.round(Math.abs(((py+sy*.4)%(2*sy))-sy));
 R(c,x,y,bw,bh,'#2a2c32');R(c,x,y,bw,1,'#4a4d56');R(c,x,y+bh-1,bw,1,'#15161a');text(c,'NO SIGNAL',x+Math.round((bw-width('NO SIGNAL'))/2),y+6,'#e8e8ec');
 const s='CHECK YOUR CABLE';c.globalAlpha=.6;text(c,s,x+Math.round((bw-width(s))/2),y+18,'#a8acb6');c.globalAlpha=1;}
