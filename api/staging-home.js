const PROD_HOME = 'https://ralfhq.com/';
const BUILD_SCRIPT = 'https://raw.githubusercontent.com/benshevlane/ralf-seo/fa56d476f8464f1010c4fa067dc40a85dde07721/scripts/build-emerald-hero-v2.mjs';

const SIX_STAGE_FLOW = String.raw`<div class="r2-flow" id="r2Flow">
  <div class="r2-step is-active"><span class="r2-dot">1</span><div><strong>Find where competitors beat you</strong><small>AI recommendations</small></div></div>
  <div class="r2-step"><span class="r2-dot">2</span><div><strong>Find out why</strong><small>sources & backlinks</small></div></div>
  <div class="r2-step"><span class="r2-dot">3</span><div><strong>Create content</strong><small>fill content gaps</small></div></div>
  <div class="r2-step"><span class="r2-dot">4</span><div><strong>Run outreach</strong><small>earn citations</small></div></div>
  <div class="r2-step"><span class="r2-dot">5</span><div><strong>Review & approve</strong><small>you stay in control</small></div></div>
  <div class="r2-step"><span class="r2-dot">6</span><div><strong>Track results</strong><small>see what worked</small></div></div>
</div>`;

const HERO_LAYOUT_PATCH = String.raw`<style data-ralf-v2="layout-patch">
/* Six clear stages above a large product screen. */
.r2-card{height:510px}
.r2-body{display:grid;grid-template-columns:1fr;grid-template-rows:auto minmax(0,1fr);gap:13px;padding:14px 16px 14px;height:402px}
.r2-flow{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px;padding:0 3px;position:relative}
.r2-flow::before{left:8.5%;right:8.5%;top:14px;bottom:auto;width:auto;height:1px}
.r2-step{min-height:58px;display:flex;align-items:flex-start;gap:7px;transform:none!important;padding-right:2px}
.r2-dot{width:28px;height:28px;flex-basis:28px;font-size:9px}
.r2-step strong{font-size:11.5px;line-height:1.15;color:inherit;white-space:normal}
.r2-step small{font-size:8.5px;line-height:1.25;margin-top:3px;white-space:normal}
.r2-step.is-active .r2-dot{box-shadow:0 0 0 5px rgba(5,150,105,.10)}
.r2-detail{width:100%;min-height:0;border-radius:16px;box-shadow:0 18px 42px -34px rgba(18,18,18,.35)}
.r2-detail-head{height:42px;padding:0 14px;font-size:10px}
.r2-scene{padding:20px 22px}
.r2-k{font-size:9.5px}
.r2-scene h3{font-size:24px;line-height:1.06;margin:9px 0 9px;max-width:30ch}
.r2-scene p{font-size:13px;line-height:1.5;max-width:62ch}
.r2-metric{margin-top:16px;padding:13px 14px;min-height:86px}
.r2-line{font-size:12px}.r2-line+.r2-line{margin-top:8px}
.r2-badge{font-size:8.5px;padding:4px 8px}
.r2-mail{font-size:11.5px;line-height:1.55}
.r2-big{font-size:44px}.r2-up{font-size:10px}
.r2-before{font:600 22px/1 var(--display);color:var(--mut2);letter-spacing:-.04em}
.r2-arrow{font:700 18px/1 var(--mono);color:#059669;margin:0 2px 3px}
.r2-result{align-items:flex-end;gap:8px}
.r2-doc{background:#fff;border:1px solid var(--line);border-radius:10px;padding:10px 11px;margin-top:10px}
.r2-doc-title{font:600 12px/1.3 var(--display);color:var(--ink);margin-bottom:8px}
.r2-doc-line{height:6px;border-radius:99px;background:var(--wash2);margin-top:6px;transform-origin:left center}
.r2-doc-line.green{background:#d1fae5}
.r2-approval-row{display:flex;align-items:center;gap:10px;padding:8px 0;font-size:11.5px}
.r2-approval-row+.r2-approval-row{border-top:1px solid var(--line2)}
.r2-approval-row b{min-width:65px}.r2-approval-row span:nth-child(2){color:var(--mut);flex:1}

/* Visible but calm motion inside each stage. */
@keyframes r2-step-pulse{0%,100%{box-shadow:0 0 0 5px rgba(5,150,105,.09)}50%{box-shadow:0 0 0 10px rgba(5,150,105,.02)}}
@keyframes r2-item-rise{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:none}}
@keyframes r2-row-slide{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:none}}
@keyframes r2-screen-scan{0%{transform:translateY(-110%);opacity:0}12%{opacity:.62}65%{opacity:.2}100%{transform:translateY(560%);opacity:0}}
@keyframes r2-badge-pop{0%{transform:scale(.9);opacity:.4}55%{transform:scale(1.05);opacity:1}100%{transform:scale(1);opacity:1}}
@keyframes r2-doc-write{from{transform:scaleX(.08);opacity:.35}to{transform:scaleX(1);opacity:1}}
@keyframes r2-mail-reveal{from{clip-path:inset(0 0 100% 0)}to{clip-path:inset(0 0 0 0)}}
.r2-step.is-active .r2-dot{animation:r2-step-pulse 1.7s ease-in-out infinite}
.r2-detail{isolation:isolate}
.r2-detail::after{content:"";position:absolute;z-index:0;left:0;right:0;top:42px;height:44px;pointer-events:none;background:linear-gradient(180deg,rgba(52,211,153,.10),rgba(52,211,153,0));animation:r2-screen-scan 3.1s ease-in-out infinite}
.r2-detail-head,.r2-scene{position:relative;z-index:1}
.r2-scene.r2-live-motion>*{animation:r2-item-rise .48s cubic-bezier(.22,.61,.36,1) both}
.r2-scene.r2-live-motion>*:nth-child(2){animation-delay:.08s}.r2-scene.r2-live-motion>*:nth-child(3){animation-delay:.16s}.r2-scene.r2-live-motion>*:nth-child(4){animation-delay:.24s}
.r2-scene.r2-live-motion .r2-line,.r2-scene.r2-live-motion .r2-approval-row{animation:r2-row-slide .5s cubic-bezier(.22,.61,.36,1) both}
.r2-scene.r2-live-motion .r2-line:nth-child(2),.r2-scene.r2-live-motion .r2-approval-row:nth-child(2){animation-delay:.16s}
.r2-scene.r2-live-motion .r2-badge.green{animation:r2-badge-pop .55s ease .22s both}
.r2-scene.r2-live-motion .r2-mail{animation:r2-mail-reveal 1.15s cubic-bezier(.22,.61,.36,1) .18s both}
.r2-scene.r2-live-motion .r2-doc-line{animation:r2-doc-write .75s cubic-bezier(.22,.61,.36,1) both}
.r2-scene.r2-live-motion .r2-doc-line:nth-child(3){animation-delay:.12s}.r2-scene.r2-live-motion .r2-doc-line:nth-child(4){animation-delay:.24s}.r2-scene.r2-live-motion .r2-doc-line:nth-child(5){animation-delay:.36s}

@media(max-width:900px){
  .r2-card{height:370px;min-height:350px}
  .r2-body{grid-template-columns:1fr;grid-template-rows:auto minmax(0,1fr);gap:8px;padding:8px 10px 9px;height:calc(100% - 84px)}
  .r2-flow{gap:2px;padding:0}
  .r2-flow::before{left:8.5%;right:8.5%;top:11px}
  .r2-step{min-height:42px;display:block;text-align:center;padding:0}
  .r2-dot{width:22px;height:22px;margin:0 auto 5px;flex-basis:22px;font-size:8px}
  .r2-step strong{font-size:8.7px;white-space:normal;line-height:1.05}
  .r2-step small{display:none}
  .r2-detail-head{height:30px;padding:0 10px;font-size:8px}
  .r2-detail::after{top:30px;height:32px}
  .r2-scene{padding:11px 12px}
  .r2-scene h3{font-size:17px;margin:5px 0 6px;max-width:none}
  .r2-scene p{font-size:9.5px;line-height:1.43}
  .r2-metric{margin-top:8px;padding:8px 9px;min-height:54px}
  .r2-line{font-size:9px}.r2-line+.r2-line{margin-top:5px}
  .r2-badge{font-size:7.2px;padding:2px 5px}
  .r2-mail{font-size:9px;line-height:1.42}
  .r2-big{font-size:30px}.r2-before{font-size:17px}.r2-up{font-size:8px}
  .r2-doc{padding:7px 8px;margin-top:6px}.r2-doc-title{font-size:9px;margin-bottom:5px}.r2-doc-line{height:4px;margin-top:4px}
  .r2-approval-row{font-size:8.7px;padding:5px 0;gap:6px}.r2-approval-row b{min-width:49px}
}
@media(max-width:520px){
  .r2-card{height:358px;min-height:342px}
  .r2-step strong{font-size:7.8px}
  .r2-body{padding-left:8px;padding-right:8px}
}
@media(max-height:720px) and (max-width:900px){
  .r2-card{height:332px;min-height:316px}
  .r2-step{min-height:36px}.r2-dot{width:20px;height:20px;margin-bottom:3px}
  .r2-scene h3{font-size:15px}.r2-scene p{font-size:8.7px}.r2-metric{min-height:46px;padding:6px 8px}
}
@media(prefers-reduced-motion:reduce){.r2-step.is-active .r2-dot,.r2-detail::after,.r2-scene.r2-live-motion>*,.r2-scene.r2-live-motion .r2-line,.r2-scene.r2-live-motion .r2-approval-row,.r2-scene.r2-live-motion .r2-badge.green,.r2-scene.r2-live-motion .r2-mail,.r2-scene.r2-live-motion .r2-doc-line{animation:none!important;clip-path:none!important}}
</style>`;

