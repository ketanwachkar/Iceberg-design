/**
 * GSAP singleton initialiser
 * Registers ScrollTrigger once and exports the configured instances.
 * All components import from here — never directly from 'gsap'.
 *
 * Lazy-loaded only in the browser (GSAP requires window/document).
 */

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let registered = false

export function initGSAP(): typeof gsap {
  if (!registered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
    registered = true
  }
  return gsap
}

export { gsap, ScrollTrigger }

/**
 * Cubic ease-in-out helper (matches original vanilla JS)
 * Used for the travelling ice chunk position interpolation.
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2
}
