import Link from 'next/link'
import { getSiteSettings } from '@/lib/data'
import { formatWaDisplay, isPlaceholderWa, waLink } from '@/lib/site'

const quickLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/profil', label: 'Profil' },
  { href: '/berita', label: 'Berita' },
  { href: '/layanan', label: 'Layanan' },
  { href: '/agenda', label: 'Agenda' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/peta', label: 'Peta' },
  { href: '/kontak', label: 'Kontak' },
]

export default async function Footer() {
  const site = await getSiteSettings()

  return (
    <footer
      className="border-t mt-auto relative overflow-hidden"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--s1)' }}
    >
      {/* garis emas tipis di atas */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(212,175,55,0.55), transparent)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col items-center gap-6 text-center">

        {/* Baris 1 — Brand + info singkat */}
        <div className="space-y-1">
          <p
            className="font-black text-lg tracking-[0.15em] uppercase"
            style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              color: 'var(--gold)',
            }}
          >
            PLOSOREJO
          </p>
          <p className="text-xs tracking-[0.18em] uppercase" style={{ color: 'var(--muted)' }}>
            Padukuhan Digital · Umbulharjo · Cangkringan · Sleman
          </p>
          {site.email && (
            <p className="text-xs" style={{ color: 'var(--muted2)' }}>
              {site.email}
            </p>
          )}
        </div>

        {/* Baris 2 — Quick links horizontal */}
        <nav aria-label="Footer navigasi">
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-xs transition-colors hover:text-[var(--text)]"
                  style={{ color: 'var(--muted)' }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* WA badge jika tersedia */}
        {!isPlaceholderWa(site.whatsapp) && (
          <a
            href={waLink(site.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="badge text-xs"
            style={{ color: 'var(--gold)', background: 'var(--gold-glow)' }}
          >
            WhatsApp {formatWaDisplay(site.whatsapp)}
          </a>
        )}
      </div>

      {/* Copyright bar */}
      <div
        className="border-t px-6 py-3 text-center text-xs"
        style={{ borderColor: 'var(--border)', color: 'var(--muted2)' }}
      >
        © {new Date().getFullYear()} Padukuhan Plosorejo · Portal Resmi Padukuhan Digital ·{' '}
        <span title="Platform ini dibangun bersama KKN UNRIYO 2026">KKN UNRIYO 2026</span>
      </div>
    </footer>
  )
}
