'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { hero, site } from '@/lib/content';
import { lerp, useFinePointer, useFrame, useReducedMotion } from '@/lib/motion';
import { SplitText } from './SplitText';

/** Cycles through the role words, easing its width to fit each one. */
function Roller({ words }: { words: string[] }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const roller = ref.current!;
    const items = Array.from(roller.children) as HTMLElement[];
    let i = 0;
    const fit = () => { roller.style.width = `${items[i].offsetWidth}px`; };
    items[0].classList.add('is-active');
    fit();
    document.fonts.ready.then(fit);
    window.addEventListener('resize', fit);
    const timers: number[] = [];
    const interval = reduce ? 0 : window.setInterval(() => {
      const prev = items[i];
      prev.classList.remove('is-active');
      prev.classList.add('is-out');
      // Park the outgoing word below again without animating back through view.
      timers.push(window.setTimeout(() => {
        prev.classList.add('no-t');
        prev.classList.remove('is-out');
        void prev.offsetWidth;
        prev.classList.remove('no-t');
      }, 900));
      i = (i + 1) % items.length;
      items[i].classList.add('is-active');
      fit();
    }, 2600);
    return () => {
      window.clearInterval(interval);
      timers.forEach(t => window.clearTimeout(t));
      window.removeEventListener('resize', fit);
      items.forEach(el => el.classList.remove('is-active', 'is-out'));
    };
  }, [reduce]);

  return (
    <span ref={ref} className="roller" aria-hidden="true">
      {words.map(w => <span key={w}>{w}</span>)}
    </span>
  );
}

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const archRef = useRef<HTMLElement>(null);
  const inkRef = useRef<HTMLElement>(null);
  const paintRef = useRef<HTMLElement>(null);
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const fine = useFinePointer();
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = heroRef.current;
    if (!el || !fine || reduce) return;
    const m = mouse.current;
    const onMove = (e: PointerEvent) => { m.tx = e.clientX / window.innerWidth - 0.5; m.ty = e.clientY / window.innerHeight - 0.5; };
    const onLeave = () => { m.tx = 0; m.ty = 0; };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => { el.removeEventListener('pointermove', onMove); el.removeEventListener('pointerleave', onLeave); };
  }, [fine, reduce]);

  // Mouse parallax plus a gentle scroll drift, each figure at its own depth.
  useFrame(({ y, vh }) => {
    if (y > vh * 1.2) return;
    const m = mouse.current;
    m.x = lerp(m.x, m.tx, 0.06);
    m.y = lerp(m.y, m.ty, 0.06);
    [archRef, inkRef, paintRef].forEach(({ current: f }) => {
      if (!f) return;
      const d = Number(f.dataset.depth);
      f.style.translate = `${-m.x * d * 40}px ${-m.y * d * 30 - y * d * 0.18}px`;
    });
  }, !reduce);

  return (
    <section ref={heroRef} className="hero" id="top">
      <div className="hero-grid" aria-hidden="true" />
      <svg className="hero-blueprint" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <circle pathLength={1} cx="1120" cy="430" r="330" />
        <circle pathLength={1} cx="1120" cy="430" r="250" />
        <path pathLength={1} d="M1120 60v740M760 430h720" />
        <path pathLength={1} d="M26 196v330M16 196h20M16 526h20M20 361h12" />
        <path pathLength={1} d="M1352 150l18-40 18 40-18-10z" />
      </svg>

      <div className="hero-meta" data-hero-fade>
        <span>{site.tagline}</span>
        <span>{site.location}</span>
        <span>Portfolio — ’26</span>
      </div>

      <h1 className="hero-title">
        <span className="line"><SplitText text="Shins" delay={300} /></span>
        <span className="line line-2"><SplitText text="Joy" as="em" delay={560} /><span className="hero-dot" /></span>
      </h1>

      <div className="hero-art">
        <figure ref={archRef} className="hero-arch" data-depth="0.5">
          <div className="arch-frame">
            <Image {...hero.arch} alt={hero.arch.alt} sizes="(max-width: 760px) 54vw, 25vw" loading="eager" fetchPriority="high" />
          </div>
          <svg className="arch-outline" viewBox="0 0 100 140" preserveAspectRatio="none" aria-hidden="true">
            <path pathLength={1} d="M1 139V50a49 49 0 0 1 98 0v89" />
          </svg>
          <figcaption className="note note--arch">
            Malargal, Kottayam
            <svg viewBox="0 0 80 40" aria-hidden="true"><path d="M2 8c20 2 44 8 62 26m0 0-12-2m12 2-1-12" /></svg>
          </figcaption>
        </figure>
        <figure ref={inkRef} className="hero-card hero-card--ink" data-depth="1.3">
          <Image {...hero.ink} alt={hero.ink.alt} sizes="(max-width: 760px) 44vw, 13vw" loading="eager" />
          <figcaption className="note note--ink">blue ballpoint</figcaption>
        </figure>
        <figure ref={paintRef} className="hero-card hero-card--paint" data-depth="0.9">
          <Image {...hero.paint} alt={hero.paint.alt} sizes="9vw" loading="eager" />
        </figure>
      </div>

      <div className="hero-bottom" data-hero-fade>
        <p className="hero-roles">
          Making <Roller words={hero.roles} />
          <span className="sr-only">{hero.roles.join(', ')}</span>
          <br />rooted in Kerala, drawn in blue ink.
        </p>
        <a className="hero-scroll" href="#intro"><span>Scroll</span><i aria-hidden="true" /></a>
      </div>
    </section>
  );
}
