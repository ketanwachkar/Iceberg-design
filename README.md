# Iceberg

A scroll-driven landing page built around the iceberg metaphor — 20% visible above water, 80% hidden beneath. As you scroll, the scene descends below the surface, revealing what lies underneath.

---

## Overview

The page is a single continuous scroll experience. The hero section is pinned while the iceberg image slides upward, crossing the waterline and revealing the underwater mass. Ice fragments split apart, a deep ocean section zooms in with "TALENT RUNS DEEP", and two feature sections carry the same ice chunk across the screen as a single travelling element.

There is no JavaScript framework animation library wrapper — GSAP and ScrollTrigger are wired directly to DOM refs through custom React hooks, giving precise control without abstraction overhead.

---

## Features

- Pinned hero with scroll-driven iceberg reveal (sky → ocean transition)
- Waterline crossing — the page background colour blends seamlessly into the composite image
- Ice chunk split animation in Phase 3
- "TALENT RUNS DEEP" word-zoom with blur, tied to scroll progress
- Single travelling ice chunk that rises from below the screen and glides left across two feature sections
- Per-section staggered text reveal (label → lines → cue)
- Canvas particle system running on every deep-ocean section
- HUD labels (20% / 80%) that fade in as you descend
- Responsive at all breakpoints — animations recalculate on resize
- Accessible: screen-reader copy, `aria-hidden` on decorative elements, semantic landmark structure

---

## Tech Stack

### Framework
- **Next.js 16.2.9** — App Router, React Server Components for the layout/nav, `'use client'` only where GSAP is needed
- **React 19** — concurrent rendering, `useRef` / `useEffect` for animation lifecycle

### Language
- **TypeScript 5** — strict mode, path aliases (`@/*` → `src/*`)

### Styling
- **Tailwind CSS 4** — utility classes for layout and spacing; CSS custom properties for design tokens (colours, fonts) so GSAP can read them via `var(--teal)` etc.

### Animation
- **GSAP 3.15 + ScrollTrigger** — all scroll-driven animations. Imported through a singleton at `src/lib/gsap.ts` to prevent double-registration of the ScrollTrigger plugin.

### Canvas
- Custom particle system in `src/lib/particles.ts` — plain `requestAnimationFrame`, no library. DPR-aware, returns a cancellation function for cleanup.

### Fonts
- **Inter** (body) and **Outfit** (display) via `next/font/google` — self-hosted, zero layout shift, subset to latin

---

## Installation

```bash
# Clone or copy the project
cd iceberg-next

# Install dependencies
npm install

# Start development server
npm run dev
```

The app runs on `http://localhost:3000` by default.

---

## Environment Variables

Only one optional variable is used:

| Variable                  | Purpose                                      | Default                  |
|---------------------------|----------------------------------------------|--------------------------|
| `NEXT_PUBLIC_BASE_URL`    | Used to set `metadataBase` in layout.tsx for absolute OG image URLs | `http://localhost:3000` |

Create a `.env.local` file in the project root to set it:

```env
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

No other environment variables are required.

---

## Development Workflow

```bash
# Dev server with Turbopack (fast refresh, ~500ms cold start)
npm run dev

# Type-check without emitting
npx tsc --noEmit

# Lint
npm run lint
```

Changes to any `src/` file hot-reload instantly. GSAP animations re-initialise automatically because the `useGSAP` hook reverts its context on re-render and the `init()` function inside HeroSection re-runs on resize.

---

## Build Process

### Development
Turbopack is used in development (`next dev`). It compiles only the modules that are currently imported, so cold start is fast regardless of project size.

### Production

```bash
npm run build   # creates .next/
npm run start   # serves the production build
```

The production build:
- Pre-renders the root page as static HTML (no server-side data fetching needed)
- Splits JavaScript by route automatically
- Inlines critical CSS
- Generates font files from `next/font` and caches them with immutable headers

Output summary from a clean build:
```
Route (app)
  ○ /           Static — prerendered as static content
