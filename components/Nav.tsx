import Link from 'next/link'

const navGroups = [
  { href: '/',       label: 'Beranda',      group: 'main' },
  { href: '/profil', label: 'Profil',        group: 'main' },
  { href: '/susu',   label: 'Produksi Susu', group: 'main' },
  { href: '/peta',   label: 'Peta Desa',     group: 'main' },
  { href: '/berita', label: 'Berita',         group: 'main' },
  { href: '/galeri', label: 'Galeri',         group: 'main' },
  { href: '/kontak', label: 'Kontak',         group: 'main' },
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
  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{ backgroundColor: 'rgba(14,14,14,0.85)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight flex-shrink-0">
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center text-black text-sm font-black"
            style={{ background: 'var(--gradient)' }}
            aria-hidden="true"
          >
            P
          </span>
          <span className="gradient-text">Plosorejo</span>
        </Link>

        {/* Nav links */}
        <nav aria-label="Navigasi utama" className="overflow-x-auto">
          <ul className="flex items-center gap-0.5 min-w-max">
            {navGroups.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="px-3 py-1.5 rounded-md text-sm text-gray-400 hover:text-white transition-colors hover:bg-white/5 whitespace-nowrap"
                >
                  {label}
                </Link>
              </li>
            ))}

            {/* Sektor dropdown-style group */}
            <li className="relative group">
              <button
                className="px-3 py-1.5 rounded-md text-sm text-gray-400 hover:text-white transition-colors hover:bg-white/5 flex items-center gap-1"
                aria-haspopup="true"
                aria-label="Menu sektor"
              >
                Sektor
                <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              <div
                className="absolute right-0 top-full mt-1 w-48 rounded-xl border shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50"
                style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
                role="menu"
              >
                {sektorLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors first:rounded-t-xl last:rounded-b-xl"
                    role="menuitem"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
