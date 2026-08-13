import { promises as fs } from 'node:fs';
import path from 'node:path';
import { css, dots, stages, durations } from '../lib/staging-v2-config.js';

const root = process.cwd();
const out = path.join(root, 'public', 'index.html');
const directSource = await fs.readFile(path.join(root, 'api', 'staging-v2-direct.js'), 'utf8');
const heroSource = await fs.readFile(path.join(root, 'api', 'hero-v2-base.js'), 'utf8');

function templateBody(source, name) {
  const marker = `const ${name} = String.raw\``;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Could not find ${name}`);
  const bodyStart = start + marker.length;
  const end = source.indexOf('`;', bodyStart);
  if (end < 0) throw new Error(`Could not close ${name}`);
  return source.slice(bodyStart, end);
}

function renderTemplate(body) {
  // These templates are repository-controlled and use only the four imported
  // staging config values. Rendering them at build time removes all serverless
  // self-fetches while preserving the approved staging markup exactly.
  return Function('css', 'dots', 'stages', 'durations', `return String.raw\`${body}\`;`)(css, dots, stages, durations);
}

const HERO_HTML = renderTemplate(templateBody(directSource, 'HERO_HTML'));
const BASE_STYLES = renderTemplate(templateBody(directSource, 'BASE_STYLES'));
const SCRIPT = renderTemplate(templateBody(directSource, 'SCRIPT'));
const singleSurfaceCss = renderTemplate(templateBody(heroSource, 'singleSurfaceCss'));
const homepageGreenCss = renderTemplate(templateBody(heroSource, 'homepageGreenCss'));
const neutralHeroCss = renderTemplate(templateBody(heroSource, 'neutralHeroCss'));
const rotatorScript = renderTemplate(templateBody(heroSource, 'rotatorScript'));

let html = await fs.readFile(out, 'utf8');
const hero = /<header class="heroB"[\s\S]*?<\/header>/;
if (!hero.test(html)) throw new Error('Could not find production homepage hero');

html = html.replace(hero, HERO_HTML);
html = html.replace('</head>', `${BASE_STYLES}\n${css}\n</head>`);
html = html.replace('</body>', `${SCRIPT}\n</body>`);

html = html.replace(/<div class="r2x-dots" aria-label="Choose animation stage">[\s\S]*?<\/div>/, dots);
html = html.replace(/var stages=\[[\s\S]*?\];\s*var durations=/, `${stages}\nvar durations=`);
html = html.replace(/var durations=\[[^\]]+\]/, `var durations=${durations}`);
html = html.replace('<h1>Get your business found by <em>AI</em></h1>', '<h1>Get your business found by <span class="r2x-rotator" aria-label="AI search engines"><span class="r2x-rw is-in">AI</span></span></h1>');
html = html.replace('</head>', `${singleSurfaceCss}\n${homepageGreenCss}\n<link rel="stylesheet" href="/assets/staging-emerald.css" data-ralf-emerald>\n${neutralHeroCss}\n</head>`);
html = html.replace('</body>', `${rotatorScript}\n<script defer src="/assets/staging-trial.js" data-ralf-staging-sitewide></script>\n</body>`);

// Production is in private beta: replace the URL-entry trial control with the
// beta application CTA, while keeping the approved animation and layout.
html = html.replace(/<form class="r2x-start" id="r2xStart">[\s\S]*?<\/form>\s*<div class="r2x-note">[\s\S]*?<\/div>/, '<a class="btn lg r2x-beta-cta" href="/beta">Apply for the private beta <span class="arr">→</span></a>');
html = html.replace('</head>', '<style data-ralf-beta-cta>.r2x-beta-cta{grid-column:1;grid-row:2;justify-self:start;margin-top:4px;background:linear-gradient(135deg,#047857,#059669)!important;border-color:#047857!important;color:#fff!important}@media(max-width:900px){.r2x-beta-cta{grid-row:3;justify-self:center;margin-top:10px}}</style>\n</head>');

// Staging renderers deliberately add noindex. The public static homepage must
// remain indexable, so remove any staging-only robots directives/labels.
html = html
  .replace(/<meta name="robots" content="noindex,nofollow,noarchive">/g, '')
  .replace(/<[^>]*>STAGING · HERO V2 · GREEN ACCENTS<\/[^>]+>/g, '')
  .replace(/STAGING · HERO V2 · GREEN ACCENTS/g, '')
  .replace(/STAGING · HERO V2 · PROMPT FIRST \+ CONTROLS/g, '')
  .replace(/STAGING · HERO V2 · SINGLE SURFACE/g, '');

await fs.writeFile(out, html);
console.log('Approved Ralf homepage rendered statically into public/index.html.');
