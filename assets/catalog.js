// The catalogue: every asset in the Master Creator, with what the library needs to preview it and what a game needs to use it.
// Each entry is plain data plus a draw (or play) function that calls the asset's own code, so the library never redraws anything itself.
//
// Entry shape:
//   id, name, category, group      where it sits in the library
//   summary                        one line about what it is
//   source, usage                  the file it lives in and how a game calls it
//   kind                           'sprite' (facings and animations), 'still', 'motion' (plays over time) or 'sound'
//   w, h, scale                    the size of one picture in canvas pixels, and the preview's starting zoom
//   facings, anims                 for sprites: how many facings, and {Name: {frames, ms}} per animation
//   options, presets, defaults     choices a person can change: {key, label, choices, swatches?} or {key, label, type:'text'}
//   draw(c, {facing, frame, o, t}) paints one picture into a clean w × h canvas; t is seconds for motion
//   sound, dur                     for sounds: the recipe and its length in seconds
import {survivor,packArt,FRAME,DIRECTIONS,WALK_FRAMES,RUN_FRAMES,HAIR_TONES} from './characters/character.js';
import {BAGS,BAG_IDS,slots} from './gear/bags.js';
import {ITEMS as SUPPLIES,ITEM_IDS as SUPPLY_IDS,itemArt} from './gear/items.js';
import {APPEARANCE_OPTIONS,DEFAULT_APPEARANCE,UNIFORMS,randomAppearance} from './characters/appearance.js';
import {SKIN_TONES,DYES,ROT_TONES,rotRamp} from './characters/palette.js';
import {pet,PET_FRAME,PET_ANIM} from './animals/pet.js';
import {BREEDS,MARKINGS,COATS,EYES,COLLARS,DEFAULT_PET,randomPet} from './animals/look.js';
import {GUNS,HELD,GRENADES,PAINT,gunArt,grenadeArt} from './weapons/equipment.js';
import {DIVE,paintDive,layerSheets,sheetSize,drawLayers} from './characters/layers.js';
import {vectorPainter} from './core/paint.js';
import {R,hash,canvas} from './core/kit.js';
import {text,width,GLYPHS} from './ui/font5x7.js';
import {paintPlate,SAMPLE as PLATE_SAMPLE} from './ui/plate.js';
import {BLOOD,brushes} from './effects/grime.js';
import {GORE,GORE_PARTS,zombiePiece,CRAWL,crawlArt,GIBS,gibArt,BLOOD_KINDS,BLOOD_BOX,bloodArt} from './effects/gore.js';
import {SPECIAL_KINDS,SPECIAL_LOOKS,special,VARIANT_KINDS,VARIANT_LOOKS} from './characters/specials.js';
import {ACID,GAS,ACID_BOX,acidArt,GLOB,globArt,GAS_BOX,gasArt} from './effects/hazards.js';
import {logo,osd,breakup,flip,noSignal} from './effects/tv.js';
import {captions,lowerThird,ticker,bug} from './effects/broadcast.js';
import {SOUNDS} from './sounds/library.js';
import {propArt as campProp,PROP_PAD,FLAME,flameArt,ICON,ICONS,iconArt,fishArt} from './props/camp.js';
import {propArt as workshopProp,text as sprayText,splat} from './props/workshop.js';
import {PROP_SAMPLES} from './props/samples.js';
import {propArt as homeProp,HOME_DECOR} from './props/home.js';
import {propArt as streetProp} from './props/street.js';
import {propArt as townProp,TOWN_SAMPLES} from './props/town.js';
import {propArt as baseProp,BASE_SAMPLES} from './props/base.js';
import {FLOORS,FLOOR_KINDS,floorArt} from './scenery/floors.js';
import {BOT,BRUTE,botArt,bruteArt} from './characters/bots.js';
import {painter} from './core/paint.js';

export const CATEGORIES=[
 {id:'characters',name:'Characters'},{id:'animals',name:'Animals'},{id:'weapons',name:'Weapons'},{id:'items',name:'Items'},{id:'props',name:'Props and scenery'},
 {id:'effects',name:'Effects'},{id:'broadcast',name:'Screens and broadcast'},{id:'type',name:'Interface and type'},{id:'sounds',name:'Sounds'}];
export {DIRECTIONS};

// ---------- Characters ----------
const pick=(list,i)=>list.map(x=>x[i]);
const SWATCH={skin:SKIN_TONES.map(t=>t.ramp[0]),color:HAIR_TONES.map(t=>t[0]),coat:pick(DYES.coat,1),shirt:pick(DYES.shirt,1),pants:pick(DYES.pants,1),boots:pick(DYES.boots,1),packColor:pick(DYES.pack,1),rot:ROT_TONES.map((t,i)=>rotRamp(SKIN_TONES[0].ramp,i,1)[1])};
const LABEL={body:'Body type',skin:'Skin tone',hair:'Hairstyle',color:'Hair color',beard:'Facial hair',hat:'Headwear',top:'Top',coat:'Jacket color',shirt:'Shirt color',bottom:'Pants',pants:'Pants color',shoes:'Shoes',boots:'Shoe color',pack:'Pack',packColor:'Pack color',rot:'Rot',decay:'Decay',eyes:'Eyes',wounds:'Wound'};
const PERSON=['body','skin','hair','color','beard','hat','top','coat','shirt','bottom','pants','shoes','boots','pack','packColor'],INFECTION=['rot','decay','eyes','wounds'];
const lookOption=key=>({key,label:LABEL[key],choices:APPEARANCE_OPTIONS[key],swatches:SWATCH[key]});
const GUN_IDS=Object.keys(GUNS);
// The look the painter takes, from the library's option values.
const survivorLook=(o,zombie)=>{const l={...DEFAULT_APPEARANCE,...o,zombie:zombie?1:0};delete l.gunChoice;delete l.paintball;
 if(!zombie&&o.gunChoice>0){l.gun=GUN_IDS[o.gunChoice-1];if(o.paintball)l.paint=PAINT[l.gun];}return l;};
