import type { Metadata } from 'next';
import '@/styles/fonts.css';
import '@/styles/home.css';
import '@/styles/2024-gallery.css';
import '@/styles/2025-gallery.css';
import '@/styles/2026-gallery.css';
import '@/styles/global.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://kennethteetersfoundation.org'),
  icons: {
    icon: '/assets/images/cropped-Kenneth-Teeters-foundation-icon-32x32.png',
    apple: '/assets/images/cropped-Kenneth-Teeters-foundation-icon-180x180.png',
  },
};
export default function RootLayout({ children }: Readonly<{children:React.ReactNode}>) {
  return <html lang="en-US"><body>{children}</body></html>;
}
