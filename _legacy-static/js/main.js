/* Shins Joy — portfolio interactions. Vanilla JS, no dependencies. */
(() => {
  'use strict';

  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  const docTop = el => { let t = 0; while (el) { t += el.offsetTop; el = el.offsetParent; } return t; };

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const desktop = matchMedia('(min-width: 761px)');

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
  };

  /* ---------- Theme ---------- */
  const systemDark = matchMedia('(prefers-color-scheme: dark)');
  const themeMeta = $('meta[name="theme-color"]');
  const currentTheme = () => root.dataset.theme || (systemDark.matches ? 'dark' : 'light');
  const syncThemeMeta = () => { if (themeMeta) themeMeta.content = currentTheme() === 'dark' ? '#101118' : '#f2ede3'; };
  syncThemeMeta();
  $('.theme-toggle')?.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    store.set('sj-theme', next);
    syncThemeMeta();
  });

  /* ---------- Text splitting ---------- */
  function splitChars(el) {
    const text = el.textContent.trim();
    const sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = text;
    const chars = document.createElement('span');
    chars.setAttribute('aria-hidden', 'true');
    [...text].forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'char';
      s.style.setProperty('--i', i);
      s.textContent = ch === ' ' ? ' ' : ch;
      chars.append(s);
    });
    el.replaceChildren(sr, chars);
  }

  function splitWords(container) {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.append(' '); return; }
        const w = document.createElement('span');
        w.className = 'w';
        w.textContent = part;
        frag.append(w);
      });
      node.replaceWith(frag);
    });
    return $$('.w', container);
  }

  $$('[data-split]').forEach(splitChars);

  /* ---------- Reveal on scroll ---------- */
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      revealIO.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('[data-reveal], [data-split-on-view], .clapper, .panel-intro, .scribble').forEach(el => revealIO.observe(el));

  /* ---------- Counters ---------- */
  const countIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      countIO.unobserve(e.target);
      const el = e.target;
      const end = Number(el.dataset.count);
      const dur = reduceMotion ? 0 : 1800;
      const t0 = performance.now();
      const step = now => {
        const t = dur ? clamp((now - t0) / dur, 0, 1) : 1;
        el.textContent = Math.round(end * (1 - Math.pow(1 - t, 4))).toLocaleString('en-IN');
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(el => countIO.observe(el));

  /* ---------- Rolling role word in the hero ---------- */
  function startRoller() {
    const roller = $('.roller');
    if (!roller) return;
    const words = $$('span', roller);
    let i = 0;
    const fit = () => { roller.style.width = `${words[i].offsetWidth}px`; };
    words[0].classList.add('is-active');
    fit();
    addEventListener('resize', debounce(fit, 100));
    if (reduceMotion) return;
    setInterval(() => {
      const prev = words[i];
      prev.classList.remove('is-active');
      prev.classList.add('is-out');
      setTimeout(() => {
        prev.classList.add('no-t');
        prev.classList.remove('is-out');
        void prev.offsetWidth;
        prev.classList.remove('no-t');
      }, 900);
      i = (i + 1) % words.length;
      words[i].classList.add('is-active');
      fit();
    }, 2600);
  }

  /* ---------- Loader ---------- */
  function startSite() {
    root.classList.add('is-loaded');
    $$('.hero [data-split]').forEach((el, i) => {
      el.style.setProperty('--sd', `${300 + i * 260}ms`);
      el.classList.add('is-in');
    });
    startRoller();
    layout();
  }

  function runLoader() {
    const loader = $('.loader');
    if (!loader) { startSite(); return; }
    const countEl = $('.loader-count span');
    const imgs = $$('.hero img');
    let done = 0;
    let fontsDone = !document.fonts;
    imgs.forEach(img => {
      if (img.complete) { done++; return; }
      const finish = () => { done++; };
      img.addEventListener('load', finish, { once: true });
      img.addEventListener('error', finish, { once: true });
    });
    document.fonts?.ready.then(() => { fontsDone = true; });

    const start = performance.now();
    const minDur = reduceMotion ? 0 : 1400;
    const maxDur = 6000;
    const leave = () => {
      loader.classList.add('is-leaving');
      setTimeout(startSite, reduceMotion ? 0 : 620);
      setTimeout(() => loader.remove(), reduceMotion ? 50 : 1500);
    };
    const step = now => {
      const elapsed = now - start;
      const timeP = minDur ? clamp(elapsed / minDur, 0, 1) : 1;
      const loadP = elapsed > maxDur ? 1 : (done + (fontsDone ? 1 : 0)) / (imgs.length + 1);
      // Time-based (not per-frame easing) so it still finishes promptly when frames are throttled.
      const shown = Math.min(1 - Math.pow(1 - timeP, 3), loadP);
      countEl.textContent = Math.round(shown * 100);
      if (shown < 1) requestAnimationFrame(step);
      else leave();
    };
    requestAnimationFrame(step);
  }

  /* ---------- Custom cursor ---------- */
  const cursor = $('.cursor');
  const dot = $('.cursor-dot');
  const cursorLabel = $('.cursor-label');
  const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
  const ring = { x: mouse.x, y: mouse.y };
  const cursorOn = finePointer && !reduceMotion && !!cursor;
  if (cursorOn) {
    root.classList.add('has-cursor');
    addEventListener('pointermove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      dot.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;
      cursor.classList.remove('is-hidden');
      dot.classList.remove('is-hidden');
    }, { passive: true });
    document.addEventListener('pointerover', e => {
      const t = e.target.closest('[data-cursor], a, button, video');
      const label = t?.dataset.cursor;
      cursor.classList.toggle('is-view', !!label);
      cursor.classList.toggle('is-link', !!t && !label);
      if (label) cursorLabel.textContent = label;
    });
    root.addEventListener('pointerleave', () => { cursor.classList.add('is-hidden'); dot.classList.add('is-hidden'); });
    addEventListener('pointerdown', () => cursor.classList.add('is-down'));
    addEventListener('pointerup', () => cursor.classList.remove('is-down'));
  }

  /* ---------- Nav + mobile menu ---------- */
  const nav = $('.nav');
  const burger = $('.nav-burger');
  const menu = $('#menu');
  menu.hidden = false;
  $$('a', menu).forEach((a, i) => a.style.setProperty('--i', i));
  const setMenu = open => {
    burger.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    root.classList.toggle('menu-open', open);
    if (open) nav.classList.remove('is-hidden');
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false); });

  const navLinks = $$('.nav-links a');
  const sectionIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === `#${e.target.id}`));
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  $$('#top, #work, #architecture, #cinema, #illustration, #wall-art, #contact').forEach(s => sectionIO.observe(s));

  /* ---------- Hero: mouse parallax ---------- */
  const hero = $('.hero');
  const heroFigs = $$('.hero [data-depth]');
  const hp = { x: 0, y: 0, tx: 0, ty: 0 };
  if (finePointer && !reduceMotion) {
    hero.addEventListener('pointermove', e => {
      hp.tx = e.clientX / innerWidth - 0.5;
      hp.ty = e.clientY / innerHeight - 0.5;
    });
    hero.addEventListener('pointerleave', () => { hp.tx = 0; hp.ty = 0; });
  }

  /* ---------- Marquee ---------- */
  const mTrack = $('.marquee-track');
  let mX = 0;
  let mHalf = 0;
  let mDir = 1;

  /* ---------- About statement: words ink in as you scroll ---------- */
  const statement = $('[data-fill]');
  const words = statement ? splitWords(statement) : [];
  let fillCount = -1;
  if (reduceMotion) words.forEach(w => w.classList.add('on'));

  /* ---------- Discipline list: floating arch preview ---------- */
  const preview = $('.hover-preview');
  const previewImg = preview && $('img', preview);
  const pv = { x: 0, y: 0, tx: 0, ty: 0, on: false };
  if (finePointer && preview) {
    const list = $('.disc-list');
    let preloaded = false;
    list.addEventListener('pointerenter', () => {
      if (preloaded) return;
      preloaded = true;
      $$('.disc').forEach(d => { new Image().src = d.dataset.img; });
    });
    $$('.disc').forEach(d => {
      d.addEventListener('pointerenter', e => {
        if (!pv.on) { pv.x = pv.tx = e.clientX; pv.y = pv.ty = e.clientY; }
        pv.on = true;
        if (previewImg.getAttribute('src') !== d.dataset.img) previewImg.src = d.dataset.img;
        preview.classList.add('is-on');
      });
      d.addEventListener('pointerleave', () => { pv.on = false; preview.classList.remove('is-on'); });
    });
    list.addEventListener('pointermove', e => { pv.tx = e.clientX; pv.ty = e.clientY; });
  }

  /* ---------- Architecture: pinned horizontal walk-through ---------- */
  const arch = $('.arch');
  const archTrack = $('.arch-track');
  const archBar = $('.arch-progress span');
  const archMedia = $$('.panel-media', archTrack);
  let archPinned = false;
  let archDist = 0;
  let archTop = 0;
  function layoutArch() {
    archPinned = desktop.matches && !reduceMotion;
    arch.classList.toggle('arch--pinned', archPinned);
    if (!archPinned) {
      arch.style.height = '';
      archTrack.style.transform = '';
      return;
    }
    archDist = Math.max(0, archTrack.scrollWidth - innerWidth);
    arch.style.height = `${archDist + innerHeight}px`;
    archTop = docTop(arch);
  }

  /* ---------- Cinema: lights down + video ---------- */
  const cinema = $('#cinema');
  new IntersectionObserver(([e]) => root.classList.toggle('lights-off', e.isIntersecting),
    { rootMargin: '-40% 0px -40% 0px' }).observe(cinema);

  const video = $('.film-video');
  const soundBtn = $('.sound-toggle');
  if (video) {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !reduceMotion) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.35 }).observe(video);
    video.addEventListener('click', () => { if (video.paused) video.play().catch(() => {}); else video.pause(); });
    soundBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      soundBtn.setAttribute('aria-pressed', String(!video.muted));
      $('span', soundBtn).textContent = video.muted ? 'Sound off' : 'Sound on';
      if (video.paused) video.play().catch(() => {});
    });
  }

  /* ---------- 3D tilt + magnetic buttons ---------- */
  if (finePointer && !reduceMotion) {
    $$('[data-tilt]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
    $$('.magnetic').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.28}px, ${(e.clientY - r.top - r.height / 2) * 0.4}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- Illustration: filters ---------- */
  const items = $$('.g-item');
  const filters = $$('.filter');
  filters.forEach(btn => btn.addEventListener('click', () => {
    const cat = btn.dataset.filter;
    filters.forEach(b => {
      const on = b === btn;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    let k = 0;
    items.forEach(it => {
      const show = cat === 'all' || it.dataset.cat.split(' ').includes(cat);
      it.hidden = !show;
      if (show) {
        it.classList.remove('is-in');
        it.style.setProperty('--d', `${k++ * 70}ms`);
      }
    });
    void document.body.offsetWidth;
    items.forEach(it => { if (!it.hidden) { it.classList.add('is-in'); revealIO.unobserve(it); } });
    layout();
  }));

  /* ---------- Illustration: lightbox (zooms out of the thumbnail) ---------- */
  const lb = $('.lightbox');
  const lbImg = $('.lb-img');
  const lbCap = $('.lb-cap');
  const lbCount = $('.lb-count');
  let lbList = [];
  let lbIndex = 0;
  let lbToken = 0;
  const pad = n => String(n).padStart(2, '0');

  async function lbShow(i, originImg) {
    const token = ++lbToken;
    lbIndex = (i + lbList.length) % lbList.length;
    const item = lbList[lbIndex];
    const img = $('img', item);
    lbImg.style.opacity = '0';
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCap.innerHTML = $('figcaption', item).innerHTML;
    lbCount.textContent = `${pad(lbIndex + 1)} / ${pad(lbList.length)}`;
    try { await lbImg.decode(); } catch { /* show anyway */ }
    if (token !== lbToken) return;
    lbImg.style.opacity = '';
    if (reduceMotion) return;
    if (originImg) {
      const a = originImg.getBoundingClientRect();
      const b = lbImg.getBoundingClientRect();
      lbImg.animate([
        { transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width}, ${a.height / b.height})` },
        { transform: 'none' },
      ], { duration: 750, easing: 'cubic-bezier(.16,1,.3,1)' });
    } else {
      lbImg.animate([{ opacity: 0, transform: 'scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'ease-out' });
    }
  }

  items.forEach(it => $('.g-open', it).addEventListener('click', () => {
    lbList = items.filter(x => !x.hidden);
    lb.showModal();
    root.classList.add('lb-open');
    lbShow(lbList.indexOf(it), $('img', it));
  }));
  lb.addEventListener('close', () => root.classList.remove('lb-open'));
  $('.lb-close').addEventListener('click', () => lb.close());
  $('.lb-prev').addEventListener('click', () => lbShow(lbIndex - 1));
  $('.lb-next').addEventListener('click', () => lbShow(lbIndex + 1));
  lb.addEventListener('click', e => { if (e.target === lb || e.target === $('.lb-figure')) lb.close(); });
  lb.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') lbShow(lbIndex + 1);
    if (e.key === 'ArrowLeft') lbShow(lbIndex - 1);
  });
  let swipeX = null;
  lb.addEventListener('pointerdown', e => { swipeX = e.pointerType === 'mouse' ? null : e.clientX; });
  lb.addEventListener('pointerup', e => {
    if (swipeX === null) return;
    const dx = e.clientX - swipeX;
    if (Math.abs(dx) > 50) lbShow(lbIndex + (dx < 0 ? 1 : -1));
    swipeX = null;
  });

  /* ---------- Wall art: scroll-driven paint roller ---------- */
  const wall = $('.wall');
  const wallPaint = $('.wall-paint');
  const rollerTool = $('.roller-tool');
  let wallPinned = false;
  let wallTop = 0;
  let wallH = 0;
  let paintH = 0;
  let rollerOff = 0;
  function layoutWall() {
    wallPinned = desktop.matches && !reduceMotion;
    wall.classList.toggle('wall--pinned', wallPinned);
    if (!wallPinned) { wallPaint.style.clipPath = ''; rollerTool.style.translate = ''; rollerTool.style.opacity = ''; }
    wallTop = docTop(wall);
    wallH = wall.offsetHeight;
    paintH = wallPaint.offsetHeight;
    rollerOff = rollerTool.offsetWidth * (33 / 400); // drum centre within the SVG
    wall.style.setProperty('--roll-end', `${paintH - rollerOff}px`);
  }
  if (reduceMotion) wall.classList.add('is-painted');
  new IntersectionObserver(([e]) => { if (e.isIntersecting) wall.classList.add('is-painted'); },
    { threshold: 0.35 }).observe($('.wall-canvas'));

  function wetEdge(p, t) {
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

  /* ---------- Layout cache ---------- */
  const cache = { docH: 0, stTop: 0, stH: 0 };
  function layout() {
    layoutArch();
    layoutWall();
    if (statement) { cache.stTop = docTop(statement); cache.stH = statement.offsetHeight; }
    if (mTrack) mHalf = mTrack.scrollWidth / 2;
    cache.docH = root.scrollHeight;
  }
  addEventListener('resize', debounce(layout, 150));
  addEventListener('load', layout);
  desktop.addEventListener('change', layout);
  document.fonts?.ready.then(layout);
  new ResizeObserver(debounce(layout, 200)).observe(document.body);

  /* ---------- Frame loop ---------- */
  const progress = $('.progress span');
  let lastY = scrollY;
  let navY = scrollY;
  let velocity = 0;

  function tick(now) {
    const y = scrollY;
    const vh = innerHeight;
    const dy = y - lastY;
    lastY = y;
    velocity = lerp(velocity, dy, 0.12);

    progress.style.transform = `scaleX(${clamp(y / Math.max(1, cache.docH - vh), 0, 1)})`;

    nav.classList.toggle('is-scrolled', y > 30);
    if (Math.abs(y - navY) > 6) {
      nav.classList.toggle('is-hidden', y > navY && y > vh * 0.7 && !menu.classList.contains('is-open'));
      navY = y;
    }

    if (cursorOn) {
      ring.x = lerp(ring.x, mouse.x, 0.2);
      ring.y = lerp(ring.y, mouse.y, 0.2);
      cursor.style.transform = `translate(${ring.x}px, ${ring.y}px)`;
    }

    if (!reduceMotion && y < vh * 1.2) {
      hp.x = lerp(hp.x, hp.tx, 0.06);
      hp.y = lerp(hp.y, hp.ty, 0.06);
      heroFigs.forEach(f => {
        const d = Number(f.dataset.depth);
        f.style.translate = `${-hp.x * d * 40}px ${-hp.y * d * 30 - y * d * 0.18}px`;
      });
    }

    if (mTrack && mHalf && !reduceMotion) {
      if (Math.abs(dy) > 0.5) mDir = dy > 0 ? 1 : -1;
      mX -= (0.7 + Math.min(Math.abs(velocity) * 0.35, 18)) * mDir;
      if (mX <= -mHalf) mX += mHalf;
      if (mX > 0) mX -= mHalf;
      mTrack.style.transform = `translate3d(${mX}px,0,0) skewX(${clamp(-velocity * 0.25, -10, 10)}deg)`;
    }

    if (words.length && !reduceMotion) {
      const start = cache.stTop - vh * 0.8;
      const end = cache.stTop + cache.stH - vh * 0.35;
      const n = Math.round(clamp((y - start) / (end - start), 0, 1) * words.length);
      if (n !== fillCount) {
        words.forEach((w, i) => w.classList.toggle('on', i < n));
        fillCount = n;
      }
    }

    if (preview && (pv.on || Math.abs(pv.tx - pv.x) > 0.5)) {
      pv.x = lerp(pv.x, pv.tx, 0.16);
      pv.y = lerp(pv.y, pv.ty, 0.16);
      preview.style.translate = `${pv.x}px ${pv.y}px`;
      preview.style.setProperty('--r', `${clamp((pv.tx - pv.x) * 0.08, -12, 12)}deg`);
    }

    if (archPinned && y > archTop - vh && y < archTop + archDist + vh) {
      const p = clamp((y - archTop) / (archDist || 1), 0, 1);
      archTrack.style.transform = `translate3d(${-p * archDist}px,0,0)`;
      archBar.style.transform = `scaleX(${p})`;
      archMedia.forEach(m => {
        const r = m.getBoundingClientRect();
        if (r.right < 0 || r.left > innerWidth) return;
        const off = (r.left + r.width / 2 - innerWidth / 2) / innerWidth;
        m.firstElementChild.style.transform = `scale(1.12) translateX(${off * -36}px)`;
      });
    }

    cinema.style.setProperty('--film-x', `${-y * 0.4}px`);

    if (wallPinned && y > wallTop - vh && y < wallTop + wallH) {
      const p = clamp(((y - wallTop) / Math.max(1, wallH - vh)) * 1.2 - 0.08, 0, 1);
      wallPaint.style.clipPath = wetEdge(p, now);
      rollerTool.style.translate = `0 ${p * paintH - rollerOff}px`;
      rollerTool.style.opacity = p >= 1 ? '0' : '1';
    }

    requestAnimationFrame(tick);
  }

  layout();
  runLoader();
  requestAnimationFrame(tick);
})();
