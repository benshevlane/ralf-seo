import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const skipDirs = new Set(['.git', 'node_modules', '.vercel']);
const styleTag = '<link rel="stylesheet" href="/assets/staging-emerald.css" data-ralf-staging-sitewide>';
const scriptTag = '<script defer src="/assets/staging-trial.js" data-ralf-staging-sitewide></script>';
let changed = 0;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue;

    let html = await fs.readFile(full, 'utf8');
    const before = html;

    if (!html.includes('data-ralf-staging-sitewide') && /<\/head>/i.test(html)) {
      html = html.replace(/<\/head>/i, `${styleTag}\n</head>`);
    } else if (!html.includes('/assets/staging-emerald.css') && /<\/head>/i.test(html)) {
      html = html.replace(/<\/head>/i, `${styleTag}\n</head>`);
    }

    if (!html.includes('/assets/staging-trial.js') && /<\/body>/i.test(html)) {
      html = html.replace(/<\/body>/i, `${scriptTag}\n</body>`);
    } else if (!html.includes('/assets/staging-trial.js') && /<\/html>/i.test(html)) {
      html = html.replace(/<\/html>/i, `${scriptTag}\n</html>`);
    }

    if (html !== before) {
      await fs.writeFile(full, html, 'utf8');
      changed += 1;
    }
  }
}

await walk(root);
console.log(`Ralf staging site-wide layer injected into ${changed} HTML page(s).`);
