'use client'

/**
 * HudLabels
 * The "20% / 80%" fixed overlay labels.
 * Rendered invisible initially — GSAP fades them in during Phase 2.
 * Passed forwardRefs so the Hero animation hook can target them.
 */

import { forwardRef } from 'react'

export const HudAbove = forwardRef<HTMLDivElement>((_, ref) => (
  <div
    ref={ref}
    id="hud-above"
    aria-hidden="true"
    className="fixed z-[150] flex flex-col pointer-events-none opacity-0
               top-[clamp(5rem,9vw,7rem)] right-[clamp(1.5rem,4vw,4rem)]
               items-end text-right text-[var(--text-dark)]"
  >
    <span
      className="font-[family-name:var(--font-disp)] font-extrabold leading-none
                 text-[clamp(2rem,4.5vw,3.5rem)] tracking-[-0.02em]"
    >
      20%
    </span>
    <span
      className="text-[clamp(0.5rem,0.85vw,0.68rem)] font-bold
                 tracking-[0.2em] opacity-75 mt-1"
    >
      VISIBLE ABOVE WATER
    </span>
  </div>
))
HudAbove.displayName = 'HudAbove'

export const HudBelow = forwardRef<HTMLDivElement>((_, ref) => (
  <div
    ref={ref}
    id="hud-below"
    aria-hidden="true"
    className="fixed z-[150] flex flex-col pointer-events-none opacity-0
               bottom-[clamp(2rem,4vw,4rem)] left-[clamp(1.5rem,4vw,4rem)]
               items-start text-white"
  >
    <span
      className="font-[family-name:var(--font-disp)] font-extrabold leading-none
                 text-[clamp(2rem,4.5vw,3.5rem)] tracking-[-0.02em]"
    >
      80%
    </span>
    <span
      className="text-[clamp(0.5rem,0.85vw,0.68rem)] font-bold
                 tracking-[0.2em] opacity-75 mt-1"
    >
      OPERATING BENEATH
    </span>
  </div>
))
HudBelow.displayName = 'HudBelow'
