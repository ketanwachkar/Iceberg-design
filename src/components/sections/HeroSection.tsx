'use client'

import { useRef } from 'react'
import { useGSAP }      from '@/hooks/useGSAP'
import { useParticles } from '@/hooks/useParticles'
import { HudAbove, HudBelow } from '@/components/ui/HudLabels'
import { ScrollTrigger } from '@/lib/gsap'

export default function HeroSection() {
  const heroRef         = useRef<HTMLElement>(null)
  const layerIcebergRef = useRef<HTMLDivElement>(null)
  const iceImgRef       = useRef<HTMLImageElement>(null)
  const chunkLRef       = useRef<HTMLImageElement>(null)
  const chunkRRef       = useRef<HTMLImageElement>(null)
  const skyFadeRef      = useRef<HTMLDivElement>(null)
  const oceanTintRef    = useRef<HTMLDivElement>(null)
  const bottomBlendRef  = useRef<HTMLDivElement>(null)
  const heroCanvasRef   = useRef<HTMLCanvasElement>(null)
  const bannerRef       = useRef<HTMLDivElement>(null)
  const titleRef        = useRef<HTMLHeadingElement>(null)
  const taglineRef      = useRef<HTMLParagraphElement>(null)
  const cueRef          = useRef<HTMLDivElement>(null)
  const hudAboveRef     = useRef<HTMLDivElement>(null)
  const hudBelowRef     = useRef<HTMLDivElement>(null)

  useParticles(heroCanvasRef, heroRef as React.RefObject<HTMLElement | null>, 60)

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
      const isMobile = vw < 768

      const natW = iceImg!.naturalWidth  || 1920
      const natH = iceImg!.naturalHeight || 1080
      // Image is 100vw × 100dvh with object-fit:cover, anchored top.
      // Scale is width-driven: rendered height = natH × (vw / natW)
      const scaleFactor  = vw / natW
      const renderedImgH = natH * scaleFactor
      const waterlineY   = renderedImgH * 0.47   // waterline px from top of rendered image

      let startY: number
      let endY:   number

      if (isMobile) {
        startY = 0                              // mountain fills screen from top
        endY   = vh * 0.50 - waterlineY        // scroll up to reveal underwater zone
      } else {
        startY = vh - waterlineY               // waterline at viewport bottom initially
        endY   = vh * 0.43 - waterlineY        // waterline rises to 43% on scroll
      }

      const clW = chunkL!.offsetWidth || 150
      const crW = chunkR!.offsetWidth || 120

      // Banner base — sits in the top quarter of the viewport above the mountain
      const bannerBaseY = isMobile ? vh * 0.06 : vh * 0.13
      // Phase 2 destination — floats into the underwater zone
      const bannerEndY  = isMobile ? vh * 0.40 : vh * 0.54

      /* Initial states */
      gsap.set(layerImg,    { y: startY })
      gsap.set(skyFade,     { opacity: 1 })
      gsap.set(oceanTint,   { opacity: 0 })
      gsap.set(bottomBlend, { opacity: 0 })
      gsap.set(heroCanvas,  { opacity: 0 })
      gsap.set(titleEl,     { color: '#0a324c' })
      gsap.set([hudAbove, hudBelow], { opacity: 0, y: 10 })
      gsap.set(cueEl,   { opacity: 0.65 })
      gsap.set(banner,  { y: bannerBaseY })

      // On mobile reduce the initial chunk offset so they stay centred
      const chunkXOffset = isMobile ? 0.3 : 0.55
      gsap.set(chunkL, {
        xPercent: -50, x: -(clW * chunkXOffset),
        y: 0, rotation: -2, scale: 1, opacity: isMobile ? 0 : 0.8,
      })
      gsap.set(chunkR, {
        xPercent: -50, x: crW * chunkXOffset,
        y: 0, rotation:  2, scale: 1, opacity: isMobile ? 0 : 0.8,
      })

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

      // Phase 2 — Ocean reveal
      tl.to(layerImg,    { y: endY,         ease: 'power1.inOut', duration: 1    }, 0)
      tl.to(skyFade,     { opacity: 0,       ease: 'power2.in',    duration: 0.7  }, 0)
      tl.to(oceanTint,   { opacity: 1,       ease: 'power1.inOut', duration: 1    }, 0)
      tl.to(bottomBlend, { opacity: 1,       ease: 'power1.inOut', duration: 1    }, 0)
      tl.to(heroCanvas,  { opacity: 1,       ease: 'power1.in',    duration: 0.8  }, 0.2)
      tl.to(banner,      { y: bannerEndY,    ease: 'power1.inOut', duration: 1    }, 0)
      tl.to(titleEl,     { color: '#ffffff', ease: 'power1.inOut', duration: 0.75 }, 0.1)
      tl.to(taglineEl,   { color: 'rgba(200,232,242,0.85)', duration: 0.5         }, 0.1)
      tl.to(cueEl,       { opacity: 0, y: 6, duration: 0.2  }, 0)
      tl.to(hudAbove,    { opacity: 1, y: 0, ease: 'power2.out', duration: 0.35 }, 0.5)
      tl.to(hudBelow,    { opacity: 1, y: 0, ease: 'power2.out', duration: 0.35 }, 0.6)

      // Phase 3 — Chunks split (hidden on mobile — not enough horizontal space)
      if (!isMobile) {
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
      }
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
        style={{ height: '100dvh', background: 'var(--sky)' }}
      >
        {/* sky fill */}
        <div aria-hidden="true" className="absolute inset-0 z-[1]"
          style={{ background: 'var(--sky)' }} />

        {/* particle canvas */}
        <canvas ref={heroCanvasRef} aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
          style={{ opacity: 0 }} />

        {/* composite iceberg image + chunks */}
        <div ref={layerIcebergRef} aria-hidden="true"
          className="absolute top-0 left-0 w-full z-[3] overflow-hidden"
          style={{ willChange: 'transform' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={iceImgRef} src="/images/iceberg-hero-bg.jpg" alt=""
            className="block select-none"
            draggable={false}
            style={{
              /*
               * Fill the full viewport on all screen sizes.
               * object-fit: cover scales up to fill width AND height.
               * object-position: center top anchors the crop to the top
               * so the mountain peak is always visible, excess cropped from bottom.
               */
              display:         'block',
              width:           '100vw',
              height:          '100dvh',
              objectFit:       'cover',
              objectPosition:  'center top',
              maxWidth:        'none',
            }}
          />

          {/* Left chunk — hidden on mobile via opacity in init() */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={chunkLRef} src="/images/ice-chunk-large.png" alt=""
            className="absolute object-contain select-none"
            draggable={false}
            style={{
              width: 'clamp(100px,14vw,270px)',
              top: '40%', left: '50%',
              filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.22))',
              willChange: 'transform',
            }}
          />

          {/* Right chunk */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={chunkRRef} src="/images/ice-chunk-small.png" alt=""
            className="absolute object-contain select-none"
            draggable={false}
            style={{
              width: 'clamp(80px,11vw,210px)',
              top: '38%', left: '50%',
              filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.22))',
              willChange: 'transform',
            }}
          />
        </div>

        {/* sky-colour gradient — thin blend at the top edges only.
            The image mountain is the main visual; we only mask the very
            top strip where the image's own sky meets the page background. */}
        <div ref={skyFadeRef} aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-[4]"
          style={{
            background: `linear-gradient(
              to bottom,
              rgba(var(--sky-rgb),1)    0%,
              rgba(var(--sky-rgb),0.6)  12%,
              rgba(var(--sky-rgb),0.2)  22%,
              rgba(var(--sky-rgb),0)    32%
            )`,
          }}
        />

        {/* ocean tint */}
        <div ref={oceanTintRef} aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-[5]"
          style={{
            opacity: 0,
            background: `linear-gradient(
              to bottom,
              transparent        0%,
              transparent        36%,
              rgba(2,20,40,0.28) 48%,
              rgba(2,16,35,0.70) 64%,
              rgba(2,10,28,0.92) 100%
            )`,
          }}
        />

        {/* bottom blend */}
        <div ref={bottomBlendRef} aria-hidden="true"
          className="absolute bottom-0 left-0 w-full pointer-events-none z-[6]"
          style={{
            height: '35%', opacity: 0,
            background: `linear-gradient(
              to bottom,
              transparent        0%,
              rgba(2,14,30,0.5)  40%,
              rgba(2,14,30,0.85) 70%,
              var(--deep)        100%
            )`,
          }}
        />

        {/* Text banner */}
        <div
          ref={bannerRef}
          className="absolute top-0 left-1/2 -translate-x-1/2
                     w-[92%] max-w-[860px] text-center
                     flex flex-col items-center pointer-events-none z-[10]"
          style={{ willChange: 'transform' }}
        >
          <p
            ref={taglineRef}
            className="font-bold uppercase"
            style={{
              fontSize: 'clamp(0.65rem, 2.5vw, 0.8rem)',
              letterSpacing: '0.25em',
              color: 'var(--text-mid)',
              marginBottom: '0.9rem',
            }}
          >
            ARCTIC OCEAN &bull; 80% HIDDEN
          </p>

          <h1
            ref={titleRef}
            className="font-[family-name:var(--font-disp)] font-extrabold"
            style={{
              fontSize:      'clamp(2.2rem, 8vw, 5.2rem)',
              lineHeight:    1.08,
              letterSpacing: '-0.02em',
              color:         'var(--text-dark)',
              marginBottom:  '1.2rem',
            }}
          >
            Transforming<br />
            Business<br />
            <span style={{ color: 'var(--teal)' }}>Beyond The Surface</span>
          </h1>

          <div
            ref={cueRef}
            className="flex items-center"
            style={{ gap: '1rem', opacity: 0.65 }}
            aria-hidden="true"
          >
            <span className="block h-px"
              style={{ width: 'clamp(20px,4vw,56px)', background: 'var(--text-mid)' }} />
            <span className="font-bold uppercase"
              style={{
                fontSize: 'clamp(0.6rem, 2vw, 0.68rem)',
                letterSpacing: '0.18em',
                color: 'var(--text-mid)',
              }}
            >
              SCROLL TO GO BENEATH
            </span>
            <span className="block h-px"
              style={{ width: 'clamp(20px,4vw,56px)', background: 'var(--text-mid)' }} />
          </div>
        </div>
      </section>
    </>
  )
}
