'use client'

import { forwardRef, useRef } from 'react'
import type { FeatureSectionData } from '@/types'
import { useParticles } from '@/hooks/useParticles'

interface Props {
  data:     FeatureSectionData
  slotRef:  React.RefObject<HTMLDivElement | null>
  labelRef: React.RefObject<HTMLParagraphElement | null>
  lineRefs: React.RefObject<HTMLSpanElement | null>[]
  cueRef:   React.RefObject<HTMLDivElement | null>
}

const FeatureSection = forwardRef<HTMLElement, Props>(
  ({ data, slotRef, labelRef, lineRefs, cueRef }, forwardedRef) => {
    const internalRef  = useRef<HTMLElement>(null)
    const sectionRef   = (forwardedRef as React.RefObject<HTMLElement>) ?? internalRef
    const canvasRef    = useRef<HTMLCanvasElement>(null)
    const containerRef = sectionRef as React.RefObject<HTMLElement | null>

    useParticles(canvasRef, containerRef, 70)

    const isLeft = data.align === 'left'

    return (
      <section
        ref={sectionRef}
        id={data.id}
        aria-label={data.lines.join(' ')}
        className="relative w-full overflow-hidden"
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
        {/* Particle canvas */}
        <canvas ref={canvasRef} aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none z-0" />

        {/* Radial glow */}
        <div aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                     pointer-events-none z-[1]"
          style={{
            width: '80vw', height: '70vh',
            background: `radial-gradient(ellipse at center,
              rgba(20,100,160,0.28) 0%,
              rgba(8,50,90,0.12) 50%,
              transparent 75%
            )`,
          }}
        />

        {/*
          Layout:
          - Desktop (≥768px): side-by-side row  — text 50%, slot 50%
          - Mobile  (<768px): stacked column     — chunk on top, text below
        */}
        <div
          className="relative z-[2] w-full h-full
                     flex flex-col items-center justify-center
                     md:flex-row md:items-center md:justify-between"
          style={{
            padding: 'clamp(3rem, 8vw, 5rem) clamp(1.5rem, 6vw, 9rem)',
            gap: 'clamp(2rem, 4vw, 5rem)',
          }}
        >
          {/* Mobile-only chunk image — static, centred, no GSAP */}
          <div
            className="block md:hidden flex-shrink-0 pointer-events-none"
            style={{
              order: isLeft ? 2 : 1,
              width: 'min(72vw, 320px)',
            }}
            aria-hidden="true"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/ice-chunk-large.png"
              alt=""
              className="w-full h-auto object-contain select-none"
              draggable={false}
              style={{
                filter: `drop-shadow(0 0 32px rgba(30,130,200,0.5))
                         drop-shadow(0 16px 40px rgba(0,0,0,0.5))`,
              }}
            />
          </div>
          {/* Text block */}
          <div
            className="flex flex-col w-full text-center
                       md:max-w-[50%]"
            style={{
              order: isLeft ? 1 : 2,
              alignItems: 'center',
            }}
          >
            <p
              ref={labelRef}
              className="font-medium uppercase w-full"
              style={{
                fontSize:      'clamp(0.65rem, 2vw, 0.72rem)',
                letterSpacing: '0.25em',
                color:         'rgba(160,215,240,0.65)',
                marginBottom:  '1.2rem',
                opacity: 0,
                textAlign: 'center',
              }}
            >
              {data.label}
            </p>

            <h2
              className="font-[family-name:var(--font-disp)] font-bold text-white w-full"
              style={{
                fontSize:      'clamp(2rem, 6vw, 4.2rem)',
                lineHeight:    1.12,
                letterSpacing: '-0.01em',
                marginBottom:  '1.8rem',
                textAlign:     'center',
              }}
            >
              {data.lines.map((line, i) => (
                <span key={i} className="block" style={{ overflow: 'hidden' }}>
                  <span
                    ref={lineRefs[i]}
                    className="block will-change-transform"
                    style={{
                      opacity: 0,
                      color: i === data.lines.length - 1 ? 'var(--teal)' : 'inherit',
                    }}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h2>

            <div
              ref={cueRef}
              className="flex items-center justify-center w-full"
              style={{
                gap:     '0.8rem',
                opacity: 0,
                flexDirection: isLeft ? 'row' : 'row-reverse',
              }}
              aria-hidden="true"
            >
              <span className="block h-px flex-shrink-0"
                style={{ width: 'clamp(16px,4vw,48px)', background: 'rgba(160,215,240,0.5)' }} />
              <span className="font-semibold uppercase"
                style={{
                  fontSize:      'clamp(0.6rem, 1.8vw, 0.65rem)',
                  letterSpacing: '0.18em',
                  color:         'rgba(160,215,240,0.7)',
                  whiteSpace:    'nowrap',
                }}
              >
                {data.cueText}
              </span>
              <span className="block h-px flex-shrink-0"
                style={{ width: 'clamp(16px,4vw,48px)', background: 'rgba(160,215,240,0.5)' }} />
            </div>
          </div>

          {/* Slot placeholder — hidden on mobile (chunk is fixed-position anyway) */}
          <div
            ref={slotRef}
            aria-hidden="true"
            className="relative z-[2] flex-shrink-0 pointer-events-none
                       hidden md:block"
            style={{
              order:  isLeft ? 2 : 1,
              width:  'clamp(220px, 36vw, 520px)',
              height: 'clamp(260px, 45vw, 600px)',
            }}
          />
        </div>
      </section>
    )
  }
)
FeatureSection.displayName = 'FeatureSection'

export default FeatureSection
