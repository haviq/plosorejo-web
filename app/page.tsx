import type { Metadata } from 'next'
import Link from 'next/link'
import SektorCard from '@/components/SektorCard'
import BeritaCard from '@/components/BeritaCard'
import MerapiStatusServer from '@/components/MerapiStatusServer'
import StatsBar from '@/components/StatsBar'
import beritaData from '@/content/berita.json'
import sektorData from '@/content/sektor.json'

export const metadata: Metadata = {
  title: 'Beranda',
  description:
    'Portal digital Padukuhan Plosorejo — sentra sapi perah, UMKM, dan pariwisata lereng Merapi, Cangkringan, Sleman.',
}

const sektorCards = [
  {
    href: '/sektor/peternakan',
    icon: sektorData.peternakan.icon,
    nama: sektorData.peternakan.nama,
    deskripsi: sektorData.peternakan.deskripsi,
    stats: sektorData.peternakan.stats,
    accent: 'amber' as const,
  },
  {
    href: '/sektor/pertanian',
    icon: sektorData.pertanian.icon,
    nama: sektorData.pertanian.nama,
    deskripsi: sektorData.pertanian.deskripsi,
    stats: sektorData.pertanian.stats,
    accent: 'green' as const,
  },
  {
    href: '/sektor/umkm',
    icon: sektorData.umkm.icon,
    nama: sektorData.umkm.nama,
    deskripsi: sektorData.umkm.deskripsi,
    stats: sektorData.umkm.stats,
    accent: 'indigo' as const,
  },
  {
    href: '/sektor/pariwisata',
    icon: sektorData.pariwisata.icon,
    nama: sektorData.pariwisata.nama,
    deskripsi: sektorData.pariwisata.deskripsi,
    stats: sektorData.pariwisata.stats,
    accent: 'amber' as const,
  },
  {
    href: '/sektor/pendidikan',
    icon: sektorData.pendidikan.icon,
    nama: sektorData.pendidikan.nama,
    deskripsi: sektorData.pendidikan.deskripsi,
    stats: sektorData.pendidikan.stats,
    accent: 'green' as const,
  },
  {
    href: '/sektor/kesehatan',
    icon: sektorData.kesehatan.icon,
    nama: sektorData.kesehatan.nama,
    deskripsi: sektorData.kesehatan.deskripsi,
    stats: sektorData.kesehatan.stats,
    accent: 'green' as const,
  },
  {
    href: '/sektor/budaya',
    icon: sektorData.budaya.icon,
    nama: sektorData.budaya.nama,
    deskripsi: sektorData.budaya.deskripsi,
    stats: sektorData.budaya.stats,
    accent: 'amber' as const,
  },
]

const potensiCards = [
  {
    href: '/sektor/peternakan',
    emoji: '🐄',
    kategori: 'Peternakan',
    headline: '1.240 L/hari',
    sub: 'Produksi susu segar Grade A',
    img: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&q=80',
    imgAlt: 'Sapi perah Friesian Holstein',
  },
  {
    href: '/sektor/umkm',
    emoji: '🏪',
    kategori: 'UMKM',
    headline: '89 Usaha Aktif',
    sub: 'Kuliner, kerajinan, & agribisnis',
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    imgAlt: 'Pasar dan produk UMKM lokal',
  },
  {
    href: '/sektor/pariwisata',
    emoji: '🏔️',
    kategori: 'Pariwisata',
    headline: '3 Destinasi',
    sub: 'Agrowisata & trekking Merapi',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    imgAlt: 'Pemandangan alam lereng Merapi',
  },
]

