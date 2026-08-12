const STYLE = '<link rel="stylesheet" href="/assets/staging-emerald.css" data-ralf-staging-sitewide>';
const SCRIPT = '<script defer src="/assets/staging-trial.js" data-ralf-staging-sitewide></script>';

export default async function handler(req, res) {
  try {
    const host = req.headers.host;
    if (!host) throw new Error('Missing host header');
    const proto = (req.headers['x-forwarded-proto'] || 'https').toString().split(',')[0].trim();
    const upstream = await fetch(`${proto}://${host}/api/staging-v2-fixed`, {
      headers: { 'user-agent': 'Ralf-Staging-Sitewide/1.0' },
      cache: 'no-store',
    });
    if (!upstream.ok) throw new Error(`V2 staging returned ${upstream.status}`);
    let html = await upstream.text();
    if (!html.includes('/assets/staging-emerald.css')) html = html.replace('</head>', `${STYLE}\n</head>`);
    if (!html.includes('/assets/staging-trial.js')) html = html.replace('</body>', `${SCRIPT}\n</body>`);

    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 'no-store, max-age=0');
    res.setHeader('x-robots-tag', 'noindex, nofollow, noarchive');
    res.setHeader('x-ralf-staging', 'hero-v2-sitewide-green-trial');
    res.status(200).send(html);
  } catch (error) {
    console.error('staging-v2-sitewide failed', error);
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 'no-store');
    res.status(500).send(`<!doctype html><title>Ralf staging error</title><h1>Ralf staging failed</h1><p>${String(error?.message || error).replace(/[<>&]/g, '')}</p>`);
  }
}
