import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();

const BASE_CSS = String.raw`<style data-ralf-v2="base">
:root{--accent:#059669;--accent-deep:#047857;--accent-bright:#34d399;--accent-wash:#ecfdf5;--accent-line:#a7f3d0;--accent-grad:linear-gradient(135deg,#047857,#059669)}
::selection{background:#047857;color:#fff}.btn:not(.ghost){background:var(--accent-grad);border-color:#047857;color:#fff}.btn:not(.ghost):hover{opacity:1;box-shadow:0 10px 26px -14px rgba(4,120,87,.72)}
.eyebrow .dot,.live .pulse,.sp .speye b{background:#059669}.kicker .ix,.model:hover,.link:hover,.faq details[open] summary{color:#047857}.link:hover{border-color:#047857}.pcard.feat{border-color:#059669}.vfill:not(.g),.spark .b.cur,.ck,.fx.ok,.tag.gap,.sxp,.stick{background:var(--accent-grad);border-color:#047857;color:#fff}
</style>`;

const HERO_CSS = String.raw`<style data-ralf-v2="hero">
.r2-hero{height:calc(100svh - 66px);min-height:660px;padding:18px 0;border-bottom:1px solid var(--line);position:relative;overflow:hidden;background:radial-gradient(60% 70% at 78% 24%,rgba(5,150,105,.10),transparent 72%)}
.r2-hero .wrap{height:100%;display:flex;align-items:center}.r2-shell{width:100%;display:grid;grid-template-columns:minmax(0,.78fr) minmax(570px,1.22fr);grid-template-rows:auto auto;column-gap:42px;row-gap:18px;align-items:center}
.r2-copy{align-self:center;transform:translateY(-34px)}.r2-copy h1{font-family:var(--display);font-weight:600;font-size:clamp(46px,5.5vw,72px);line-height:.98;letter-spacing:-.045em;max-width:10.6ch}.r2-copy h1 em{font-style:normal;background:linear-gradient(135deg,#047857,#34d399);-webkit-background-clip:text;background-clip:text;color:transparent}.r2-copy .r2-intro{margin-top:20px;max-width:46ch;font-size:15.5px;line-height:1.56;color:var(--mut)}
.r2-demo{grid-column:2;grid-row:1 / span 2;align-self:center}.r2-card{height:454px;border:1px solid rgba(5,150,105,.22);border-radius:24px;background:rgba(255,255,255,.96);overflow:hidden;box-shadow:0 38px 100px -48px rgba(4,120,87,.62),0 20px 48px -30px rgba(18,18,18,.42)}
.r2-top{height:46px;padding:0 16px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--line);background:linear-gradient(180deg,#fff,#f8faf9);font-family:var(--mono);font-size:10.5px;color:var(--mut2)}.r2-lights{display:flex;gap:6px}.r2-lights i{width:8px;height:8px;border-radius:50%;background:var(--wash3)}.r2-agent{display:flex;align-items:center;gap:7px;color:#047857;font-weight:700}.r2-agent i{width:7px;height:7px;border-radius:50%;background:#059669;box-shadow:0 0 0 4px #ecfdf5}.r2-state{margin-left:auto;border:1px solid #a7f3d0;background:#ecfdf5;color:#047857;border-radius:999px;padding:4px 8px;font-weight:700}
.r2-op{margin:14px 16px 0;padding:11px 12px;border:1px solid #a7f3d0;background:#ecfdf5;border-radius:12px;display:flex;align-items:center;gap:10px}.r2-op b{font-family:var(--mono);font-size:8.5px;letter-spacing:.08em;text-transform:uppercase;color:#047857}.r2-op span{font-size:12.5px;font-weight:600;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.r2-body{display:grid;grid-template-columns:185px 1fr;gap:14px;padding:14px 16px 12px;height:352px}.r2-flow{position:relative;padding-top:2px}.r2-flow::before{content:"";position:absolute;left:13px;top:15px;bottom:15px;width:1px;background:var(--line)}.r2-step{position:relative;display:flex;align-items:flex-start;gap:9px;min-height:62px;color:var(--mut2);transition:color .2s,transform .2s}.r2-dot{position:relative;z-index:1;width:27px;height:27px;flex:0 0 27px;border-radius:50%;display:grid;place-items:center;border:1px solid var(--line);background:#fff;font:700 9px var(--mono);transition:.2s}.r2-step strong{display:block;font-size:11.5px;line-height:1.2;color:inherit}.r2-step small{display:block;font:8.5px/1.35 var(--mono);margin-top:3px;color:var(--mut2)}.r2-step.is-active{color:#121212;transform:translateX(3px)}.r2-step.is-active .r2-dot{background:#ecfdf5;border-color:#059669;color:#047857;box-shadow:0 0 0 5px rgba(5,150,105,.08)}.r2-step.is-done .r2-dot{background:var(--accent-grad);border-color:#047857;color:#fff}.r2-step.is-done{color:#4b5563}
.r2-detail{border:1px solid var(--line);border-radius:15px;background:#fff;overflow:hidden;position:relative}.r2-detail-head{height:38px;padding:0 12px;border-bottom:1px solid var(--line2);display:flex;align-items:center;font:9px var(--mono);color:var(--mut2);background:#fafafa}.r2-detail-head span:last-child{margin-left:auto;color:#047857}.r2-scene{padding:16px 17px;opacity:1;transform:none;transition:opacity .22s ease,transform .26s ease}.r2-scene.out{opacity:0;transform:translateY(4px)}.r2-k{font:700 8.5px var(--mono);letter-spacing:.11em;text-transform:uppercase;color:#047857}.r2-scene h3{font:600 20px/1.08 var(--display);letter-spacing:-.025em;margin:8px 0}.r2-scene p{font-size:11.5px;line-height:1.48;color:var(--mut);margin:0}.r2-metric{margin-top:14px;border-radius:11px;background:#f6f7f6;padding:11px 12px;min-height:78px}.r2-line{display:flex;align-items:center;gap:9px;font-size:11px}.r2-line+.r2-line{margin-top:7px}.r2-badge{margin-left:auto;font:700 8px var(--mono);border:1px solid var(--line);border-radius:999px;padding:3px 7px;color:var(--mut2);white-space:nowrap}.r2-badge.green{border-color:#a7f3d0;background:#ecfdf5;color:#047857}.r2-mail{font-size:10.5px;line-height:1.5;color:#333}.r2-mail b{color:#121212}.r2-result{display:flex;align-items:flex-end;gap:10px}.r2-big{font:700 38px/1 var(--display);letter-spacing:-.05em;color:#047857}.r2-up{font:700 9.5px var(--mono);color:#047857;margin-bottom:5px}
.r2-progress{height:4px;background:var(--wash2);overflow:hidden}.r2-progress span{display:block;height:100%;width:0;background:var(--accent-grad);transition:none;will-change:width}
.r2-start{align-self:start;display:flex;gap:8px;width:min(100%,470px)}.r2-start input{min-width:0;flex:1;height:50px;border:1px solid rgba(18,18,18,.15);border-radius:999px;padding:0 17px;font:14px var(--body);outline:none;background:#fff;box-shadow:0 12px 30px -26px rgba(18,18,18,.45)}.r2-start input:focus{border-color:#059669;box-shadow:0 0 0 3px rgba(5,150,105,.11)}.r2-start button{height:50px;border:0;border-radius:999px;padding:0 18px;background:var(--accent-grad);color:#fff;font:600 13.5px var(--body);cursor:pointer;white-space:nowrap}.r2-start button:hover{transform:translateY(-1px)}.r2-start-note{grid-column:1;font:9px var(--mono);color:var(--mut2);margin-top:-12px}
@media(max-width:900px){.r2-hero{height:auto;min-height:calc(100svh - 66px);padding:22px 0 28px;overflow:hidden}.r2-hero .wrap{align-items:stretch}.r2-shell{grid-template-columns:1fr;grid-template-rows:auto auto auto auto;row-gap:14px;height:auto;align-items:stretch}.r2-copy{grid-row:1;align-self:center;text-align:center;transform:none}.r2-copy h1{font-size:clamp(37px,10.7vw,50px);line-height:.96;max-width:12ch;margin:0 auto}.r2-copy .r2-intro{font-size:13.5px;line-height:1.52;max-width:58ch;margin:14px auto 0}.r2-demo{grid-column:1;grid-row:2;min-height:0}.r2-card{height:332px;min-height:310px;max-height:none;border-radius:18px}.r2-top{height:38px}.r2-op{margin:8px 10px 0;padding:8px 9px}.r2-body{grid-template-columns:122px 1fr;gap:8px;padding:9px 10px 8px;height:calc(100% - 84px)}.r2-step{min-height:43px;gap:6px}.r2-dot{width:21px;height:21px;flex-basis:21px}.r2-step strong{font-size:9.5px}.r2-step small{font-size:7px}.r2-flow::before{left:10px}.r2-detail{border-radius:11px}.r2-detail-head{height:29px;font-size:7.5px}.r2-scene{padding:10px 11px}.r2-scene h3{font-size:15.5px;margin:5px 0}.r2-scene p{font-size:9px}.r2-metric{margin-top:8px;padding:7px;min-height:54px}.r2-line{font-size:8.5px}.r2-line+.r2-line{margin-top:4px}.r2-big{font-size:29px}.r2-start{grid-row:3;width:100%;gap:6px}.r2-start input,.r2-start button{height:44px}.r2-start input{font-size:12.5px;padding:0 14px}.r2-start button{font-size:12px;padding:0 14px}.r2-start-note{grid-column:1;grid-row:4;text-align:center;margin:0;font-size:7.5px}}
@media(max-width:520px){.r2-shell{row-gap:12px}.r2-copy h1{font-size:clamp(34px,10.2vw,44px)}.r2-copy .r2-intro{font-size:12.5px;line-height:1.48}.r2-card{height:320px;min-height:300px}.r2-op span{font-size:9.5px}.r2-body{grid-template-columns:104px 1fr}.r2-step small{display:none}.r2-start button{padding:0 12px}.r2-start button .r2-long{display:none}}
@media(max-height:720px) and (max-width:900px){.r2-hero{min-height:0}.r2-copy h1{font-size:34px}.r2-card{height:300px;min-height:286px}.r2-step{min-height:39px}.r2-start input,.r2-start button{height:40px}}
@media(prefers-reduced-motion:reduce){.r2-step,.r2-scene,.r2-progress span{transition:none}}
</style>`;