export default function HomePage() {
  return (
    <div style={{ backgroundColor: 'var(--bg)' }}>

      {/* ─── HERO ──────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden"
        aria-label="Hero — Padukuhan Plosorejo"
      >
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=90"
          alt="Pemandangan lereng Gunung Merapi"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
          fetchPriority="high"
        />

        {/* Layered overlays for dramatic depth */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 1,
            background:
              'linear-gradient(to bottom, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.3) 40%, rgba(5,5,5,0.75) 75%, rgba(5,5,5,1) 100%)',
          }}
        />
        {/* Subtle vignette sides */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 2,
            background:
              'radial-gradient(ellipse at center, transparent 50%, rgba(5,5,5,0.6) 100%)',
          }}
        />

        {/* Hero content */}
        <div className="relative px-6 max-w-4xl mx-auto flex flex-col items-center gap-6" style={{ zIndex: 3 }}>

          {/* Location label */}
          <p
            className="section-label"
            style={{ letterSpacing: '0.25em' }}
          >
            Padukuhan Plosorejo · Cangkringan · Sleman
          </p>

          {/* Main headline */}
          <h1
            className="leading-tight font-black"
            style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 'clamp(3rem, 8vw, 5.5rem)',
              color: 'var(--text)',
            }}
          >
            Desa yang Hidup,
            <br />
            <span className="gold-text">Potensi yang Nyata</span>
          </h1>

          {/* Address */}
          <p
            className="text-sm md:text-base"
            style={{ color: 'var(--muted)', letterSpacing: '0.03em' }}
          >
            Jl. Balong, Umbulharjo, Cangkringan, Sleman, DIY 55583
          </p>

          {/* Merapi status widget */}
          <div className="w-full max-w-sm">
            <MerapiStatusServer />
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <Link
              href="/profil"
              className="px-7 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 hover:brightness-110"
              style={{
                backgroundColor: 'var(--gold)',
                color: '#050505',
                boxShadow: '0 0 24px rgba(212,175,55,0.35)',
              }}
            >
              Jelajahi Padukuhan
            </Link>
            <Link
              href="/peta"
              className="px-7 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
              style={{
                border: '1px solid var(--gold)',
                color: 'var(--gold)',
                background: 'rgba(212,175,55,0.05)',
              }}
            >
              Lihat Peta
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ zIndex: 3 }}
          aria-hidden="true"
        >
          <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--muted)' }}>
            Scroll
          </span>
          <div
            className="w-px h-8 animate-pulse"
            style={{ backgroundColor: 'var(--gold-dim)' }}
          />
        </div>
      </section>

      {/* ─── STATS BAR ─────────────────────────────────────────────────── */}
      <StatsBar />

      {/* ─── POTENSI UNGGULAN ──────────────────────────────────────────── */}
      <section
        className="py-24 px-6"
        aria-labelledby="potensi-heading"
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="section-label mb-3">Potensi Unggulan</p>
            <h2
              id="potensi-heading"
              className="font-bold text-3xl md:text-4xl"
              style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                color: 'var(--text)',
              }}
            >
              Kekuatan Plosorejo
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {potensiCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group relative rounded-2xl overflow-hidden block"
                style={{ aspectRatio: '4/5' }}
                aria-label={`${card.kategori}: ${card.headline}`}
              >
                {/* Photo background */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.img}
                  alt={card.imgAlt}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.5) 50%, rgba(5,5,5,0.15) 100%)',
                  }}
                />

                {/* Gold glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(to top, rgba(212,175,55,0.12) 0%, transparent 60%)',
                  }}
                />

                {/* Card content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg" aria-hidden="true">{card.emoji}</span>
                    <span className="section-label">{card.kategori}</span>
                  </div>
                  <p
                    className="font-black text-2xl mb-1 transition-transform duration-300 group-hover:-translate-y-1"
                    style={{
                      fontFamily: 'var(--font-playfair), Georgia, serif',
                      color: 'var(--text)',
                    }}
                  >
                    {card.headline}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    {card.sub}
                  </p>
                  <div
                    className="mt-4 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                    style={{ color: 'var(--gold)' }}
                  >
                    Selengkapnya
                    <span aria-hidden="true">→</span>
                  </div>
                </div>

                {/* Corner border accent */}
                <div
                  className="absolute top-4 right-4 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    borderTop: '1.5px solid var(--gold)',
                    borderRight: '1.5px solid var(--gold)',
                  }}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SEKTOR GRID ───────────────────────────────────────────────── */}
      <section
        className="py-24 px-6"
        style={{ backgroundColor: 'var(--s1)' }}
        aria-labelledby="sektor-heading"
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="section-label mb-3">Sektor Padukuhan</p>
            <h2
              id="sektor-heading"
              className="font-bold text-3xl md:text-4xl"
              style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                color: 'var(--text)',
              }}
            >
              7 Sektor Kehidupan
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sektorCards.map((card) => (
              <SektorCard key={card.href} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── BERITA TERBARU ────────────────────────────────────────────── */}
      <section
        className="py-24 px-6"
        aria-labelledby="berita-heading"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="section-label mb-3">Kabar Padukuhan</p>
              <h2
                id="berita-heading"
                className="font-bold text-3xl md:text-4xl"
                style={{
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                  color: 'var(--text)',
                }}
              >
                Berita Terbaru
              </h2>
            </div>
            <Link
              href="/berita"
              className="text-sm font-medium transition-colors hidden sm:flex items-center gap-1"
              style={{ color: 'var(--gold)' }}
            >
              Lihat Semua
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(beritaData as Array<{
              slug: string
              judul: string
              tanggal: string
              kategori: string
              ringkasan: string
            }>)
              .slice(0, 3)
              .map((item) => (
                <BeritaCard
                  key={item.slug}
                  slug={item.slug}
                  judul={item.judul}
                  tanggal={item.tanggal}
                  kategori={item.kategori}
                  ringkasan={item.ringkasan}
                />
              ))}
          </div>

          <div className="mt-8 sm:hidden text-center">
            <Link
              href="/berita"
              className="text-sm font-medium"
              style={{ color: 'var(--gold)' }}
            >
              Lihat Semua Berita →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ───────────────────────────────────────────────── */}
      <section
        className="relative py-32 px-6 overflow-hidden text-center"
        aria-label="Daftarkan UMKM Anda"
      >
        {/* Background photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80"
          alt="Ladang sawah hijau subur"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        />
        <div
          className="absolute inset-0"
          style={{
            zIndex: 1,
            background: 'rgba(5,5,5,0.82)',
          }}
        />
        {/* Gold radial glow */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 2,
            background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(212,175,55,0.1) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-2xl mx-auto" style={{ zIndex: 3 }}>
          <p className="section-label mb-4">Bergabung</p>
          <h2
            className="font-black mb-4"
            style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 'clamp(2rem, 5vw, 3.25rem)',
              color: 'var(--text)',
              lineHeight: 1.2,
            }}
          >
            Punya usaha di{' '}
            <span className="gold-text">Plosorejo?</span>
          </h2>
          <p
            className="text-base mb-8 max-w-md mx-auto leading-relaxed"
            style={{ color: 'var(--muted)' }}
          >
            Daftarkan usaha Anda ke direktori digital Padukuhan Plosorejo.
            Jangkau lebih banyak pelanggan dan akses program pemberdayaan UMKM.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/sektor/umkm"
              className="px-8 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 hover:brightness-110"
              style={{
                backgroundColor: 'var(--gold)',
                color: '#050505',
                boxShadow: '0 0 32px rgba(212,175,55,0.3)',
              }}
            >
              Daftar UMKM
            </Link>
            <Link
              href="/kontak"
              className="px-8 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
              style={{
                border: '1px solid var(--border)',
                color: 'var(--text)',
                background: 'rgba(255,255,255,0.04)',
              }}
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
