export default async function handler(req, res) {
  try {
    const host = req.headers.host;
    if (!host) throw new Error('Missing host header');

    const proto = (req.headers['x-forwarded-proto'] || 'https').toString().split(',')[0].trim();
    const sourceUrl = `${proto}://${host}/api/staging-home`;
    const upstream = await fetch(sourceUrl, {
      headers: { 'user-agent': 'Ralf-Staging-Expanded/1.0' },
      cache: 'no-store',
    });

    if (!upstream.ok) throw new Error(`Base staging hero returned ${upstream.status}`);
    let html = await upstream.text();

    const patch = String.raw`<style data-ralf-v2="expanded-screen-patch">
/* Remove the oversized workflow strip and give the actual product demo the space. */
.r2-flow{display:none!important}
.r2-body{display:block!important;height:402px!important;padding:14px 16px 14px!important}
.r2-detail{height:100%!important;width:100%!important;min-height:0!important;border-radius:18px!important}
.r2-detail-head{height:46px!important;padding:0 18px!important;font-size:11px!important}
.r2-detail::after{top:46px!important;height:54px!important}
.r2-scene{padding:28px 30px!important}
.r2-k{font-size:10.5px!important}
.r2-scene h3{font-size:30px!important;line-height:1.04!important;margin:10px 0 11px!important;max-width:30ch!important}
.r2-scene p{font-size:14.5px!important;line-height:1.52!important;max-width:66ch!important}
.r2-metric{margin-top:20px!important;padding:17px 18px!important;min-height:108px!important;border-radius:13px!important}
.r2-line{font-size:13.5px!important;gap:11px!important}
.r2-line+.r2-line{margin-top:10px!important}
.r2-badge{font-size:9.5px!important;padding:5px 9px!important}
.r2-mail{font-size:13px!important;line-height:1.6!important}
.r2-doc{padding:14px 15px!important;margin-top:14px!important;border-radius:12px!important}
.r2-doc-title{font-size:14px!important;margin-bottom:10px!important}
.r2-doc-line{height:7px!important;margin-top:8px!important}
.r2-approval-row{font-size:13px!important;padding:11px 0!important;gap:12px!important}
.r2-approval-row b{min-width:74px!important}
.r2-big{font-size:52px!important}.r2-before{font-size:27px!important}.r2-up{font-size:11px!important}

@media(max-width:900px){
  .r2-card{height:370px!important;min-height:350px!important}
  .r2-body{height:calc(100% - 84px)!important;padding:9px 10px 10px!important}
  .r2-detail-head{height:32px!important;padding:0 11px!important;font-size:8.5px!important}
  .r2-detail::after{top:32px!important;height:36px!important}
  .r2-scene{padding:14px 15px!important}
  .r2-k{font-size:8px!important}
  .r2-scene h3{font-size:20px!important;line-height:1.05!important;margin:6px 0 7px!important}
  .r2-scene p{font-size:10.5px!important;line-height:1.45!important}
  .r2-metric{margin-top:10px!important;padding:10px 11px!important;min-height:66px!important}
  .r2-line{font-size:9.5px!important}.r2-line+.r2-line{margin-top:6px!important}
  .r2-badge{font-size:7.5px!important;padding:3px 6px!important}
  .r2-mail{font-size:9.5px!important;line-height:1.47!important}
  .r2-doc{padding:8px 9px!important;margin-top:7px!important}.r2-doc-title{font-size:9.5px!important;margin-bottom:6px!important}.r2-doc-line{height:4px!important;margin-top:5px!important}
  .r2-approval-row{font-size:9px!important;padding:6px 0!important;gap:7px!important}.r2-approval-row b{min-width:52px!important}
  .r2-big{font-size:34px!important}.r2-before{font-size:19px!important}.r2-up{font-size:8px!important}
}
@media(max-width:520px){
  .r2-card{height:358px!important;min-height:342px!important}
  .r2-scene h3{font-size:18px!important}
  .r2-scene p{font-size:10px!important}
}
@media(max-height:720px) and (max-width:900px){
  .r2-card{height:332px!important;min-height:316px!important}
  .r2-scene{padding:10px 11px!important}.r2-scene h3{font-size:16px!important}.r2-scene p{font-size:9px!important}.r2-metric{min-height:48px!important;padding:7px 8px!important}
}
</style>`;

    html = html.replace('</head>', `${patch}\n<style data-ralf-staging-expanded>body:before{content:'STAGING · HERO V2 · EXPANDED';}</style>\n</head>`);

    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 'no-store, max-age=0');
    res.setHeader('x-robots-tag', 'noindex, nofollow, noarchive');
    res.setHeader('x-ralf-staging', 'hero-v2-expanded');
    res.status(200).send(html);
  } catch (error) {
    console.error('staging-home-expanded failed', error);
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 'no-store');
    res.status(500).send(`<!doctype html><title>Ralf staging error</title><style>body{font:16px system-ui;padding:40px;max-width:700px;margin:auto}code{background:#f4f4f4;padding:3px 6px;border-radius:5px}</style><h1>Ralf staging could not render the expanded animation</h1><p><code>${String(error?.message || error).replace(/[<>&]/g, '')}</code></p>`);
  }
}
