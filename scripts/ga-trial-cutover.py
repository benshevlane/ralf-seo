#!/usr/bin/env python3
"""One-shot GA cutover: retire the private-beta CTAs and point every primary CTA
at the card-backed 14-day Starter trial (app.ralfhq.com/try).

Decisions (Ben, 2026-08-19):
  button  -> "Start your free 14-day trial"
  note    -> "$0 today · then $137/month · cancel any time in the 14 days"
  hero    -> restore the website-entry box, posting to /try?url=
  beta    -> retired from the public site (/beta stays reachable by direct link)
"""
import re, glob, sys

TRY = "https://app.ralfhq.com/try"
BTN = "Start your free 14-day trial"
NOTE_MID = "$0 today &middot; then $137/month &middot; cancel any time in the 14 days"
NOTE_DOT = "$0 today · then $137/month · cancel any time in the 14 days"
HIDDEN_OPEN = '<div style="display:none !important" data-trial-cta="private-beta">'
HIDDEN_CMT = '<!-- trial-cta hidden for private beta: restore at GA -->'

def strip_hidden_blocks(s):
    """Remove every hidden trial block (balanced on nested <div>s)."""
    out, i = [], 0
    while True:
        j = s.find(HIDDEN_OPEN, i)
        if j < 0:
            out.append(s[i:]); break
        out.append(s[i:j])
        k = j + len(HIDDEN_OPEN); depth = 1
        while depth:
            o = s.find('<div', k); c = s.find('</div>', k)
            if c < 0: raise SystemExit('unbalanced hidden block')
            if o != -1 and o < c: depth += 1; k = o + 4
            else: depth -= 1; k = c + 6
        i = k
    s = ''.join(out)
    return s.replace(HIDDEN_CMT, '')

def cutover(s, fname):
    n0 = s.count('Apply for the private beta')
    s = strip_hidden_blocks(s)
    # Primary buttons: <a class="btn…" href="/beta">Apply for the private beta <span class="arr">→</span></a>
    ARR = ' <span class="arr">&#8594;</span>'
    def _btn(m):
        return m.group(1) + 'href="' + TRY + '"' + m.group(2) + BTN + (m.group(3) or ARR) + '</a>'
    s = re.sub(r'(<a\b[^>]*?)href="/beta"([^>]*>)Apply for the private beta(\s*<span class="arr">(?:→|&#8594;)</span>)?\s*(&#8594;)?\s*</a>', _btn, s)
    # Pricing plan-card buttons (JS-driven) and the waitlist submit
    s = s.replace('Apply for the private beta &#8594;</button>', f'{BTN} &#8594;</button>')
    # "or apply for the private beta →" secondary links under plan cards
    s = re.sub(r'<a href="/beta"[^>]*>or apply for the private beta &#8594;</a>', '', s)
    # Notes under CTAs
    s = s.replace('Ralf is in private beta &middot; 20 places &middot; personal onboarding', NOTE_MID)
    s = s.replace('<span style="font-family:var(--display);font-weight:600">Private beta &#183; 20 places</span>',
                  '<span style="font-family:var(--display);font-weight:600">14-day free trial</span>')
    s = s.replace('Ralf is in private beta &mdash; 20 places, month 1 free. Apply and we&rsquo;ll onboard you personally.',
                  'Start with a 14-day free trial of the full Starter Suite &mdash; $0 today, then $137/month unless you cancel first.')
    s = s.replace('Ralf is in private beta — 20 places, month 1 free. Apply and we’ll onboard you personally.',
                  'Start with a 14-day free trial of the full Starter Suite — $0 today, then $137/month unless you cancel first.')
    s = s.replace('<p>Ralf is in private beta &mdash; 20 places, with personal onboarding.</p>',
                  f'<p>{NOTE_MID}</p>')
    s = s.replace('<b style="color:var(--ink)">Like every Ralf product and tier, Outreach is in private beta</b> &mdash; apply and we&rsquo;ll onboard you personally.',
                  '<b style="color:var(--ink)">Outreach at Starter is included in the 14-day free trial.</b>')
    s = s.replace('Don&#8217;t need all three? Pick the products you want &mdash; apply for the beta and tell us which.',
                  'Don&#8217;t need all three? Start the trial, then pick the products and tier you want in Billing.')
    # FAQ: the trial is the full Starter Suite, card-backed
    old_faq_html = re.compile(r'Yes — 14 days, no card required\..*?your full tier limits begin when you subscribe\. Start with a 14-day free trial of the full Starter Suite — \$0 today, then \$137/month unless you cancel first\.', re.S)
    new_faq_html = ('Yes — 14 days free, and it&rsquo;s the full Starter Suite: Search, Content and Outreach at Starter. '
                    'Add a card to start; you&rsquo;re charged $0 today and $137/month from day 15 unless you cancel first. '
                    'You can pick a different tier before renewal in Billing.')
    s = old_faq_html.sub(lambda m: new_faq_html, s)
    old_faq_json = re.compile(r'Yes \\u2014 14 days, no card required\..*?your full tier limits begin when you subscribe\. Start with a 14-day free trial of the full Starter Suite â€” \$0 today, then \$137/month unless you cancel first\.', re.S)
    new_faq_json = ('Yes \\u2014 14 days free, and it\\u2019s the full Starter Suite: Search, Content and Outreach at Starter. '
                    'Add a card to start; you\\u2019re charged $0 today and $137/month from day 15 unless you cancel first. '
                    'You can pick a different tier before renewal in Billing.')
    s = old_faq_json.sub(lambda m: new_faq_json, s)
    # Meta descriptions / compare-page claims
    s = s.replace('14-day free trial, no card.', '14-day free trial — $0 today, then from $49/mo.')
    s = s.replace('<h3>Honest, sustainable pricing</h3><p>No card for the trial, no hidden', '<h3>Honest, sustainable pricing</h3><p>A free 14-day trial, no hidden')
    s = s.replace('with a 14-day free trial and no card.', 'with a 14-day free trial.')
    s = s.replace('first AI visibility report in minutes — no card required.', 'first AI visibility report in minutes — free for 14 days.')
    # Pricing page plan buttons: JS redirect → /try (keep UTM carry-over)
    s = s.replace("window.location.href = '/beta' + (qs.toString() ? '?' + qs.toString() : '') + '#apply';",
                  f"window.location.href = '{TRY}' + (qs.toString() ? '?' + qs.toString() : '');")
    s = s.replace("They now send people to /beta.", "They now send people straight into the 14-day trial at app.ralfhq.com/try.")
    return s, n0

files = sorted(set(glob.glob('*.html') + glob.glob('blog/*.html')) - {'beta.html', 'beta-staging.html', 'beta-staging-v2.html', 'free-aeo-report.html', 'done-for-you.html', 'done-for-you-contact.html'})
for f in files:
    s = open(f, encoding='utf-8').read()
    if 'data-trial-cta' not in s and 'private beta' not in s and 'no card' not in s.lower(): continue
    new, n0 = cutover(s, f)
    if new != s:
        open(f, 'w', encoding='utf-8').write(new)
        left = new.count('Apply for the private beta') + new.count('data-trial-cta') + len(re.findall(r'[Nn]o card', new))
        print(f'{f:34} beta CTAs replaced={n0:2}  remaining beta/no-card refs={left}')
