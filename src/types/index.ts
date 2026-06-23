/**
 * Shared TypeScript types across the application.
 */

export interface Particle {
  x: number
  y: number
  r: number
  a: number
  vy: number
  phase: number
}

export interface NavLink {
  label: string
  href: string
}

export interface FeatureSectionData {
  id: string
  align: 'left' | 'right'   // text alignment / which side the text is on
  label: string
  lines: string[]
  cueText: string
}
