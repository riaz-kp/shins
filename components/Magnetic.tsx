'use client';

import type { AnchorHTMLAttributes, PointerEvent } from 'react';
import { useFinePointer, useReducedMotion } from '@/lib/motion';

/** A link that leans toward the pointer. */
export function Magnetic({ className, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const active = fine && !reduce;

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.28}px, ${(e.clientY - r.top - r.height / 2) * 0.4}px)`;
  };
  const onLeave = (e: PointerEvent<HTMLAnchorElement>) => { e.currentTarget.style.transform = ''; };

  return (
    <a
      className={className}
      onPointerMove={active ? onMove : undefined}
      onPointerLeave={active ? onLeave : undefined}
      {...props}
    >
      {children}
    </a>
  );
}
