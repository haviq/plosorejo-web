'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

type Phase = 'idle' | 'cover' | 'hold' | 'reveal'

const COVER_MS = 420
const HOLD_MS = 80
const REVEAL_MS = 480
const TOTAL_MS = COVER_MS + HOLD_MS + REVEAL_MS

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
    if (busy.current) {
      // Restart cleanly on rapid nav
      clearTimers()
    }
    busy.current = true
    setLabel(nextLabel || '')
    document.documentElement.setAttribute('data-route-curtain', 'active')
    // Don't lock body scroll for long — only during cover
    document.body.style.overflow = 'hidden'

    setPhase('cover')
    timers.current.push(
      window.setTimeout(() => {
        setPhase('hold')
      }, COVER_MS),
    )
    timers.current.push(
      window.setTimeout(() => {
        setPhase('reveal')
        document.body.style.removeProperty('overflow')
      }, COVER_MS + HOLD_MS),
    )
    timers.current.push(
      window.setTimeout(() => {
        finish()
      }, TOTAL_MS),
    )
  }

  // Pathname change → animate (skip first mount)
  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false
      lastPath.current = pathname
      return
    }
    if (pathname === lastPath.current) return
    lastPath.current = pathname

    // Derive short label from path
    const slug = pathname === '/' ? 'Beranda' : pathname.replace(/^\//, '').split('/')[0]
    const pretty =
      {
        berita: 'Berita',
        profil: 'Profil',
        layanan: 'Layanan',
        galeri: 'Galeri',
        peta: 'Peta',
        kontak: 'Kontak',
        kkn: 'KKN',
        susu: 'Susu',
        sektor: 'Sektor',
      }[slug] || slug.charAt(0).toUpperCase() + slug.slice(1)

    runCycle(pretty)
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
      const href = el.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return
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
      // same path + only hash
      if (url.pathname === window.location.pathname && url.search === window.location.search) return

      // Kick cover early; pathname effect will keep/re-run as needed
      if (!busy.current) {
        const slug = url.pathname === '/' ? 'Beranda' : url.pathname.replace(/^\//, '').split('/')[0]
        runCycle(slug)
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
