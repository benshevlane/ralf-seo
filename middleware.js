export const config = {
  matcher: ['/(pricing|done-for-you)'],
};

export default function middleware(request) {
  const renderer = request.url.includes('/done-for-you') ? '/api/done-for-you' : '/api/pricing';
  const target = new URL(renderer, request.url);
  return fetch(target, {
    headers: {
      'x-ralf-marketing-renderer': '1',
    },
  });
}
