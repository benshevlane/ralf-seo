# /beta A/B — Round 2: hero message (STAGED, not live)

Status: **staged, ready to flip on when Round 1 concludes.** Do NOT run this at the
same time as Round 1 (form length) — two variables changing at once can't be read.

## Why
Round 1 tests form length. Round 2 tests the **hero message**. The Reddit *text* ad that
earns our cheapest clicks leads with a competitor-jealousy hook ("I asked ChatGPT to
recommend a floor planner. It named my competitors."). The landing page currently leads
with a capability statement. Hypothesis: leading the page with the same hook that wins the
click will convert more of those clicks.

## The one variable (hero only — everything else identical)

**Control (A) — current, unchanged:**
- H1: `Ralf does the SEO work. You just approve it.`
- Sub: `Ralf finds the sites AI engines cite and the sites linking to your competitors but not you — then writes the pitch, sends it from your own mailbox, and chases the reply. Discovery, drafting, sending and follow-up, at a volume no team does by hand.`

**Variant (B) — competitor hook:**
- H1: `ChatGPT recommends your competitors. Not you.`
- Sub: `Ralf asks the AI engines the questions your buyers actually type, sees who gets named instead of you, then earns the links and citations that change the answer — written, sent and chased from your own mailbox. You approve; Ralf does the work.`

(Alt H1 options for later: `AI engines are naming your competitors — not you.` / `Your buyers ask AI. It's naming everyone but you.`)

## How to activate (when Round 1 is done)
1. **Close Round 1 first.** Pick the winning form (A full or B short), make it the *only*
   form on the page, delete the losing form + the form-split branch in the `<script>`.
2. **Start Round 2 clean.** Use a NEW storage key — `ralf_beta_hero` (not the old
   `ralf_beta_variant`) — so returning visitors aren't stuck in their Round-1 bucket. Keep
   sending `variant` in the form payload and keep the GA events.
3. **Swap the hero by variant.** Give the H1 and sub ids and let the script rewrite them
   for variant 'b':

```html
<h1 id="beta-h1">Ralf does the SEO work. You just approve it.</h1>
<p class="sub" id="beta-sub">Ralf finds the sites AI engines cite and the sites linking to your competitors but not you &mdash; then writes the pitch, sends it from your own mailbox, and chases the reply. Discovery, drafting, sending and follow-up, at a volume no team does by hand.</p>
```

```js
// after variant is assigned from localStorage['ralf_beta_hero']
if (variant === 'b') {
  var h1 = document.getElementById('beta-h1');
  var sub = document.getElementById('beta-sub');
  if (h1) h1.textContent = 'ChatGPT recommends your competitors. Not you.';
  if (sub) sub.textContent = "Ralf asks the AI engines the questions your buyers actually type, sees who gets named instead of you, then earns the links and citations that change the answer — written, sent and chased from your own mailbox. You approve; Ralf does the work.";
}
```
Default HTML stays the control, so JS-off visitors always see A.

## How we'll read it
Same as Round 1: ~50/50 split ⇒ compare raw application COUNTS per variant; GA4
`beta_variant_view` gives the visit denominator. Don't call a winner under ~12–15 combined
apps. The daily briefing already reports A vs B by the `variant` column.

## Backend
No backend change needed — `waitlist-submit` already accepts and stores `variant`, and the
`variant` column already exists. Round 2 reuses all of it.
