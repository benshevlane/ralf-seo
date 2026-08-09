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

    // The opportunity banner repeats context already explained by the animated screen.
    // Remove it completely and give that vertical space back to the product demo.
    html = html.replace(
      /\s*<div class="r2-op">[\s\S]*?<\/div>\s*<div class="r2-body">/,
      '\n          <div class="r2-body">'
    );

    // Make slide two communicate one simple, important connection:
    // the page recommends the competitor AND the AI engines cite that same page.
    const sourceStage = /\{\s*state:'Reason found',head:'Finding out why',hs:'evidence traced',[\s\S]*?\},\s*\{\s*state:'Content drafted'/;
    const clearerSourceStage = String.raw`{
      state:'Source + citation found',head:'Why this page matters',hs:'competitor + AI citation',
      html:'<div class="r2-k">The connection Ralf found</div><h3>We found a page recommending your competitor — and AI is citing it.</h3><p>That combination matters: this page is helping shape the same AI answers where your competitor is beating you.</p><div class="r2-evidence"><div class="r2-ai-row"><span class="r2-ai-label">AI engines</span><span class="r2-ai-pill">ChatGPT</span><span class="r2-ai-pill">Gemini</span><b>cite this page</b></div><div class="r2-connector"><span>↓</span><small>cites</small></div><div class="r2-source-card"><strong>nordicapis.com/monitoring-tools</strong><div class="r2-proof-grid"><span class="r2-proof"><b>✓</b> Recommends Competitor A</span><span class="r2-proof"><b>✓</b> Cited by ChatGPT + Gemini</span></div></div><div class="r2-opportunity-note"><b>Ralf found the opportunity</b><span>Get your brand included on a source AI already trusts.</span></div></div>'
    },
    {
      state:'Content drafted'`;

    const beforeSourceRewrite = html;
    html = html.replace(sourceStage, clearerSourceStage);
    if (html === beforeSourceRewrite) throw new Error('Could not clarify source and AI citation stage');

    // Tell the product story in the right order:
    // discover the external influence -> run outreach -> then show that Ralf also
    // creates the on-site content needed to win AI recommendations.
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

    // Give the more explanatory second slide a little longer to read.
    html = html.replace(
      'var durations=[4600,4600,5400,5400,4600,5200]',
      'var durations=[4600,5400,5400,5400,4600,5200]'
    );

    const patch = String.raw`<style data-ralf-v2="expanded-screen-patch">
/* The demo itself is now the hero: no workflow rail and no redundant opportunity banner. */
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
.r2-line{font-size:13.5px!important;gap:11px!important}
.r2-line+.r2-line{margin-top:10px!important}
.r2-badge{font-size:9.5px!important;padding:5px 9px!important}
.r2-mail{font-size:13px!important;line-height:1.6!important}
.r2-doc{padding:14px 15px!important;margin-top:16px!important;border-radius:12px!important}
.r2-doc-title{font-size:14px!important;margin-bottom:10px!important}
.r2-doc-line{height:7px!important;margin-top:8px!important}
.r2-approval-row{font-size:13px!important;padding:11px 0!important;gap:12px!important}
.r2-approval-row b{min-width:74px!important}
.r2-big{font-size:52px!important}.r2-before{font-size:27px!important}.r2-up{font-size:11px!important}

/* Slide two: make the competitor recommendation + AI citation combination unmistakable. */
.r2-evidence{margin-top:18px;display:grid;grid-template-columns:1fr;justify-items:stretch}
.r2-ai-row{display:flex;align-items:center;gap:8px;padding:10px 13px;border:1px solid var(--line);border-radius:11px;background:#fafafa;font-size:12px}
.r2-ai-label{font:700 9px var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--mut2);margin-right:2px}
.r2-ai-pill{font:700 9px var(--mono);padding:4px 7px;border-radius:999px;background:#fff;border:1px solid var(--line);color:var(--ink)}
.r2-ai-row>b{margin-left:auto;color:#047857;font-size:11.5px}
.r2-connector{height:34px;display:flex;align-items:center;justify-content:center;gap:7px;color:#059669}
.r2-connector span{font:700 18px/1 var(--mono)}.r2-connector small{font:700 8px var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--mut2)}
.r2-source-card{border:1.5px solid #059669;border-radius:13px;background:#ecfdf5;padding:13px 14px;box-shadow:0 10px 26px -22px rgba(4,120,87,.7)}
.r2-source-card>strong{display:block;font:600 14px var(--display);color:var(--ink);margin-bottom:9px}
.r2-proof-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.r2-proof{display:flex;align-items:center;gap:7px;background:#fff;border:1px solid #a7f3d0;border-radius:9px;padding:9px 10px;font-size:11.5px;font-weight:600;color:#333}
.r2-proof b{width:20px;height:20px;flex:0 0 20px;border-radius:50%;display:grid;place-items:center;background:var(--accent-grad);color:#fff;font-size:10px}
.r2-opportunity-note{margin-top:9px;display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:10px;background:#121212;color:#fff}
.r2-opportunity-note b{font-size:11.5px;white-space:nowrap}.r2-opportunity-note span{font-size:10.5px;color:rgba(255,255,255,.72)}

@media(max-width:900px){
  .r2-card{height:370px!important;min-height:350px!important}
  .r2-body{height:calc(100% - 42px)!important;padding:8px 10px 10px!important}
  .r2-detail-head{height:32px!important;padding:0 11px!important;font-size:8.5px!important}
  .r2-detail::after{top:32px!important;height:36px!important}
  .r2-scene{padding:15px 16px!important}
  .r2-k{font-size:8px!important}
  .r2-scene h3{font-size:20px!important;line-height:1.05!important;margin:6px 0 7px!important}
  .r2-scene p{font-size:10.5px!important;line-height:1.45!important}
  .r2-metric{margin-top:10px!important;padding:10px 11px!important;min-height:66px!important}
  .r2-line{font-size:9.5px!important}.r2-line+.r2-line{margin-top:6px!important}
  .r2-badge{font-size:7.5px!important;padding:3px 6px!important}
  .r2-mail{font-size:9.5px!important;line-height:1.47!important}
  .r2-doc{padding:8px 9px!important;margin-top:8px!important}.r2-doc-title{font-size:9.5px!important;margin-bottom:6px!important}.r2-doc-line{height:4px!important;margin-top:5px!important}
  .r2-approval-row{font-size:9px!important;padding:6px 0!important;gap:7px!important}.r2-approval-row b{min-width:52px!important}
  .r2-big{font-size:34px!important}.r2-before{font-size:19px!important}.r2-up{font-size:8px!important}
  .r2-evidence{margin-top:9px}.r2-ai-row{padding:6px 8px;gap:5px;font-size:8px}.r2-ai-label{font-size:6.5px}.r2-ai-pill{font-size:6.5px;padding:2px 4px}.r2-ai-row>b{font-size:7.5px}.r2-connector{height:20px;gap:4px}.r2-connector span{font-size:12px}.r2-connector small{font-size:6px}.r2-source-card{padding:7px 8px}.r2-source-card>strong{font-size:9.5px;margin-bottom:5px}.r2-proof-grid{gap:4px}.r2-proof{font-size:7.5px;padding:5px 6px;gap:4px}.r2-proof b{width:14px;height:14px;flex-basis:14px;font-size:7px}.r2-opportunity-note{margin-top:5px;padding:5px 7px;gap:5px}.r2-opportunity-note b{font-size:7.5px}.r2-opportunity-note span{font-size:7px}
}
@media(max-width:520px){
  .r2-card{height:358px!important;min-height:342px!important}
  .r2-scene h3{font-size:18px!important}
  .r2-scene p{font-size:10px!important}
  .r2-proof-grid{grid-template-columns:1fr}.r2-opportunity-note span{display:none}
}
@media(max-height:720px) and (max-width:900px){
  .r2-card{height:332px!important;min-height:316px!important}
  .r2-scene{padding:10px 11px