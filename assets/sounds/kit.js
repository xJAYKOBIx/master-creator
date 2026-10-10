// The sound kit: everything is synthesised in the browser with WebAudio, so sounds ship as code and can be rendered offline.
// kit(ctx, t0) returns helpers scheduled on the audio clock from t0. Two destinations: out (the room, through a gentle compressor)
// and tv (a bandpass that makes anything sound like it comes out of a TV or radio speaker).
import {rng} from '../core/kit.js';
export function kit(ctx,t0){const at=s=>t0+s;
 const out=ctx.createDynamicsCompressor();out.threshold.value=-18;out.ratio.value=4;const master=ctx.createGain();master.gain.value=.9;out.connect(master).connect(ctx.destination);
 const tv=ctx.createBiquadFilter();tv.type='bandpass';tv.frequency.value=1300;tv.Q.value=.35;const tvg=ctx.createGain();tvg.gain.value=1.5;tv.connect(tvg).connect(out);
 const len=ctx.sampleRate*2,buf=ctx.createBuffer(1,len,ctx.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
 const noise=(start,dur,dest,{type='lowpass',f=2000,q=.7,gain=.3,attack=.005,decay=false,sweep=null}={})=>{const s=ctx.createBufferSource();s.buffer=buf;s.loop=true;const fl=ctx.createBiquadFilter();fl.type=type;fl.frequency.setValueAtTime(f,at(start));fl.Q.value=q;if(sweep)fl.frequency.exponentialRampToValueAtTime(sweep,at(start+dur));
  const g=ctx.createGain();g.gain.setValueAtTime(0,at(start));g.gain.linearRampToValueAtTime(gain,at(start+attack));if(decay)g.gain.exponentialRampToValueAtTime(.0005,at(start+dur));else{g.gain.setValueAtTime(gain,at(start+Math.max(attack,dur-.02)));g.gain.linearRampToValueAtTime(0,at(start+dur));}
  s.connect(fl).connect(g).connect(dest);s.start(at(start),Math.random());s.stop(at(start+dur+.05));return g;};
 const tone=(start,dur,dest,{type='sine',f=440,to=null,gain=.1,attack=.005,release=.05,detune=0}={})=>{const o=ctx.createOscillator();o.type=type;o.detune.value=detune;o.frequency.setValueAtTime(f,at(start));if(to)o.frequency.exponentialRampToValueAtTime(to,at(start+dur));
  const g=ctx.createGain();g.gain.setValueAtTime(0,at(start));g.gain.linearRampToValueAtTime(gain,at(start+attack));g.gain.setValueAtTime(gain,at(start+Math.max(attack,dur-release)));g.gain.linearRampToValueAtTime(0,at(start+dur));o.connect(g).connect(dest);o.start(at(start));o.stop(at(start+dur+.02));return o;};
 return {ctx,at,out,tv,noise,tone};}
// A voice through the speaker: a buzz at speaking pitch through two moving vowel formants, a breath of noise on some syllables.
// Syllables for a stretch of speech: start, length and a vowel brightness.
export function syllables(spans,seed){const r=rng(seed),out=[];for(const [a,b] of spans){let t=a;while(t<b-.06){const words=1+(r()*3|0);for(let i=0;i<words&&t<b-.06;i++){const d=.07+r()*.08;out.push([t,d,.3+r()*.7]);t+=d+.015;}t+=.04+r()*.06;}}return out;}
export function voice(k,start,syllables,pitch=205,stop){const {ctx,at,tv,noise}=k,g=ctx.createGain();g.gain.value=0;g.connect(tv);const saw=ctx.createOscillator();saw.type='sawtooth';saw.frequency.value=pitch;
 const f1=ctx.createBiquadFilter(),f2=ctx.createBiquadFilter();f1.type=f2.type='bandpass';f1.Q.value=5;f2.Q.value=8;const mix=ctx.createGain();mix.gain.value=.5;saw.connect(f1).connect(mix);saw.connect(f2).connect(mix);mix.connect(g);saw.start(at(start));saw.stop(at(stop));
 for(const [s,dd,v] of syllables){const a=start+s;g.gain.setValueAtTime(0,at(a));g.gain.linearRampToValueAtTime(.85+.35*v,at(a+.02));g.gain.linearRampToValueAtTime(0,at(a+dd));f1.frequency.setValueAtTime(450+v*450,at(a));f2.frequency.setValueAtTime(1300+v*900,at(a));saw.frequency.setValueAtTime(pitch-15+v*40,at(a));if(v<.45)noise(a,.04,tv,{type:'highpass',f:3500,gain:.06});}}
// A siren: a tone swept up and down.
export function siren(k,start,dur,dest,{gain=.05,f=650,span=300,rate=.5}={}){const {ctx,at}=k,o=ctx.createOscillator();o.type='triangle';for(let s=0;s<dur;s+=rate){o.frequency.setValueAtTime(f,at(start+s));o.frequency.linearRampToValueAtTime(f+span,at(start+s+rate*.5));o.frequency.linearRampToValueAtTime(f,at(start+s+rate));}
 const g=ctx.createGain();g.gain.setValueAtTime(0,at(start));g.gain.linearRampToValueAtTime(gain,at(start+.4));g.gain.setValueAtTime(gain,at(start+dur-.4));g.gain.linearRampToValueAtTime(0,at(start+dur));o.connect(g).connect(dest);o.start(at(start));o.stop(at(start+dur+.05));}
