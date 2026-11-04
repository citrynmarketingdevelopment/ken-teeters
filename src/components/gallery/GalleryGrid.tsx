'use client';

import dynamic from 'next/dynamic';
import { useCallback, useMemo, useRef, useSyncExternalStore } from 'react';
import { MasonryPhotoAlbum } from 'react-photo-album';
import SSR from 'react-photo-album/ssr';
import type { GalleryAlbum } from '@/data/galleries';
import { GalleryThumbnail } from './GalleryThumbnail';

const GalleryViewer = dynamic(() => import('./GalleryViewer'), {
  ssr: false,
  loading: () => <div className="gallery-opening" role="status">Opening photograph…</div>,
});

const CHANGE_EVENT = 'teeters-gallery-change';
function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback);
  window.addEventListener('hashchange', callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener('hashchange', callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}
const getHash = () => window.location.hash;
const serverHash = () => '';
function announceHistoryChange() { window.dispatchEvent(new Event(CHANGE_EVENT)); }
const viewportQueries = ['(min-width: 360px)', '(min-width: 768px)', '(min-width: 1200px)'];
function subscribeViewport(callback: () => void) {
  const queries = viewportQueries.map((query) => window.matchMedia(query));
  queries.forEach((query) => query.addEventListener('change', callback));
  return () => queries.forEach((query) => query.removeEventListener('change', callback));
}
const viewportColumns = () => 1 + viewportQueries.filter((query) => window.matchMedia(query).matches).length;

export function GalleryGrid({ album }: { album: GalleryAlbum }) {
  const hash = useSyncExternalStore(subscribe, getHash, serverHash);
  const columns = useSyncExternalStore(subscribeViewport, viewportColumns, () => 0);
  const layoutColumns = (width: number) => columns || (width < 328 ? 1 : width < 736 ? 2 : width < 1168 ? 3 : 4);
  const activeId = new URLSearchParams(hash.slice(1)).get('photo');
  const index = album.photos.findIndex((photo) => photo.id === activeId);
  const trigger = useRef<HTMLAnchorElement | null>(null);
  const albumPhotos = useMemo(() => album.photos.map((photo) => ({
    src: photo.src, width: Math.round(photo.thumbnailRatio * 1000), height: 1000,
    original: photo, key: photo.id,
  })), [album]);

  const changePhoto = useCallback((nextIndex: number) => {
    const photo = album.photos[nextIndex];
    if (!photo) return;
    const nextHash = `#photo=${photo.id}`;
    if (window.location.hash === nextHash) return;
    window.history.replaceState(window.history.state, '', nextHash);
    announceHistoryChange();
  }, [album]);

  const close = useCallback(() => {
    if (window.history.state?.teetersGallery === album.path) window.history.back();
    else {
      window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
      announceHistoryChange();
    }
  }, [album.path]);

  return (
    <>
      <div className="gallery-masonry" data-gallery-ready={columns > 0}>
      <SSR breakpoints={[328, 358, 736, 992, 1168, 1320]}>
        <MasonryPhotoAlbum photos={albumPhotos} padding={0}
          columns={layoutColumns}
          spacing={(width) => layoutColumns(width) < 3 ? 12 : layoutColumns(width) === 3 ? 16 : 20}
          render={{ photo: (_, { photo, index: photoIndex }) => (
            <a className="gallery-photo" href={`#photo=${photo.original.id}`} data-photo-id={photo.original.id}
              aria-label={`Open photograph ${photoIndex + 1} of ${album.photos.length}: ${photo.original.alt}`}
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                event.preventDefault(); trigger.current = event.currentTarget;
                window.history.pushState({ ...window.history.state, teetersGallery: album.path }, '', `#photo=${photo.original.id}`);
                announceHistoryChange();
              }}>
              <GalleryThumbnail photo={photo.original} eager={photoIndex < 2} />
            </a>
          ) }} />
      </SSR>
      </div>
      {index >= 0 ? <GalleryViewer album={album} index={index} onIndexChange={changePhoto} onClose={close} trigger={trigger} /> : null}
    </>
  );
}
