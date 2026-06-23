'use client'

/**
 * FeatureSection
 * Deep-ocean section: text one side, invisible slot the other.
 * The slot is a placeholder div sized to match the travelling chunk.
 * Text animation is driven externally via useFeatureTextAnimation.
 */

import { forwardRef, useRef } from 'react'
import type { FeatureSectionData } from '@/types'
import { useParticles } from '@/hooks/useParticles'

interface Props {
  data:      FeatureSectionData
  slotRef:   React.RefObject<HTMLDivElement | null>
  labelRef:  React.RefObject<HTMLParagraphElement | null>
  lineRefs:  React.RefObject<HTMLSpanElement | null>[]
  cueRef:    React.RefObject<HTMLDivElement | null>
}

const FeatureSection = forwardRef<HTMLElement, Props>(
  ({ data, slotRef, labelRef, lineRefs, cueRef }, forwardedRef) => {
    // Always create the internal ref — never conditionally
    const internalRef  = useRef<HTMLElement>(null)
    const sectionRef   = (forwardedRef as React.RefObject<HTMLElement>) ?? internalRef
    const canvasRef    = useRef<HTMLCanvasElement>(null)

    // Cast so useParticles gets the right type
    const containerRef = sectionRef as React.RefObject<HTMLElement | null>
    useParticles(canvasRef, containerRef, 70)

    const isLeft = data.align === 'left'

    return (
      <section
        ref={sectionRef}
        id={data.id}
        aria-label={data.lines.join(' ')}
        className="relative w-full h-screen overflow-hidden
                   flex items-center justify-between"
        style={{
          gap:     '4vw',
          padding: '0 clamp(3rem, 8vw, 9rem)',
          background: `radial-gradient(
            ellipse 90% 70% at 50% 55%,
            var(--deep-light) 0%,
            #083858           30%,
            var(--deep-mid)   60%,
            var(--deep)       100%
          )`,
        }}
      >
        {/* Particle canvas */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />

        {/* Radial glow */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                     pointer-events-none z-[1]"
          style={{
            width: '65vw', height: '65vh',
            background: `radial-gradient(
              ellipse at center,
              rgba(20,100,160,0.28) 0%,
              rgba(8,50,90,0.12)    50%,
              transparent           75%
            )`,
          }}
        />

        {/* ── Text block ─────────────────────────────────────── */}
        <div
          className="relative z-[2] flex flex-col"
          style={{
            maxWidth: '48%',
            order:       isLeft ? 1 : 2,
            alignItems:  isLeft ? 'flex-start' : 'flex-end',
            textAlign:   isLeft ? 'left'        : 'right',
          }}
        >
          {/* Label */}
          <p
            ref={labelRef}
            className="font-medium uppercase"
            style={{
              fontSize:      'clamp(0.55rem,1vw,0.72rem)',
              letterSpacing: '0.3em',
              color:         'rgba(160,215,240,0.65)',
              marginBottom:  '1.4rem',
              opacity: 0,   /* GSAP reveals */
            }}
          >
            {data.label}
          </p>

          {/* Title — each line is a clipped reveal */}
          <h2
            className="font-[family-name:var(--font-disp)] font-bold text-white"
            style={{
              fontSize:      'clamp(1.8rem,4.5vw,4.2rem)',
              lineHeight:    1.12,
              letterSpacing: '-0.01em',
              marginBottom:  '2rem',
            }}
          >
            {data.lines.map((line, i) => (
              <span key={i} className="block" style={{ overflow: 'hidden' }}>
                <span
                  ref={lineRefs[i]}
                  className="block will-change-transform"
                  style={{
                    opacity: 0,   /* GSAP reveals */
                    color: i === data.lines.length - 1
                      ? 'var(--teal)'
                      : 'inherit',
                  }}
                >
                  {line}
                </span>
              </span>
            ))}
          </h2>

          {/* Cue */}
          <div
            ref={cueRef}
            className="flex items-center"
            style={{
              gap:     '1rem',
              opacity: 0,   /* GSAP reveals */
              flexDirection: isLeft ? 'row' : 'row-reverse',
            }}
            aria-hidden="true"
          >
            <span
              className="block h-px flex-shrink-0"
              style={{
                width:      'clamp(20px,4vw,48px)',
                background: 'rgba(160,215,240,0.5)',
              }}
            />
            <span
              className="font-semibold uppercase whitespace-nowrap"
              style={{
                fontSize:      'clamp(0.5rem,0.85vw,0.65rem)',
                letterSpacing: '0.22em',
                color:         'rgba(160,215,240,0.7)',
              }}
            >
              {data.cueText}
            </span>
            <span
              className="block h-px flex-shrink-0"
              style={{
                width:      'clamp(20px,4vw,48px)',
                background: 'rgba(160,215,240,0.5)',
              }}
            />
          </div>
        </div>

        {/* ── Invisible slot placeholder ────────────────────── */}
        <div
          ref={slotRef}
          aria-hidden="true"
          className="relative z-[2] flex-shrink-0 pointer-events-none"
          style={{
            order:  isLeft ? 2 : 1,
            width:  'clamp(220px,36vw,520px)',
            height: 'clamp(260px,45vw,600px)',
          }}
        />
      </section>
    )
  }
)
FeatureSection.displayName = 'FeatureSection'

export default FeatureSection
