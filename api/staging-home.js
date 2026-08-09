const PROD_HOME = 'https://ralfhq.com/';
const BUILD_SCRIPT = 'https://raw.githubusercontent.com/benshevlane/ralf-seo/fa56d476f8464f1010c4fa067dc40a85dde07721/scripts/build-emerald-hero-v2.mjs';

const HERO_LAYOUT_PATCH = String.raw`<style data-ralf-v2="layout-patch">
/* Put the workflow above the actual product screen so the screen can dominate the animation. */
.r2-card{height:500px}
.r2-body{display:grid;grid-template-columns:1fr;grid-template-rows:auto minmax(0,1fr);gap:13px;padding:14px 16px 14px;height:392px}
.r2-flow{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;padding:0 4px;position:relative}
.r2-flow::before{left:10%;right:10%;top:14px;bottom:auto;width:auto;height:1px}
.r2-step{min-height:48px;display:flex;align-items:flex-start;gap:8px;transform:none!important;padding-right:2px}
.r2-dot{width:28px;height:28px;flex-basis:28px;font-size:9px}
.r2-step strong{font-size:12.5px;line-height:1.18;color:inherit;white-space:nowrap}
.r2-step small{font-size:9px;line-height:1.3;margin-top:3px;white-space:nowrap}
.r2-step.is-active .r2-dot{box-shadow:0 0 0 5px rgba(5,150,105,.10)}
.r2-detail{width:100%;min-height:0;border-radius:16px;box-shadow:0 18px 42px -34px rgba(18,18,18,.35)}
.r2-detail-head{height:42px;padding:0 14px;font-size:10px}
.r2-scene{padding:20px 22px}
.r2-k{font-size:9.5px}
.r2-scene h3{font-size:24px;line-height:1.06;margin:9px 0 9px;max-width:28ch}
.r2-scene p{font-size:13px;line-height:1.5;max-width:58ch}
.r2-metric{margin-top:16px;padding:13px 14px;min-height:86px}
.r2-line{font-size:12px}.r2-line+.r2-line{margin-top:8px}
.r2-badge{font-size:8.5px;padding:4px 8px}
.r2-mail{font-size:11.5px;line-height:1.55}
.r2-big{font-size:44px}.r2-up{font-size:10px}

/* More visible movement inside each screen, not only between screens. */
@keyframes r2-step-pulse{0%,100%{box-shadow:0 0 0 5px rgba(5,150,105,.09)}50%{box-shadow:0 0 0 10px rgba(5,150,105,.02)}}
@keyframes r2-item-rise{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:none}}
@keyframes r2-row-slide{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:none}}
@keyframes r2-screen-scan{0%{transform:translateY(-110%);opacity:0}12%{opacity:.7}65%{opacity:.26}100%{transform:translateY(520%);opacity:0}}
@keyframes r2-badge-pop{0%{transform:scale(.9);opacity:.4}55%{transform:scale(1.05);opacity:1}100%{transform:scale(1);opacity:1}}
.r2-step.is-active .r2-dot{animation:r2-step-pulse 1.5s ease-in-out infinite}
.r2-detail{isolation:isolate}
.r2-detail::after{content:"";position:absolute;z-index:0;left:0;right:0;top:42px;height:44px;pointer-events:none;background:linear-gradient(180deg,rgba(52,211,153,.12),rgba(52,211,153,0));animation:r2-screen-scan 2.35s ease-in-out infinite}
.r2-detail-head,.r2-scene{position:relative;z-index:1}
.r2-scene.r2-live-motion>*{animation:r2-item-rise .42s cubic-bezier(.22,.61,.36,1) both}
.r2-scene.r2-live-motion>*:nth-child(2){animation-delay:.06s}.r2-scene.r2-live-motion>*:nth-child(3){animation-delay:.12s}.r2-scene.r2-live-motion>*:nth-child(4){animation-delay:.18s}
.r2-scene.r2-live-motion .r2-line{animation:r2-row-slide .45s cubic-bezier(.22,.61,.36,1) both}
.r2-scene.r2-live-motion .r2-line:nth-child(2){animation-delay:.13s}
.r2-scene.r2-live-motion .r2-badge.green{animation:r2-badge-pop .5s ease .18s both}
.r2-scene.r2-live-motion .r2-mail{clip-path:inset(0 0 100% 0);animation:r2-mail-reveal .9s cubic-bezier(.22,.61,.36,1) .12s forwards}
@keyframes r2-mail-reveal{to{clip-path:inset(0 0 0 0)}}

@media(max-width:900px){
  .r2-card{height:354px;min-height:334px}
  .r2-body{grid-template-columns:1fr;grid-template-rows:auto minmax(0,1fr);gap:8px;padding:8px 10px 9px;height:calc(100% - 84px)}
  .r2-flow{gap:2px;padding:0}
  .r2-flow::before{left:10%;right:10%;top:11px}
  .r2-step{min-height:36px;display:block;text-align:center;padding:0}
  .r2-dot{width:22px;height:22px;margin:0 auto 5px;flex-basis:22px;font-size:8px}
  .r2-step strong{font-size:9.5px;white-space:normal;line-height:1.05}
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
  .r2-big{font-size:30px}.r2-up{font-size:8px}
}
@media(max-width:520px){
  .r2-card{height:344px;min-height:326px}
  .r2-step strong{font-size:8.6px}
  .r2-body{padding-left:8px;padding-right:8px}
}
@media(max-height:720px) and (max-width:900px){
  .r2-card{height:318px;min-height:302px}
  .r2-step{min-height:31px}.r2-dot{width:20px;height:20px;margin-bottom:3px}
  .r2-scene h3{font-size:15px}.r2-scene p{font-size:8.7px}.r2-metric{min-height:46px;padding:6px 8px}
}
@media(prefers-reduced-motion:reduce){.r2-step.is-active .r2-dot,.r2-detail::after,.r2-scene.r2-live-motion>*,.r2-scene.r2-live-motion .r2-line,.r2-scene.r2-live-motion .r2-badge.green,.r2-scene.r2-live-motion .r2-mail{animation:none!important;clip-path:none!important}}
</style>`;

