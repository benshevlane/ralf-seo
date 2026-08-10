import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SNIPPET = '<script src="https://analytics.ahrefs.com/analytics.js" data-key="0MSfXWjdIGz4tyCIfpb0sQ" async></script>';
const SKIP_DIRS = new Set([".git", ".vercel", "node_modules"]);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

const files = await walk(ROOT);
let changed = 0;
for (const file of files) {
  let html = await fs.readFile(file, "utf8");
  if (html.includes("analytics.ahrefs.com/analytics.js") || !html.includes("</head>")) continue;
  html = html.replace("</head>", `  ${SNIPPET}\n</head>`);
  await fs.writeFile(file, html);
  changed += 1;
}

console.log(`Ahrefs analytics injected into ${changed} HTML file(s).`);
