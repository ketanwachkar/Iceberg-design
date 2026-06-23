'use client'

/**
 * TravellingChunk
 * ============================================================
 * The single ice-chunk element that journeys across two feature
 * sections. Position: fixed so it floats above the page during
 * the entire scroll sequence.
 *
 * JOURNEY:
 *   Stage 1 — rises from below viewport into fs-a right slot
 *   Stage 2 — glides from fs-a slot → fs-b slot (right → left)
 *   Stage 3 — fades out as fs-b scrolls away
 *
 * All positioning is pixel-accurate via getBoundingClientRect()
 * read live on every onUpdate tick — no pre-computed values that
 * would break on resize.
 *
 * Props:
 *   slotARef  — invisible placeholder in FeatureSection A (right)
 *   slotBRef  — invisible placeholder in FeatureSection B (left)
 *   sectionARef — trigger element for stage 1
 *   sectionBRef — trigger element for stage 2 / 3
 */

import { forwardRef } from 'react'
import Image from 'next/image'
import { useGSAP } from '@/hooks/useGSAP'
import { ScrollTrigger, easeInOutCubic } from '@/lib/gsap'

interface Props {
  slotARef:    React.RefObject<HTMLDivElement | null>
  slotBRef:    React.RefObject<HTMLDivElement | null>
  sectionARef: React.RefObject<HTMLElement | null>
  sectionBRef: React.RefObject<HTMLElement | null>
}

const TravellingChunk = forwardRef<HTMLDivElement, Props>(
  ({ slotARef, slotBRef, sectionARef, sectionBRef }, ref) => {

    useGSAP((gsap) => {
      const chunk    = (ref as React.RefObject<HTMLDivElement>)?.current
      const slotA    = slotARef.current
      const slotB    = slotBRef.current
      const secA     = sectionARef.current
      const secB     = sectionBRef.current

      if (!chunk || !slotA || !slotB || !secA || !secB) return

      /* Initial state — hidden below viewport */
      gsap.set(chunk, { opacity: 0, rotation: 6 })

      /* ── Stage 1: rises from below into fs-a right slot ─── */
      ScrollTrigger.create({
        trigger: secA,
        start: 'top 110%',
        end:   'top -20%',
        scrub: 2.5,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const p    = easeInOutCubic(Math.min(self.progress, 1))
          const rect = slotA.getBoundingClientRect()
          const cx   = rect.left + rect.width  * 0.5
          const cy   = rect.top  + rect.height * 0.5
          const cw   = chunk.offsetWidth
          const ch   = chunk.offsetHeight

          gsap.set(chunk, {
            x:        cx - cw * 0.5,
            y:        cy - ch * 0.5 + (1 - p) * window.innerHeight * 1.1,
            opacity:  Math.min(1, self.progress * 3),
            rotation: 8 - 12 * p,          // 8deg → -4deg
            overwrite: 'auto',
          })
        },
      })

      /* ── Stage 2: glides right → left into fs-b left slot ─ */
      ScrollTrigger.create({
        trigger: secB,
        start: 'top 105%',
        end:   'top -20%',
        scrub: 2.5,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const p     = easeInOutCubic(Math.min(self.progress, 1))
          const rectA = slotA.getBoundingClientRect()
          const rectB = slotB.getBoundingClientRect()
          const ax = rectA.left + rectA.width  * 0.5
          const ay = rectA.top  + rectA.height * 0.5
          const bx = rectB.left + rectB.width  * 0.5
          const by = rectB.top  + rectB.height * 0.5
          const cw = chunk.offsetWidth
          const ch = chunk.offsetHeight

          gsap.set(chunk, {
            x:        ax + (bx - ax) * p - cw * 0.5,
            y:        ay + (by - ay) * p - ch * 0.5,
            rotation: -4 + (-10 * p),       // -4deg → -14deg (drifts & tilts left)
            opacity:  1,
            overwrite: 'auto',
          })
        },
      })

      /* ── Stage 3: fade out as fs-b scrolls away ─────────── */
      ScrollTrigger.create({
        trigger: secB,
        start: 'bottom 90%',
        end:   'bottom 10%',
        scrub: 2,
        onUpdate(self) {
          gsap.set(chunk, { opacity: 1 - self.progress, overwrite: 'auto' })
        },
      })
    }, [])

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[500] pointer-events-none will-change-transform"
        style={{ width: 'clamp(220px, 36vw, 520px)' }}
      >
        {/* Using <img> to match original; GSAP moves the wrapper div */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/ice-chunk-large.png"
          alt=""
          className="w-full h-auto object-contain select-none"
          draggable={false}
          style={{
            filter: `drop-shadow(0 0 40px rgba(30,130,200,0.5))
                     drop-shadow(0 20px 60px rgba(0,0,0,0.55))`,
          }}
        />
      </div>
    )
  }
)
TravellingChunk.displayName = 'TravellingChunk'

export default TravellingChunk
