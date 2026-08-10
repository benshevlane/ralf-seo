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
    var shortCopy='Ralf finds where AI recommends your competitors instead of you — then fixes your site, writes the content and runs the outreach to get you cited.';

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

    var style=document.createElement('style');
    style.setAttribute('data-ralf-v2-mobile-presentation','');
    style.textContent=`
      .r2x-mobile-break{display:none}
      @media(max-width:900px){
        .r2x-mobile-break{display:block!important}
        .r2x-copy h1{max-width:none!important;width:100%!important;text-align:center!important;font-size:clamp(43px,11.2vw,58px)!important;line-height:.98!important;letter-spacing:-.045em!important}
        .r2x-copy h1 .r2x-rotator{min-width:0!important}
        .r2x-copy p{width:100%!important;max-width:620px!important;height:auto!important;min-height:0!important;overflow:visible!important;font-size:14.5px!important;line-height:1.4!important;color:var(--mut)!important;margin:12px auto 0!important;padding:0 10px!important;text-align:center!important}
        .r2x-copy p::after{content:none!important;display:none!important}
        .r2x-shell{row-gap:10px!important}
        .r2x-demo{margin-top:3px!important}

        /* Mobile animation is a presentation mode, not a scaled desktop dashboard. */
        .r2x-card{height:390px!important}
        .r2x-screen{height:386px!important}
        .r2x-screen-head{height:42px!important;padding:0 14px!important;font-size:9.5px!important}
        .r2x-screen:after{top:42px!important}
        .r2x-scene{height:344px!important;padding:20px 18px 46px!important}
        .r2x-scene>h3{font-size:21px!important;line-height:1.04!important;margin:0 0 10px!important;letter-spacing:-.025em!important}
        .r2x-scene>p{display:none!important}
        .r2x-panel,.r2x-ai-source,.r2x-approval,.r2x-content-editor{margin-top:13px!important}

        /* 1 — prompts: only the prompts + engine chips matter. */
        .r2x-panel .r2x-prompt{font-size:11px!important;padding:10px 11px!important}
        .r2x-engines{margin-top:10px!important;gap:5px!important}
        .r2x-engine{font-size:7.8px!important;padding:4px 7px!important}

        /* 2 — opportunity: make the source card the hero; remove duplicate connective UI. */
        .r2x-ai-source .r2x-airow,.r2x-ai-source .r2x-down,.r2x-ai-source .r2x-conclusion{display:none!important}
        .r2x-ai-source .r2x-source{margin-top:8px!important;padding:18px 14px!important;border-width:2px!important;border-radius:14px!important}
        .r2x-source>strong{font-size:13px!important}
        .r2x-source-signals{margin-top:12px!important;gap:7px!important;display:grid!important;grid-template-columns:1fr!important}
        .r2x-source-signals span{font-size:9px!important;padding:9px 10px!important}

        /* 3 — outreach: enlarge the email and drop decorative filler. */
        .r2x-mail{font-size:10.5px!important;line-height:1.42!important;padding:16px!important;border-radius:14px!important}
        .r2x-mail .r2x-mail-lines{display:none!important}
        .r2x-mail .r2x-row{font-size:9px!important;margin-top:13px!important}

        /* 4 — content: article itself is the product proof. */
        .r2x-content-editor{min-height:205px!important;padding:16px!important;border-radius:14px!important}
        .r2x-editor-title{font-size:17px!important}
        .r2x-editor-h2{font-size:11px!important;margin-top:12px!important}
        .r2x-editor-copy{font-size:9.5px!important;line-height:1.45!important;margin-top:6px!important}
        .r2x-editor-lines{display:none!important}
        .r2x-checks{margin-top:14px!important;gap:5px!important}
        .r2x-checks span{font-size:7.5px!important;padding:5px 7px!important}

        /* 5 — structure: large sequential fixes + result. */
        .r2x-fix-sequence{margin-top:12px!important}
        .r2x-fix-sequence .r2x-approval-row{padding:10px 0!important;grid-template-columns:96px 1fr auto!important;gap:8px!important;font-size:9px!important}
        .r2x-fix-sequence .r2x-approval-row>strong{font-size:10px!important}
        .r2x-fix-sequence .r2x-badge{font-size:8px!important;padding:5px 7px!important}
        .r2x-health{margin-top:10px!important;padding:10px 11px!important;font-size:7.5px!important}
        .r2x-health b{font-size:22px!important}

        /* 6 — result: traffic/result should dominate the final frame. */
        .r2x-result{padding:18px!important;border-radius:14px!important}
        .r2x-result strong,.r2x-result b{font-size:20px!important}

        .r2x-controls{bottom:-9px!important;transform:translateX(-50%) scale(1.06)!important}
      }
      @media(max-width:520px){
        .r2x-copy h1{font-size:clamp(42px,11.6vw,54px)!important}
        .r2x-copy p{font-size:14px!important;line-height:1.38!important;padding:0 6px!important}
        .r2x-card{height:398px!important}.r2x-screen{height:394px!important}.r2x-scene{height:352px!important}
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
