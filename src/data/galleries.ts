import catalog from './galleries.json';

export interface GalleryPhoto {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  thumbnailRatio: number;
  focalPosition: string;
}

export interface GalleryAlbum {
  year: number;
  path: string;
  title: string;
  coverId: string;
  photos: GalleryPhoto[];
}

export const galleryAlbums: GalleryAlbum[] = catalog;
export const latestAlbums = [...galleryAlbums].sort((a, b) => b.year - a.year);
export function getAlbum(slug: string) {
  return galleryAlbums.find((album) => album.path === `/${slug}/`);
}
