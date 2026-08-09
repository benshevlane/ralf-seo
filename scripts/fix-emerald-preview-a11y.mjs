import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const file = path.join(process.cwd(), 'index.html');
let html = await readFile(file, 'utf8');
let changed = false;

function replaceOnce(before, after) {
  if (!html.includes(before)) return;
  html = html.replace(before, after);
  changed = true;
}

replaceOnce(
  'id="rhLoop" tabindex="0" aria-roledescription="carousel"',
  'id="rhLoop" tabindex="0" role="region" aria-roledescription="carousel"'
);
replaceOnce(
  '<div class="rh-stage" aria-live="polite">',
  '<div class="rh-stage" aria-live="off">'
);
replaceOnce(
  "  var email=root.querySelector('[data-rh-email]');\n  var reduce=",
  "  var email=root.querySelector('[data-rh-email]');\n  var stage=root.querySelector('.rh-stage');\n  var reduce="
);
replaceOnce(
  "    toggle.setAttribute('aria-label',userPaused?'Play animation':'Pause animation');\n  }",
  "    toggle.setAttribute('aria-label',userPaused?'Play animation':'Pause animation');\n    if(stage)stage.setAttribute('aria-live',userPaused?'polite':'off');\n  }"
);
replaceOnce(
  "d.setAttribute('aria-current',ix===current?'step':'false');",
  "if(ix===current)d.setAttribute('aria-current','step');else d.removeAttribute('aria-current');"
);
replaceOnce(
  "  toggle.addEventListener('click',function(){userPaused=!userPaused;refresh();});",
  "  toggle.addEventListener('click',function(){userPaused=!userPaused;if(!userPaused){hoverPaused=false;focusPaused=false;}refresh();});"
);
replaceOnce(
  '  setToggle();show(0);',
  '  if(reduce)toggle.hidden=true;\n  setToggle();show(0);'
);

if (changed) {
  await writeFile(file, html, 'utf8');
  console.log('Emerald preview accessibility refinements applied.');
} else {
  console.log('Emerald preview accessibility refinements already present.');
}
