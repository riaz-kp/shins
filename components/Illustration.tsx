'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { artFilters, artworks, type ArtCategory } from '@/lib/content';
import { Lightbox } from './Lightbox';

type Filter = 'all' | ArtCategory;

export function Illustration() {
  const [filter, setFilter] = useState<Filter>('all');
  const [lbIndex, setLbIndex] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const originRef = useRef<HTMLImageElement | null>(null);
  const firstRun = useRef(true);

  const visible = artworks.filter(a => filter === 'all' || a.cat === filter);

  // Pieces ink in on first view via RevealObserver; replay that, staggered, on each filter change.
  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    const shown = itemRefs.current.filter((el): el is HTMLElement => !!el && !el.hidden);
    shown.forEach((el, k) => {
      el.classList.remove('is-in');
      el.style.setProperty('--d', `${k * 70}ms`);
    });
    void document.body.offsetWidth;
    shown.forEach(el => el.classList.add('is-in'));
  }, [filter]);

  return (
    <section className="illus" id="illustration" aria-labelledby="illus-title">
      <header className="section-head section-head--split">
        <div>
          <p className="label" data-reveal>(03) Illustration</p>
          <h2 id="illus-title" className="h2" data-reveal>Ink, charcoal, <em>pastel</em> &amp; pixels</h2>
        </div>
        <div className="filters" role="group" aria-label="Filter artwork" data-reveal>
          {artFilters.map(f => (
            <button
              key={f.id} type="button" aria-pressed={filter === f.id}
              className={filter === f.id ? 'filter is-active' : 'filter'}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      <p className="note note--illus" data-reveal>
        blue — the colour of emotions
        <svg viewBox="0 0 70 60" aria-hidden="true"><path d="M8 4c-6 22 8 40 50 46m0 0-11-8m11 8-12 5" /></svg>
      </p>

      <div className="gallery">
        {artworks.map((a, i) => {
          const show = filter === 'all' || a.cat === filter;
          return (
            <figure key={a.src} ref={el => { itemRefs.current[i] = el; }} className="g-item" hidden={!show} data-reveal>
              <button
                type="button" className="g-open" data-cursor="View"
                onClick={e => {
                  originRef.current = e.currentTarget.querySelector('img');
                  setLbIndex(visible.indexOf(a));
                }}
              >
                <Image src={a.src} width={a.width} height={a.height} alt={a.alt} sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 31vw" />
              </button>
              <figcaption><b>{a.title}</b><span>{a.meta}</span></figcaption>
            </figure>
          );
        })}
      </div>

      <Lightbox
        items={visible}
        index={lbIndex}
        originRef={originRef}
        onIndex={setLbIndex}
        onClose={() => setLbIndex(null)}
      />
    </section>
  );
}
