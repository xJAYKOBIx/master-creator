// Ready-made sounds built from the kit. Each recipe schedules itself from time 0 on a kit: play(k, options).
// Sources: the Deadlight Hollow intro (TV, broadcast, street), the game's interface blips, and the street outside the house
// (the cruiser, the crash, guns and the dead).
import {kit,syllables,voice,siren} from './kit.js';
import {rng} from '../core/kit.js';

// One falling or rising tone with a fast exponential fade: the game's interface blips.
function blip(k,start,f,dur,type='sine',vol=.025,end=f){const {ctx,at,out}=k,o=ctx.createOscillator(),g=ctx.createGain();o.type=type;
 o.frequency.setValueAtTime(f,at(start));o.frequency.exponentialRampToValueAtTime(Math.max(20,end),at(start+dur));g.gain.setValueAtTime(vol,at(start));g.gain.exponentialRampToValueAtTime(.001,at(start+dur));
 o.connect(g).connect(out);o.start(at(start));o.stop(at(start+dur));}

// A heart monitor that starts and speeds up, as in the live trial.
const beats=(dur,first=.4)=>{const out=[];let t=first,gap=.62;while(t<dur){out.push(t);t+=gap;gap=Math.max(.32,gap*.9);}return out;};

export const SOUNDS=[
 // The room and the set
 {id:'remote-click',name:'Remote click',group:'Room',dur:.2,play:k=>k.noise(0,.02,k.out,{type:'highpass',f:2500,gain:.35,decay:true})},
 {id:'tv-power-on',name:'TV power-on chime',group:'Room',dur:1.4,play:({out,tone,noise})=>{tone(0,.5,out,{f:659,gain:.06,release:.4});tone(.12,.7,out,{f:988,gain:.05,release:.6});noise(.3,.8,out,{type:'bandpass',f:900,q:1.5,gain:.04,attack:.4});}},
 {id:'channel-flip',name:'Channel flip',group:'Room',dur:.4,play:({out,tv,noise,tone})=>{noise(0,.02,out,{type:'highpass',f:2500,gain:.3,decay:true});for(let i=0;i<4;i++)tone(.05+i*.025,.02,tv,{type:'square',f:300+i*420,gain:.04});}},
 {id:'room-hum',name:'Room hum',group:'Room',dur:3,play:({out,tone})=>{tone(0,3,out,{f:50,gain:.03,attack:.8});tone(0,3,out,{f:15600,gain:.002,attack:.4});}},
 {id:'distant-siren',name:'Distant siren',group:'Street',dur:5,play:k=>{const f=k.ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=700;f.connect(k.out);siren(k,0,5,f,{gain:.05,f:600,span:250,rate:.9});}},
 // Through the TV speaker
 {id:'siren',name:'Siren (on TV)',group:'Street',dur:4,play:k=>{siren(k,0,4,k.tv,{gain:.06});k.noise(0,4,k.tv,{type:'bandpass',f:700,q:.8,gain:.12,attack:.05});}},
 {id:'rain',name:'Rain',group:'Street',dur:4,play:k=>k.noise(0,4,k.tv,{type:'highpass',f:3000,gain:.08,attack:.2})},
 {id:'crowd-cheer',name:'Crowd cheer',group:'Broadcast',dur:2.5,play:k=>{k.noise(0,2.5,k.tv,{type:'bandpass',f:1200,q:.5,gain:.28,attack:.15});const r=rng(5);for(let i=0;i<40;i++)k.noise(r()*2.4,.015,k.tv,{type:'highpass',f:2000,gain:.12,decay:true});}},
 {id:'flatline',name:'Flatline',group:'Broadcast',dur:3,play:k=>k.tone(0,2.95,k.tv,{f:880,gain:.05,attack:.01,release:.01})},
 {id:'heart-monitor',name:'Heart monitor, speeding up',group:'Broadcast',dur:4,play:k=>{for(const b of beats(4,.2))k.tone(b,.09,k.tv,{f:880,gain:.06,attack:.003,release:.02});}},
 {id:'news-sting',name:'Breaking news sting',group:'Broadcast',dur:1.2,play:({tv,tone,noise})=>{for(const f of [146.8,220,293.7])tone(0,.7,tv,{type:'sawtooth',f,gain:.05,attack:.01,release:.4});tone(0,.6,tv,{f:60,to:35,gain:.4,release:.5});noise(0,.5,tv,{f:1800,sweep:200,gain:.25,decay:true});}},
 {id:'news-bed',name:'Tense news bed',group:'Broadcast',dur:4,play:({tv,tone,noise})=>{for(const [f,det] of [[55,0],[82.4,7],[110,-5]])tone(0,4,tv,{type:'sawtooth',f,gain:.035,attack:.6,release:.3,detune:det});for(let s=0;s<4;s+=.5)noise(s,.03,tv,{type:'highpass',f:6000,gain:.05,decay:true});}},
 {id:'news-music',name:'Upbeat news music',group:'Broadcast',dur:4,play:({tv,tone})=>{for(let s=0,i=0;s<4;s+=.25,i++){tone(s,.18,tv,{type:'square',f:[392,523,587,659,784,659,587,523][i%8],gain:.04,release:.15});if(i%2===0)tone(s,.2,tv,{f:98,gain:.05,release:.15});}}},
 {id:'ad-piano',name:'Soft ad piano',group:'Broadcast',dur:5.5,play:({tv,tone})=>{[[0,523],[.35,659],[.7,784],[1.05,988],[1.6,880],[1.95,784],[2.3,659],[2.9,698],[3.25,880],[3.6,1047],[4.2,988],[4.6,784]].forEach(([s,f])=>{tone(s,1.1,tv,{type:'triangle',f,gain:.05,attack:.01,release:1});tone(s,1.1,tv,{f:f/2,gain:.03,attack:.01,release:1});});}},
 {id:'shimmer',name:'Logo shimmer',group:'Broadcast',dur:1,play:({tv,tone})=>{for(let i=0;i<6;i++)tone(i*.07,.5,tv,{f:1568+i*220,gain:.012,release:.45});}},
 {id:'signal-lost',name:'Signal breaking up',group:'Broadcast',dur:.8,play:({tv,tone,noise})=>{for(let s=0,i=0;s<.55;s+=.045,i++){tone(s,.03,tv,{type:'square',f:420-i*14,gain:.05});noise(s,.03,tv,{type:'bandpass',f:900,gain:.12});}}},
 {id:'tv-voice',name:'Voice on TV',group:'Voices',dur:2.6,options:[{key:'voice',label:'Voice',choices:['Woman','Man','Narrator']}],
  play:(k,o={})=>voice(k,0,syllables([[0,2.5]],7),[205,140,120][o.voice|0],2.6)},
 // The game's interface blips
 {id:'shot',name:'Shot',group:'Game',dur:.1,options:[{key:'weapon',label:'Weapon',choices:['Gun','Melee','Blast']}],play:(k,o={})=>blip(k,0,[240,120,90][o.weapon|0],.075,'triangle',.026,55)},
 {id:'hurt',name:'Hurt',group:'Game',dur:.2,play:k=>blip(k,0,90,.16,'sawtooth',.025,45)},
 {id:'heal',name:'Heal',group:'Game',dur:.2,play:k=>blip(k,0,420,.18,'sine',.04,750)},
 {id:'purchase',name:'Purchase',group:'Game',dur:.15,play:k=>blip(k,0,650,.12,'sine',.04,950)},
 {id:'wave',name:'Wave starts',group:'Game',dur:.55,play:k=>blip(k,0,180,.5,'triangle',.025,90)},
 {id:'clear',name:'Wave cleared',group:'Game',dur:.55,play:k=>{blip(k,0,330,.4,'sine',.045,660);blip(k,.16,660,.35,'sine',.025,880);}},
 {id:'dash',name:'Dash',group:'Game',dur:.12,play:k=>blip(k,0,180,.1,'triangle',.025,520)},
 // Reloaded is three times the game's volume (.009), which was too faint to hear on its own.
 {id:'loaded',name:'Reloaded',group:'Game',dur:.05,play:k=>blip(k,0,540,.035,'square',.027,660)},
 // Out on the street, heard in the room rather than on TV. A cruiser going past fast: the engine roar and the siren rise as it
 // comes, the pitch drops as it passes (a Doppler fall), then both fade off down the road.
 {id:'car-pass',name:'Cruiser speeds past',group:'Street',dur:4,play:k=>{const {ctx,at,out}=k,g=ctx.createGain();g.gain.setValueAtTime(.0001,at(0));g.gain.exponentialRampToValueAtTime(1,at(1.6));g.gain.setValueAtTime(1,at(1.9));g.gain.exponentialRampToValueAtTime(.02,at(4));g.connect(out);
  const o=ctx.createOscillator();o.type='triangle';for(let s=0;s<4;s+=.45){const d=s<1.8?1:.82;o.frequency.setValueAtTime(700*d,at(s));o.frequency.linearRampToValueAtTime(1000*d,at(s+.22));o.frequency.linearRampToValueAtTime(700*d,at(s+.45));}
  const og=ctx.createGain();og.gain.value=.05;o.connect(og).connect(g);o.start(at(0));o.stop(at(4));
  const e=ctx.createOscillator();e.type='sawtooth';e.frequency.setValueAtTime(70,at(0));e.frequency.linearRampToValueAtTime(95,at(1.8));e.frequency.linearRampToValueAtTime(62,at(2.2));e.frequency.linearRampToValueAtTime(55,at(4));
  const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=400;const eg=ctx.createGain();eg.gain.value=.08;e.connect(lp).connect(eg).connect(g);e.start(at(0));e.stop(at(4));
  k.noise(0,4,g,{type:'bandpass',f:500,q:.6,gain:.2,attack:.4,sweep:300});}},
 // The crash a few houses down: a heavy thump, metal folding, then glass and bits falling, with the siren choked off.
 {id:'car-crash',name:'Car crash',group:'Street',dur:2.4,play:k=>{const {out}=k,r=rng(17);k.tone(0,.5,out,{f:60,to:30,gain:.5,attack:.002,release:.4});k.noise(0,.6,out,{f:900,gain:.6,attack:.002,decay:true,sweep:120});
  k.noise(.04,.9,out,{type:'bandpass',f:1600,q:2,gain:.18,attack:.01,decay:true,sweep:600});for(let i=0;i<5;i++)k.tone(.05+r()*.35,.25,out,{type:'square',f:200+r()*500,to:90,gain:.03,release:.2});
  for(let i=0;i<26;i++)k.noise(.2+r()*1.9,.03+r()*.05,out,{type:'highpass',f:3500+r()*3000,gain:.05+r()*.06,decay:true});k.noise(.9,1.4,out,{type:'lowpass',f:500,gain:.04,attack:.1});}},
 // Guns in the hand, heard close: a crack and a boom with a short tail. The shotgun is deeper and longer; its pump is two clacks.
 {id:'pistol',name:'Pistol shot',group:'Combat',dur:.4,play:k=>{const {out}=k;k.noise(0,.07,out,{type:'highpass',f:1800,gain:.5,attack:.001,decay:true});k.noise(0,.35,out,{f:1400,gain:.45,attack:.001,decay:true,sweep:200});k.tone(0,.12,out,{f:150,to:50,gain:.3,attack:.001,release:.1});}},
 {id:'shotgun',name:'Shotgun blast',group:'Combat',dur:.7,play:k=>{const {out}=k;k.noise(0,.09,out,{type:'highpass',f:1200,gain:.55,attack:.001,decay:true});k.noise(0,.65,out,{f:900,gain:.6,attack:.001,decay:true,sweep:90});k.tone(0,.25,out,{f:110,to:35,gain:.45,attack:.001,release:.2});}},
 {id:'pump',name:'Shotgun pump',group:'Combat',dur:.35,play:k=>{const {out}=k;for(const [t,f] of [[0,2400],[.2,1800]]){k.noise(t,.05,out,{type:'bandpass',f,q:3,gain:.35,attack:.001,decay:true});k.tone(t,.04,out,{type:'square',f:f/6,gain:.04,release:.03});}}},
 {id:'shell-in',name:'Shell loaded',group:'Combat',dur:.12,play:k=>{const {out}=k;k.noise(0,.06,out,{type:'bandpass',f:3000,q:4,gain:.25,attack:.001,decay:true});k.tone(.01,.05,out,{f:900,to:500,gain:.04,release:.04});}},
 {id:'mag-in',name:'Magazine in',group:'Combat',dur:.25,play:k=>{const {out}=k;k.noise(0,.04,out,{type:'bandpass',f:1500,q:3,gain:.3,attack:.001,decay:true});k.noise(.14,.05,out,{type:'bandpass',f:2600,q:4,gain:.35,attack:.001,decay:true});}},
 {id:'dry-fire',name:'Empty click',group:'Combat',dur:.08,play:k=>k.noise(0,.03,k.out,{type:'bandpass',f:3200,q:6,gain:.3,attack:.001,decay:true})},
 // The dead: a wet, rattling groan (a low buzz through a moving vowel), a hit landing in one, and a bite.
 {id:'groan',name:'Zombie groan',group:'Combat',dur:1.4,options:[{key:'voice',label:'Voice',choices:['Low','Rough','High']}],play:(k,o={})=>{const {ctx,at,out}=k,f=[62,78,105][o.voice|0],s=ctx.createOscillator();s.type='sawtooth';s.frequency.setValueAtTime(f,at(0));s.frequency.linearRampToValueAtTime(f*1.18,at(.5));s.frequency.linearRampToValueAtTime(f*.85,at(1.35));
  const am=ctx.createOscillator(),amg=ctx.createGain();am.frequency.value=17;amg.gain.value=f*.25;am.connect(amg).connect(s.frequency);
  const v=ctx.createBiquadFilter();v.type='bandpass';v.Q.value=4;v.frequency.setValueAtTime(380,at(0));v.frequency.linearRampToValueAtTime(700,at(.5));v.frequency.linearRampToValueAtTime(320,at(1.35));
  const g=ctx.createGain();g.gain.setValueAtTime(0,at(0));g.gain.linearRampToValueAtTime(.5,at(.15));g.gain.setValueAtTime(.5,at(1));g.gain.linearRampToValueAtTime(0,at(1.38));s.connect(v).connect(g).connect(out);s.start(at(0));s.stop(at(1.4));am.start(at(0));am.stop(at(1.4));
  k.noise(0,1.35,out,{type:'bandpass',f:900,q:1.5,gain:.06,attack:.2});}},
 {id:'zombie-hit',name:'Hit',group:'Combat',dur:.2,play:k=>{const {out}=k;k.noise(0,.15,out,{f:700,gain:.4,attack:.001,decay:true,sweep:150});k.tone(0,.1,out,{f:120,to:60,gain:.2,attack:.001,release:.08});}},
 {id:'bite',name:'Bite',group:'Combat',dur:.35,play:k=>{const {out}=k;k.noise(0,.08,out,{type:'bandpass',f:1200,q:2,gain:.4,attack:.001,decay:true});k.noise(.06,.25,out,{f:600,gain:.3,attack:.01,decay:true});blip(k,.02,110,.2,'sawtooth',.05,55);}},
 // Weight under a gunshot: a deep thump felt more than heard and a click on the front, played with the shot itself.
 {id:'gun-thump',name:'Gun thump',group:'Combat',dur:.3,options:[{key:'size',label:'Gun',choices:['Pistol','Shotgun']}],play:(k,o={})=>{const {out}=k,big=(o.size|0)===1;
  k.noise(0,.012,out,{type:'highpass',f:4200,gain:.35,attack:.0005,decay:true});k.tone(0,big?.26:.15,out,{f:big?72:88,to:big?28:38,gain:big?.75:.55,attack:.001,release:big?.2:.11});
  k.noise(0,big?.22:.13,out,{f:big?220:280,gain:big?.5:.38,attack:.001,decay:true});}},
 // Throwing yourself down: cloth through the air, then the body hitting the ground and a scrape of grit.
 {id:'dive',name:'Dive',group:'Combat',dur:.6,play:k=>{const {out}=k;k.noise(0,.3,out,{type:'bandpass',f:900,q:1.2,gain:.14,attack:.08,decay:true,sweep:380});
  k.tone(.28,.13,out,{f:92,to:44,gain:.42,attack:.002,release:.1});k.noise(.28,.16,out,{f:420,gain:.36,attack:.002,decay:true});k.noise(.31,.22,out,{type:'highpass',f:2600,gain:.06,attack:.01,decay:true});}},
 // A spent casing landing: a bright brass tink, or the dull tock of a shotgun's plastic hull.
 {id:'casing',name:'Casing drop',group:'Combat',dur:.12,options:[{key:'kind',label:'Casing',choices:['Brass','Hull']}],play:(k,o={})=>{const {out}=k;
  if((o.kind|0)===1){k.noise(0,.03,out,{type:'bandpass',f:1500,q:3,gain:.16,attack:.001,decay:true});k.tone(0,.04,out,{f:620,to:420,gain:.04,release:.03});return;}
  k.tone(0,.07,out,{f:4200,to:3900,gain:.05,attack:.001,release:.06});k.tone(0,.04,out,{f:6100,gain:.025,attack:.001,release:.035});k.noise(0,.02,out,{type:'bandpass',f:5000,q:4,gain:.07,attack:.0005,decay:true});}},
 // Going through something in a hurry: cloth and paper shoved aside, a rattle, a thump, and a last rustle.
 {id:'rummage',name:'Rummage',group:'Scavenging',dur:.9,play:k=>{const {out}=k;[[0,.18,1800],[.2,.14,2600],[.42,.2,1400],[.68,.16,2200]].forEach(([t,d,f])=>k.noise(t,d,out,{type:'bandpass',f,q:.8,gain:.12,attack:.02,decay:true}));
  for(const t of [.3,.34,.37])k.noise(t,.03,out,{type:'bandpass',f:3600,q:5,gain:.06,attack:.001,decay:true});k.tone(.55,.08,out,{f:140,to:90,gain:.18,attack:.002,release:.06});}},
 // Something small into the bag: a soft drop and a little rattle (shells), or a clink (metal).
 {id:'pickup',name:'Pick up',group:'Scavenging',dur:.25,options:[{key:'kind',label:'What',choices:['Shells','Scrap','Soft']}],play:(k,o={})=>{const {out}=k,n=o.kind|0;
  k.noise(0,.08,out,{f:900,gain:.18,attack:.003,decay:true});if(n===0)for(const t of [.05,.08,.1])k.tone(t,.04,out,{f:2400+t*4000,gain:.03,attack:.001,release:.03});
  else if(n===1){k.tone(.03,.12,out,{f:1800,gain:.04,attack:.001,release:.1});k.tone(.03,.1,out,{f:2650,gain:.025,attack:.001,release:.08});}}},
 // A car alarm going off: the two-tone whoop and a horn, over and over, from somewhere down the street.
 {id:'car-alarm',name:'Car alarm',group:'Scavenging',dur:3.2,play:k=>{const {out}=k;for(let i=0;i<4;i++){const t=i*.8;k.tone(t,.36,out,{type:'square',f:780,to:1250,gain:.05,attack:.01,release:.03});
  k.tone(t+.4,.36,out,{type:'square',f:1250,to:780,gain:.05,attack:.01,release:.03});k.tone(t,.2,out,{type:'sawtooth',f:410,gain:.035,attack:.005,release:.04});k.tone(t,.2,out,{type:'sawtooth',f:520,gain:.03,attack:.005,release:.04});}}}];

// Play a sound now on a live AudioContext (or schedule it on an OfflineAudioContext at 0). options.vol (0 to 1) plays it quieter,
// for something further away.
export function playSound(ctx,sound,options={},when=ctx.currentTime+.03){const k=kit(ctx,when,options.vol);sound.play(k,options);return when;}
