const HERO_HTML = String.raw`
<header class="heroB r2x-hero">
  <div class="wrap r2x-wrap">
    <div class="r2x-shell">
      <div class="r2x-copy">
        <h1>Get your business found by <em>AI</em></h1>
        <p>Ralf is your AI-era SEO team in one place. It finds where the AI engines — ChatGPT, Claude, Gemini and the rest — are recommending your competitors instead of you, then actually does something about it: drafting the outreach to get you cited, writing articles built for the way AI answers questions, and tuning your site structure so those AI crawlers can actually read and quote you.</p>
      </div>

      <div class="r2x-demo">
        <div class="r2x-card" id="r2xCard" aria-label="How Ralf improves your visibility in AI search">
          <div class="r2x-top">
            <span class="r2x-lights" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="r2x-agent"><i></i>Ralf agent · working</span>
            <span class="r2x-state" id="r2xState">Running prompts</span>
          </div>
          <div class="r2x-screen">
            <div class="r2x-screen-head"><span id="r2xHead">Finding prompts you should win</span><span id="r2xHeadState">7 AI engines</span></div>
            <div class="r2x-scene" id="r2xScene"></div>
          </div>
          <div class="r2x-progress"><span id="r2xProgress"></span></div>
        </div>

        <div class="r2x-controls" id="r2xControls" aria-label="Animation controls">
          <button type="button" class="r2x-arrow" data-prev aria-label="Previous stage">←</button>
          <div class="r2x-dots" aria-label="Choose animation stage">
            <button type="button" data-stage="0" aria-label="Stage 1: Run prompts" aria-pressed="true">1</button>
            <button type="button" data-stage="1" aria-label="Stage 2: Find where competitors beat you" aria-pressed="false">2</button>
            <button type="button" data-stage="2" aria-label="Stage 3: Find the cited source" aria-pressed="false">3</button>
            <button type="button" data-stage="3" aria-label="Stage 4: Outreach" aria-pressed="false">4</button>
            <button type="button" data-stage="4" aria-label="Stage 5: Content" aria-pressed="false">5</button>
            <button type="button" data-stage="5" aria-label="Stage 6: Review and approve" aria-pressed="false">6</button>
            <button type="button" data-stage="6" aria-label="Stage 7: Track results" aria-pressed="false">7</button>
          </div>
          <button type="button" class="r2x-toggle" data-toggle aria-label="Pause animation">Pause</button>
          <button type="button" class="r2x-arrow" data-next aria-label="Next stage">→</button>
        </div>
      </div>

      <form class="r2x-start" id="r2xStart">
        <input id="r2xUrl" type="url" inputmode="url" autocomplete="url" placeholder="https://yourwebsite.com" aria-label="Your website URL" required>
        <button type="submit"><span>Get Ralf working </span>→</button>
      </form>
      <div class="r2x-note">Enter your website · Ralf finds the first opportunities for you</div>
    </div>
  </div>
</header>`;

