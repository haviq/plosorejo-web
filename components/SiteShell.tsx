'use client'

import { usePathname } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SiteBackground from '@/components/SiteBackground'

export default function SiteShell({
  children,
  whatsapp,
}: {
  children: React.ReactNode
  whatsapp?: string
}) {
  const pathname = usePathname() || ''
  const isStudio = pathname.startsWith('/studio')

  if (isStudio) {
    return <>{children}</>
  }

  return (
    <>
      <SiteBackground />
      {/* Nav MUST stay outside .site-content isolation so fixed header
          is never trapped under main/hero/map stacking contexts on mobile. */}
      <Nav whatsapp={whatsapp} />
      <div className="site-content">
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  )
}
