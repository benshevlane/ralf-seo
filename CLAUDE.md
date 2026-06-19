# ralf-seo — marketing site (ralfhq.com)

Static HTML site deployed on Vercel (`cleanUrls: true`, so `/pricing` serves `pricing.html`). Each page has its **own inline `<nav>` header and `<footer>`** — there is no shared template, so the nav/footer must be kept **identical across every page** by hand.

## Navigation — read before editing any page

The header nav is, in order: **Product** (dropdown: Search / Outreach / Content) · **Pricing** · **Blog** · **FAQ**.

**The "Pricing" link MUST point to `/pricing`. NEVER `compare.html`.**

`compare.html` is the competitor comparison page. It is only ever the target of the **"vs. alternatives" / "Compare"** links — never of "Pricing". This link has regressed several times when a page was re-saved from an older copy during unrelated visual work; do not let it.

When you edit a page for *any* reason (animations, OG images, logo, copy), **do not regenerate the nav/footer from an old local copy** — pull the latest file and preserve every `href="/pricing"`.

A CI guard (`.github/workflows/link-guard.yml`) fails the build if any "Pricing" link points to `compare.html`. If it goes red, fix the file(s) it names.

## Pricing (keep in sync with the app + AGREED_PRICING)

Three products on a Search baseline:
- **Search** $49 / $149 / $299 / from $799
- **Content** $39 / $89 / $199 / $399
- **Outreach** $49 / $119 / $249 / $499
- **Suite** (all three, matched tier) = the **full combined price, no discount**: **$137 / $357 / $747 / from $1,697**. (The old 10% Suite discount was removed — do not reintroduce "10% off" or "vs $X apart" savings copy.)

CTAs: "Start free trial" → `https://app.ralfhq.com/login?mode=signup`; "Subscribe now / skip the trial" → `https://app.ralfhq.com/subscribe`.

## Brand

Tokens: `--ink:#121212` · `--paper:#fff` · greys. Fonts: Space Grotesk (display), Inter Tight (body), Space Mono (mono). Logo: `/assets/ralf-logo.svg` (nav), `/assets/ralf-logo-white.svg` (footer). Favicon: `/assets/favicon.svg` (already the current mark).
