/**
 * Particle canvas utility
 * Creates and runs a floating particle animation on a given canvas element.
 * Returns a cleanup function that cancels the rAF loop.
 *
 * Used for: hero underwater atmosphere, deep section, feature sections.
 */

import type { Particle } from '@/types'

export function createParticles(
  canvas: HTMLCanvasElement,
  container: HTMLElement,
  count = 80
): () => void {
  const dpr = window.devicePixelRatio || 1
  const W   = container.offsetWidth
  const H   = container.offsetHeight

  canvas.width  = W * dpr
  canvas.height = H * dpr
  canvas.style.width  = `${W}px`
  canvas.style.height = `${H}px`

  const ctx = canvas.getContext('2d')
  if (!ctx) return () => {}

  ctx.scale(dpr, dpr)

  const pts: Particle[] = Array.from({ length: count }, () => ({
    x:     Math.random() * W,
    y:     Math.random() * H,
    r:     Math.random() * 2.2 + 0.4,
    a:     Math.random() * 0.55 + 0.1,
    vy:    Math.random() * 0.22 + 0.04,
    phase: Math.random() * Math.PI * 2,
  }))

  let frame = 0
  let raf: number | null = null

  function draw(): void {
    raf = requestAnimationFrame(draw)
    ctx!.clearRect(0, 0, W, H)
    frame++

    for (const p of pts) {
      p.y -= p.vy
      if (p.y < -4) {
        p.y = H + 4
        p.x = Math.random() * W
      }
      const wx = p.x + Math.sin(frame * 0.012 + p.phase) * 0.7
      ctx!.beginPath()
      ctx!.arc(wx, p.y, p.r, 0, Math.PI * 2)
      ctx!.fillStyle = `rgba(180,230,255,${p.a})`
      ctx!.fill()
    }
  }

  draw()
  return () => { if (raf !== null) cancelAnimationFrame(raf) }
}
