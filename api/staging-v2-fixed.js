export default async function handler(req, res) {
  try {
    const host = req.headers.host;
    if (!host) throw new Error('Missing host header');
    const proto = (req.headers['x-forwarded-proto'] || 'https').toString().split(',')[0].trim();
    const upstream = await fetch(`${proto}://${host}/api/staging-v2-direct`, {
      headers: { 'user-agent': 'Ralf-Staging-V2-Fixed/1.1' },
      cache: 'no-store',
    });
    if (!upstream.ok) throw new Error(`Direct staging hero returned ${upstream.status}`);
    let html = await upstream.text();

    const css = String.raw`<style data-ralf-v2-layout-fix>
/* Isolate the hero animation from legacy marketing-site layout rules. */
.r2x-demo,.r2x-card,.r2x-screen,.r2x-screen-head,.r2x-scene,.r2x-scene>*{box-sizing:border-box}
.r2x-scene{display:block!important;columns:auto!important;column-count:auto!important;column-width:auto!important;text-align:left!important;white-space:normal!important}
.r2x-scene>*{position:relative!important;float:none!important;clear:both!important;display:block!important;width:auto!important;max-width:none!important;margin-left:0!important;margin-right:0!important;grid-column:auto!important;grid-row:auto!important;align-self:auto!important;justify-self:auto!important}
.r2x-scene>.r2x-k{display:block!important;width:100%!important;margin:0!important}
.r2x-scene>h3{display:block!important;width:100%!important;max-width:760px!important;margin:10px 0 11px!important;font-size:29px!important;line-height:1.05!important}
.r2x-scene>p{display:block!important;width:100%!important;max-width:760px!important;margin:0!important;font-size:14px!important;line-height:1.52!important}
.r2x-scene>.r2x-panel,.r2x-scene>.r2x-ai-source,.r2x-scene>.r2x-doc,.r2x-scene>.r2x-approval{display:block!important;width:100%!important;max-width:none!important;margin-left:0!important;margin-right:0!important}
.r2x-panel{margin-top:19px!important}
.r2x-ai-source{margin-top:18px!important}
.r2x-doc{margin-top:14px!important}
.r2x-approval{margin-top:18px!important}
.r2x-row,.r2x-prompt,.r2x-airow,.r2x-approval-row,.r2x-result{float:none!important;clear:none!important}
.r2x-controls{font-size:9px!important}
@media(max-width:900px){
  .r2x-scene{display:block!important}
  .r2x-scene>*{display:block!important;width:auto!important;max-width:none!important}
  .r2x-scene>.r2x-k,.r2x-scene>h3,.r2x-scene>p,.r2x-scene>.r2x-panel,.r2x-scene>.r2x-ai-source,.r2x-scene>.r2x-doc,.r2x-scene>.r2x-approval{width:100%!important}
  .r2x-scene>h3{font-size:17px!important;line-height:1.05!important;margin:5px 0 6px!important}
  .r2x-scene>p{font-size:9.2px!important;line-height:1.4!important}
  .r2x-panel{margin-top:8px!important}.r2x-ai-source{margin-top:8px!important}.r2x-doc{margin-top:6px!important}.r2x-approval{margin-top:8px!important}
}
</style>`;

    const dots = String.raw`<div class="r2x-dots" aria-label="Choose animation stage">
            <button type="button" data-stage="0" aria-label="Stage 1: Run prompts" aria-pressed="true">1</button>
            <button type="button" data-stage="1" aria-label="Stage 2: Find the competitor citation opportunity" aria-pressed="false">2</button>
            <button type="button" data-stage="2" aria-label="Stage 3: Outreach" aria-pressed="false">3</button>
            <button type="button" data-stage="3" aria-label="Stage 4: Content" aria-pressed="false">4</button>
            <button type="button" data-stage="4" aria-label="Stage 5: Fix site structure" aria-pressed="false">5</button>
            <button type="button" data-stage="5" aria-label="Stage 6: Track results" aria-pressed="false">6</button>
          </div>`;

    const stages = String.raw`var stages=[
    {state:'Running prompts',head:'Finding prompts you should win',hs:'7 AI engines',html:'<div class="r2x-k">Prompt discovery</div><h3>Ralf runs the questions your customers are asking AI.</h3><p>It identifies the high-intent prompts your business should appear for, then checks who ChatGPT, Claude, Gemini and the other major AI engines recommend.</p><div class="r2x-panel"><div class="r2x-prompt"><b>“best API monitoring tool”</b><span class="run"><i></i></span></div><div class="r2x-prompt"><b>“API monitoring for startups”</b><span class="run"><i></i></span></div><div class="r2x-prompt"><b>“best alternative to Competitor A”</b><span class="run"><i></i></span></div><div class="r2x-engines"><span class="r2x-engine">ChatGPT</span><span class="r2x-engine">Claude</span><span class="r2x-engine">Gemini</span><span class="r2x-engine">Perplexity</span><span class="r2x-engine">Copilot</span><span class="r2x-engine">Grok</span><span class="r2x-engine">AI Overviews</span></div></div>'},
    {state:'Opportunity found',head:'Why your competitor is winning',hs:'competitor + AI citation',html:'<div class="r2x-k">The gap + the source</div><h3>We found a page recommending your competitor — and AI is citing it.</h3><p>For “best API monitoring tool”, Competitor A is recommended by 6 of 7 AI engines. Nordic APIs recommends them too — and ChatGPT + Gemini cite that page.</p><div class="r2x-ai-source"><div class="r2x-source"><strong>nordicapis.com/monitoring-tools</strong><div class="r2x-source-signals"><span>✓ Recommends Competitor A</span><span>✓ Cited by ChatGPT + Gemini</span></div></div><div class="r2x-conclusion"><b>Ralf found the opportunity →</b> <span>Get your brand included on a source AI already trusts.</span></div></div>'},
    {state:'Outreach drafted',head:'Influencing the sites AI trusts',hs:'ready to send',html:'<div class="r2x-k">Off-site influence</div><h3>Ralf reaches out to get you included.</h3><p>It finds the right publisher and drafts personalised outreach using the exact page, competitor and citation evidence it found.</p><div class="r2x-panel r2x-mail"><b>To:</b> editor@nordicapis.com<br><b>Subject:</b> A useful addition to your monitoring guide<br><br>Your guide already covers the tools AI recommends. We have fresh latency data and a free tier your readers may find useful…<div class="r2x-mail-lines"><div class="r2x-mail-line green" style="width:94%"></div><div class="r2x-mail-line" style="width:80%"></div><div class="r2x-mail-line" style="width:66%"></div></div><div class="r2x-row" style="margin-top:11px"><span>Personalised pitch prepared</span><span class="r2x-badge green">ready to send</span></div></div>'},
    {state:'Content drafted',head:'Writing content on your site',hs:'ready to publish',html:'<div class="r2x-k">On-site content</div><h3>Ralf writes the content your site needs.</h3><p>External mentions are only half the job. Ralf writes the missing articles and pages on your own site, fact-checks them, adds internal links and structures them so AI can understand and quote you.</p><div class="r2x-doc"><div class="r2x-doc-title">Best API monitoring tools in 2026</div><div class="r2x-doc-line green" style="width:94%"></div><div class="r2x-doc-line" style="width:82%"></div><div class="r2x-doc-line" style="width:88%"></div><div class="r2x-doc-line" style="width:64%"></div></div><div class="r2x-row" style="margin-top:10px"><span>Fact-checked · internal links added · AI-readable structure</span><span class="r2x-badge green">ready to publish</span></div>'},
    {state:'Site fixes ready',head:'Making your site easier for AI to understand',hs:'4 fixes prepared',html:'<div class="r2x-k">Site structure</div><h3>Ralf fixes your site so AI can understand and cite it.</h3><p>It improves the technical structure around your content so AI crawlers can find the right facts, understand the page and quote it confidently.</p><div class="r2x-approval"><div class="r2x-approval-row"><b>Schema</b><span>Add structured data to priority pages</span><span class="r2x-badge green">✓ ready</span></div><div class="r2x-approval-row"><b>Headings</b><span>Clarify the H1 / H2 hierarchy</span><span class="r2x-badge green">✓ ready</span></div><div class="r2x-approval-row"><b>Internal links</b><span>Connect authority to priority pages</span><span class="r2x-badge green">✓ ready</span></div><div class="r2x-approval-row"><b>AI readability</b><span>Surface key facts for crawlers to extract</span><span class="r2x-badge green">✓ ready</span></div></div>'},
    {state:'Result tracked',head:'Measuring what worked',hs:'loop updated',html:'<div class="r2x-k">Outcome</div><h3>You got cited. Your AI visibility increased.</h3><p>Ralf tracks new citations, backlinks and recommendations, then feeds what worked back into the next round of prompts and opportunities.</p><div class="r2x-panel"><div class="r2x-result"><span class="r2x-before">68</span><span class="r2x-arrowmetric">→</span><span class="r2x-big" data-from="68" data-to="74">74</span><span class="r2x-up">AI visibility · +6 points</span></div><div class="r2x-row"><span>nordicapis.com now includes your brand</span><span class="r2x-badge green">citation won</span></div><div class="r2x-row"><span>ChatGPT now recommends you for this question</span><span class="r2x-badge green">prompt won</span></div></div>'}
  ];`;

    html = html.replace(/<div class="r2x-dots" aria-label="Choose animation stage">[\s\S]*?<\/div>/, dots);
    html = html.replace(/var stages=\[[\s\S]*?\];\n  var durations=/, `${stages}\n  var durations=`);
    html = html.replace(/var durations=\[[^\]]+\]/, 'var durations=[6200,6600,6200,6400,6200,6000]');
    html = html.replace('STAGING · HERO V2 · PROMPT FIRST + CONTROLS', 'STAGING · HERO V2 · SIX STAGE LOOP');
    html = html.replace('</head>', `${css}\n</head>`);

    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 'no-store, max-age=0');
    res.setHeader('x-robots-tag', 'noindex, nofollow, noarchive');
    res.setHeader('x-ralf-staging', 'hero-v2-six-stage-loop');
    res.status(200).send(html);
  } catch (error) {
    console.error('staging-v2-fixed failed', error);
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 'no-store');
    res.status(500).send(`<!doctype html><title>Ralf staging error</title><h1>Ralf staging animation failed</h1><p>${String(error?.message || error).replace(/[<>&]/g, '')}</p>`);
  }
}
