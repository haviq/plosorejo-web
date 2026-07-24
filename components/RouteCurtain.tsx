'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

type Phase = 'idle' | 'cover' | 'hold' | 'reveal'

const COVER_MS = 380
const HOLD_MS = 120
const REVEAL_MS = 420
const TOTAL_MS = COVER_MS + HOLD_MS + REVEAL_MS

const LABELS: Record<string, string> = {
  berita: 'Berita',
  profil: 'Profil',
  layanan: 'Layanan',
  galeri: 'Galeri',
  peta: 'Peta',
  kontak: 'Kontak',
  kkn: 'KKN',
  susu: 'Susu',
  sektor: 'Sektor',
}

function labelFromPath(pathname: string) {
  if (pathname === '/') return 'Beranda'
  const slug = pathname.replace(/^\//, '').split('/')[0] || ''
  return LABELS[slug] || slug.charAt(0).toUpperCase() + slug.slice(1)
}

/**
 * Smooth page-transition curtain on every in-app navigation.
 * Cover: top → bottom, then reveal: bottom → top (curtain exits upward).
 * First paint uses SitePreloader instead.
 */
export default function RouteCurtain() {
  const pathname = usePathname() || ''
  const [phase, setPhase] = useState<Phase>('idle')
  const [label, setLabel] = useState('')
  const firstPath = useRef(true)
  const lastPath = useRef(pathname)
  const busy = useRef(false)
  const timers = useRef<number[]>([])
  const reduced = useRef(false)
  const cycleId = useRef(0)

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }

  const finish = () => {
    busy.current = false
    setPhase('idle')
    setLabel('')
    document.documentElement.removeAttribute('data-route-curtain')
    document.body.style.removeProperty('overflow')
  }

  const runCycle = (nextLabel?: string) => {
    if (reduced.current) {
      finish()
      return
    }

    // Restart cleanly on rapid nav
    clearTimers()
    busy.current = true
    const id = ++cycleId.current

    setLabel(nextLabel || '')
    document.documentElement.setAttribute('data-route-curtain', 'active')
    document.body.style.overflow = 'hidden'

    setPhase('cover')
    timers.current.push(
      window.setTimeout(() => {
        if (cycleId.current !== id) return
        setPhase('hold')
      }, COVER_MS),
    )
    timers.current.push(
      window.setTimeout(() => {
        if (cycleId.current !== id) return
        setPhase('reveal')
        document.body.style.removeProperty('overflow')
      }, COVER_MS + HOLD_MS),
    )
    timers.current.push(
      window.setTimeout(() => {
        if (cycleId.current !== id) return
        finish()
      }, TOTAL_MS),
    )
  }

  // Pathname change → animate (skip first mount / preloader session)
  useEffect(() => {
    reduced.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (firstPath.current) {
      firstPath.current = false
      lastPath.current = pathname
      return
    }
    if (pathname === lastPath.current) return
    lastPath.current = pathname
    if (pathname.startsWith('/studio')) return

    runCycle(labelFromPath(pathname))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Prefetch-feel: start cover immediately on internal link click
  useEffect(() => {
    reduced.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      if (reduced.current) return

      const el = (e.target as Element | null)?.closest?.('a')
      if (!el) return

      // Don't steal clicks from theme/hamburger buttons
      if ((e.target as Element | null)?.closest?.('button')) return

      const href = el.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:'))
        return
      if (el.getAttribute('target') === '_blank') return
      if (el.hasAttribute('download')) return

      let url: URL
      try {
        url = new URL(href, window.location.origin)
      } catch {
        return
      }
      if (url.origin !== window.location.origin) return
      if (url.pathname.startsWith('/studio')) return
      if (url.pathname === window.location.pathname && url.search === window.location.search) return

      // Kick cover early; pathname effect will re-sync label/finish
      if (!busy.current) {
        runCycle(labelFromPath(url.pathname))
      }
    }

    document.addEventListener('click', onClick, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      clearTimers()
      finish()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (phase === 'idle') return null

  return (
    <div
      className={`route-curtain route-curtain--${phase}`}
      aria-hidden={phase !== 'cover' && phase !== 'hold'}
      role="presentation"
    >
      <div className="route-curtain__panel route-curtain__panel--black" />
      <div className="route-curtain__panel route-curtain__panel--gold" />
      <div className="route-curtain__mark">
        <span className="route-curtain__brand">PLOSOREJO</span>
        {label ? <span className="route-curtain__label">{label}</span> : null}
      </div>
    </div>
  )
}