const HERO_MOTION_PATCH = String.raw`<script data-ralf-v2="motion-patch">
(function(){
  var scene=document.getElementById('r2Scene');
  if(!scene)return;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function replay(){
    scene.classList.remove('r2-live-motion');
    if(reduce)return;
    void scene.offsetWidth;
    scene.classList.add('r2-live-motion');
    var big=scene.querySelector('.r2-big');
    if(big&&/^74$/.test(big.textContent.trim())){
      var target=74,start=performance.now(),dur=850;
      big.textContent='0';
      requestAnimationFrame(function tick(now){
        var p=Math.min(1,(now-start)/dur),e=1-Math.pow(1-p,3);
        big.textContent=String(Math.round(target*e));
        if(p<1)requestAnimationFrame(tick);
      });
    }
  }
  new MutationObserver(function(){requestAnimationFrame(replay)}).observe(scene,{childList:true,subtree:false});
  replay();
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
    const hero = template(source, 'HERO');
    const heroJs = template(source, 'HERO_JS');

    const heroStart = html.indexOf('<header class="heroB">');
    const heroEnd = html.indexOf('</header>', heroStart);
    if (heroStart < 0 || heroEnd < 0) throw new Error('Production hero not found');

    html = html.slice(0, heroStart) + hero + html.slice(heroEnd + '</header>'.length);
    html = html.replace('</head>', `${baseCss}\n${heroCss}\n${HERO_LAYOUT_PATCH}\n<style data-ralf-staging>body:before{content:'STAGING · HERO V2';position:fixed;left:12px;bottom:12px;z-index:999999;background:#121212;color:#fff;padding:6px 9px;border-radius:999px;font:700 9px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em}</style>\n</head>`);
    html = html.replace('</body>', `${heroJs}\n${HERO_MOTION_PATCH}\n</body>`);
    html = html.replace(/<meta name="robots"[^>]*>/i, '<meta name="robots" content="noindex,nofollow,noarchive">');
    html = html.replace(/\s*<!-- Google tag \(gtag\.js\) -->\s*<script async[\s\S]*?<\/script>\s*<script>[\s\S]*?<\/script>/i, '');

    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 'no-store, max-age=0');
    res.setHeader('x-robots-tag', 'noindex, nofollow,noarchive');
    res.setHeader('x-ralf-staging', 'hero-v2');
    res.status(200).send(html);
  } catch (error) {
    console.error('staging-home failed', error);
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 'no-store');
    res.status(500).send(`<!doctype html><title>Ralf staging error</title><style>body{font:16px system-ui;padding:40px;max-width:700px;margin:auto}code{background:#f4f4f4;padding:3px 6px;border-radius:5px}</style><h1>Ralf staging could not render Version 2</h1><p><code>${String(error?.message || error).replace(/[<>&]/g, '')}</code></p>`);
  }
}
