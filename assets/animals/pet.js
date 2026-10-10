// Companion art: dogs and cats built from a small posed skeleton, seen from the same angled top-down camera as the camp.
// Every part is a sphere, a limb or a flat shape in the animal's own space (f forward, s to its right, u up),
// projected for each of the eight facings and painted back to front with the character ink outline.
import {painter} from '../core/paint.js';
import {COATS,EYES,COLLARS} from './look.js';
export const PET_FRAME={w:160,h:160,displayW:80,displayH:80,footX:40,footY:58};
// Frames: 0-3 idle (breathing, tail wag), 4-9 walk, 10-15 run, 16-17 sit, 18 lie down, 19-20 sniff (nose to the floor or the bowl),
// 21-22 stretch (a dog's play bow, a cat's long reach forward). New poses are only ever added at the end.
export const PET_ANIM={idle:[0,1,2,3],walk:[4,5,6,7,8,9],run:[10,11,12,13,14,15],sit:[16,17],lie:[18],sniff:[19,20],stretch:[21,22]};
export const PET_FRAME_COUNT=23;
export function petPose(frame){for(const [kind,list] of Object.entries(PET_ANIM)){const i=list.indexOf(frame);if(i>=0)return {kind,t:i/list.length};}return {kind:'idle',t:0};}
const INK='#111319',WHITE=['#8f8b82','#c2beb2','#e6e2d6','#f8f6ee'],BLACK=COATS[0].ramp,NOSE='#1c1a1e',PINK='#d98a8e',TONGUE='#d4606a';
// Ground depth is foreshortened so a dog facing the camera reads as a dog, not a long rug.
const K=.55;
// Body plans. S shoulder height, L half body length, rc/rh chest and hip radius, w body half width,
// rH head radius, sn snout length, leg leg width, tail style and ear style.
const PLANS=[[
 {S:23,L:11.5,rc:8.4,rh:7.2,w:4.4,rH:5.6,sn:5.6,snR:.52,leg:3.9,ears:'prick',earH:6.5,tail:'brush',tailL:15,tailR:2.4,fluff:0,scale:1.08},
 {S:22,L:11.5,rc:9,rh:8.2,w:4.8,rH:6,sn:4.8,snR:.62,leg:4.1,ears:'drop',earH:5,tail:'otter',tailL:13,tailR:2.4,fluff:0,scale:1.08},
 {S:14.5,L:8,rc:6.2,rh:5.6,w:3.4,rH:5.2,sn:3.2,snR:.7,leg:3.2,ears:'fold',earH:3.4,tail:'stub',tailL:6,tailR:1.7,fluff:.4,scale:1.12},
 {S:22,L:11.5,rc:8.8,rh:7.4,w:4.6,rH:5.8,sn:4.8,snR:.58,leg:4,ears:'prick',earH:5,tail:'curl',tailL:14,tailR:2.7,fluff:.8,scale:1.08}
],[
 {S:12,L:7.5,rc:5,rh:5,w:2.8,rH:5,sn:.6,snR:.7,leg:2.5,ears:'cat',earH:3.8,tail:'cat',tailL:15,tailR:1.25,fluff:0,scale:1.3},
 {S:12.5,L:7.5,rc:5.8,rh:5.6,w:3.2,rH:5.4,sn:.5,snR:.7,leg:2.6,ears:'cat',earH:3.6,tail:'plume',tailL:14,tailR:2.2,fluff:1,scale:1.3}
]];
// Convex hull of projected points, for ears seen from any side.
function hull(pts){pts=[...pts].sort((a,b)=>a.x-b.x||a.y-b.y);const cross=(o,a,b)=>(a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x),lo=[],hi=[];
 for(const p of pts){while(lo.length>1&&cross(lo.at(-2),lo.at(-1),p)<=0)lo.pop();lo.push(p);}for(const p of pts.reverse()){while(hi.length>1&&cross(hi.at(-2),hi.at(-1),p)<=0)hi.pop();hi.push(p);}return lo.slice(0,-1).concat(hi.slice(0,-1));}
