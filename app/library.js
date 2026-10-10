// The library: browse the catalogue, preview any asset live, change its options and copy the code that uses it.
import {CATALOG,CATEGORIES,DIRECTIONS,byId} from '../assets/catalog.js';
import {kit} from '../assets/sounds/kit.js';

const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const make=(w,h)=>Object.assign(document.createElement('canvas'),{width:w,height:h});
const store={get(k,d){try{const v=localStorage.getItem('mc-'+k);return v==null?d:JSON.parse(v);}catch{return d;}},set(k,v){try{localStorage.setItem('mc-'+k,JSON.stringify(v));}catch{}}};

let category=store.get('category','all'),query='',current=null,state=null,raf=0;
const KIND={sprite:'Sprite',still:'Still',motion:'Motion',sound:'Sound'};

// ---------- Drawing ----------
// One picture of an entry at its native size; sprites are cached per facing, frame and options.
const cache=new Map();
function picture(e,{facing=e.facing??0,frame=0,o=e.defaults||{},t=0}={}){
 const key=e.kind==='motion'?null:e.id+'|'+facing+'|'+frame+'|'+JSON.stringify(o);
 if(key&&cache.has(key))return cache.get(key);
 const c=make(e.w,e.h),g=c.getContext('2d');g.imageSmoothingEnabled=false;
 try{e.draw(g,{facing,frame,o,t});}catch(err){console.error(e.id,err);g.setTransform(1,0,0,1,0,0);g.fillStyle='#ff4a3a';g.fillRect(0,0,e.w,e.h);}
 if(key){if(cache.size>400)cache.clear();cache.set(key,c);}return c;}
// The rectangle that holds an image's pixels, for fitting thumbnails.
function bounds(c){const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let x0=c.width,y0=c.height,x1=-1,y1=-1;
 for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(d[(y*c.width+x)*4+3]>8){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}
 return x1<0?{x:0,y:0,w:c.width,h:c.height}:{x:x0,y:y0,w:x1-x0+1,h:y1-y0+1};}
function thumb(canvas,e){const g=canvas.getContext('2d'),S=canvas.width;g.clearRect(0,0,S,S);g.imageSmoothingEnabled=false;
 if(e.kind==='sound'){waveform(canvas,e,true);return;}
 const src=picture(e,{t:e.kind==='motion'?(e.dur||2)*.6:0}),b=e.kind==='motion'?{x:0,y:0,w:e.w,h:e.h}:bounds(src);
 if(e.bg){g.fillStyle=e.bg;g.fillRect(0,0,S,S);}
 const fit=Math.min((S-8)/b.w,(S-8)/b.h),z=fit>=1?Math.floor(fit):fit;
 const w=Math.round(b.w*z),h=Math.round(b.h*z);g.drawImage(src,b.x,b.y,b.w,b.h,Math.round((S-w)/2),Math.round((S-h)/2),w,h);}

// ---------- Sound ----------
let audio=null;const waves=new Map();
async function render(e,o){const sr=22050,len=Math.ceil(sr*(e.dur+.1)),ctx=new OfflineAudioContext(1,len,sr);e.sound.play(kit(ctx,0),o);return (await ctx.startRendering()).getChannelData(0);}
async function waveform(canvas,e,small=false,o=e.defaults||{}){const key=e.id+JSON.stringify(o);let data=waves.get(key);
 if(!data){try{data=await render(e,o);}catch{return;}waves.set(key,data);}
 const g=canvas.getContext('2d'),W=canvas.width,H=canvas.height,mid=H/2,step=Math.max(1,Math.floor(data.length/W));let peak=0;for(const v of data)peak=Math.max(peak,Math.abs(v));const k=peak>0?(H*.42)/Math.max(peak,.05):0;
 g.clearRect(0,0,W,H);g.fillStyle=small?'#e9b44c':'#e9b44c';for(let x=0;x<W;x++){let m=0;for(let i=x*step;i<(x+1)*step&&i<data.length;i++)m=Math.max(m,Math.abs(data[i]));const h=Math.max(1,Math.round(m*k));g.fillRect(x,Math.round(mid-h),1,h*2);}
 if(!small){g.fillStyle='#363c49';g.fillRect(0,mid,W,1);}}
function play(e,o){try{audio??=new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();e.sound.play(kit(audio,audio.currentTime+.03),o);}catch(err){console.error(err);}}

