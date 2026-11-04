import { latestAlbums } from '@/data/galleries';
import { getImageProps } from 'next/image';

const escape = (value: string) => value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);

/** Trusted local catalog to static HTML, keeping the rest of the migrated homepage intact. */
export function eventPreviewsMarkup() {
  return `<section class="home-event-previews" aria-labelledby="past-events-title"><div class="home-event-previews__inner"><h2 id="past-events-title">Our Past Events&nbsp; &amp; Fundraiser</h2><div class="home-event-previews__albums">${latestAlbums.map((album) => {
    const cover = album.photos.find((photo) => photo.id === album.coverId)!;
    const { props: image } = getImageProps({ src: cover.src, alt: cover.alt, width: cover.width, height: cover.height, sizes: '(max-width: 767px) 90vw, 30vw' });
    return `<a class="home-album" href="${album.path}" aria-label="View ${album.year} Sporting Clay Shoot Fundraiser gallery"><span class="home-album__image"><img src="${escape(image.src)}" srcset="${escape(image.srcSet ?? '')}" sizes="${escape(image.sizes ?? '')}" alt="${escape(cover.alt)}" width="${cover.width}" height="${cover.height}" loading="lazy" decoding="async" style="object-position:${escape(cover.focalPosition)}" /></span><span class="home-album__caption"><span class="home-album__year">${album.year}</span><span class="home-album__details">Sporting Clay Shoot Fundraiser<span>${album.photos.length} photographs</span></span><span class="home-album__action">View gallery</span></span></a>`;
  }).join('')}</div></div></section>`;
}
