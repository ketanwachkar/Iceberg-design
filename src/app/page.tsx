'use client'

/**
 * Page — root composition.
 *
 * Sections:
 *   1. HeroSection       pinned iceberg reveal + chunk split
 *   2. DeepSection       "TALENT RUNS DEEP" word-zoom
 *   3. FeatureSection A  text left, chunk rises bottom-right
 *   4. FeatureSection B  text right, chunk glides right→left
 *
 * TravellingChunk is a fixed-position element driven across A + B
 * by its own internal ScrollTriggers (reads slot positions live).
 */

import { useRef } from 'react'
import HeroSection     from '@/components/sections/HeroSection'
import DeepSection     from '@/components/sections/DeepSection'
import FeatureSection  from '@/components/sections/FeatureSection'
import TravellingChunk from '@/components/sections/TravellingChunk'
import { useFeatureTextAnimation } from '@/hooks/useFeatureTextAnimation'
import { FEATURE_SECTIONS } from '@/constants'

export default function Page() {

  /* ── Section A refs ─────────────────────────────────────────── */
  const secARef   = useRef<HTMLElement>(null)
  const slotARef  = useRef<HTMLDivElement>(null)
  const labelARef = useRef<HTMLParagraphElement>(null)
  const lineA0    = useRef<HTMLSpanElement>(null)
  const lineA1    = useRef<HTMLSpanElement>(null)
  const lineA2    = useRef<HTMLSpanElement>(null)
  const cueARef   = useRef<HTMLDivElement>(null)

  /* ── Section B refs ─────────────────────────────────────────── */
  const secBRef   = useRef<HTMLElement>(null)
  const slotBRef  = useRef<HTMLDivElement>(null)
  const labelBRef = useRef<HTMLParagraphElement>(null)
  const lineB0    = useRef<HTMLSpanElement>(null)
  const lineB1    = useRef<HTMLSpanElement>(null)
  const lineB2    = useRef<HTMLSpanElement>(null)
  const cueBRef   = useRef<HTMLDivElement>(null)

  /* ── Travelling chunk ref ───────────────────────────────────── */
  const chunkRef = useRef<HTMLDivElement>(null)

  /* ── Text animations ────────────────────────────────────────── */
  useFeatureTextAnimation({
    sectionRef: secARef,
    labelRef:   labelARef,
    lineRefs:   [lineA0, lineA1, lineA2],
    cueRef:     cueARef,
  })

  useFeatureTextAnimation({
    sectionRef: secBRef,
    labelRef:   labelBRef,
    lineRefs:   [lineB0, lineB1, lineB2],
    cueRef:     cueBRef,
  })

  return (
    <main>
      <HeroSection />

      <DeepSection />

      <FeatureSection
        ref={secARef}
        data={FEATURE_SECTIONS[0]}
        slotRef={slotARef}
        labelRef={labelARef}
        lineRefs={[lineA0, lineA1, lineA2]}
        cueRef={cueARef}
      />

      <FeatureSection
        ref={secBRef}
        data={FEATURE_SECTIONS[1]}
        slotRef={slotBRef}
        labelRef={labelBRef}
        lineRefs={[lineB0, lineB1, lineB2]}
        cueRef={cueBRef}
      />

      <TravellingChunk
        ref={chunkRef}
        slotARef={slotARef}
        slotBRef={slotBRef}
        sectionARef={secARef}
        sectionBRef={secBRef}
      />
    </main>
  )
}
