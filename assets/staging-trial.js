/* Ralf staging — one acquisition funnel.
   - Generic marketing CTA -> app.ralfhq.com/try (website requested there)
   - Homepage website form -> app.ralfhq.com/try?url=... (website carried through)
   This file is injected only by the staging build. */
(function(){
  'use strict';

  var APP_TRY = 'https://app.ralfhq.com/try';

  function trialHref(){
    try {
      var dest = new URL(APP_TRY);
      var current = new URL(window.location.href);
      current.searchParams.forEach(function(value,key){
        if(/^utm_/i.test(key)) dest.searchParams.set(key,value);
      });
      return dest.toString();
    } catch (_e) {
      return APP_TRY;
    }
  }

  function isTrialTarget(a){
    if(!a || !a.getAttribute) return false;
    var raw = (a.getAttribute('href') || '').trim();
    if(!raw) return false;
    return /^\/beta(?:[?#]|$)/i.test(raw)
      || /^\/apply(?:[?#]|$)/i.test(raw)
      || /app\.ralfhq\.com\/login\?[^#]*mode=signup/i.test(raw);
  }

  function setStartTrialLabel(el){
    if(!el) return;
    var arrow = el.querySelector && el.querySelector('.arr');
    if(arrow){
      Array.prototype.slice.call(el.childNodes).forEach(function(n){
        if(n !== arrow && n.nodeType === 3) n.nodeValue = '';
      });
      el.insertBefore(document.createTextNode('Start free trial '), arrow);
    } else {
      el.textContent = 'Start free trial →';
    }
    el.setAttribute('aria-label','Start free trial');
  }

  function replaceVisibleBetaCopy(){
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode:function(node){
        var p=node.parentElement;
        if(!p || /^(SCRIPT|STYLE|NOSCRIPT|CODE|PRE)$/i.test(p.tagName)) return NodeFilter.FILTER_REJECT;
        return /beta|Apply for the private beta|apply for the private beta/i.test(node.nodeValue || '')
          ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function(node){
      var t=node.nodeValue || '';
      t=t.replace(/Like every Ralf product and tier, Outreach is in private beta\s*[—-]\s*apply and we(?:’|')ll onboard you personally\.?/gi,
        'Outreach is included in the 14-day free trial — no card required.');
      t=t.replace(/Ralf is in private beta\s*[—-]\s*20 places, month 1 free\.\s*Apply and we(?:’|')ll onboard you personally\.?/gi,
        'Start with a 14-day free trial. No card required.');
      t=t.replace(/Ralf is in private beta\s*[—-]\s*20 places, with personal onboarding\.?/gi,
        '14-day free trial. No card required.');
      t=t.replace(/Ralf is in private beta\s*[·•]\s*20 places\s*[·•]\s*personal onboarding/gi,
        '14-day free trial · no card required');
      t=t.replace(/Private beta\s*[·•]\s*20 places/gi,'14-day free trial');
      t=t.replace(/Apply for the private beta/gi,'Start free trial');
      t=t.replace(/apply for the private beta/gi,'start a free trial');
      node.nodeValue=t;
    });
  }

  function keepReviewerOnV2(){
    if(!/\.vercel\.app$/i.test(window.location.hostname)) return;
    document.querySelectorAll('a[href="/"],a[href="/#faq"]').forEach(function(a){
      var raw=a.getAttribute('href');
      a.setAttribute('href', raw === '/#faq' ? '/v2#faq' : '/v2');
    });
  }

  function wireTrialLinks(){
    var href=trialHref();
    document.querySelectorAll('a').forEach(function(a){
      if(!isTrialTarget(a)) return;
      a.setAttribute('href',href);
      setStartTrialLabel(a);
    });

    document.querySelectorAll('[data-waitlist-plan]').forEach(function(btn){
      setStartTrialLabel(btn);
      btn.addEventListener('click',function(e){
        e.preventDefault();
        e.stopPropagation();
        if(e.stopImmediatePropagation) e.stopImmediatePropagation();
        window.location.assign(trialHref());
      },true);
    });
  }

  function wireHomepageDomainForm(){
    var form=document.getElementById('r2xStart');
    var input=document.getElementById('r2xUrl');
    if(!form || !input) return;
    form.addEventListener('submit',function(e){
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation) e.stopImmediatePropagation();
      var value=(input.value || '').trim();
      if(!value) return;
      var dest=new URL(APP_TRY);
      dest.searchParams.set('url',value);
      try {
        var current=new URL(window.location.href);
        current.searchParams.forEach(function(v,k){ if(/^utm_/i.test(k)) dest.searchParams.set(k,v); });
      } catch (_e) {}
      var button=form.querySelector('button');
      if(button) button.textContent='Starting Ralf…';
      window.location.assign(dest.toString());
    },true);
  }

  function fixV2MobileHero(){
    var copy=document.querySelector('.r2x-copy p');
    var title=document.querySelector('.r2x-copy h1');
    if(!copy || !title) return;

    var full=copy.textContent;
    var shortCopy='Ralf finds where AI recommends competitors instead of you — then fixes your site, writes the content and runs the outreach to win those mentions.';

    /* Keep the live rotator node intact, but force a deliberate two-line mobile headline:
       Get your business / found by [AI engine]. */
    if(!title.querySelector('.r2x-mobile-break')){
      Array.prototype.slice.call(title.childNodes).some(function(node){
        if(node.nodeType!==3) return false;
        var text=node.nodeValue || '';
        var marker=' found by ';
        var at=text.indexOf(marker);
        if(at<0) return false;
        var before=document.createTextNode(text.slice(0,at));
        var br=document.createElement('br');
        br.className='r2x-mobile-break';
        br.setAttribute('aria-hidden','true');
        var after=document.createTextNode('found by ' + text.slice(at+marker.length));
        title.insertBefore(before,node);
        title.insertBefore(br,node);
        title.insertBefore(after,node);
        title.removeChild(node);
        return true;
      });
    }

    /* Hide the tiny helper sentence below the URL form on mobile; the field is self-explanatory. */
    Array.prototype.slice.call(document.querySelectorAll('body *')).forEach(function(el){
      if(el.children.length) return;
      var t=(el.textContent||'').trim();
      if(t==='Enter your website · Ralf finds the first opportunities for you') el.classList.add('r2x-mobile-hide-note');
    });

    var style=document.createElement('style');
    style.setAttribute('data-ralf-v2-mobile-presentation','');
    style.textContent=`
      .r2x-mobile-break{display:none}
      @media(max-width:900px){
        .r2x-mobile-break{display:block!important}
        .r2x-copy h1{max-width:none!important;width:100%!important;text-align:center!important;font-size:clamp(35px,8.7vw,44px)!important;line-height:1.02!important;letter-spacing:-.04em!important;white-space:nowrap!important}
        .r2x-copy h1 .r2x-rotator{min-width:0!important}
        .r2x-copy p{width:100%!important;max-width:590px!important;height:auto!important;min-height:0!important;overflow:visible!important;font-size:14px!important;line-height:1.36!important;color:var(--mut)!important;margin:9px auto 0!important;padding:0 8px!important;text-align:center!important}
        .r2x-copy p::after{content:none!important;display:none!important}
        .r2x-shell{row-gap:6px!important}
        .r2x-demo{margin-top:0!important}

        /* Mobile stage bar: one concise label; no duplicate right-hand status. */
        .r2x-screen-head #r2xHead{font-size:0!important;white-space:nowrap!important}
        .r2x-screen-head #r2xHead::before{font-size:9px!important;line-height:1!important;margin-right:0!important;color:var(--r2x-dark)!important;font-weight:700!important}
        .r2x-screen-head #r2xHs{display:none!important}
        .r2x-demo:has(.r2x-dots [data-stage="0"].active) #r2xHead::before{content:'01 · Prompt research'!important}
        .r2x-demo:has(.r2x-dots [data-stage="1"].active) #r2xHead::before{content:'02 · Citation opportunity'!important}
        .r2x-demo:has(.r2x-dots [data-stage="2"].active) #r2xHead::before{content:'03 · Personalised outreach'!important}
        .r2x-demo:has(.r2x-dots [data-stage="3"].active) #r2xHead::before{content:'04 · Content creation'!important}
        .r2x-demo:has(.r2x-dots [data-stage="4"].active) #r2xHead::before{content:'05 · Site improvements'!important}
        .r2x-demo:has(.r2x-dots [data-stage="5"].active) #r2xHead::before{content:'06 · Traffic result'!important}

        /* Shorter, denser demo: focused product proof rather than a tall desktop canvas. */
        .r2x-card{height:326px!important}
        .r2x-screen{height:322px!important}
        .r2x-screen-head{height:38px!important;padding:0 14px!important}
        .r2x-screen:after{top:38px!important}
        .r2x-scene{height:284px!important;padding:16px 18px 38px!important}
        .r2x-scene>h3{font-size:20px!important;line-height:1.04!important;margin:0 0 8px!important;letter-spacing:-.025em!important}
        .r2x-scene>p{display:none!important}
        .r2x-panel,.r2x-ai-source,.r2x-approval,.r2x-content-editor{margin-top:10px!important}

        /* 1 — prompts: only prompts + engine chips. */
        .r2x-panel .r2x-prompt{font-size:10px!important;padding:8px 10px!important}
        .r2x-engines{margin-top:8px!important;gap:4px!important}
        .r2x-engine{font-size:7px!important;padding:3px 6px!important}

        /* 2 — opportunity: source + two unmistakable proof badges are the whole story. */
        .r2x-ai-source .r2x-airow,.r2x-ai-source .r2x-down,.r2x-ai-source .r2x-conclusion{display:none!important}
        .r2x-ai-source .r2x-source{margin-top:6px!important;padding:14px 12px!important;border-width:2px!important;border-radius:13px!important;min-height:144px!important}
        .r2x-source>strong{font-size:12px!important;line-height:1.2!important}
        .r2x-source-signals{margin-top:12px!important;gap:7px!important;display:grid!important;grid-template-columns:1fr!important}
        .r2x-source-signals span{font-size:9px!important;padding:9px 10px!important;opacity:1!important;transform:none!important;animation:none!important}

        /* 3 — outreach: one readable personalised email, no decorative filler. */
        .r2x-mail{font-size:10px!important;line-height:1.38!important;padding:13px!important;border-radius:13px!important}
        .r2x-mail .r2x-mail-lines{display:none!important}
        .r2x-mail .r2x-row{font-size:8px!important;margin-top:10px!important}

        /* 4 — content: the article itself is the proof. */
        .r2x-content-editor{min-height:172px!important;padding:13px!important;border-radius:13px!important}
        .r2x-editor-title{font-size:15px!important}
        .r2x-editor-h2{font-size:10px!important;margin-top:9px!important}
        .r2x-editor-copy{font-size:8.8px!important;line-height:1.4!important;margin-top:5px!important}
        .r2x-editor-lines{display:none!important}
        .r2x-checks{margin-top:10px!important;gap:4px!important}
        .r2x-checks span{font-size:7px!important;padding:4px 6px!important}

        /* 5 — structure: three fixes land, then the health improvement. */
        .r2x-fix-sequence{margin-top:9px!important}
        .r2x-fix-sequence .r2x-approval-row{padding:7px 0!important;grid-template-columns:84px 1fr auto!important;gap:6px!important;font-size:8px!important}
        .r2x-fix-sequence .r2x-approval-row>strong{font-size:9px!important}
        .r2x-fix-sequence .r2x-badge{font-size:7px!important;padding:4px 6px!important}
        .r2x-health{margin-top:7px!important;padding:8px 9px!important;font-size:7px!important}
        .r2x-health b{font-size:19px!important}

        /* 6 — traffic is the visual payoff. */
        .r2x-result{padding:14px!important;border-radius:13px!important}
        .r2x-result strong,.r2x-result b{font-size:19px!important}

        /* Bring controls and acquisition CTA together into one compact unit. */
        .r2x-controls{bottom:-8px!important;transform:translateX(-50%) scale(1.04)!important}
        #r2xStart{margin-top:19px!important;margin-bottom:0!important}
        #r2xStart input,#r2xStart button{min-height:48px!important;height:48px!important}
        .r2x-mobile-hide-note{display:none!important}
      }
      @media(max-width:520px){
        .r2x-copy h1{font-size:clamp(34px,8.5vw,38px)!important;letter-spacing:-.035em!important}
        .r2x-copy p{font-size:13.5px!important;line-height:1.34!important;padding:0 4px!important}
        .r2x-card{height:320px!important}.r2x-screen{height:316px!important}.r2x-scene{height:278px!important}
        #r2xStart{margin-top:18px!important}
      }
    `;
    document.head.appendChild(style);

    function sync(){ copy.textContent=window.innerWidth<=900?shortCopy:full; }
    sync();
    var timer;
    window.addEventListener('resize',function(){clearTimeout(timer);timer=setTimeout(sync,120);},{passive:true});
  }

  function init(){
    replaceVisibleBetaCopy();
    wireTrialLinks();
    wireHomepageDomainForm();
    keepReviewerOnV2();
    fixV2MobileHero();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
