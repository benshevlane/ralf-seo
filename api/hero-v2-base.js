import { css, dots, stages, durations } from '../lib/staging-v2-config.js';

const RAW_REPO = 'https://raw.githubusercontent.com/benshevlane/ralf-seo';

async function getRaw(ref, path) {
  const response = await fetch(`${RAW_REPO}/${ref}/${path}`, {
    headers: { 'user-agent': 'Ralf-Hero-Renderer/3.0' },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`${path} returned ${response.status}`);
  return response.text();
}

function templateBody(source, name) {
  const marker = `const ${name} = String.raw\``;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Could not find ${name}`);
  const bodyStart = start + marker.length;
  const end = source.indexOf('`;', bodyStart);
  if (end < 0) throw new Error(`Could not close ${name}`);
  return source.slice(bodyStart, end);
}

function renderTemplate(body) {
  return Function('css', 'dots', 'stages', 'durations', `return String.raw\`${body}\`;`)(css, dots, stages, durations);
}

export default async function handler(req, res) {
  try {
    const ref = process.env.VERCEL_GIT_COMMIT_SHA || 'master';
    const [baseHtml, directSource] = await Promise.all([
      getRaw(ref, 'index.html'),
      getRaw(ref, 'api/staging-v2-direct.js'),
    ]);

    const HERO_HTML = renderTemplate(templateBody(directSource, 'HERO_HTML'));
    const BASE_STYLES = renderTemplate(templateBody(directSource, 'BASE_STYLES'));
    const SCRIPT = renderTemplate(templateBody(directSource, 'SCRIPT'));

    let html = baseHtml;
    const hero = /<header class="heroB"[\s\S]*?<\/header>/;
    if (!hero.test(html)) throw new Error('Could not find homepage hero');
    html = html.replace(hero, HERO_HTML);
    html = html.replace('</head>', `${BASE_STYLES}\n${css}\n</head>`);
    html = html.replace('</body>', `${SCRIPT}\n</body>`);

    const singleSurfaceCss = String.raw`<style data-ralf-v2-single-surface>
.r2x-card{height:526px!important;border:0!important;border-radius:0!important;background:transparent!important;overflow:visible!important;box-shadow:none!important}
.r2x-top{display:none!important}
.r2x-screen{height:522px!important;padding:0!important;position:relative!important}
.r2x-screen:after{left:0!important;right:0!important;top:54px!important}
.r2x-screen-head{height:54px!important;border:1px solid rgba(5,150,105,.23)!important;border-bottom:1px solid var(--line)!important;border-radius:24px 24px 0 0!important;padding:0 24px!important;background:linear-gradient(180deg,#fff,#fafcfb)!important;box-shadow:0 18px 52px -38px rgba(4,120,87,.45)!important;font-size:11px!important}
.r2x-scene{height:468px!important;border:1px solid rgba(5,150,105,.23)!important;border-top:0!important;border-radius:0 0 24px 24px!important;padding:34px 38px 36px!important;background:rgba(255,255,255,.98)!important;box-shadow:0 38px 100px -48px rgba(4,120,87,.62),0 20px 48px -30px rgba(18,18,18,.34)!important}
.r2x-progress{position:relative;z-index:3;border-radius:0 0 999px 999px;overflow:hidden}
.r2x-content-editor{min-height:240px!important;padding:20px 22px 18px!important;border-radius:15px!important}
.r2x-editor-title{font-size:20px!important}.r2x-editor-h2{font-size:13px!important;margin-top:17px!important}.r2x-editor-copy{font-size:12px!important;line-height:1.5!important;margin-top:7px!important}.r2x-editor-lines{margin-top:12px!important}.r2x-editor-lines .r2x-doc-line{height:7px!important;margin-top:7px!important}.r2x-checks{margin-top:14px!important}
@media(max-width:900px){.r2x-card{height:342px!important}.r2x-screen{height:338px!important;padding:0!important}.r2x-screen:after{top:36px!important;left:0!important;right:0!important}.r2x-screen-head{height:36px!important;border-radius:17px 17px 0 0!important;padding:0 12px!important;font-size:8px!important}.r2x-scene{height:302px!important;border-radius:0 0 17px 17px!important;padding:15px 15px 42px!important}.r2x-content-editor{min-height:165px!important;padding:10px 11px 9px!important}.r2x-editor-title{font-size:12.5px!important}.r2x-editor-h2{font-size:8.8px!important;margin-top:8px!important}.r2x-editor-copy{font-size:7.9px!important;line-height:1.38!important;margin-top:4px!important}.r2x-editor-lines{margin-top:6px!important}.r2x-editor-lines .r2x-doc-line{height:4px!important;margin-top:4px!important}.r2x-checks{margin-top:7px!important}}
@media(max-width:520px){.r2x-card{height:330px!important}.r2x-screen{height:326px!important}.r2x-scene{height:290px!important}}
@media(max-height:720px) and (max-width:900px){.r2x-card{height:304px!important}.r2x-screen{height:300px!important}.r2x-scene{height:264px!important}}
</style>`;

    const homepageGreenCss = String.raw`<style data-ralf-staging-green-accents>
#proof{background:var(--wash)!important}
#proof .sp{border-color:rgba(5,150,105,.18)!important;box-shadow:0 28px 70px -54px rgba(4,120,87,.38)}
#proof .spbadge{border-color:rgba(5,150,105,.42)!important;color:var(--r2x-dark)!important;background:var(--r2x-wash)!important}
#proof #spchart path[stroke="#121310"]{stroke:var(--r2x)!important}#proof #spchart circle{fill:var(--r2x)!important}#proof .met .mv i{color:var(--r2x)!important}
#features .vrow:first-child .vfill{background:linear-gradient(90deg,var(--r2x-dark),var(--r2x-bright))!important}#features .vrow:first-child .vpct{color:var(--r2x-dark)!important;font-weight:700}
#lc-card .tag.act{border-color:var(--r2x-line)!important;background:var(--r2x-wash)!important;color:var(--r2x-dark)!important}#lc-card .lc-act{color:var(--r2x-dark)!important}#lc-card .lc-tally b{color:var(--r2x-dark)!important}
#execution .extab.is-active .exh,#execution .extab.is-active .exn{color:var(--r2x-dark)!important}#execution .exbar{background:linear-gradient(90deg,var(--r2x-dark),var(--r2x-bright))!important}#execution .fx.ok{background:var(--r2x)!important;color:#fff!important}#execution .sxp{background:var(--r2x-dark)!important}#execution .bdpub{background:linear-gradient(135deg,var(--r2x-dark),var(--r2x))!important}
#compare .cmp .col-us{background:#f2faf6!important;border-left-color:rgba(5,150,105,.16)!important;border-right-color:rgba(5,150,105,.16)!important}#compare .cmp .ck{background:var(--r2x)!important}#compare .cmp thead .us{color:var(--r2x-dark)!important}
#how .step .num{color:var(--r2x-dark)!important;font-weight:700}#how .step:hover .num{color:var(--r2x)!important}
.final{background:radial-gradient(58% 90% at 50% 100%,rgba(5,150,105,.10),transparent 72%),#fbfdfc!important}.final .btn:not(.ghost){box-shadow:0 16px 34px -22px rgba(4,120,87,.7)}
@media(max-width:720px){#proof{background:var(--wash)!important}#compare .cmp.cards td.col-us{background:#f2faf6!important;border-radius:7px;padding-left:7px;padding-right:7px}}
</style>`;

    const neutralHeroCss = String.raw`<style data-ralf-v2-neutral-hero>
.r2x-hero{background:#fff!important}
.r2x-hero:before{background-image:radial-gradient(rgba(18,18,18,.10) 1px,transparent 1.5px)!important;opacity:.22!important}
@media(min-width:901px){.r2x-shell{grid-template-columns:minmax(0,1fr) minmax(570px,1.1fr)!important;column-gap:38px!important}.r2x-copy h1{max-width:13.6ch!important;font-size:clamp(46px,5.35vw,72px)!important;line-height:1!important}}
.r2x-demo:before{content:"";position:absolute;z-index:-1;inset:-58px -72px -66px -66px;pointer-events:none;background:radial-gradient(ellipse at 52% 44%,rgba(52,211,153,.18) 0%,rgba(5,150,105,.09) 42%,rgba(5,150,105,0) 74%);filter:blur(2px)}
#r2xCard,.r2x-screen{background:transparent!important}
#r2xCard .r2x-screen-head{background:#fff!important;border-color:rgba(18,18,18,.11)!important;box-shadow:0 18px 52px -38px rgba(18,18,18,.22)!important}
#r2xCard .r2x-scene{background:#fff!important;border-color:rgba(18,18,18,.11)!important;box-shadow:0 38px 100px -48px rgba(18,18,18,.27),0 20px 48px -30px rgba(18,18,18,.18)!important}
#r2xCard .r2x-content-editor,#r2xCard .r2x-panel,#r2xCard .r2x-approval,#r2xCard .r2x-airow,#r2xCard .r2x-doc{background:#f6f7f6!important}
#r2xCard .r2x-source{background:#fff!important}
#r2xCard .r2x-source-signals span,#r2xCard .r2x-prompt{background:#fff!important}
#r2xCard .r2x-screen:after{background:linear-gradient(180deg,rgba(18,18,18,.04),rgba(18,18,18,0))!important}
#r2xCard .r2x-badge.green,#r2xCard .r2x-engine,#r2xCard .r2x-checks span,#r2xCard .r2x-health{background:var(--r2x-wash)!important}
.r2x-rotator{position:relative;display:inline-block;vertical-align:baseline;height:1em;white-space:nowrap;color:var(--r2x)!important;min-width:2ch}
.r2x-rotator .r2x-rw{position:absolute;left:0;bottom:0;opacity:0;transform:translateY(.28em);color:var(--r2x)!important;transition:opacity .42s ease,transform .48s cubic-bezier(.22,.61,.36,1)}
.r2x-rotator .r2x-rw.is-in{opacity:1;transform:none}.r2x-rotator .r2x-rw.is-out{opacity:0;transform:translateY(-.30em)}
@media(max-width:900px){.r2x-demo:before{inset:-32px -28px -40px;background:radial-gradient(ellipse at 50% 44%,rgba(52,211,153,.15) 0%,rgba(5,150,105,.07) 44%,rgba(5,150,105,0) 74%)}}
</style>`;

    const rotatorScript = String.raw`<script data-ralf-v2-word-rotator>
(function(){var rot=document.querySelector('.r2x-rotator');if(!rot)return;var words=['AI','ChatGPT','Claude','Gemini','Perplexity'];var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;rot.innerHTML='';var spans=words.map(function(word,i){var s=document.createElement('span');s.className='r2x-rw'+(i===0?' is-in':'');s.textContent=word;rot.appendChild(s);return s;});requestAnimationFrame(function(){var max=0;spans.forEach(function(s){max=Math.max(max,Math.ceil(s.getBoundingClientRect().width));});rot.style.width=max+'px';});if(reduce)return;var current=0;setInterval(function(){var prev=spans[current];current=(current+1)%spans.length;var next=spans[current];prev.classList.remove('is-in');prev.classList.add('is-out');next.classList.remove('is-out');next.classList.add('is-in');setTimeout(function(){prev.classList.remove('is-out');},600);},2400);})();
</script>`;

    html = html.replace(/<div class="r2x-dots" aria-label="Choose animation stage">[\s\S]*?<\/div>/, dots);
    html = html.replace(/var stages=\[[\s\S]*?\];\s*var durations=/, `${stages}\nvar durations=`);
    html = html.replace(/var durations=\[[^\]]+\]/, `var durations=${durations}`);
    html = html.replace('<h1>Get your business found by <em>AI</em></h1>', '<h1>Get your business found by <span class="r2x-rotator" aria-label="AI search engines"><span class="r2x-rw is-in">AI</span></span></h1>');
    html = html.replace('</head>', `${singleSurfaceCss}\n${homepageGreenCss}\n<link rel="stylesheet" href="/assets/staging-emerald.css" data-ralf-staging-sitewide>\n${neutralHeroCss}\n</head>`);
    html = html.replace('</body>', `${rotatorScript}\n<script defer src="/assets/staging-trial.js" data-ralf-staging-sitewide></script>\n</body>`);

    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 'public, s-maxage=300, stale-while-revalidate=86400');
    res.setHeader('x-ralf-staging', 'hero-v2-original-headline-proportions');
    res.status(200).send(html);
  } catch (error) {
    console.error('staging-v2-fixed failed', error);
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 'no-store');
    res.status(500).send(`<!doctype html><title>Ralf staging error</title><h1>Ralf staging animation failed</h1><p>${String(error?.message || error).replace(/[<>&]/g, '')}</p>`);
  }
}
