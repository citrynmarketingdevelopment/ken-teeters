import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRightIcon } from '@phosphor-icons/react/ssr';
import { latestAlbums } from '@/data/galleries';
export const metadata = { title: 'Events & Galleries | Kenneth Teeters Foundation', description: 'Explore photographs from our Sporting Clay Shoot fundraisers and the community supporting local veterans.' };
export default function EventsPage() {
  const latest = latestAlbums[0];
  const cover = latest.photos.find(p => p.id === latest.coverId)!;
  return <div className="foundation-page"><main id="main-content" className="foundation-shell">
    <section className="foundation-hero events-hero"><div><p className="foundation-kicker">EVENTS</p><h1>A community<br />that shows up.</h1><p>Revisit the people and moments behind our annual Sporting Clay Shoot fundraisers.</p><a href="#event-galleries" className="foundation-button">View Galleries <ArrowUpRightIcon size={19} /></a></div><figure className="hero-photo"><Image src={cover.src} alt={cover.alt} width={cover.width} height={cover.height} sizes="(max-width: 767px) 100vw, 50vw" preload style={{ objectPosition: cover.focalPosition }} /></figure></section>
    <section id="event-galleries" className="foundation-section"><h2>Through the years.</h2><div className="event-albums">{latestAlbums.map(album => { const photo = album.photos.find(p => p.id === album.coverId)!; return <Link className="event-album" href={album.path} key={album.year}><div className="event-album-image"><Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width: 767px) 100vw, 50vw" style={{ objectPosition: photo.focalPosition }} /></div><div className="event-album-caption"><div><h3>{album.year} Sporting Clay Shoot</h3><p>{album.photos.length} photographs</p></div><ArrowUpRightIcon size={28} /></div></Link>; })}</div></section>
    <section className="foundation-section event-contact"><h2>Join us next time.</h2><p>Contact the foundation for upcoming event dates, sponsorship opportunities, and ways to participate.</p><Link className="foundation-text-link" href="/get-involved/#contact">Contact Us <ArrowUpRightIcon size={18} /></Link></section>
  </main></div>;
}