const STYLES = String.raw`<style data-ralf-staging-v2-direct>
:root{--r2x:#059669;--r2x-dark:#047857;--r2x-bright:#34d399;--r2x-wash:#ecfdf5;--r2x-line:#a7f3d0}
::selection{background:var(--r2x-dark);color:#fff}.btn:not(.ghost){background:linear-gradient(135deg,var(--r2x-dark),var(--r2x));border-color:var(--r2x-dark)}.eyebrow .dot,.live .pulse{background:var(--r2x)}
.r2x-hero{height:calc(100svh - 66px);min-height:680px;padding:14px 0 18px;border-bottom:1px solid var(--line);position:relative;overflow:hidden;background:radial-gradient(64% 76% at 78% 20%,rgba(5,150,105,.10),transparent 72%)}
.r2x-hero:before{content:"";position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(rgba(5,150,105,.12) 1px,transparent 1.5px);background-size:22px 22px;mask:radial-gradient(55% 70% at 76% 35%,#000,transparent 78%);opacity:.45}
.r2x-wrap{height:100%;position:relative;z-index:1;display:flex;align-items:center}
.r2x-shell{width:100%;display:grid;grid-template-columns:minmax(0,.78fr) minmax(570px,1.22fr);grid-template-rows:auto auto;column-gap:42px;row-gap:16px;align-items:center}
.r2x-copy{align-self:center;transform:translateY(-34px)}
.r2x-copy h1{font-family:var(--display);font-weight:600;font-size:clamp(46px,5.45vw,72px);line-height:.98;letter-spacing:-.045em;max-width:10.8ch}
.r2x-copy h1 em{font-style:normal;background:linear-gradient(135deg,var(--r2x-dark),var(--r2x-bright));-webkit-background-clip:text;background-clip:text;color:transparent}
.r2x-copy p{margin-top:20px;max-width:46ch;font-size:15.5px;line-height:1.56;color:var(--mut)}
.r2x-demo{grid-column:2;grid-row:1 / span 2;align-self:center;position:relative;padding-bottom:34px}
.r2x-card{height:526px;border:1px solid rgba(5,150,105,.23);border-radius:24px;background:rgba(255,255,255,.97);overflow:hidden;box-shadow:0 38px 100px -48px rgba(4,120,87,.62),0 20px 48px -30px rgba(18,18,18,.42)}
.r2x-top{height:48px;padding:0 17px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--line);background:linear-gradient(180deg,#fff,#f8faf9);font-family:var(--mono);font-size:10.5px;color:var(--mut2)}
.r2x-lights{display:flex;gap:6px}.r2x-lights i{width:8px;height:8px;border-radius:50%;background:var(--wash3)}
.r2x-agent{display:flex;align-items:center;gap:7px;color:var(--r2x-dark);font-weight:700}.r2x-agent i{width:7px;height:7px;border-radius:50%;background:var(--r2x);box-shadow:0 0 0 4px var(--r2x-wash);animation:r2x-pulse 1.7s ease-in-out infinite}
.r2x-state{margin-left:auto;border:1px solid var(--r2x-line);background:var(--r2x-wash);color:var(--r2x-dark);border-radius:999px;padding:4px 9px;font-weight:700}
.r2x-screen{height:474px;position:relative;padding:14px 16px 15px}
.r2x-screen:after{content:"";position:absolute;z-index:0;left:16px;right:16px;top:58px;height:48px;pointer-events:none;background:linear-gradient(180deg,rgba(52,211,153,.12),rgba(52,211,153,0));animation:r2x-scan 3.5s ease-in-out infinite}
.r2x-screen-head{height:44px;border:1px solid var(--line);border-bottom:0;border-radius:17px 17px 0 0;padding:0 18px;display:flex;align-items:center;background:#fafafa;font:10.5px var(--mono);color:var(--mut2);position:relative;z-index:2}.r2x-screen-head span:last-child{margin-left:auto;color:var(--r2x-dark);font-weight:700}
.r2x-scene{height:400px;border:1px solid var(--line);border-radius:0 0 17px 17px;background:#fff;padding:28px 30px;position:relative;z-index:1;overflow:hidden;transition:opacity .22s ease,transform .26s ease}.r2x-scene.out{opacity:0;transform:translateY(5px)}
.r2x-k{font:700 10px var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--r2x-dark)}
.r2x-scene h3{font:600 29px/1.05 var(--display);letter-spacing:-.03em;margin:10px 0 11px;max-width:31ch}.r2x-scene p{font-size:14px;line-height:1.52;color:var(--mut);max-width:66ch}
.r2x-panel{margin-top:19px;border-radius:13px;background:#f6f7f6;padding:15px 16px;min-height:104px}.r2x-row{display:flex;align-items:center;gap:10px;font-size:13px}.r2x-row+.r2x-row{margin-top:9px}.r2x-row strong,.r2x-row b{color:#121212}.r2x-grow{flex:1}
.r2x-badge{margin-left:auto;font:700 9px var(--mono);border:1px solid var(--line);border-radius:999px;padding:4px 8px;color:var(--mut2);white-space:nowrap}.r2x-badge.green{border-color:var(--r2x-line);background:var(--r2x-wash);color:var(--r2x-dark)}
.r2x-prompt{display:flex;align-items:center;gap:10px;padding:10px 11px;background:#fff;border:1px solid var(--line);border-radius:10px;font-size:12.5px}.r2x-prompt+.r2x-prompt{margin-top:7px}.r2x-prompt .run{margin-left:auto;width:56px;height:6px;border-radius:99px;background:var(--wash2);overflow:hidden}.r2x-prompt .run i{display:block;height:100%;width:40%;background:linear-gradient(90deg,var(--r2x-dark),var(--r2x-bright));border-radius:99px;animation:r2x-run 1.4s ease-in-out infinite}
.r2x-engines{display:flex;gap:6px;flex-wrap:wrap;margin-top:12px}.r2x-engine{font:700 8.5px var(--mono);padding:4px 7px;border-radius:999px;border:1px solid var(--r2x-line);background:var(--r2x-wash);color:var(--r2x-dark)}
.r2x-ai-source{margin-top:18px}.r2x-airow{display:flex;align-items:center;gap:8px;padding:10px 12px;border:1px solid var(--line);border-radius:11px;background:#fafafa;font-size:12px}.r2x-airow b{font:700 9px var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--mut2)}.r2x-airow strong{margin-left:auto;color:var(--r2x-dark)}
.r2x-down{height:28px;display:grid;place-items:center;color:var(--r2x);font:700 18px var(--mono)}
.r2x-source{border:1.5px solid var(--r2x);border-radius:13px;background:var(--r2x-wash);padding:13px 14px}.r2x-source>strong{display:block;font-size:14px;margin-bottom:9px}.r2x-source-signals{display:grid;grid-template-columns:1fr 1fr;gap:8px}.r2x-source-signals span{background:#fff;border:1px solid var(--r2x-line);border-radius:9px;padding:9px 10px;font-size:11.5px;font-weight:600}
.r2x-conclusion{margin-top:9px;padding:9px 12px;border-radius:10px;background:#121212;color:#fff;font-size:11px}.r2x-conclusion span{color:rgba(255,255,255,.72)}
.r2x-mail{font-size:12.5px;line-height:1.58;color:#333}.r2x-mail b{color:#121212}.r2x-mail-lines{margin-top:10px}.r2x-mail-line{height:7px;border-radius:99px;background:#ddd;margin-top:7px;transform-origin:left center}.r2x-mail-line.green{background:#d1fae5}
.r2x-doc{background:#fff;border:1px solid var(--line);border-radius:11px;padding:12px 13px;margin-top:14px}.r2x-doc-title{font:600 13px/1.3 var(--display);margin-bottom:9px}.r2x-doc-line{height:7px;border-radius:99px;background:var(--wash2);margin-top:7px;transform-origin:left center}.r2x-doc-line.green{background:#d1fae5}
.r2x-approval{margin-top:18px;border-radius:12px;background:#f6f7f6;padding:4px 14px}.r2x-approval-row{display:flex;align-items:center;gap:11px;padding:12px 0;font-size:12.5px}.r2x-approval-row+.r2x-approval-row{border-top:1px solid var(--line2)}.r2x-approval-row b{min-width:74px}.r2x-approval-row span:nth-child(2){color:var(--mut);flex:1}
.r2x-result{display:flex;align-items:flex-end;gap:9px;margin:18px 0 12px}.r2x-before{font:600 27px/1 var(--display);color:var(--mut2);letter-spacing:-.04em}.r2x-arrowmetric{font:700 18px/1 var(--mono);color:var(--r2x);margin-bottom:3px}.r2x-big{font:700 52px/1 var(--display);letter-spacing:-.055em;color:var(--r2x-dark)}.r2x-up{font:700 10.5px var(--mono);color:var(--r2x-dark);margin-bottom:6px}
.r2x-progress{height:4px;background:var(--wash2);overflow:hidden}.r2x-progress span{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--r2x-dark),var(--r2x-bright));will-change:width}
.r2x-controls{position:absolute;left:50%;bottom:4px;z-index:20;transform:translateX(-50%);display:flex;align-items:center;gap:6px;padding:6px 8px;border:1px solid rgba(18,18,18,.12);border-radius:999px;background:rgba(255,255,255,.96);box-shadow:0 14px 34px -22px rgba(18,18,18,.45);backdrop-filter:blur(8px);white-space:nowrap}.r2x-dots{display:flex;align-items:center;gap:3px}.r2x-controls button{cursor:pointer;font:700 9px/1 var(--mono);transition:.16s}.r2x-dots button{width:24px;height:24px;border-radius:50%;padding:0;border:1px solid transparent;background:transparent;color:var(--mut2)}.r2x-dots button:hover,.r2x-dots button.active{border-color:var(--r2x-line);background:var(--r2x-wash);color:var(--r2x-dark)}.r2x-arrow{width:25px;height:25px;padding:0;border:0;border-radius:50%;background:transparent;color:var(--mut2);font-size:13px!important}.r2x-arrow:hover{background:var(--wash);color:var(--ink)}.r2x-toggle{padding:6px 9px;border:0;border-left:1px solid var(--line);border-right:1px solid var(--line);background:transparent;color:var(--ink)}.r2x-toggle:hover{color:var(--r2x-dark)}
.r2x-start{align-self:start;display:flex;gap:8px;width:min(100%,470px)}.r2x-start input{min-width:0;flex:1;height:50px;border:1px solid rgba(18,18,18,.15);border-radius:999px;padding:0 17px;font:14px var(--body);outline:none;background:#fff;box-shadow:0 12px 30px -26px rgba(18,18,18,.45)}.r2x-start input:focus{border-color:var(--r2x);box-shadow:0 0 0 3px rgba(5,150,105,.11)}.r2x-start button{height:50px;border:0;border-radius:999px;padding:0 18px;background:linear-gradient(135deg,var(--r2x-dark),var(--r2x));color:#fff;font:600 13.5px var(--body);cursor:pointer;white-space:nowrap}.r2x-note{grid-column:1;font:9px var(--mono);color:var(--mut2);margin-top:-10px}
@keyframes r2x-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.45;transform:scale(.82)}}
@keyframes r2x-scan{0%{transform:translateY(-100%);opacity:0}15%{opacity:.65}70%{opacity:.22}100%{transform:translateY(620%);opacity:0}}
@keyframes r2x-run{0%{transform:translateX(-100%)}50%{transform:translateX(130%)}100%{transform:translateX(280%)}}
@keyframes r2x-rise{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:none}}
@keyframes r2x-slide{from{opacity:0;transform:translateX(11px)}to{opacity:1;transform:none}}
@keyframes r2x-write{from{transform:scaleX(.06);opacity:.3}to{transform:scaleX(1);opacity:1}}
.r2x-scene.live>*{animation:r2x-rise .48s cubic-bezier(.22,.61,.36,1) both}.r2x-scene.live>*:nth-child(2){animation-delay:.08s}.r2x-scene.live>*:nth-child(3){animation-delay:.16s}.r2x-scene.live>*:nth-child(4){animation-delay:.24s}.r2x-scene.live .r2x-row,.r2x-scene.live .r2x-prompt,.r2x-scene.live .r2x-approval-row{animation:r2x-slide .5s cubic-bezier(.22,.61,.36,1) both}.r2x-scene.live .r2x-prompt:nth-child(2),.r2x-scene.live .r2x-row:nth-child(2),.r2x-scene.live .r2x-approval-row:nth-child(2){animation-delay:.15s}.r2x-scene.live .r2x-prompt:nth-child(3){animation-delay:.3s}.r2x-scene.live .r2x-doc-line,.r2x-scene.live .r2x-mail-line{animation:r2x-write .8s cubic-bezier(.22,.61,.36,1) both}.r2x-scene.live .r2x-doc-line:nth-child(3),.r2x-scene.live .r2x-mail-line:nth-child(2){animation-delay:.15s}.r2x-scene.live .r2x-doc-line:nth-child(4),.r2x-scene.live .r2x-mail-line:nth-child(3){animation-delay:.3s}.r2x-scene.live .r2x-doc-line:nth-child(5){animation-delay:.45s}
body:before{content:'STAGING · HERO V2 · PROMPT FIRST + CONTROLS';position:fixed;left:12px;bottom:12px;z-index:999999;background:#121212;color:#fff;padding:6px 9px;border-radius:999px;font:700 9px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em}
@media(max-width:900px){
.r2x-hero{height:auto;min-height:calc(100svh - 66px);padding:12px 0 16px;overflow:hidden}.r2x-wrap{align-items:stretch}.r2x-shell{grid-template-columns:1fr;grid-template-rows:auto auto auto auto;row-gap:10px;height:auto;align-items:stretch}.r2x-copy{grid-row:1;text-align:center;transform:none}.r2x-copy h1{font-size:clamp(35px,10.4vw,48px);line-height:.96;max-width:12ch;margin:0 auto}.r2x-copy p{font-size:12px;line-height:1.42;max-width:56ch;margin:10px auto 0}.r2x-demo{grid-column:1;grid-row:2;padding-bottom:31px}.r2x-card{height:342px;min-height:330px;border-radius:18px}.r2x-top{height:37px;padding:0 10px;font-size:8px}.r2x-screen{height:301px;padding:7px 9px 8px}.r2x-screen:after{left:9px;right:9px;top:39px;height:32px}.r2x-screen-head{height:29px;padding:0 9px;font-size:7.5px;border-radius:11px 11px 0 0}.r2x-scene{height:256px;border-radius:0 0 11px 11px;padding:11px 12px 44px}.r2x-k{font-size:7.5px}.r2x-scene h3{font-size:17px;margin:5px 0 6px;max-width:none}.r2x-scene p{font-size:9.2px;line-height:1.4}.r2x-panel{margin-top:8px;padding:7px 8px;min-height:52px}.r2x-row{font-size:8.5px}.r2x-row+.r2x-row{margin-top:5px}.r2x-badge{font-size:6.7px;padding:2px 5px}.r2x-prompt{padding:6px 7px;font-size:8.5px}.r2x-prompt+.r2x-prompt{margin-top:4px}.r2x-prompt .run{width:38px;height:4px}.r2x-engines{margin-top:6px;gap:3px}.r2x-engine{font-size:6px;padding:2px 4px}.r2x-ai-source{margin-top:8px}.r2x-airow{padding:6px 7px;font-size:8px;gap:4px}.r2x-airow b{font-size:6px}.r2x-down{height:15px;font-size:12px}.r2x-source{padding:7px 8px;border-radius:8px}.r2x-source>strong{font-size:9.5px;margin-bottom:5px}.r2x-source-signals{gap:4px}.r2x-source-signals span{padding:5px 6px;font-size:7.5px;border-radius:6px}.r2x-conclusion{margin-top:5px;padding:5px 7px;font-size:7.5px}.r2x-mail{font-size:8.5px;line-height:1.4}.r2x-mail-lines{margin-top:5px}.r2x-mail-line{height:4px;margin-top:4px}.r2x-doc{padding:6px 7px;margin-top:6px}.r2x-doc-title{font-size:9px;margin-bottom:4px}.r2x-doc-line{height:4px;margin-top:4px}.r2x-approval{margin-top:8px;padding:2px 8px}.r2x-approval-row{font-size:8px;padding:6px 0;gap:5px}.r2x-approval-row b{min-width:48px}.r2x-result{margin:8px 0 6px}.r2x-before{font-size:17px}.r2x-big{font-size:31px}.r2x-up{font-size:7px}.r2x-controls{bottom:4px;padding:4px 5px;gap:2px}.r2x-dots{gap:1px}.r2x-dots button{width:19px;height:19px;font-size:7px}.r2x-arrow{width:20px;height:20px;font-size:10px!important}.r2x-toggle{font-size:7px;padding:5px 5px}.r2x-start{grid-row:3;width:100%;gap:6px}.r2x-start input,.r2x-start button{height:42px}.r2x-start input{font-size:12px;padding:0 13px}.r2x-start button{font-size:11.5px;padding:0 13px}.r2x-note{grid-column:1;grid-row:4;text-align:center;margin:0;font-size:7px}
}
@media(max-width:520px){.r2x-copy h1{font-size:clamp(33px,9.8vw,42px)}.r2x-copy p{font-size:11px}.r2x-card{height:330px;min-height:318px}.r2x-screen{height:289px}.r2x-scene{height:244px}.r2x-start button span{display:none}}
@media(max-height:720px) and (max-width:900px){.r2x-copy h1{font-size:31px}.r2x-copy p{font-size:10px;line-height:1.35}.r2x-card{height:304px;min-height:294px}.r2x-screen{height:265px}.r2x-scene{height:220px}.r2x-start input,.r2x-start button{height:39px}}
@media(prefers-reduced-motion:reduce){.r2x-agent i,.r2x-screen:after,.r2x-prompt .run i,.r2x-scene.live>*,.r2x-scene.live .r2x-row,.r2x-scene.live .r2x-prompt,.r2x-scene.live .r2x-approval-row,.r2x-scene.live .r2x-doc-line,.r2x-scene.live .r2x-mail-line{animation:none!important}}
</style>`;

