import { css, dots, stages, durations } from '../lib/staging-v2-config.js';

export default async function handler(req, res) {
  try {
    const host = req.headers.host;
    if (!host) throw new Error('Missing host header');
    const proto = (req.headers['x-forwarded-proto'] || 'https').toString().split(',')[0].trim();
    const upstream = await fetch(`${proto}://${host}/api/staging-v2-direct`, {
      headers: { 'user-agent': 'Ralf-Staging-V2-Fixed/1.4' },
      cache: 'no-store',
    });
    if (!upstream.ok) throw new Error(`Direct staging hero returned ${upstream.status}`);
    let html = await upstream.text();

    const contentFlattenCss = String.raw`<style data-ralf-v2-content-flatten>
/* Content slide: remove the outer inner-screen 'tab' so the editor becomes the main surface. */
.r2x-screen:has(.r2x-content-editor) .r2x-screen-head{display:none!important}
.r2x-screen:has(.r2x-content-editor):after{display:none!important}
.r2x-screen:has(.r2x-content-editor) .r2x-scene{
  height:100%!important;
  border:0!important;
  border-radius:17px!important;
  background:transparent!important;
  padding:24px 22px 20px!important;
}
.r2x-screen:has(.r2x-content-editor) .r2x-content-editor{
  margin-top:14px!important;
  min-height:272px!important;
  padding:22px 24px 20px!important;
  border-radius:16px!important;
  background:#f6f7f6!important;
}
.r2x-screen:has(.r2x-content-editor) .r2x-editor-title{font-size:21px!important}
.r2x-screen:has(.r2x-content-editor) .r2x-editor-h2{font-size:13.5px!important;margin-top:18px!important}
.r2x-screen:has(.r2x-content-editor) .r2x-editor-copy{font-size:12.5px!important;line-height:1.52!important;margin-top:8px!important}
.r2x-screen:has(.r2x-content-editor) .r2x-editor-lines{margin-top:13px!important}
.r2x-screen:has(.r2x-content-editor) .r2x-editor-lines .r2x-doc-line{height:7px!important;margin-top:7px!important}
.r2x-screen:has(.r2x-content-editor) .r2x-checks{margin-top:15px!important;gap:7px!important}
.r2x-screen:has(.r2x-content-editor) .r2x-checks span{font-size:8.5px!important;padding:5px 9px!important}
@media(max-width:900px){
  .r2x-screen:has(.r2x-content-editor) .r2x-scene{height:100%!important;padding:10px 10px 8px!important;border-radius:11px!important}
  .r2x-screen:has(.r2x-content-editor) .r2x-content-editor{margin-top:7px!important;min-height:164px!important;padding:11px 12px 10px!important;border-radius:10px!important}
  .r2x-screen:has(.r2x-content-editor) .r2x-editor-title{font-size:13px!important}
  .r2x-screen:has(.r2x-content-editor) .r2x-editor-h2{font-size:9px!important;margin-top:9px!important}
  .r2x-screen:has(.r2x-content-editor) .r2x-editor-copy{font-size:8px!important;line-height:1.38!important;margin-top:4px!important}
  .r2x-screen:has(.r2x-content-editor) .r2x-editor-lines{margin-top:6px!important}
  .r2x-screen:has(.r2x-content-editor) .r2x-editor-lines .r2x-doc-line{height:4px!important;margin-top:4px!important}
  .r2x-screen:has(.r2x-content-editor) .r2x-checks{margin-top:7px!important;gap:4px!important}
  .r2x-screen:has(.r2x-content-editor) .r2x-checks span{font-size:6px!important;padding:3px 5px!important}
}
</style>`;

    html = html.replace(/<div class="r2x-dots" aria-label="Choose animation stage">[\s\S]*?<\/div>/, dots);
    html = html.replace(/var stages=\[[\s\S]*?\];\n  var durations=/, `${stages}\n  var durations=`);
    html = html.replace(/var durations=\[[^\]]+\]/, `var durations=${durations}`);
    html = html.replace('STAGING · HERO V2 · PROMPT FIRST + CONTROLS', 'STAGING · HERO V2 · REFINED SIX STAGE');
    html = html.replace('</head>', `${css}\n${contentFlattenCss}\n</head>`);

    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 'no-store, max-age=0');
    res.setHeader('x-robots-tag', 'noindex, nofollow, noarchive');
    res.setHeader('x-ralf-staging', 'hero-v2-content-flattened');
    res.status(200).send(html);
  } catch (error) {
    console.error('staging-v2-fixed failed', error);
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 'no-store');
    res.status(500).send(`<!doctype html><title>Ralf staging error</title><h1>Ralf staging animation failed</h1><p>${String(error?.message || error).replace(/[<>&]/g, '')}</p>`);
  }
}