const HERO = String.raw`<header class="heroB r2-hero">
  <div class="wrap">
    <div class="r2-shell">
      <div class="r2-copy">
        <h1>Get your business found by <em>AI</em></h1>
        <p class="r2-intro">Ralf is your AI-era SEO team in one place. It finds where the AI engines — ChatGPT, Claude, Gemini and the rest — are recommending your competitors instead of you, then actually does something about it: drafting the outreach to get you cited, writing articles built for the way AI answers questions, and tuning your site structure so those AI crawlers can actually read and quote you.</p>
      </div>
      <div class="r2-demo">
        <div class="r2-card" id="r2Card" aria-label="Ralf finding and executing on an AI visibility opportunity">
          <div class="r2-top"><span class="r2-lights" aria-hidden="true"><i></i><i></i><i></i></span><span class="r2-agent"><i></i>Ralf agent · working</span><span class="r2-state" id="r2State">Scanning</span></div>
          <div class="r2-op"><b>Opportunity</b><span>“best API monitoring tool”</span></div>
          <div class="r2-body">
            <div class="r2-flow" id="r2Flow">
              <div class="r2-step is-active"><span class="r2-dot">1</span><div><strong>Find the gap</strong><small>AI answers</small></div></div>
              <div class="r2-step"><span class="r2-dot">2</span><div><strong>Trace source</strong><small>citation path</small></div></div>
              <div class="r2-step"><span class="r2-dot">3</span><div><strong>Create action</strong><small>context carried</small></div></div>
              <div class="r2-step"><span class="r2-dot">4</span><div><strong>Approve</strong><small>human gate</small></div></div>
              <div class="r2-step"><span class="r2-dot">5</span><div><strong>Win result</strong><small>loop learns</small></div></div>
            </div>
            <div class="r2-detail">
              <div class="r2-detail-head"><span id="r2Head">AI visibility scan</span><span id="r2HeadState">live</span></div>
              <div class="r2-scene" id="r2Scene"></div>
            </div>
          </div>
          <div class="r2-progress"><span id="r2Progress"></span></div>
        </div>
      </div>
      <form class="r2-start" id="r2Start"><input id="r2Url" type="url" inputmode="url" autocomplete="url" placeholder="https://yourwebsite.com" aria-label="Your website URL" required><button type="submit"><span class="r2-long">Get Ralf working </span>→</button></form>
      <div class="r2-start-note">Enter your website · Ralf finds the first opportunities for you</div>
    </div>
  </div>
</header>`;