const SCRIPT = String.raw`<script data-ralf-staging-v2-direct>
(function(){
  var scene=document.getElementById('r2xScene'),state=document.getElementById('r2xState'),head=document.getElementById('r2xHead'),headState=document.getElementById('r2xHeadState'),progress=document.getElementById('r2xProgress'),controls=document.getElementById('r2xControls'),form=document.getElementById('r2xStart');
  if(!scene||!controls)return;
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stages=[
    {state:'Running prompts',head:'Finding prompts you should win',hs:'7 AI engines',html:'<div class="r2x-k">Prompt discovery</div><h3>Ralf runs the questions your customers are asking AI.</h3><p>It identifies the high-intent prompts your business should appear for, then checks who ChatGPT, Claude, Gemini and the other major AI engines recommend.</p><div class="r2x-panel"><div class="r2x-prompt"><b>“best API monitoring tool”</b><span class="run"><i></i></span></div><div class="r2x-prompt"><b>“API monitoring for startups”</b><span class="run"><i></i></span></div><div class="r2x-prompt"><b>“best alternative to Competitor A”</b><span class="run"><i></i></span></div><div class="r2x-engines"><span class="r2x-engine">ChatGPT</span><span class="r2x-engine">Claude</span><span class="r2x-engine">Gemini</span><span class="r2x-engine">Perplexity</span><span class="r2x-engine">Copilot</span><span class="r2x-engine">Grok</span><span class="r2x-engine">AI Overviews</span></div></div>'},
    {state:'Competitor winning',head:'Checking AI recommendations',hs:'gap found',html:'<div class="r2x-k">Where you are losing</div><h3>ChatGPT is recommending Competitor A instead of you.</h3><p>Ralf turns those prompt checks into a clear list of the questions your competitors are winning.</p><div class="r2x-panel"><div class="r2x-row"><b>Competitor A</b><span class="r2x-grow"></span><span class="r2x-badge green">recommended by 6 / 7</span></div><div class="r2x-row"><span>Your brand</span><span class="r2x-grow"></span><span class="r2x-badge">recommended by 0 / 7</span></div><div class="r2x-row"><span>Prompt</span><span class="r2x-grow"></span><b>“best API monitoring tool”</b></div></div>'},
    {state:'Source + citation found',head:'Why this page matters',hs:'competitor + AI citation',html:'<div class="r2x-k">The connection Ralf found</div><h3>We found a page recommending your competitor — and AI is citing it.</h3><p>That combination matters: this page is helping shape the same AI answers where your competitor is beating you.</p><div class="r2x-ai-source"><div class="r2x-airow"><b>AI engines</b><span class="r2x-badge">ChatGPT</span><span class="r2x-badge">Gemini</span><strong>cite this page</strong></div><div class="r2x-down">↓</div><div class="r2x-source"><strong>nordicapis.com/monitoring-tools</strong><div class="r2x-source-signals"><span>✓ Recommends Competitor A</span><span>✓ Cited by ChatGPT + Gemini</span></div></div><div class="r2x-conclusion"><b>Ralf found the opportunity →</b> <span>Get your brand included on a source AI already trusts.</span></div></div>'},
    {state:'Outreach drafted',head:'Influencing the sites AI trusts',hs:'publisher found',html:'<div class="r2x-k">Off-site influence</div><h3>Ralf gets your brand into the sources AI already trusts.</h3><p>It finds the right publisher and drafts personalised outreach using the exact page and competitor evidence it found.</p><div class="r2x-panel r2x-mail"><b>To:</b> editor@nordicapis.com<br><b>Subject:</b> A useful addition to your monitoring guide<br><br>Your guide already covers the tools AI recommends. We have fresh latency data and a free tier your readers may find useful…<div class="r2x-mail-lines"><div class="r2x-mail-line green" style="width:94%"></div><div class="r2x-mail-line" style="width:80%"></div><div class="r2x-mail-line" style="width:66%"></div></div></div>'},
    {state:'Content drafted',head:'Writing content on your site',hs:'your site · draft ready',html:'<div class="r2x-k">On-site content</div><h3>Ralf also writes the content AI needs to find on your own site.</h3><p>Influencing other sites is only half the job. Ralf writes the missing articles and pages on your site, fact-checks them, adds internal links and structures them so AI engines can understand and quote you.</p><div class="r2x-doc"><div class="r2x-doc-title">Best API monitoring tools in 2026</div><div class="r2x-doc-line green" style="width:94%"></div><div class="r2x-doc-line" style="width:82%"></div><div class="r2x-doc-line" style="width:88%"></div><div class="r2x-doc-line" style="width:64%"></div></div><div class="r2x-row" style="margin-top:10px"><span>Written for your website · fact-checked · internal links added</span><span class="r2x-badge green">ready to review</span></div>'},
    {state:'Ready for you',head:'Review & approve',hs:'you stay in control',html:'<div class="r2x-k">Approval</div><h3>Review the work before anything is published or sent.</h3><p>Ralf prepares the outreach and content. You can approve, edit or reject each action.</p><div class="r2x-approval"><div class="r2x-approval-row"><b>Outreach</b><span>nordicapis.com personalised pitch</span><span class="r2x-badge green">Approve & send</span></div><div class="r2x-approval-row"><b>Content</b><span>“Best API monitoring tools in 2026”</span><span class="r2x-badge green">Approve & publish</span></div></div>'},
    {state:'Result tracked',head:'Measuring what worked',hs:'loop updated',html:'<div class="r2x-k">Outcome</div><h3>You got cited. Your AI visibility increased.</h3><p>Ralf tracks new citations, backlinks and recommendations, then uses the result to find the next opportunity.</p><div class="r2x-panel"><div class="r2x-result"><span class="r2x-before">68</span><span class="r2x-arrowmetric">→</span><span class="r2x-big" data-from="68" data-to="74">74</span><span class="r2x-up">AI visibility · +6 points</span></div><div class="r2x-row"><span>nordicapis.com now includes your brand</span><span class="r2x-badge green">citation won</span></div><div class="r2x-row"><span>ChatGPT now recommends you for this question</span><span class="r2x-badge green">new</span></div></div>'}
  ];
  var durations=[5600,5200,6200,6000,6200,5200,5800],current=0,timer=null,swapTimer=null,userPaused=false;
  var dots=[].slice.call(controls.querySelectorAll('[data-stage]')),prev=controls.querySelector('[data-prev]'),nextBtn=controls.querySelector('[data-next]'),toggle=controls.querySelector('[data-toggle]');
  function motion(){scene.classList.remove('live');if(reduced)return;void scene.offsetWidth;scene.classList.add('live');var big=scene.querySelector('.r2x-big[data-to]');if(big){var from=+big.dataset.from,to=+big.dataset.to,start=performance.now(),dur=1300;big.textContent=from;requestAnimationFrame(function tick(now){var p=Math.min(1,(now-start)/dur),e=1-Math.pow(1-p,3);big.textContent=Math.round(from+(to-from)*e);if(p<1)requestAnimationFrame(tick);});}}
  function sync(){dots.forEach(function(d,i){var on=i===current;d.classList.toggle('active',on);d.setAttribute('aria-pressed',on?'true':'false');});toggle.textContent=userPaused?'Play':'Pause';toggle.setAttribute('aria-label',userPaused?'Resume animation':'Pause animation');}
  function progressFor(i){var start=(i/stages.length)*100,end=((i+1)/stages.length)*100;progress.style.transition='none';progress.style.width=start+'%';if(reduced||userPaused){progress.style.width=end+'%';return;}requestAnimationFrame(function(){requestAnimationFrame(function(){progress.style.transition='width '+durations[i]+'ms linear';progress.style.width=end+'%';});});}
  function render(i,instant){current=(i+stages.length)%stages.length;var s=stages[current];state.textContent=s.state;head.textContent=s.head;headState.textContent=s.hs;sync();progressFor(current);clearTimeout(swapTimer);if(instant||reduced){scene.innerHTML=s.html;scene.classList.remove('out');motion();return;}scene.classList.add('out');swapTimer=setTimeout(function(){scene.innerHTML=s.html;scene.classList.remove('out');motion();},220);}
  function schedule(){clearTimeout(timer);if(userPaused||reduced)return;timer=setTimeout(function(){render(current+1,false);schedule();},durations[current]);}
  dots.forEach(function(d){d.addEventListener('click',function(){userPaused=true;clearTimeout(timer);render(+d.dataset.stage,false);});});
  prev.addEventListener('click',function(){userPaused=true;clearTimeout(timer);render(current-1,false);});
  nextBtn.addEventListener('click',function(){userPaused=true;clearTimeout(timer);render(current+1,false);});
  toggle.addEventListener('click',function(){userPaused=!userPaused;clearTimeout(timer);render(current,true);if(!userPaused)schedule();});
  render(0,true);if(!reduced)schedule();
  document.addEventListener('visibilitychange',function(){if(document.hidden){clearTimeout(timer);clearTimeout(swapTimer);}else if(!reduced&&!userPaused){render(current,true);schedule();}});
  if(form)form.addEventListener('submit',function(e){e.preventDefault();var input=document.getElementById('r2xUrl'),button=form.querySelector('button');if(!input||!input.value)return;button.textContent='Ralf would start here ✓';setTimeout(function(){button.innerHTML='<span>Get Ralf working </span>→';},1700);});
})();
</script>`;

