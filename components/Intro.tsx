'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { statement, stats } from '@/lib/content';
import { clamp, docTop, useFrame, useReducedMotion, useRelayout } from '@/lib/motion';

// Split the statement into words once; phrases keep their emphasis and colour.
const groups = (() => {
  let i = 0;
  return statement.map(seg => ({
    ...seg,
    words: seg.text.split(/(\s+)/).filter(Boolean).map(part => (/^\s+$/.test(part) ? null : { text: part, i: i++ })),
  }));
})();
const wordCount = groups.reduce((n, g) => n + g.words.filter(Boolean).length, 0);

function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current!;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const dur = reduce ? 0 : 1800;
      const step = (now: number) => {
        const t = dur ? clamp((now - t0) / dur, 0, 1) : 1;
        el.textContent = Math.round(value * (1 - Math.pow(1 - t, 4))).toLocaleString('en-IN');
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, reduce]);
  return <dd ref={ref}>0</dd>;
}

export function Intro() {
  const ref = useRef<HTMLParagraphElement>(null);
  const box = useRef({ top: 0, height: 0 });
  const [lit, setLit] = useState(0);
  const reduce = useReducedMotion();

  useRelayout(() => {
    if (!ref.current) return;
    box.current = { top: docTop(ref.current), height: ref.current.offsetHeight };
  });

  // Words ink in as the paragraph travels up the screen.
  useFrame(({ y, vh }) => {
    const { top, height } = box.current;
    const start = top - vh * 0.8;
    const end = top + height - vh * 0.35;
    const n = Math.round(clamp((y - start) / (end - start), 0, 1) * wordCount);
    if (n !== lit) setLit(n);
  }, !reduce);

  const shown = reduce ? wordCount : lit;
  const renderWords = (words: (typeof groups)[number]['words']) =>
    words.map((w, k) => (w ? <span key={k} className={w.i < shown ? 'w on' : 'w'}>{w.text}</span> : ' '));

  return (
    <section className="intro" id="intro">
      <p className="label" data-reveal>(About)</p>
      <p ref={ref} className="statement">
        {groups.map((g, k): ReactNode => {
          if (!g.em) return <span key={k}>{renderWords(g.words)}</span>;
          const tone = g.tone ? `c-${g.tone}` : undefined;
          return <em key={k} className={tone}>{renderWords(g.words)}</em>;
        })}
      </p>
      <div className="intro-foot">
        <dl className="stats">
          {stats.map((s, i) => (
            <div key={s.label} data-reveal style={{ '--d': `${i * 120}ms` } as CSSProperties}>
              <dt>{s.label}</dt>
              <Counter value={s.value} />
            </div>
          ))}
        </dl>
        <p className="note note--intro" data-reveal>
          one pen, many worlds
          <svg viewBox="0 0 90 50" aria-hidden="true"><path d="M4 6c26-2 58 6 70 34m0 0-13-3m13 3 2-13" /></svg>
        </p>
      </div>
    </section>
  );
}
