import type { NextConfig } from 'next';
const config: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  async redirects() {
    return [
      { source: '/sitemap_index.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/page-sitemap.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/wp-sitemap.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/wp-content/uploads/2026/03/aplication.pdf', destination: '/assets/documents/aplication.pdf', permanent: true },
    ];
  },
  async headers() {
    return [{ source: '/:path*', headers: [
      {key:'X-Content-Type-Options', value:'nosniff'},
      {key:'Referrer-Policy', value:'strict-origin-when-cross-origin'},
    ] }];
  },
};
export default config;
