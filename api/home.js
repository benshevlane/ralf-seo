export default async function handler(req, res) {
  try {
    const host = req.headers.host;
    if (!host) throw new Error('Missing host header');

    const proto = (req.headers['x-forwarded-proto'] || 'https').toString().split(',')[0].trim();
    const sourceUrl = `${proto}://${host}/api/staging-v2-fixed`;
    const response = await fetch(sourceUrl, {
      headers: { 'user-agent': 'Ralf homepage renderer' },
      cache: 'no-store',
    });

    if (!response.ok) {
      res.status(response.status).send(await response.text());
      return;
    }

    let html = await response.text();

    html = html.replace(
      '<div class="dd-menu"><a href="/search">Search</a><a href="/outreach">Outreach</a><a href="/content">Content</a></div>',
      '<div class="dd-menu"><a href="/search">Search</a><a href="/outreach">Outreach</a><a href="/content">Content</a><a href="/done-for-you">Done For You</a></div>'
    );

    html = html.replace(
      '<li><a href="/content">Content</a></li><li><a href="/pricing">Pricing</a></li>',
      '<li><a href="/content">Content</a></li><li><a href="/done-for-you">Done For You</a></li><li><a href="/pricing">Pricing</a></li>'
    );

    const ahrefsSnippet = '<script src="https://analytics.ahrefs.com/analytics.js" data-key="0MSfXWjdIGz4tyCIfpb0sQ" async></script>';
    if (!html.includes('analytics.ahrefs.com/analytics.js')) {
      html = html.replace('</head>', `  ${ahrefsSnippet}\n</head>`);
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
    res.setHeader('X-Ralf-Staging', 'content-types-emerald-combined');
    res.status(200).send(html);
  } catch (error) {
    console.error('homepage renderer failed', error);
    res.status(500).send('Unable to render homepage.');
  }
}
