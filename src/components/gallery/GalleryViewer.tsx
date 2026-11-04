'use client';

import Image from 'next/image';
import { createPortal } from 'react-dom';
import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type RefObject } from 'react';
import Lightbox, { type ControllerRef, type Plugin, type ZoomRef } from 'yet-another-react-lightbox';
import Inline from 'yet-another-react-lightbox/plugins/inline';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import { ArrowClockwiseIcon, ArrowLeftIcon, ArrowRightIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon, XIcon } from '@phosphor-icons/react';
import type { GalleryAlbum } from '@/data/galleries';

const mobileQuery = '(max-width: 767px)';
const motionQuery = '(prefers-reduced-motion: reduce)';
function subscribeMedia(callback: () => void) {
  const mobile = window.matchMedia(mobileQuery), motion = window.matchMedia(motionQuery);
  mobile.addEventListener('change', callback); motion.addEventListener('change', callback);
  return () => { mobile.removeEventListener('change', callback); motion.removeEventListener('change', callback); };
}

interface ViewerProps {
  album: GalleryAlbum;
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  trigger: RefObject<HTMLAnchorElement | null>;
}

export default function GalleryViewer({ album, index, onIndexChange, onClose, trigger }: ViewerProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const controller = useRef<ControllerRef>(null);
  const zoom = useRef<ZoomRef>(null);
  const thumbnailRail = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closing = useRef(false);
  const drag = useRef({ start: 0, delta: 0 });
  const [zoomSlot, setZoomSlot] = useState<HTMLDivElement | null>(null);
  const [attempt, setAttempt] = useState(0);
  const titleId = useId();
  const mobile = useSyncExternalStore(subscribeMedia, () => window.matchMedia(mobileQuery).matches, () => false);
  const reducedMotion = useSyncExternalStore(subscribeMedia, () => window.matchMedia(motionQuery).matches, () => false);
  const slides = useMemo(() => album.photos.map(({ src, width, height, alt }) => ({ src, width, height, alt })), [album]);

  const requestClose = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    if (panel.current) { panel.current.style.animation = ''; panel.current.style.transition = ''; }
    dialog.current?.classList.add('is-closing');
    closeTimer.current = setTimeout(onClose, window.matchMedia(motionQuery).matches ? 0 : 180);
  }, [onClose]);

  const modalBridge = useMemo<Plugin>(() => ({ augment }) => {
    augment((props) => ({ ...props,
      close: () => { if ((zoom.current?.zoom ?? 1) <= 1.01) requestClose(); },
      controller: { ...props.controller, aria: false, focus: false, closeOnEscape: false },
    }));
  }, [requestClose]);
  const plugins = useMemo(() => [Inline, Zoom, modalBridge], [modalBridge]);

  useEffect(() => {
    const rail = thumbnailRail.current;
    const selected = rail?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (rail && selected) rail.scrollTo({ left: selected.offsetLeft - (rail.clientWidth - selected.clientWidth) / 2, behavior: reducedMotion ? 'instant' : 'smooth' });
  }, [index, mobile, reducedMotion]);

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    const photoTrigger = trigger.current ?? Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-photo-id]'))
      .find((anchor) => anchor.dataset.photoId === album.photos[index].id && anchor.getClientRects().length > 0);
    const scrollX = window.scrollX, scrollY = window.scrollY;
    const oldOverflow = document.body.style.overflow;
    const oldPadding = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbar}px`;
    document.body.style.overflow = 'hidden';
    node.showModal(); closeButton.current?.focus({ preventScroll: true });
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      node.close();
      document.body.style.overflow = oldOverflow;
      document.body.style.paddingRight = oldPadding;
      const focusTarget = photoTrigger?.isConnected ? photoTrigger : document.querySelector<HTMLElement>('.gallery-years a[aria-current]');
      focusTarget?.focus({ preventScroll: true });
      window.scrollTo({ left: scrollX, top: scrollY, behavior: 'instant' });
    };
    // A dialog session stays mounted through photo changes, rotation, and resizing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <dialog ref={dialog} className="gallery-viewer" aria-labelledby={titleId}
      onCancel={(event) => { event.preventDefault(); requestClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) requestClose(); }}
      onKeyDownCapture={(event) => {
        if (event.key === 'Tab') {
          const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], [tabindex]'))
            .filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0 && !element.closest('[aria-hidden="true"]'));
          const first = controls[0], last = controls[controls.length - 1];
          if ((event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
            event.preventDefault(); (event.shiftKey ? last : first)?.focus();
          }
          return;
        }
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        const imageFocused = (event.target as Element).closest('.yarl__container');
        if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && (zoom.current?.zoom ?? 1) <= 1.01) {
          event.preventDefault(); event.stopPropagation();
          if (event.key === 'ArrowLeft') controller.current?.prev(); else controller.current?.next();
        } else if (!imageFocused && ['+', '=', '-'].includes(event.key)) {
          event.preventDefault(); event.stopPropagation();
          if (event.key === '-') zoom.current?.zoomOut(); else zoom.current?.zoomIn();
        }
      }}>
      <div ref={panel} className="gallery-viewer__panel">
        <button type="button" className="gallery-viewer__handle" aria-label="Drag down or tap to close gallery"
          onPointerDown={(event) => {
            drag.current = { start: event.clientY, delta: 0 };
            if (panel.current) { panel.current.style.animation = 'none'; panel.current.style.transition = 'none'; }
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (!event.currentTarget.hasPointerCapture(event.pointerId) || !panel.current) return;
            drag.current.delta = Math.max(0, event.clientY - drag.current.start);
            if (drag.current.delta > 8) { panel.current.style.animation = 'none'; panel.current.style.transform = `translateY(${drag.current.delta}px)`; }
          }}
          onPointerUp={() => {
            if (drag.current.delta > 90) requestClose();
            else if (panel.current) { panel.current.style.transition = ''; panel.current.style.transform = ''; }
          }}
          onPointerCancel={() => { if (panel.current) { panel.current.style.transition = ''; panel.current.style.transform = ''; } }}
          onClick={() => { if (drag.current.delta < 8) requestClose(); }}><span /></button>
        <header className="gallery-viewer__header">
          <div><h2 id={titleId}>{album.year} Sporting Clay Shoot</h2><p>Fundraiser gallery</p></div>
          <div className="gallery-viewer__tools">
            <div ref={setZoomSlot} />
            <button ref={closeButton} type="button" className="gallery-viewer__button" onClick={requestClose} aria-label="Close gallery"><XIcon size={22} /><span>Close</span></button>
          </div>
        </header>
        <div className="gallery-viewer__stage">
          <Lightbox key={attempt} index={index} slides={slides} plugins={plugins} close={requestClose}
            inline={{ style: { width: '100%', height: '100%' } }}
            carousel={{ preload: 1, padding: mobile ? 12 : 24, spacing: '12%', imageFit: 'contain' }}
            controller={{ ref: controller, closeOnPullDown: mobile, closeOnPullUp: false }}
            zoom={{ ref: zoom, maxZoomPixelRatio: 1, scrollToZoom: false }}
            animation={{ fade: reducedMotion ? 0 : 240, swipe: reducedMotion ? 0 : 240, navigation: reducedMotion ? 0 : 180, zoom: reducedMotion ? 0 : 240 }}
            toolbar={{ buttons: [] }}
            on={{ view: ({ index: nextIndex }) => onIndexChange(nextIndex) }}
            render={{
              buttonPrev: () => null, buttonNext: () => null,
              buttonZoom: ({ disabled, zoom: level, zoomIn, zoomOut }) => zoomSlot ? createPortal(
                <button type="button" className="gallery-viewer__button" disabled={disabled}
                  aria-label={level > 1 ? 'Zoom out' : 'Zoom in'} onClick={() => level > 1 ? zoomOut() : zoomIn()}>
                  {level > 1 ? <MagnifyingGlassMinusIcon size={22} /> : <MagnifyingGlassPlusIcon size={22} />}<span>Zoom</span>
                </button>, zoomSlot) : null,
              iconLoading: () => <span className="gallery-viewer__loading" role="status">Loading photograph…</span>,
              iconError: () => <div className="gallery-viewer__error" role="status"><p>This photograph could not be loaded.</p>
                <button type="button" onClick={() => setAttempt((n) => n + 1)}><ArrowClockwiseIcon size={18} /> Try again</button>
                <a href={album.photos[index].src} target="_blank" rel="noopener noreferrer">Open original image</a></div>,
            }} />
        </div>
        {!mobile ? <nav ref={thumbnailRail} className="gallery-viewer__thumbnails" aria-label="Photo thumbnails">
          {album.photos.map((photo, photoIndex) => <button key={photo.id} type="button" aria-label={`Go to photograph ${photoIndex + 1} of ${album.photos.length}`}
            aria-pressed={index === photoIndex} onClick={() => onIndexChange(photoIndex)}>
            <Image src={photo.src} alt="" fill sizes="80px" style={{ objectFit: 'cover', objectPosition: photo.focalPosition }} />
          </button>)}
        </nav> : null}
        <footer className="gallery-viewer__footer">
          <button type="button" className="gallery-viewer__button" onClick={() => controller.current?.prev()} aria-label="Previous photograph"><ArrowLeftIcon size={20} /><span>Previous</span></button>
          <p aria-live="polite" aria-atomic="true">{index + 1} <span>of {album.photos.length}</span></p>
          <button type="button" className="gallery-viewer__button" onClick={() => controller.current?.next()} aria-label="Next photograph"><span>Next</span><ArrowRightIcon size={20} /></button>
        </footer>
      </div>
    </dialog>
  );
}
