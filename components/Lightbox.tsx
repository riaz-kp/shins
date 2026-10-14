'use client';

import { useEffect, useRef, type RefObject } from 'react';
import type { artworks } from '@/lib/content';
import { useReducedMotion } from '@/lib/motion';

type Artwork = (typeof artworks)[number];

type Props = {
  items: Artwork[];
  index: number | null;
  /** The thumbnail to zoom out of when opening; cleared after use. */
  originRef: RefObject<HTMLImageElement | null>;
  onIndex: (i: number) => void;
  onClose: () => void;
};

const pad = (n: number) => String(n).padStart(2, '0');

export function Lightbox({ items, index, originRef, onIndex, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const swipeX = useRef<number | null>(null);
  const reduce = useReducedMotion();
  const item = index === null ? null : items[index];

  // Open/close the native dialog with the index.
  useEffect(() => {
    const dialog = dialogRef.current!;
    if (index !== null && !dialog.open) dialog.showModal();
    if (index === null && dialog.open) dialog.close();
    document.documentElement.classList.toggle('lb-open', index !== null);
  }, [index]);

  // Each new image: wait for it to decode, then zoom out of the thumbnail (first open) or fade.
  useEffect(() => {
    const img = imgRef.current;
    if (!img || !item) return;
    let cancelled = false;
    img.style.opacity = '0';
    img.decode().catch(() => {}).then(() => {
      if (cancelled) return;
      img.style.opacity = '';
      const origin = originRef.current;
      originRef.current = null;
      if (reduce) return;
      if (origin) {
        const a = origin.getBoundingClientRect();
        const b = img.getBoundingClientRect();
        img.animate([
          { transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width}, ${a.height / b.height})` },
          { transform: 'none' },
        ], { duration: 750, easing: 'cubic-bezier(.16,1,.3,1)' });
      } else {
        img.animate([{ opacity: 0, transform: 'scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'ease-out' });
      }
    });
    return () => { cancelled = true; };
  }, [item, originRef, reduce]);

  const step = (d: number) => { if (index !== null) onIndex((index + d + items.length) % items.length); };

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label="Artwork viewer"
      onClose={onClose}
      onClick={e => {
        const t = e.target as HTMLElement;
        if (t === dialogRef.current || t.classList.contains('lb-figure')) onClose();
      }}
      onKeyDown={e => {
        if (e.key === 'ArrowRight') step(1);
        if (e.key === 'ArrowLeft') step(-1);
      }}
      onPointerDown={e => { swipeX.current = e.pointerType === 'mouse' ? null : e.clientX; }}
      onPointerUp={e => {
        if (swipeX.current === null) return;
        const dx = e.clientX - swipeX.current;
        if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
        swipeX.current = null;
      }}
    >
      <button type="button" className="lb-close" aria-label="Close viewer" onClick={onClose}>Close ✕</button>
      <button type="button" className="lb-nav lb-prev" aria-label="Previous artwork" onClick={() => step(-1)}>←</button>
      <figure className="lb-figure">
        {/* Full-resolution original rather than an optimised thumbnail size. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {item && <img ref={imgRef} className="lb-img" src={item.src} alt={item.alt} />}
        {item && <figcaption className="lb-cap"><b>{item.title}</b><span>{item.meta}</span></figcaption>}
      </figure>
      <button type="button" className="lb-nav lb-next" aria-label="Next artwork" onClick={() => step(1)}>→</button>
      <p className="lb-count" aria-live="polite">{index !== null && `${pad(index + 1)} / ${pad(items.length)}`}</p>
    </dialog>
  );
}
