'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// ─── tunables ─────────────────────────────────────────────────────────────
const COVER_MS  = 520   // ms curtain covers before navigate
const REVEAL_MS = 460   // ms curtain reveals after page load
const CURTAIN_ID = 'rc-curtain-portal'
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

// ── Inject curtain as pure HTML outside React tree ─────────────────────────
function ensureCurtain(): HTMLElement {
  let el = document.getElementById(CURTAIN_ID)
  if (!el) {
    el = document.createElement('div')
    el.id = CURTAIN_ID
    el.setAttribute('aria-hidden', 'true')
    el.innerHTML = `
      <div class="rc-panel rc-panel-black"></div>
      <div class="rc-panel rc-panel-gold">
        <div class="rc-mark">
          <span class="rc-brand">PLOSOREJO</span>
          <span class="rc-lbl"></span>
        </div>
      </div>
    `
    // Inject directly into body — outside React tree
    document.body.appendChild(el)
  }
  return el
}

function coverCurtain(label: string) {
  const el = ensureCurtain()
  // Update label
  const lbl = el.querySelector<HTMLElement>('.rc-lbl')
  if (lbl) lbl.textContent = label
  // Force reflow to restart animation
  el.className = ''
  void el.offsetHeight // trigger reflow
  el.className = 'rc-cover'
}

function revealCurtain(onDone: () => void) {
  const el = document.getElementById(CURTAIN_ID)
  if (!el) { onDone(); return }
  el.className = ''
  void el.offsetHeight
  el.className = 'rc-reveal'
  setTimeout(() => {
    el.className = 'rc-idle'
    onDone()
  }, REVEAL_MS)
}

export default function RouteCurtain() {
  const pathname = usePathname() || ''
  const prevPath = useRef(pathname)
  const busy     = useRef(false)
  const navTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── On mount: ensure curtain exists in DOM ─────────────────────────────
  useEffect(() => {
    ensureCurtain()
    return () => {
      // Cleanup on unmount (dev HMR)
      document.getElementById(CURTAIN_ID)?.remove()
    }
  }, [])

  // ── Pathname changed → reveal ──────────────────────────────────────────
  useEffect(() => {
    if (prevPath.current === pathname) return
    prevPath.current = pathname
    if (!busy.current) return

    if (navTimer.current) { clearTimeout(navTimer.current); navTimer.current = null }

    revealCurtain(() => {
      busy.current = false
      document.documentElement.removeAttribute('data-nav-pending')
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // ── Intercept all internal link clicks ────────────────────────────────
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

      // ── Block default NOW (synchronous) ──
      e.preventDefault()
      e.stopPropagation()

      busy.current = true

      // 1. Hide body content via CSS immediately (synchronous)
      document.documentElement.setAttribute('data-nav-pending', '1')

      // 2. Show curtain — pure DOM outside React, guaranteed immediate paint
      coverCurtain(labelFromPath(url.pathname))

      // 3. Navigate after curtain covers
      navTimer.current = setTimeout(() => {
        window.location.assign(url.href)
      }, COVER_MS)
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // This component renders nothing — curtain lives outside React tree
  return null
}
