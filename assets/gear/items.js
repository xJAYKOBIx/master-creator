// Supplies that go in a backpack: ammo, the field kit and crafting materials. Each has its shape in the bag grid (columns × rows),
// how many stack in one place, and its weight in kg per piece. Guns are items too when they ride in the bag as spares.
import {GUNS} from '../weapons/equipment.js';
export const ITEMS={
 shells:{name:'Shotgun shells',kind:'ammo',shape:[1,1],stack:24,kg:.04,ammo:'shells',description:'12-gauge buckshot for the Pump Shotgun'},
 rounds:{name:'Rifle rounds',kind:'ammo',shape:[1,1],stack:60,kg:.012,ammo:'rounds',description:'Rifle cartridges for the Tactical AR and the Heavy AR'},
 'gun-oil':{name:'Gun oil',kind:'kit',shape:[1,1],stack:3,kg:.15,description:'A small bottle with a nozzle. Wipes off about half a gun\'s fouling'},
 scrap:{name:'Scrap metal',kind:'material',shape:[1,1],stack:10,kg:.5,description:'Bolts, brackets and bent plate. Found almost anywhere'},
 cloth:{name:'Cloth and leather',kind:'material',shape:[1,1],stack:10,kg:.2,description:'Rags, old clothes and offcuts of leather'},
 powder:{name:'Powder',kind:'material',shape:[1,1],stack:10,kg:.2,description:'A tin of smokeless powder, for loading shells and rounds'},
 electronics:{name:'Electronics',kind:'material',shape:[1,1],stack:5,kg:.3,description:'Circuit boards and wire pulled out of anything with a plug'},
 solvent:{name:'Oil and solvent',kind:'material',shape:[1,1],stack:5,kg:.4,description:'A can of cleaning solvent and oil, for a full clean at camp'}};
export const ITEM_IDS=Object.keys(ITEMS);
// A spare gun in the bag is the item 'gun:<id>'. Pistols are 2 × 1, shotguns 6 × 1 and rifles 6 × 2.
export const GUN_KG={'light-pistol':.8,'heavy-pistol':1.1,'hand-cannon':1.6,'tactical-ar':3.4,'heavy-ar':4.1,'pump-shotgun':3.6};
const gunId=id=>id?.startsWith('gun:')?id.slice(4):null;
export function itemInfo(id){const g=gunId(id);if(g&&GUNS[g])return {name:GUNS[g].name,kind:'gun',gun:g,shape:!GUNS[g].rifle?[2,1]:GUNS[g].shells?[6,1]:[6,2],stack:1,kg:GUN_KG[g]||1,description:GUNS[g].description};
 return ITEMS[id]||null;}