// ---------- Browse ----------
const matches=e=>(category==='all'||e.category===category)&&(!query||(e.name+' '+e.group+' '+e.summary+' '+e.id).toLowerCase().includes(query));
function rail(){const counts=Object.fromEntries(CATEGORIES.map(c=>[c.id,CATALOG.filter(e=>e.category===c.id).length]));
 $('rail').innerHTML=[`<button data-cat="all" aria-pressed="${category==='all'}"><span>Everything</span><span class="n">${CATALOG.length}</span></button>`,
  ...CATEGORIES.map(c=>`<button data-cat="${c.id}" aria-pressed="${category===c.id}"><span>${esc(c.name)}</span>${counts[c.id]?`<span class="n">${counts[c.id]}</span>`:'<span class="soon">next</span>'}</button>`)].join('');}
function grid(){const list=CATALOG.filter(matches);$('count').textContent=`${list.length} of ${CATALOG.length} assets`;
 if(!list.length){$('browse').innerHTML=query?`<div class="empty">Nothing matches “${esc(query)}”.</div>`:'<div class="empty">Nothing here yet.</div>';return;}
 const groups=new Map();for(const e of list){const k=category==='all'?CATEGORIES.find(c=>c.id===e.category).name:e.group;if(!groups.has(k))groups.set(k,[]);groups.get(k).push(e);}
 $('browse').innerHTML=[...groups].map(([g,items])=>`<section class="group"><h2><b>${esc(g)}</b> ${items.length}</h2><div class="cards">${items.map(e=>`<button class="card" data-id="${e.id}" aria-current="${current?.id===e.id}"><canvas width="96" height="96" aria-hidden="true"></canvas><span class="nm">${esc(e.name)}</span><span class="kd">${category==='all'?esc(e.group):KIND[e.kind]}</span></button>`).join('')}</div></section>`).join('');
 // Thumbnails paint as they scroll into view.
 const io=new IntersectionObserver(es=>{for(const x of es)if(x.isIntersecting){io.unobserve(x.target);const e=byId(x.target.closest('.card').dataset.id);thumb(x.target,e);}},{root:$('browse'),rootMargin:'200px'});
 $('browse').querySelectorAll('.card canvas').forEach(c=>io.observe(c));}

// ---------- Inspect ----------
function open(e,{show=true}={}){current=e;const saved=store.get('opts-'+e.id,null);
 state={facing:e.facing??0,anim:e.anims?Object.keys(e.anims)[0]:null,playing:true,t:0,start:performance.now(),o:{...(e.defaults||{}),...(saved||{})},zoom:store.get('zoom-'+e.id,0),bg:store.get('bg',e.bg?'dark':'checker')};
 document.querySelectorAll('.card').forEach(c=>c.setAttribute('aria-current',c.dataset.id===e.id));
 try{history.replaceState(null,'','#'+e.id);}catch{}
 if(show)$('inspector').classList.add('open');if(!state.zoom)state.zoom=fitZoom(e);inspector();loop();}
// The largest whole-number zoom that fits the stage.
function fitZoom(e){const box=$('inspector'),W=Math.max(200,(box.clientWidth||innerWidth)-58),H=Math.min(innerHeight*(innerWidth<=900?.44:.5),460);const fit=Math.min(W/e.w,H/e.h);return Math.max(1,Math.min(6,Math.round(fit),Math.floor(H/e.h)||1));}
function optionHtml(op){const v=state.o[op.key];
 if(op.type==='text')return `<div class="opt"><label for="op-${op.key}">${esc(op.label)}</label><input type="text" id="op-${op.key}" data-key="${op.key}" value="${esc(v??op.default??'')}" maxlength="48" autocomplete="off"></div>`;
 if(op.swatches)return `<div class="opt"><span class="lbl">${esc(op.label)} · <span style="color:var(--ink-2)">${esc(op.choices[v]??'')}</span></span><div class="swatches">${op.choices.map((c,i)=>`<button data-key="${op.key}" data-v="${i}" aria-pressed="${v===i}" title="${esc(c)}" aria-label="${esc(c)}" style="background:${op.swatches[i]}"></button>`).join('')}</div></div>`;
 if(op.choices.length<=5)return `<div class="opt"><span class="lbl">${esc(op.label)}</span><div class="chips">${op.choices.map((c,i)=>`<button data-key="${op.key}" data-v="${i}" aria-pressed="${v===i}">${esc(c)}</button>`).join('')}</div></div>`;
 return `<div class="opt"><label for="op-${op.key}">${esc(op.label)}</label><select id="op-${op.key}" data-key="${op.key}">${op.choices.map((c,i)=>c?`<option value="${i}"${v===i?' selected':''}>${esc(c)}</option>`:'').join('')}</select></div>`;}
