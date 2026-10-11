// Town props: the set pieces of the suburbs past your street, in four batches by district (civic.js: the school, the church and the
// water tower; shops.js: the shops and the gas station; park.js: the park, the creek and the ball fields; site.js: the building
// site). Same view, outline and padding as the street set; anything this set does not draw falls through to the street, house,
// workshop and camp sets, so a map built from town props can use every prop in the library.
import {painter} from '../core/paint.js';
import {EDGE,SHADOW,PROP_PAD} from './camp.js';
import {propArt as streetPropArt} from './street.js';
import {CIVIC_ART,CIVIC_SAMPLES} from './civic.js';
import {SHOP_ART,SHOP_SAMPLES} from './shops.js';
import {PARK_ART,PARK_SAMPLES} from './park.js';
import {SITE_ART,SITE_SAMPLES} from './site.js';
export {PROP_PAD};
// Two things a job has you carry across town, small enough to sit in a hand or lie in the road where you dropped them.
const PARTS={
 // A car battery: a black case, the lighter lid with its two posts (red cap on the positive) and a strap handle over the top.
 carbattery(g,o){const {r,e,l}=g,w=o.w,h=o.h,z=o.z,t=h-z;e(w/2,h,w/2+1.5,2,SHADOW);r(-.5,-z-.5,w+1,h+z+1,EDGE);
  r(0,-z,w,h,'#3a3d42');r(0,-z,w,.5,'#4c5056');r(0,t,w,z,'#232529');r(0,t,w,.5,'#45484e');r(0,h-1.5,w,1.5,'#18191c');r(1.5,t+2.5,w*.45,1.5,'#5a6a7a');
  r(1.5,-z+1.5,2.5,2,'#8a2a22');r(1.5,-z+1.5,2.5,.5,'#b04a3a');r(w-4,-z+1.5,2.5,2,'#1a1b1e');r(w-4,-z+1.5,2.5,.5,'#55585e');l(3,-z+h*.6,w-3,-z+h*.6,1,'#15161a');},
 // A five-gallon gas can: red, its handle and spout on the top face, the stamped X down the front, scuffs at the corners.
 gascan(g,o){const {r,e,l}=g,w=o.w,h=o.h,z=o.z,t=h-z;e(w/2,h,w/2+1.5,2,SHADOW);r(-.5,-z-.5,w+1,h+z+1,EDGE);
  r(0,-z,w,h,'#9a3a2e');r(0,-z,w,.5,'#b45040');r(1.5,-z+1,w-5,1.5,'#5a1e18');r(1.5,-z+1,w-5,.5,'#c8604c');r(w-3,-z-1.5,2,2.5,'#2a2b2f');r(w-3,-z-1.5,2,.5,'#55585e');
  r(0,t,w,z,'#7a2a22');r(0,t,w,.5,'#a4483a');l(1.5,t+1.5,w-1.5,h-1.5,.75,'#5a1e18');l(w-1.5,t+1.5,1.5,h-1.5,.75,'#5a1e18');r(0,h-1,w,1,'#4a1612');r(0,t+1,.5,2,'#c8a090');}};
// A storm drain in the gutter, flat in the road: a cast-iron grate in its frame with bars along it. open: the grate shoved half off
// and the black hole under it, scraped round the edge.
const BITS={stormdrain(g,o){const {r,l}=g,w=o.w,h=o.h,grate=(x,y)=>{r(x-.5,y-.5,w+1,h+1,EDGE);r(x,y,w,h,'#2a2b2e');r(x,y,w,.5,'#4a4c51');r(x+1,y+1,w-2,h-2,'#0b0c0e');for(let k=x+2;k<x+w-2;k+=3){r(k,y+1.5,1.5,h-3,'#3c3e43');r(k,y+1.5,1.5,.5,'#5d6066');}};
 r(-1.5,-1,w+3,h+2.5,SHADOW);if(!o.open){grate(0,0);return;}
 r(-.5,-.5,w+1,h+1,EDGE);r(0,0,w,h,'#2a2b2e');r(1,1,w-2,h-2,'#030304');r(1,1,w-2,1.5,'#141519');for(const [x,y,c] of [[2,h-.5,-3],[w*.4,h,-2],[w-3,h-.5,2]])l(x,y,x+c,y+3,.6,'#6a6c70');
 grate(w*.5,3.5);}};
export const TOWN_ART={...CIVIC_ART,...SHOP_ART,...PARK_ART,...SITE_ART,...PARTS,...BITS};
// The library's samples, district by district, then the parts and the storm drain.
export const TOWN_SAMPLES=[...CIVIC_SAMPLES,...SHOP_SAMPLES,...PARK_SAMPLES,...SITE_SAMPLES,
 {set:'town',kind:'carbattery',name:'Car battery',group:'Job parts',samples:[{kind:'carbattery',x:40,y:40,w:14,h:8,z:10}]},
 {set:'town',kind:'gascan',name:'Gas can',group:'Job parts',samples:[{kind:'gascan',x:40,y:40,w:12,h:6,z:16}]},
 {set:'town',kind:'stormdrain',name:'Storm drain',group:'Street',samples:[{kind:'stormdrain',x:40,y:40,w:26,h:12,z:2},{kind:'stormdrain',x:40,y:40,w:26,h:12,z:2,open:true}]}];
export function propArt(c,o){if(!TOWN_ART[o.kind])return streetPropArt(c,o);c.save();c.scale(2,2);c.translate(PROP_PAD,o.z+PROP_PAD);TOWN_ART[o.kind](painter(c),o);c.restore();}