```

The whole page is statically generated. There are no API routes or server actions.

---

## Deployment

### Vercel (recommended)
Push to a Git repository and connect it to Vercel. No configuration needed — Vercel auto-detects Next.js.

Set `NEXT_PUBLIC_BASE_URL` in the Vercel environment variables dashboard to your production domain.

### Other platforms (Netlify, Railway, self-hosted)

```bash
npm run build
npm run start   # requires Node.js 18+
```

Or export as fully static HTML if you never need ISR or server features:

```bash
# Add to next.config.ts:
output: 'export'

npm run build   # outputs to /out
```

Static export works for this project because there are no server-side routes.

---

## Folder Structure

```
iceberg-next/
├── public/
│   └── images/
│       ├── iceberg-hero-bg.jpg     Composite above/below-water image
│       ├── ice-chunk-large.png     Left split chunk + travelling chunk
│       └── ice-chunk-small.png     Right split chunk
│
├── src/
│   ├── app/
│   │   ├── layout.tsx              Root layout — fonts, metadata, Navigation wrapper
│   │   ├── page.tsx                Root page — composes all sections, owns cross-section refs
│   │   └── globals.css             Re-exports src/styles/globals.css
│   │
│   ├── components/
│   │   ├── animations/
│   │   │   └── ParticleCanvas.tsx  Reusable canvas particle component
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx     Pinned hero, iceberg reveal, chunk split
│   │   │   ├── DeepSection.tsx     "TALENT RUNS DEEP" word-zoom
│   │   │   ├── FeatureSection.tsx  Reusable deep-ocean text + slot section (used twice)
│   │   │   └── TravellingChunk.tsx Fixed-position chunk, journey across sections A + B
│   │   └── ui/
│   │       ├── Navigation.tsx      Fixed capsule nav
│   │       └── HudLabels.tsx       20% / 80% overlay labels
│   │
│   ├── constants/
│   │   └── index.ts                Nav links, feature section content (labels, lines, cue text)
│   │
│   ├── design-tokens/
│   │   └── index.ts                Typed colour palette, font stacks, animation timing values,
│   │                               breakpoints. Single source of truth — matches CSS custom
│   │                               properties defined in globals.css.
│   │
│   ├── hooks/
│   │   ├── useGSAP.ts              Runs a GSAP context inside useEffect with auto-cleanup.
│   │   │                           Mirrors the official @gsap/react pattern.
│   │   ├── useParticles.ts         Attaches createParticles() to a canvas + container ref pair.
│   │   └── useFeatureTextAnimation.ts  Scroll-driven stagger reveal (label → lines → cue)
│   │                                   for a single feature section. Used from page.tsx.
│   │
│   ├── lib/
│   │   ├── gsap.ts                 GSAP singleton — registers ScrollTrigger once,
│   │   │                           exports gsap + ScrollTrigger + easeInOutCubic.
│   │   └── particles.ts            Pure particle factory. No React. Returns a cancel fn.
│   │
│   ├── styles/
│   │   └── globals.css             CSS custom properties (design tokens as CSS vars),
│   │                               Tailwind import, base reset.
│   │
│   └── types/
│       └── index.ts                Shared interfaces: Particle, NavLink, FeatureSectionData
│
├── next.config.ts                  Turbopack root, image patterns, reactStrictMode
├── tsconfig.json                   Strict mode, @/* path alias
└── package.json
```

---

## Performance Strategy

### Image optimisation

The two PNG ice chunks are served as-is from `/public/images` because GSAP needs to read their `offsetWidth` and `naturalWidth` to calculate positioning — using `next/image` with layout shifts or lazy-loading would break the waterline maths. The main composite JPEG (`iceberg-hero-bg.jpg`) is also served via `<img>` for the same reason.

All three images are:
- Referenced with absolute paths from `/public` so they're served with immutable cache headers in production
- Loaded eagerly (no `loading="lazy"`) because they're visible on first render
- Not double-fetched — the `<img>` element's `naturalWidth`/`naturalHeight` is read directly after `onLoad`, avoiding a separate dimension fetch

For future optimisation: the JPEG could be converted to WebP and served at multiple sizes using `<picture>` + `srcset`, staying outside Next.js `<Image>` to preserve the GSAP ref.

### Code splitting

Next.js App Router splits the bundle by route automatically. Since this project has a single route (`/`), the split happens at the component level:

- `HeroSection`, `DeepSection`, `FeatureSection`, `TravellingChunk` are all `'use client'` — they're excluded from the server bundle and lazy-hydrated
- `Navigation` is also `'use client'` but small enough that it's included in the initial bundle
- GSAP (the largest dependency at ~60KB gzipped) is only imported inside client components, so it never lands in the server-rendered HTML

Dynamic imports (`next/dynamic`) weren't used because the entire page requires client-side hydration anyway — splitting it further would add waterfall delays without reducing initial paint.

### Animation optimisation

**GSAP context scoping** — every animation is created inside `gsap.context()` via the `useGSAP` hook. When a component unmounts (or `useGSAP` deps change), `ctx.revert()` kills all tweens and ScrollTriggers in that context. Nothing leaks.

**Transform-only animations** — all GSAP `to()`/`set()` calls use `x`, `y`, `rotation`, `scale`, and `opacity`. No `top`, `left`, `width`, or any layout property is animated, so the browser compositor handles everything on the GPU without triggering reflow.

**`will-change: transform`** — applied via `willChange: 'transform'` on the iceberg layer and chunk images. This hints to the browser to promote those elements to their own compositor layer before animation starts. Applied sparingly — not on every element — to avoid over-promoting and wasting GPU memory.

**Particle canvas** — the particle rAF loop calls `clearRect` + `arc` + `fill` on every frame. No DOM manipulation, no React state updates. The `createParticles` function returns a cleanup function (`cancelAnimationFrame`) that `useParticles` calls on unmount. DPR scaling is applied once at init, not per frame.

**`scrub` values** — the hero timeline uses `scrub: 1.2` (1.2 second lag behind scroll position) rather than `scrub: true` (no lag). This prevents the animation from feeling jerky on trackpads and mobile. The travelling chunk uses `scrub: 2.5` for a slower, more deliberate feel. These values were tuned manually.

**`invalidateOnRefresh: true`** — all ScrollTriggers recalculate their pixel positions when the browser redraws (resize, orientation change). Without this, pinned sections calculate their scroll distances on first render and then break when the viewport changes.

**Resize handling** — the hero `init()` function recalculates waterline pixel values (`startY`, `endY`) based on live `window.innerWidth` and `naturalWidth`/`naturalHeight`. On resize, `ScrollTrigger.getAll().forEach(t => t.kill())` clears all instances before `init()` is called again.

### Caching strategy

Next.js production builds hash static asset filenames automatically. The files in `/public/images/` are not hashed by Next.js — they're served with standard cache headers. For production deployments:

- On **Vercel**: static assets in `/public` are served with `Cache-Control: public, max-age=0, must-revalidate` by default. To opt into longer caching, add a `vercel.json`:

  ```json
  {
    "headers": [
      {
        "source": "/images/(.*)",
        "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
      }
    ]
  }
  ```

- **Font files** from `next/font` are automatically served with `max-age=31536000, immutable` — they're content-hashed at build time.

- **JavaScript bundles** from the Next.js build are content-hashed and served as immutable. No action needed.

---

## Architecture Notes

### Why `useGSAP` instead of `@gsap/react`

`@gsap/react` is a thin wrapper around `gsap.context()` + `useEffect`. The custom `useGSAP` hook does the same thing without adding a dependency. The implementation is ~20 lines and the behaviour is identical.

### Why the GSAP singleton (`src/lib/gsap.ts`)

`gsap.registerPlugin(ScrollTrigger)` must only be called once per page load. Importing `ScrollTrigger` directly in multiple components would require each one to call `registerPlugin`, which either errors on double-registration or requires a guard. The singleton handles this once.

### Why `<img>` instead of `next/image` for the iceberg

The hero animation requires reading `iceImg.naturalWidth` and `iceImg.naturalHeight` synchronously after load to calculate the exact pixel position of the waterline. `next/image` with `fill` or `sizes` optimises images asynchronously and can defer dimension availability. Using a plain `<img>` with a `ref` makes the load event and dimension access straightforward and reliable.

### Why the travelling chunk is `position: fixed`

A single `<div>` floats above the page at `z-index: 500`, positioned by GSAP on every scroll tick via `getBoundingClientRect()` read from two invisible slot placeholders (one in each feature section). The slots scroll naturally with their sections; reading their viewport coordinates live means the chunk always tracks the correct position regardless of scroll speed or section height.