export const petPlan=look=>PLANS[look.species?1:0][look.breed]||PLANS[0][0];
const mix=(a,b,t)=>{const h=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16)),A=h(a),B=h(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('');};
// The skeleton for one pose: joint positions in animal space.
function skeleton(P,pose,cat){const {kind,t}=pose,TAU=Math.PI*2;
 let hipF=-P.L,chestF=P.L,cU=P.S-P.rc*.85,hU=P.S*.94-P.rh*.85,headF=P.L+P.rc*.55,headU=P.S+P.rH*.75,bob=0,headDip=0,wag=Math.sin(t*TAU)*.6,tailLift=0,legs;
 const reach=P.L*.84,hind=-P.L*.78,lw=P.w;
 const leg=(front,side,dF,lift)=>({front,side,jf:(front?reach:hind),ju:front?cU-P.rc*.2:hU,pf:(front?reach:hind)+dF,pu:lift,s:side*lw});
 if(kind==='walk'||kind==='run'){const run=kind==='run',A=run?P.L*.55:P.L*.32,lift=run?3.4:1.8,ph=run?[0,.12,.55,.67]:[0,.5,.25,.75];
  // Front left, front right, hind left, hind right. A walk is a four-beat gait; a run is a bounding gallop.
  const sw=(p)=>{const a=(t+p)*TAU;return [A*Math.sin(a),Math.max(0,Math.cos(a))*lift];};
  legs=[[1,-1,ph[0]],[1,1,ph[1]],[0,-1,ph[2]],[0,1,ph[3]]].map(([f,s,p])=>{const [dF,l]=sw(p);return leg(f,s,dF,l);});
  bob=run?1.2*Math.sin(t*TAU*2):.35*Math.sin(t*TAU*2);if(run){cU+=1.2*Math.sin(t*TAU);hU+=1.2*Math.sin(t*TAU+Math.PI);headU-=1;headF+=1;}
  wag=Math.sin(t*TAU*2)*(run?.3:.5);tailLift=run?-.4:0;}
 else if(kind==='sit'){hipF=-P.L*.55;hU=P.rh*.95;cU=P.S-P.rc*.55+1;headU=P.S+P.rH*1.15+1;headF=P.L*.85+P.rc*.4;chestF=P.L*.8;
  legs=[leg(1,-1,0,0),leg(1,1,0,0)].map(l=>({...l,jf:chestF*.85,pf:chestF*.85+.5}));legs.push({sit:true,side:-1},{sit:true,side:1});wag=t<.5?-.5:.5;tailLift=-1;}
 else if(kind==='lie'){cU=P.rc*.95;hU=P.rh*.9;headU=P.rc*2+P.rH*.6;headF=P.L+P.rc*.35;
  legs=[{lie:true,front:1,side:-1},{lie:true,front:1,side:1},{sit:true,side:-1},{sit:true,side:1}];wag=.2;tailLift=-1;}
 else if(kind==='sniff'){// Standing, head down and forward, nose working.
  legs=[leg(1,-1,.8,0),leg(1,1,1.4,0),leg(0,-1,0,0),leg(0,1,0,0)];cU-=.6;headF=P.L+P.rc*.95;headU=P.rH*1.35+1+Math.sin(t*TAU)*.5;wag=Math.sin(t*TAU)*.35;}
 else if(kind==='stretch'){// Chest down and front legs out, hips up, then leaning back into it.
  const k=t<.5?0:1;cU=P.rc*.95+.8+k*.6;chestF=P.L*1.05-k*.6;hU=P.S*1.02;hipF=-P.L-k*.8;headU=P.rc*1.7+P.rH*.85;headF=P.L+P.rc*.75+1-k*.5;
  legs=[{lie:true,front:1,side:-1},{lie:true,front:1,side:1},leg(0,-1,0,0),leg(0,1,0,0)];wag=k?.6:-.6;tailLift=.7;}
 else{legs=[leg(1,-1,0,0),leg(1,1,0,0),leg(0,-1,0,0),leg(0,1,0,0)];bob=Math.sin(t*Math.PI*2)*.25;wag=Math.sin(t*TAU)*.7;}
 if(cat&&kind!=='run')tailLift+=.3;
 return {hipF,chestF,cU:cU+bob,hU:hU+bob,headF,headU:headU+bob+headDip,legs,wag,tailLift,kind};}
// Tail shapes: a list of points from the root, in animal space, before the wag.
function tailPath(P,sk){const n=8,L=P.tailL,out=[],up=sk.tailLift;
 for(let i=0;i<=n;i++){const k=i/n;let f,u;
  if(P.tail==='brush'){f=-k*L*.85;u=-k*L*.55+Math.sin(k*Math.PI)*2+k*k*3+up*k*4;}
  else if(P.tail==='otter'){f=-k*L*.9;u=-k*L*.3+k*2+up*k*4;}
  else if(P.tail==='stub'){f=-k*L*.4;u=k*L*.9;}
  else if(P.tail==='curl'){const a=k*Math.PI*1.25;f=-Math.sin(a)*L*.42-k*2;u=(1-Math.cos(a))*L*.42;}
  else{f=-k*L*.55;u=-k*L*.15+Math.sin(k*Math.PI*.9)*L*.55*(1+up*.6)+(sk.kind==='sit'||sk.kind==='lie'?-k*L*.5:0);}
  out.push([f,u,k]);}
 return out;}
