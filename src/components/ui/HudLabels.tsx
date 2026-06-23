'use client'

import { forwardRef } from 'react'

export const HudAbove = forwardRef<HTMLDivElement>((_, ref) => (
  <div
    ref={ref}
    id="hud-above"
    aria-hidden="true"
    className="fixed z-[150] flex flex-col pointer-events-none opacity-0
               items-end text-right"
    style={{
      top:   'clamp(4.5rem, 9vw, 7rem)',
      right: 'clamp(1rem, 4vw, 4rem)',
      color: 'var(--text-dark)',
    }}
  >
    <span
      className="font-[family-name:var(--font-disp)] font-extrabold leading-none"
      style={{ fontSize: 'clamp(1.6rem, 5vw, 3.5rem)', letterSpacing: '-0.02em' }}
    >
      20%
    </span>
    <span
      className="font-bold opacity-75"
      style={{
        fontSize: 'clamp(0.6rem, 1.5vw, 0.68rem)',
        letterSpacing: '0.18em',
        marginTop: '0.2rem',
      }}
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
               items-start text-white"
    style={{
      bottom: 'clamp(1.5rem, 4vw, 4rem)',
      left:   'clamp(1rem, 4vw, 4rem)',
    }}
  >
    <span
      className="font-[family-name:var(--font-disp)] font-extrabold leading-none"
      style={{ fontSize: 'clamp(1.6rem, 5vw, 3.5rem)', letterSpacing: '-0.02em' }}
    >
      80%
    </span>
    <span
      className="font-bold opacity-75"
      style={{
        fontSize: 'clamp(0.6rem, 1.5vw, 0.68rem)',
        letterSpacing: '0.18em',
        marginTop: '0.2rem',
      }}
    >
      OPERATING BENEATH
    </span>
  </div>
))
HudBelow.displayName = 'HudBelow'
