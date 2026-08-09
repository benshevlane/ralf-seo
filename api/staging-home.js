const PROD_HOME = 'https://ralfhq.com/';
const BUILD_SCRIPT = 'https://raw.githubusercontent.com/benshevlane/ralf-seo/fa56d476f8464f1010c4fa067dc40a85dde07721/scripts/build-emerald-hero-v2.mjs';

function template(source, name) {
  const marker = `const ${name} = String.raw\``;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Missing ${name}`);
  const bodyStart = start + marker.length;
  const end = source.indexOf('`;', bodyStart);
  if (end < 0) throw new Error(`Unclosed ${name}`);
  return source.slice(bodyStart, end);
}

export default async function handler(req, res) {
  try {
    const [pageResponse, buildResponse] = await Promise.all([
      fetch(PROD_HOME, { headers: { 'user-agent': 'Ralf-Staging/2.0' }, cache: 'no-store' }),
      fetch(BUILD_SCRIPT, { headers: { 'user-agent': 'Ralf-Staging/2.0' }, cache: 'no-store' }),
    ]);

    if (!pageResponse.ok) throw new Error(`Production homepage returned ${pageResponse.status}`);
    if (!buildResponse.ok) throw new Error(`V2 build source returned ${buildResponse.status}`);

    let html = await pageResponse.text();
    const source = await buildResponse.text();
    const baseCss = template(source, 'BASE_CSS');
    const heroCss = template(source, 'HERO_CSS');
    const hero = template(source, 'HERO');
    const heroJs = template(source, 'HERO_JS');

    const heroStart = html.indexOf('<header class="heroB">');
    const heroEnd = html.indexOf('</header>', heroStart);
    if (heroStart < 0 || heroEnd < 0) throw new Error('Production hero not found');

    html = html.slice(0, heroStart) + hero + html.slice(heroEnd + '</header>'.length);
    html = html.replace('</head>', `${baseCss}\n${heroCss}\n<style data-ralf-staging>body:before{content:'STAGING · HERO V2';position:fixed;left:12px;bottom:12px;z-index:999999;background:#121212;color:#fff;padding:6px 9px;border-radius:999px;font:700 9px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em}</style>\n</head>`);
    html = html.replace('</body>', `${heroJs}\n</body>`);
    html = html.replace(/<meta name="robots"[^>]*>/i, '<meta name="robots" content="noindex,nofollow,noarchive">');
    html = html.replace(/\s*<!-- Google tag \(gtag\.js\) -->\s*<script async[\s\S]*?<\/script>\s*<script>[\s\S]*?<\/script>/i, '');

    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 'no-store, max-age=0');
    res.setHeader('x-robots-tag', 'noindex, nofollow,noarchive');
    res.setHeader('x-ralf-staging', 'hero-v2');
    res.status(200).send(html);
  } catch (error) {
    console.error('staging-home failed', error);
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 'no-store');
    res.status(500).send(`<!doctype html><title>Ralf staging error</title><style>body{font:16px system-ui;padding:40px;max-width:700px;margin:auto}code{background:#f4f4f4;padding:3px 6px;border-radius:5px}</style><h1>Ralf staging could not render Version 2</h1><p><code>${String(error?.message || error).replace(/[<>&]/g, '')}</code></p>`);
  }
}