const SIX_STAGE_JS = String.raw`<script data-ralf-v2="six-stage-js">
(function(){
  var scene=document.getElementById('r2Scene'),state=document.getElementById('r2State'),head=document.getElementById('r2Head'),headState=document.getElementById('r2HeadState'),progress=document.getElementById('r2Progress'),steps=[].slice.call(document.querySelectorAll('.r2-step')),form=document.getElementById('r2Start');
  if(!scene||steps.length!==6)return;
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stages=[
    {
      state:'Competitor winning',head:'Checking AI recommendations',hs:'7 AI engines',
      html:'<div class="r2-k">Where you are losing</div><h3>ChatGPT is recommending Competitor A instead of you.</h3><p>Ralf checks the questions your customers ask across ChatGPT, Claude, Gemini, Perplexity and other AI engines.</p><div class="r2-metric"><div class="r2-line"><b>Competitor A</b><span class="r2-badge green">recommended by 6 / 7</span></div><div class="r2-line"><span>Your brand</span><span class="r2-badge">recommended by 0 / 7</span></div></div>'
    },
    {
      state:'Reason found',head:'Finding out why',hs:'evidence traced',
      html:'<div class="r2-k">Why they are winning</div><h3>This page is helping your competitor get recommended.</h3><p>Ralf traces the websites, articles and backlinks influencing those AI answers.</p><div class="r2-metric"><div class="r2-line"><b>nordicapis.com/monitoring-tools</b><span class="r2-badge green">94 priority</span></div><div class="r2-line"><span>Mentions Competitor A · not you</span><span class="r2-badge">cited by ChatGPT + Gemini</span></div></div>'
    },
    {
      state:'Content drafted',head:'Creating missing content',hs:'draft in progress',
      html:'<div class="r2-k">Content gap</div><h3>Ralf writes the page you are missing.</h3><p>The same visibility gap becomes a useful article built around what customers are asking and structured so AI engines can understand and quote it.</p><div class="r2-doc"><div class="r2-doc-title">Best API monitoring tools in 2026</div><div class="r2-doc-line green" style="width:94%"></div><div class="r2-doc-line" style="width:82%"></div><div class="r2-doc-line" style="width:88%"></div><div class="r2-doc-line" style="width:64%"></div></div><div class="r2-line" style="margin-top:9px"><span>Fact-checked · internal links added</span><span class="r2-badge green">ready to review</span></div>'
    },
    {
      state:'Outreach drafted',head:'Reaching sites influencing AI',hs:'target verified',
      html:'<div class="r2-k">Citation opportunity</div><h3>Ralf asks the publisher already influencing AI to include you too.</h3><p>It finds the right contact and drafts a personalised pitch using the exact page and competitor evidence it found.</p><div class="r2-metric r2-mail"><b>To:</b> editor@nordicapis.com<br><b>Subject:</b> A useful addition to your monitoring guide<br><br>Your guide already covers the tools AI recommends. We have fresh latency data and a free tier your readers may find useful…</div>'
    },
    {
      state:'Ready for you',head:'Review & approve',hs:'you stay in control',
      html:'<div class="r2-k">Approval</div><h3>Review the work before anything is published or sent.</h3><p>Ralf prepares the content and outreach. You can approve, edit or reject each action.</p><div class="r2-metric"><div class="r2-approval-row"><b>Content</b><span>“Best API monitoring tools in 2026”</span><span class="r2-badge green">Approve & publish</span></div><div class="r2-approval-row"><b>Outreach</b><span>nordicapis.com personalised pitch</span><span class="r2-badge green">Approve & send</span></div></div>'
    },
    {
      state:'Result tracked',head:'Measuring what worked',hs:'loop updated',
      html:'<div class="r2-k">Outcome</div><h3>You got cited. Your AI visibility increased.</h3><p>Ralf tracks new citations, backlinks and recommendations, then uses the result to find the next opportunity.</p><div class="r2-metric"><div class="r2-result"><span class="r2-before">68</span><span class="r2-arrow">→</span><span class="r2-big" data-from="68" data-to="74">74</span><span class="r2-up">AI visibility · +6 points</span></div><div class="r2-line"><span>nordicapis.com now includes your brand</span><span class="r2-badge green">citation won</span></div><div class="r2-line"><span>ChatGPT now recommends you for this question</span><span class="r2-badge green">new</span></div></div>'
    }
  ];
  /* Slow enough to read: content and outreach get the longest dwell time. */
  var durations=[4600,4600,5400,5400,4600,5200],current=0,timer=null,sceneSwap=null;

  function replayMotion(){
    scene.classList.remove('r2-live-motion');
    if(reduced)return;
    void scene.offsetWidth;
    scene.classList.add('r2-live-motion');
    var big=scene.querySelector('.r2-big[data-to]');
    if(big){
      var from=parseInt(big.getAttribute('data-from'),10)||0,to=parseInt(big.getAttribute('data-to'),10)||0,start=performance.now(),dur=1100;
      big.textContent=String(from);
      requestAnimationFrame(function tick(now){
        var p=Math.min(1,(now-start)/dur),e=1-Math.pow(1-p,3);
        big.textContent=String(Math.round(from+(to-from)*e));
        if(p<1)requestAnimationFrame(tick);
      });
    }
  }

  function animateProgress(i){
    var start=(i/stages.length)*100,end=((i+1)/stages.length)*100;
    progress.style.transition='none';progress.style.width=start+'%';
    if(reduced){progress.style.width=end+'%';return;}
    requestAnimationFrame(function(){requestAnimationFrame(function(){progress.style.transition='width '+durations[i]+'ms linear';progress.style.width=end+'%';});});
  }

  function render(i,instant){
    current=i;var s=stages[i];
    steps.forEach(function(el,x){
      el.classList.toggle('is-active',x===i);el.classList.toggle('is-done',x<i);
      var dot=el.querySelector('.r2-dot');if(dot)dot.textContent=x<i?'✓':String(x+1);
    });
    state.textContent=s.state;head.textContent=s.head;headState.textContent=s.hs;animateProgress(i);
    clearTimeout(sceneSwap);
    if(instant||reduced){scene.innerHTML=s.html;scene.classList.remove('out');replayMotion();return;}
    scene.classList.add('out');
    sceneSwap=setTimeout(function(){scene.innerHTML=s.html;scene.classList.remove('out');replayMotion();},230);
  }

  function schedule(){clearTimeout(timer);timer=setTimeout(next,durations[current]);}
  function next(){
    var n=(current+1)%stages.length;
    if(n===0){steps.forEach(function(el,x){el.classList.remove('is-done');var dot=el.querySelector('.r2-dot');if(dot)dot.textContent=String(x+1);});}
    render(n,false);schedule();
  }

  render(reduced?5:0,true);if(!reduced)schedule();
  document.addEventListener('visibilitychange',function(){
    if(document.hidden){clearTimeout(timer);clearTimeout(sceneSwap);}
    else if(!reduced){render(current,true);schedule();}
  });
  if(form)form.addEventListener('submit',function(e){
    e.preventDefault();var b=form.querySelector('button'),v=document.getElementById('r2Url');if(!v||!v.value)return;
    b.textContent='Ralf would start here ✓';setTimeout(function(){b.innerHTML='<span class="r2-long">Get Ralf working </span>→';},1800);
  });
})();
</script>`;

