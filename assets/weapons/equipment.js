export const GUNS={
 'light-pistol':{name:'Light Pistol',mag:15,damage:22,interval:.23,reload:1.1,range:510,rifle:false,description:'Compact steel slide · teal grip · quick follow-up shots'},
 'heavy-pistol':{name:'Heavy Pistol',mag:8,damage:38,interval:.38,reload:1.4,range:550,rifle:false,description:'Long silver slide · walnut grip · stronger impact'},
 'hand-cannon':{name:'Hand Cannon',mag:5,damage:65,interval:.65,reload:1.9,range:470,rifle:false,description:'Large revolver cylinder · short heavy barrel · slow, powerful shots'},
 'tactical-ar':{name:'Tactical AR',mag:30,damage:19,interval:.105,reload:1.6,range:670,rifle:true,description:'Teal furniture · optic and foregrip · fast automatic fire'},
 'heavy-ar':{name:'Heavy AR',mag:20,damage:31,interval:.18,reload:1.9,range:710,rifle:true,description:'Sand receiver · black magazine · slower, heavier automatic fire'},
 // A pump gun: each shot throws a spread of pellets, it racks between shots, and it loads one shell at a time (reload is per shell).
 'pump-shotgun':{name:'Pump Shotgun',mag:8,damage:13,interval:.82,reload:.48,range:300,rifle:true,shells:true,pellets:7,spread:.2,description:'Walnut stock and pump · 8-shell tube · a wide spread up close'}
};
// Pistols are secondaries: they still reload, but their spare rounds never run out. Shotguns and rifles are primaries and use
// ammo you carry in your bag.
export const slotOf=id=>GUNS[id]?.rifle===false?'secondary':'primary';
export const unlimited=id=>slotOf(id)==='secondary';
// In the Training Grounds every gun is its paintball twin: same handling, its own paint color.
export const PAINT={'light-pistol':'#e0457b','heavy-pistol':'#f08a24','hand-cannon':'#e8d43a','tactical-ar':'#4fc76a','heavy-ar':'#3f8fe0','pump-shotgun':'#a46ad8'};
export const GRENADES={smoke:{name:'Smoke Grenade',color:'#59818a',description:'Blue canister · lingering smoke screen',duration:6,radius:78},incendiary:{name:'Incendiary Grenade',color:'#bc582b',description:'Orange canister · burning ground',duration:4,radius:54},explosive:{name:'Explosive Grenade',color:'#7d8050',description:'Olive body · yellow band · immediate blast',duration:.55,radius:85}};
export const LOADOUT_KEY='deadlight-character-room-equipment-v1';
export function normalizeLoadout(v){return {gun:v?.gun==='none'||Object.hasOwn(GUNS,v?.gun)?v.gun:'light-pistol',grenade:Object.hasOwn(GRENADES,v?.grenade)?v.grenade:'smoke'};}
export function readLoadout(storage){try{return normalizeLoadout(JSON.parse(storage.getItem(LOADOUT_KEY)));}catch{return normalizeLoadout();}}
export function saveLoadout(storage,v){try{storage.setItem(LOADOUT_KEY,JSON.stringify(normalizeLoadout(v)));return true;}catch{return false;}}
// Author-sized half-pixel silhouettes translated from the approved design sheets.
export function gunArt(g,id,paint){gunShape(g,id);if(paint&&GUNS[id])paintKit(g,id,paint);}
function gunShape(g,id){const{p,r}=g,ink='#10151c',steel='#535c65',hi='#a1a7aa';if(!GUNS[id])return;
 if(id==='pump-shotgun'){shotgun(g,ink,steel,hi);return;}
 if(!GUNS[id].rifle){const heavy=id==='heavy-pistol',rev=id==='hand-cannon',len=heavy?15:rev?13:11;
 p([[-3,-3],[len,-3],[len+1,-1],[len+1,2],[4,2],[2,8],[-3,8],[-1,2],[-4,1]],ink);
 r(-2,-2,len+2,3,heavy?'#88858b':steel);r(-1,-2,len, .5,hi);r(len,-1,1.5,2,'#282e36');
 p([[-1,2],[3,2],[1,7],[-2,7]],heavy||rev?'#80503b':'#38646d');r(-1,3,1,3,heavy?'#a77050':'#60818a');r(0,6,.5,.5,'#c6a06a');
 r(3,2,4,3,ink);r(4,2,2,2,'#56606a');r(4,2,2,1,'#202933');r(len-2,-3.5,1.5,1,ink);
 if(rev){r(-3,-2,7,5,ink);r(-2,-2,5,4,'#687580');r(-1,-1,3,1,hi);r(-1,1,3,1,'#27313c');p([[-4,-3],[-2,-2],[-3,-1],[-5,-2]],hi);r(4,1,8,1,'#38434e');}
 else{for(let x=-1;x<3;x++)r(x,-1.5,.5,2,'#303640');r(5,-2,3,1,heavy?'#43454e':'#899aa2');if(heavy)r(-2,7,3,.5,'#856078');}return;
 }
 const heavy=id==='heavy-ar',body=heavy?'#ac8b60':'#344a54',edge=heavy?'#d0b18a':'#739298';
 p([[-12,-4],[-5,-4],[-5,-2],[1,-2],[1,-4],[19,-4],[20,-2],[27,-2],[27,1],[19,1],[18,3],[9,3],[10,10],[4,11],[2,4],[-1,3],[-3,8],[-6,7],[-4,2],[-10,2],[-12,5]],ink);
 p([[-11,-3],[-6,-3],[-6,-1],[-2,-1],[-2,1],[-9,1],[-11,3]],body);r(-10,-3,4,.5,edge);
 r(-2,-3,20,5,body);r(-1,-3,18,.5,edge);r(0,-1,5,1,'#1f2830');r(4,0,2,.5,hi);r(19,-1,6,1,'#67727a');r(25,-2,2,3,'#343d46');r(26,-1,.5,1,ink);
 p([[3,3],[7,3],[8,9],[4,10]],'#646971');r(4,4,1,5,'#99998d');r(6,4,.5,4,'#252c34');p([[-3,2],[-1,3],[-3,7],[-5,6]],heavy?'#34363d':'#4d7176');
 r(1,-6,5,3,ink);r(2,-5,3,1.5,'#626970');r(4,-5,.5,1,heavy?'#d3a148':'#81c2c2');
 for(let x=8;x<18;x+=3)r(x,-2,2,1,ink);r(17,-5,1,2,ink);
 if(!heavy){r(12,2,2,5,ink);r(12.5,3,1,3,'#64828a');}else r(14,0,3,2,'#30343b');
}
// The pump shotgun: walnut stock to the wrist, a short steel receiver over the trigger guard, the long barrel with the
// magazine tube under it, and the ribbed walnut pump the support hand rides on. A brass bead at the muzzle.
function shotgun(g,ink,steel,hi){const{p,r}=g,wood='#6b3f27',woodHi='#8f5a37',woodLo='#4a2a1a';
 p([[-14.5,-3.5],[-1,-3.5],[30.5,-3.5],[30.5,0],[25.5,0],[25.5,1],[19.5,1],[19.5,2.5],[10.5,2.5],[10.5,1],[7,1],[6,4.5],[1.5,4.5],[.5,2.5],[-3,3],[-7,2.5],[-14.5,6]],ink);
 // Stock: the butt is tall and the comb slopes down to the wrist behind the trigger.
 p([[-14,-2.5],[-3,-2.5],[-.5,-1.5],[-.5,2],[-3,2.5],[-7,1.8],[-14,5.2]],wood);r(-13.5,-2.5,10,.5,woodHi);r(-14,-2.5,1.2,7.5,'#2a1a12');r(-9,0,5,.5,woodLo);
 // Receiver and trigger guard.
 r(-.5,-3,8,4,'#3b4148');r(0,-3,7,.5,hi);r(2.5,-2.2,3,1,'#1d2228');p([[1.5,1],[6,1],[5.5,4],[2,4]],ink);r(2.5,1.5,2.5,2,'#2a3038');r(3.2,1.5,.6,1.6,'#8a8f94');
 // Barrel over the tube, then the pump.
 r(7.5,-3,23,1.6,steel);r(7.5,-3,23,.5,hi);r(7.5,-1.4,18,1.4,'#3f464d');r(25,-1.4,.5,1.4,'#262c33');r(30,-3,.5,1.6,'#262c33');r(29.5,-3.8,1,.8,'#c6a06a');
 r(11,-1.3,8.5,3.3,wood);r(11,-1.3,8.5,.5,woodHi);for(let x=12;x<19;x+=1.5)r(x,-.3,.5,2,woodLo);}
