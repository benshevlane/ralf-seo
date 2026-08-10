// Production-shaped renderer used on the staging branch to surface the Done For You alternative on /pricing.
// The final two injections are staging-only because this file is changed only on agent/emerald-hero-staging.
const DONE_FOR_YOU_BANNER = `
<section aria-label="Ralf Done For You" style="padding:30px 0;background:#f4f4f3;border-top:1px solid rgba(18,18,18,.06);border-bottom:1px solid rgba(18,18,18,.06)">
  <div style="max-width:1180px;margin:0 auto;padding:0 32px">
    <div style="background:#121212;color:#fff;border-radius:16px;padding:26px 28px;display:grid;grid-template-columns:1fr auto;gap:28px;align-items:center">
      <div>
        <div style="font-family:'Space Mono',ui-monospace,monospace;font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:rgba(255,255,255,.52)">Additional targeted link-building service</div>
        <h2 style="font-family:'Space Grotesk',system-ui,sans-serif;font-size:clamp(25px,3vw,36px);line-height:1.06;letter-spacing:-.035em;margin:8px 0 0">Keep your agency. Let us handle targeted link building.</h2>
        <p style="font-family:'Inter Tight',system-ui,sans-serif;font-size:15.5px;line-height:1.55;color:rgba(255,255,255,.7);max-width:74ch;margin:11px 0 0">Ralf Done For You works alongside your existing agency or in-house team. We map your competitors’ citations and backlinks, run targeted publisher outreach, negotiate each placement and manage every approved link through to live.</p>
        <p style="font-family:'Inter Tight',system-ui,sans-serif;font-size:14px;font-weight:600;margin:10px 0 0">Pay as you go per approved link · $500/month minimum applied to placements · you approve every page and price</p>
      </div>
      <a href="/done-for-you" style="font-family:'Inter Tight',system-ui,sans-serif;font-weight:600;font-size:15px;white-space:nowrap;background:#fff;color:#121212;border-radius:999px;padding:13px 20px;text-decoration:none">View Done For You →</a>
    </div>
  </div>
  <style>@media(max-width:720px){section[aria-label="Ralf Done For You"]>div{padding:0 20px!important}section[aria-label="Ralf Done For You"]>div>div{grid-template-columns:1fr!important;padding:23px 21px!important}section[aria-label="Ralf Done For You"] a{width:100%;text-align:center}}</style>
</section>`;

const STAGING_STYLE = '<link rel="stylesheet" href="/assets/staging-emerald.css" data-ralf-staging-sitewide>';
const STAGING_SCRIPT = '<script defer src="/assets/staging-trial.js" data-ralf-staging-sitewide></script>';

export default async function handler(_req, res) {
  try {
    const response = await fetch('https://raw.githubusercontent.com/benshevlane/ralf-seo/master/pricing.html', {
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

    if (!html.includes('<a href="/done-for-you">Done For You</a>')) {
      html = html.replace(
        '<a href="/methodology">Methodology</a>',
        '<a href="/done-for-you">Done For You</a><a href="/methodology">Methodology</a>'
      );
    }

    if (!html.includes('/assets/staging-emerald.css')) {
      html = html.replace('</head>', `${STAGING_STYLE}\n</head>`);
    }
    if (!html.includes('/assets/staging-trial.js')) {
      html = html.replace('</body>', `${STAGING_SCRIPT}\n</body>`);
      if (!html.includes('/assets/staging-trial.js')) {
        html = html.replace('</html>', `${STAGING_SCRIPT}\n</html>`);
      }
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('x-robots-tag', 'noindex, nofollow, noarchive');
    res.setHeader('x-ralf-staging', 'pricing-sitewide-green-trial');
    res.status(200).send(html);
  } catch (_error) {
    res.status(500).send('Unable to render pricing page.');
  }
}
