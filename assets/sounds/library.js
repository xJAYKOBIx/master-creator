// Ready-made sounds built from the kit. Each recipe schedules itself from time 0 on a kit: play(k, options).
// Sources: the Deadlight Hollow intro (TV, broadcast, street) and the game's interface blips.
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
 {id:'loaded',name:'Reloaded',group:'Game',dur:.05,play:k=>blip(k,0,540,.035,'square',.027,660)}];

// Play a sound now on a live AudioContext (or schedule it on an OfflineAudioContext at 0).
export function playSound(ctx,sound,options={},when=ctx.currentTime+.03){const k=kit(ctx,when);sound.play(k,options);return when;}
