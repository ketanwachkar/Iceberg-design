'use client'

/**
 * DeepSection
 * Full-viewport deep ocean section: "TALENT RUNS DEEP" word-zoom animation.
 * Words zoom in from scale(0.35) + blur, staggered, on scroll.
 */

import { useRef } from 'react'
import { useGSAP } from '@/hooks/useGSAP'
import { useParticles } from '@/hooks/useParticles'

const WORDS = ['TALENT', 'RUNS', 'DEEP'] as const

export default function DeepSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const labelRef   = useRef<HTMLParagraphElement>(null)

  // Pre-declare refs — hooks must not be inside callbacks or loops
  const word0Ref = useRef<HTMLSpanElement>(null)
  const word1Ref = useRef<HTMLSpanElement>(null)
  const word2Ref = useRef<HTMLSpanElement>(null)
  const wordRefs = [word0Ref, word1Ref, word2Ref]

  // Particle canvas
  useParticles(
    canvasRef,
    sectionRef as React.RefObject<HTMLElement | null>,
    85
  )

  // Scroll-driven word-zoom animation
  useGSAP((gsap) => {
    const section = sectionRef.current
    const label   = labelRef.current
    const words   = wordRefs
      .map(r => r.current)
      .filter((el): el is HTMLSpanElement => el !== null)

    if (!section || words.length === 0) return

    gsap.set(words, {
      opacity: 0,
      scale: 0.35,
      y: 28,
      filter: 'blur(8px)',
      transformOrigin: 'center bottom',
    })
    if (label) gsap.set(label, { opacity: 0, y: 12 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end:   'top 15%',
        scrub: 1.0,
        invalidateOnRefresh: true,
      },
    })

    tl.fromTo(
      words,
      {
        opacity: 0, scale: 0.35, y: 28,
        filter: 'blur(8px)', transformOrigin: 'center bottom',
      },
      {
        opacity: 1, scale: 1, y: 0, filter: 'blur(0px)',
        ease: 'power2.out', duration: 0.6, stagger: 0.12,
      },
      0
    )

    if (label) {
      tl.fromTo(
        label,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.35 },
        0.55
      )
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="deep-section"
      aria-label="Talent Runs Deep"
      className="relative w-full h-screen overflow-hidden flex items-center justify-center"
      style={{
        background: `radial-gradient(
          ellipse 90% 70% at 50% 55%,
          var(--deep-light) 0%,
          #083858           30%,
          var(--deep-mid)   60%,
          var(--deep)       100%
        )`,
      }}
    >
      {/* Top blend — seam from hero */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-full h-[30%] pointer-events-none z-[2]"
        style={{
          background: `linear-gradient(
            to bottom,
            var(--deep)        0%,
            rgba(2,14,30,0.7)  50%,
            transparent        100%
          )`,
        }}
      />

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
      />

      {/* Radial glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   w-[65vw] h-[65vh] pointer-events-none z-[2]"
        style={{
          background: `radial-gradient(
            ellipse at center,
            rgba(20,100,160,0.28) 0%,
            rgba(8,50,90,0.12)    50%,
            transparent           75%
          )`,
        }}
      />

      {/* Content */}
      <div className="relative z-[3] text-center flex flex-col items-center gap-4">
        <p
          ref={labelRef}
          className="text-[clamp(0.55rem,1vw,0.75rem)] font-medium
                     tracking-[0.38em] uppercase"
          style={{ color: 'rgba(160,215,240,0.65)' }}
        >
          -40 M &nbsp;&bull;&nbsp; RECRUITMENT
        </p>

        <h2
          className="font-[family-name:var(--font-disp)] font-light
                     text-[clamp(2.2rem,7vw,6.8rem)] tracking-[0.16em]
                     text-white leading-none uppercase
                     flex gap-[0.35em] flex-wrap justify-center"
        >
          {/* Accessible full text for screen readers */}
          <span className="sr-only">TALENT RUNS DEEP</span>

          {/* Animated word spans */}
          <span ref={word0Ref} aria-hidden="true" className="inline-block will-change-transform">TALENT</span>
          <span ref={word1Ref} aria-hidden="true" className="inline-block will-change-transform">RUNS</span>
          <span ref={word2Ref} aria-hidden="true" className="inline-block will-change-transform">DEEP</span>
        </h2>
      </div>
    </section>
  )
}
