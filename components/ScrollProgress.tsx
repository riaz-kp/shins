'use client';

import { useRef } from 'react';
import { clamp, useFrame, useRelayout } from '@/lib/motion';

export function ScrollProgress() {
  const barRef = useRef<HTMLSpanElement>(null);
  const docH = useRef(0);

  useRelayout(() => { docH.current = document.documentElement.scrollHeight; });
  useFrame(({ y, vh }) => {
    if (barRef.current) barRef.current.style.transform = `scaleX(${clamp(y / Math.max(1, docH.current - vh), 0, 1)})`;
  });

  return <div className="progress" aria-hidden="true"><span ref={barRef} /></div>;
}
