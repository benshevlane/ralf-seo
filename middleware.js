export const config={matcher:['/(pricing|done-for-you)']};
export default async function middleware(request){
  const p=new URL(request.url).pathname;
  const renderer=p.includes('/done-for-you')?'/api/done-for-you':'/api/pricing';
  const r=await fetch(new URL(renderer,request.url));
  return new Response(await r.text(),{status:r.status,headers:{'content-type':'text/html; charset=utf-8','cache-control':'public, s-maxage=300, stale-while-revalidate=86400'}});
}
