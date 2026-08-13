import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();

const BASE_CSS = String.raw`
<style data-ralf-emerald-preview="base">
:root{
  --accent:#059669;
  --accent-deep:#047857;
  --accent-bright:#34d399;
  --accent-wash:#ecfdf5;
  --accent-wash-2:#d1fae5;
  --accent-line:#a7f3d0;
  --accent-glow:rgba(5,150,105,.18);
  --accent-grad:linear-gradient(135deg,var(--accent-deep),var(--accent));
}
::selection{background:var(--accent-deep);color:#fff}
:focus-visible{outline-color:var(--accent-deep)}
.btn:not(.ghost),.oh-send,.bdpub,.pflag{
  background:var(--accent-grad);border-color:var(--accent-deep);color:#fff;
  box-shadow:0 8px 22px -12px rgba(4,120,87,.72)
}
.btn:not(.ghost):hover,.oh-send:hover,.bdpub:hover{opacity:1;box-shadow:0 12px 28px -13px rgba(4,120,87,.75)}
.eyebrow .dot,.heroB .stack .hchip .pdot,.live .pulse,.sp .speye b{background:var(--accent)}
.rotator .rw,.rotator .rot-fallback{
  background:linear-gradient(135deg,var(--accent-deep),var(--accent-bright));
  -webkit-background-clip:text;background-clip:text;color:transparent
}
.kicker .ix,.blockB .rail .ix{color:var(--accent-deep)}
.blockB .rail .big{color:var(--accent-wash-2)}
.vfill:not(.g),.spark .b.cur,.ck,.fx.ok,.tag.gap,.sxp,.stick{background:var(--accent-grad);border-color:var(--accent-deep);color:#fff}
.tag.gap{box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)}
.model:hover,.link:hover,.faq details[open] summary{color:var(--accent-deep)}
.link:hover{border-color:var(--accent-deep)}
.pcard.feat{border-color:var(--accent-deep);box-shadow:0 26px 64px -34px rgba(4,120,87,.42)}
.heroB::before{background:radial-gradient(58% 64% at 84% 26%,rgba(5,150,105,.10),transparent 70%)}
.final{position:relative;overflow:hidden}
.final::before{content:"";position:absolute;inset:auto 10% -72% 10%;height:320px;background:radial-gradient(closest-side,rgba(5,150,105,.13),transparent);pointer-events:none}
.final .wrap{position:relative;z-index:1}
</style>`;

