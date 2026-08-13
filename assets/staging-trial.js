/* Ralf staging — reviewed hero behaviour + private beta acquisition flow. */
(function(){
  'use strict';

  function keepReviewerOnV2(){
    if(!/\.vercel\.app$/i.test(window.location.hostname)) return;
    document.querySelectorAll('a[href="/"],a[href="/#faq"]').forEach(function(a){
      a.setAttribute('href',a.getAttribute('href')==='/#faq'?'/v2#faq':'/v2');
    });
  }

  function wireBetaDomainForm(){
    var form=document.getElementById('r2xStart'),input=document.getElementById('r2xUrl');
    if(!form||!input)return;
    form.addEventListener('submit',function(e){
      e.preventDefault();e.stopPropagation();
      if(e.stopImmediatePropagation)e.stopImmediatePropagation();
      var value=(input.value||'').trim();if(!value){input.focus();return;}
      var dest=new URL('/beta',window.location.origin);dest.searchParams.set('url',value);
      try{var current=new URL(window.location.href);current.searchParams.forEach(function(v,k){if(/^utm_/i.test(k))dest.searchParams.set(k,v);});}catch(_e){}
      window.location.assign(dest.pathname+dest.search);
    },true);
  }

  function syncSlidePresentation(){
    var demo=document.querySelector('.r2x-demo');if(!demo)return;
    var titles=[
      'Ralf runs the questions your customers are asking AI.',
      'Finds pages recommending your competitors that AI search is citing.',
      'Reaches out to get you included.',
      'Writes the content your site is missing.',
      'Fixes your site so AI can understand and cite it.',
      'More people find your website.'
    ];
    var heads=['01 · Prompt research','02 · Citation opportunity','03 · Personalised outreach','04 · Content creation','05 · Site improvements','06 · Traffic result'];
    function apply(){
      var active=demo.querySelector('.r2x-dots [data-stage].active'),h3=demo.querySelector('.r2x-scene>h3'),head=document.getElementById('r2xHead');
      if(!active)return;var idx=parseInt(active.getAttribute('data-stage'),10);if(isNaN(idx)||!titles[idx])return;
      if(h3&&h3.textContent!==titles[idx])h3.textContent=titles[idx];
      if(head&&head.textContent!==heads[idx])head.textContent=heads[idx];
    }
    apply();
    new MutationObserver(apply).observe(demo,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  }

  function fixMobileHero(){
    var copy=document.querySelector('.r2x-copy p'),title=document.querySelector('.r2x-copy h1'),form=document.getElementById('r2xStart'),input=document.getElementById('r2xUrl');
    if(!copy||!title)return;
    var full=copy.textContent;
    var shortCopy='Ralf finds where AI recommends competitors instead of you — then fixes your site, writes the content and runs the outreach to win those mentions.';

    if(!title.querySelector('.r2x-mobile-break')){
      Array.prototype.slice.call(title.childNodes).some(function(node){
        if(node.nodeType!==3)return false;var text=node.nodeValue||'',marker=' found by ',at=text.indexOf(marker);if(at<0)return false;
        var before=document.createTextNode(text.slice(0,at)),br=document.createElement('br'),after=document.createTextNode('found by '+text.slice(at+marker.length));
        br.className='r2x-mobile-break';br.setAttribute('aria-hidden','true');title.insertBefore(before,node);title.insertBefore(br,node);title.insertBefore(after,node);title.removeChild(node);return true;
      });
    }

    if(form&&input&&!form.querySelector('.r2x-mobile-field-label')){
      var label=document.createElement('label');label.className='r2x-mobile-field-label';label.setAttribute('for','r2xUrl');
      label.innerHTML='<strong>See what Ralf can do for your website</strong><span>Enter your website to apply for the private beta with your site pre-filled.</span>';
      form.insertBefore(label,input);input.setAttribute('placeholder','yourwebsite.com');
    }
    if(form&&!form.querySelector('.r2x-mobile-submit')){
      var mobileButton=document.createElement('button');mobileButton.type='submit';mobileButton.className='r2x-mobile-submit';mobileButton.textContent='Apply for the private beta →';
      form.appendChild(mobileButton);var existing=form.querySelector('button:not(.r2x-mobile-submit)');if(existing)existing.classList.add('r2x-desktop-submit');
    }

    var style=document.createElement('style');style.setAttribute('data-ralf-v2-mobile-presentation','');style.textContent=`
      .r2x-mobile-break,.r2x-mobile-submit,.r2x-mobile-field-label{display:none}
      @media(max-width:900px){
        .r2x-mobile-break{display:block!important}
        .r2x-copy h1{max-width:none!important;width:100%!important;text-align:center!important;font-size:clamp(35px,8.7vw,44px)!important;line-height:1.02!important;letter-spacing:-.04em!important;white-space:nowrap!important}
        .r2x-copy p{width:100%!important;max-width:590px!important;font-size:14px!important;line-height:1.36!important;margin:9px auto 0!important;padding:0 8px!important;text-align:center!important}
        .r2x-shell{row-gap:6px!important}.r2x-demo{margin-top:0!important;position:relative!important}
        .r2x-screen-head #r2xHead{font-size:9px!important;font-weight:700!important;color:var(--r2x-dark)!important}.r2x-screen-head #r2xHeadState{display:none!important}
        .r2x-card{height:326px!important}.r2x-screen{height:322px!important}.r2x-screen-head{height:38px!important;padding:0 14px!important}.r2x-scene{height:284px!important;padding:16px 18px 64px!important}
        .r2x-scene>h3{font-size:20px!important;line-height:1.04!important;margin:0 0 8px!important;letter-spacing:-.025em!important}.r2x-scene>p{display:none!important}
        .r2x-panel,.r2x-ai-source,.r2x-approval,.r2x-content-editor{margin-top:10px!important}.r2x-panel .r2x-prompt{font-size:10px!important;padding:8px 10px!important}.r2x-engines{margin-top:8px!important;gap:4px!important}.r2x-engine{font-size:7px!important;padding:3px 6px!important}
        .r2x-ai-source .r2x-airow,.r2x-ai-source .r2x-down,.r2x-ai-source .r2x-conclusion{display:none!important}.r2x-ai-source .r2x-source{margin-top:6px!important;padding:14px 12px!important;border-width:2px!important;border-radius:13px!important;min-height:144px!important}.r2x-source>strong{font-size:12px!important}.r2x-source-signals{margin-top:12px!important;gap:7px!important;display:grid!important;grid-template-columns:1fr!important}.r2x-source-signals span{font-size:9px!important;padding:9px 10px!important;opacity:1!important;transform:none!important;animation:none!important}
        .r2x-mail{font-size:10px!important;line-height:1.38!important;padding:13px!important}.r2x-mail .r2x-mail-lines{display:none!important}.r2x-content-editor{min-height:172px!important;padding:13px!important;border-radius:13px!important}.r2x-editor-title{font-size:15px!important}.r2x-editor-h2{font-size:10px!important;margin-top:9px!important}.r2x-editor-copy{font-size:8.8px!important;line-height:1.4!important;margin-top:5px!important}.r2x-editor-lines{display:none!important}.r2x-checks{margin-top:10px!important;gap:4px!important}.r2x-checks span{font-size:7px!important;padding:4px 6px!important}
        .r2x-fix-sequence{margin-top:9px!important}.r2x-fix-sequence .r2x-approval-row{padding:7px 0!important;grid-template-columns:84px 1fr auto!important;gap:6px!important;font-size:8px!important}.r2x-fix-sequence .r2x-badge{font-size:7px!important;padding:4px 6px!important}.r2x-health{margin-top:7px!important;padding:8px 9px!important;font-size:7px!important}.r2x-health b{font-size:19px!important}
        .r2x-controls{bottom:40px!important;z-index:8!important;transform:translateX(-50%) scale(.98)!important;box-shadow:0 8px 22px -16px rgba(0,0,0,.35)!important}
        #r2xStart{display:grid!important;grid-template-columns:1fr!important;gap:9px!important;margin-top:5px!important;width:100%!important;padding:14px!important;border:1.5px solid rgba(5,150,105,.32)!important;border-radius:22px!important;background:linear-gradient(180deg,#fff,#f5fbf8)!important;box-shadow:0 16px 38px -30px rgba(4,120,87,.65)!important}
        #r2xStart .r2x-mobile-field-label{display:block!important;text-align:left!important;margin:0 2px 3px!important}.r2x-mobile-field-label strong{display:block!important;color:#111!important;font:700 16px/1.2 var(--display)!important}.r2x-mobile-field-label span{display:block!important;margin-top:4px!important;color:#737373!important;font:400 11.5px/1.35 var(--display)!important}
        #r2xStart input{width:100%!important;height:56px!important;padding:0 18px!important;border:2px solid rgba(5,150,105,.5)!important;border-radius:15px!important;background:#fff!important;color:#111!important;font-size:16px!important;box-shadow:0 0 0 4px rgba(5,150,105,.055)!important}
        #r2xStart .r2x-desktop-submit{display:none!important}#r2xStart .r2x-mobile-submit{display:flex!important;width:100%!important;height:50px!important;border:0!important;border-radius:15px!important;align-items:center!important;justify-content:center!important;background:linear-gradient(135deg,#047857,#059669)!important;color:#fff!important;font:600 15px/1 var(--display)!important}
        .r2x-note{display:none!important}
      }
      @media(max-width:520px){.r2x-copy h1{font-size:clamp(34px,8.5vw,38px)!important}.r2x-card{height:320px!important}.r2x-screen{height:316px!important}.r2x-scene{height:278px!important;padding-bottom:62px!important}}
    `;document.head.appendChild(style);
    function syncCopy(){copy.textContent=window.innerWidth<=900?shortCopy:full;}syncCopy();var timer;window.addEventListener('resize',function(){clearTimeout(timer);timer=setTimeout(syncCopy,120);},{passive:true});
  }

  function init(){keepReviewerOnV2();wireBetaDomainForm();fixMobileHero();syncSlidePresentation();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
