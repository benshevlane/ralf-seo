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
    if(!copy) return;
    var full=copy.textContent;
    var shortCopy='Ralf finds where AI recommends your competitors instead of you — then fixes your site, writes the content and runs the outreach to get you cited.';
    var style=document.createElement('style');
    style.setAttribute('data-ralf-v2-mobile-copy-fix','');
    style.textContent='@media(max-width:900px){.r2x-copy p{width:100%!important;max-width:620px!important;height:auto!important;min-height:0!important;overflow:visible!important;font-size:14.5px!important;line-height:1.4!important;color:var(--mut)!important;margin:12px auto 0!important;padding:0 10px!important;text-align:center!important}.r2x-copy p::after{content:none!important;display:none!important}}@media(max-width:520px){.r2x-copy p{font-size:14px!important;line-height:1.38!important;padding:0 6px!important}}';
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