const HERO_CSS = String.raw`
<style data-ralf-emerald-preview="hero">
.rh-stack{position:relative}
.rh-loop{position:relative;border-radius:22px;overflow:hidden;background:rgba(255,255,255,.96);border-color:rgba(5,150,105,.22)!important;box-shadow:0 30px 80px -42px rgba(4,120,87,.42),0 16px 38px -28px rgba(18,18,18,.34)!important}
.rh-loop::before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(420px 220px at 86% -12%,rgba(52,211,153,.15),transparent 72%);z-index:0}
.rh-top{height:46px;padding:0 15px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--line);background:linear-gradient(180deg,#fff,rgba(244,244,243,.72));position:relative;z-index:2}
.rh-lights{display:flex;gap:6px}.rh-lights i{width:8px;height:8px;border-radius:50%;background:var(--wash3)}
.rh-product{display:flex;align-items:center;gap:7px;margin-left:4px;font-family:var(--mono);font-size:10.5px;color:var(--mut2);letter-spacing:.02em}
.rh-product .rh-spark{width:13px;height:13px;color:var(--accent)}
.rh-step-count{margin-left:auto;font-family:var(--mono);font-size:10px;color:var(--accent-deep);background:var(--accent-wash);border:1px solid var(--accent-line);border-radius:999px;padding:3px 8px;font-weight:700;letter-spacing:.04em}
.rh-stage{position:relative;min-height:416px;z-index:1;overflow:hidden}
.rh-panel{position:absolute;inset:0;padding:25px 25px 22px;display:grid;grid-template-rows:auto 1fr;gap:19px;opacity:0;visibility:hidden;transform:translateX(18px);transition:opacity .42s ease,transform .48s cubic-bezier(.22,.61,.36,1),visibility .42s;pointer-events:none}
.rh-panel.is-active{opacity:1;visibility:visible;transform:none;pointer-events:auto}
.rh-kicker{font-family:var(--mono);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent-deep);font-weight:700;margin-bottom:9px}
.rh-copy h2{font-family:var(--display);font-size:clamp(21px,2.2vw,27px);line-height:1.08;letter-spacing:-.028em;max-width:15ch}
.rh-copy p{font-size:13.5px;line-height:1.5;color:var(--mut);margin-top:10px;max-width:46ch}
.rh-visual{align-self:end;background:rgba(255,255,255,.92);border:1px solid var(--line);border-radius:14px;overflow:hidden;box-shadow:0 18px 44px -32px rgba(18,18,18,.42);position:relative}
.rh-vhead{min-height:36px;padding:9px 12px;display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--line2);font-family:var(--mono);font-size:9.5px;color:var(--mut2);letter-spacing:.02em;background:rgba(244,244,243,.58)}
.rh-running{margin-left:auto;display:inline-flex;align-items:center;gap:6px;color:var(--accent-deep)}
.rh-running i{width:6px;height:6px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 4px var(--accent-wash)}
.rh-rows{padding:10px}
.rh-row{min-height:38px;display:flex;align-items:center;gap:9px;padding:7px 8px;border-radius:9px;font-size:11.5px;color:#33332e}
.rh-row+.rh-row{margin-top:3px}.rh-row.is-hot{background:var(--accent-wash);box-shadow:inset 0 0 0 1px rgba(167,243,208,.78)}
.rh-ic{width:21px;height:21px;flex:0 0 21px;border-radius:7px;display:grid;place-items:center;background:var(--wash);font-family:var(--mono);font-size:9px;font-weight:700;color:var(--mut)}
.rh-row.is-hot .rh-ic{background:var(--accent-wash-2);color:var(--accent-deep)}
.rh-row strong{font-weight:600;color:var(--ink)}
.rh-tag{margin-left:auto;white-space:nowrap;font-family:var(--mono);font-size:8.5px;border:1px solid var(--line);border-radius:999px;padding:3px 7px;color:var(--mut2);background:#fff}
.rh-tag.is-green{color:var(--accent-deep);border-color:var(--accent-line);background:var(--accent-wash);font-weight:700}
.rh-scanline{position:absolute;left:10px;right:10px;height:31px;top:45px;border-radius:9px;background:linear-gradient(180deg,rgba(52,211,153,.18),rgba(52,211,153,0));pointer-events:none;animation:rh-scan 2.5s ease-in-out infinite}
@keyframes rh-scan{0%,100%{transform:translateY(0);opacity:.3}50%{transform:translateY(118px);opacity:.95}}
.rh-rank{width:26px;height:26px;flex:0 0 26px;border-radius:8px;display:grid;place-items:center;background:var(--wash);font-family:var(--mono);font-size:10px;font-weight:700}
.rh-row.is-hot .rh-rank{background:var(--accent-grad);color:#fff}
.rh-score{margin-left:auto;font-family:var(--mono);font-size:9px;color:var(--mut2)}
.rh-score b{display:block;color:var(--accent-deep);font-size:11px;text-align:right}
.rh-source{display:flex;align-items:center;gap:10px;min-width:0;flex:1}
.rh-source>div{min-width:0}.rh-source strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rh-source span{display:block;font-family:var(--mono);font-size:8.5px;color:var(--mut2);margin-top:1px}
.rh-email .rh-field{display:flex;gap:8px;padding:7px 11px;border-bottom:1px solid var(--line2);font-size:10.5px;color:var(--mut2)}
.rh-email .rh-field b{font-weight:600;color:var(--ink)}
.rh-email-body{padding:11px 12px 12px;min-height:83px;font-size:11px;line-height:1.48;color:#33332e}
.rh-caret{display:inline-block;width:2px;height:1em;background:var(--accent);vertical-align:-2px;margin-left:2px;animation:rh-blink 1s steps(2) infinite}
@keyframes rh-blink{50%{opacity:0}}
.rh-email-foot{display:flex;align-items:center;justify-content:space-between;padding:9px 11px;border-top:1px solid var(--line2);background:rgba(244,244,243,.45)}
.rh-draft-state{font-family:var(--mono);font-size:8.5px;color:var(--accent-deep)}
.rh-send{font-family:var(--mono);font-size:9px;font-weight:700;color:#fff;background:var(--accent-grad);border-radius:7px;padding:6px 10px}
.rh-doc{padding:14px 14px 13px}.rh-doc-title{height:12px;width:74%;border-radius:5px;background:var(--ink);opacity:.9;margin-bottom:13px}
.rh-line{height:7px;border-radius:999px;background:var(--wash2);margin:8px 0}.rh-line.green{background:var(--accent-wash-2)}
.rh-doc-foot{display:flex;align-items:center;justify-content:space-between;margin-top:12px;padding-top:10px;border-top:1px solid var(--line2)}
.rh-chip{font-family:var(--mono);font-size:8.5px;color:var(--accent-deep);background:var(--accent-wash);border:1px solid var(--accent-line);padding:4px 7px;border-radius:999px}
.rh-ready{font-family:var(--mono);font-size:8.5px;color:var(--mut2)}
.rh-fixes{padding:10px 12px}.rh-fix{display:flex;align-items:center;gap:9px;padding:8px 0;font-size:11px}.rh-fix+.rh-fix{border-top:1px solid var(--line2)}
.rh-ok{width:20px;height:20px;flex:0 0 20px;border-radius:50%;display:grid;place-items:center;background:var(--accent-grad);color:#fff;font-size:10px;font-weight:700}
.rh-fix>div{flex:1}.rh-fix strong{display:block;font-weight:600}.rh-fix span{font-family:var(--mono);font-size:8.5px;color:var(--mut2);display:block;margin-top:1px}
.rh-approval{font-family:var(--mono);font-size:8px;color:var(--accent-deep);background:var(--accent-wash);border:1px solid var(--accent-line);padding:3px 6px;border-radius:999px;white-space:nowrap}
.rh-progress{height:3px;background:var(--wash2);position:relative;z-index:2;overflow:hidden}.rh-progress span{display:block;height:100%;background:var(--accent-grad);transform:scaleX(0);transform-origin:left center}
.rh-controls{height:49px;padding:0 13px;display:flex;align-items:center;gap:9px;border-top:1px solid var(--line2);background:rgba(244,244,243,.62);position:relative;z-index:2}
.rh-control{width:30px;height:30px;border:1px solid var(--line);border-radius:50%;display:grid;place-items:center;background:#fff;color:var(--ink);cursor:pointer;transition:border-color .18s,color .18s,transform .18s;padding:0}
.rh-control:hover{border-color:var(--accent-deep);color:var(--accent-deep);transform:translateY(-1px)}.rh-control svg{width:13px;height:13px}
.rh-dots{display:flex;align-items:center;justify-content:center;gap:7px;flex:1}.rh-dot{width:7px;height:7px;border:0;border-radius:50%;background:var(--wash3);padding:0;cursor:pointer;transition:transform .2s,background .2s}.rh-dot.is-active{background:var(--accent);transform:scale(1.35)}
.rh-toggle{width:auto;border-radius:999px;padding:0 10px;gap:6px;font-family:var(--mono);font-size:8.5px}.rh-toggle .rh-play{display:none}.rh-loop.is-user-paused .rh-toggle .rh-pause{display:none}.rh-loop.is-user-paused .rh-toggle .rh-play{display:inline}
.rh-caption{text-align:center;margin-top:14px;font-family:var(--mono);font-size:10px;letter-spacing:.05em;color:var(--mut2)}
@media(max-width:900px){.rh-stage{min-height:406px}.rh-loop{max-width:620px;margin:0 auto}.rh-caption{margin-bottom:6px}}
@media(max-width:560px){.rh-panel{padding:21px 18px 18px}.rh-stage{min-height:408px}.rh-copy h2{font-size:22px}.rh-copy p{font-size:13px}.rh-tag{display:none}.rh-controls{padding:0 9px}.rh-toggle{padding:0 8px}.rh-vhead{font-size:9px}}
@media(prefers-reduced-motion:reduce){.rh-panel{transition:none}.rh-scanline,.rh-caret{animation:none}.rh-progress span{display:none}}
</style>`;

