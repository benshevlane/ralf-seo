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
    h=h.replace(/<form class="r2x-start" id="r2xStart">[\s\S]*?<\/form>\s*<div class="r2x-note">[\s\S]*?<\/div>/,'<a class="btn lg r2x-beta-cta" href="/beta">Apply for the private beta <span class="arr">→</span></a>');
    h=h.replace('</head>','<style data-ralf-beta-cta>.r2x-beta-cta{grid-column:1;grid-row:2;justify-self:start;margin-top:4px;background:linear-gradient(135deg,#047857,#059669)!important;border-color:#047857!important;color:#fff!important}@media(max-width:900px){.r2x-beta-cta{grid-row:3;justify-self:center;margin-top:10px}}</style></head>');
    res.setHeader('content-type','text/html; charset=utf-8');
    res.setHeader('cache-control','public, s-maxage=300, stale-while-revalidate=86400');
    res.status(200).send(h);
  }catch(e){console.error(e);res.status(500).send('Unable to render homepage.');}
}
