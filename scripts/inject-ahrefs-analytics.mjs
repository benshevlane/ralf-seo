import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public");
const SNIPPET = '<script src="https://analytics.ahrefs.com/analytics.js" data-key="0MSfXWjdIGz4tyCIfpb0sQ" async></script>';
const SKIP_TOP_LEVEL = new Set([".git", ".vercel", "node_modules", "public", "api", "scripts"]);
const SKIP_FILES = new Set(["vercel.json", "package.json", "package-lock.json"]);

async function copyStaticTree(src, dst, isRoot = false) {
  await fs.mkdir(dst, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    if (isRoot && SKIP_TOP_LEVEL.has(entry.name)) continue;
    if (isRoot && SKIP_FILES.has(entry.name)) continue;
    const from = path.join(src, entry.name);
    const to = path.join(dst, entry.name);
    if (entry.isDirectory()) await copyStaticTree(from, to, false);
    else if (entry.isFile()) await fs.copyFile(from, to);
  }
}

async function walkHtml(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walkHtml(full));
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

await fs.rm(OUT, { recursive: true, force: true });
await copyStaticTree(ROOT, OUT, true);

const files = await walkHtml(OUT);
let changed = 0;
for (const file of files) {
  let html = await fs.readFile(file, "utf8");
  if (html.includes("analytics.ahrefs.com/analytics.js") || !html.includes("</head>")) continue;
  html = html.replace("</head>", `  ${SNIPPET}\n</head>`);
  await fs.writeFile(file, html);
  changed += 1;
}

console.log(`Built static output and injected Ahrefs analytics into ${changed} HTML file(s).`);