const personAnims=zombie=>({Idle:{frames:[0],ms:200},Walk:{frames:WALK_FRAMES,ms:zombie?125:85},Run:{frames:RUN_FRAMES,ms:zombie?80:60}});
const diveCache=new Map(),turnCache=new Map();
const personDraw=zombie=>(c,{facing,frame,o})=>{c.scale(2,2);survivor(c,facing,frame,true,survivorLook(o,zombie));};
const CHARACTERS=[
 {id:'survivor',name:'Survivor',category:'characters',group:'People',kind:'sprite',summary:'The modular survivor: two body types, six skin tones and every hair, clothing and pack choice, in 8 facings with idle, walk and run.',
  source:'assets/characters/character.js',usage:"import {survivor} from './assets/characters/character.js';\n// c is a 160 × 192 canvas context; draw at half scale for world units\nc.scale(2,2); survivor(c, facing, frame, true, look);",
  w:FRAME.w,h:FRAME.h,scale:2,facings:8,facing:1,anims:personAnims(false),
  options:[...PERSON.map(lookOption),{key:'gunChoice',label:'Held gun',choices:['No gun',...GUN_IDS.map(id=>GUNS[id].name)]},{key:'paintball',label:'Paintball finish',choices:['Off','On']}],
  presets:UNIFORMS.map(u=>({name:u.name,options:u.look})),defaults:{...pickKeys(DEFAULT_APPEARANCE,PERSON),gunChoice:0,paintball:0},
  random:r=>({...pickKeys(randomAppearance(r),PERSON),gunChoice:0,paintball:0}),draw:personDraw(false)},
 {id:'survivor-dive',name:'Survivor dive',category:'characters',group:'People',kind:'sprite',summary:'The survivor throwing themselves flat, built from the layers so every look gets it: the leap, the slide along the ground and the rise, in 8 directions.',
  source:'assets/characters/layers.js',usage:"import {paintLayers, paintDive, DIVE, layerSheets} from './assets/characters/layers.js';\n// sheets: the layer canvases' contexts; c: a canvas of sheetSize(DIVE)\npaintDive(c, layerSheets(look), look); // frame = direction + phase * 8, drawn with its ground point at (DIVE.x, DIVE.y)",
  w:DIVE.w,h:DIVE.h,scale:1,facings:8,facing:0,anims:{Dive:{frames:3,ms:220}},
  options:[...PERSON.map(lookOption),{key:'gunChoice',label:'Held gun',choices:['No gun',...GUN_IDS.map(id=>GUNS[id].name)]}],
  presets:UNIFORMS.map(u=>({name:u.name,options:u.look})),defaults:{...pickKeys(DEFAULT_APPEARANCE,PERSON),gunChoice:1},
  draw:(c,{facing,frame,o})=>{const look=survivorLook(o,false),key=JSON.stringify(look);let D=diveCache.get(key);if(!D){D=canvas(...sheetSize(DIVE)).getContext('2d');paintDive(D,layerSheets(look),look);diveCache.set(key,D);if(diveCache.size>6)diveCache.delete(diveCache.keys().next().value);}
   const i=facing+(frame%3)*8;c.drawImage(D.canvas,(i%DIVE.cols)*DIVE.w,Math.floor(i/DIVE.cols)*DIVE.h,DIVE.w,DIVE.h,0,0,DIVE.w,DIVE.h);}},
 {id:'survivor-turn',name:'Survivor turning',category:'characters',group:'People',kind:'sprite',summary:'The armed survivor turning all the way round at 64 angles: body, face and gun follow the aim, filled in between the eight drawn facings.',
  source:'assets/characters/layers.js, turn.js',usage:"import {paintLayers, pose, drawLayers, layerSheets, AIM_ANGLES} from './assets/characters/layers.js';\n// paintLayers(sheets, look) returns true once the turned body and head are painted (gun or flashlight in hand);\n// then pose(model, true) picks them for model.aim (radians)\ndrawLayers(c, layerSheets(look), {direction, frame, aim}, x, y, scale, true, true);",
  w:FRAME.w,h:FRAME.h,scale:2,facings:1,anims:{Turn:{frames:[...Array(64).keys()],ms:110}},
  options:[...PERSON.map(lookOption),{key:'gunChoice',label:'Held',choices:GUN_IDS.map(id=>GUNS[id].name)}],
  presets:UNIFORMS.map(u=>({name:u.name,options:u.look})),defaults:{...pickKeys(DEFAULT_APPEARANCE,PERSON),gunChoice:0},
  draw:(c,{frame,o})=>{const look={...survivorLook(o,false),gun:GUN_IDS[o.gunChoice|0]||GUN_IDS[0]},key=JSON.stringify(look);let S=turnCache.get(key);if(!S){S=layerSheets(look);turnCache.set(key,S);if(turnCache.size>4)turnCache.delete(turnCache.keys().next().value);}
   const a=(frame|0)%64*Math.PI/32,d=((Math.round(a/(Math.PI/4))%8)+8)%8;drawLayers(c,S,{direction:d,frame:0,aim:a},FRAME.w/2,FRAME.footY*2,1,true,true);}},
 {id:'zombie',name:'Zombie',category:'characters',group:'Infected',kind:'sprite',summary:'Any survivor look, turned: rot tones, three stages of decay, eyes and wounds, with the shamble walk and lurching run.',
  source:'assets/characters/character.js, zombie.js',usage:"import {survivor} from './assets/characters/character.js';\nc.scale(2,2); survivor(c, facing, frame, true, {...look, zombie: 1});",
  w:FRAME.w,h:FRAME.h,scale:2,facings:8,facing:1,anims:personAnims(true),
  options:[...INFECTION.map(lookOption),...PERSON.map(lookOption)],presets:UNIFORMS.map(u=>({name:u.name,options:u.look})),
  defaults:pickKeys(DEFAULT_APPEARANCE,[...INFECTION,...PERSON]),random:r=>pickKeys(randomAppearance(r),[...INFECTION,...PERSON]),draw:personDraw(true)},
 {id:'special-dead',name:'Special dead',category:'characters',group:'Infected',kind:'sprite',summary:'Three that are worse: the screamer, whose jaw hangs open to its chest; the bloater, swollen tight under a top that no longer covers it; and the spitter, with a sac of acid under its chin. Any zombie look works; Act is the moment before it screams, bursts or spits.',
  source:'assets/characters/specials.js',usage:"import {special, SPECIAL_LOOKS} from './assets/characters/specials.js';\n// c: a 160 × 192 frame at 2x; kind 'screamer', 'bloater' or 'spitter'; act 1 for the scream, the swell or the spit\nc.scale(2,2); special(c, 'bloater', facing, frame, look, act);",
  w:FRAME.w,h:FRAME.h,scale:2,facings:8,facing:1,anims:{Idle:{frames:[0],ms:200},Walk:{frames:WALK_FRAMES,ms:125},Act:{frames:[-1,-2],ms:160}},
  options:[{key:'kind',label:'Kind',choices:['Screamer','Bloater','Spitter']},...INFECTION.map(lookOption),...PERSON.map(lookOption)],
  defaults:{kind:0},draw:(c,{facing,frame,o})=>{const kind=SPECIAL_KINDS[o.kind||0],look={...DEFAULT_APPEARANCE,...SPECIAL_LOOKS[kind]};for(const k of [...INFECTION,...PERSON])if(o[k]!==undefined)look[k]=o[k];c.scale(2,2);special(c,kind,facing,frame<0?0:frame,look,frame<0?(frame===-1?1:.5):0);}},
 {id:'dead-variants',name:'Special dead looks',category:'characters',group:'Infected',kind:'sprite',summary:'Three looks each for the runner, the brute, the screamer, the bloater and the spitter, so a street of them is not one body over and over. They differ only in clothes, hair, skin and rot; the first of each is the look games already use.',
  source:'assets/characters/specials.js',usage:"import {VARIANT_LOOKS} from './assets/characters/specials.js';\nimport {DEFAULT_APPEARANCE} from './assets/characters/appearance.js';\nconst look = {...DEFAULT_APPEARANCE, zombie: 1, pack: 1, ...VARIANT_LOOKS.runner[2]};\n// runner and brute: survivor(c, facing, frame, false, look); the rest: special(c, kind, facing, frame, look, act)",
  w:FRAME.w,h:FRAME.h,scale:2,facings:8,facing:1,anims:{Idle:{frames:[0],ms:200},Walk:{frames:WALK_FRAMES,ms:125}},
  options:[{key:'kind',label:'Kind',choices:['Runner','Brute','Screamer','Bloater','Spitter']},{key:'variant',label:'Look',choices:['First','Second','Third']}],
  defaults:{kind:0,variant:1},random:r=>({kind:Math.floor(r()*5),variant:Math.floor(r()*3)}),
  draw:(c,{facing,frame,o})=>{const kind=VARIANT_KINDS[o.kind||0],look={...DEFAULT_APPEARANCE,zombie:1,pack:1,...VARIANT_LOOKS[kind][o.variant||0]};c.scale(2,2);
   if(SPECIAL_KINDS.includes(kind))special(c,kind,facing,frame,look,0);else survivor(c,facing,kind==='runner'&&frame>0?frame+8:frame,false,look);}},
 {id:'zombie-pieces',name:'Zombie pieces',category:'characters',group:'Infected',kind:'sprite',summary:'Any zombie blown apart: the top and bottom halves at the waist, or the head and the rest at the neck, each with a ragged wound, a stub of spine and gut, lined up with the whole body it came from.',
  source:'assets/effects/gore.js',usage:"import {zombiePiece, GORE_PARTS} from './assets/effects/gore.js';\n// c: a 160 × 192 frame, the same as the zombie's own; part: 'upper', 'lower', 'head' or 'headless'\nzombiePiece(c, {...look, zombie: 1}, facing, 'upper', 0, seed);",
  w:FRAME.w,h:FRAME.h,scale:2,facings:8,facing:1,anims:{Still:{frames:[0],ms:200}},
  options:[{key:'part',label:'Piece',choices:['Top half','Bottom half','Head','Headless']},...INFECTION.map(lookOption),...PERSON.map(lookOption)],presets:UNIFORMS.map(u=>({name:u.name,options:u.look})),
  defaults:{part:0,...pickKeys(DEFAULT_APPEARANCE,[...INFECTION,...PERSON])},draw:(c,{facing,o})=>zombiePiece(c,survivorLook(o,true),facing,GORE_PARTS[o.part||0],0,facing+1)},
 {id:'zombie-crawler',name:'Crawling half',category:'characters',group:'Infected',kind:'sprite',summary:'The top half of a zombie that will not stay down, dragging itself along by its arms with a smear behind it, in 8 directions.',
  source:'assets/effects/gore.js',usage:"import {crawlArt, CRAWL} from './assets/effects/gore.js';\n// c: a CRAWL.w × CRAWL.h frame, its point on the ground at (CRAWL.x, CRAWL.y)\ncrawlArt(c, {...look, zombie: 1}, facing, frame, seed);",
  w:CRAWL.w,h:CRAWL.h,scale:2,facings:8,facing:0,anims:{Crawl:{frames:[0,1,2,3],ms:180}},
  options:[...INFECTION.map(lookOption),...PERSON.map(lookOption)],presets:UNIFORMS.map(u=>({name:u.name,options:u.look})),
  defaults:pickKeys(DEFAULT_APPEARANCE,[...INFECTION,...PERSON]),draw:(c,{facing,frame,o})=>crawlArt(c,survivorLook(o,true),facing,frame,3)}];