const HERO_JS = String.raw`<script data-ralf-v2="js">
(function(){
  var scene=document.getElementById('r2Scene'),state=document.getElementById('r2State'),head=document.getElementById('r2Head'),headState=document.getElementById('r2HeadState'),progress=document.getElementById('r2Progress'),steps=[].slice.call(document.querySelectorAll('.r2-step')),form=document.getElementById('r2Start');
  if(!scene||!steps.length)return;
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stages=[
    {state:'Gap found',head:'AI visibility scan',hs:'7 models',html:'<div class="r2-k">Gap detected</div><h3>Competitor A is being recommended instead of you.</h3><p>Ralf found the same commercial prompt across multiple AI engines.</p><div class="r2-metric"><div class="r2-line"><b>Competitor A</b><span class="r2-badge green">6 / 7 models</span></div><div class="r2-line"><span>Your brand</span><span class="r2-badge">0 / 7</span></div></div>'},
    {state:'Source traced',head:'Citation path',hs:'verified',html:'<div class="r2-k">Same opportunity</div><h3>The answer traces back to one influential page.</h3><p>Ralf follows the evidence instead of creating a disconnected task.</p><div class="r2-metric"><div class="r2-line"><b>nordicapis.com/monitoring-tools</b></div><div class="r2-line"><span>Competitor A included · you absent</span><span class="r2-badge green">94 priority</span></div></div>'},
    {state:'Action drafted',head:'Outreach',hs:'context carried',html:'<div class="r2-k">Evidence → action</div><h3>Ralf turns that exact source into a tailored pitch.</h3><div class="r2-metric r2-mail"><b>To:</b> editor@nordicapis.com<br><b>Subject:</b> Useful addition to your monitoring guide<br><br>Your guide already covers the tools AI recommends. We have fresh latency data and a free tier your readers may find useful…</div>'},
    {state:'Ready to approve',head:'Human approval',hs:'safe by default',html:'<div class="r2-k">Approval gate</div><h3>Nothing sends until you approve it.</h3><p>Ralf has kept the prompt, competitor evidence and source page attached to the action.</p><div class="r2-metric"><div class="r2-line"><b>Draft reviewed</b><span class="r2-badge green">✓ evidence attached</span></div><div class="r2-line"><span>Next step</span><span class="r2-badge green">Approve & send</span></div></div>'},
    {state:'Result won',head:'Outcome',hs:'loop updated',html:'<div class="r2-k">Result</div><h3>Citation won. Visibility moves.</h3><p>The result feeds back into the same loop so Ralf knows what worked.</p><div class="r2-metric"><div class="r2-result"><span class="r2-big">74</span><span class="r2-up">↑ 6 visibility points</span></div><div class="r2-line"><span>nordicapis.com now cites your brand</span><span class="r2-badge green">won</span></div></div>'}
  ];
  var durations=[2200,2200,2400,2600,2800],current=0,timer;
  function animateProgress(i){
    var start=(i/stages.length)*100,end=((i+1)/stages.length)*100;
    progress.style.transition='none';progress.style.width=start+'%';
    if(reduced){progress.style.width=end+'%';return;}
    requestAnimationFrame(function(){requestAnimationFrame(function(){progress.style.transition='width '+durations[i]+'ms linear';progress.style.width=end+'%';});});
  }
  function render(i,instant){
    current=i;var s=stages[i];
    steps.forEach(function(el,x){el.classList.toggle('is-active',x===i);el.classList.toggle('is-done',x<i);el.querySelector('.r2-dot').textContent=x<i?'✓':String(x+1)});
    state.textContent=s.state;head.textContent=s.head;headState.textContent=s.hs;animateProgress(i);
    if(instant||reduced){scene.innerHTML=s.html;scene.classList.remove('out');return;}
    scene.classList.add('out');setTimeout(function(){scene.innerHTML=s.html;scene.classList.remove('out')},170);
  }
  function next(){clearTimeout(timer);var n=(current+1)%stages.length;if(n===0){steps.forEach(function(el,x){el.classList.remove('is-done');el.querySelector('.r2-dot').textContent=String(x+1)})}render(n,false);timer=setTimeout(next,durations[n]);}
  render(reduced?4:0,true);if(!reduced)timer=setTimeout(next,durations[0]);
  document.addEventListener('visibilitychange',function(){if(document.hidden){clearTimeout(timer)}else if(!reduced){render(current,true);timer=setTimeout(next,durations[current])}});
  if(form)form.addEventListener('submit',function(e){e.preventDefault();var b=form.querySelector('button'),v=document.getElementById('r2Url');if(!v.value)return;b.textContent='Ralf would start here ✓';setTimeout(function(){b.innerHTML='<span class="r2-long">Get Ralf working </span>→'},1800)});
})();
</script>`;

