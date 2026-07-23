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
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled || mobileOpen ? 'var(--nav-bg)' : 'transparent',
          backdropFilter: scrolled || mobileOpen ? 'blur(18px)' : 'none',
          WebkitBackdropFilter: scrolled || mobileOpen ? 'blur(18px)' : 'none',
          borderBottom:
            scrolled || mobileOpen ? '1px solid var(--border)' : '1px solid transparent',
          boxShadow: scrolled ? 'var(--shadow-card)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            onClick={closeMenus}
            className="flex flex-col leading-none group"
            aria-label="Plosorejo — Halaman Utama"
          >
            <span
              className="font-black text-xl tracking-[0.15em] uppercase transition-opacity group-hover:opacity-80"
              style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                color: 'var(--gold)',
              }}
            >
              PLOSOREJO
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase mt-0.5" style={{ color: 'var(--muted)' }}>
              Padukuhan Digital
            </span>
          </Link>

          <nav aria-label="Navigasi utama" className="hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {navLinks.map(({ href, label }) => {
                const active = isActive(href)
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={closeMenus}
                      className="relative px-3 py-2 text-sm rounded-lg transition-colors"
                      style={{ color: active ? 'var(--gold)' : 'var(--muted)' }}
                      onMouseEnter={(e) => {
                        if (!active) e.currentTarget.style.color = 'var(--text)'
                      }}
                      onMouseLeave={(e) => {
                        if (!active) e.currentTarget.style.color = 'var(--muted)'
                      }}
                    >
                      {label}
                      {active && (
                        <span
                          className="absolute left-3 right-3 -bottom-0.5 h-px"
                          style={{ background: 'var(--gold)' }}
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  </li>
                )
              })}

              <li ref={sektorRef} className="relative">
                <button
                  onClick={() => setSektorOpen((v) => !v)}
                  className="px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-1"
                  style={{
                    color:
                      sektorOpen || pathname.startsWith('/sektor')
                        ? 'var(--gold)'
                        : 'var(--muted)',
                  }}
                  aria-expanded={sektorOpen}
                  aria-haspopup="true"
                >
                  Sektor
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="currentColor"
                    className="transition-transform duration-200"
                    style={{ transform: sektorOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    aria-hidden="true"
                  >
                    <path
                      d="M2 4l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {sektorOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-72 rounded-2xl p-3 shadow-2xl z-50"
                    style={{
                      background: 'rgba(13,13,13,0.96)',
                      backdropFilter: 'blur(24px)',
                      WebkitBackdropFilter: 'blur(24px)',
                      border: '1px solid rgba(212,175,55,0.18)',
                      boxShadow:
                        '0 24px 64px rgba(0,0,0,0.8), 0 0 0 1px rgba(212,175,55,0.05)',
                    }}
                    role="menu"
                  >
                    <p
                      className="section-label px-2 pb-2 mb-2"
                      style={{ borderBottom: '1px solid var(--border)' }}
                    >
                      Sektor Padukuhan
                    </p>
                    <div className="grid grid-cols-1 gap-1">
                      {sektorLinks.map(({ href, label, icon }) => (
                        <Link
                          key={href}
                          href={href}
                          role="menuitem"
                          onClick={closeMenus}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all"
                          style={{
                            color: pathname.startsWith(href) ? 'var(--gold)' : 'var(--muted)',
                            background: pathname.startsWith(href)
                              ? 'var(--gold-glow)'
                              : 'transparent',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--gold-glow)'
                            e.currentTarget.style.color = 'var(--text)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = pathname.startsWith(href)
                              ? 'var(--gold-glow)'
                              : 'transparent'
                            e.currentTarget.style.color = pathname.startsWith(href)
                              ? 'var(--gold)'
                              : 'var(--muted)'
                          }}
                        >
                          <Icon name={icon} size={16} />
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            </ul>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
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

          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
            className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={mobileOpen}
            style={{ border: '1px solid var(--border)', background: 'var(--surface-soft)' }}
          >
            <span
              className="block w-5 h-0.5 transition-all duration-300 origin-center"
              style={{
                backgroundColor: 'var(--text)',
                transform: mobileOpen ? 'rotate(45deg) translate(0, 8px)' : 'none',
              }}
            />
            <span
              className="block w-5 h-0.5 transition-all duration-300"
              style={{
                backgroundColor: 'var(--text)',
                opacity: mobileOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-5 h-0.5 transition-all duration-300 origin-center"
              style={{
                backgroundColor: 'var(--text)',
                transform: mobileOpen ? 'rotate(-45deg) translate(0, -8px)' : 'none',
              }}
            />
          </button>
          </div>
        </div>
      </header>

      <div
        className="fixed inset-0 z-40 flex flex-col lg:hidden transition-all duration-300"
        style={{
          background: 'var(--overlay-scrim)',
          opacity: mobileOpen ? 1 : 0,
          // When closed: fully remove from hit-testing (opacity alone still blocked clicks on some Android WebViews)
          pointerEvents: mobileOpen ? 'auto' : 'none',
          visibility: mobileOpen ? 'visible' : 'hidden',
          transform: mobileOpen ? 'translateY(0)' : 'translateY(-8px)',
        }}
        aria-hidden={!mobileOpen}
        inert={!mobileOpen ? true : undefined}
      >
        <div className="pt-24 px-6 pb-8 flex-1 overflow-y-auto">
          <p className="section-label mb-4">Menu</p>
          <div className="space-y-2 mb-8">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMenus}
                className="block text-2xl font-semibold py-2"
                style={{
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                  color: isActive(href) ? 'var(--gold)' : 'var(--text)',
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="h-px w-full mb-6" style={{ backgroundColor: 'var(--border)' }} />

          <p className="section-label mb-3">Sektor</p>
          <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
            {sektorLinks.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMenus}
                className="text-sm py-2.5 px-3 rounded-xl text-center transition-colors flex items-center justify-center gap-2"
                style={{
                  color: pathname.startsWith(href) ? 'var(--gold)' : 'var(--muted)',
                  border: '1px solid var(--border)',
                  background: pathname.startsWith(href)
                    ? 'var(--gold-glow)'
                    : 'var(--surface-soft)',
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

        <div className="pb-10 text-center">
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            Padukuhan Plosorejo · Cangkringan · Sleman
          </p>
        </div>
      </div>
    </>
  )
}
