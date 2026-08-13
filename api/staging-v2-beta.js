export default async function handler(req, res) {
  try {
    const host = req.headers.host;
    if (!host) throw new Error('Missing host header');
    const proto = (req.headers['x-forwarded-proto'] || 'https').toString().split(',')[0].trim();
    const upstream = await fetch(`${proto}://${host}/api/staging-v2-fixed`, {
      headers: { 'user-agent': 'Ralf-Staging-V2-Beta/1.0' },
      cache: 'no-store',
    });
    if (!upstream.ok) throw new Error(`Staging hero returned ${upstream.status}`);
    let html = await upstream.text();
    const betaCta = '<a class="btn lg r2x-beta-cta" href="/beta">Apply for the private beta <span class="arr">→</span></a>';
    html = html.replace(/<form class="r2x-start" id="r2xStart">[\s\S]*?<\/form><div class="r2x-note">[\s\S]*?<\/div>/, betaCta);
    html = html.replace('</head>', '<style data-ralf-beta-cta>.r2x-beta-cta{grid-column:1;grid-row:2;justify-self:start;margin-top:4px;background:linear-gradient(135deg,#047857,#059669)!important;border-color:#047857!important;color:#fff!important}@media(max-width:900px){.r2x-beta-cta{grid-row:3;justify-self:center;margin-top:10px}}</style></head>');
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 'no-store, max-age=0');
    res.setHeader('x-robots-tag', 'noindex, nofollow, noarchive');
    res.setHeader('x-ralf-staging', 'hero-v2-beta-cta-only');
    res.status(200).send(html);
  } catch (error) {
    console.error('staging-v2-beta failed', error);
    res.status(500).send('Ralf staging error: ' + String(error && error.message || error));
  }
}
