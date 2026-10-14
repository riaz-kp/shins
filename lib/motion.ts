'use client';

import { useEffect, useEffectEvent, useSyncExternalStore } from 'react';

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Distance from the top of the document, ignoring transforms. */
export function docTop(el: HTMLElement | null) {
  let t = 0;
  while (el) {
    t += el.offsetTop;
    el = el.offsetParent as HTMLElement | null;
  }
  return t;
}

/* ---------- One shared animation frame for every scroll/pointer effect ---------- */

export type Frame = { now: number; y: number; dy: number; velocity: number; vw: number; vh: number };

const subscribers = new Set<(f: Frame) => void>();
let running = false;
let lastY = 0;
let velocity = 0;

function loop(now: number) {
  if (!subscribers.size) { running = false; return; }
  const y = window.scrollY;
  const dy = y - lastY;
  lastY = y;
  velocity = lerp(velocity, dy, 0.12);
  const frame: Frame = { now, y, dy, velocity, vw: window.innerWidth, vh: window.innerHeight };
  subscribers.forEach(fn => fn(frame));
  requestAnimationFrame(loop);
}

function subscribe(fn: (f: Frame) => void) {
  subscribers.add(fn);
  if (!running) {
    running = true;
    lastY = window.scrollY;
    requestAnimationFrame(loop);
  }
  return () => { subscribers.delete(fn); };
}

/** Runs `callback` on every animation frame while `enabled`. */
export function useFrame(callback: (f: Frame) => void, enabled = true) {
  const onFrame = useEffectEvent(callback);
  useEffect(() => {
    if (!enabled) return;
    return subscribe(f => onFrame(f));
  }, [enabled]);
}

/* ---------- Media queries ---------- */

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    onChange => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)');
export const useDesktop = () => useMediaQuery('(min-width: 761px)');

/**
 * Calls `measure` once on mount and again whenever layout may have shifted:
 * window resize, fonts or images finishing, or the page height changing.
 */
export function useRelayout(measure: () => void) {
  const run = useEffectEvent(measure);
  useEffect(() => {
    let timer: number | undefined;
    const now = () => run();
    const later = () => { window.clearTimeout(timer); timer = window.setTimeout(now, 150); };
    now();
    window.addEventListener('resize', later);
    window.addEventListener('load', now);
    document.fonts?.ready.then(now);
    const ro = new ResizeObserver(later);
    ro.observe(document.body);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', later);
      window.removeEventListener('load', now);
      ro.disconnect();
    };
  }, []);
}