export function pet(c,direction=2,frame=0,look={}){
 const dir=((direction%8)+8)%8,a=dir*Math.PI/4,ca=Math.cos(a),sa=Math.sin(a),cat=look.species===1,P=petPlan(look),pose=petPose(frame),sk=skeleton(P,pose,cat);
 const coat=(COATS[look.coat]||COATS[2]).ramp,eye=(EYES[look.eyes]||EYES[0]).col,collar=COLLARS[look.collar]||COLLARS[0];
 const marking=[['solid','chest','saddle','patches','mask'],['solid','tabby','chest','tuxedo','patches']][cat?1:0][look.marking]||'solid';
 // Saddles and masks have their own colors whatever the coat: a black back and a pale face.
 const dark=look.coat===0?COATS[5].ramp:BLACK,pale=look.coat===6?WHITE:WHITE;
 // Animal space to the frame: screen x, screen y, and depth toward the camera.
 const Z=P.scale||1,V=(f,s,u)=>{const gx=(f*ca-s*sa)*Z,gy=(f*sa+s*ca)*Z;return {x:gx,y:gy*K-u*Z,d:gy};};
 // Which way a surface faces, so markings and eyes on the far side stay hidden.
 const facing=(nf,ns,nu)=>(nf*sa+ns*ca)+nu*K;
 c.save();c.translate(PET_FRAME.footX,PET_FRAME.footY);const g=painter(c);g.e=fastEllipse(c);
 // Contact shadow under the body.
 const sh=[];for(let i=0;i<20;i++){const q=i/20*Math.PI*2,pt=V(Math.cos(q)*(P.L+P.rc*.6),Math.sin(q)*(P.w+3),0);sh.push([pt.x,pt.y]);}g.p(sh,'#11152238');
 const groups=[];
 // A group is drawn as one piece: every shape's outline first, then the fills, so parts inside it join without seams.
 const group=(depth,shapes)=>groups.push({depth,shapes});
 const ball=(p,r,col,opt={})=>({k:'c',x:p.x,y:p.y,r:r*Z,col,...opt}),limb=(a,b,w,col,opt={})=>({k:'l',a,b,w:w*Z,col,...opt}),poly=(pts,col,opt={})=>({k:'p',pts:pts.map(q=>[q.x,q.y]),col,...opt});
 // Body: a chain of spheres from the hips to the chest, shaded low, base, then a band of light along the back.
 const body=[],n=6,chest=V(sk.chestF,0,sk.cU),hip=V(sk.hipF,0,sk.hU);
 // A deep chest and a tucked waist: the middle of the chain is slimmer and sits a little higher, so the underline rises toward the hips.
 const bodyAt=k=>{const w=Math.sin(Math.PI*k)**2*(cat?.1:.22),r=(P.rh+(P.rc-P.rh)*k*k+P.fluff*.6)*(1-w);const front=sk.chestF-P.rc*.3;return {f:sk.hipF+(front-sk.hipF)*k,u:sk.hU+(sk.cU-sk.hU)*k+r*w*1.1,r};};
 for(const pass of [0,1,2])for(let i=0;i<=n;i++){const b=bodyAt(i/n),p=V(b.f,0,b.u);
  if(pass===0)body.push(ball(p,b.r,coat[1],{sil:1}));else if(pass===1)body.push(ball({x:p.x,y:p.y-.5},b.r-.8,coat[2]));else body.push(ball({x:p.x,y:p.y-b.r*.5},b.r*.45,coat[3]));}
 // Markings on the body.
 const bodyMark=[];
 if(marking==='saddle')for(let i=1;i<n;i++){const b=bodyAt(i/n),p=V(b.f,0,b.u+b.r*.35);bodyMark.push(ball(p,b.r*.72,dark[1]),ball({x:p.x,y:p.y-b.r*.3},b.r*.35,dark[2]));}
 if(marking==='tabby'){for(let i=1;i<n;i++){const b=bodyAt(i/n);for(const s of [-1,1]){if(facing(0,s*.6,.8)<0)continue;const a1=V(b.f,s*b.r*.15,b.u+b.r*.95),a2=V(b.f-.6,s*b.r*.8,b.u+b.r*.4);bodyMark.push(limb(a1,a2,.9,coat[0]));}}}
 if(marking==='patches'){for(const [k,s,du,r] of [[.3,.7,.5,.5],[.75,-.6,.6,.45],[.55,.1,.95,.4]]){if(facing(0,s,du)<-.1)continue;const b=bodyAt(k),p=V(b.f,s*b.r*.8,b.u+du*b.r*.6);bodyMark.push(ball(p,b.r*r,cat?coat[0]:pale[2]));}}
 const belly=marking==='mask'||marking==='tuxedo'||marking==='chest';
 if(belly&&facing(.7,0,-.3)>-.3){const b=bodyAt(1),p=V(b.f+b.r*.45,0,b.u-b.r*.25);bodyMark.push(ball(p,b.r*.62,pale[2]),ball({x:p.x,y:p.y-.6},b.r*.4,pale[3]));}
 if(marking==='mask'||marking==='tuxedo')for(let i=1;i<n;i++){const b=bodyAt(i/n),p=V(b.f,0,b.u-b.r*.7);if(facing(0,0,-1)>-.6)bodyMark.push(ball(p,b.r*.45,pale[2]));}
 // Neck and collar.
 const head=V(sk.headF,0,sk.headU),neckA=V(sk.chestF+P.rc*.1,0,sk.cU+P.rc*.3),neckB=V(sk.headF-P.rH*.4,0,sk.headU-P.rH*.5);
 const neckR=P.rH*.72+P.fluff*.5,neck=[limb(neckA,neckB,neckR*2,coat[1],{sil:1}),limb({x:neckA.x,y:neckA.y-.5},{x:neckB.x,y:neckB.y-.5},neckR*2-1.6,coat[2])];
 if(P.fluff>.6)neck.push(ball({x:(neckA.x+neckB.x)/2,y:(neckA.y+neckB.y)/2+.5},neckR*1.15,coat[1],{sil:1}),ball({x:(neckA.x+neckB.x)/2,y:(neckA.y+neckB.y)/2},neckR,coat[2]));
 if(belly&&facing(.6,0,-.2)>-.2)neck.push(ball({x:(neckA.x*.4+neckB.x*.6),y:(neckA.y*.4+neckB.y*.6)+neckR*.35},neckR*.7,pale[2]));
 if(collar.col){const cf=sk.headF-P.rH*.85,cu=sk.headU-P.rH*.9,ring=[];for(let i=0;i<16;i++){const q=i/16*Math.PI*2;ring.push(V(cf,Math.cos(q)*(neckR+.5),cu+Math.sin(q)*(neckR+.5)));}
  const lo=mix(collar.col,'#000000',.35),pts=ring.map(q=>[q.x,q.y]);neck.push({k:'p',pts,col:lo,sil:1},{k:'p',pts:pts.map(([x,y])=>[x,y-.6]),col:collar.col});
  const front=V(cf+neckR*.6,0,cu-neckR*.75);if(facing(1,0,-.3)>0){if(collar.bandana){neck.push(poly([V(cf+neckR*.3,-neckR,cu-neckR*.2),V(cf+neckR*.3,neckR,cu-neckR*.2),V(cf+neckR*1.1,0,cu-neckR*1.9)],collar.col,{sil:1}),poly([V(cf+neckR*.4,-neckR*.5,cu-neckR*.45),V(cf+neckR*.4,neckR*.2,cu-neckR*.45),V(cf+neckR*.8,-.2,cu-neckR*1.2)],mix(collar.col,'#ffffff',.25)));}
   else neck.push(ball(front,.9,'#d9b24a'));}}
 // Legs. Far legs are a shade darker; each limb is its own group so the near legs draw over the body with an outline.
 const pawCol=(marking==='tuxedo'||(marking==='mask'&&!cat))?pale:null;
 // Thigh and shoulder masses join the body without a seam: far ones go under it, near ones over it.
 const farMass=[],nearMass=[];
 for(const L of sk.legs){const near=facing(0,L.side,0)>0,col=near?coat:[coat[0],coat[0],coat[1],coat[2]];const sh=[];
  if(L.sit){// A folded hind leg: the haunch with the paw tucked in front of it.
   const hf=sk.hipF+P.rh*.2,hs=L.side*(P.w*.8+P.rh*.2),hp=V(hf,hs,P.rh*.85),paw=V(hf+P.rh*1.25,L.side*(P.w*.9),.6),hr=P.rh*.64;
   sh.push(ball(hp,hr,col[1],{sil:1}),ball({x:hp.x,y:hp.y-.6},hr-.9,col[2]),limb(hp,paw,P.leg,col[1],{sil:1}),limb({x:hp.x,y:hp.y-.4},{x:paw.x,y:paw.y-.4},P.leg-1.3,col[2]));
   sh.push({k:'e',x:paw.x,y:paw.y,rx:P.leg*.75,ry:P.leg*.45,col:pawCol?pawCol[2]:col[2],sil:1});group(hp.d-.2,sh);continue;}
  if(L.lie){const j=V(sk.chestF*.7,L.side*P.w*.8,P.rc*.6),paw=V(sk.chestF+P.rc*.9+2,L.side*(P.w*.8),.6);
   sh.push(limb(j,paw,P.leg,col[1],{sil:1}),limb({x:j.x,y:j.y-.4},{x:paw.x,y:paw.y-.4},P.leg-1.2,col[2]),{k:'e',x:paw.x,y:paw.y,rx:P.leg*.8,ry:P.leg*.5,col:pawCol?pawCol[2]:col[2],sil:1});group(paw.d,sh);continue;}
  const j=V(L.jf,L.s,L.ju),p=V(L.pf,L.s,L.pu),front=L.front;
  const mp=front?V(L.jf+.3,L.s*1.05,L.ju-P.rc*.15):V(L.jf-.3,L.s+L.side*.8,L.ju-P.rh*.1),mr=front?P.rc*.42:P.rh*.62;
  (near?nearMass:farMass).push(ball(mp,mr,col[1],{sil:1}),ball({x:mp.x,y:mp.y-.5},mr-.3,col[2]));
  // Front legs run nearly straight; hind legs bend back at the hock.
  const knee=front?V(L.jf+(L.pf-L.jf)*.45-.6,L.s,L.ju*.45+L.pu*.55):V(L.jf+(L.pf-L.jf)*.4-2.2,L.s,L.ju*.4+L.pu*.6);
  const top=front?P.leg*1.25:P.leg*1.6;
  sh.push(limb(j,knee,top,col[1],{sil:1}),limb(knee,p,P.leg,col[1],{sil:1}),limb({x:j.x,y:j.y-.4},{x:knee.x,y:knee.y-.3},top-1.3,col[2]),limb(knee,{x:p.x,y:p.y-.4},P.leg-1.3,col[2]));
  if(pawCol)sh.push(limb({x:knee.x*.4+p.x*.6,y:knee.y*.4+p.y*.6},p,P.leg-1,pawCol[2]));
  sh.push({k:'e',x:p.x+ca*.6,y:p.y,rx:P.leg*.62,ry:P.leg*.42,col:pawCol?pawCol[2]:col[2],sil:1});group(p.d+(front?.01:0),sh);}
 // Tail, wagging side to side.
 // A curled tail also leans to one side, as a husky's does, so from behind it reads as a curl rather than a pole.
 const lean=P.tail==='curl'?P.tailL*.28:0,tp=tailPath(P,sk).map(([f,u,k])=>V(sk.hipF-P.rh*.6+f,sk.wag*k*k*P.tailL*.45+lean*Math.sin(k*Math.PI*.6),sk.hU+P.rh*.25+u)),tail=[];
 const tr=k=>P.tail==='brush'||P.tail==='plume'?P.tailR*(1+Math.sin(k*Math.PI)*.45)*(1-k*.3):P.tail==='curl'?P.tailR*(1.1-k*.2):P.tailR*(1-k*.55);
 const tk=i=>i/(tp.length-1);for(let i=1;i<tp.length;i++)tail.push(limb(tp[i-1],tp[i],tr(tk(i))*2,coat[1],{sil:1}));tail.push(ball(tp.at(-1),tr(1),coat[1],{sil:1}));
 // A saddle-backed dog has a dark stripe down the top of its tail, which also keeps the tail from reading as a leg from behind.
 const tailTop=marking==='saddle'?dark[1]:coat[2];for(let i=1;i<tp.length;i++)tail.push(limb({x:tp[i-1].x,y:tp[i-1].y-.4},{x:tp[i].x,y:tp[i].y-.4},Math.max(.6,tr(tk(i))*2-1.4),tailTop));
 if(marking==='tabby')tp.forEach((q,i)=>{if(i%3===2&&i<tp.length-1)tail.push(limb(tp[i],tp[i+1],tr(tk(i))*1.9,coat[0]));});
 if((marking==='mask'||marking==='tuxedo')&&P.tail!=='stub')tail.push(ball(tp.at(-1),tr(1)*.9,pale[2]));
 group(tp[2].d-.4,tail);
 // Head: skull, cheeks, snout, nose, eyes and ears, ordered by how they face the camera.
 const H=[],rH=P.rH+P.fluff*.3,sf=P.sn,hs=head;
 H.push(ball(hs,rH,coat[1],{sil:1}));if(P.fluff>.6)H.push(ball(V(sk.headF-.5,0,sk.headU-rH*.55),rH*.95,coat[1],{sil:1}));
 // Cats get round cheeks either side of a short muzzle, which is most of what makes the face read as a cat.
 const cheeks=cat?[-1,1].map(s=>V(sk.headF+rH*.28,s*rH*.42,sk.headU-rH*.3)):[];for(const q of cheeks)H.push(ball(q,rH*.52,coat[1],{sil:1}));
 H.push(ball({x:hs.x,y:hs.y-.5},rH-.8,coat[2]));for(const q of cheeks)H.push(ball({x:q.x,y:q.y-.5},rH*.52-.8,coat[2]));H.push(ball({x:hs.x,y:hs.y-rH*.45},rH*.45,coat[3]));
 const faceW=(marking==='mask')?pale:null;
 if(faceW&&facing(1,0,.1)>-.3){H.push(ball(V(sk.headF+rH*.45,-rH*.35,sk.headU-rH*.2),rH*.42,pale[2]),ball(V(sk.headF+rH*.45,rH*.35,sk.headU-rH*.2),rH*.42,pale[2]));
  for(const s of [-1,1])if(facing(.8,s*.4,.4)>0)H.push(ball(V(sk.headF+rH*.7,s*rH*.38,sk.headU+rH*.42),.75,pale[3]));}
 if(marking==='tabby'&&facing(.4,0,1)>0){const m=V(sk.headF+rH*.25,0,sk.headU+rH*.85);H.push(limb({x:m.x-1.2,y:m.y},{x:m.x-1.2,y:m.y-1.6},.6,coat[0]),limb({x:m.x,y:m.y+.2},{x:m.x,y:m.y-1.8},.6,coat[0]),limb({x:m.x+1.2,y:m.y},{x:m.x+1.2,y:m.y-1.6},.6,coat[0]));}
 // Snout: a tapered muzzle from a broad base at the stop to the nose, so it reads as a wedge from the side and a short, wide muzzle from the front.
 const f0=sk.headF+rH*(cat?.45:.35),u0=sk.headU-rH*(cat?.3:.3),r0=rH*(cat?.4:.52),f1=sk.headF+rH*(cat?.62:.55)+sf,u1=sk.headU-rH*(cat?.36:.4),r1=rH*P.snR*(cat?.43:.72);
 const muzzle=(marking==='chest'||marking==='tuxedo'||marking==='mask')?pale:coat,snout=[],chain=[];
 for(let i=0;i<5;i++){const t=i/4,r=r0+(r1-r0)*Math.pow(t,.8);chain.push({p:V(f0+(f1-f0)*t,0,u0+(u1-u0)*t),r,t});}
 for(const k of chain)snout.push(ball(k.p,k.r,muzzle[1],{sil:1}));
 for(const k of chain)snout.push(ball({x:k.p.x,y:k.p.y-.5},Math.max(.5,k.r-.8),muzzle[2]));
 if(!cat)for(const k of chain)if(k.t>.1&&k.t<.9)snout.push(ball({x:k.p.x,y:k.p.y-k.r*.5},k.r*.3,muzzle[3]));
 const noseP=V(f1+r1*.55,0,u1+r1*.35);
 const eyes=[];for(const s of [-1,1]){const nf=.78,ns=s*.5,nu=.28,vis=facing(nf,ns,nu);if(vis<.05)continue;const q=V(sk.headF+rH*nf*.95,rH*ns*.95,sk.headU+rH*nu*.8),big=cat?1.35:1.05;
  eyes.push({k:'e',x:q.x,y:q.y,rx:big*(.55+.45*Math.min(1,vis)),ry:big,col:INK},{k:'e',x:q.x,y:q.y,rx:big*.55*(.6+.4*Math.min(1,vis)),ry:big*.7,col:eye},{k:'c',x:q.x+.25,y:q.y-.4,r:.32,col:'#f2efe6'});}
 // Ears.
 const ears=[];for(const s of [-1,1]){const base=[sk.headF-rH*.2,s*rH*.55,sk.headU+rH*.7],vis=facing(.3,s*.8,.6);
  const at=(df,ds,du)=>V(base[0]+df,base[1]+ds,base[2]+du),earCol=coat;
  if(P.ears==='prick'||P.ears==='cat'){const h=P.earH,w=cat?1.9:2.1,tip=at(-.4,s*(cat?.9:.7),h);
   const ring=[];for(let i=0;i<10;i++){const q=i/10*Math.PI*2;ring.push(at(Math.cos(q)*w*1.05-.3,Math.sin(q)*w*.9,-.6));}const outer=hull([...ring,tip]);ears.push({side:s,d:tip.d,shapes:[poly(outer,earCol[1],{sil:1}),poly([at(.1,-w*.55,-.2),at(.1,w*.55,-.2),at(-.3,s*(cat?.7:.55),h*.75)],facing(1,0,.2)>.2?PINK:earCol[2])]});}
  else if(P.ears==='drop'){const top=at(-.1,s*.9,-.2),tip=at(-.3,s*(rH*.42+.6),-P.earH);ears.push({side:s,d:top.d+(vis>0?1:-1),shapes:[limb(top,tip,3.4,coat[0],{sil:1}),limb({x:top.x,y:top.y-.3},{x:tip.x,y:tip.y-.3},2.2,coat[1]),{k:'e',x:tip.x,y:tip.y,rx:1.7,ry:1.3,col:coat[1],sil:1}]});}
  else{const b0=at(0,-.9,-.3),b1=at(0,.9,-.3),tip=at(1.6,s*1.2,P.earH*.35);ears.push({side:s,d:tip.d,shapes:[poly([b0,b1,at(-.8,0,P.earH*.6),tip],coat[1],{sil:1}),poly([at(.1,-.5,0),at(.1,.5,0),at(.6,s*.6,P.earH*.4)],coat[0])]});}}
 // Whiskers and the tongue are tiny, but they say "cat" and "happy dog" from across the camp.
 const mouth=[];if(facing(1,0,0)>-.2){
  // The tongue hangs under the nose, so it goes down first.
  if(!cat&&(pose.kind==='run'||pose.kind==='idle'||pose.kind==='sit')){const tq=V(f1-r1*.6,0,u1-r1*1.05);mouth.push({k:'e',x:tq.x,y:tq.y,rx:.85,ry:1.15,col:TONGUE});}
  const nr=cat?.75:r1*.5+.35;mouth.push({k:'e',x:noseP.x,y:noseP.y,rx:nr,ry:nr*(cat?.7:.75),col:cat?PINK:NOSE});if(!cat)mouth.push({k:'c',x:noseP.x-.3,y:noseP.y-.35,r:.3,col:'#5a5660'});
  if(cat)for(const s of [-1,1]){const w0=V(f1,s*r1*.8,u1-r1*.2),w1=V(f1-.8,s*(r1+3.2),u1+.2);mouth.push(limb(w0,w1,.35,'#e8e4dacc'));}}
 // The line of the jaw, on the side you can see.
 const vs=facing(0,1,0);if(!cat&&Math.abs(vs)>.45){const s=Math.sign(vs),a=V(f1-r1*.2,s*r1*.55,u1-r1*.55),b=V(f0+r0*.25,s*r0*.5,u0-r0*.7);mouth.push(limb(a,b,.5,muzzle[0]));}
 // Head order: far ear, skull, eyes, snout, near ear (or the reverse from behind).
 const headShapes=[...H],headFront=facing(1,0,0)>0;
 const farEars=ears.filter(e=>e.d<hs.d),nearEars=ears.filter(e=>e.d>=hs.d);
 const headGroup=[];for(const e of farEars)group(hs.d-.01,e.shapes);
 group(headFront?hs.d+.5:Math.max(hs.d-.5,neckA.d*.6-.15),headFront?[...headShapes,...snout,...eyes,...mouth]:[...snout,...mouth,...headShapes,...eyes]);
 for(const e of nearEars)group(headFront?hs.d+.6:Math.max(hs.d-.4,neckA.d*.6-.1),e.shapes);
 const neckDepth=neckA.d*.6+(headFront?.2:-.2);group(0,[...farMass,...body,...nearMass,...bodyMark]);group(neckDepth,neck);
 groups.sort((a,b)=>a.depth-b.depth);for(const G of groups)for(const sh of G.shapes)if(sh.k==='e'){sh.rx*=Z;sh.ry*=Z;}
 for(const G of groups){
  for(const s of G.shapes)if(s.sil){if(s.k==='p'){for(const [ox,oy] of [[-1,0],[1,0],[0,-1],[0,1],[-.5,-.5],[.5,-.5],[-.5,.5],[.5,.5]])draw(g,s,INK,ox,oy);}else draw(g,s,INK,0,0,1);}
  for(const s of G.shapes)draw(g,s,s.col,0,0,false);}
 c.restore();}