function code(e){let s=e.usage;if(e.options?.length&&e.kind!=='sound'){const o=Object.fromEntries(Object.entries(state.o).filter(([,v])=>v!==undefined));s+=`\n\n// The look shown here\nconst ${e.kind==='sprite'?'look':'options'} = ${JSON.stringify(o)};`;}return s;}
function inspector(){const e=current,cat=CATEGORIES.find(c=>c.id===e.category).name;
 const stats=e.stats?`<dl class="stats">${Object.entries(e.stats).map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`:'';
 const tools=e.kind==='sound'?`<div class="tools"><button class="play" id="playSound">Play</button><span class="zoom">${e.dur} s</span></div>`
  :`<div class="tools">${e.facings>1?`<button class="icon" id="turnL" aria-label="Turn left">⟲</button><span class="facing" id="facing">${DIRECTIONS[state.facing]}</span><button class="icon" id="turnR" aria-label="Turn right">⟳</button>`:''}
   ${e.anims?`<div class="seg" id="anims">${Object.keys(e.anims).map(a=>`<button data-anim="${a}" aria-pressed="${state.anim===a}">${a}</button>`).join('')}</div>`:''}
   ${e.kind==='motion'?`<button class="icon" id="pause" aria-label="Pause">❚❚</button><input class="scrub" id="scrub" type="range" min="0" max="${e.dur}" step="0.01" value="0" aria-label="Time">`:''}
   </div>
   <div class="tools"><div class="seg" id="bgs">${['checker','dark','light','ground'].map(b=>`<button data-bg="${b}" aria-pressed="${state.bg===b}">${b[0].toUpperCase()+b.slice(1)}</button>`).join('')}</div>
   <span class="spacer"></span><span class="zoomer"><button class="icon" id="zoomOut" aria-label="Zoom out">−</button><span class="zoom" id="zoom">${state.zoom}×</span><button class="icon" id="zoomIn" aria-label="Zoom in">+</button></span></div>`;
 $('inspector').innerHTML=`<div class="ins-head"><div><h2>${esc(e.name)}</h2><div class="where">${esc(cat)} · ${esc(e.group)} · ${KIND[e.kind]}</div></div><button class="close" id="close">Back</button></div>
  <div class="stage" id="stage" data-bg="${state.bg}">${e.kind==='sound'?'<canvas class="wave" id="wave" width="400" height="64"></canvas>':'<canvas id="view"></canvas>'}</div>${tools}
  <div class="sec"><p class="summary">${esc(e.summary)}</p>${stats}</div>
  ${e.presets?`<div class="sec"><h3>Presets</h3><div class="chips" id="presets">${e.presets.map((p,i)=>`<button data-preset="${i}">${esc(p.name)}</button>`).join('')}</div></div>`:''}
  ${e.options?.length?`<div class="sec"><h3>Options</h3><div class="row" style="margin-bottom:12px">${e.random?'<button class="btn" id="random">Randomize</button>':''}<button class="btn" id="reset">Reset</button></div><div class="opts" id="opts">${e.options.map(optionHtml).join('')}</div></div>`:''}
  <div class="sec"><div class="h3row"><h3>Use it</h3><button class="btn copy" id="copy">Copy</button></div><div class="code"><pre id="code">${esc(code(e))}</pre></div><div class="src">${esc(e.source)}</div></div><div class="foot"></div>`;
 if(e.kind==='sound')waveform($('wave'),e,false,state.o);}
function changed(){store.set('opts-'+current.id,state.o);cache.size>400&&cache.clear();$('code').textContent=code(current);if(current.kind==='sound')waveform($('wave'),current,false,state.o);}
function refreshOptions(){if($('opts'))$('opts').innerHTML=current.options.map(optionHtml).join('');changed();}

// The preview loop: only the open asset animates.
function loop(){cancelAnimationFrame(raf);const e=current;if(!e||e.kind==='sound')return;
 const tick=now=>{if(current!==e)return;const v=$('view');if(!v)return;let src;
  if(e.kind==='motion'){if(state.playing){state.t=((now-state.start)/1000)%e.dur;const s=$('scrub');if(s)s.value=state.t;}src=picture(e,{o:state.o,t:state.t});}
  else{const a=e.anims?.[state.anim],f=a?a.frames[Math.floor(now/a.ms)%a.frames.length]:0;src=picture(e,{facing:state.facing,frame:f,o:state.o});}
  const W=e.w*state.zoom,H=e.h*state.zoom;if(v.width!==W||v.height!==H){v.width=W;v.height=H;}const g=v.getContext('2d');g.imageSmoothingEnabled=false;g.clearRect(0,0,W,H);
  if(e.bg&&e.kind!=='motion'){g.fillStyle=e.bg;g.fillRect(0,0,W,H);}g.drawImage(src,0,0,W,H);
  raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);}

