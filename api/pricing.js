// Production-shaped renderer used on the staging branch to surface the Done For You alternative on /pricing.
// The final injections are staging-only because this file is changed only on agent/emerald-hero-staging.
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

const PRICING_LAYOUT_FIX = `<style data-ralf-pricing-layout-fix>
/* Put the actual paid tiers directly after the pricing intro and remove the loose spacing seen in the old page. */
body > section.blockB:first-of-type{padding-top:58px!important;padding-bottom:46px!important}
section[data-pricing-primary]{padding-top:48px!important;padding-bottom:58px!important}
section[data-pricing-primary] .h-sec{margin-top:5px!important}
section[data-pricing-primary] .lead{margin-bottom:24px!important}

/* A legacy closing-div mismatch leaves this mono note outside .wrap in the source HTML.
   Keep it visually aligned with the cards without changing production source markup. */
section.blockB > p[style*="font-family:var(--mono)"]{
  display:block!important;
  box-sizing:border-box!important;
  width:100%!important;
  max-width:1180px!important;
  margin:16px auto 0!important;
  padding:0 32px!important;
}

/* Keep the individual Search / Outreach / Content tier groups compact and readable. */
body > section.blockB.sec-line:not([data-pricing-primary]){padding-top:66px!important;padding-bottom:66px!important}

@media(max-width:720px){
  body > section.blockB:first-of-type{padding-top:42px!important;padding-bottom:34px!important}
  section[data-pricing-primary]{padding-top:38px!important;padding-bottom:44px!important}
  section.blockB > p[style*="font-family:var(--mono)"]{padding:0 20px!important}
}
</style>`;

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

    // Match the visible Suite heading, not the earlier JSON-LD product name.
    const suiteMarker = '>Ralf Suite</div>';
    const suiteMarkerIndex = html.indexOf(suiteMarker);
    if (suiteMarkerIndex !== -1) {
      const suiteSectionStart = html.lastIndexOf('<section', suiteMarkerIndex);
      const suiteOpenEnd = html.indexOf('>', suiteSectionStart);
      if (suiteSectionStart !== -1 && suiteOpenEnd !== -1) {
        const suiteOpenTag = html.slice(suiteSectionStart, suiteOpenEnd + 1);
        if (!suiteOpenTag.includes('data-pricing-primary')) {
          html = html.slice(0, suiteOpenEnd) + ' data-pricing-primary' + html.slice(suiteOpenEnd);
        }
      }

      const refreshedMarkerIndex = html.indexOf(suiteMarker);
      const suiteSectionEnd = html.indexOf('</section>', refreshedMarkerIndex);
      if (suiteSectionEnd !== -1) {
        const insertAt = suiteSectionEnd + '</section>'.length;
        html = html.slice(0, insertAt) + DONE_FOR_YOU_BANNER + html.slice(insertAt);
      }
    } else {
      const firstSectionEnd = html.indexOf('</section>');
      if (firstSectionEnd !== -1) {
        const insertAt = firstSectionEnd + '</section>'.length;
        html = html.slice(0, insertAt) + DONE_FOR_YOU_BANNER + html.slice(insertAt);
      }
    }

    if (!html.includes('<a href="/done-for-you">Done For You</a>')) {
      html = html.replace(
        '<a href="/methodology">Methodology</a>',
        '<a href="/done-for-you">Done For You</a><a href="/methodology">Methodology</a>'
      );
    }

    if (!html.includes('/assets/staging-emerald.css')) {
      html = html.replace('</head>', `${STAGING_STYLE}\n${PRICING_LAYOUT_FIX}\n</head>`);
    } else if (!html.includes('data-ralf-pricing-layout-fix')) {
      html = html.replace('</head>', `${PRICING_LAYOUT_FIX}\n</head>`);
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
    res.setHeader('x-ralf-staging', 'pricing-primary-tiers-first');
    res.status(200).send(html);
  } catch (_error) {
    res.status(500).send('Unable to render pricing page.');
  }
}
