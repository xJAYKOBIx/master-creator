// Backpacks: what each one holds. The grid is the inventory's slots (columns × rows) and kg the weight it carries well; past
// that you can still move, just slower and with stamina draining faster. pack is the survivor look's pack choice that draws it.
// Equipped guns (one primary, one secondary) ride on you and take no bag space.
export const BAGS={
 small:{name:'Canvas daypack',size:'Small',pack:2,cols:5,rows:4,kg:12,description:'Soft canvas · zip top and a front pocket · light and quiet'},
 medium:{name:'Leather pack',size:'Medium',pack:0,cols:6,rows:6,kg:20,description:'Worn leather · two buckled straps · room for a proper haul'},
 large:{name:'Frame pack',size:'Large',pack:3,cols:8,rows:7,kg:32,description:'Metal frame · lid and side pockets · a red wool bedroll strapped under'}};
export const BAG_IDS=Object.keys(BAGS);
// With no pack (look.pack 1) you still have your pockets.
export const POCKETS={name:'Pockets',size:'None',pack:1,cols:3,rows:2,kg:6,description:'Jacket and trouser pockets'};
// What a survivor look carries: its bag, or pockets with no pack.
export const carrying=look=>BAGS[bagOf(look)]||POCKETS;
// How many cells an item takes in the grid, as columns × rows. A spare shotgun or rifle is six cells long, so it fits the leather and frame
// packs but not the daypack: the small pack holds ammo, materials and a spare pistol, never a spare long gun.
export const ITEM_SHAPES={shotgun:[6,1],rifle:[6,2],pistol:[2,1],ammo:[1,1],material:[1,1],armor:[2,2]};
// Each item's own shape is in gear/items.js.
export const slots=id=>BAGS[id]?BAGS[id].cols*BAGS[id].rows:0;
// The bag a survivor look is wearing, or null for no pack.
export const bagOf=look=>BAG_IDS.find(id=>BAGS[id].pack===(look?.pack|0))||null;
