import type { NavLink, FeatureSectionData } from '@/types'

export const NAV_LINKS: NavLink[] = [
  { label: 'ABOUT',      href: '#about'      },
  { label: 'SERVICES',   href: '#services'   },
  { label: 'INDUSTRIES', href: '#industries' },
  { label: 'CONTACT',    href: '#contact'    },
]

export const FEATURE_SECTIONS: FeatureSectionData[] = [
  {
    id: 'fs-a',
    align: 'left',
    label: 'ARCTIC OCEAN · 40M BELOW',
    lines: ['Strategy', 'runs deeper', 'than it looks'],
    cueText: 'SCROLL TO EXPLORE',
  },
  {
    id: 'fs-b',
    align: 'right',
    label: 'NORTH ATLANTIC · 80% UNSEEN',
    lines: ['What you see', 'is never the', 'whole picture'],
    cueText: 'KEEP GOING',
  },
]
