'use client';

import { useEffect, useRef } from 'react';
import { lerp, useFinePointer, useFrame, useReducedMotion } from '@/lib/motion';

/** Ink dot + trailing ring. Grows over links, shows a label over `[data-cursor]`. */
export function Cursor() {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const enabled = fine && !reduce;
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const pos = useRef({ x: 0, y: 0, rx: 0, ry: 0 });

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    const ring = ringRef.current!;
    const dot = dotRef.current!;
    root.classList.add('has-cursor');

    const onMove = (e: PointerEvent) => {
      const p = pos.current;
      p.x = e.clientX;
      p.y = e.clientY;
      dot.style.transform = `translate(${p.x}px, ${p.y}px)`;
      ring.classList.remove('is-hidden');
      dot.classList.remove('is-hidden');
    };
    const onOver = (e: PointerEvent) => {
      const t = (e.target as Element).closest<HTMLElement>('[data-cursor], a, button, video');
      const label = t?.dataset.cursor;
      ring.classList.toggle('is-view', !!label);
      ring.classList.toggle('is-link', !!t && !label);
      if (label && labelRef.current) labelRef.current.textContent = label;
    };
    const onLeave = () => { ring.classList.add('is-hidden'); dot.classList.add('is-hidden'); };
    const onDown = () => ring.classList.add('is-down');
    const onUp = () => ring.classList.remove('is-down');

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver);
    root.addEventListener('pointerleave', onLeave);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    return () => {
      root.classList.remove('has-cursor');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      root.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, [enabled]);

  useFrame(() => {
    const p = pos.current;
    p.rx = lerp(p.rx, p.x, 0.2);
    p.ry = lerp(p.ry, p.y, 0.2);
    if (ringRef.current) ringRef.current.style.transform = `translate(${p.rx}px, ${p.ry}px)`;
  }, enabled);

  return (
    <>
      <div ref={ringRef} className="cursor is-hidden" aria-hidden="true">
        <div className="cursor-ring"><span ref={labelRef} className="cursor-label">View</span></div>
      </div>
      <div ref={dotRef} className="cursor-dot is-hidden" aria-hidden="true" />
    </>
  );
}