function pickKeys(o,keys){const out={};for(const k of keys)out[k]=o[k];return out;}

// Training robots and the brute come as sprite sheets; the library cuts single frames out of a sheet painted once.
const sheetOf=(()=>{const cache=new Map();return (key,w,h,paint)=>{if(!cache.has(key)){const s=canvas(w,h);paint(s.getContext('2d'));cache.set(key,s);}return cache.get(key);};})();
const cell=(c,sheet,col,row,w,h)=>c.drawImage(sheet,col*w,row*h,w,h,0,0,w,h);
CHARACTERS.push(
 {id:'training-robot',name:'Training robot',category:'characters',group:'Training dummies',kind:'sprite',summary:'A bedsheet over a stuffed pillow, broom-handle arms, a car battery and shopping-cart wheels. Seven looks, from plain sheets to copies of the runner, the husk and the spitter.',
  source:'assets/characters/bots.js',usage:"import {BOT, botArt} from './assets/characters/bots.js';\n// one sheet: BOT.rows looks down, BOT.frames frames across, each BOT.w × BOT.h units at 2x\nbotArt(sheetCtx);",
  w:BOT.w*2,h:BOT.h*2,scale:3,anims:{Rolling:{frames:[0,1],ms:160},'Knocked down':{frames:[2],ms:400},Tell:{frames:[3,0],ms:200}},
  options:[{key:'look',label:'Look',choices:['Blue sheet','Sheet 2','Sheet 3','Sheet 4','Runner','Husk','Spitter']}],defaults:{look:0},
  draw:(c,{frame,o})=>cell(c,sheetOf('bots',BOT.w*2*BOT.frames,BOT.h*2*BOT.rows,botArt),frame,o.look|0,BOT.w*2,BOT.h*2)},
 {id:'brute',name:'Brute',category:'characters',group:'Training dummies',kind:'sprite',summary:'The big training dummy: a hulking frame that stomps forward and winds up before it swings.',
  source:'assets/characters/bots.js',usage:"import {BRUTE, bruteArt} from './assets/characters/bots.js';\nbruteArt(sheetCtx); // BRUTE.frames frames across",
  w:BRUTE.w*2,h:BRUTE.h*2,scale:2,anims:{Stomp:{frames:[0,1],ms:220},Down:{frames:[2],ms:400},'Wind-up':{frames:[3],ms:400}},
  draw:(c,{frame})=>cell(c,sheetOf('brute',BRUTE.w*2*BRUTE.frames,BRUTE.h*2,bruteArt),frame,0,BRUTE.w*2,BRUTE.h*2)});

