export default async function handler(req, res) {
  try {
    const host = req.headers.host;
    if (!host) throw new Error('Missing host header');
    const proto = (req.headers['x-forwarded-proto'] || 'https').toString().split(',')[0].trim();
    const upstream = await fetch(`${proto}://${host}/api/staging-v2-direct`, {
      headers: { 'user-agent': 'Ralf-Staging-V2-Fixed/1.0' },
      cache: 'no-store',
    });
    if (!upstream.ok) throw new Error(`Direct staging hero returned ${upstream.status}`);
    let html = await upstream.text();

    const css = String.raw`<style data-ralf-v2-layout-fix>
/* Isolate the hero animation from legacy marketing-site layout rules. */
.r2x-demo,.r2x-card,.r2x-screen,.r2x-screen-head,.r2x-scene,.r2x-scene>*{box-sizing:border-box}
.r2x-scene{display:block!important;columns:auto!important;column-count:auto!important;column-width:auto!important;text-align:left!important;white-space:normal!important}
.r2x-scene>*{position:relative!important;float:none!important;clear:both!important;display:block!important;width:auto!important;max-width:none!important;margin-left:0!important;margin-right:0!important;grid-column:auto!important;grid-row:auto!important;align-self:auto!important;justify-self:auto!important}
.r2x-scene>.r2x-k{display:block!important;width:100%!important;margin:0!important}
.r2x-scene>h3{display:block!important;width:100%!important;max-width:760px!important;margin:10px 0 11px!important;font-size:29px!important;line-height:1.05!important}
.r2x-scene>p{display:block!important;width:100%!important;max-width:760px!important;margin:0!important;font-size:14px!important;line-height:1.52!important}
.r2x-scene>.r2x-panel,.r2x-scene>.r2x-ai-source,.r2x-scene>.r2x-doc,.r2x-scene>.r2x-approval{display:block!important;width:100%!important;max-width:none!important;margin-left:0!important;margin-right:0!important}
.r2x-panel{margin-top:19px!important}
.r2x-ai-source{margin-top:18px!important}
.r2x-doc{margin-top:14px!important}
.r2x-approval{margin-top:18px!important}
.r2x-row,.r2x-prompt,.r2x-airow,.r2x-approval-row,.r2x-result{float:none!important;clear:none!important}
.r2x-controls{font-size:9px!important}
@media(max-width:900px){
  .r2x-scene{display:block!important}
  .r2x-scene>*{display:block!important;width:auto!important;max-width:none!important}
  .r2x-scene>.r2x-k,.r2x-scene>h3,.r2x-scene>p,.r2x-scene>.r2x-panel,.r2x-scene>.r2x-ai-source,.r2x-scene>.r2x-doc,.r2x-scene>.r2x-approval{width:100%!important}
  .r2x-scene>h3{font-size:17px!important;line-height:1.05!important;margin:5px 0 6px!important}
  .r2x-scene>p{font-size:9.2px!important;line-height:1.4!important}
  .r2x-panel{margin-top:8px!important}.r2x-ai-source{margin-top:8px!important}.r2x-doc{margin-top:6px!important}.r2x-approval{margin-top:8px!important}
}
</style>`;

    html = html.replace('</head>', `${css}\n</head>`);
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 'no-store, max-age=0');
    res.setHeader('x-robots-tag', 'noindex, nofollow, noarchive');
    res.setHeader('x-ralf-staging', 'hero-v2-layout-fixed');
    res.status(200).send(html);
  } catch (error) {
    console.error('staging-v2-fixed failed', error);
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 'no-store');
    res.status(500).send(`<!doctype html><title>Ralf staging error</title><h1>Ralf staging animation failed</h1><p>${String(error?.message || error).replace(/[<>&]/g, '')}</p>`);
  }
}