const HERO_MARKUP = String.raw`<div class="stack rh-stack" data-ralf-emerald-preview="animation">
      <div class="hchip"><span class="pdot"></span>Ralf workflow · running</div>
      <div class="mm rh-loop" id="rhLoop" tabindex="0" aria-roledescription="carousel" aria-label="How Ralf turns AI visibility gaps into action">
        <div class="rh-top">
          <span class="rh-lights" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="rh-product"><svg class="rh-spark" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c1.1 6 4.9 9.8 11 12-6.1 2.2-9.9 6-11 12-1.1-6-4.9-9.8-11-12 6.1-2.2 9.9-6 11-12Z"/></svg>how Ralf works</span>
          <span class="rh-step-count" id="rhStepCount">01 / 06</span>
        </div>
        <div class="rh-stage" aria-live="polite">
          <article class="rh-panel is-active" data-rh-panel aria-hidden="false">
            <div class="rh-copy"><div class="rh-kicker">01 · Search</div><h2>Scan the prompts worth winning.</h2><p>Ralf checks the buying questions your customers ask across AI engines, then prioritises the ones that can move the business.</p></div>
            <div class="rh-visual">
              <div class="rh-vhead"><span>Prompt scan</span><span class="rh-running"><i></i>scanning 7 models</span></div>
              <div class="rh-rows">
                <div class="rh-row is-hot"><span class="rh-ic">Q</span><strong>best API monitoring tool</strong><span class="rh-tag is-green">high intent</span></div>
                <div class="rh-row"><span class="rh-ic">Q</span>API uptime monitoring<span class="rh-tag">tracking</span></div>
                <div class="rh-row"><span class="rh-ic">Q</span>synthetic API testing tools<span class="rh-tag is-green">high intent</span></div>
                <div class="rh-row"><span class="rh-ic">Q</span>how to monitor API latency<span class="rh-tag">tracking</span></div>
              </div>
              <span class="rh-scanline" aria-hidden="true"></span>
            </div>
          </article>

          <article class="rh-panel" data-rh-panel aria-hidden="true">
            <div class="rh-copy"><div class="rh-kicker">02 · Diagnose</div><h2>See who AI names instead of you.</h2><p>Every answer becomes a clear competitive gap: who won, how often they appeared, and where your brand was missing.</p></div>
            <div class="rh-visual">
              <div class="rh-vhead"><span>“best API monitoring tool” · mentions</span><span class="rh-running"><i></i>complete</span></div>
              <div class="rh-rows">
                <div class="rh-row is-hot"><span class="rh-rank">1</span><strong>Competitor A</strong><span class="rh-score"><b>6 / 7</b>models</span></div>
                <div class="rh-row"><span class="rh-rank">2</span><strong>Competitor B</strong><span class="rh-score"><b>5 / 7</b>models</span></div>
                <div class="rh-row"><span class="rh-rank">3</span><strong>Competitor C</strong><span class="rh-score"><b>3 / 7</b>models</span></div>
                <div class="rh-row" style="opacity:.55"><span class="rh-rank">—</span><strong>Your brand</strong><span class="rh-score"><b>0 / 7</b>not named</span></div>
              </div>
            </div>
          </article>

          <article class="rh-panel" data-rh-panel aria-hidden="true">
            <div class="rh-copy"><div class="rh-kicker">03 · Trace</div><h2>Find the pages behind those answers.</h2><p>Ralf traces citations and competitor backlinks to the publishers that already influence what AI recommends.</p></div>
            <div class="rh-visual">
              <div class="rh-vhead"><span>Source pages behind the answer</span><span class="rh-running"><i></i>3 opportunities</span></div>
              <div class="rh-rows">
                <div class="rh-row is-hot"><span class="rh-ic">↗</span><span class="rh-source"><div><strong>nordicapis.com / monitoring-tools</strong><span>cited by ChatGPT · competitor included</span></div></span><span class="rh-tag is-green">94 priority</span></div>
                <div class="rh-row"><span class="rh-ic">↗</span><span class="rh-source"><div><strong>g2.com / api-monitoring</strong><span>cited by Gemini · you absent</span></div></span><span class="rh-tag">81 priority</span></div>
                <div class="rh-row"><span class="rh-ic">↗</span><span class="rh-source"><div><strong>devblog.io / api-stack</strong><span>competitor backlink · verified</span></div></span><span class="rh-tag">76 priority</span></div>
              </div>
            </div>
          </article>

          <article class="rh-panel" data-rh-panel aria-hidden="true">
            <div class="rh-copy"><div class="rh-kicker">04 · Outreach</div><h2>Draft the pitch in context.</h2><p>The page, competitor mention and likely reason to include you are carried into a tailored draft, ready for approval.</p></div>
            <div class="rh-visual rh-email">
              <div class="rh-vhead"><span>Outreach · citation opportunity</span><span class="rh-running"><i></i>drafting</span></div>
              <div class="rh-field"><span>To</span><b>editor@nordicapis.com</b></div>
              <div class="rh-field"><span>Subject</span><b>A useful addition to your monitoring guide</b></div>
              <div class="rh-email-body"><span data-rh-email></span><span class="rh-caret" aria-hidden="true"></span></div>
              <div class="rh-email-foot"><span class="rh-draft-state">evidence attached · awaiting approval</span><span class="rh-send">Review draft →</span></div>
            </div>
          </article>

          <article class="rh-panel" data-rh-panel aria-hidden="true">
            <div class="rh-copy"><div class="rh-kicker">05 · Content</div><h2>Write the page that should exist.</h2><p>When the gap belongs on your own site, Ralf drafts content in your voice and structures it so search engines can quote it.</p></div>
            <div class="rh-visual">
              <div class="rh-vhead"><span>Draft · API monitoring in 2026</span><span class="rh-running"><i></i>fact-checking</span></div>
              <div class="rh-doc">
                <div class="rh-doc-title"></div>
                <div class="rh-line"></div><div class="rh-line" style="width:91%"></div>
                <div class="rh-line green" style="width:84%"></div>
                <div class="rh-line" style="width:66%"></div>
                <div class="rh-doc-foot"><span class="rh-chip">structured for AI citation</span><span class="rh-ready">draft ready to review</span></div>
              </div>
            </div>
          </article>

          <article class="rh-panel" data-rh-panel aria-hidden="true">
            <div class="rh-copy"><div class="rh-kicker">06 · Site health</div><h2>Fix what stops AI finding you.</h2><p>Schema, internal links and crawl issues become safe, explainable changes that stay behind an approval gate.</p></div>
            <div class="rh-visual">
              <div class="rh-vhead"><span>Site structure · fixes prepared</span><span class="rh-running"><i></i>3 ready</span></div>
              <div class="rh-fixes">
                <div class="rh-fix"><span class="rh-ok">✓</span><div><strong>Schema markup</strong><span>FAQ + SoftwareApplication</span></div><span class="rh-approval">approve</span></div>
                <div class="rh-fix"><span class="rh-ok">✓</span><div><strong>Internal links</strong><span>12 relevant links added</span></div><span class="rh-approval">approve</span></div>
                <div class="rh-fix"><span class="rh-ok">✓</span><div><strong>Crawl path</strong><span>orphan page connected</span></div><span class="rh-approval">approve</span></div>
              </div>
            </div>
          </article>
        </div>
        <div class="rh-progress" aria-hidden="true"><span id="rhProgress"></span></div>
        <div class="rh-controls">
          <button class="rh-control" id="rhPrev" type="button" aria-label="Previous workflow step"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 5l-7 7 7 7"/></svg></button>
          <div class="rh-dots" id="rhDots" aria-label="Choose a workflow step"></div>
          <button class="rh-control rh-toggle" id="rhToggle" type="button" aria-label="Pause animation"><span class="rh-pause">Pause</span><span class="rh-play">Play</span></button>
          <button class="rh-control" id="rhNext" type="button" aria-label="Next workflow step"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 5l7 7-7 7"/></svg></button>
        </div>
      </div>
      <div class="rh-caption">Search → diagnose → execute → learn · one connected loop</div>
    </div>`;

