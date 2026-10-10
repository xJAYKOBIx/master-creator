import {SKIN_TONES,DYES,ROT_TONES} from './palette.js';
export const APPEARANCE_KEY='deadlight-character-room-look-v1';
// Survivor and zombie looks are kept apart; the kind key remembers which one is active.
export const ZOMBIE_KEY='deadlight-character-room-zombie-v1',KIND_KEY='deadlight-character-room-kind-v1';
export const APPEARANCE_OPTIONS={hair:['Swept hair','Short crop','Ponytail','Bald','Buzz cut','Mohawk','Bob','Long hair','Curly','Top bun'],beard:['Clean shaven','Stubble','Mustache','Full beard','Goatee','Short beard','Long beard'],hat:['No hat','Field cap','Knit hat','Police cap','Cowboy hat','Riot helmet','Combat helmet'],color:['Dark','Chestnut','Fair','Silver','Auburn','Platinum'],
 // Body and clothing parts. Every index stays stable once saved; append new choices at the end.
 body:['Male','Female'],skin:SKIN_TONES.map(t=>t.name),top:['Field jacket','T-shirt','Long sleeve','Hoodie','Business shirt','Shirt and tie','Tank top','Fatigues','LEET AF fatigues','Police shirt','SWAT armor'],coat:DYES.coat.map(d=>d[0]),shirt:DYES.shirt.map(d=>d[0]),pants:DYES.pants.map(d=>d[0]),boots:DYES.boots.map(d=>d[0]),pack:['Leather pack','No pack','Canvas daypack','Frame pack'],packColor:DYES.pack.map(d=>d[0]),
 bottom:['Work trousers','Jeans','Cargo pants','Slacks','Shorts','Fatigue pants','Tactical pants'],shoes:['Work boots','Sneakers','Dress shoes','Hiking boots'],
 // Zombie switch and infection. These only change the art while zombie is 1.
 zombie:['Survivor','Zombie'],rot:ROT_TONES.map(t=>t.name),decay:['Fresh','Turned','Rotten'],eyes:['Clouded','Glowing','Hollow'],wounds:['No wound','Bite','Claw gashes','Exposed ribs']};
// Uniform sets: one tap dresses the whole outfit. Only clothing keys change; body, face and hair stay.
export const UNIFORMS=[
 {id:'military',name:'Military',look:{top:7,coat:1,hat:6,bottom:5,pants:3,shoes:3,boots:1,packColor:1}},
 {id:'leet',name:'LEET AF',look:{top:8,coat:1,hat:6,bottom:5,pants:3,shoes:3,boots:1,packColor:1}},
 {id:'police',name:'Police',look:{top:9,shirt:6,hat:3,bottom:3,pants:0,shoes:2,boots:1}},
 {id:'swat',name:'SWAT',look:{top:10,coat:7,hat:5,bottom:6,pants:1,shoes:3,boots:1,packColor:2}}];
export const DEFAULT_APPEARANCE={hair:0,beard:0,hat:0,color:0,body:0,skin:0,top:0,coat:0,shirt:0,pants:0,boots:0,pack:0,packColor:0,bottom:0,shoes:0,zombie:0,rot:1,decay:1,eyes:0,wounds:1};
// A random look for quick exploration; every combination is valid.
export function randomAppearance(rand=Math.random){const out={};for(const [key,options] of Object.entries(APPEARANCE_OPTIONS)){if(key==='zombie'){out.zombie=0;continue;}const valid=options.map((v,i)=>v?i:-1).filter(i=>i>=0);out[key]=valid[Math.floor(rand()*valid.length)];}return out;}
export function normalizeAppearance(value){const out={...DEFAULT_APPEARANCE};for(const key of Object.keys(out)){const v=value?.[key];if(Number.isInteger(v)&&v>=0&&v<APPEARANCE_OPTIONS[key].length&&APPEARANCE_OPTIONS[key][v])out[key]=v;}return out;}
export const appearanceKey=look=>Object.keys(DEFAULT_APPEARANCE).map(k=>look[k]).join('-');
const keyFor=zombie=>zombie?ZOMBIE_KEY:APPEARANCE_KEY;
// Without a kind, the active look is read. A zombie look that was never saved starts from the survivor.
export function readAppearance(storage,kind){let zombie=kind===undefined?(()=>{try{return storage.getItem(KIND_KEY)==='zombie';}catch{return false;}})():kind==='zombie';
 try{const raw=storage.getItem(keyFor(zombie));if(raw)return {...normalizeAppearance(JSON.parse(raw)),zombie:zombie?1:0};}catch{}
 if(!zombie)return {...DEFAULT_APPEARANCE};let base;try{base=normalizeAppearance(JSON.parse(storage.getItem(APPEARANCE_KEY)));}catch{base={...DEFAULT_APPEARANCE};}return {...base,zombie:1};}
export function saveAppearance(storage,look){try{const v=normalizeAppearance(look);storage.setItem(keyFor(v.zombie),JSON.stringify(v));storage.setItem(KIND_KEY,v.zombie?'zombie':'survivor');return true;}catch{return false;}}