// Icons for one bag cell, drawn in world units centred on (0, 0) inside about 12 × 12. They are props in the hand, so they take
// the softer prop edge. Guns use gunArt instead.
const INK='#191b21',BRASS=['#c9a04a','#e8c56a','#8a6a2c'];
const ART={
 // Three red shells standing, brass heads down; the middle one sits a little higher.
 shells(g){const {r}=g;for(const [x,y] of [[-3.5,0],[0,-1],[3.5,0]]){r(x-1.75,y-4.5,3.5,9,INK);r(x-1.25,y-4,2.5,5.5,'#a8342c');r(x-1.25,y-4,.5,5.5,'#cf5446');r(x-1.25,y-4,2.5,.5,'#7d2620');
  r(x-1.25,y+1.5,2.5,2.5,BRASS[0]);r(x-1.25,y+1.5,2.5,.5,BRASS[1]);r(x-1.25,y+3.5,2.5,.5,BRASS[2]);}},
 // Three cartridges: copper tips, bottleneck brass cases.
 rounds(g){const {r}=g;for(const [x,y] of [[-3.5,.5],[0,-.5],[3.5,.5]]){r(x-1.25,y-5.5,2.5,11,INK);r(x-.25,y-5.5,.5,.5,INK);r(x-.75,y-5,1.5,2.5,'#b8673a');r(x-.75,y-5,.5,2,'#d98a55');
  r(x-.75,y-2.5,1.5,1,BRASS[0]);r(x-.75,y-1.5,1.5,6,BRASS[0]);r(x-.75,y-1.5,.5,6,BRASS[1]);r(x-.75,y+4,1.5,.5,BRASS[2]);}},
 // An amber plastic bottle with a cream label and a red nozzle cap.
 'gun-oil'(g){const {r,p}=g;p([[-3.5,-1.5],[-2,-3],[2,-3],[3.5,-1.5],[3.5,5.5],[-3.5,5.5]],INK);p([[-3,-1.25],[-1.75,-2.5],[1.75,-2.5],[3,-1.25],[3,5],[-3,5]],'#a8721f');
  r(-3,-1,1,6,'#c8902e');r(2,-1,1,6,'#7d5216');r(-3,.5,6,3,'#e3d8bf');r(-2,1.25,4,.5,'#8a7a5c');r(-2,2.25,3,.5,'#8a7a5c');
  r(-1.5,-5,3,2.5,INK);r(-1,-4.5,2,2,'#9a2f2a');r(-.5,-6.5,1,2,INK);r(-.25,-6.25,.5,1.5,'#c9483c');},
 // A bent plate, a bolt and a washer, with rust on the plate.
 scrap(g){const {r,p,e}=g;p([[-5.5,-1],[1,-3.5],[3,1],[-3.5,3.5]],INK);p([[-4.75,-.75],[.75,-2.75],[2.25,.75],[-3.25,2.75]],'#7d8088');p([[-4.75,-.75],[.75,-2.75],[1.25,-1.75],[-4.25,.25]],'#a3a7ad');r(-2,0,2,1.5,'#8a4f2a');r(-1,1,1,.5,'#a8623a');
  r(2.5,-6,2.5,7,INK);r(3,-5.5,1.5,6,'#5a5d63');r(3,-5.5,.5,6,'#8b8f96');r(1.5,-6.5,4.5,1.5,INK);r(2,-6,3.5,.5,'#a3a7ad');
  e(2,4.5,3,2,INK);e(2,4.5,2.25,1.4,'#8b8f96');e(2,4.5,1,.6,INK);},
 // Two folded pieces: blue cloth over tan leather.
 cloth(g){const {r}=g;r(-5.5,0,11,5.5,INK);r(-5,.5,10,4.5,'#8a6440');r(-5,.5,10,1,'#a87e52');r(-5,3.5,10,.5,'#6b4c30');r(3,1.5,.5,3,'#6b4c30');
  r(-5,-5,10,5.5,INK);r(-4.5,-4.5,9,4.5,'#3e5a78');r(-4.5,-4.5,9,1,'#56769a');r(-4.5,-1.5,9,.5,'#2d4259');r(-2.5,-4,.5,3.5,'#2d4259');r(2,-3.5,1.5,.5,'#a9b8c9');},
 // A dark tin with a lid and an orange band.
 powder(g){const {r}=g;r(-4,-4.5,8,10,INK);r(-3.5,-2.5,7,7.5,'#3d4148');r(-3.5,-2.5,1,7.5,'#5a5f68');r(2.5,-2.5,1,7.5,'#2a2d32');r(-4.5,-5,9,3,INK);r(-4,-4.5,8,2,'#5a5f68');r(-4,-4.5,8,.5,'#7d828b');
  r(-3.5,0,7,2.5,'#d0702e');r(-3.5,0,7,.5,'#e8904a');r(-2,.75,4,1,'#3d2312');},
 // A green circuit board with two chips, gold pins and a loose red wire.
 electronics(g){const {r,l}=g;r(-5.5,-4,11,8,INK);r(-5,-3.5,10,7,'#2f6b45');r(-5,-3.5,10,.5,'#4a8a5f');for(const x of [-4,-1.5,1,3.5])r(x,2.5,.5,.5,'#d9b54a');
  r(-3.5,-2.5,3,3,INK);r(-3,-2,2,2,'#26272b');r(1,-2.5,3,2,INK);r(1.5,-2,2,1,'#26272b');r(-.5,-1,1,.5,'#d9b54a');r(-5,1,3,.5,'#9fd0a8');l(4.5,1,6,5.5,1,INK);l(4.5,1,5.75,5,.5,'#c9483c');},
 // A metal can with a spout, teal-grey with a pale label.
 solvent(g){const {r,p}=g;p([[-4,-4],[2,-4],[4,-2],[4,5.5],[-4,5.5]],INK);p([[-3.5,-3.5],[1.75,-3.5],[3.5,-1.75],[3.5,5],[-3.5,5]],'#4f7d86');r(-3.5,-3.5,1,8.5,'#6f9ea6');r(2.5,-1.5,1,6.5,'#3a5e66');
  r(-3.5,-.5,7,3.5,'#e3dcc6');r(-2.5,.5,5,.5,'#4f7d86');r(-2.5,1.5,3,.5,'#4f7d86');r(1.5,-6,1.5,2.5,INK);r(1.75,-5.75,1,2,'#a3a7ad');}};
export function itemArt(g,id){ART[id]?.(g);}
// How much a stack weighs.
export const weightOf=(id,n=1)=>(itemInfo(id)?.kg||0)*n;