function template(source, name) {
  const marker = `const ${name} = String.raw\``;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Missing ${name}`);
  const bodyStart = start + marker.length;
  const end = source.indexOf('`;', bodyStart);
  if (end < 0) throw new Error(`Unclosed ${name}`);
  return source.slice(bodyStart, end);
}

function replaceFlow(hero) {
  const startMarker = '<div class="r2-flow" id="r2Flow">';
  const endMarker = '<div class="r2-detail">';
  const start = hero.indexOf(startMarker);
  const end = hero.indexOf(endMarker, start);
  if (start < 0 || end < 0) throw new Error('Hero workflow could not be replaced');
  return hero.slice(0, start) + SIX_STAGE_FLOW + '\n            ' + hero.slice(end);
}

export default async function handler(req, res) {
  try {
    const [pageResponse, buildResponse] = await Promise.all([
      fetch(PROD_HOME, { headers: { 'user-agent': 'Ralf-Staging/2.0' }, cache: 'no-store' }),
      fetch(BUILD_SCRIPT, { headers: { 'user-agent': 'Ralf-Staging/2.0' }, cache: 'no-store' }),
    ]);

    if (!pageResponse.ok) throw new Error(`Production homepage returned ${pageResponse.status}`);
    if (!buildResponse.ok) throw new Error(`V2 build source returned ${buildResponse.status}`);

    let html = await pageResponse.text();
    const source = await buildResponse.text();
    const baseCss = template(source, 'BASE_CSS');
    const heroCss = template(source, 'HERO_CSS');
    let hero = template(source, 'HERO');
    hero = replaceFlow(hero);

    const heroStart = html.indexOf('<header class="heroB">');
    const heroEnd = html.indexOf('</header>', heroStart);
    if (heroStart < 0 || heroEnd < 0) throw new Error('Production hero not found');

    html = html.slice(0, heroStart) + hero + html.slice(heroEnd + '</header>'.length);
    html = html.replace('</head>', `${baseCss}\n${heroCss}\n${HERO_LAYOUT_PATCH}\n<style data-ralf-staging>body:before{content:'STAGING · HERO V2 · 6 STAGES';position:fixed;left:12px;bottom:12px;z-index:999999;background:#121212;color:#fff;padding:6px 9px;border-radius:999px;font:700 9px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em}</style>\n</head>`);
    html = html.replace('</body>', `${SIX_STAGE_JS}\n</body>`);
    html = html.replace(/<meta name="robots"[^>]*>/i, '<meta name="robots" content="noindex,nofollow,noarchive">');
    html = html.replace(/\s*<!-- Google tag \(gtag\.js\) -->\s*<script async[\s\S]*?<\/script>\s*<script>[\s\S]*?<\/script>/i, '');

    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 'no-store, max-age=0');
    res.setHeader('x-robots-tag', 'noindex, nofollow,noarchive');
    res.setHeader('x-ralf-staging', 'hero-v2-six-stage');
    res.status(200).send(html);
  } catch (error) {
    console.error('staging-home failed', error);
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 'no-store');
    res.status(500).send(`<!doctype html><title>Ralf staging error</title><style>body{font:16px system-ui;padding:40px;max-width:700px;margin:auto}code{background:#f4f4f4;padding:3px 6px;border-radius:5px}</style><h1>Ralf staging could not render Version 2</h1><p><code>${String(error?.message || error).replace(/[<>&]/g, '')}</code></p>`);
  }
}
