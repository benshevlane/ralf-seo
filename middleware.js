export const config={matcher:['/','/(pricing|done-for-you)']};
export default async function middleware(request){
  const p=new URL(request.url).pathname;
  const renderer=p==='/'?'/api/staging-v2-direct':p.includes('/done-for-you')?'/api/done-for-you':'/api/pricing';
  const r=await fetch(new URL(renderer,request.url));
  let html=await r.text();
  if(p==='/'){
    html=html.replace('<form class="r2x-start" id="r2xStart"><input id="r2xUrl" type="url" inputmode="url" autocomplete="url" placeholder="https://yourwebsite.com" aria-label="Your website URL" required><button type="submit"><span>Get Ralf working </span>→</button></form><div class="r2x-note">Enter your website · Ralf finds the first opportunities for you</div>','<a class="btn lg" href="/beta">Apply for the private beta →</a>');
  }
  return new Response(html,{status:r.status,headers:{'content-type':'text/html; charset=utf-8','cache-control':'public, s-maxage=300, stale-while-revalidate=86400'}});
}
