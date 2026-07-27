'use client'

/**
 * RouteCurtain — triggers reveal when pathname changes after NavLink navigation.
 * The cover is handled by NavLink directly (pure DOM, zero React setState).
 */

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { revealCurtain } from '@/components/NavLink'

export default function RouteCurtain() {
  const pathname  = usePathname() || ''
  const prevPath  = useRef(pathname)
  const busy      = useRef(false)

  // When NavLink sets data-nav-pending, mark busy
  useEffect(() => {
    const obs = new MutationObserver(() => {
      if (document.documentElement.hasAttribute('data-nav-pending')) {
        busy.current = true
      }
    })
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-nav-pending'] })
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
