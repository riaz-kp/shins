'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { clamp, useFrame, useReducedMotion, useRelayout } from '@/lib/motion';

/** Tilted ink band that speeds up, reverses and skews with scroll velocity. */
export function Marquee({ items }: { items: string[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const state = useRef({ x: 0, half: 0, dir: 1 });
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useRelayout(() => { if (trackRef.current) state.current.half = trackRef.current.scrollWidth / 2; });

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(wrapRef.current!);
    return () => io.disconnect();
  }, []);

  useFrame(({ dy, velocity }) => {
    const s = state.current;
    if (!s.half || !trackRef.current) return;
    if (Math.abs(dy) > 0.5) s.dir = dy > 0 ? 1 : -1;
    s.x -= (0.7 + Math.min(Math.abs(velocity) * 0.35, 18)) * s.dir;
    if (s.x <= -s.half) s.x += s.half;
    if (s.x > 0) s.x -= s.half;
    trackRef.current.style.transform = `translate3d(${s.x}px,0,0) skewX(${clamp(-velocity * 0.25, -10, 10)}deg)`;
  }, visible && !reduce);

  // Two identical halves so the loop is seamless.
  const half = items.map((item, i) => (
    <Fragment key={item}>
      {i % 2 ? <em>{item}</em> : <span>{item}</span>}
      <b>✦</b>
    </Fragment>
  ));

  return (
    <div ref={wrapRef} className="marquee" aria-hidden="true">
      <div ref={trackRef} className="marquee-track">
        {half}
        {half}
      </div>
    </div>
  );
}
