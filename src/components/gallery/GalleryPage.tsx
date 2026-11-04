import Link from 'next/link';
import { ArrowLeftIcon, ArrowUpRightIcon } from '@phosphor-icons/react/ssr';
import { latestAlbums, type GalleryAlbum } from '@/data/galleries';
import { pages, type PageKey } from '@/lib/content';
import { GalleryGrid } from './GalleryGrid';

export function GalleryPage({ album }: { album: GalleryAlbum }) {
  const page = pages[`${album.year}-gallery` as PageKey];
  return (
    <div className="event-gallery">
      <a className="skip-link" href="#main-content">Skip to photos</a>
      <main id="main-content" className="gallery-shell gallery-main" tabIndex={-1}>
        <Link className="gallery-home" href="/events/"><ArrowLeftIcon size={18} /> All events</Link>
        <div className="gallery-intro">
          <p className="gallery-intro__context">Our annual fundraiser</p>
          <h1>{album.title}</h1>
          <p className="gallery-intro__count">{album.photos.length} photographs from our community</p>
        </div>
        <nav className="gallery-years" aria-label="Fundraiser year">
          {latestAlbums.map((item) => (
            <Link key={item.year} href={item.path} aria-current={item.year === album.year ? 'page' : undefined}>
              {item.year}<span className="gallery-years__count">{item.photos.length} photos</span>
            </Link>
          ))}
        </nav>
        <GalleryGrid album={album} />
        <div className="gallery-end">
          <p>Thank you for supporting our local veterans.</p>
          <Link href="/events/">All events <ArrowUpRightIcon size={18} /></Link>
        </div>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(page.schema).replace(/</g, '\\u003c') }} />
    </div>
  );
}
