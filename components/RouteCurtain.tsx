'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

// ─── tunables ──────────────────────────────────────────────────────────────
const COVER_MS  = 480   // curtain fully covers screen before navigate
const REVEAL_MS = 420   // curtain slides away after new page mounts
// ────────────────────────────────────────────────────────────────────────────

const LABELS: Record<string, string> = {
  beranda: 'Beranda', berita: 'Berita', profil: 'Profil',
  layanan: 'Layanan', galeri: 'Galeri', peta: 'Peta',
  kontak: 'Kontak', kkn: 'KKN', susu: 'Susu',
  sektor: 'Sektor', agenda: 'Agenda', darurat: 'Darurat',
}

function labelFromPath(p: string) {
  if (p === '/') return 'Beranda'
  const slug = p.replace(/^\//, '').split('/')[0] || ''
  return LABELS[slug] || slug.charAt(0).toUpperCase() + slug.slice(1)
}

export default function RouteCurtain() {
  const pathname = usePathname() || ''
  // 'idle' | 'cover' | 'reveal'
  const [phase, setPhase] = useState<'idle' | 'cover' | 'reveal'>('idle')
  const [label, setLabel] = useState('')

  const prevPath   = useRef(pathname)
  const busy       = useRef(false)
  const timers     = useRef<ReturnType<typeof setTimeout>[]>([])
  const clearT     = () => { timers.current.forEach(clearTimeout); timers.current = [] }

  // ── pathname changed → start reveal ──────────────────────────────────────
  useEffect(() => {
    if (prevPath.current === pathname) return
    prevPath.current = pathname
    if (!busy.current) return   // initial mount / back-forward

    clearT()
    setPhase('reveal')
    timers.current.push(setTimeout(() => {
      busy.current = false
      setPhase('idle')
      setLabel('')
      document.documentElement.removeAttribute('data-nav-pending')
    }, REVEAL_MS))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // ── intercept all internal link clicks ───────────────────────────────────
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return

      // Don't run while preloader is active
      if (document.getElementById('site-preloader-v16')) return

      const anchor = (e.target as Element)?.closest('a[href]') as HTMLAnchorElement | null
      if (!anchor) return

      const href = anchor.getAttribute('href') || ''
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return
      if (anchor.target === '_blank') return

      let url: URL
      try { url = new URL(href, window.location.href) } catch { return }

      // Only same-origin navigations
      if (url.origin !== window.location.origin) return

      // Same page — skip
      if (url.pathname === pathname && url.hash) return
      if (url.pathname === pathname && !url.search) return

      // ── CRITICAL: block default immediately (synchronous) ──
      e.preventDefault()
      e.stopPropagation()

      if (busy.current) return
      busy.current = true

      const nextLabel = labelFromPath(url.pathname)
      setLabel(nextLabel)

      // 1. Hide page content immediately via CSS (synchronous, no React re-render)
      document.documentElement.setAttribute('data-nav-pending', '1')

      // 2. Start curtain animation
      setPhase('cover')

      // 3. After curtain is fully covering — use window.location for reliable navigation
      //    (bypasses Next.js prefetch race condition)
      timers.current.push(setTimeout(() => {
        window.location.href = url.href
      }, COVER_MS))
    }

    // Capture phase = true so we intercept BEFORE React event handlers
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // ── always render (never return null) ────────────────────────────────────
  // Curtain always in DOM, just hidden via CSS when idle
  return (
    <div
      className={`route-curtain route-curtain--${phase}`}
      aria-hidden="true"
    >
      <div className="route-curtain__panel route-curtain__panel--black" />
      <div className="route-curtain__panel route-curtain__panel--gold">
        <div className="route-curtain__mark">
          <span className="route-curtain__brand">PLOSOREJO</span>
          {label && <span className="route-curtain__label">{label}</span>}
        </div>
      </div>
    </div>
  )
}