const HERO_JS = String.raw`
<script data-ralf-emerald-preview="hero-js">
(function(){
  var root=document.getElementById('rhLoop');
  if(!root)return;
  var panels=[].slice.call(root.querySelectorAll('[data-rh-panel]'));
  var dotsWrap=document.getElementById('rhDots');
  var count=document.getElementById('rhStepCount');
  var progress=document.getElementById('rhProgress');
  var prev=document.getElementById('rhPrev');
  var next=document.getElementById('rhNext');
  var toggle=document.getElementById('rhToggle');
  var email=root.querySelector('[data-rh-email]');
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var durations=[4700,4400,4700,5900,4800,4800];
  var emailCopy='Hi — your API monitoring guide already includes two tools AI recommends. We have fresh latency data and a free tier your readers may find useful. Would you consider reviewing it for the next update?';
  var current=0,userPaused=reduce,hoverPaused=false,focusPaused=false,inView=true,timer=null,typeTimer=null;

  function running(){return !reduce&&!userPaused&&!hoverPaused&&!focusPaused&&inView;}
  function clearWork(){if(timer){clearTimeout(timer);timer=null;}if(typeTimer){clearTimeout(typeTimer);typeTimer=null;}}
  function pad(n){return n<9?'0'+(n+1):String(n+1);}
  function setToggle(){
    root.classList.toggle('is-user-paused',userPaused);
    toggle.setAttribute('aria-label',userPaused?'Play animation':'Pause animation');
  }
  function buildDots(){
    panels.forEach(function(_,i){
      var b=document.createElement('button');
      b.type='button';b.className='rh-dot';b.setAttribute('aria-label','Show workflow step '+(i+1));
      b.addEventListener('click',function(){userPaused=true;setToggle();show(i);});
      dotsWrap.appendChild(b);
    });
  }
  function typeEmail(){
    if(!email)return;
    if(current!==3){email.textContent='';return;}
    if(reduce){email.textContent=emailCopy;return;}
    email.textContent='';var i=0;
    (function tick(){
      if(current!==3)return;
      if(!running()){typeTimer=setTimeout(tick,120);return;}
      email.textContent=emailCopy.slice(0,i);i++;
      if(i<=emailCopy.length)typeTimer=setTimeout(tick,18+(emailCopy.charAt(i-1)===' '?14:0));
    })();
  }
  function arm(){
    if(timer){clearTimeout(timer);timer=null;}
    progress.style.transition='none';progress.style.transform='scaleX(0)';void progress.offsetWidth;
    if(!running())return;
    progress.style.transition='transform '+durations[current]+'ms linear';
    requestAnimationFrame(function(){progress.style.transform='scaleX(1)';});
    timer=setTimeout(function(){show((current+1)%panels.length);},durations[current]);
  }
  function show(i){
    clearWork();current=(i+panels.length)%panels.length;
    panels.forEach(function(p,ix){var active=ix===current;p.classList.toggle('is-active',active);p.setAttribute('aria-hidden',active?'false':'true');});
    [].slice.call(dotsWrap.children).forEach(function(d,ix){d.classList.toggle('is-active',ix===current);d.setAttribute('aria-current',ix===current?'step':'false');});
    count.textContent=pad(current)+' / '+(panels.length<10?'0':'')+panels.length;
    typeEmail();arm();
  }
  function refresh(){setToggle();arm();}
  buildDots();
  prev.addEventListener('click',function(){userPaused=true;setToggle();show(current-1);});
  next.addEventListener('click',function(){userPaused=true;setToggle();show(current+1);});
  toggle.addEventListener('click',function(){userPaused=!userPaused;refresh();});
  root.addEventListener('mouseenter',function(){hoverPaused=true;arm();});
  root.addEventListener('mouseleave',function(){hoverPaused=false;arm();});
  root.addEventListener('focusin',function(){focusPaused=true;arm();});
  root.addEventListener('focusout',function(){setTimeout(function(){focusPaused=root.contains(document.activeElement);arm();},0);});
  root.addEventListener('keydown',function(e){
    if(e.key==='ArrowLeft'){e.preventDefault();userPaused=true;setToggle();show(current-1);}
    if(e.key==='ArrowRight'){e.preventDefault();userPaused=true;setToggle();show(current+1);}
  });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){entries.forEach(function(entry){inView=entry.isIntersecting;arm();});},{threshold:.28});
    io.observe(root);
  }
  setToggle();show(0);
})();
</script>`;

