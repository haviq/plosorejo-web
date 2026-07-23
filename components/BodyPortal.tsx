'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Render children into document.body so they escape any parent stacking /
 * overflow / transform context that can swallow mobile taps.
 */
export default function BodyPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  return createPortal(children, document.body)
}
