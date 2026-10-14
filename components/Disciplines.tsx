'use client';

import { useRef, useState, type PointerEvent } from 'react';
import { disciplines } from '@/lib/content';
import { clamp, lerp, useFinePointer, useFrame } from '@/lib/motion';

/** The four disciplines; hovering a row floats an arch-shaped preview after the cursor. */
export function Disciplines() {
  const fine = useFinePointer();
  const previewRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const preloaded = useRef(false);
  const [img, setImg] = useState(disciplines[0].img);
  const [on, setOn] = useState(false);

  useFrame(() => {
    const p = pos.current;
    const el = previewRef.current;
    if (!el) return;
    p.x = lerp(p.x, p.tx, 0.16);
    p.y = lerp(p.y, p.ty, 0.16);
    el.style.translate = `${p.x}px ${p.y}px`;
    el.style.setProperty('--r', `${clamp((p.tx - p.x) * 0.08, -12, 12)}deg`);
  }, fine && on);

  const preload = () => {
    if (preloaded.current) return;
    preloaded.current = true;
    disciplines.forEach(d => { new Image().src = d.img; });
  };
  const track = (e: PointerEvent) => { pos.current.tx = e.clientX; pos.current.ty = e.clientY; };
  const enter = (src: string) => (e: PointerEvent) => {
    if (!on) Object.assign(pos.current, { x: e.clientX, y: e.clientY, tx: e.clientX, ty: e.clientY });
    setImg(src);
    setOn(true);
  };

  return (
    <section className="index" id="work" aria-labelledby="work-title">
      <header className="section-head">
        <p className="label" data-reveal>(Selected work)</p>
        <h2 id="work-title" className="h2" data-reveal>Four ways of <em>making</em></h2>
      </header>
      <ul
        className="disc-list"
        onPointerEnter={fine ? preload : undefined}
        onPointerMove={fine ? track : undefined}
      >
        {disciplines.map(d => (
          <li key={d.no} data-reveal>
            <a
              className="disc" href={d.href}
              onPointerEnter={fine ? enter(d.img) : undefined}
              onPointerLeave={fine ? () => setOn(false) : undefined}
            >
              <span className="disc-no">{d.no}</span>
              <span className="disc-name">{d.name}</span>
              <span className="disc-desc">{d.desc}</span>
              <span className="disc-arrow" aria-hidden="true">→</span>
            </a>
          </li>
        ))}
      </ul>
      {fine && (
        <div ref={previewRef} className={on ? 'hover-preview is-on' : 'hover-preview'} aria-hidden="true">
          {/* Plain <img>: the source swaps on every hover, so preloaded originals are best. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} alt="" />
        </div>
      )}
    </section>
  );
}
