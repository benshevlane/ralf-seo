import { promises as fs } from 'node:fs';
import path from 'node:path';

const file = path.join(process.cwd(), 'public', 'index.html');
let html = await fs.readFile(file, 'utf8');
const style = '<style data-ralf-mobile-cta-spacing>@media(max-width:900px){.r2x-shell>.btn.lg,.r2x-beta-cta{margin-top:24px!important}}</style>';
if (!html.includes('data-ralf-mobile-cta-spacing')) {
  html = html.replace('</head>', style + '\n</head>');
  await fs.writeFile(file, html);
}
console.log('Mobile hero CTA spacing applied.');
