/**
 * useFeatureTextAnimation
 * Drives the scroll-based text reveal for a single feature section.
 *
 * On scroll: label fades up, title lines stagger up one by one, cue fades in.
 * All animations use live onUpdate (no scrub timeline) so they're reliable
 * regardless of section height or viewport size.
 */

import { useEffect } from 'react'
import { initGSAP, ScrollTrigger } from '@/lib/gsap'

interface Refs {
  sectionRef: React.RefObject<HTMLElement | null>
  labelRef:   React.RefObject<HTMLParagraphElement | null>
  lineRefs:   React.RefObject<HTMLSpanElement | null>[]
  cueRef:     React.RefObject<HTMLDivElement | null>
}

export function useFeatureTextAnimation(refs: Refs): void {
  const { sectionRef, labelRef, lineRefs, cueRef } = refs

  useEffect(() => {
    const gsap    = initGSAP()
    const section = sectionRef.current
    const label   = labelRef.current
    const lines   = lineRefs.map(r => r.current).filter(Boolean) as HTMLSpanElement[]
    const cue     = cueRef.current

    if (!section || lines.length === 0) return

    /* Set initial hidden states */
    gsap.set(lines, { y: 36, opacity: 0 })
    if (label) gsap.set(label, { y: 14, opacity: 0 })
    if (cue)   gsap.set(cue,   { opacity: 0 })

    const st = ScrollTrigger.create({
      trigger: section,
      start:   'top 65%',
      end:     'top 5%',
      scrub:   1.0,
      invalidateOnRefresh: true,
      onUpdate(self) {
        const p = self.progress

        /* Label slides up */
        if (label) {
          const lp = Math.min(1, p * 5)
          gsap.set(label, { opacity: lp, y: 14 * (1 - lp), overwrite: 'auto' })
        }

        /* Title lines stagger */
        lines.forEach((li, i) => {
          const tp = Math.max(0, Math.min(1, (p - i * 0.15) * 6))
          gsap.set(li, { opacity: tp, y: 36 * (1 - tp), overwrite: 'auto' })
        })

        /* Cue fades in last */
        if (cue) {
          const cp = Math.max(0, Math.min(1, (p - 0.55) * 5))
          gsap.set(cue, { opacity: cp * 0.65, overwrite: 'auto' })
        }
      },
    })

    return () => st.kill()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
