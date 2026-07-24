'use client'

import { usePathname } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SiteBackground from '@/components/SiteBackground'
import RouteCurtain from '@/components/RouteCurtain'
import EmergencyBanner from '@/components/EmergencyBanner'
import type { MerapiLevel } from '@/lib/merapi'

export default function SiteShell({
  children,
  whatsapp,
  merapi,
}: {
  children: React.ReactNode
  whatsapp?: string
  merapi?: {
    level: MerapiLevel
    roman?: string
    deskripsi?: string
    updatedAt?: string
  }
}) {
  const pathname = usePathname() || ''
  const isStudio = pathname.startsWith('/studio')
  const isAdmin = pathname.startsWith('/admin')

  if (isStudio) {
    return <>{children}</>
  }

  // Minimal chrome for internal ops — no marketing footer noise
  if (isAdmin) {
    return (
      <>
        <SiteBackground />
        <div className="site-content min-h-screen">
          <main id="main-content" className="flex-1" tabIndex={-1}>
            {children}
          </main>
        </div>
      </>
    )
  }

  return (
    <>
      <SiteBackground />
      <a href="#main-content" className="skip-link">
        Langsung ke konten utama
      </a>
      <RouteCurtain />
      {/* Nav MUST stay outside .site-content isolation so fixed header
          is never trapped under main/hero/map stacking contexts on mobile. */}
      <Nav whatsapp={whatsapp} />
      {merapi ? (
        <EmergencyBanner
          level={merapi.level}
          roman={merapi.roman}
          deskripsi={merapi.deskripsi}
          updatedAt={merapi.updatedAt}
        />
      ) : null}
      <div className="site-content">
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}