export default async function handler(req, res) {
  try {
    const sourceRef = process.env.VERCEL_GIT_COMMIT_SHA || 'master';
    const sourceUrl = `https://raw.githubusercontent.com/benshevlane/ralf-seo/${sourceRef}/index.html`;
    const upstream = await fetch(sourceUrl, { headers: { 'user-agent': 'Ralf-Staging-V2-Direct/1.0' }, cache: 'no-store' });
    if (!upstream.ok) throw new Error(`Staging homepage source returned ${upstream.status}`);
    let html = await upstream.text();

    const heroPattern = /<header class="heroB"[\s\S]*?<\/header>/;
    if (!heroPattern.test(html)) throw new Error('Could not find homepage hero');
    html = html.replace(heroPattern, HERO_HTML);
    html = html.replace('</head>', `${STYLES}\n<meta name="robots" content="noindex,nofollow,noarchive">\n</head>`);
    html = html.replace('</body>', `${SCRIPT}\n</body>`);

    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 'no-store, max-age=0');
    res.setHeader('x-robots-tag', 'noindex, nofollow, noarchive');
    res.setHeader('x-ralf-staging', 'hero-v2-direct-prompt-first-controls');
    res.status(200).send(html);
  } catch (error) {
    console.error('staging-v2-direct failed', error);
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 'no-store');
    res.status(500).send(`<!doctype html><title>Ralf staging error</title><style>body{font:16px system-ui;padding:40px;max-width:720px;margin:auto}code{background:#f4f4f4;padding:3px 6px;border-radius:5px}</style><h1>Ralf staging could not render V2</h1><p><code>${String(error?.message || error).replace(/[<>&]/g, '')}</code></p>`);
  }
}