// ---------- Props and scenery ----------
const propSize=o=>({w:Math.ceil(o.w+PROP_PAD*2)*2,h:Math.ceil(o.h+o.z+PROP_PAD*2)*2});
const SETS={camp:{paint:campProp,file:'camp.js',id:'',label:'Camp'},workshop:{paint:workshopProp,file:'workshop.js',id:'workshop-',label:'Workshop'},home:{paint:homeProp,file:'home.js',id:'home-',label:'House'},street:{paint:streetProp,file:'street.js',id:'street-',label:'Street'},town:{paint:townProp,file:'town.js',id:'town-',label:'Town'},base:{paint:baseProp,file:'base.js',id:'base-',label:'Base'}};
const PROPS=[...PROP_SAMPLES,...TOWN_SAMPLES,...BASE_SAMPLES].map(s=>{const sizes=s.samples.map(propSize),w=Math.max(...sizes.map(z=>z.w)),h=Math.max(...sizes.map(z=>z.h)),set=SETS[s.set],o0=s.samples[0],file=set.file;
 // Wall decorations are previewed on a piece of the wall they hang on.
 const paint=s.set==='home'&&HOME_DECOR.has(s.kind)?(c,o)=>{homeProp(c,{...o,kind:'wall',paint:0});homeProp(c,o);}:set.paint;
 return {id:'prop-'+set.id+s.kind,name:s.name,category:'props',group:s.group,kind:'still',
  summary:`${set.label} prop, drawn to fit its footprint.${s.samples.length>1?' '+s.samples.length+' variations.':''} ${s.set==='home'||s.set==='street'?'Its pattern follows its size and position, so copies placed around a house vary.':'Its wear and grain follow its size and position, so copies placed around a scene vary.'}`,
  stats:{Footprint:`${o0.w} × ${o0.h} units`,Height:`${o0.z} units`},source:'assets/props/'+file,
  usage:`import {propArt, PROP_PAD} from './assets/props/${file}';
// canvas: (w + 2 × PROP_PAD) × 2 wide, (h + z + 2 × PROP_PAD) × 2 tall
propArt(ctx, ${JSON.stringify({...o0,x:o0.x|0,y:o0.y|0})});`,
  w,h,scale:2,bg:null,options:s.samples.length>1?[{key:'variant',label:'Variation',choices:s.samples.map((x,i)=>`${i+1} · ${x.w} × ${x.h}`)}]:undefined,defaults:{variant:0},
  draw:(c,{o})=>{const sm=s.samples[o.variant|0]||o0,sz=propSize(sm);c.translate(Math.round((w-sz.w)/2),h-sz.h);paint(c,sm);}};});
// Floors: one swatch per kind, painted into a rectangle of world units.
PROPS.push({id:'floor',name:'Floors',category:'props',group:'Floors and ground',kind:'still',summary:'Wood boards, kitchen and bathroom tile, carpet, lawn, concrete, asphalt, dirt, gravel and field grass, painted into any rectangle. The pattern is tied to world position, so neighbouring rectangles line up.',
 source:'assets/scenery/floors.js',usage:"import {floorArt} from './assets/scenery/floors.js';\nimport {painter} from './assets/core/paint.js';\nctx.scale(2,2); floorArt(painter(ctx), {kind: 'wood', x: 0, y: 0, w: 160, h: 100});",
 w:320,h:200,scale:2,bg:null,options:[{key:'floor',label:'Floor',choices:FLOOR_KINDS.map(k=>FLOORS[k].name)}],defaults:{floor:0},
 draw:(c,{o})=>{c.scale(2,2);floorArt(painter(c),{kind:FLOOR_KINDS[o.floor|0],x:0,y:0,w:160,h:100});}});

// ---------- Items ----------
const FISH=[['perch','Sand perch','Striped, common in the shallows.'],['mackerel','Inlet mackerel','Barred blue-green back.'],['cod','Rock cod','Heavy and spotted.'],['moonfin','Moonfin','The rare one: a pale glow along its side and fins.']];
const ITEMS=FISH.map(([id,name,line])=>({id:'fish-'+id,name,category:'items',group:'Fish',kind:'still',summary:line+' Raw, cooking, cooked or burnt.',source:'assets/props/camp.js',
 usage:`import {fishArt} from './assets/props/camp.js';
// centred on (0, 0), facing right, about 31 × 12 units; cook runs 0 to 1, past 0.84 it chars
fishArt(ctx, '${id}', cook, scale);`,
 w:84,h:32,scale:4,options:[{key:'cook',label:'Cooked',choices:['Raw','Cooking','Cooked','Burnt']}],defaults:{cook:0},
 draw:(c,{o})=>{c.translate(46,16);c.scale(2,2);fishArt(c,id,[null,.3,.7,.95][o.cook|0]);}}));

// Backpacks: the pack art from the survivor, on its own, with the grid and weight each one carries.
BAG_IDS.forEach(id=>{const b=BAGS[id];ITEMS.push({id:'backpack-'+id,name:b.name,category:'items',group:'Backpacks',kind:'still',summary:`${b.size} pack. ${b.description}.`,
 stats:{Size:b.size,Grid:`${b.cols} × ${b.rows} (${slots(id)} slots)`,'Weight limit':b.kg+' kg'},source:'assets/gear/bags.js, assets/characters/character.js',
 usage:`import {BAGS} from './assets/gear/bags.js';\nimport {packArt} from './assets/characters/character.js';\n// worn: survivor(c, facing, frame, true, {...look, pack: ${b.pack}})\nctx.scale(2,2); ctx.translate(20,56); packArt(ctx, {pack: BAGS.${id}.pack, packColor});`,
 w:80,h:80,scale:3,options:[{key:'packColor',label:'Pack color',choices:DYES.pack.map(d=>d[0]),swatches:SWATCH.packColor}],defaults:{packColor:0},
 draw:(c,{o})=>{c.scale(2,2);c.translate(20,56);packArt(c,{pack:b.pack,packColor:o.packColor|0});}});});

