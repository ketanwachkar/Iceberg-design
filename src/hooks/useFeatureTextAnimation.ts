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

    gsap.set(lines, { y: 36, opacity: 0 })
    if (label) gsap.set(label, { y: 14, opacity: 0 })
    if (cue)   gsap.set(cue,   { opacity: 0 })

    const st = ScrollTrigger.create({
      trigger: section,
      // Wider start window so mobile fires when section enters viewport
      start:   'top 90%',
      end:     'center 40%',
      scrub:   0.8,
      invalidateOnRefresh: true,
      onUpdate(self) {
        const p = self.progress

        if (label) {
          const lp = Math.min(1, p * 4)
          gsap.set(label, { opacity: lp, y: 14 * (1 - lp), overwrite: 'auto' })
        }

        lines.forEach((li, i) => {
          const tp = Math.max(0, Math.min(1, (p - i * 0.12) * 5))
          gsap.set(li, { opacity: tp, y: 36 * (1 - tp), overwrite: 'auto' })
        })

        if (cue) {
          const cp = Math.max(0, Math.min(1, (p - 0.55) * 4))
          gsap.set(cue, { opacity: cp * 0.65, overwrite: 'auto' })
        }
      },
    })

    return () => st.kill()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