// The paintball twin: a hopper of paint balls on top and a painted muzzle, so you can tell at a glance it is not the real thing.
function paintKit(g,id,paint){const{p,r}=g,ink='#10151c',rifle=GUNS[id].rifle,x0=rifle?7:1,w=rifle?9:6,t=rifle?-4:-3,hh=rifle?6:4.5;
 p([[x0,t],[x0+w,t],[x0+w+1,t-hh+1.5],[x0+w-1,t-hh],[x0+1,t-hh],[x0-1,t-hh+1.5]],ink);r(x0+.5,t-hh+1,w-.5,hh-1.5,'#2c3138');r(x0+1.5,t-hh+1.5,w-2.5,hh-3,paint);r(x0+1.5,t-hh+1.5,1,.5,'#f4efe2');r(x0+w-2.5,t-1.5,1,.5,'#00000055');
 const tip=id==='pump-shotgun'?30.5:rifle?25:id==='heavy-pistol'?14.5:id==='hand-cannon'?12.5:10.5;r(tip,-1.5,2,2.5,ink);r(tip+.5,-1,1.5,1.5,paint);}
export function grenadeArt(g,id){const{p,r}=g;const col=GRENADES[id]?.color||'#7d8050';p([[-2,-7],[2,-7],[2,-5],[4,-3],[4,4],[2,6],[-2,6],[-4,4],[-4,-3],[-2,-5]],'#141a20');r(-1,-6,3,2,'#737a7b');p([[-2,-4],[2,-4],[3,-2],[3,4],[1,5],[-2,4],[-3,2],[-3,-2]],col);r(-2,-2,1,6,id==='explosive'?'#aaa473':'#96a1a0');r(-3,0,6,2,id==='smoke'?'#ddd2ad':id==='incendiary'?'#e4823c':'#d0ac43');r(3,-5,1,8,'#4b5157');r(2,-6,3,.5,'#b3ada0');r(4,-5,.5,2,'#b3ada0');if(id==='explosive'){r(-3,3,6,.5,'#343c27');r(0,-3,.5,8,'#44482c');}else r(0,0,1,2,'#e7d8b5');}
// Aiming at any angle (v0.29). The body takes the nearest of the eight facings and the gun turns to the exact angle, worked out in
// that facing's local space: local coordinates always face right, so mirrored facings see the angle reflected. Past straight up or
// down the gun flips over, so it is never held upside down. Aiming toward or away from the camera foreshortens it a little.
export const facingOf=angle=>((Math.round(angle/(Math.PI/4))%8)+8)%8;
export function aimPose(angle){const d=facingOf(angle),side=d===0||d===4,back=d>=5,quarter=d%2===1,mirror=d===3||d===4||d===5;
 const a=mirror?Math.PI-angle:angle,c=Math.cos(a),n=Math.sin(a),flip=c<-1e-6?-1:1,L=1-.35*n*n,ax=6*c+4*Math.max(0,-n),ay=-36-3*n*n;
 // A true rotation (not a shear) keeps every gun's silhouette intact at each angle. Grip is gun-local (0,0).
 return {d,side,back,quarter,mirror,flip,point:([u,v])=>[ax+u*L*c-v*flip*n,ay+u*L*n+v*flip*c]};}
