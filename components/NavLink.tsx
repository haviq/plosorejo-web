'use client'

/**
 * NavLink — curtain-first navigation.
 *
 * Flow:
 * 1. onClick → inject curtain portal ke DOM (pure DOM, zero React)
 * 2. Tunggu COVER_MS (600ms) — curtain sudah cover layar
 * 3. window.location.href = url — full browser navigation
 *    (sessionStorage sudah set → SitePreloader skip)
 *
 * Kenapa window.location.href bukan router.push():
 * Next.js App Router prefetch berjalan di background, router.push()
 * tidak bisa di-block — page swap terjadi sebelum curtain cover.
 * window.location.href = full browser nav yang benar-benar menunggu.
 */

import { useCallback } from 'react'
import Link from 'next/link'
import type { ComponentPropsWithoutRef, MouseEvent } from 'react'

const COVER_MS  = 600   // ms curtain cover layar sebelum navigate
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

export function showCurtain(label: string) {
  if (typeof document === 'undefined') return

  // Hapus portal lama jika ada
  const old = document.getElementById(PORTAL_ID)
  if (old) old.remove()

  const el = document.createElement('div')
  el.id = PORTAL_ID
  el.setAttribute('aria-hidden', 'true')
  el.innerHTML = `
    <div class="rc-bg"></div>
    <div class="rc-content">
      <div class="rc-spinner"></div>
      <span class="rc-brand">PLOSOREJO</span>
      <span class="rc-lbl">${label}</span>
    </div>`
  document.body.appendChild(el)

  // Trigger fade in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.classList.add('rc-visible')
    })
  })
}

/** No-op — kept for any remaining import sites */
export function revealCurtain() {}

type LinkProps = ComponentPropsWithoutRef<typeof Link>

export default function NavLink({ href, onClick, children, ...rest }: LinkProps) {
  const hrefStr = typeof href === 'string'
    ? href
    : (href as { pathname?: string }).pathname || '/'

  const handleClick = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)

    if (typeof window === 'undefined') return

    // Skip jika sama halaman
    const targetPath = hrefStr.split('?')[0].split('#')[0]
    if (window.location.pathname === targetPath) return

    // Prevent default browser nav
    e.preventDefault()
    e.stopPropagation()

    // Tampilkan curtain
    showCurtain(labelFromPath(hrefStr))

    // Setelah curtain cover → full browser navigation
    setTimeout(() => {
      window.location.href = hrefStr
    }, COVER_MS)
  }, [href, hrefStr, onClick])

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
