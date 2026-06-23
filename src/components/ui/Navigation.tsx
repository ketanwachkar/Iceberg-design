'use client'

/**
 * Navigation
 * Fixed capsule nav bar at the top of the page.
 * Pointer-events on the capsule only so the hero layers are still clickable.
 */

import Link from 'next/link'
import { NAV_LINKS } from '@/constants'

export default function Navigation() {
  return (
    <header
      className="fixed top-[clamp(0.75rem,2.5vw,1.8rem)] left-0 w-full z-[200]
                 flex justify-center pointer-events-none"
      role="banner"
    >
      <nav
        className="pointer-events-auto flex items-center
                   gap-[clamp(1rem,3vw,2.5rem)]
                   bg-[rgba(20,50,65,0.55)] backdrop-blur-[18px]
                   border border-white/10
                   px-[clamp(1.2rem,3vw,2rem)] py-[0.55rem]
                   rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div
          className="font-[family-name:var(--font-disp)] font-extrabold
                     text-[clamp(0.85rem,1.5vw,1.05rem)] tracking-[0.18em]"
          aria-label="Iceberg"
        >
          <span className="text-white">ICE</span>
          <span className="text-[var(--teal)]">BERG</span>
        </div>

        {/* Links */}
        <ul className="flex gap-[clamp(0.8rem,2vw,1.8rem)] list-none" role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="text-[clamp(0.6rem,1vw,0.75rem)] font-semibold
                           tracking-[0.1em] text-white/65
                           hover:text-white transition-colors duration-300
                           no-underline"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
