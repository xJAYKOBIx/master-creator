// Materials and dyes for the character creator.
// Every part is drawn once in its original colors; a look swaps whole color ramps by exact hex match,
// so outlines, shading steps and pixel placement stay identical for every combination.
const hexToHsl=hex=>{const n=parseInt(hex.slice(1,7),16),r=(n>>16&255)/255,g=(n>>8&255)/255,b=(n&255)/255,max=Math.max(r,g,b),min=Math.min(r,g,b),l=(max+min)/2,d=max-min;
 if(!d)return [0,0,l];const s=d/(1-Math.abs(2*l-1)),h=max===r?((g-b)/d+6)%6:max===g?(b-r)/d+2:(r-g)/d+4;return [h*60,s,l];};
const hslToHex=(h,s,l)=>{const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,9-k(n),1));return '#'+[f(0),f(8),f(4)].map(v=>Math.round(v*255).toString(16).padStart(2,'0')).join('');};
const clamp=v=>Math.max(0,Math.min(1,v));
// Shift a whole ramp so its base color becomes the target, keeping each step's hue, saturation and lightness offsets.
export function dyeRamp(ramp,base,target){if(target===base)return new Map();const [bh,bs,bl]=hexToHsl(base),[th,ts,tl]=hexToHsl(target),out=new Map();
 for(const c of ramp){const [h,s,l]=hexToHsl(c);out.set(c,hslToHex((th+h-bh+360)%360,clamp(bs?s*ts/bs:ts),clamp(l+tl-bl)));}return out;}

// Original Survivor 01 ramps. Literal shades used by individual parts are listed with their material.
export const MATERIAL={
 skin:['#d99b73','#ecb18a','#ae7356','#85513d'],
 coat:['#29465a','#3d5c72','#47677c','#304f64','#1b3040','#172731'],
 shirt:['#b8a082','#d3b897','#8d755e'],
 pants:['#213344','#30495c','#162531','#263e50','#40586a','#1b2d3b','#13212c'],
 boots:['#5b4030','#806044','#3c2c25'],
 pack:['#5b4030','#806044','#947353','#3c2c25','#694a36','#826047','#352a26']
};
// Skin tones are hand-authored ramps rather than dyes: light, midtone, shadow, deep crease.
export const SKIN_TONES=[
 {name:'Warm',ramp:MATERIAL.skin},
 {name:'Fair',ramp:['#eec3a3','#f8d6bc','#c99a7c','#9d6f58']},
 {name:'Olive',ramp:['#c99a6e','#dcb186','#a07552','#75533b']},
 {name:'Tan',ramp:['#b0784f','#c58e64','#875739','#5f3c28']},
 {name:'Brown',ramp:['#8b5b3c','#a26f4c','#67412a','#482d1e']},
 {name:'Deep',ramp:['#64402c','#7a5039','#4a2d1f','#331f15']}
];
// Each dye is the new base color for that material; [name, hex].
export const DYES={
 coat:[['Field blue','#29465a'],['Olive drab','#45502f'],['Charcoal','#34373d'],['Rust brown','#6a3e2a'],['Forest green','#2c4a36'],['Burgundy','#58293a'],['Canvas tan','#75664a'],['Black','#232328']],
 shirt:[['Tan','#b8a082'],['Off-white','#cdc7bb'],['Gray','#8d8e94'],['Brick red','#94433a'],['Black','#3b3b40'],['Sage','#808162'],['Police navy','#2b3a52'],['Sky blue','#8ea5bf']],
 pants:[['Navy','#213344'],['Black','#252529'],['Khaki','#76684d'],['Olive','#444a30'],['Gray','#4c5057'],['Brown','#4a3628'],['Denim','#34506e'],['Faded denim','#5f7d9b']],
 boots:[['Brown','#5b4030'],['Black','#2c2b2e'],['Tan','#8a6a45'],['Oxblood','#5a2b27'],['White','#cfcbc2'],['Red','#8b3a33'],['Gray','#6b6e74']],
 pack:[['Brown','#5b4030'],['Olive','#4e5434'],['Black','#2e2e32'],['Tan','#85704e'],['Navy','#2f4357']]
};
// The T-shirt reuses the jacket silhouette, so its body takes the shirt dye through the coat ramp.
// Tops dyed with the shirt color: T-shirt, long sleeve, business shirt, shirt and tie, tank top, police shirt. The jacket, hoodie and the fatigue and SWAT uniforms take the jacket color.
export const SHIRT_TOPS=new Set([1,2,4,5,6,9]);
const SHIRT_AS_COAT=['#b8a082','#ccb596','#d6c1a3','#c0a888','#8f775f','#7a6450'];

