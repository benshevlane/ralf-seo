export default async function handler(req, res) {
  try {
    const host = req.headers.host;
    if (!host) throw new Error('Missing host header');

    const proto = (req.headers['x-forwarded-proto'] || 'https').toString().split(',')[0].trim();
    const sourceUrl = `${proto}://${host}/api/staging-home-expanded`;
    const upstream = await fetch(sourceUrl, {
      headers: { 'user-agent': 'Ralf-Staging-Reviewable/1.0' },
      cache: 'no-store',
    });

    if (!upstream.ok) throw new Error(`Expanded staging hero returned ${upstream.status}`);
    let html = await upstream.text();

    // Stage zero: show Ralf actively finding and running the prompts the business should win.
    const stageMarker = "  var stages=[\n    {";
    const promptStage = String.raw`  var stages=[
    {
      state:'Running prompts',head:'Finding prompts you should win',hs:'7 AI engines',
      html:'<div class="r2-k">Prompt discovery</div><h3>Ralf runs the questions your customers are asking AI.</h3><p>It identifies the high-intent prompts your business should appear for, then checks who ChatGPT, Claude, Gemini and the other major AI engines recommend.</p><div class="r2-metric"><div class="r2-line"><b>“best API monitoring tool”</b><span class="r2-badge green">running</span></div><div class="r2-line"><b>“API monitoring for startups”</b><span class="r2-badge green">running</span></div><div class="r2-line"><b>“best alternative to Competitor A”</b><span class="r2-badge green">running</span></div><div class="r2-line"><span>ChatGPT · Claude · Gemini · Perplexity · Copilot · Grok · AI Overviews</span><span class="r2-badge green">7 engines</span></div></div>'
    },
    {`;
    if (!html.includes(stageMarker)) throw new Error('Could not find animation stage array');
    html = html.replace(stageMarker, promptStage);

    // The hidden old six-step rail is no longer authoritative; the review controls below are.
    html = html.replace("if(!scene||steps.length!==6)return;", "if(!scene)return;");

    // Seven readable stages, with the prompt-running opener getting a full five seconds.
    const oldTiming = "var durations=[4600,5400,5400,5400,4600,5200],current=0,timer=null,sceneSwap=null;";
    const newTiming = "var durations=[5000,4600,5400,5400,5400,4600,5200],current=0,timer=null,sceneSwap=null,userPaused=false,controlDots=[];";
    if (!html.includes(oldTiming)) throw new Error('Could not find animation timing');
    html = html.replace(oldTiming, newTiming);

    html = html.replace(
      "if(reduced){progress.style.width=end+'%';return;}",
      "if(reduced||userPaused){progress.style.width=end+'%';return;}"
    );

    const renderMarker = "state.textContent=s.state;head.textContent=s.head;headState.textContent=s.hs;animateProgress(i);";
    if (!html.includes(renderMarker)) throw new Error('Could not find animation render marker');
    html = html.replace(
      renderMarker,
      "state.textContent=s.state;head.textContent=s.head;headState.textContent=s.hs;controlDots.forEach(function(d,x){d.classList.toggle('is-active',x===i);d.setAttribute('aria-pressed',x===i?'true':'false');});animateProgress(i);"
    );

    const scheduleMarker = "function schedule(){clearTimeout(timer);timer=setTimeout(next,durations[current]);}";
    if (!html.includes(scheduleMarker)) throw new Error('Could not find animation scheduler');
    html = html.replace(
      scheduleMarker,
      "function schedule(){clearTimeout(timer);if(userPaused||reduced)return;timer=setTimeout(next,durations[current]);}"
    );

    const startMarker = "  render(reduced?5:0,true);if(!reduced)schedule();";
    if (!html.includes(startMarker)) throw new Error('Could not find animation start marker');
    const controlsJs = String.raw`  var controls=document.getElementById('r2Manual');
  if(controls){
    controlDots=[].slice.call(controls.querySelectorAll('[data-r2-stage]'));
    var prevControl=controls.querySelector('[data-r2-prev]');
    var nextControl=controls.querySelector('[data-r2-next]');
    var toggleControl=controls.querySelector('[data-r2-toggle]');
    function syncControls(){
      controlDots.forEach(function(d,x){d.classList.toggle('is-active',x===current);d.setAttribute('aria-pressed',x===current?'true':'false');});
      if(toggleControl){toggleControl.textContent=userPaused?'Play':'Pause';toggleControl.setAttribute('aria-label',userPaused?'Resume animation':'Pause animation');}
    }
    controlDots.forEach(function(btn,ix){btn.addEventListener('click',function(){userPaused=true;clearTimeout(timer);render(ix,false);syncControls();});});
    if(prevControl)prevControl.addEventListener('click',function(){userPaused=true;clearTimeout(timer);render((current-1+stages.length)%stages.length,false);syncControls();});
    if(nextControl)nextControl.addEventListener('click',function(){userPaused=true;clearTimeout(timer);render((current+1)%stages.length,false);syncControls();});
    if(toggleControl)toggleControl.addEventListener('click',function(){
      userPaused=!userPaused;
      clearTimeout(timer);
      syncControls();
      render(current,true);
      if(!userPaused)schedule();
    });
    syncControls();
  }
  render(0,true);if(!reduced)schedule();`;
    html = html.replace(startMarker, controlsJs);

    const cardEndMarker = `          <div class="r2-progress"><span id="r2Progress"></span></div>\n        </div>\n      </div>\n      <form class="r2-start"`;
    const manualControls = `          <div class="r2-progress"><span id="r2Progress"></span></div>\n        </div>\n        <div class="r2-manual" id="r2Manual" aria-label="Animation controls">\n          <button type="button" class="r2-navctl" data-r2-prev aria-label="Previous stage">←</button>\n          <div class="r2-stagectl" aria-label="Choose animation stage">\n            <button type="button" data-r2-stage aria-label="Stage 1: Run prompts" aria-pressed="true">1</button>\n            <button type="button" data-r2-stage aria-label="Stage 2: Find competitor gap" aria-pressed="false">2</button>\n            <button type="button" data-r2-stage aria-label="Stage 3: Find cited source" aria-pressed="false">3</button>\n            <button type="button" data-r2-stage aria-label="Stage 4: Outreach" aria-pressed="false">4</button>\n            <button type="button" data-r2-stage aria-label="Stage 5: Content" aria-pressed="false">5</button>\n            <button type="button" data-r2-stage aria-label="Stage 6: Review and approve" aria-pressed="false">6</button>\n            <button type="button" data-r2-stage aria-label="Stage 7: Track result" aria-pressed="false">7</button>\n          </div>\n          <button type="button" class="r2-toggle-ctl" data-r2-toggle aria-label="Pause animation">Pause</button>\n          <button type="button" class="r2-navctl" data-r2-next aria-label="Next stage">→</button>\n        </div>\n      </div>\n      <form class="r2-start"`;
    if (!html.includes(cardEndMarker)) throw new Error('Could not place manual animation controls');
    html = html.replace(cardEndMarker, manualControls);

    const controlCss = String.raw`<style data-ralf-v2="review-controls">
.r2-demo{position:relative}
.r2-card{position:relative}
.r2-manual{position:absolute;left:50%;bottom:-18px;z-index:20;transform:translateX(-50%);display:flex;align-items:center;gap:6px;padding:6px 8px;border:1px solid rgba(18,18,18,.12);border-radius:999px;background:rgba(255,255,255,.96);box-shadow:0 14px 34px -22px rgba(18,18,18,.45);backdrop-filter:blur(8px);white-space:nowrap}
.r2-stagectl{display:flex;align-items:center;gap:3px}
.r2-stagectl button,.r2-navctl,.r2-toggle-ctl{border:1px solid transparent;background:transparent;color:var(--mut2);font:700 9px/1 var(--mono);cursor:pointer;transition:background .16s,border-color .16s,color .16s,transform .16s}
.r2-stagectl button{width:23px;height:23px;border-radius:50%;padding:0}
.r2-stagectl button:hover,.r2-stagectl button.is-active{border-color:#a7f3d0;background:#ecfdf5;color:#047857}
.r2-navctl{width:24px;height:24px;border-radius:50%;font-size:13px;padding:0}
.r2-navctl:hover{background:var(--wash);color:var(--ink)}
.r2-toggle-ctl{padding:6px 8px;border-left:1px solid var(--line);border-right:1px solid var(--line);color:var(--ink)}
.r2-toggle-ctl:hover{color:#047857}
@media(max-width:900px){
  .r2-manual{bottom:6px;padding:4px 5px;gap:3px;background:rgba(255,255,255,.94)}
  .r2-stagectl{gap:1px}.r2-stagectl button{width:20px;height:20px;font-size:7.5px}.r2-navctl{width:20px;height:20px;font-size:11px}.r2-toggle-ctl{font-size:7.5px;padding:5px 6px}
  .r2-scene{padding-bottom:48px!important}
}
@media(max-width:420px){
  .r2-stagectl button{width:18px;height:18px}.r2-manual{gap:1px}.r2-toggle-ctl{padding-left:4px;padding-right:4px}
}
</style>`;
    html = html.replace('</head>', `${controlCss}\n<style data-ralf-staging-reviewable>body:before{content:'STAGING · HERO V2 · PROMPT FIRST + CONTROLS';}</style>\n</head>`);

    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 'no-store, max-age=0');
    res.setHeader('x-robots-tag', 'noindex, nofollow, noarchive');
    res.setHeader('x-ralf-staging', 'hero-v2-prompt-first-controls');
    res.status(200).send(html);
  } catch (error) {
    console.error('staging-home-reviewable failed', error);
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 'no-store');
    res.status(500).send(`<!doctype html><title>Ralf staging error</title><style>body{font:16px system-ui;padding:40px;max-width:700px;margin:auto}code{background:#f4f4f4;padding:3px 6px;border-radius:5px}</style><h1>Ralf staging could not render the reviewable animation</h1><p><code>${String(error?.message || error).replace(/[<>&]/g, '')}</code></p>`);
  }
}
