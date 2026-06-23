/**
 * useParticles
 * Attaches the particle canvas animation to the given refs.
 * Starts on mount, cancels rAF on unmount.
 */

import { useEffect } from 'react'
import { createParticles } from '@/lib/particles'

export function useParticles(
  canvasRef:    React.RefObject<HTMLCanvasElement | null>,
  containerRef: React.RefObject<HTMLElement | null>,
  count = 80
): void {
  useEffect(() => {
    const canvas    = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const stop = createParticles(canvas, container, count)
    return stop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
