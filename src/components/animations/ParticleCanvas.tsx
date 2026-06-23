'use client'

/**
 * ParticleCanvas
 * Renders a <canvas> and runs the floating particle animation.
 * The parent container ref is used to match canvas dimensions.
 */

import { useRef, forwardRef } from 'react'
import { useParticles } from '@/hooks/useParticles'

interface Props {
  containerRef: React.RefObject<HTMLElement | null>
  count?: number
  className?: string
  /** CSS opacity before GSAP takes over (default 1) */
  initialOpacity?: number
}

const ParticleCanvas = forwardRef<HTMLCanvasElement, Props>(
  ({ containerRef, count = 80, className = '', initialOpacity = 1 }, forwardedRef) => {
    const internalRef = useRef<HTMLCanvasElement>(null)
    // Prefer the forwarded ref; fall back to internal
    const canvasRef = (forwardedRef as React.RefObject<HTMLCanvasElement> | null)
      ?? internalRef

    useParticles(canvasRef, containerRef, count)

    return (
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ opacity: initialOpacity }}
        className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      />
    )
  }
)
ParticleCanvas.displayName = 'ParticleCanvas'

export default ParticleCanvas
