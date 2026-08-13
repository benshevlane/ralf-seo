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

    html = html.replace(
      /\s*<div class="r2-op">[\s\S]*?<\/div>\s*<div class="r2-body">/,
      '\n          <div class="r2-body">'
    );

    // Slide two: make the combination unmistakable — the same page both
    // recommends the competitor and is cited by AI engines.
    const sourceStage = /\{\s*state:'Reason found',head:'Finding out why',hs:'evidence traced',[\s\S]*?\},\s*\{\s*state:'Content drafted'/;
    const clearerSourceStage = String.raw`{
      state:'Source + citation found',head:'Why this page matters',hs:'competitor + AI citation',
      html:'<div class="r2-k">The connection Ralf found</div><h3>We found a page recommending your competitor — and AI is citing it.</h3><p>That combination matters: this page is helping shape the same AI answers where your competitor is beating you.</p><div style="margin-top:18px"><div style="display:flex;align-items:center;gap:8px;padding:10px 13px;border:1px solid var(--line);border-radius:11px;background:#fafafa;font-size:12px"><b style="font:700 9px var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--mut2)">AI engines</b><span class="r2-badge">ChatGPT</span><span class="r2-badge">Gemini</span><strong style="margin-left:auto;color:#047857">cite this page</strong></div><div style="height:30px;display:grid;place-items:center;color:#059669;font:700 18px var(--mono)">↓</div><div style="border:1.5px solid #059669;border-radius:13px;background:#ecfdf5;padding:13px 14px"><strong style="display:block;font-size:14px;margin-bottom:9px">nordicapis.com/monitoring-tools</strong><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><span style="background:#fff;border:1px solid #a7f3d0;border-radius:9px;padding:9px 10px;font-size:11.5px;font-weight:600">✓ Recommends Competitor A</span><span style="background:#fff;border:1px solid #a7f3d0;border-radius:9px;padding:9px 10px;font-size:11.5px;font-weight:600">✓ Cited by ChatGPT + Gemini</span></div></div><div style="margin-top:9px;padding:9px 12px;border-radius:10px;background:#121212;color:#fff;font-size:11px"><b>Ralf found the opportunity →</b> <span style="color:rgba(255,255,255,.72)">Get your brand included on a source AI already trusts.</span></div></div>'
    },
    {
      state:'Content drafted'`;
    const beforeSourceRewrite = html;
    html = html.replace(sourceStage, clearerSourceStage);
    if (html === beforeSourceRewrite) throw new Error('Could not clarify source and AI citation stage');

    // Outreach first, then make it explicit that Ralf also writes on-site content.
    const stagePair = /\{\s*state:'Content drafted',head:'Creating missing content',hs:'draft in progress',[\s\S]*?\},\s*\{\s*state:'Outreach drafted',head:'Reaching sites influencing AI',hs:'target verified',[\s\S]*?\},\s*\{\s*state:'Ready for you'/;
    const rewrittenStages = String.raw`{
      state:'Outreach drafted',head:'Influencing the sites AI trusts',hs:'publisher found',
      html:'<div class="r2-k">Off-site influence</div><h3>Ralf gets your brand into the sources AI already trusts.</h3><p>It finds the publishers, comparison pages and websites already influencing AI answers, then drafts personalised outreach to get you included too.</p><div class="r2-metric r2-mail"><b>To:</b> editor@nordicapis.com<br><b>Subject:</b> A useful addition to your monitoring guide<br><br>Your guide already covers the tools AI recommends. We have fresh latency data and a free tier your readers may find useful…</div>'
    },
    {
      state:'Content drafted',head:'Writing content on your site',hs:'your site · draft ready',
      html:'<div class="r2-k">On-site content</div><h3>Ralf also writes the content AI needs to find on your own site.</h3><p>External citations are only half the job. Ralf writes the articles and pages your site is missing, fact-checks them, adds internal links and structures them so AI engines can understand and quote you.</p><div class="r2-doc"><div class="r2-doc-title">Best API monitoring tools in 2026</div><div class="r2-doc-line green" style="width:94%"></div><div class="r2-doc-line" style="width:82%"></div><div class="r2-doc-line" style="width:88%"></div><div class="r2-doc-line" style="width:64%"></div></div><div class="r2-line" style="margin-top:12px"><span>Written directly for your website · fact-checked · internal links added</span><span class="r2-badge green">ready to review</span></div>'
    },
    {
      state:'Ready for you'`;

    const beforeStageRewrite = html;
    html = html.replace(stagePair, rewrittenStages);
    if (html === beforeStageRewrite) throw new Error('Could not reorder outreach and content stages');

    // Give slide two slightly longer because the relationship is worth reading.
    html = html.replace('var durations=[4600,4600,5400,5400,4600,5200]', 'var durations=[4600,5400,5400,5400,4600,5200]');

    const patch = String.raw`<style data-ralf-v2="expanded-screen-patch">
.r2-flow,.r2-op{display:none!important}
.r2-card{height:510px}
.r2-body{display:block!important;height:460px!important;padding:10px 16px 14px!important}
.r2-detail{height:100%!important;width:100%!important;min-height:0!important;border-radius:18px!important}
.r2-detail-head{height:46px!important;padding:0 18px!important;font-size:11px!important}
.r2-detail::after{top:46px!important;height:54px!important}
.r2-scene{padding:30px 32px!important}
.r2-k{font-size:10.5px!important}
.r2-scene h3{font-size:30px!important;line-height:1.04!important;margin:10px 0 11px!important;max-width:30ch!important}
.r2-scene p{font-size:14.5px!important;line-height:1.52!important;max-width:66ch!important}
.r2-metric{margin-top:20px!important;padding:17px 18px!important;min-height:108px!important;border-radius:13px!important}
.r2-line{font-size:13.5px!important;gap:11px!important}.r2-line+.r2-line{margin-top:10px!important}
.r2-badge{font-size:9.5px!important;padding:5px 9px!important}.r2-mail{font-size:13px!important;line-height:1.6!important}
.r2-doc{padding:14px 15px!important;margin-top:16px!important;border-radius:12px!important}.r2-doc-title{font-size:14px!important;margin-bottom:10px!important}.r2-doc-line{height:7px!important;margin-top:8px!important}
.r2-approval-row{font-size:13px!important;padding:11px 0!important;gap:12px!important}.r2-approval-row b{min-width:74px!important}
.r2-big{font-size:52px!important}.r2-before{font-size:27px!important}.r2-up{font-size:11px!important}
@media(max-width:900px){
.r2-card{height:370px!important;min-height:350px!important}.r2-body{height:calc(100% - 42px)!important;padding:8px 10px 10px!important}.r2-detail-head{height:32px!important;padding:0 11px!important;font-size:8.5px!important}.r2-detail::after{top:32px!important;height:36px!important}.r2-scene{padding:15px 16px!important}.r2-k{font-size:8px!important}.r2-scene h3{font-size:20px!important;line-height:1.05!important;margin:6px 0 7px!important}.r2-scene p{font-size:10.5px!important;line-height:1.45!important}.r2-metric{margin-top:10px!important;padding:10px 11px!important;min-height:66px!important}.r2-line{font-size:9.5px!important}.r2-line+.r2-line{margin-top:6px!important}.r2-badge{font-size:7.5px!important;padding:3px 6px!important}.r2-mail{font-size:9.5px!important;line-height:1.47!important}.r2-doc{padding:8px 9px!important;margin-top:8px!important}.r2-doc-title{font-size:9.5px!important;margin-bottom:6px!important}.r2-doc-line{height:4px!important;margin-top:5px!important}.r2-approval-row{font-size:9px!important;padding:6px 0!important;gap:7px!important}.r2-approval-row b{min-width:52px!important}.r2-big{font-size:34px!important}.r2-before{font-size:19px!important}.r2-up{font-size:8px!important}
}
@media(max-width:520px){.r2-card{height:358px!important;min-height:342px!important}.r2-scene h3{font-size:18px!important}.r2-scene p{font-size:10px!important}}
@media(max-height:720px) and (max-width:900px){.r2-card{height:332px!important;min-height:316px!important}.r2-scene{padding:10px 11px!important}.r2-scene h3{font-size:16px!important}.r2-scene p{font-size:9px!important}.r2-metric{min-height:48px!important;padding:7px 8px!important}}
</style>`;

    html = html.replace('</head>', `${patch}\n<style data-ralf-staging-expanded>body:before{content:'STAGING · HERO V2 · SOURCE + AI CITATION';}</style>\n</head>`);

    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 'no-store, max-age=0');
    res.setHeader('x-robots-tag', 'noindex, nofollow, noarchive');
    res.setHeader('x-ralf-staging', 'hero-v2-source-ai-citation');
    res.status(200).send(html);
  } catch (error) {
    console.error('staging-home-expanded failed', error);
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 'no-store');
    res.status(500).send(`<!doctype html><title>Ralf staging error</title><style>body{font:16px system-ui;padding:40px;max-width:700px;margin:auto}code{background:#f4f4f4;padding:3px 6px;border-radius:5px}</style><h1>Ralf staging could not render the expanded animation</h1><p><code>${String(error?.message || error).replace(/[<>&]/g, '')}</code></p>`);
  }
}
