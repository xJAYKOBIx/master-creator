// Turning between facings: the eight drawn facings, turned a little either way to fill in 64. Each row of the picture is treated
// as a slice of a cylinder as wide as that row: its outline stays where it is and everything inside slides round it, so eyes,
// nose, collar and straps move across the face and chest as the body turns. The row's outer edge (edge pixels) is kept as drawn,
// so outlines never thicken. A facing turned by 0 is the drawn art exactly.
export const TURNS=64;
// The nearest drawn facing to an angle (0 is right, going clockwise on screen) and how far to turn it, in radians.
export function nearest(a){const d=((Math.round(a/(Math.PI/4))%8)+8)%8,k=a-d*Math.PI/4;return {d,delta:Math.atan2(Math.sin(k),Math.cos(k))};}
// Where each row starts and ends, over every layer given (ImageData-shaped: data, width, height), so all of them turn as one.
export function rowsOf(layers){const {width:w,height:h}=layers[0],rows=[];
 for(let y=0;y<h;y++){let L=-1,R=-1;for(let x=0;x<w;x++){const i=(y*w+x)*4+3;if(layers.some(l=>l.data[i]>0)){if(L<0)L=x;R=x;}}rows.push([L,R]);}return rows;}
// Turns each layer by delta (positive turns toward the bottom of the screen from the right, as the aim angle does) into new pixels.
export function turnLayers(layers,delta,rows=rowsOf(layers),edge=2){const {width:w,height:h}=layers[0],out=layers.map(l=>new Uint8ClampedArray(l.data.length));
 for(let y=0;y<h;y++){const [L,R]=rows[y],c=(L+R+1)/2,r=(R+1-L)/2;
  for(let x=0;x<w;x++){let sx=x;
   if(L>=0&&x>=L+edge&&x<=R-edge){const t=Math.max(-1,Math.min(1,(x+.5-c)/r)),u=Math.max(-Math.PI/2,Math.min(Math.PI/2,Math.asin(t)+delta));sx=Math.max(L+edge,Math.min(R-edge,Math.floor(c+r*Math.sin(u))));}
   const i=(y*w+x)*4,j=(y*w+sx)*4;for(let k=0;k<layers.length;k++){const s=layers[k].data,o=out[k];o[i]=s[j];o[i+1]=s[j+1];o[i+2]=s[j+2];o[i+3]=s[j+3];}}}
 return out;}
