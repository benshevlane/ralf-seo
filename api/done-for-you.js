const AGENCY_ADD_ON = `
<section aria-label="Works alongside your agency" style="padding:28px 0;background:#f4f4f3;border-top:1px solid rgba(18,18,18,.07);border-bottom:1px solid rgba(18,18,18,.07)">
  <div style="max-width:1180px;margin:0 auto;padding:0 32px">
    <div style="border:1px solid rgba(18,18,18,.12);border-radius:16px;background:#fff;padding:24px 26px;display:grid;grid-template-columns:.7fr 1.3fr;gap:34px;align-items:center">
      <div>
        <div style="font-family:'Space Mono',ui-monospace,monospace;font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:rgba(18,18,18,.44)">Built to complement your current team</div>
        <h2 style="font-family:'Space Grotesk',system-ui,sans-serif;font-size:clamp(27px,3.4vw,42px);line-height:1.04;letter-spacing:-.04em;margin:9px 0 0">You do not need to replace your agency.</h2>
      </div>
      <div>
        <p style="font-family:'Inter Tight',system-ui,sans-serif;font-size:17px;line-height:1.6;color:rgba(18,18,18,.64);margin:0">Ralf Done For You is an <strong style="color:#121212">additional, highly targeted link-building service</strong>. Your agency can keep handling strategy, content, technical SEO and broader campaigns while we focus specifically on competitor-led publisher outreach and link placement.</p>
        <p style="font-family:'Inter Tight',system-ui,sans-serif;font-size:15px;font-weight:600;line-height:1.5;margin:13px 0 0">Pay as you go for the individual links you approve, with the $500 monthly minimum applied against approved placements.</p>
      </div>
    </div>
  </div>
  <style>@media(max-width:760px){section[aria-label="Works alongside your agency"]>div{padding:0 20px!important}section[aria-label="Works alongside your agency"]>div>div{grid-template-columns:1fr!important;gap:16px!important;padding:22px 20px!important}}</style>
</section>`;

export default async function handler(_req, res) {
  try {
    const response = await fetch('https://raw.githubusercontent.com/benshevlane/ralf-seo/master/done-for-you.html', {
      headers: { 'user-agent': 'Ralf Done For You renderer' },
    });

    if (!response.ok) {
      res.status(response.status).send(await response.text());
      return;
    }

    let html = await response.text();
    const heroEnd = html.indexOf('</header>');
    if (heroEnd !== -1) {
      const insertAt = heroEnd + '</header>'.length;
      html = html.slice(0, insertAt) + AGENCY_ADD_ON + html.slice(insertAt);
    }

    html = html.replace(
      'A done-for-you alternative to running Ralf Outreach yourself.',
      'An additional targeted link-building service that works alongside your agency or in-house team.'
    );
    html = html.replace(
      '$500/month minimum · link prices vary by publisher · every page and price requires approval',
      'Pay as you go per approved link · $500/month minimum applied to placements · every page and price requires approval'
    );
    html = html.replace(
      'Commercial model: minimum monthly commitment used on approved links',
      'Commercial model: pay as you go per approved link, with a $500 monthly minimum'
    );

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
    res.status(200).send(html);
  } catch (_error) {
    res.status(500).send('Unable to render Done For You page.');
  }
}
