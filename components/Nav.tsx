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
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sektorOpen, setSektorOpen] = useState(false)
  const sektorRef = useRef<HTMLLIElement>(null)

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

  useEffect(() => {
    // Always release scroll lock when route changes so map interaction
    // never permanently blocks navigation / body scroll.
    document.body.style.removeProperty('overflow')
    document.documentElement.style.removeProperty('overflow')
    setMobileOpen(false)
    setSektorOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const closeMenus = () => {
    setMobileOpen(false)
    setSektorOpen(false)
  }

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <header
        className="site-header"
        data-nav-build="header-inline-v3"
        style={{
          backgroundColor: scrolled || mobileOpen ? 'var(--nav-bg)' : 'rgba(8,8,8,0.72)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: '1px solid var(--border)',
          boxShadow: scrolled ? 'var(--shadow-card)' : 'none',
        }}
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
                  onClick={() => setSektorOpen((v) => !v)}
                  aria-expanded={sektorOpen}
                >
                  Sektor
                </button>
                {sektorOpen && (
                  <div className="site-header__dropdown">
                    {sektorLinks.map(({ href, label, icon }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={closeMenus}
                        className="site-header__dropdown-item"
                        style={{
                          color: pathname.startsWith(href) ? 'var(--gold)' : 'var(--text)',
                          background: pathname.startsWith(href) ? 'var(--gold-glow)' : 'transparent',
                        }}
                      >
                        <Icon name={icon} size={16} />
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            </ul>
          </nav>

          <div className="site-header__desktop-actions">
            <ThemeToggle />
            <Link href="/sektor/umkm" onClick={closeMenus} className="btn-ghost !py-2 !px-4 !text-xs">
              UMKM
            </Link>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !py-2 !px-4 !text-xs"
            >
              WhatsApp
            </a>
          </div>

          {/* Always in DOM (SSR) — never portal-only */}
          <div className="site-header__mobile-actions">
            <ThemeToggle />
            <button
              type="button"
              className="site-header__icon-btn touch-manipulation"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-panel"
            >
              <span
                className="site-header__burger-line"
                style={{
                  transform: mobileOpen ? 'rotate(45deg) translate(0, 7px)' : 'none',
                }}
              />
              <span
                className="site-header__burger-line"
                style={{ opacity: mobileOpen ? 0 : 1 }}
              />
              <span
                className="site-header__burger-line"
                style={{
                  transform: mobileOpen ? 'rotate(-45deg) translate(0, -7px)' : 'none',
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen ? (
        <div
          id="mobile-nav-panel"
          className="site-mobile-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
        >
          <div className="site-mobile-panel__inner">
            <p className="section-label mb-4">Menu</p>
            <div className="space-y-1 mb-8">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenus}
                  className="site-mobile-panel__link"
                  style={{ color: isActive(href) ? 'var(--gold)' : 'var(--text)' }}
                >
                  {label}
                </Link>
              ))}
            </div>

            <p className="section-label mb-3">Sektor</p>
            <div className="grid grid-cols-2 gap-2">
              {sektorLinks.map(({ href, label, icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenus}
                  className="site-mobile-panel__chip"
                  style={{
                    color: pathname.startsWith(href) ? 'var(--gold)' : 'var(--muted)',
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
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenus}
                className="btn-ghost"
              >
                WhatsApp
              </a>
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