// Supplies: ammo, the field kit and materials, each one bag cell, drawn four times up.
SUPPLY_IDS.forEach(id=>{const it=SUPPLIES[id];ITEMS.push({id:'supply-'+id,name:it.name,category:'items',group:'Supplies',kind:'still',summary:it.description+'.',
 stats:{Kind:{ammo:'Ammo',kit:'Field kit',material:'Material'}[it.kind],'Bag space':it.shape.join(' × '),Stack:it.stack,Weight:it.kg+' kg each'},source:'assets/gear/items.js',
 usage:`import {ITEMS, itemArt} from './assets/gear/items.js';\n// centred on (0, 0), about 12 × 12 units\nctx.scale(2,2); ctx.translate(8,8); itemArt(painter(ctx), '${id}');`,
 w:60,h:60,scale:3,draw:c=>{c.translate(30,30);c.scale(4,4);itemArt(painter(c),id);}});});

// ---------- Animals ----------
const petAnims={Idle:{frames:PET_ANIM.idle,ms:220},Walk:{frames:PET_ANIM.walk,ms:110},Run:{frames:PET_ANIM.run,ms:75},Sit:{frames:PET_ANIM.sit,ms:260},Lie:{frames:PET_ANIM.lie,ms:400},Sniff:{frames:PET_ANIM.sniff,ms:300},Stretch:{frames:PET_ANIM.stretch,ms:700}};
const petEntry=(species,id,name,summary)=>({id,name,category:'animals',group:species?'Cats':'Dogs',kind:'sprite',summary,
 source:'assets/animals/pet.js, look.js',usage:`import {pet} from './assets/animals/pet.js';\n// c is a 160 × 160 canvas context\nc.scale(2,2); pet(c, facing, frame, {species: ${species}, ...look});`,
 w:PET_FRAME.w,h:PET_FRAME.h,scale:2,facings:8,facing:1,anims:petAnims,
 options:[{key:'breed',label:'Breed',choices:BREEDS[species]},{key:'coat',label:'Coat',choices:COATS.map(c=>c.name),swatches:COATS.map(c=>c.ramp[2])},{key:'marking',label:'Markings',choices:MARKINGS[species]},
  {key:'eyes',label:'Eyes',choices:EYES.map(e=>e.name),swatches:EYES.map(e=>e.col)},{key:'collar',label:'Collar',choices:COLLARS.map(c=>c.name)}],
 defaults:{...DEFAULT_PET[species?'cat':'dog']},random:r=>randomPet(species,r),
 draw:(c,{facing,frame,o})=>{c.scale(2,2);pet(c,facing,frame,{species,...o});}});
const ANIMALS=[petEntry(0,'dog','Dog','Shepherd, Lab, Terrier or Husky, with seven coats and five markings. Idle, walk, run, sit and lie in 8 facings.'),
 petEntry(1,'cat','Cat','Shorthair or Longhair, with seven coats and five markings. Idle, walk, run, sit and lie in 8 facings.')];

// ---------- Weapons ----------
// Gun and grenade icons are drawn four times up on a scratch canvas, trimmed to their pixels and centred, as the creator's tiles do.
function icon(c,w,h,paint){const s=canvas(240,120),g=s.getContext('2d',{willReadFrequently:true});g.translate(120,60);g.scale(4,4);paint(vectorPainter(g));
 const d=g.getImageData(0,0,240,120).data;let x0=240,y0=120,x1=0,y1=0;for(let y=0;y<120;y++)for(let x=0;x<240;x++)if(d[(y*240+x)*4+3]>8){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}
 if(x1<x0)return;const bw=x1-x0+1,bh=y1-y0+1;c.drawImage(s,x0,y0,bw,bh,Math.round((w-bw)/2),Math.round((h-bh)/2),bw,bh);}
const WEAPONS=[
 ...GUN_IDS.map(id=>({id,name:GUNS[id].name,category:'weapons',group:GUNS[id].shells?'Shotguns':GUNS[id].rifle?'Rifles':'Handguns',kind:'still',summary:GUNS[id].description+'.',
  stats:{Slot:GUNS[id].rifle?'Primary · carried ammo':'Secondary · unlimited ammo',[GUNS[id].shells?'Tube':'Magazine']:GUNS[id].mag,Damage:GUNS[id].damage+(GUNS[id].pellets?' × '+GUNS[id].pellets+' pellets':''),'Fire interval':GUNS[id].interval+' s',Reload:GUNS[id].reload+(GUNS[id].shells?' s a shell':' s'),Range:GUNS[id].range},
  source:'assets/weapons/equipment.js',usage:`import {gunArt, heldGun, weaponArms} from './assets/weapons/equipment.js';\n// gunArt draws the icon; survivor() draws it held when look.gun = '${id}'\ngunArt(painter, '${id}', paintColor);`,
  w:120,h:60,scale:3,options:[{key:'paintball',label:'Finish',choices:['Steel','Paintball']},{key:'light',label:'Flashlight',choices:['None','Under the barrel']}],defaults:{paintball:0,light:0},
  draw:(c,{o})=>icon(c,120,60,g=>gunArt(g,id,o.paintball?PAINT[id]:undefined,0,!!o.light))})),
 // The flashlight: held up in both hands like a gun when look.gun is 'flashlight', its beam from the lens (lightAt).
 ...Object.keys(HELD).map(id=>({id,name:HELD[id].name,category:'weapons',group:'Lights',kind:'still',summary:HELD[id].description+'. Held in both hands and pointed where you look.',
  source:'assets/weapons/equipment.js',usage:`import {lightAt} from './assets/weapons/equipment.js';\n// survivor() draws it held when look.gun = '${id}'; the beam starts at lightAt(angle, '${id}') from the feet\nsurvivor(ctx, facing, frame, true, {...look, gun:'${id}'});`,
  w:60,h:40,scale:4,draw:c=>icon(c,60,40,g=>gunArt(g,id))})),
 ...Object.keys(GRENADES).map(id=>({id:id+'-grenade',name:GRENADES[id].name,category:'weapons',group:'Grenades',kind:'still',summary:GRENADES[id].description+'.',
  stats:{Fuse:GRENADES[id].duration+' s',Radius:GRENADES[id].radius},source:'assets/weapons/equipment.js',usage:`import {grenadeArt} from './assets/weapons/equipment.js';\ngrenadeArt(painter, '${id}');`,
  w:60,h:60,scale:3,draw:c=>icon(c,60,60,g=>grenadeArt(g,id))}))];

// ---------- Effects: blood and grime ----------
const seedOpt={key:'seed',label:'Variation',choices:['1','2','3','4','5','6']};
const grime=(id,name,summary,paint)=>({id,name,category:'effects',group:'Blood and grime',kind:'still',summary,source:'assets/effects/grime.js',
 usage:`import {brushes} from './assets/effects/grime.js';\nconst b = brushes(ctx, seed); // one canvas pixel per art pixel\n${paint.toString().match(/b\.\w+\([^;]*\)/)?.[0]??''};`,
 w:96,h:64,scale:4,bg:'#3a3f46',options:[seedOpt],defaults:{seed:0},draw:(c,{o})=>{const b=brushes(c,0x5eed+o.seed*977);paint(b,c);c.globalAlpha=1;}});
