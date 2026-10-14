'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useFrame } from '@/lib/motion';
import { site } from '@/lib/content';
import { Magnetic } from './Magnetic';

const links = [
  { href: '#architecture', label: 'Architecture' },
  { href: '#cinema', label: 'Set Design' },
  { href: '#illustration', label: 'Illustration' },
  { href: '#wall-art', label: 'Wall Art' },
];
const menuLinks = [...links, { href: '#contact', label: 'Contact' }];
const watched = ['top', 'work', 'architecture', 'cinema', 'illustration', 'wall-art', 'contact'];

function toggleTheme() {
  const root = document.documentElement;
  const current = root.dataset.theme
    || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const next = current === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('sj-theme', next); } catch { /* storage unavailable */ }
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const navRef = useRef<HTMLElement>(null);
  const lastY = useRef(0);

  // Hide on scroll down, show on scroll up; frosted background once scrolled.
  useFrame(({ y, vh }) => {
    const nav = navRef.current;
    if (!nav) return;
    nav.classList.toggle('is-scrolled', y > 30);
    if (Math.abs(y - lastY.current) > 6) {
      nav.classList.toggle('is-hidden', y > lastY.current && y > vh * 0.7 && !open);
      lastY.current = y;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('menu-open', open);
    if (open) navRef.current?.classList.remove('is-hidden');
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(`#${e.target.id}`); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    watched.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  return (
    <>
      <header ref={navRef} className="nav">
        <a href="#top" className="nav-logo" aria-label="Shins Joy, back to top">
          <span className="logo-mark">S</span><span className="logo-text">{site.name}</span>
        </a>
        <nav className="nav-links" aria-label="Primary">
          {links.map(l => (
            <a key={l.href} href={l.href} className={active === l.href ? 'is-active' : undefined}>{l.label}</a>
          ))}
        </nav>
        <div className="nav-right">
          <button className="theme-toggle" type="button" aria-label="Switch colour theme" onClick={toggleTheme}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.5c3.6 4.3 6.5 7.9 6.5 11.4A6.5 6.5 0 0 1 5.5 14c0-3.6 2.9-7.2 6.5-11.5Z" />
            </svg>
          </button>
          <Magnetic href="#contact" className="nav-cta">Say hello</Magnetic>
          <button
            className="nav-burger" type="button" aria-expanded={open} aria-controls="menu"
            onClick={() => setOpen(o => !o)}
          >
            <span /><span /><span className="sr-only">Menu</span>
          </button>
        </div>
      </header>

      <div className={open ? 'menu is-open' : 'menu'} id="menu">
        <nav aria-label="Mobile" onClick={e => { if ((e.target as Element).closest('a')) setOpen(false); }}>
          {menuLinks.map((l, i) => (
            <a key={l.href} href={l.href} style={{ '--i': i } as CSSProperties}>
              <small>{String(i + 1).padStart(2, '0')}</small>{l.label}
            </a>
          ))}
        </nav>
        <p className="menu-foot"><a href={site.instagram} target="_blank" rel="noopener">Instagram ↗</a></p>
      </div>
    </>
  );
}
