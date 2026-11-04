'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { GalleryPhoto } from '@/data/galleries';

export function GalleryThumbnail({ photo, eager }: { photo: GalleryPhoto; eager: boolean }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className="gallery-thumbnail" style={{ aspectRatio: photo.thumbnailRatio }}>
      {!failed ? (
        <Image src={photo.src} alt={photo.alt} fill loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : undefined}
          sizes="(min-width: 1352px) 315px, (min-width: 1200px) calc((100vw - 92px) / 4), (min-width: 768px) calc((100vw - 64px) / 3), (min-width: 360px) calc((100vw - 44px) / 2), calc(100vw - 32px)"
          style={{ objectFit: 'cover', objectPosition: photo.focalPosition }}
          onError={() => setFailed(true)} />
      ) : (
        <span className="gallery-thumbnail__error" role="status">
          <span>Preview unavailable</span>
          <span>Open photo to retry</span>
        </span>
      )}
    </span>
  );
}
