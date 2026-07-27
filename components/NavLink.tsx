'use client'

/**
 * NavLink — Next.js 16 aware link with curtain transition.
 *
 * Strategy: ALLOW React to navigate normally.
 * Before navigation: show curtain + set data-nav-pending (hides <main> via CSS).
 * After pathname changes: reveal curtain + remove data-nav-pending.
 *
 * This is the ONLY reliable approach in Next.js 16 App Router:
 * - onNavigate preventDefault blocks nav permanently (no re-trigger)
 * - window.location.assign loses React state
 * - Curtain outside React tree means it survives React re-renders
 */

import Link from 'next/link'
import type { ComponentPropsWithoutRef, MouseEvent } from 'react'

const PORTAL_ID = 'rc-curtain-portal'

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

// ── Pure DOM — zero React setState ──────────────────────────────────────────
export function showCurtain(label: string) {
  if (typeof document === 'undefined') return

  let el = document.getElementById(PORTAL_ID)
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

  // Restart animation via reflow
  el.className = ''
  void el.offsetHeight
  el.className = 'rc-cover'
}

export function revealCurtain() {
  if (typeof document === 'undefined') return

  const el = document.getElementById(PORTAL_ID)
  if (!el) {
    document.documentElement.removeAttribute('data-nav-pending')
    return
  }

  el.className = ''
  void el.offsetHeight
  el.className = 'rc-reveal'

  setTimeout(() => {
    el.className = 'rc-idle'
    document.documentElement.removeAttribute('data-nav-pending')
  }, 460)
}

type LinkProps = ComponentPropsWithoutRef<typeof Link>

export default function NavLink({ href, onClick, children, ...rest }: LinkProps) {
  const hrefStr = typeof href === 'string'
    ? href
    : (href as { pathname?: string }).pathname || '/'

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Call original onClick first (e.g. closeMenus)
    onClick?.(e)

    if (e.defaultPrevented) return
    if (typeof window === 'undefined') return

    // Same page — no curtain
    const currentPath = window.location.pathname
    const targetPath = hrefStr.split('?')[0].split('#')[0]
    if (currentPath === targetPath) return

    // Skip if preloader still active
    if (document.getElementById('site-preloader-v16')) return

    // 1. Show curtain immediately (pure DOM — paint this frame)
    showCurtain(labelFromPath(hrefStr))

    // 2. Hide page content via CSS (prevents flash of new page content)
    document.documentElement.setAttribute('data-nav-pending', '1')

    // React will navigate normally — curtain is already covering the screen
    // RouteCurtain component will call revealCurtain() when pathname changes
  }

  return (
    <Link
      href={href}
      {...rest}
      onClick={handleClick}
    >
      {children}
    </Link>
  )
}