// ---------- Events ----------
$('rail').addEventListener('click',ev=>{const b=ev.target.closest('button[data-cat]');if(!b)return;category=b.dataset.cat;store.set('category',category);rail();grid();});
$('search').addEventListener('input',ev=>{query=ev.target.value.trim().toLowerCase();grid();});
$('browse').addEventListener('click',ev=>{const b=ev.target.closest('.card');if(b)open(byId(b.dataset.id));});
$('inspector').addEventListener('click',ev=>{const t=ev.target.closest('button');if(!t||!current)return;const e=current;
 if(t.id==='close'){$('inspector').classList.remove('open');return;}
 if(t.id==='turnL'||t.id==='turnR'){state.facing=(state.facing+(t.id==='turnR'?1:7))%8;$('facing').textContent=DIRECTIONS[state.facing];return;}
 if(t.dataset.anim){state.anim=t.dataset.anim;$('anims').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b===t));return;}
 if(t.dataset.bg){state.bg=t.dataset.bg;store.set('bg',state.bg);$('stage').dataset.bg=state.bg;$('bgs').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b===t));return;}
 if(t.id==='zoomIn'||t.id==='zoomOut'){state.zoom=Math.max(1,Math.min(8,state.zoom+(t.id==='zoomIn'?1:-1)));store.set('zoom-'+e.id,state.zoom);$('zoom').textContent=state.zoom+'×';return;}
 if(t.id==='pause'){state.playing=!state.playing;t.textContent=state.playing?'❚❚':'▶';t.setAttribute('aria-label',state.playing?'Pause':'Play');if(state.playing)state.start=performance.now()-state.t*1000;return;}
 if(t.id==='playSound'){play(e,state.o);return;}
 if(t.dataset.key){const op=e.options.find(o=>o.key===t.dataset.key);state.o[op.key]=+t.dataset.v;t.parentElement.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b===t));const l=t.closest('.opt').querySelector('.lbl span');if(l)l.textContent=op.choices[state.o[op.key]];changed();return;}
 if(t.dataset.preset){Object.assign(state.o,e.presets[+t.dataset.preset].options);refreshOptions();return;}
 if(t.id==='random'){state.o={...state.o,...e.random(Math.random)};refreshOptions();return;}
 if(t.id==='reset'){state.o={...(e.defaults||{})};refreshOptions();return;}
 if(t.id==='copy'){const s=$('code').textContent;const done=()=>{t.textContent='Copied';setTimeout(()=>t.textContent='Copy',1400);};
  try{navigator.clipboard.writeText(s).then(done,()=>select());}catch{select();}
  function select(){const r=document.createRange();r.selectNodeContents($('code'));const sel=getSelection();sel.removeAllRanges();sel.addRange(r);t.textContent='Selected';}}});
$('inspector').addEventListener('change',ev=>{const t=ev.target;if(t.tagName==='SELECT'&&t.dataset.key){state.o[t.dataset.key]=+t.value;changed();}});
$('inspector').addEventListener('input',ev=>{const t=ev.target;if(t.type==='text'&&t.dataset.key){state.o[t.dataset.key]=t.value;changed();}if(t.id==='scrub'){state.t=+t.value;state.playing=false;const p=$('pause');if(p){p.textContent='▶';p.setAttribute('aria-label','Play');}}});
document.addEventListener('keydown',ev=>{if(ev.key==='Escape')$('inspector').classList.remove('open');if(!current||ev.target.closest('input,select'))return;
 if((ev.key==='ArrowLeft'||ev.key==='ArrowRight')&&current.facings>1){state.facing=(state.facing+(ev.key==='ArrowRight'?1:7))%8;const f=$('facing');if(f)f.textContent=DIRECTIONS[state.facing];}});

addEventListener('hashchange',()=>{const e=byId(location.hash.slice(1));if(e&&e!==current)open(e);});
rail();grid();
const first=byId(location.hash.slice(1))||CATALOG[0];open(first,{show:!!byId(location.hash.slice(1))});
window.mc={CATALOG,picture,open,get state(){return state;}};