function replaceBalancedDiv(source, marker, replacement) {
  const start = source.indexOf(marker);
  if (start < 0) throw new Error('Hero stack marker not found');
  const openEnd = source.indexOf('>', start);
  if (openEnd < 0) throw new Error('Hero stack opening tag is malformed');
  const tags = /<div\b[^>]*>|<\/div\s*>/gi;
  tags.lastIndex = openEnd + 1;
  let depth = 1;
  let match;
  while ((match = tags.exec(source))) {
    if (/^<div\b/i.test(match[0])) depth += 1;
    else depth -= 1;
    if (depth === 0) return source.slice(0, start) + replacement + source.slice(tags.lastIndex);
  }
  throw new Error('Could not find the end of the hero stack');
}

async function htmlFiles(dir) {
  const found = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === '.vercel' || entry.name === 'node_modules' || entry.name === 'dist') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...await htmlFiles(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) found.push(full);
  }
  return found;
}

const files = await htmlFiles(root);
let patched = 0;
for (const file of files) {
  let html = await readFile(file, 'utf8');
  if (!html.includes('</head>') || html.includes('data-ralf-emerald-preview')) continue;
  const isHome = path.resolve(file) === path.join(root, 'index.html');
  if (isHome) {
    const heroStart = html.indexOf('<header class="heroB">');
    const heroEnd = html.indexOf('</header>', heroStart);
    if (heroStart < 0 || heroEnd < 0) throw new Error('Homepage hero could not be located');
    const hero = html.slice(heroStart, heroEnd);
    const nextHero = replaceBalancedDiv(hero, '<div class="stack">', HERO_MARKUP);
    html = html.slice(0, heroStart) + nextHero + html.slice(heroEnd);
    html = html.replace('</head>', BASE_CSS + '\n' + HERO_CSS + '\n</head>');
    html = html.replace('</body>', HERO_JS + '\n</body>');
  } else {
    html = html.replace('</head>', BASE_CSS + '\n</head>');
  }
  await writeFile(file, html, 'utf8');
  patched += 1;
}

console.log('Emerald preview applied to ' + patched + ' HTML files; homepage workflow animation installed.');