// Zombie skin keeps the survivor's own lightness steps, so a deep-skinned survivor stays deep after turning.
// Each rot tone sets the hue and caps the saturation; more decay drains and darkens the ramp.
export const ROT_TONES=[{name:'Pallid',hue:52,sat:.13},{name:'Sickly green',hue:78,sat:.24},{name:'Bruised',hue:292,sat:.12},{name:'Corpse blue',hue:208,sat:.16}];
export function rotRamp(ramp,rot=0,decay=1){const R=ROT_TONES[rot]||ROT_TONES[0];return ramp.map((c,i)=>{const [,s,l]=hexToHsl(c);
 return hslToHex(R.hue+(i>=2?-8:0),Math.min(s,R.sat)*(1-decay*.18),clamp(l*(.97-decay*.05)-(i===3?.04:0)));});}

const cache=new Map();
// One map for skin/clothing (applied to the whole body) plus separate maps for boots and pack,
// because both of those start from the same leather ramp.
export function colorMaps(look={}){const key=[look.skin,look.top,look.coat,look.shirt,look.pants,look.boots,look.packColor,look.zombie?`z${look.rot}${look.decay}`:''].join('-');if(cache.has(key))return cache.get(key);
 const main=new Map(),add=m=>{for(const [a,b] of m)main.set(a,b);},tone=SKIN_TONES[look.skin]?.ramp||MATERIAL.skin,skin=look.zombie?rotRamp(tone,look.rot,look.decay):tone,shirtHex=(DYES.shirt[look.shirt]||DYES.shirt[0])[1];
 MATERIAL.skin.forEach((c,i)=>{if(skin[i]!==c)main.set(c,skin[i]);});
 if(SHIRT_TOPS.has(look.top)){const coatAsShirt=dyeRamp(SHIRT_AS_COAT,MATERIAL.shirt[0],shirtHex);MATERIAL.coat.forEach((c,i)=>main.set(c,coatAsShirt.get(SHIRT_AS_COAT[i])||SHIRT_AS_COAT[i]));}
 else add(dyeRamp(MATERIAL.coat,MATERIAL.coat[0],(DYES.coat[look.coat]||DYES.coat[0])[1]));
 add(dyeRamp(MATERIAL.shirt,MATERIAL.shirt[0],shirtHex));
 add(dyeRamp(MATERIAL.pants,MATERIAL.pants[0],(DYES.pants[look.pants]||DYES.pants[0])[1]));
 const out={main,boots:dyeRamp(MATERIAL.boots,MATERIAL.boots[0],(DYES.boots[look.boots]||DYES.boots[0])[1]),pack:dyeRamp(MATERIAL.pack,MATERIAL.pack[0],(DYES.pack[look.packColor]||DYES.pack[0])[1])};
 if(cache.size>64)cache.clear();cache.set(key,out);return out;}
// Wrap a painter so every color passes through a ramp map.
export function tint(g,map){if(!map||!map.size)return g;return {p:(pts,col)=>g.p(pts,map.get(col)||col),r:(x,y,w,h,col)=>g.r(x,y,w,h,map.get(col)||col)};}
