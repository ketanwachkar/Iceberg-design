/**
 * Design Tokens
 * Single source of truth for all colours, typography, spacing, and animation
 * values. Used in both CSS-in-JS and as CSS custom properties.
 */

export const colors = {
  sky: '#a5d6e1',
  skyRgb: '165, 214, 225',
  deep: '#021428',
  deepMid: '#052840',
  deepLight: '#0d4a72',
  textDark: '#0a324c',
  textMid: '#3a6e88',
  teal: '#00a699',
  white: '#ffffff',
  oceanShallow: '#58879e',
} as const

export const fonts = {
  sans: "'Inter', sans-serif",
  display: "'Outfit', sans-serif",
} as const

export const animation = {
  scrubHero: 1.2,
  scrubChunk: 2.5,
  scrubText: 1.0,
  scrubDeep: 1.0,
  waterlineRatio: 0.47,   // waterline is at 47% of composite image height
  chunkTravelEase: (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
} as const

export const breakpoints = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
} as const
