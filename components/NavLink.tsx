'use client'

/**
 * NavLink — guaranteed curtain-first navigation.
 *
 * Flow:
 * 1. onClick → e.preventDefault() (block default browser nav)
 * 2. showCurtain() — pure DOM, paints this frame
 * 3. setTimeout(COVER_MS) — wait for curtain to fully cover
 * 4. router.push(href) — React navigates AFTER curtain covers
 * 5. pathname useEffect → revealCurtain()
 *
 * WHY this works vs previous attempts:
 * - onClick + e.preventDefault() fully blocks the link
 * - router.push() is called INSIDE setTimeout, so curtain has
 *   already painted before React starts rendering new page
 * - No onNavigate (can't re-trigger after preventDefault)
 * - No window.location (causes full reload)
 */

import { useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ComponentPropsWithoutRef, MouseEvent } from 'react'

const COVER_MS  = 500  // ms to wait for curtain to fully cover screen
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
  el.className = ''
  void el.offsetHeight  // force reflow → restart animation
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
  const router  = useRouter()
  const hrefStr = typeof href === 'string'
    ? href
    : (href as { pathname?: string }).pathname || '/'

  const handleClick = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    // Call original onClick (e.g. closeMenus) first
    onClick?.(e)

    if (typeof window === 'undefined') return

    // Skip if same page
    const targetPath = hrefStr.split('?')[0].split('#')[0]
    if (window.location.pathname === targetPath) return

    // BLOCK default navigation
    e.preventDefault()

    // 1. Show curtain immediately — pure DOM, zero React
    showCurtain(labelFromPath(hrefStr))

    // 2. Hide page content via CSS
    document.documentElement.setAttribute('data-nav-pending', '1')

    // 3. After curtain fully covers — THEN navigate with React router
    //    Curtain is already painted; React renders new page behind it
    setTimeout(() => {
      router.push(hrefStr)
    }, COVER_MS)
  }, [href, hrefStr, onClick, router])

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