// Ellipses are filled row by row on the half-unit grid; much quicker than the general polygon fill, with the same pixels.
const snap=v=>Math.round(v*2)/2;
function fastEllipse(c){return (cx,cy,rx,ry,col)=>{if(rx<=0||ry<=0)return;c.fillStyle=col;const top=Math.floor((cy-ry)*2)/2,bottom=Math.ceil((cy+ry)*2)/2;
 for(let y=top;y<bottom;y+=.5){const v=(y+.25-cy)/ry;if(v<=-1||v>=1)continue;const hw=rx*Math.sqrt(1-v*v),x0=snap(cx-hw),x1=snap(cx+hw);if(x1>x0)c.fillRect(x0,y,x1-x0,.5);}};}
// Outlines grow each round shape by one unit, the same weight as the character ink line.
function draw(g,s,col,ox,oy,grow=0){
 if(s.k==='c')g.e(s.x+ox,s.y+oy,s.r+grow,s.r+grow,col);
 else if(s.k==='e')g.e(s.x+ox,s.y+oy,s.rx+grow,s.ry+grow,col);
 else if(s.k==='l'){const w=s.w+grow*2;g.l(s.a.x+ox,s.a.y+oy,s.b.x+ox,s.b.y+oy,w,col);g.e(s.a.x+ox,s.a.y+oy,w/2,w/2,col);g.e(s.b.x+ox,s.b.y+oy,w/2,w/2,col);}
 else if(s.k==='p')g.p(s.pts.map(([x,y])=>[x+ox,y+oy]),col);}
