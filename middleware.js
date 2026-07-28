export const config = {
  matcher: ['/pricing'],
};

export default function middleware(request) {
  const target = new URL('/api/pricing', request.url);
  return fetch(target, {
    headers: {
      'x-ralf-pricing-renderer': '1',
    },
  });
}
