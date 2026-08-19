const BASE_UA='Ralf-Staging-V2-Stable';
export default async function handler(req,res){
  try{
    const ua=String(req.headers['user-agent']||'');
    if(ua.includes(BASE_UA)){
      const r=await fetch('https://raw.githubusercontent.com/benshevlane/ralf-seo/master/index.html',{headers:{'user-agent':'Ralf production base renderer'},cache:'no-store'});
      if(!r.ok)throw new Error(`base ${r.status}`);
      res.setHeader('content-type','text/html; charset=utf-8');
      res.setHeader('cache-control','no-store');
      return res.status(200).send(await r.text());
    }
    const host=req.headers.host,proto=(req.headers['x-forwarded-proto']||'https').toString().split(',')[0].trim();
    const r=await fetch(`${proto}://${host}/api/hero-v2-base`,{headers:{'user-agent':'Ralf-Homepage/4.0'},cache:'no-store'});
    if(!r.ok)throw new Error(`hero ${r.status}`);
    let h=await r.text();
    h=h.replace(/<[^>]*>STAGING · HERO V2 · GREEN ACCENTS<\/[^>]+>/g,'').replace(/STAGING · HERO V2 · GREEN ACCENTS/g,'');
    // GA (2026-08-19): the hero keeps its website-entry box and posts straight into the
    // card-backed 14-day Starter trial. Works without JS (GET form) and with JS
    // (assets/staging-trial.js carries UTM params across). Keep in sync with
    // scripts/apply-approved-homepage.mjs.
    h=h.replace('<form class="r2x-start" id="r2xStart">','<form class="r2x-start" id="r2xStart" action="https://app.ralfhq.com/try" method="get">');
    h=h.replace('<input id="r2xUrl" type="url"','<input id="r2xUrl" name="url" type="url"');
    h=h.replace('<button type="submit"><span>Get Ralf working </span>→</button>','<button type="submit"><span>Start your free 14-day trial </span>→</button>');
    h=h.replace('<div class="r2x-note">Enter your website · Ralf finds the first opportunities for you</div>','<div class="r2x-note">Enter your website · $0 today · then $137/month · cancel any time in the 14 days</div>');
    res.setHeader('content-type','text/html; charset=utf-8');
    res.setHeader('cache-control','public, s-maxage=300, stale-while-revalidate=86400');
    res.status(200).send(h);
  }catch(e){console.error(e);res.status(500).send('Unable to render homepage.');}
}