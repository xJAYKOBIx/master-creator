// What the control rooms lay over their pictures: closed captions, lower thirds, tickers and corner bugs, on the 240 × 135 picture.
import {R,clamp,ease} from '../core/kit.js';
import {text,width} from '../ui/font5x7.js';
// Captions roll up two lines at a time in black boxes, the way broadcast captions do. top: rows from the top of the picture.
export function captions(c,list,lt,top=5){const shown=list.filter(([s])=>lt>=s).slice(-2);shown.forEach(([,line],i)=>{const y=top+i*9+(shown.length===1?9:0);R(c,5,y-1,width(line)+2,9,'#000');text(c,line,6,y,'#ffffff');});}
// A lower third: a coloured tag above a white bar with the headline.
export function lowerThird(c,{tag,headline,tagColor='#c8102e',ink='#0d1a3a',y=95,wipe=1}){const w=228*ease(clamp(wipe));if(w<=0)return;c.save();c.beginPath();c.rect(6,y,w,24);c.clip();
 if(tag){R(c,6,y,width(tag)+6,9,tagColor);text(c,tag,9,y+1,'#ffffff');}R(c,6,y+9,228,12,'#f2f2f2');text(c,headline,12,y+11,ink);R(c,6,y+21,228,2,tagColor);c.restore();}
// A ticker along the bottom with a station box on the left and an optional clock on the right.
export function ticker(c,line,lt,{station='6 NEWS',color='#c8102e',clock=null,speed=40,ink='#f2e6b0'}={}){R(c,0,123,240,12,'#05070d');R(c,0,123,240,1,color);const left=width(station)+8,right=clock?206:240;
 c.save();c.beginPath();c.rect(left,123,right-left,12);c.clip();const span=width(line)+6,off=(lt*speed)%span;text(c,line+line,left+4-off,126,ink);c.restore();
 R(c,0,123,left,12,color);text(c,station,4,126,'#ffffff');if(clock){R(c,206,123,34,12,'#f2c200');text(c,clock,208,126,'#05070d');}}
export function bug(c,label,x,y,bg='#c8102e',ink='#ffffff'){R(c,x,y,width(label)+6,9,bg);text(c,label,x+3,y+1,ink);}
