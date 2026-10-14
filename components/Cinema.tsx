'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { aadu3, vala } from '@/lib/content';
import { useFinePointer, useFrame, useReducedMotion } from '@/lib/motion';
import { Clapper } from './Clapper';

function ProcessVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const reduce = useReducedMotion();

  // Play only while on screen (never autoplay with reduced motion).
  useEffect(() => {
    const video = ref.current!;
    video.muted = true; // React doesn't always serialise `muted`; autoplay needs it.
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !reduce) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.35 });
    io.observe(video);
    return () => io.disconnect();
  }, [reduce]);

  const toggleSound = () => {
    const video = ref.current!;
    video.muted = !muted;
    setMuted(!muted);
    if (video.paused) video.play().catch(() => {});
  };
  const togglePlay = () => {
    const video = ref.current!;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  return (
    <div className="film-media" data-reveal="clip">
      <video
        ref={ref} className="film-video" muted loop playsInline preload="none" poster={aadu3.poster}
        aria-label="Process video: Chronicles of Walter Sayip being sketched and painted" onClick={togglePlay}
      >
        <source src={aadu3.video} type="video/mp4" />
      </video>
      <button className="sound-toggle" type="button" aria-pressed={!muted} onClick={toggleSound}>
        <i aria-hidden="true" /><span>{muted ? 'Sound off' : 'Sound on'}</span>
      </button>
      <span className="film-tag">Process · sketch to canvas</span>
    </div>
  );
}

function ValaPoster() {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const tilt = fine && !reduce;
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  };
  return (
    <div
      className="vala-poster" data-reveal="clip"
      onPointerMove={tilt ? onMove : undefined}
      onPointerLeave={tilt ? e => { e.currentTarget.style.transform = ''; } : undefined}
    >
      <div className="vala-sky" aria-hidden="true" />
      <div className="vala-grid" aria-hidden="true" />
      <p className="vala-glyph" lang="ml" data-text={vala.ml} aria-hidden="true">{vala.ml}</p>
      <p className="vala-sub" aria-hidden="true">A film by Arun Chandu</p>
      <figure className="vala-badge">
        <Image {...vala.badge} alt={vala.badge.alt} sizes="86px" />
        <figcaption>on set</figcaption>
      </figure>
      <div className="vala-scan" aria-hidden="true" />
    </div>
  );
}

function Credits({ items }: { items: string[] }) {
  return <ul className="chips" data-reveal>{items.map(c => <li key={c}>{c}</li>)}</ul>;
}

export function Cinema() {
  const ref = useRef<HTMLElement>(null);

  // Dim the whole page while this section holds the middle of the screen.
  useEffect(() => {
    const root = document.documentElement;
    const io = new IntersectionObserver(([e]) => root.classList.toggle('lights-off', e.isIntersecting),
      { rootMargin: '-40% 0px -40% 0px' });
    io.observe(ref.current!);
    return () => { io.disconnect(); root.classList.remove('lights-off'); };
  }, []);

  // Film-strip perforations travel with the scroll.
  useFrame(({ y }) => { ref.current?.style.setProperty('--film-x', `${-y * 0.4}px`); });

  return (
    <section ref={ref} className="cinema" id="cinema" aria-labelledby="cinema-title">
      <div className="filmstrip filmstrip--top" aria-hidden="true" />
      <header className="section-head section-head--split">
        <div>
          <p className="label" data-reveal>(02) Set Design</p>
          <h2 id="cinema-title" className="h2" data-reveal>Worlds built for <em>the screen</em></h2>
        </div>
        <p className="section-lede" data-reveal>
          On Malayalam film sets, Shins designs and paints the worlds that actors step into — from period canvases to science fiction.
        </p>
      </header>

      <article className="film film--aadu">
        <ProcessVideo />
        <div className="film-info">
          <Clapper production={aadu3.title} {...aadu3.clapper} />
          <p className="film-ml" lang="ml" data-reveal>{aadu3.ml}</p>
          <h3 className="film-title" data-reveal>{aadu3.title}</h3>
          <p className="film-meta" data-reveal>{aadu3.meta}</p>
          <p className="film-body" data-reveal>{aadu3.bodyBefore}<em>{aadu3.bodyEm}</em>{aadu3.bodyAfter}</p>
          <Credits items={aadu3.credits} />
        </div>
      </article>

      <article className="film film--vala">
        <div className="film-info">
          <Clapper production={vala.title} {...vala.clapper} />
          <p className="film-ml" lang="ml" data-reveal>{vala.ml}</p>
          <h3 className="film-title" data-reveal>{vala.title}</h3>
          <p className="film-meta" data-reveal>{vala.meta}</p>
          <p className="film-body" data-reveal>{vala.body}</p>
          <Credits items={vala.credits} />
        </div>
        <ValaPoster />
      </article>
      <div className="filmstrip filmstrip--bottom" aria-hidden="true" />
    </section>
  );
}
