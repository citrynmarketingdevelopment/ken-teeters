// Local QA only. Never imported by the application or exposed in deployment.
import http from 'node:http';
const original = '/assets/images/fundraiser_2024_07.webp';
let originalFailed = false;
const proxy = http.createServer((request, response) => {
  const url = new URL(request.url, 'http://127.0.0.1:3003');
  if (url.pathname === '/__qa/reset') {
    originalFailed = false;
    response.end('reset'); return;
  }
  const blockedPreview = url.pathname.startsWith('/_next/image') && url.searchParams.get('url') === original;
  const failOriginalOnce = url.pathname === original && !originalFailed;
  if (blockedPreview || failOriginalOnce) {
    if (failOriginalOnce) originalFailed = true;
    response.writeHead(503, { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' });
    response.end('Simulated image failure for local QA'); return;
  }
  const upstream = http.request({ hostname: '127.0.0.1', port: 3002, path: request.url, method: request.method, headers: { ...request.headers, host: '127.0.0.1:3002' } }, (result) => {
    response.writeHead(result.statusCode ?? 502, result.headers); result.pipe(response);
  });
  upstream.on('error', () => { response.writeHead(502); response.end('QA upstream unavailable'); });
  request.pipe(upstream);
});
proxy.listen(3003, '127.0.0.1', () => console.log('Image-failure QA proxy: http://127.0.0.1:3003'));
