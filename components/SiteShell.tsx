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
      <div className="site-content">
        <Nav whatsapp={whatsapp} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  )
}
