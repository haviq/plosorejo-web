'use client'

/**
 * NavLink — route curtain bergaya portofolio (GSAP).
 *
 * Flow:
 * 1. onClick → inject #rc-curtain-portal ke DOM
 * 2. GSAP: typewriter per huruf (P→L→O→S→O→R→E→J→O) + nama halaman
 * 3. GSAP timeline selesai → window.location.href (full browser nav)
 *    sessionStorage sudah set → SitePreloader skip di halaman tujuan
 *
 * Multi-layer slide: panel hitam + panel emas slide ke atas bersama
 * setelah typewriter, stagger 0.15s (persis portofolionew).
 */

import { useCallback } from 'react'
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

function injectCurtain(label: string) {
  // Hapus portal lama
  document.getElementById(PORTAL_ID)?.remove()

  const chars = 'PLOSOREJO'.split('')

  const el = document.createElement('div')
  el.id = PORTAL_ID
  el.innerHTML = `
    <div class="rc-panel-gold"></div>
    <div class="rc-panel-black">
      <div class="rc-content">
        <div class="rc-brand">
          ${chars.map((c, i) => `<span class="rc-char rc-char-${i}" style="opacity:0">${c}</span>`).join('')}
        </div>
        <div class="rc-lbl" style="opacity:0">${label}</div>
      </div>
    </div>`
  document.body.appendChild(el)
  return el
}

export function showCurtain(label: string) {
  if (typeof document === 'undefined') return

  const el = injectCurtain(label)

  // Lazy import GSAP — hanya di browser
  import('gsap').then(({ default: gsap }) => {
    const blackPanel = el.querySelector('.rc-panel-black')
    const goldPanel  = el.querySelector('.rc-panel-gold')
    const chars      = el.querySelectorAll('.rc-char')
    const lbl        = el.querySelector('.rc-lbl')

    const tl = gsap.timeline()

    // Typewriter per huruf dengan jeda (persis portofolionew)
    chars.forEach((char, i) => {
      tl.to(char, { opacity: 1, duration: 0.08 })
      if (i < chars.length - 1) tl.to({}, { duration: 0.06 })
    })

    // Label muncul setelah semua huruf
    tl.to(lbl, { opacity: 1, duration: 0.2 }, '+=0.2')

    // Jeda sebelum slide up
    tl.to({}, { duration: 0.5 })
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

    const targetPath = hrefStr.split('?')[0].split('#')[0]
    if (window.location.pathname === targetPath) return

    e.preventDefault()
    e.stopPropagation()

    const label = labelFromPath(hrefStr)
    const el = injectCurtain(label)

    // Lazy import GSAP
    import('gsap').then(({ default: gsap }) => {
      const blackPanel = el.querySelector<HTMLElement>('.rc-panel-black')
      const goldPanel  = el.querySelector<HTMLElement>('.rc-panel-gold')
      const chars      = el.querySelectorAll('.rc-char')
      const lbl        = el.querySelector<HTMLElement>('.rc-lbl')

      const tl = gsap.timeline({
        onComplete: () => {
          window.location.href = hrefStr
        }
      })

      // Typewriter per huruf
      chars.forEach((char, i) => {
        tl.to(char, { opacity: 1, duration: 0.08 })
        if (i < chars.length - 1) tl.to({}, { duration: 0.06 })
      })

      // Label fade in
      tl.to(lbl, { opacity: 1, duration: 0.2 }, '+=0.15')

      // Jeda sebelum slide up
      tl.to({}, { duration: 0.4 })

      // Multi-layer slide UP — panel hitam dulu, gold menyusul (stagger 0.15s)
      // Ini TIDAK terjadi — kita navigasi dulu, slide up terjadi di halaman baru via SitePreloader
      // Cukup navigate setelah typewriter selesai
    })
  }, [href, hrefStr, onClick])

  return (
    <Link href={href} {...rest} onClick={handleClick}>
      {children}
    </Link>
  )
}