const EFFECTS=[
 {id:'flames',name:'Campfire flames',category:'effects',group:'Fire',kind:'sprite',summary:'Six looping flame frames for a fire, anchored at the bottom centre. Lay an additive glow under them.',source:'assets/props/camp.js',
  usage:"import {FLAME, flameArt} from './assets/props/camp.js';\n// FLAME.frames frames across, each FLAME.w × FLAME.h units at 2x, anchor (FLAME.ax, FLAME.ay)\nflameArt(sheetCtx);",
  w:FLAME.w*2,h:FLAME.h*2,scale:3,bg:'#14100d',anims:{Burn:{frames:[0,1,2,3,4,5],ms:90}},draw:(c,{frame})=>cell(c,sheetOf('flames',FLAME.w*2*FLAME.frames,FLAME.h*2,flameArt),frame,0,FLAME.w*2,FLAME.h*2)},
 grime('blood-splat','Blood splat','A pool with thrown droplets and streaks, optionally sprayed in one direction.',b=>{b.splat(40,30,6,{spread:1.1,count:14});}),
 grime('blood-drips','Blood drips','Runs that thin as they fall and end in a bead.',b=>{b.blob(30,10,4,BLOOD[1]);b.drip(28,12,30,2);b.drip(33,11,18,1);b.blob(62,14,3,BLOOD[2]);b.drip(61,16,24,1);}),
 grime('hand-smear','Hand smear','A hand dragged through blood: a heavy patch, then finger streaks that break up.',b=>{b.smear(14,16,82,40,12,4,3,4);}),
 grime('claw-gouges','Claw gouges','Scraped metal with a shadow on one side, deepest mid-scratch.',b=>{b.claw(24,10,68,54,3,4);}),
 grime('scuffs-dirt','Scuffs and dirt','Worn paint, chips and grime for panels and props.',b=>{b.dirt(6,6,84,52,3,.6);for(let i=0;i<9;i++)b.scuff(10+i*9,14+(i%3)*14,14,.4+i*.2,.14);for(let i=0;i<12;i++)b.chip(8+i*7,50-(i%4)*9);}),
 {id:'acid',name:'Acid',category:'effects',group:'Hazards',kind:'motion',summary:'A spitter\'s acid: the glob in flight with its tail, and the pool it leaves, bubbling as it eats into the ground and drying to a scorched stain.',source:'assets/effects/hazards.js',
  usage:"import {acidArt, ACID_BOX, globArt, GLOB} from './assets/effects/hazards.js';\n// a pool: ACID_BOX units at 2x, centred on the spot; frame 0 to 3 bubbles, fade 0 to 1 dries it\nacidArt(c, seed, frame, fade);\n// the glob: GLOB units at 2x; angle is the way it flies\nglobArt(c, frame, angle);",
  dur:2,w:ACID_BOX.w*2+GLOB.w*2,h:ACID_BOX.h*2,scale:3,bg:'#3a3f46',options:[{key:'fade',label:'Drying',choices:['Fresh','Drying','Dry']},seedOpt],defaults:{fade:0,seed:0},
  draw:(c,{o,t=0})=>{const f=Math.floor(t*6)%4;acidArt(c,o.seed*11+3,f,[0,.4,.8][o.fade||0]);c.save();c.translate(ACID_BOX.w*2,ACID_BOX.h-GLOB.h);globArt(c,f,Math.PI*.15);c.restore();}},
 {id:'gas',name:'Bloater gas',category:'effects',group:'Hazards',kind:'still',summary:'Puffs of the sour green cloud a bloater bursts into, soft and dithered at the edge so a few overlapping read as one thin, drifting cloud.',source:'assets/effects/hazards.js',
  usage:"import {gasArt, GAS_BOX} from './assets/effects/hazards.js';\n// a GAS_BOX.w × GAS_BOX.h unit puff at 2x; shade 0 dark to 2 light\ngasArt(c, seed, shade);",
  w:GAS_BOX.w*2*3,h:GAS_BOX.h*2,scale:2,bg:'#3a3f46',options:[seedOpt],defaults:{seed:0},
  draw:(c,{o})=>{for(let s=0;s<3;s++){const t=canvas(GAS_BOX.w*2,GAS_BOX.h*2);gasArt(t.getContext('2d'),o.seed*7+s,s);c.drawImage(t,s*GAS_BOX.w*2,0);}}},
 {id:'gibs',name:'Gibs',category:'effects',group:'Gore',kind:'still',summary:'What a close blast throws: meat, a rib, a bone, gut, a hand, a scrap of clothing and scalp. Each fits in 10 × 10 units round its middle.',source:'assets/effects/gore.js',
  usage:"import {GIBS, gibArt} from './assets/effects/gore.js';\n// a 20 × 20 canvas per chunk; col is the clothing scrap's color\ngibArt(c, 'rib', seed, '#4c5566');",w:GIBS.length*20,h:20,scale:4,bg:'#3a3f46',options:[seedOpt],defaults:{seed:0},
  draw:(c,{o})=>GIBS.forEach((k,i)=>{c.save();c.translate(i*20,0);gibArt(c,k,o.seed*7+i);c.restore();})},
 {id:'gore-blood',name:'Fresh blood',category:'effects',group:'Gore',kind:'still',summary:'Blood for the ground and walls in a fight: a pool, a splash thrown one way, drops, a drag mark and a wall splatter that runs.',source:'assets/effects/gore.js',
  usage:"import {bloodArt, BLOOD_BOX} from './assets/effects/gore.js';\n// a BLOOD_BOX.w × BLOOD_BOX.h unit picture at 2x, centred on the spot; direction 0 to 7 for a splash or smear\nbloodArt(c, 'splash', seed, direction);",
  w:BLOOD_BOX.w*2,h:BLOOD_BOX.h*2,scale:2,bg:'#3a3f46',options:[{key:'kind',label:'Kind',choices:['Pool','Splash','Drops','Drag mark','Wall']},{key:'dir',label:'Direction',choices:['Right','Down right','Down','Down left','Left','Up left','Up','Up right']},seedOpt],defaults:{kind:0,dir:0,seed:0},
  draw:(c,{o})=>bloodArt(c,BLOOD_KINDS[o.kind||0],o.seed*13+1,o.dir||0)},
 {id:'gore-palette',name:'Gore palette',category:'effects',group:'Gore',kind:'still',summary:'Fresh blood from the dark rim to the shine, raw flesh, gut and bone.',source:'assets/effects/gore.js',usage:"import {GORE} from './assets/effects/gore.js';",
  w:120,h:24,scale:4,palette:[...GORE.blood,...GORE.flesh,...GORE.gut,...GORE.bone],draw:c=>[...GORE.blood,...GORE.flesh,...GORE.gut,...GORE.bone].forEach((col,i)=>R(c,i*8,0,8,24,col))},
 {id:'blood-palette',name:'Blood palette',category:'effects',group:'Blood and grime',kind:'still',summary:'The five dried-to-fresh blood colors every grime brush uses.',source:'assets/effects/grime.js',usage:"import {BLOOD} from './assets/effects/grime.js';",
  w:100,h:24,scale:4,palette:BLOOD,draw:c=>BLOOD.forEach((col,i)=>R(c,i*20,0,20,24,col))}];

