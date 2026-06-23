'use client'

import { useRef } from 'react'
import { useGSAP }      from '@/hooks/useGSAP'
import { useParticles } from '@/hooks/useParticles'

export default function DeepSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const labelRef   = useRef<HTMLParagraphElement>(null)
  const word0Ref   = useRef<HTMLSpanElement>(null)
  const word1Ref   = useRef<HTMLSpanElement>(null)
  const word2Ref   = useRef<HTMLSpanElement>(null)
  const wordRefs   = [word0Ref, word1Ref, word2Ref]

  useParticles(canvasRef, sectionRef as React.RefObject<HTMLElement | null>, 85)

  useGSAP((gsap) => {
    const section = sectionRef.current
    const label   = labelRef.current
    const words   = wordRefs
      .map(r => r.current)
      .filter((el): el is HTMLSpanElement => el !== null)

    if (!section || words.length === 0) return

    gsap.set(words, {
      opacity: 0, scale: 0.35, y: 28,
      filter: 'blur(8px)', transformOrigin: 'center bottom',
    })
    if (label) gsap.set(label, { opacity: 0, y: 12 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        // Start later on mobile so the animation fires while section is in view
        start: 'top 95%',
        end:   'center 50%',
        scrub: 1.0,
        invalidateOnRefresh: true,
      },
    })

    tl.fromTo(
      words,
      { opacity: 0, scale: 0.35, y: 28, filter: 'blur(8px)', transformOrigin: 'center bottom' },
      { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', ease: 'power2.out', duration: 0.6, stagger: 0.12 },
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
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{
        minHeight: '100dvh',
        background: `radial-gradient(
          ellipse 90% 70% at 50% 55%,
          var(--deep-light) 0%,
          #083858           30%,
          var(--deep-mid)   60%,
          var(--deep)       100%
        )`,
      }}
    >
      {/* Top blend */}
      <div aria-hidden="true"
        className="absolute top-0 left-0 w-full h-[30%] pointer-events-none z-[2]"
        style={{
          background: `linear-gradient(to bottom, var(--deep) 0%, rgba(2,14,30,0.7) 50%, transparent 100%)`,
        }}
      />

      {/* Particle canvas */}
      <canvas ref={canvasRef} aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none z-[1]" />

      {/* Radial glow */}
      <div aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   pointer-events-none z-[2]"
        style={{
          width: '90vw', height: '70vh',
          background: `radial-gradient(ellipse at center,
            rgba(20,100,160,0.28) 0%,
            rgba(8,50,90,0.12) 50%,
            transparent 75%
          )`,
        }}
      />

      {/* Content */}
      <div className="relative z-[3] text-center flex flex-col items-center px-6"
        style={{ gap: 'clamp(0.8rem, 2vw, 1.4rem)' }}
      >
        <p
          ref={labelRef}
          className="font-medium uppercase"
          style={{
            fontSize: 'clamp(0.65rem, 2vw, 0.75rem)',
            letterSpacing: '0.3em',
            color: 'rgba(160,215,240,0.65)',
          }}
        >
          -40 M &nbsp;&bull;&nbsp; RECRUITMENT
        </p>

        <h2
          className="font-[family-name:var(--font-disp)] font-light
                     text-white leading-none uppercase
                     flex flex-wrap justify-center"
          style={{
            fontSize: 'clamp(2.4rem, 10vw, 6.8rem)',
            letterSpacing: 'clamp(0.05em, 2vw, 0.16em)',
            gap: '0.3em',
          }}
        >
          <span className="sr-only">TALENT RUNS DEEP</span>
          <span ref={word0Ref} aria-hidden="true" className="inline-block will-change-transform">TALENT</span>
          <span ref={word1Ref} aria-hidden="true" className="inline-block will-change-transform">RUNS</span>
          <span ref={word2Ref} aria-hidden="true" className="inline-block will-change-transform">DEEP</span>
        </h2>
      </div>
    </section>
  )
}
