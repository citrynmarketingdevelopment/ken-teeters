import type { Metadata } from 'next';
import '@/styles/fonts.css';
import '@/styles/home.css';
import '@/styles/global.css';
import 'react-photo-album/masonry.css';
import 'yet-another-react-lightbox/styles.css';
import '@/styles/galleries.css';
import '@/styles/foundation.css';
import '@/styles/work.css';
import { SiteNav } from '@/components/SiteNav';
import { FoundationFooter } from '@/components/FoundationFooter';
import '@/styles/footer.css';
import '@/styles/buttons.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://kennethteetersfoundation.org'),
  icons: {
    icon: '/assets/images/cropped-Kenneth-Teeters-foundation-icon-32x32.png',
    apple: '/assets/images/cropped-Kenneth-Teeters-foundation-icon-180x180.png',
  },
};
export default function RootLayout({ children }: Readonly<{children:React.ReactNode}>) {
  return <html lang="en-US"><head>
    <link rel="preload" as="font" href="/assets/fonts/92zPtBhPNqw79Ij1E865zBUv7myjJTVPNI0.ttf" type="font/ttf" crossOrigin="anonymous" />
    <link rel="preload" as="font" href="/assets/fonts/92zPtBhPNqw79Ij1E865zBUv7myRJTVPNI0.ttf" type="font/ttf" crossOrigin="anonymous" />
  </head><body><SiteNav />{children}<FoundationFooter /></body></html>;
}
