import type { Metadata, Viewport } from 'next'
import { Inter, Outfit } from 'next/font/google'
import Navigation from '@/components/ui/Navigation'
import '@/styles/globals.css'

/* ─── Fonts ──────────────────────────────────────────────────── */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['400', '600', '700', '800'],
})

/* ─── SEO Metadata ───────────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  ),
  title: 'Iceberg — Most of it is below the surface',
  description:
    'A scroll-driven experience about depth, strategy, and what stays hidden. ' +
    'Built around the iceberg as a metaphor for how businesses actually work.',
  keywords: ['iceberg', 'recruitment', 'talent', 'scroll experience'],
  openGraph: {
    title: 'Iceberg — Most of it is below the surface',
    description: 'An iceberg only shows 20% above water. So does most of what we do.',
    type: 'website',
    images: [{ url: '/images/iceberg-hero-bg.jpg', width: 1920, alt: 'Iceberg above and below the waterline' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Iceberg — Most of it is below the surface',
    images: ['/images/iceberg-hero-bg.jpg'],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#a5d6e1',
}

/* ─── Layout ─────────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable}`}
      style={{ scrollBehavior: 'auto' }}
    >
      <body
        className="font-sans antialiased overflow-x-hidden"
        style={{
          fontFamily: 'var(--font-inter), sans-serif',
          background: 'var(--sky)',
          color: 'var(--text-dark)',
        }}
      >
        {/* Fixed navigation sits above everything */}
        <Navigation />
        {children}
      </body>
    </html>
  )
}
