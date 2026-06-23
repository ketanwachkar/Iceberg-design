'use client'

/**
 * HeroSection
 * Pinned scroll-driven hero with iceberg composite image.
 *
 * LAYER STACK (z-index):
 *   1  sky bg
 *   2  hero particle canvas   (opacity 0 → 1 in Phase 2)
 *   3  layer-iceberg          composite img + two chunk imgs
 *   4  layer-sky-fade         colour gradient masks image sky
 *   5  layer-ocean-tint       dark underwater gradient
 *   6  layer-bottom-blend     seam to DeepSection
 *   10 banner                 headline + scroll cue
 *
 * PHASES (single scrub timeline, end: +=260%):
 *   0→1   Ocean reveal — image slides up, text floats down,
 *          tints appear, HUD labels fade in.
 *   1.1→2.1 Ice chunks split apart.
 */

import { useRef } from 'react'
import { useGSAP }    from '@/hooks/useGSAP'
import { useParticles } from '@/hooks/useParticles'
import { HudAbove, HudBelow } from '@/components/ui/HudLabels'
import { ScrollTrigger } from '@/lib/gsap'

export default function HeroSection() {
  /* ── Section ref (also the particle container) ─────────────── */
  const heroRef = useRef<HTMLElement>(null)

  /* ── Layer refs ─────────────────────────────────────────────── */
  const layerIcebergRef = useRef<HTMLDivElement>(null)
  const iceImgRef       = useRef<HTMLImageElement>(null)
  const chunkLRef       = useRef<HTMLImageElement>(null)
  const chunkRRef       = useRef<HTMLImageElement>(null)
  const skyFadeRef      = useRef<HTMLDivElement>(null)
  const oceanTintRef    = useRef<HTMLDivElement>(null)
  const bottomBlendRef  = useRef<HTMLDivElement>(null)
  const heroCanvasRef   = useRef<HTMLCanvasElement>(null)

  /* ── Text refs ──────────────────────────────────────────────── */
  const bannerRef  = useRef<HTMLDivElement>(null)
  const titleRef   = useRef<HTMLHeadingElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const cueRef     = useRef<HTMLDivElement>(null)

  /* ── HUD refs ───────────────────────────────────────────────── */
  const hudAboveRef = useRef<HTMLDivElement>(null)
  const hudBelowRef = useRef<HTMLDivElement>(null)

  /* ── Underwater particle canvas (starts hidden, GSAP reveals) ─ */
  useParticles(
    heroCanvasRef,
    heroRef as React.RefObject<HTMLElement | null>,
    60
  )

  /* ── GSAP scroll animation ──────────────────────────────────── */
  useGSAP((gsap) => {
    const hero        = heroRef.current
    const layerImg    = layerIcebergRef.current
    const iceImg      = iceImgRef.current
    const chunkL      = chunkLRef.current
    const chunkR      = chunkRRef.current
    const skyFade     = skyFadeRef.current
    const oceanTint   = oceanTintRef.current
    const bottomBlend = bottomBlendRef.current
    const heroCanvas  = heroCanvasRef.current
    const banner      = bannerRef.current
    const titleEl     = titleRef.current
    const taglineEl   = taglineRef.current
    const cueEl       = cueRef.current
    const hudAbove    = hudAboveRef.current
    const hudBelow    = hudBelowRef.current

    if (!hero || !layerImg || !iceImg || !chunkL || !chunkR) return

    function init() {
      const vw = window.innerWidth
      const vh = window.innerHeight

      const natW = iceImg!.naturalWidth  || 1920
      const natH = iceImg!.naturalHeight || 1080
      const imgH = vw / (natW / natH)

      // Waterline is at 47% of the composite image height
      const waterlineY = imgH * 0.47
      const startY     = vh - waterlineY          // Phase 1: waterline at viewport bottom
      const endY       = vh * 0.43 - waterlineY   // Phase 2 end: waterline at 43% down

      const clW = chunkL!.offsetWidth || 200
      const crW = chunkR!.offsetWidth || 160

      /* ── Initial states ──────────────────────────────────── */
      gsap.set(layerImg,    { y: startY })
      gsap.set(skyFade,     { opacity: 1 })
      gsap.set(oceanTint,   { opacity: 0 })
      gsap.set(bottomBlend, { opacity: 0 })
      gsap.set(heroCanvas,  { opacity: 0 })
      gsap.set(titleEl,     { color: '#0a324c' })
      gsap.set([hudAbove, hudBelow], { opacity: 0, y: 10 })
      gsap.set(cueEl,   { opacity: 0.65 })
      gsap.set(banner,  { y: vh * 0.13 })

      // Chunks start centred over the iceberg peak, hugging each side
      gsap.set(chunkL, {
        xPercent: -50, x: -(clW * 0.55),
        y: 0, rotation: -2, scale: 1, opacity: 0.8,
      })
      gsap.set(chunkR, {
        xPercent: -50, x: crW * 0.55,
        y: 0, rotation:  2, scale: 1, opacity: 0.8,
      })

      /* ── Master timeline ──────────────────────────────────── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start:   'top top',
          end:     '+=260%',
          scrub:   1.2,
          pin:     true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      /* Phase 2 — Ocean reveal (0 → 1.0) */
      tl.to(layerImg,    { y: endY,    ease: 'power1.inOut', duration: 1    }, 0)
      tl.to(skyFade,     { opacity: 0, ease: 'power2.in',    duration: 0.7  }, 0)
      tl.to(oceanTint,   { opacity: 1, ease: 'power1.inOut', duration: 1    }, 0)
      tl.to(bottomBlend, { opacity: 1, ease: 'power1.inOut', duration: 1    }, 0)
      tl.to(heroCanvas,  { opacity: 1, ease: 'power1.in',    duration: 0.8  }, 0.2)
      tl.to(banner,      { y: vh * 0.54, ease: 'power1.inOut', duration: 1  }, 0)
      tl.to(titleEl,     { color: '#ffffff', ease: 'power1.inOut', duration: 0.75 }, 0.1)
      tl.to(taglineEl,   { color: 'rgba(200,232,242,0.85)', duration: 0.5   }, 0.1)
      tl.to(cueEl,       { opacity: 0, y: 6, duration: 0.2  }, 0)
      tl.to(hudAbove,    { opacity: 1, y: 0, ease: 'power2.out', duration: 0.35 }, 0.5)
      tl.to(hudBelow,    { opacity: 1, y: 0, ease: 'power2.out', duration: 0.35 }, 0.6)

      /* Phase 3 — Chunks split apart (1.1 → 2.1) */
      tl.to(chunkL, {
        x: -(vw * 0.38), y: vh * 0.08,
        rotation: -8, scale: 0.9, opacity: 1,
        ease: 'power2.inOut', duration: 1,
      }, 1.1)
      tl.to(chunkR, {
        x: vw * 0.36, y: vh * 0.06,
        rotation: 7, scale: 0.85, opacity: 1,
        ease: 'power2.inOut', duration: 1,
      }, 1.1)
      tl.to(layerImg, {
        y: endY - vh * 0.04,
        ease: 'power1.inOut', duration: 1,
      }, 1.1)
    }

    if (iceImg.complete && iceImg.naturalWidth > 0) {
      init()
    } else {
      iceImg.addEventListener('load', init, { once: true })
    }

    const handleResize = () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
      init()
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <HudAbove ref={hudAboveRef} />
      <HudBelow ref={hudBelowRef} />

      <section
        ref={heroRef}
        id="hero"
        aria-label="Introduction"
        className="relative w-full overflow-hidden"
        style={{ height: '100vh', background: 'var(--sky)' }}
      >
        {/* sky fill behind the image */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1]"
          style={{ background: 'var(--sky)' }}
        />

        {/* underwater particle canvas — fades in on scroll */}
        <canvas
          ref={heroCanvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
          style={{ opacity: 0 }}
        />

        {/* composite iceberg image + ice chunks */}
        <div
          ref={layerIcebergRef}
          aria-hidden="true"
          className="absolute top-0 left-0 w-full z-[3]"
          style={{ willChange: 'transform' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={iceImgRef}
            src="/images/iceberg-hero-bg.jpg"
            alt=""
            className="block w-full h-auto select-none"
            draggable={false}
          />

          {/* Left chunk */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={chunkLRef}
            src="/images/ice-chunk-large.png"
            alt=""
            className="absolute object-contain select-none"
            draggable={false}
            style={{
              width:   'clamp(150px,20vw,270px)',
              top:     '40%',
              left:    '50%',
              filter:  'drop-shadow(0 10px 24px rgba(0,0,0,0.22))',
              willChange: 'transform',
            }}
          />

          {/* Right chunk */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={chunkRRef}
            src="/images/ice-chunk-small.png"
            alt=""
            className="absolute object-contain select-none"
            draggable={false}
            style={{
              width:   'clamp(120px,16vw,210px)',
              top:     '38%',
              left:    '50%',
              filter:  'drop-shadow(0 10px 24px rgba(0,0,0,0.22))',
              willChange: 'transform',
            }}
          />
        </div>

        {/* sky-colour gradient — masks the image's own sky/clouds */}
        <div
          ref={skyFadeRef}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-[4]"
          style={{
            background: `linear-gradient(
              to bottom,
              rgba(var(--sky-rgb),1)    0%,
              rgba(var(--sky-rgb),1)    28%,
              rgba(var(--sky-rgb),0.88) 38%,
              rgba(var(--sky-rgb),0.5)  48%,
              rgba(var(--sky-rgb),0.12) 57%,
              rgba(var(--sky-rgb),0)    65%
            )`,
          }}
        />

        {/* dark underwater tint — reveals as iceberg descends */}
        <div
          ref={oceanTintRef}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-[5]"
          style={{
            opacity: 0,
            background: `linear-gradient(
              to bottom,
              transparent           0%,
              transparent           36%,
              rgba(2,20,40,0.28)    48%,
              rgba(2,16,35,0.70)    64%,
              rgba(2,10,28,0.92)    100%
            )`,
          }}
        />

        {/* gradient seam into the next section */}
        <div
          ref={bottomBlendRef}
          aria-hidden="true"
          className="absolute bottom-0 left-0 w-full pointer-events-none z-[6]"
          style={{
            height:  '35%',
            opacity: 0,
            background: `linear-gradient(
              to bottom,
              transparent        0%,
              rgba(2,14,30,0.5)  40%,
              rgba(2,14,30,0.85) 70%,
              var(--deep)        100%
            )`,
          }}
        />

        {/* L7 — Text banner */}
        <div
          ref={bannerRef}
          className="absolute left-1/2 -translate-x-1/2 text-center
                     flex flex-col items-center pointer-events-none z-[10]"
          style={{
            width:       '90%',
            maxWidth:    '860px',
            willChange:  'transform',
          }}
        >
          <p
            ref={taglineRef}
            className="font-bold uppercase"
            style={{
              fontSize:      'clamp(0.6rem,1.2vw,0.8rem)',
              letterSpacing: '0.3em',
              color:         'var(--text-mid)',
              marginBottom:  '1.2rem',
            }}
          >
            ARCTIC OCEAN &bull; 80% HIDDEN
          </p>

          <h1
            ref={titleRef}
            className="font-[family-name:var(--font-disp)] font-extrabold"
            style={{
              fontSize:      'clamp(2rem,6vw,5.2rem)',
              lineHeight:    1.08,
              letterSpacing: '-0.025em',
              color:         'var(--text-dark)',
              marginBottom:  '1.6rem',
            }}
          >
            Transforming<br />
            Business<br />
            <span style={{ color: 'var(--teal)' }}>Beyond The Surface</span>
          </h1>

          <div
            ref={cueRef}
            className="flex items-center"
            style={{ gap: '1.2rem', opacity: 0.65 }}
            aria-hidden="true"
          >
            <span
              className="block h-px"
              style={{ width: 'clamp(24px,5vw,56px)', background: 'var(--text-mid)' }}
            />
            <span
              className="font-bold uppercase"
              style={{
                fontSize:      'clamp(0.55rem,0.9vw,0.68rem)',
                letterSpacing: '0.22em',
                color:         'var(--text-mid)',
              }}
            >
              SCROLL TO GO BENEATH
            </span>
            <span
              className="block h-px"
              style={{ width: 'clamp(24px,5vw,56px)', background: 'var(--text-mid)' }}
            />
          </div>
        </div>
      </section>
    </>
  )
}