// Where each hand closes on the gun: the trigger grip, and the fore-end for rifles (pistols use a cupped support hand).
function gunHands(P,id){const grip=P.point([0,3]);return {grip,support:id==='pump-shotgun'?P.point([15,2.5]):GUNS[id]?.rifle?P.point([12,3]):[grip[0]-1.5*P.flip,grip[1]+1]};}
const MUZZLE={'light-pistol':12.5,'heavy-pistol':16.5,'hand-cannon':14.5,'tactical-ar':27,'heavy-ar':27,'pump-shotgun':30.5};
// The end of the barrel on screen, relative to the feet, so shots leave the gun you see.
export function muzzle(angle,id){const P=aimPose(angle),[x,y]=P.point([MUZZLE[id]??12,-.25]);return {x:P.mirror?-x:x,y};}
function hand(g,[x,y],near){g.p([[x-2.5,y-1.5],[x+2.5,y-1.5],[x+2.5,y+2.5],[x-1,y+3.5],[x-3.5,y+1.5]],'#111319');g.p([[x-2,y-1],[x+2,y-1],[x+2,y+2],[x-1,y+3],[x-3,y+1]],near?'#d99b73':'#ae7356');g.r(x-1,y-.5,2,1.5,near?'#ecb18a':'#d99b73');}
export function heldGun(g,id,angle,paint){if(!GUNS[id])return;const P=aimPose(angle),{point}=P;
 const projected={p:(pts,col)=>g.p(pts.map(point),col),r:(x,y,w,h,col)=>g.p([[x,y],[x+w,y],[x+w,y+h],[x,y+h]].map(point),col)};
 gunArt(projected,id,paint);
 // Hands close around the trigger and the fore-end, over the gun.
 if(P.back&&!P.quarter)return;const h=gunHands(P,id);hand(g,h.support,false);hand(g,h.grip,true);
}
// Two-bone arm: upper sleeve, bent elbow and forearm with the same thickness and shading as the walking arms.
// sleeve: 0 jacket, 1 short (bare forearm), 2 long, 3 ribbed cuff, 4 shirt cuff, 5 bare arm, 6 fatigue, 7 SWAT padded.
function limb(g,s,e,h,near,sleeve){const short=sleeve===1||sleeve===true,bare=sleeve===5;const seg=(a,b,wa,wb,col)=>{const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l;g.p([[a[0]+nx*wa,a[1]+ny*wa],[b[0]+nx*wb,b[1]+ny*wb],[b[0]-nx*wb,b[1]-ny*wb],[a[0]-nx*wa,a[1]-ny*wa]],col);};
 const joint=([x,y],w,col)=>g.p([[x-w*.5,y-w],[x+w*.5,y-w],[x+w,y-w*.5],[x+w,y+w*.5],[x+w*.5,y+w],[x-w*.5,y+w],[x-w,y+w*.5],[x-w,y-w*.5]],col);
 const ink='#111319',skin=near?'#d99b73':'#ae7356',cloth=bare?skin:near?'#29465a':'#1b3040',hi=bare?(near?'#ecb18a':'#d99b73'):near?'#3d5c72':'#304f64',light=bare?hi:near?'#47677c':'#3d5c72';
 joint(s,4,ink);seg(s,e,4,3.5,ink);joint(e,3.5,ink);seg(e,h,3.5,2.5,ink);
 joint(s,3,cloth);seg(s,e,3,2.5,cloth);joint(e,2.5,short?skin:cloth);seg(e,h,2.5,1.5,short?skin:cloth);
 seg(s,e,1.5,1,hi);if(!short)seg(e,h,1,.5,hi);g.r(s[0]-1.5,s[1]-1.5,2,2,light);
 if(short){const m=[s[0]+(e[0]-s[0])*.75,s[1]+(e[1]-s[1])*.75];seg(m,[m[0]+(e[0]-s[0])*.08,m[1]+(e[1]-s[1])*.08],3,3,'#172731');}
 // Cuffs sit just above the hand.
 if(sleeve===3||sleeve===4){const m=[e[0]+(h[0]-e[0])*.72,e[1]+(h[1]-e[1])*.72];seg(m,[m[0]+(h[0]-e[0])*.14,m[1]+(h[1]-e[1])*.14],2.5,2.2,sleeve===3?'#172731':(near?'#47677c':'#3d5c72'));}
 // SWAT armor: padded shoulder and elbow. Fatigues: a camouflage blotch on the upper sleeve.
 if(sleeve===7){joint(s,3.8,ink);joint(s,3.2,'#26272b');g.r(s[0]-1.5,s[1]-2,2.5,1,'#3a3b41');joint(e,3,ink);joint(e,2.4,'#26272b');}
 if(sleeve===6){const m=[s[0]+(e[0]-s[0])*.45,s[1]+(e[1]-s[1])*.45];joint(m,1.2,near?'#172731':'#1b3040');}
}
function elbow(s,h,out,lu=9,lf=9){const dx=h[0]-s[0],dy=h[1]-s[1],d=Math.min(Math.hypot(dx,dy)||1,lu+lf-.5),ux=dx/(Math.hypot(dx,dy)||1),uy=dy/(Math.hypot(dx,dy)||1),a=(lu*lu-lf*lf+d*d)/(2*d),k=Math.sqrt(Math.max(0,lu*lu-a*a)),px=s[0]+ux*a,py=s[1]+uy*a;
 const c1=[px-uy*k,py+ux*k],c2=[px+uy*k,py-ux*k];return out(c1)>=out(c2)?c1:c2;}
// shoulderX scales shoulder spread for narrower bodies.
export function weaponArms(g,id,angle,sleeve=0,shoulderX=x=>x){if(!GUNS[id])return;const P=aimPose(angle),{side,back,quarter}=P,h=gunHands(P,id);
 // Far arm (support hand) first, then near arm (trigger hand); elbows bend outward and down, never across the chest.
 // Front diagonals put the near (right) shoulder on screen-left, matching the walking arms and legs.
 const fq=quarter&&!back,far=side?[-1,-46]:[shoulderX(back&&quarter?-12:fq?9:-10),-46],near=side?[1,-45]:[shoulderX(fq?-9:quarter?9:10),-45];
 const outward=(cx)=>p=>side?p[1]-Math.abs(p[0]-cx)*.2:Math.abs(p[0])+p[1]*.35;
 limb(g,far,elbow(far,h.support,outward(far[0])),h.support,false,sleeve);
 limb(g,near,elbow(near,h.grip,outward(near[0])),h.grip,true,sleeve);
}
