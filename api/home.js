export default async function handler(_req, res) {
  try {
    const response = await fetch('https://raw.githubusercontent.com/benshevlane/ralf-seo/master/index.html', {
      headers: { 'user-agent': 'Ralf homepage renderer' },
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

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
    res.status(200).send(html);
  } catch (_error) {
    res.status(500).send('Unable to render homepage.');
  }
}
