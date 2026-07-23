import Link from 'next/link'

const quickLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/profil', label: 'Profil' },
  { href: '/berita', label: 'Berita' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/peta', label: 'Peta' },
  { href: '/kontak', label: 'Kontak' },
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

export default function Footer() {
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
            Portal informasi Padukuhan Plosorejo, Umbulharjo, Cangkringan, Sleman.
            Sentra sapi perah, UMKM, dan pariwisata lereng Merapi.
          </p>
          <p className="text-xs" style={{ color: 'var(--muted2)' }}>
            Jl. Balong, Umbulharjo, Cangkringan, Sleman, DIY 55583
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="badge" style={{ color: 'var(--muted)', background: 'var(--surface-soft)' }}>
              KKN UNRIYO 2026
            </span>
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
          <ul className="grid grid-cols-2 gap-2">
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
          <p className="section-label mb-4">Hubungi</p>
          <div className="space-y-2 text-sm" style={{ color: 'var(--muted)' }}>
            <p>WhatsApp: +62 812-3456-7890</p>
            <p>Email: info@plosorejo.desa.id</p>
            <p>Jam layanan: 08.00 – 15.00 WIB</p>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <a
              href="https://wa.me/6281234567890?text=Halo%20Padukuhan%20Plosorejo"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Chat WhatsApp
            </a>
            <Link href="/kontak" className="btn-ghost">
              Kontak
            </Link>
          </div>
        </div>
      </div>

      <div
        className="border-t px-6 py-5 text-center text-xs"
        style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
      >
        © {new Date().getFullYear()} Padukuhan Plosorejo · KKN UNRIYO Unit 9 2026
      </div>
    </footer>
  )
}
