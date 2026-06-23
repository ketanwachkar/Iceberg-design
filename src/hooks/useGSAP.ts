/**
 * useGSAP hook
 * Runs a GSAP context inside a React useEffect with proper cleanup.
 * Mirrors the official @gsap/react useGSAP pattern without the extra dependency.
 *
 * @param callback - receives the gsap instance; return value ignored
 * @param deps     - re-run when these change (default: run once on mount)
 */

import { useEffect, useRef } from 'react'
import { gsap, initGSAP } from '@/lib/gsap'

type GSAPCallback = (g: typeof gsap) => void

export function useGSAP(
  callback: GSAPCallback,
  deps: React.DependencyList = []
): void {
  const ctxRef = useRef<ReturnType<typeof gsap.context> | null>(null)

  useEffect(() => {
    const g = initGSAP()
    // Create a scoped context so all tweens/ScrollTriggers are auto-cleaned
    ctxRef.current = g.context(() => {
      callback(g)
    })

    return () => {
      ctxRef.current?.revert()
      ctxRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
