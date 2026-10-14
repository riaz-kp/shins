'use client';

import Image from 'next/image';
import { useEffect, useEffectEvent, useRef } from 'react';
import { malargal } from '@/lib/content';
import { clamp, docTop, useDesktop, useFrame, useReducedMotion, useRelayout } from '@/lib/motion';
import { SplitText } from './SplitText';

/**
 * Malargal walk-through. On desktop the section pins and vertical scroll drives the
 * track sideways; on phones (or with reduced motion) it is a native swipe strip.
 */
export function Architecture() {
  const desktop = useDesktop();
  const reduce = useReducedMotion();
  const pinned = desktop && !reduce;
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const geo = useRef({ top: 0, dist: 0 });

  const measure = () => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    if (!pinned) {
      section.style.height = '';
      track.style.transform = '';
      return;
    }
    geo.current.dist = Math.max(0, track.scrollWidth - window.innerWidth);
    section.style.height = `${geo.current.dist + window.innerHeight}px`;
    geo.current.top = docTop(section);
  };
  const remeasure = useEffectEvent(measure);
  useRelayout(measure);
  useEffect(() => { remeasure(); }, [pinned]);

  useFrame(({ y, vh, vw }) => {
    const { top, dist } = geo.current;
    const track = trackRef.current;
    if (!track || y < top - vh || y > top + dist + vh) return;
    const p = clamp((y - top) / (dist || 1), 0, 1);
    track.style.transform = `translate3d(${-p * dist}px,0,0)`;
    if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    // Images drift slightly inside their frames as they pass.
    track.querySelectorAll<HTMLElement>('.panel-media').forEach(m => {
      const r = m.getBoundingClientRect();
      if (r.right < 0 || r.left > vw) return;
      const off = (r.left + r.width / 2 - vw / 2) / vw;
      (m.firstElementChild as HTMLElement).style.transform = `scale(1.12) translateX(${off * -36}px)`;
    });
  }, pinned);

  const { fieldNotes } = malargal;

  return (
    <section ref={sectionRef} className={pinned ? 'arch arch--pinned' : 'arch'} id="architecture" aria-labelledby="arch-title">
      <div className="arch-pin">
        <div ref={trackRef} className="arch-track">
          <article className="panel panel-intro">
            <p className="label">(01) Architecture</p>
            <h2 id="arch-title" className="project-title"><SplitText text={malargal.title} onView /></h2>
            <p className="project-sub"><em>{malargal.sub}</em></p>
            <p className="project-body">{malargal.body}</p>
            <dl className="spec">
              {malargal.spec.map(s => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.href ? <a href={s.href} target="_blank" rel="noopener">{s.value}</a> : s.value}</dd>
                </div>
              ))}
            </dl>
            <svg className="dim-line" viewBox="0 0 400 40" aria-hidden="true">
              <path pathLength={1} d="M2 20h396M2 8v24M398 8v24M2 20l10-6M2 20l10 6M398 20l-10-6M398 20l-10 6" />
              <text x="200" y="14" textAnchor="middle">scroll to walk through →</text>
            </svg>
          </article>

          {malargal.panels.map((p, i) => (
            <figure key={p.src} className={p.arch ? 'panel panel-img panel-img--arch' : 'panel panel-img'}>
              <div className="panel-media">
                <Image src={p.src} width={p.width} height={p.height} alt={p.alt} sizes="(max-width: 760px) 60vw, 66vh" />
              </div>
              <figcaption><span>{String(i + 1).padStart(2, '0')}</span> {p.caption}</figcaption>
            </figure>
          ))}

          <article className="panel panel-sketch">
            <div className="panel-media">
              <Image {...fieldNotes.image} alt={fieldNotes.image.alt} sizes="(max-width: 760px) 50vw, 45vh" />
            </div>
            <div className="panel-sketch-copy">
              <p className="label">Field notes</p>
              <h3>{fieldNotes.title} <em>{fieldNotes.titleEm}</em></h3>
              <p>{fieldNotes.body}</p>
            </div>
          </article>

          <a className="panel panel-next" href="#cinema">
            <span className="label">Next</span>
            <span className="panel-next-title">Set Design <span aria-hidden="true">→</span></span>
          </a>
        </div>
        <div className="arch-progress" aria-hidden="true"><span ref={barRef} /></div>
      </div>
    </section>
  );
}
