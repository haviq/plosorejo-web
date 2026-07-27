'use client'

/**
 * NavLink — drop-in replacement for next/link that shows the route curtain
 * before navigating. Uses Next.js 16 onNavigate + preventDefault() which is
 * the ONLY reliable way to delay navigation in the App Router.
 */

import Link from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'

const COVER_MS = 480

const LABELS: Record<string, string> = {
  beranda: 'Beranda', berita: 'Berita', profil: 'Profil',
  layanan: 'Layanan', galeri: 'Galeri', peta: 'Peta',
  kontak: 'Kontak', kkn: 'KKN', susu: 'Susu',
  sektor: 'Sektor', agenda: 'Agenda', darurat: 'Darurat',
}

function labelFromPath(p: string) {
  if (p === '/' || p === '') return 'Beranda'
  const slug = p.replace(/^\//, '').split('/')[0] || ''
  return LABELS[slug] || slug.charAt(0).toUpperCase() + slug.slice(1)
}

// ── Pure DOM curtain helpers — zero React involvement ──────────────────────
const PORTAL_ID = 'rc-curtain-portal'

function getCurtain(): HTMLElement | null {
  return document.getElementById(PORTAL_ID)
}

function showCurtain(label: string) {
  let el = getCurtain()
  if (!el) {
    el = document.createElement('div')
    el.id = PORTAL_ID
    el.setAttribute('aria-hidden', 'true')
    el.innerHTML = `
      <div class="rc-panel rc-panel-black"></div>
      <div class="rc-panel rc-panel-gold">
        <div class="rc-mark">
          <span class="rc-brand">PLOSOREJO</span>
          <span class="rc-lbl"></span>
        </div>
      </div>`
    document.body.appendChild(el)
  }
  const lbl = el.querySelector<HTMLElement>('.rc-lbl')
  if (lbl) lbl.textContent = label
  // Force reflow so animation restarts cleanly
  el.className = ''
  void el.offsetHeight
  el.className = 'rc-cover'
}

export function revealCurtain() {
  const el = getCurtain()
  if (!el) return
  el.className = ''
  void el.offsetHeight
  el.className = 'rc-reveal'
  setTimeout(() => {
    if (el) el.className = 'rc-idle'
    document.documentElement.removeAttribute('data-nav-pending')
  }, 460)
}

type LinkProps = ComponentPropsWithoutRef<typeof Link>

export default function NavLink({ href, onClick, children, ...rest }: LinkProps) {
  const hrefStr = typeof href === 'string' ? href : (href as { pathname?: string }).pathname || '/'

  return (
    <Link
      href={href}
      {...rest}
      onNavigate={(e) => {
        // Skip if same page
        if (typeof window !== 'undefined' && window.location.pathname === hrefStr) return

        // CRITICAL: prevent navigation now
        e.preventDefault()

        // Show curtain immediately (pure DOM — no React setState)
        showCurtain(labelFromPath(hrefStr))
        document.documentElement.setAttribute('data-nav-pending', '1')

        // After curtain covers — allow navigation
        setTimeout(() => {
          // Re-click the link programmatically without onNavigate interference
          window.location.assign(hrefStr)
        }, COVER_MS)
      }}
      onClick={(ev) => {
        onClick?.(ev)
      }}
    >
      {children}
    </Link>
  )
}
