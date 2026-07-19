'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const navLinks = [
  { href: '/',       label: 'Beranda' },
  { href: '/profil', label: 'Profil' },
  { href: '/berita', label: 'Berita' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/kontak', label: 'Kontak' },
]

const sektorLinks = [
  { href: '/sektor/peternakan', label: '🐄 Peternakan' },
  { href: '/sektor/pertanian',  label: '🌾 Pertanian' },
  { href: '/sektor/umkm',       label: '🏪 UMKM' },
  { href: '/sektor/pariwisata', label: '🏔️ Pariwisata' },
  { href: '/sektor/pendidikan', label: '🎓 Pendidikan' },
  { href: '/sektor/kesehatan',  label: '🏥 Kesehatan' },
  { href: '/sektor/budaya',     label: '🎭 Budaya' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sektorOpen, setSektorOpen] = useState(false)
  const sektorRef = useRef<HTMLLIElement>(null)

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close sektor dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sektorRef.current && !sektorRef.current.contains(e.target as Node)) {
        setSektorOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? 'rgba(5,5,5,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group" aria-label="Plosorejo — Halaman Utama">
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

          {/* Desktop nav */}
          <nav aria-label="Navigasi utama" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="px-3 py-2 text-sm rounded-md transition-colors"
                    style={{ color: 'var(--muted)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}

              {/* Sektor dropdown */}
              <li ref={sektorRef} className="relative">
                <button
                  onClick={() => setSektorOpen(v => !v)}
                  className="px-3 py-2 text-sm rounded-md transition-colors flex items-center gap-1"
                  style={{ color: sektorOpen ? 'var(--gold)' : 'var(--muted)' }}
                  aria-expanded={sektorOpen}
                  aria-haspopup="true"
                >
                  Sektor
                  <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="currentColor"
                    className="transition-transform duration-200"
                    style={{ transform: sektorOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    aria-hidden="true"
                  >
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Glassmorphism dropdown panel */}
                {sektorOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-64 rounded-2xl p-3 shadow-2xl z-50"
                    style={{
                      background: 'rgba(13,13,13,0.94)',
                      backdropFilter: 'blur(24px)',
                      WebkitBackdropFilter: 'blur(24px)',
                      border: '1px solid rgba(212,175,55,0.15)',
                      boxShadow: '0 24px 64px rgba(0,0,0,0.8), 0 0 0 1px rgba(212,175,55,0.05)',
                    }}
                    role="menu"
                  >
                    <p className="section-label px-2 pb-2 mb-1" style={{ borderBottom: '1px solid var(--border)' }}>
                      Sektor Padukuhan
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {sektorLinks.map(({ href, label }) => (
                        <Link
                          key={href}
                          href={href}
                          role="menuitem"
                          onClick={() => setSektorOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all"
                          style={{ color: 'var(--muted)' }}
                          onMouseEnter={e => {
                            e.currentTarget.style.color = 'var(--text)'
                            e.currentTarget.style.background = 'rgba(212,175,55,0.08)'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.color = 'var(--muted)'
                            e.currentTarget.style.background = 'transparent'
                          }}
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            </ul>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--text)' }}
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={mobileOpen}
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
      </header>

      {/* Mobile full-screen overlay */}
      <div
        className="fixed inset-0 z-40 flex flex-col md:hidden transition-all duration-300"
        style={{
          backgroundColor: 'rgba(5,5,5,0.98)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
        }}
        aria-hidden={!mobileOpen}
      >
        <div className="flex-1 flex flex-col justify-center items-center gap-2 px-8 pt-20">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="text-3xl font-light py-3 transition-colors"
              style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                color: 'var(--text)',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text)')}
            >
              {label}
            </Link>
          ))}

          <div className="w-px h-8 my-2" style={{ backgroundColor: 'var(--border)' }} />

          <p className="section-label mb-2">Sektor</p>
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            {sektorLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="text-sm py-2 px-3 rounded-xl text-center transition-colors"
                style={{
                  color: 'var(--muted)',
                  border: '1px solid var(--border)',
                }}
              >
                {label}
              </Link>
            ))}
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