// ---------- Screens and broadcast (a 240 × 135 TV picture) ----------
const PW=240,PH=135;
// A stand-in picture for effects that work on another picture: a bar test card with a moving sweep.
function card(t){const s=canvas(PW,PH),c=s.getContext('2d');['#c8c8c8','#c8c800','#00c8c8','#00c800','#c800c8','#c80000','#0000c8'].forEach((col,i)=>R(c,Math.round(i*PW/7),0,Math.ceil(PW/7),96,col));
 R(c,0,96,PW,39,'#101418');R(c,Math.round((t*60)%PW),96,6,39,'#e8e8e8');text(c,'TEST CARD',PW/2-width('TEST CARD')/2,110,'#e8e8e8');return s;}
const motion=(id,name,group,summary,dur,usage,draw,extra={})=>({id,name,category:'broadcast',group,kind:'motion',summary,dur,source:extra.source||'assets/effects/tv.js',usage,w:PW,h:PH,scale:2,draw,...extra});
const BROADCAST=[
 motion('tv-logo','Power-on logo','The set','The maker’s name fades up on black when a TV wakes, with an accent rule.',3,"import {logo} from './assets/effects/tv.js';\nlogo(ctx, 240, 135, fade, 'VESPERA');",
  (c,{t,o})=>logo(c,PW,PH,Math.min(1,t/.6)*(t<2.4?1:Math.max(0,(3-t)/.6)),(o.brand||'VESPERA').toUpperCase()),{options:[{key:'brand',label:'Brand name',type:'text',default:'VESPERA'}],defaults:{brand:'VESPERA'}}),
 motion('tv-osd','Channel number','The set','The channel number and station name a set shows after a flip.',2.5,"import {osd} from './assets/effects/tv.js';\nosd(ctx, 6, 'CH6 NEWS', fade, 240);",
  (c,{t,o})=>{c.drawImage(card(t),0,0);osd(c,o.ch||'6',(o.station||'').toUpperCase(),t<1.8?1:Math.max(0,(2.4-t)/.6),PW);},{options:[{key:'ch',label:'Channel',type:'text',default:'6'},{key:'station',label:'Station',type:'text',default:'CH6 NEWS'}],defaults:{ch:'6',station:'CH6 NEWS'}}),
 motion('tv-flip','Channel flip','The set','A digital channel change: 8 × 8 blocks smear from one picture into the next.',1.2,"import {flip} from './assets/effects/tv.js';\nflip(ctx, fromCanvas, toCanvas, k, frameNo, 240, 135);",
  (c,{t})=>{const a=card(0),b=canvas(PW,PH),g=b.getContext('2d');R(g,0,0,PW,PH,'#14203a');text(g,'NEXT CHANNEL',PW/2-width('NEXT CHANNEL')/2,62,'#7ab4ff');const k=Math.max(0,Math.min(1,(t-.3)/.4));flip(c,a,b,k,Math.floor(t*30),PW,PH);}),
 motion('tv-breakup','Digital breakup','The set','A failing signal: the picture freezes and cracks into shifting blocks, never analog static.',2,"import {breakup} from './assets/effects/tv.js';\nbreakup(ctx, frozenCanvas, k, frameNo, 240, 135);",
  (c,{t})=>breakup(c,card(0),Math.max(0,Math.min(1,(t-.3)/1.2)),Math.floor(t*30),PW,PH)),
 motion('tv-no-signal','NO SIGNAL','The set','The set’s own grey box drifting round a black screen.',8,"import {noSignal} from './assets/effects/tv.js';\nnoSignal(ctx, 240, 135, seconds);",(c,{t})=>noSignal(c,PW,PH,t)),
 motion('captions','Closed captions','Broadcast overlays','Roll-up captions, two lines at a time in black boxes.',4,"import {captions} from './assets/effects/broadcast.js';\ncaptions(ctx, [[0,'FIRST LINE'],[1.2,'SECOND LINE']], seconds, top);",
  (c,{t})=>{c.drawImage(card(t),0,0);captions(c,[[0,'WE ARE GETTING REPORTS'],[1.2,'FROM ACROSS THE CITY...'],[2.4,'[SIRENS]']],t);},{source:'assets/effects/broadcast.js'}),
 motion('lower-third','Lower third','Broadcast overlays','A colored tag over a white headline bar that wipes in.',3,"import {lowerThird} from './assets/effects/broadcast.js';\nlowerThird(ctx, {tag:'BREAKING NEWS', headline:'...', tagColor:'#c8102e', wipe:k});",
  (c,{t,o})=>{c.drawImage(card(t),0,0);lowerThird(c,{tag:(o.tag||'').toUpperCase(),headline:(o.headline||'').toUpperCase(),tagColor:'#c8102e',wipe:t/.5});},{source:'assets/effects/broadcast.js',options:[{key:'tag',label:'Tag',type:'text',default:'BREAKING NEWS'},{key:'headline',label:'Headline',type:'text',default:'CITY UNDER CURFEW TONIGHT'}],defaults:{tag:'BREAKING NEWS',headline:'CITY UNDER CURFEW TONIGHT'}}),
 motion('ticker','News ticker','Broadcast overlays','A scrolling ticker with a station box and an optional clock.',6,"import {ticker} from './assets/effects/broadcast.js';\nticker(ctx, 'LINE · LINE · ', seconds, {station:'6 NEWS', color:'#c8102e', clock:'11:47'});",
  (c,{t,o})=>{c.drawImage(card(t),0,0);ticker(c,(o.line||' ').toUpperCase()+' · ',t,{station:'6 NEWS',color:'#c8102e',clock:'11:47'});},{source:'assets/effects/broadcast.js',options:[{key:'line',label:'Ticker text',type:'text',default:'STAY INDOORS · POLICE URGE CALM · ROADS CLOSED ON THE EAST SIDE'}],defaults:{line:'STAY INDOORS · POLICE URGE CALM · ROADS CLOSED ON THE EAST SIDE'}}),
 motion('corner-bug','Corner bug','Broadcast overlays','A small station or LIVE badge for the corner of the picture.',1,"import {bug} from './assets/effects/broadcast.js';\nbug(ctx, 'LIVE', x, y, '#c8102e', '#ffffff');",
  (c,{t,o})=>{c.drawImage(card(t),0,0);const s=(o.label||'LIVE').toUpperCase();bug(c,s,PW-6-width(s)-6,5,'#c8102e');},{source:'assets/effects/broadcast.js',options:[{key:'label',label:'Label',type:'text',default:'LIVE'}],defaults:{label:'LIVE'}})];

