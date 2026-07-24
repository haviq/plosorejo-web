'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Icon from '@/components/Icon'
import ThemeToggle from '@/components/ThemeToggle'
import { waLink } from '@/lib/site'
import siteFallback from '@/content/site.json'

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/profil', label: 'Profil' },
  { href: '/berita', label: 'Berita' },
  { href: '/layanan', label: 'Layanan' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/peta', label: 'Peta' },
  { href: '/kontak', label: 'Kontak' },
]

const sektorLinks = [
  { href: '/sektor/peternakan', label: 'Peternakan', icon: 'peternakan' },
  { href: '/sektor/pertanian', label: 'Pertanian', icon: 'pertanian' },
  { href: '/sektor/umkm', label: 'UMKM', icon: 'umkm' },
  { href: '/sektor/pariwisata', label: 'Pariwisata', icon: 'pariwisata' },
  { href: '/sektor/pendidikan', label: 'Pendidikan', icon: 'pendidikan' },
  { href: '/sektor/kesehatan', label: 'Kesehatan', icon: 'kesehatan' },
  { href: '/sektor/budaya', label: 'Budaya', icon: 'budaya' },
]

export default function Nav({ whatsapp }: { whatsapp?: string }) {
  const pathname = usePathname() || ''
  const wa = whatsapp || siteFallback.whatsapp
  const waHref = waLink(wa, 'Halo Padukuhan Plosorejo')
  const waReady = waHref !== '#'
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sektorOpen, setSektorOpen] = useState(false)
  const sektorRef = useRef<HTMLLIElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const lastPath = useRef(pathname)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sektorRef.current && !sektorRef.current.contains(e.target as Node)) {
        setSektorOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile sheet only when the route actually changes (not on mount).
  useEffect(() => {
    if (lastPath.current === pathname) return
    lastPath.current = pathname
    setMobileOpen(false)
    setSektorOpen(false)
    document.body.style.removeProperty('overflow')
    document.documentElement.style.removeProperty('overflow')
  }, [pathname])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      document.documentElement.setAttribute('data-mobile-nav', 'open')
    } else {
      document.body.style.removeProperty('overflow')
      document.documentElement.style.removeProperty('overflow')
      document.documentElement.removeAttribute('data-mobile-nav')
    }
    return () => {
      document.body.style.removeProperty('overflow')
      document.documentElement.style.removeProperty('overflow')
      document.documentElement.removeAttribute('data-mobile-nav')
    }
  }, [mobileOpen])

  // Native capture listeners for hamburger — more reliable than React synthetic
  // events on Android/Telegram WebView (pointerdown preventDefault often kills click).
  useEffect(() => {
    const el = hamburgerRef.current
    if (!el) return

    const activate = (e: Event) => {
      if (e instanceof PointerEvent && e.button !== 0 && e.pointerType === 'mouse') return
      e.preventDefault()
      e.stopPropagation()
      // Read live open state from DOM attribute (always current)
      const open = document.documentElement.getAttribute('data-mobile-nav') === 'open'
      if (open) closeMobile()
      else openMobile()
    }

    el.addEventListener('pointerup', activate, { capture: true })
    el.addEventListener('click', activate, { capture: true })
    return () => {
      el.removeEventListener('pointerup', activate, true)
      el.removeEventListener('click', activate, true)
    }
    // open/close helpers are stable enough via refs below; rebind when open state changes
    // so attribute path stays consistent.
  }, [mobileOpen])

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false)
        setSektorOpen(false)
        hamburgerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    // Don't auto-focus first link on open — steals context on mobile WebView
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  // Hard unlock: never leave page non-interactive after overlays
  useEffect(() => {
    const unlock = () => {
      const pre = document.documentElement.getAttribute('data-preloader')
      const curtain = document.documentElement.getAttribute('data-route-curtain')
      const nav = document.documentElement.getAttribute('data-mobile-nav')
      if (pre !== 'active' && curtain !== 'active' && nav !== 'open') {
        document.body.style.removeProperty('overflow')
        document.documentElement.style.removeProperty('overflow')
        document.body.style.pointerEvents = 'auto'
        document.documentElement.style.pointerEvents = 'auto'
      }
      // Header controls must always remain tappable once preloader is done
      if (pre !== 'active') {
        const header = document.querySelector<HTMLElement>('.site-header')
        if (header) {
          header.style.pointerEvents = 'auto'
          header.style.zIndex = '22000'
        }
      }
    }
    unlock()
    const id = window.setInterval(unlock, 1500)
    window.addEventListener('pageshow', unlock)
    return () => {
      window.clearInterval(id)
      window.removeEventListener('pageshow', unlock)
    }
  }, [])

  const closeMenus = () => {
    setMobileOpen(false)
    setSektorOpen(false)
  }

  const lastHamAt = useRef(0)
  const lastHamAction = useRef<'open' | 'close' | null>(null)

  const openMobile = () => {
    const now = Date.now()
    // Only ignore double-fire of the *same* action (pointerup + click)
    if (lastHamAction.current === 'open' && now - lastHamAt.current < 280) return
    lastHamAt.current = now
    lastHamAction.current = 'open'
    setMobileOpen(true)
  }

  const closeMobile = () => {
    const now = Date.now()
    if (lastHamAction.current === 'close' && now - lastHamAt.current < 280) return
    lastHamAt.current = now
    lastHamAction.current = 'close'
    setMobileOpen(false)
    setSektorOpen(false)
  }

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <header
        className="site-header"
        data-nav-build="header-inline-v10"
        role="banner"
        data-scrolled={scrolled || mobileOpen ? '1' : '0'}
        data-mobile-open={mobileOpen ? '1' : '0'}
      >
        <div className="site-header__bar">
          <Link
            href="/"
            onClick={closeMenus}
            className="site-header__brand"
            aria-label="Plosorejo — Halaman Utama"
          >
            <span className="site-header__brand-title">PLOSOREJO</span>
            <span className="site-header__brand-sub">Padukuhan Digital</span>
          </Link>

          <nav aria-label="Navigasi utama" className="site-header__desktop-nav">
            <ul className="site-header__desktop-list">
              {navLinks.map(({ href, label }) => {
                const active = isActive(href)
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={closeMenus}
                      className="site-header__link"
                      style={{ color: active ? 'var(--gold)' : 'var(--muted)' }}
                      aria-current={active ? 'page' : undefined}
                    >
                      {label}
                    </Link>
                  </li>
                )
              })}
              <li className="relative" ref={sektorRef}>
                <button
                  type="button"
                  className="site-header__link"
                  style={{ color: pathname.startsWith('/sektor') ? 'var(--gold)' : 'var(--muted)' }}
                  aria-expanded={sektorOpen}
                  aria-haspopup="true"
                  onClick={() => setSektorOpen((v) => !v)}
                >
                  Sektor
                </button>
                {sektorOpen ? (
                  <div className="site-header__dropdown" role="menu">
                    {sektorLinks.map(({ href, label, icon }) => (
                      <Link
                        key={href}
                        href={href}
                        role="menuitem"
                        onClick={closeMenus}
                        className="site-header__dropdown-item"
                        style={{
                          color: pathname.startsWith(href) ? 'var(--gold)' : 'var(--text)',
                        }}
                      >
                        <Icon name={icon} size={16} />
                        {label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </li>
            </ul>
          </nav>

          <div className="site-header__desktop-actions">
            <ThemeToggle />
            <Link href="/sektor/umkm" className="btn-ghost !py-2 !px-4 !text-xs">
              UMKM
            </Link>
            {waReady ? (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary !py-2 !px-4 !text-xs"
              >
                WhatsApp
              </a>
            ) : (
              <Link href="/kontak" className="btn-primary !py-2 !px-4 !text-xs">
                Kontak
              </Link>
            )}
          </div>

          <div className="site-header__mobile-actions">
            <ThemeToggle />
            <button
              ref={hamburgerRef}
              type="button"
              className="site-header__icon-btn touch-manipulation"
              data-nav-hamburger="1"
              data-nav-open={mobileOpen ? '1' : '0'}
              // React fallbacks (native capture listeners attached in effect)
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (mobileOpen) closeMobile()
                else openMobile()
              }}
              onPointerUp={(e) => {
                if (e.button !== 0 && e.pointerType !== 'touch' && e.pointerType !== 'pen') return
                e.preventDefault()
                e.stopPropagation()
                if (mobileOpen) closeMobile()
                else openMobile()
              }}
              aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-panel"
              style={{
                color: '#f0c040',
                borderColor: 'rgba(240,192,64,0.9)',
                background: 'rgba(8,8,8,0.92)',
                boxShadow: '0 0 0 1px rgba(240,192,64,0.4), 0 2px 10px rgba(0,0,0,0.45)',
              }}
            >
              {mobileOpen ? (
                /* Explicit X — clearer than rotating 3 burger lines */
                <span className="site-header__close-x" aria-hidden="true">
                  <span className="site-header__close-x-line site-header__close-x-line--a" />
                  <span className="site-header__close-x-line site-header__close-x-line--b" />
                </span>
              ) : (
                <>
                  <span className="site-header__burger-line" style={{ background: '#f0c040' }} />
                  <span className="site-header__burger-line" style={{ background: '#f0c040' }} />
                  <span className="site-header__burger-line" style={{ background: '#f0c040' }} />
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Fixed sibling (not portaled) — always available the same frame as open */}
      {mobileOpen ? (
        <div
          id="mobile-nav-panel"
          className="site-mobile-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
        >
          <div className="site-mobile-panel__inner">
            <div className="site-mobile-panel__top">
              <p className="site-mobile-panel__brand">Menu</p>
              <button
                type="button"
                className="site-header__icon-btn touch-manipulation"
                data-nav-close="1"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  closeMobile()
                }}
                onPointerUp={(e) => {
                  if (e.button !== 0 && e.pointerType !== 'touch' && e.pointerType !== 'pen') return
                  e.preventDefault()
                  e.stopPropagation()
                  closeMobile()
                }}
                aria-label="Tutup menu"
                style={{
                  color: '#f0c040',
                  borderColor: 'rgba(240,192,64,0.9)',
                  background: 'rgba(8,8,8,0.92)',
                }}
              >
                <span className="site-header__close-x" aria-hidden="true">
                  <span className="site-header__close-x-line site-header__close-x-line--a" />
                  <span className="site-header__close-x-line site-header__close-x-line--b" />
                </span>
              </button>
            </div>

            <nav aria-label="Menu mobile">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenus}
                  className="site-mobile-panel__link"
                  style={{ color: isActive(href) ? '#f0c040' : '#f5f0e4' }}
                  aria-current={isActive(href) ? 'page' : undefined}
                >
                  {label}
                </Link>
              ))}
            </nav>

            <p className="site-mobile-panel__section-label">Sektor</p>
            <div className="grid grid-cols-2 gap-2">
              {sektorLinks.map(({ href, label, icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenus}
                  className="site-mobile-panel__chip"
                  style={{
                    color: pathname.startsWith(href) ? '#f0c040' : '#d2c9b4',
                  }}
                >
                  <Icon name={icon} size={14} />
                  {label}
                </Link>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/sektor/umkm" onClick={closeMenus} className="btn-primary">
                Direktori UMKM
              </Link>
              {waReady ? (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenus}
                  className="btn-ghost"
                >
                  WhatsApp
                </a>
              ) : null}
              <Link href="/kontak" onClick={closeMenus} className="btn-ghost">
                Kontak
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
