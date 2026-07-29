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
        <p style="font-family:'Inter Tight',system-ui,sans-serif;font-size:15px;font-weight:600;line-height:1.5;margin:13px 0 0">Pay as you go for the individual links you approve. Links typically cost $250–$800 each; $500 is the minimum monthly commitment, not a per-link fee.</p>
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
      'Typical link price $250–$800 · $500/month minimum commitment, not per link · every page and price requires approval'
    );
    html = html.replace(
      'Commercial model: minimum monthly commitment used on approved links',
      'Commercial model: pay as you go per approved link, typically $250–$800 each, with a $500 monthly minimum'
    );
    html = html.replace(
      'Suggested working budget',
      'Estimated monthly range'
    );
    html = html.replace(
      'per month · planning estimate',
      'based on typical $250–$800 link prices'
    );
    html = html.replace(
      '<h3>Why the cost is an estimate</h3><p>A strong niche page may cost a few hundred dollars; a category-defining comparison page can cost more. We always show and negotiate the actual publisher price before you approve it.</p>',
      '<h3>Links are not $500 each</h3><p>Individual placements typically cost between <strong>$250 and $800</strong>, depending on the publisher, page quality and opportunity. We show you the exact negotiated price before you approve anything.</p>'
    );
    html = html.replace(
      '<h3>What the $500 minimum means</h3><p>Your subscription starts at $500 per month. It is applied against approved placements. If your approved target requires more, we arrange the additional amount with you rather than forcing a plan tier.</p>',
      '<h3>$500 is the monthly minimum</h3><p>The $500 is your minimum monthly commitment, not the price of one link. It is applied against the placements you approve. Your total spend varies with the number and price of those approved links.</p>'
    );
    html = html.replace(
      'There are no bundles. Each link is priced individually because publisher costs vary by website. Set a monthly target below to see a sensible working-budget estimate, then approve the exact links you want.',
      'There are no bundles and links are not charged at a flat $500 each. Individual placements typically cost $250–$800, depending on the publisher. Set a monthly target below to see an estimated spend range, then approve the exact pages and prices you want.'
    );
    html = html.replace(
      'Minimum monthly commitment · $500',
      '$500 minimum monthly commitment · not per link'
    );
    html = html.replace(
      "var estimate=Math.max(500,links*500);count.textContent=String(links);word.textContent=links===1?'link':'links';budget.textContent='$'+estimate.toLocaleString();",
      "var low=Math.max(500,links*250);var high=Math.max(500,links*800);count.textContent=String(links);word.textContent=links===1?'link':'links';budget.textContent='$'+low.toLocaleString()+'–$'+high.toLocaleString();"
    );

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
    res.status(200).send(html);
  } catch (_error) {
    res.status(500).send('Unable to render Done For You page.');
  }
}