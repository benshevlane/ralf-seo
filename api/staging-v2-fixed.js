import { css, dots, stages, durations } from '../lib/staging-v2-config.js';

export default async function handler(req, res) {
  try {
    const host = req.headers.host;
    if (!host) throw new Error('Missing host header');
    const proto = (req.headers['x-forwarded-proto'] || 'https').toString().split(',')[0].trim();
    const upstream = await fetch(`${proto}://${host}/api/staging-v2-direct`, {
      headers: { 'user-agent': 'Ralf-Staging-V2-Fixed/1.8' },
      cache: 'no-store',
    });
    if (!upstream.ok) throw new Error(`Direct staging hero returned ${upstream.status}`);
    let html = await upstream.text();

    const singleSurfaceCss = String.raw`<style data-ralf-v2-single-surface>
/* One animation surface only: remove the outer browser-style frame and let the inner screen fill it. */
.r2x-card{
  height:526px!important;
  border:0!important;
  border-radius:0!important;
  background:transparent!important;
  overflow:visible!important;
  box-shadow:none!important;
}
.r2x-top{display:none!important}
.r2x-screen{
  height:522px!important;
  padding:0!important;
  position:relative!important;
}
.r2x-screen:after{
  left:0!important;
  right:0!important;
  top:54px!important;
}
.r2x-screen-head{
  height:54px!important;
  border:1px solid rgba(5,150,105,.23)!important;
  border-bottom:1px solid var(--line)!important;
  border-radius:24px 24px 0 0!important;
  padding:0 24px!important;
  background:linear-gradient(180deg,#fff,#fafcfb)!important;
  box-shadow:0 18px 52px -38px rgba(4,120,87,.45)!important;
  font-size:11px!important;
}
.r2x-scene{
  height:468px!important;
  border:1px solid rgba(5,150,105,.23)!important;
  border-top:0!important;
  border-radius:0 0 24px 24px!important;
  padding:34px 38px 36px!important;
  background:rgba(255,255,255,.98)!important;
  box-shadow:0 38px 100px -48px rgba(4,120,87,.62),0 20px 48px -30px rgba(18,18,18,.34)!important;
}
.r2x-progress{position:relative;z-index:3;border-radius:0 0 999px 999px;overflow:hidden}
.r2x-content-editor{
  min-height:240px!important;
  padding:20px 22px 18px!important;
  border-radius:15px!important;
}
.r2x-editor-title{font-size:20px!important}
.r2x-editor-h2{font-size:13px!important;margin-top:17px!important}
.r2x-editor-copy{font-size:12px!important;line-height:1.5!important;margin-top:7px!important}
.r2x-editor-lines{margin-top:12px!important}
.r2x-editor-lines .r2x-doc-line{height:7px!important;margin-top:7px!important}
.r2x-checks{margin-top:14px!important}
@media(max-width:900px){
  .r2x-card{height:342px!important}
  .r2x-screen{height:338px!important;padding:0!important}
  .r2x-screen:after{top:36px!important;left:0!important;right:0!important}
  .r2x-screen-head{height:36px!important;border-radius:17px 17px 0 0!important;padding:0 12px!important;font-size:8px!important}
  .r2x-scene{height:302px!important;border-radius:0 0 17px 17px!important;padding:15px 15px 42px!important}
  .r2x-content-editor{min-height:165px!important;padding:10px 11px 9px!important}
  .r2x-editor-title{font-size:12.5px!important}
  .r2x-editor-h2{font-size:8.8px!important;margin-top:8px!important}
  .r2x-editor-copy{font-size:7.9px!important;line-height:1.38!important;margin-top:4px!important}
  .r2x-editor-lines{margin-top:6px!important}
  .r2x-editor-lines .r2x-doc-line{height:4px!important;margin-top:4px!important}
  .r2x-checks{margin-top:7px!important}
}
@media(max-width:520px){
  .r2x-card{height:330px!important}
  .r2x-screen{height:326px!important}
  .r2x-scene{height:290px!important}
}
@media(max-height:720px) and (max-width:900px){
  .r2x-card{height:304px!important}
  .r2x-screen{height:300px!important}
  .r2x-scene{height:264px!important}
}
</style>`;

    const homepageGreenCss = String.raw`<style data-ralf-staging-green-accents>
/* Emerald is semantic: Ralf active, progress, verified wins and primary actions. */
#proof{background:var(--wash)!important}
#proof .sp{border-color:rgba(5,150,105,.18)!important;box-shadow:0 28px 70px -54px rgba(4,120,87,.38)}
#proof .spbadge{border-color:rgba(5,150,105,.42)!important;color:var(--r2x-dark)!important;background:var(--r2x-wash)!important}
#proof #spchart path[stroke="#121310"]{stroke:var(--r2x)!important}
#proof #spchart circle{fill:var(--r2x)!important}
#proof .met .mv i{color:var(--r2x)!important}

#features .vrow:first-child .vfill{background:linear-gradient(90deg,var(--r2x-dark),var(--r2x-bright))!important}
#features .vrow:first-child .vpct{color:var(--r2x-dark)!important;font-weight:700}

#lc-card .tag.act{border-color:var(--r2x-line)!important;background:var(--r2x-wash)!important;color:var(--r2x-dark)!important}
#lc-card .lc-act{color:var(--r2x-dark)!important}
#lc-card .lc-tally b{color:var(--r2x-dark)!important}

#execution .extab.is-active .exh,#execution .extab.is-active .exn{color:var(--r2x-dark)!important}
#execution .exbar{background:linear-gradient(90deg,var(--r2x-dark),var(--r2x-bright))!important}
#execution .fx.ok{background:var(--r2x)!important;color:#fff!important}
#execution .sxp{background:var(--r2x-dark)!important}
#execution .bdpub{background:linear-gradient(135deg,var(--r2x-dark),var(--r2x))!important}

#compare .cmp .col-us{background:#f2faf6!important;border-left-color:rgba(5,150,105,.16)!important;border-right-color:rgba(5,150,105,.16)!important}
#compare .cmp .ck{background:var(--r2x)!important}
#compare .cmp thead .us{color:var(--r2x-dark)!important}

#how .step .num{color:var(--r2x-dark)!important;font-weight:700}
#how .step:hover .num{color:var(--r2x)!important}

.final{background:radial-gradient(58% 90% at 50% 100%,rgba(5,150,105,.10),transparent 72%),#fbfdfc!important}
.final .btn:not(.ghost){box-shadow:0 16px 34px -22px rgba(4,120,87,.7)}

@media(max-width:720px){
  #proof{background:var(--wash)!important}
  #compare .cmp.cards td.col-us{background:#f2faf6!important;border-radius:7px;padding-left:7px;padding-right:7px}
}
</style>`;

    html = html.replace(/<div class="r2x-dots" aria-label="Choose animation stage">[\s\S]*?<\/div>/, dots);
    html = html.replace(/var stages=\[[\s\S]*?\];\s*var durations=/, `${stages}\n  var durations=`);
    html = html.replace(/var durations=\[[^\]]+\]/, `var durations=${durations}`);
    html = html.replace('STAGING · HERO V2 · PROMPT FIRST + CONTROLS', 'STAGING · HERO V2 · GREEN ACCENTS');
    html = html.replace('STAGING · HERO V2 · SINGLE SURFACE', 'STAGING · HERO V2 · GREEN ACCENTS');
    html = html.replace('</head>', `${css}\n${singleSurfaceCss}\n${homepageGreenCss}\n<link rel="stylesheet" href="/assets/staging-emerald.css" data-ralf-staging-sitewide>\n</head>`);
    html = html.replace('</body>', `<script defer src="/assets/staging-trial.js" data-ralf-staging-sitewide></script>\n</body>`);

    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 'no-store, max-age=0');
    res.setHeader('x-robots-tag', 'noindex, nofollow,noarchive');
    res.setHeader('x-ralf-staging', 'hero-v2-sitewide-green-trial');
    res.status(200).send(html);
  } catch (error) {
    console.error('staging-v2-fixed failed', error);
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 'no-store');
    res.status(500).send(`<!doctype html><title>Ralf staging error</title><h1>Ralf staging animation failed</h1><p>${String(error?.message || error).replace(/[<>&]/g, '')}</p>`);
  }
}
