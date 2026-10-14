'use client';

import { useEffect, useRef, useState } from 'react';
import { clamp } from '@/lib/motion';

/**
 * Ink-arch preloader. Waits for the hero images and fonts (min ~1.4s), then wipes away
 * with a blue curtain and adds `.is-loaded` to <html>, which starts the hero animation.
 */
export function Loader() {
  const [phase, setPhase] = useState<'loading' | 'leaving' | 'done'>('loading');
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('.hero img'));
    let done = 0;
    let fontsDone = false;
    const cleanups: (() => void)[] = [];

    imgs.forEach(img => {
      if (img.complete) { done++; return; }
      const finish = () => { done++; };
      img.addEventListener('load', finish, { once: true });
      img.addEventListener('error', finish, { once: true });
      cleanups.push(() => { img.removeEventListener('load', finish); img.removeEventListener('error', finish); });
    });
    document.fonts.ready.then(() => { fontsDone = true; });

    const start = performance.now();
    const minDur = reduce ? 0 : 1400;
    const maxDur = 6000;
    let raf = 0;
    const timers: number[] = [];

    const step = (now: number) => {
      const elapsed = now - start;
      const timeP = minDur ? clamp(elapsed / minDur, 0, 1) : 1;
      const loadP = elapsed > maxDur ? 1 : (done + (fontsDone ? 1 : 0)) / (imgs.length + 1);
      // Time-based (not per-frame easing) so it still finishes promptly if frames are throttled.
      const shown = Math.min(1 - Math.pow(1 - timeP, 3), loadP);
      if (countRef.current) countRef.current.textContent = String(Math.round(shown * 100));
      if (shown < 1) { raf = requestAnimationFrame(step); return; }
      setPhase('leaving');
      timers.push(window.setTimeout(() => root.classList.add('is-loaded'), reduce ? 0 : 620));
      timers.push(window.setTimeout(() => setPhase('done'), reduce ? 50 : 1500));
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(t => window.clearTimeout(t));
      cleanups.forEach(fn => fn());
    };
  }, []);

  if (phase === 'done') return null;

  return (
    <div className={phase === 'leaving' ? 'loader is-leaving' : 'loader'} aria-hidden="true">
      <div className="loader-inner">
        <svg className="loader-arch" viewBox="0 0 120 170" fill="none">
          <path pathLength={1} d="M8 166V64a52 52 0 0 1 104 0v102" />
          <path pathLength={1} d="M28 166V70a32 32 0 0 1 64 0v96" />
          <path pathLength={1} d="M8 166h104" />
        </svg>
        <p className="loader-name">Shins Joy</p>
        <p className="loader-count"><span ref={countRef}>0</span></p>
      </div>
      <div className="loader-curtain"><span /><span /><span /></div>
    </div>
  );
}
