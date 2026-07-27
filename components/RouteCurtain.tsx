'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { revealCurtain } from '@/components/NavLink'

export default function RouteCurtain() {
  const pathname = usePathname() || ''
  const prevPath = useRef(pathname)
  const busy     = useRef(false)

  // Track when NavLink sets data-nav-pending
  useEffect(() => {
    const obs = new MutationObserver(() => {
      if (document.documentElement.hasAttribute('data-nav-pending')) {
        busy.current = true
      }
    })
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-nav-pending'],
    })
    return () => obs.disconnect()
  }, [])

  // Pathname changed → reveal curtain
  useEffect(() => {
    if (prevPath.current === pathname) return
    prevPath.current = pathname
    if (!busy.current) return

    busy.current = false
    revealCurtain()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return null
}
