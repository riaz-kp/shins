'use client';

import { useEffect } from 'react';

/**
 * Adds `.is-in` to marked elements the first time they scroll into view.
 * The class is added directly (not via state) so server-rendered sections stay
 * server components; React leaves it alone because their className props never change.
 */
export function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    document
      .querySelectorAll('[data-reveal], [data-split-on-view], .clapper, .panel-intro, .scribble')
      .forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
