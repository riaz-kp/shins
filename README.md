# Shins Joy — Portfolio

A single-page portfolio for architecture, set design, illustration and wall art, built with
**Next.js 16** (App Router, TypeScript). The page is fully static and has no runtime dependencies beyond Next and React.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint
```

Deploy to Vercel or any Node host. Set `NEXT_PUBLIC_SITE_URL` to the live URL so social
previews (Open Graph) use absolute links.

## Where things live

| Path | What |
| --- | --- |
| `lib/content.ts` | **All copy, credits and media lists**. Most edits happen here. |
| `app/layout.tsx` | Fonts (`next/font`), metadata, loader, cursor, theme boot script |
| `app/page.tsx` | Section order |
| `app/globals.css` | Design tokens (colours at the top, dark mode below), layout, animation |
| `components/` | One component per section, plus small shared pieces |
| `lib/motion.ts` | Shared animation frame (`useFrame`), media-query hooks, relayout helper |
| `public/media/` | Images and video from instagram.com/shinsjoy (`painting-*.jpg` are stills from the Aadu 3 process reel) |
| `_legacy-static/` | The original plain-HTML version, kept for reference. Safe to delete. |

## Common edits

- **Add an email button:** set `site.email` in `lib/content.ts`.
- **Add an illustration:** put the image in `public/media/` and add an entry to `artworks` in
  `lib/content.ts` (`cat` is `ballpoint`, `sketchbook`, `figure` or `digital`; include its pixel `width`/`height`).
- **Add mural photos:** add them to `wallArt.process`, or swap `wallArt.painting`.
- **Change film credits or copy:** edit `aadu3` / `vala` in `lib/content.ts`.
- **Change colours:** edit `--paper`, `--ink`, `--blue` and `--terra` at the top of `app/globals.css`.

Motion respects the visitor's "reduce motion" setting, and the layout adapts down to phone width.
