export const config={matcher:['/','/(pricing|done-for-you)']};
function clean(html){return html.replace(/<meta name="robots" content="noindex[^>]*>/gi,'').replace(/STAGING · HERO V2 · GREEN ACCENTS/g,'').replace(/Start free trial/g,'Apply for the private beta').replace(/https:\/\/app\.ralfhq\.com\/try/g,'/beta');}
export default async function middleware(request){
  const p=new URL(request.url).pathname;
  const renderer=p==='/'?'/api/home':p.includes('/done-for-you')?'/api/done-for-you':'/api/pricing';
  const r=await fetch(new URL(renderer,request.url),{headers:{'x-ralf-marketing-renderer':'1','user-agent':'Ralf-Production-Marketing/2.0'}});
  let html=clean(await r.text());
  const headers=new Headers();headers.set('content-type','text/html; charset=utf-8');headers.set('cache-control','public, s-maxage=300, stale-while-revalidate=86400');
  return new Response(html,{status:r.status,headers});
}