// ---------- Type ----------
const TYPE=[{id:'font-5x7',name:'Pixel font 5 × 7',category:'type',group:'Fonts',kind:'still',summary:'A capitals-only bitmap font for screens and signage. Every character is six pixels wide, gap included.',
 source:'assets/ui/font5x7.js',usage:"import {text, width} from './assets/ui/font5x7.js';\ntext(ctx, 'HELLO', x, y, '#ffffff'); // width('HELLO') gives its length",
 w:200,h:64,scale:3,bg:'#0d1117',options:[{key:'sample',label:'Sample text',type:'text',default:'THE QUICK BROWN FOX'},{key:'ink',label:'Ink',choices:['White','Amber','Green','Red'],swatches:['#ffffff','#f2c200','#7fe07f','#ff4a3a']}],
 defaults:{sample:'THE QUICK BROWN FOX',ink:0},
 draw:(c,{o})=>{const ink=['#ffffff','#f2c200','#7fe07f','#ff4a3a'][o.ink|0],all=Object.keys(GLYPHS).join('');let x=4,y=4;
  for(const ch of all){if(x+6>196){x=4;y+=9;}text(c,ch,x,y,'#8b93a1');x+=6;}text(c,(o.sample||'').toUpperCase().slice(0,32),4,y+14,ink);}}];

TYPE.push({id:'map-markers',name:'Map markers',category:'type',group:'Icons',kind:'still',summary:'Station markers that float over a map: hammer, medical cross, bowl, lantern, arrow, target and sprout, on an ember tag.',
 source:'assets/props/camp.js',usage:"import {ICON, ICONS, iconArt} from './assets/props/camp.js';\n// one strip: ICONS.length markers, each ICON.w × ICON.h units at 2x\niconArt(stripCtx);",
 w:ICON.w*2,h:ICON.h*2,scale:4,options:[{key:'icon',label:'Marker',choices:['Hammer','Cross','Bowl','Lantern','Arrow','Target','Sprout']}],defaults:{icon:0},
 draw:(c,{o})=>cell(c,sheetOf('icons',ICON.w*2*ICONS.length,ICON.h*2,iconArt),o.icon|0,0,ICON.w*2,ICON.h*2)},
 {id:'spray-lettering',name:'Spray-paint lettering',category:'type',group:'Fonts',kind:'still',summary:'A rough block font for spray-painted signs, 3 to 5 pixels wide and 5 tall at any size, with paint splats.',
 source:'assets/props/workshop.js',usage:"import {text, textWidth, splat} from './assets/props/workshop.js';\nimport {painter} from './assets/core/paint.js';\nconst g = painter(ctx); // ctx scaled 2x\ntext(g, 'ARENA', x, y, size, '#b33a2a');",
 w:200,h:56,scale:3,bg:'#4b463f',options:[{key:'sample',label:'Sign text',type:'text',default:'NO ENTRY'},{key:'ink',label:'Paint',choices:['Red','Black','White','Ember'],swatches:['#b33a2a','#16171a','#e8e0d1','#dd6f2c']}],defaults:{sample:'NO ENTRY',ink:0},
 draw:(c,{o})=>{c.scale(2,2);const g=painter(c),ink=['#b33a2a','#16171a','#e8e0d1','#dd6f2c'][o.ink|0];splat(g,86,20,4,ink,3,false);sprayText(g,(o.sample||'').toUpperCase().slice(0,14),6,7,2,ink);}});

// ---------- Sounds ----------
const SOUND_ENTRIES=SOUNDS.map(s=>({id:'sound-'+s.id,name:s.name,category:'sounds',group:s.group,kind:'sound',summary:`${s.dur < 1 ? Math.round(s.dur*1000)+' ms' : s.dur+' seconds'}, synthesised in the browser, so it ships as code with no audio file.`,
 source:'assets/sounds/library.js',usage:`import {SOUNDS, playSound} from './assets/sounds/library.js';\nplaySound(audioCtx, SOUNDS.find(s => s.id === '${s.id}'));`,
 dur:s.dur,sound:s,options:s.options,defaults:Object.fromEntries((s.options||[]).map(o=>[o.key,0]))}));

// The control center's steel faceplate: a game passes where its sticks, buttons and readouts sit, and the plate is painted to fit.
TYPE.push({id:'control-plate',name:'Control center plate',category:'type',group:'Controls',kind:'still',summary:'Worn gunmetal under the touch controls: recessed wells for the sticks, sockets for buttons, dark glass for readouts, a hazard lip, rust, blood, and G.U.N. and LEET AF cut into the bottom edge with a knife, one careful and one hacked in fast.',
 source:'assets/ui/plate.js',usage:"import {paintPlate} from './assets/ui/plate.js';\n// one canvas pixel per art pixel; show it at 2x\npaintPlate(ctx, {w, h, split, band:8, wells:[{x,y,r}], sockets:[{x,y,r}], insets:[{x,y,w,h}], names:{left, right}});",
 w:PLATE_SAMPLE.w,h:PLATE_SAMPLE.h,scale:3,options:[{key:'blood',label:'Blood',choices:['On','Off']},{key:'seed',label:'Wear',choices:['One','Two','Three']}],defaults:{blood:0,seed:0},
 draw:(c,{o})=>paintPlate(c,{...PLATE_SAMPLE,blood:!(o.blood|0),seed:0x51ee1+(o.seed|0)*7919})});

export const CATALOG=[...CHARACTERS,...ANIMALS,...WEAPONS,...ITEMS,...PROPS,...EFFECTS,...BROADCAST,...TYPE,...SOUND_ENTRIES];
export const byId=id=>CATALOG.find(e=>e.id===id);
