import Link from 'next/link'
import { getSiteSettings } from '@/lib/data'
import { formatWaDisplay, waLink } from '@/lib/site'

const quickLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/profil', label: 'Profil' },
  { href: '/berita', label: 'Berita' },
  { href: '/layanan', label: 'Layanan' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/peta', label: 'Peta' },
  { href: '/kontak', label: 'Kontak' },
  { href: '/kkn', label: 'Arsip KKN' },
]

const sektorLinks = [
  { href: '/sektor/peternakan', label: 'Peternakan' },
  { href: '/sektor/pertanian', label: 'Pertanian' },
  { href: '/sektor/umkm', label: 'UMKM' },
  { href: '/sektor/pariwisata', label: 'Pariwisata' },
  { href: '/sektor/pendidikan', label: 'Pendidikan' },
  { href: '/sektor/kesehatan', label: 'Kesehatan' },
  { href: '/sektor/budaya', label: 'Budaya' },
  { href: '/susu', label: 'Produksi Susu' },
]

export default async function Footer() {
  const site = await getSiteSettings()

  return (
    <footer
      className="border-t mt-auto relative overflow-hidden"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--s1)' }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(212,175,55,0.55), transparent)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div>
            <p
              className="font-black text-xl tracking-[0.15em] uppercase"
              style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                color: 'var(--gold)',
              }}
            >
              PLOSOREJO
            </p>
            <p className="text-xs tracking-[0.18em] uppercase mt-1" style={{ color: 'var(--muted)' }}>
              Padukuhan Digital
            </p>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            {site.tagline}. Portal informasi Padukuhan Plosorejo, Umbulharjo, Cangkringan, Sleman.
          </p>
          <p className="text-xs" style={{ color: 'var(--muted2)' }}>
            {site.alamat}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="badge" style={{ color: 'var(--muted)', background: 'var(--surface-soft)' }}>
              KKN UNRIYO 2026
            </span>
            <a
              href={waLink(site.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="badge"
              style={{ color: 'var(--gold)', background: 'var(--gold-glow)' }}
            >
              WA {formatWaDisplay(site.whatsapp)}
            </a>
          </div>
        </div>

        <div>
          <p className="section-label mb-4">Navigasi</p>
          <ul className="space-y-2">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm transition-colors hover:text-[var(--text)]"
                  style={{ color: 'var(--muted)' }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="section-label mb-4">Sektor</p>
          <ul className="space-y-2">
            {sektorLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm transition-colors hover:text-[var(--text)]"
                  style={{ color: 'var(--muted)' }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <p className="section-label mb-1">Kontak</p>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{site.jamLayanan}</p>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{site.email}</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/layanan" className="btn-ghost text-xs px-3 py-2">
              Layanan
            </Link>
            <Link href="/kontak" className="btn-primary text-xs px-3 py-2">
              Hubungi
            </Link>
          </div>
          <p className="text-xs" style={{ color: 'var(--muted2)' }}>
            Admin konten: <Link href="/studio" className="underline" style={{ color: 'var(--gold)' }}>/studio</Link>
          </p>
        </div>
      </div>

      <div
        className="border-t px-6 py-4 text-center text-xs"
        style={{ borderColor: 'var(--border)', color: 'var(--muted2)' }}
      >
        © {new Date().getFullYear()} Padukuhan Plosorejo · Dibangun bersama KKN UNRIYO Unit 9
      </div>
    </footer>
  )
}
