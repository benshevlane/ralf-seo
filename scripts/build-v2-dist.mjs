import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const out = path.join(root, 'dist');
const skip = new Set(['.git', '.vercel', 'node_modules', 'dist']);

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

for (const entry of await readdir(root, { withFileTypes: true })) {
  if (skip.has(entry.name)) continue;
  await cp(path.join(root, entry.name), path.join(out, entry.name), { recursive: true });
}

process.chdir(out);
const transform = pathToFileURL(path.join(root, 'scripts', 'build-emerald-hero-v2.mjs')).href;
await import(transform + '?run=' + Date.now());

console.log('Prepared transformed Ralf V2 site in dist/ for Vercel publishing.');
