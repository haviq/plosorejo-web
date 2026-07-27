'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// ─── tunables ─────────────────────────────────────────────────────────────
const COVER_MS  = 500   // ms until curtain fully covers (then navigate)
const REVEAL_MS = 480   // ms curtain slides away after new page loads
// ──────────────────────────────────────────────────────────────────────────

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

// ── Pure DOM helpers — zero React, zero async ──────────────────────────────
function getEl() {
  return document.getElementById('route-curtain-root')
}

function coverNow(label: string) {
  const el = getEl()
  if (!el) return
  // Remove all phases synchronously
  el.classList.remove('rc-idle', 'rc-reveal')
  el.classList.add('rc-cover')
  el.style.pointerEvents = 'auto'
  // Update label text
  const lbl = el.querySelector<HTMLElement>('.rc-label')
  if (lbl) lbl.textContent = label
}

function revealNow() {
  const el = getEl()
  if (!el) return
  el.classList.remove('rc-cover')
  el.classList.add('rc-reveal')
  el.style.pointerEvents = 'none'
  setTimeout(() => {
    el.classList.remove('rc-reveal')
    el.classList.add('rc-idle')
    document.documentElement.removeAttribute('data-nav-pending')
  }, REVEAL_MS)
}

export default function RouteCurtain() {
  const pathname  = usePathname() || ''
  const prevPath  = useRef(pathname)
  const busy      = useRef(false)
  const navTimer  = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Pathname changed → reveal ──────────────────────────────────────────
  useEffect(() => {
    if (prevPath.current === pathname) return
    prevPath.current = pathname
    if (!busy.current) return

    if (navTimer.current) { clearTimeout(navTimer.current); navTimer.current = null }
    revealNow()
    busy.current = false
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // ── Intercept all internal clicks — capture phase ──────────────────────
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return
      if (document.getElementById('site-preloader-v16')) return
      if (busy.current) return

      const anchor = (e.target as Element)?.closest('a[href]') as HTMLAnchorElement | null
      if (!anchor) return

      const href = anchor.getAttribute('href') || ''
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return
      if (anchor.target === '_blank') return

      let url: URL
      try { url = new URL(href, window.location.href) } catch { return }

      if (url.origin !== window.location.origin) return
      if (url.pathname === pathname && !url.search) return

      // ── block navigation NOW (synchronous) ──
      e.preventDefault()
      e.stopPropagation()

      busy.current = true
      const nextLabel = labelFromPath(url.pathname)

      // 1. Hide body content immediately (synchronous CSS — no React needed)
      document.documentElement.setAttribute('data-nav-pending', '1')

      // 2. Show curtain via direct DOM classList (synchronous — no React setState)
      coverNow(nextLabel)

      // 3. Wait for curtain to fully cover, then navigate
      navTimer.current = setTimeout(() => {
        window.location.assign(url.href)
      }, COVER_MS)
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Curtain always in DOM — starts as rc-idle (panels hidden above viewport)
  return (
    <div
      id="route-curtain-root"
      className="route-curtain rc-idle"
      aria-hidden="true"
    >
      <div className="route-curtain__panel route-curtain__panel--black" />
      <div className="route-curtain__panel route-curtain__panel--gold">
        <div className="route-curtain__mark">
          <span className="route-curtain__brand">PLOSOREJO</span>
          <span className="rc-label route-curtain__label" />
        </div>
      </div>
    </div>
  )
}
