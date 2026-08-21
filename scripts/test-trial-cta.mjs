import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const trialScript = await readFile(new URL('../assets/staging-trial.js', import.meta.url), 'utf8');
const heroSource = await readFile(new URL('../api/staging-v2-direct.js', import.meta.url), 'utf8');

const normalizeStart = trialScript.indexOf('function normalizeSite');
const normalizeEnd = trialScript.indexOf('function wireTrial');
assert.ok(normalizeStart >= 0 && normalizeEnd > normalizeStart, 'normalizeSite must exist before wireTrial');

const context = vm.createContext({ URL });
vm.runInContext(trialScript.slice(normalizeStart, normalizeEnd), context);
const normalizeSite = vm.runInContext('normalizeSite', context);

assert.equal(normalizeSite('example.com'), 'https://example.com/');
assert.equal(normalizeSite('www.example.com/path'), 'https://www.example.com/path');
assert.equal(normalizeSite('https://example.com/path?source=hero'), 'https://example.com/path?source=hero');
assert.equal(normalizeSite('  example.com  '), 'https://example.com/');
assert.equal(normalizeSite('not a website'), '');
assert.equal(normalizeSite('ftp://example.com'), '');
assert.equal(normalizeSite(''), '');

assert.match(heroSource, /id="r2xUrl" type="text" inputmode="url"/);
assert.match(heroSource, /placeholder="yourwebsite\.com"/);
assert.doesNotMatch(heroSource, /id="r2xUrl" type="url"/);
assert.match(heroSource, /\.r2x-start button\{cursor:pointer;/);
assert.match(trialScript, /Enter a valid website, such as yourwebsite\.com\./);

for (const relativePath of [
  '../api/home.js',
  '../middleware.js',
  './apply-approved-homepage.mjs',
]) {
  const renderer = await readFile(new URL(relativePath, import.meta.url), 'utf8');
  assert.match(renderer, /name="url" type="text"/);
  assert.doesNotMatch(renderer, /name="url" type="url"/);
}

console.log('Trial CTA accepts bare domains and rejects invalid website values.');