// The whole sheet (8 facings across, every frame down) painted straight into pixels, then put on the canvas in one go.
// The painter only ever fills half-unit rectangles, so a tiny software canvas is all it needs, and it is many times faster.
const COLORS=new Map();
function rgba(col){let v=COLORS.get(col);if(v)return v;const h=col.slice(1),n=h.length;let r,g,b,a=255;
 if(n===3||n===4){r=parseInt(h[0]+h[0],16);g=parseInt(h[1]+h[1],16);b=parseInt(h[2]+h[2],16);if(n===4)a=parseInt(h[3]+h[3],16);}else{r=parseInt(h.slice(0,2),16);g=parseInt(h.slice(2,4),16);b=parseInt(h.slice(4,6),16);if(n===8)a=parseInt(h.slice(6,8),16);}
 v=[r,g,b,a];COLORS.set(col,v);return v;}
export function softCanvas(width,height){const data=new Uint8ClampedArray(width*height*4);let tx=0,ty=0,sx=1,sy=1,col=[0,0,0,255],clip=[0,0,width,height];const stack=[];
 return {width,height,data,
  set fillStyle(v){col=rgba(v);},get fillStyle(){return '';},
  save(){stack.push([tx,ty,sx,sy]);},restore(){[tx,ty,sx,sy]=stack.pop()||[0,0,1,1];},
  translate(x,y){tx+=x*sx;ty+=y*sy;},scale(x,y){sx*=x;sy*=y;},
  clip(x,y,w,h){clip=[x,y,x+w,y+h];},
  fillRect(x,y,w,h){let x0=Math.round(tx+x*sx),y0=Math.round(ty+y*sy),x1=Math.round(tx+(x+w)*sx),y1=Math.round(ty+(y+h)*sy);
   x0=Math.max(x0,clip[0]);y0=Math.max(y0,clip[1]);x1=Math.min(x1,clip[2]);y1=Math.min(y1,clip[3]);if(x1<=x0||y1<=y0)return;const [r,g,b,a]=col;
   for(let yy=y0;yy<y1;yy++){let i=(yy*width+x0)*4;for(let xx=x0;xx<x1;xx++,i+=4){if(a===255){data[i]=r;data[i+1]=g;data[i+2]=b;data[i+3]=255;}
    else{const k=a/255,ba=data[i+3]/255,oa=k+ba*(1-k);if(oa<=0)continue;data[i]=(r*k+data[i]*ba*(1-k))/oa;data[i+1]=(g*k+data[i+1]*ba*(1-k))/oa;data[i+2]=(b*k+data[i+2]*ba*(1-k))/oa;data[i+3]=oa*255;}}}}};}
// Paint every facing and frame for a look into a canvas context laid out as 8 columns by PET_FRAME_COUNT rows.
export function paintPetSheet(ctx,look){const W=PET_FRAME.w,H=PET_FRAME.h,soft=softCanvas(W*8,H*PET_FRAME_COUNT);
 for(let f=0;f<PET_FRAME_COUNT;f++)for(let d=0;d<8;d++){soft.clip(d*W,f*H,W,H);soft.save();soft.translate(d*W,f*H);soft.scale(2,2);pet(soft,d,f,look);soft.restore();}
 const img=ctx.createImageData(W*8,H*PET_FRAME_COUNT);img.data.set(soft.data);ctx.putImageData(img,0,0);}