async function htmlFiles(dir){const out=[];for(const entry of await readdir(dir,{withFileTypes:true})){if(['.git','.vercel','node_modules','dist'].includes(entry.name))continue;const full=path.join(dir,entry.name);if(entry.isDirectory())out.push(...await htmlFiles(full));else if(entry.isFile()&&entry.name.endsWith('.html'))out.push(full)}return out}

const files=await htmlFiles(root);let patched=0;
for(const file of files){let html=await readFile(file,'utf8');if(!html.includes('</head>'))continue;const isHome=path.resolve(file)===path.join(root,'index.html');if(!html.includes('data-ralf-v2="base"'))html=html.replace('</head>',BASE_CSS+'\n</head>');if(isHome){const start=html.indexOf('<header class="heroB">');const end=html.indexOf('</header>',start);if(start<0||end<0)throw new Error('Homepage hero not found');html=html.slice(0,start)+HERO+html.slice(end+9);html=html.replace('</head>',HERO_CSS+'\n</head>');html=html.replace('</body>',HERO_JS+'\n</body>');html=html.replace(/<meta name="robots"[^>]*>/i,'<meta name="robots" content="noindex,nofollow,noarchive">');html=html.replace(/\s*<!-- Google tag \(gtag\.js\) -->\s*<script async[\s\S]*?<\/script>\s*<script>[\s\S]*?<\/script>/i,'')}await writeFile(file,html,'utf8');patched++}
console.log('Ralf hero V2 staging build applied to '+patched+' HTML files.');
