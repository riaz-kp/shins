'use client';

import Image from 'next/image';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { wallArt } from '@/lib/content';
import { clamp, docTop, useDesktop, useFrame, useReducedMotion, useRelayout } from '@/lib/motion';
import { Magnetic } from './Magnetic';

/** Clip path for the paint edge: a wobbling line with a few drips, `p` (0–1) down the canvas. */
function wetEdge(p: number, t: number) {
  if (p <= 0) return 'inset(0 0 100% 0)';
  if (p >= 1) return 'inset(0 0 0 0)';
  const y = p * 100;
  const amp = Math.min(1, p * 8) * Math.min(1, (1 - p) * 8);
  const pts = ['0% 0%', '100% 0%'];
  for (let i = 0; i <= 24; i++) {
    const x = 100 - (i / 24) * 100;
    const drip = Math.pow(Math.max(0, Math.sin(i * 2.3 + 1.1)), 12) * 5 * amp;
    const wobble = Math.sin(i * 0.8 + t * 0.003) * 0.5 * amp;
    pts.push(`${x.toFixed(2)}% ${(y + wobble + drip).toFixed(2)}%`);
  }
  return `polygon(${pts.join(',')})`;
}

/**
 * On desktop the section pins and scrolling drives a paint roller down the wall,
 * revealing the painting. On phones it paints itself once when scrolled into view.
 */
export function WallArt() {
  const desktop = useDesktop();
  const reduce = useReducedMotion();
  const pinned = desktop && !reduce;
  const [painted, setPainted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const paintRef = useRef<HTMLElement>(null);
  const rollerRef = useRef<HTMLDivElement>(null);
  const geo = useRef({ top: 0, height: 0, paintH: 0, rollerOff: 0 });

  const measure = () => {
    const section = sectionRef.current;
    const paint = paintRef.current;
    const roller = rollerRef.current;
    if (!section || !paint || !roller) return;
    if (!pinned) {
      paint.style.clipPath = '';
      roller.style.translate = '';
      roller.style.opacity = '';
    }
    const g = geo.current;
    g.top = docTop(section);
    g.height = section.offsetHeight;
    g.paintH = paint.offsetHeight;
    g.rollerOff = roller.offsetWidth * (33 / 400); // drum centre within the SVG
    section.style.setProperty('--roll-end', `${g.paintH - g.rollerOff}px`);
  };
  const remeasure = useEffectEvent(measure);
  useRelayout(measure);
  useEffect(() => { remeasure(); }, [pinned]);

  useEffect(() => {
    if (reduce) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setPainted(true); }, { threshold: 0.35 });
    io.observe(canvasRef.current!);
    return () => io.disconnect();
  }, [reduce]);

  useFrame(({ y, vh, now }) => {
    const { top, height, paintH, rollerOff } = geo.current;
    const paint = paintRef.current;
    const roller = rollerRef.current;
    if (!paint || !roller || y < top - vh || y > top + height) return;
    const p = clamp(((y - top) / Math.max(1, height - vh)) * 1.2 - 0.08, 0, 1);
    paint.style.clipPath = wetEdge(p, now);
    roller.style.translate = `0 ${p * paintH - rollerOff}px`;
    roller.style.opacity = p >= 1 ? '0' : '1';
  }, pinned);

  const cls = ['wall', pinned && 'wall--pinned', (painted || reduce) && 'is-painted'].filter(Boolean).join(' ');

  return (
    <section ref={sectionRef} className={cls} id="wall-art" aria-labelledby="wall-title">
      <div className="wall-pin">
        <div className="wall-copy">
          <p className="label" data-reveal>(04) Wall Art</p>
          <h2 id="wall-title" className="h2" data-reveal>{wallArt.title} <em>{wallArt.titleEm}</em></h2>
          <p className="wall-body" data-reveal>{wallArt.body}</p>
          <ol className="process" data-reveal>
            {wallArt.process.map(s => (
              <li key={s.step}>
                <Image src={s.src} width={s.width} height={s.height} alt={s.alt} sizes="120px" />
                <span><b>{s.step}</b> {s.label}</span>
              </li>
            ))}
          </ol>
          <Magnetic className="btn" href="#contact" data-reveal="">Commission a wall <span aria-hidden="true">→</span></Magnetic>
        </div>
        <div ref={canvasRef} className="wall-canvas">
          <div className="wall-plaster" aria-hidden="true" />
          <figure ref={paintRef} className="wall-paint">
            <Image {...wallArt.painting} alt={wallArt.painting.alt} sizes="(max-width: 760px) 80vw, 46vh" />
          </figure>
          <div ref={rollerRef} className="roller-tool" aria-hidden="true">
            <svg viewBox="0 0 400 120">
              <rect className="roller-drum" x="10" y="10" width="380" height="46" rx="23" />
              <path className="roller-frame" d="M390 33h22v48H200v34" />
              <rect className="roller-grip" x="186" y="112" width="28" height="78" rx="13" />
            </svg>
          </div>
          <p className="wall-cap">{wallArt.caption}</p>
        </div>
      </div>
    </section>
  );
}
