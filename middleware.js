export const config={matcher:['/','/(pricing|done-for-you)']};
export default async function middleware(request){
  const p=new URL(request.url).pathname;
  const renderer=p==='/'?'/api/hero-v2-base':p.includes('/done-for-you')?'/api/done-for-you':'/api/pricing';
  const r=await fetch(new URL(renderer,request.url));
  let html=await r.text();
  if(p==='/'){
    // GA (2026-08-19): the hero keeps its website-entry box and posts straight into the
    // card-backed 14-day Starter trial. Works without JS (GET form) and with JS
    // (assets/staging-trial.js carries UTM params across). Keep in sync with
    // scripts/apply-approved-homepage.mjs.
    html=html.replace('<form class="r2x-start" id="r2xStart">','<form class="r2x-start" id="r2xStart" action="https://app.ralfhq.com/try" method="get">');
    html=html.replace('<input id="r2xUrl" type="url"','<input id="r2xUrl" name="url" type="url"');
    html=html.replace('<button type="submit"><span>Get Ralf working </span>→</button>','<button type="submit"><span>Start your free 14-day trial </span>→</button>');
    html=html.replace('<div class="r2x-note">Enter your website · Ralf finds the first opportunities for you</div>','<div class="r2x-note">Enter your website · $0 today · then $137/month · cancel any time in the 14 days</div>');

  }
  return new Response(html,{status:r.status,headers:{'content-type':'text/html; charset=utf-8','cache-control':'public, s-maxage=300, stale-while-revalidate=86400'}});
}
