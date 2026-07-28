const DONE_FOR_YOU_BANNER = `
<section aria-label="Ralf Done For You" style="padding:30px 0;background:#f4f4f3;border-top:1px solid rgba(18,18,18,.06);border-bottom:1px solid rgba(18,18,18,.06)">
  <div style="max-width:1180px;margin:0 auto;padding:0 32px">
    <div style="background:#121212;color:#fff;border-radius:16px;padding:26px 28px;display:grid;grid-template-columns:1fr auto;gap:28px;align-items:center">
      <div>
        <div style="font-family:'Space Mono',ui-monospace,monospace;font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:rgba(255,255,255,.52)">Alternative outreach pricing</div>
        <h2 style="font-family:'Space Grotesk',system-ui,sans-serif;font-size:clamp(25px,3vw,36px);line-height:1.06;letter-spacing:-.035em;margin:8px 0 0">Prefer us to run the outreach for you?</h2>
        <p style="font-family:'Inter Tight',system-ui,sans-serif;font-size:15.5px;line-height:1.55;color:rgba(255,255,255,.7);max-width:70ch;margin:11px 0 0">Ralf Done For You maps your competitors’ citations and backlinks, runs targeted publisher outreach, negotiates each placement and manages the approved link through to live. No swaps, exchanges or mass spam.</p>
        <p style="font-family:'Inter Tight',system-ui,sans-serif;font-size:14px;font-weight:600;margin:10px 0 0">Per-link pricing · $500/month minimum · you approve every page and price</p>
      </div>
      <a href="/done-for-you" style="font-family:'Inter Tight',system-ui,sans-serif;font-weight:600;font-size:15px;white-space:nowrap;background:#fff;color:#121212;border-radius:999px;padding:13px 20px;text-decoration:none">View Done For You →</a>
    </div>
  </div>
  <style>@media(max-width:720px){section[aria-label="Ralf Done For You"]>div{padding:0 20px!important}section[aria-label="Ralf Done For You"]>div>div{grid-template-columns:1fr!important;padding:23px 21px!important}section[aria-label="Ralf Done For You"] a{width:100%;text-align:center}}</style>
</section>`;

export default async function handler(req, res) {
  try {
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'ralfhq.com';
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const sourceUrl = `${protocol}://${host}/pricing?raw=1`;
    const response = await fetch(sourceUrl, {
      headers: { 'user-agent': 'Ralf pricing renderer' },
    });

    if (!response.ok) {
      res.status(response.status).send(await response.text());
      return;
    }

    let html = await response.text();
    const firstSectionEnd = html.indexOf('</section>');
    if (firstSectionEnd !== -1) {
      const insertAt = firstSectionEnd + '</section>'.length;
      html = html.slice(0, insertAt) + DONE_FOR_YOU_BANNER + html.slice(insertAt);
    }

    html = html.replace(
      '<a href="/methodology">Methodology</a>',
      '<a href="/done-for-you">Done For You</a><a href="/methodology">Methodology</a>'
    );

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send('Unable to render pricing page.');
  }
}
