import type { Metadata } from 'next'
import Link from 'next/link'
import SektorCard from '@/components/SektorCard'
import BeritaCard from '@/components/BeritaCard'
import MerapiStatus from '@/components/MerapiStatus'
import beritaData from '@/content/berita.json'
import sektorData from '@/content/sektor.json'

export const metadata: Metadata = {
  title: 'Beranda',
  description: 'Portal digital Desa Plosorejo — data produksi susu, peta wilayah, dan layanan UMKM.',
}

const stats = [
  { label: 'Penduduk',      value: '4.821', unit: 'jiwa' },
  { label: 'KK',            value: '1.347', unit: 'kepala keluarga' },
  { label: 'Produksi Susu', value: '2,8 t', unit: 'per hari' },
  { label: 'UMKM Aktif',    value: '89',    unit: 'usaha' },
  { label: 'Luas Wilayah',  value: '12,6',  unit: 'km²' },
]

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

const quickLinks = [
  { href: '/susu',   emoji: '🥛', title: 'Produksi Susu',  desc: 'Dashboard data harian & bulanan',   accent: 'var(--amber)' },
  { href: '/peta',   emoji: '🗺️', title: 'Peta Desa',      desc: 'Visualisasi interaktif wilayah',    accent: 'var(--green)' },
  { href: '/galeri', emoji: '📸', title: 'Galeri KKN 2026', desc: 'Dokumentasi kegiatan pengabdian',  accent: '#818cf8' },
  { href: '/kontak', emoji: '📬', title: 'Kontak',          desc: 'Hubungi perangkat padukuhan',      accent: '#34d399' },
]

export default function HomePage() {
  const latestBerita = beritaData.slice(0, 3)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-20">

      {/* ── Hero ── */}
      <section className="text-center space-y-6 py-8">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border"
          style={{ borderColor: 'var(--border)', color: 'var(--amber)', backgroundColor: 'rgba(245,158,11,0.08)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" aria-hidden="true" />
          KKN UGM 2026 · Portal Informasi Digital
        </div>

        <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-tight">
          Selamat Datang di{' '}
          <span className="gradient-text">Desa Plosorejo</span>
        </h1>

        <p className="max-w-xl mx-auto text-gray-400 leading-relaxed">
          Portal digital resmi Padukuhan Plosorejo, Kapanewon Cangkringan, Kabupaten Sleman.
          Informasi terpadu tentang warga, UMKM, pertanian, peternakan, dan layanan desa.
        </p>

        {/* Merapi/Semeru status widget */}
        <div className="max-w-md mx-auto">
          <MerapiStatus />
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/profil"
            className="px-5 py-2.5 rounded-lg font-semibold text-sm text-black transition-opacity hover:opacity-85"
            style={{ background: 'var(--gradient)' }}
          >
            Lihat Profil Desa
          </Link>
          <Link
            href="/berita"
            className="px-5 py-2.5 rounded-lg font-semibold text-sm border transition-colors hover:border-gray-500 hover:text-white text-gray-400"
            style={{ borderColor: 'var(--border)' }}
          >
            Baca Berita
          </Link>
        </div>
      </section>

      {/* ── Statistik ── */}
      <section aria-label="Statistik padukuhan">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-5 text-center">
          Padukuhan dalam Angka
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {stats.map(({ label, value, unit }) => (
            <div
              key={label}
              className="rounded-xl border p-4 text-center"
              style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
            >
              <p className="text-2xl font-black gradient-text tabular-nums">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{unit}</p>
              <p className="text-xs text-gray-600 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quick links ── */}
      <section aria-label="Akses cepat">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-5">
          Akses Cepat
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map(({ href, emoji, title, desc, accent }) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl border p-5 flex flex-col gap-3 hover:border-gray-600 transition-colors group"
              style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
            >
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ backgroundColor: `${accent}18` }}
                aria-hidden="true"
              >
                {emoji}
              </span>
              <div>
                <p className="font-bold text-white group-hover:underline underline-offset-2">{title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Sektor Unggulan ── */}
      <section aria-label="Sektor unggulan padukuhan">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h2 className="text-2xl font-black">
            Sektor <span className="gradient-text">Unggulan</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sektorCards.map((s) => (
            <SektorCard key={s.href} {...s} />
          ))}
        </div>
      </section>

      {/* ── Berita Terbaru ── */}
      <section aria-label="Berita terbaru">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h2 className="text-2xl font-black">
            Berita <span className="gradient-text">Terbaru</span>
          </h2>
          <Link
            href="/berita"
            className="text-sm font-medium transition-colors hover:text-white"
            style={{ color: 'var(--amber)' }}
          >
            Lihat semua →
          </Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {latestBerita.map((b) => (
            <BeritaCard
              key={b.slug}
              slug={b.slug}
              judul={b.judul}
              tanggal={b.tanggal}
              kategori={b.kategori}
              ringkasan={b.ringkasan}
            />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="rounded-2xl p-10 text-center space-y-4 border"
        style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(34,197,94,0.08))', borderColor: 'var(--border)' }}
        aria-label="Ajakan bergabung"
      >
        <h2 className="text-2xl font-black">
          Punya usaha di Plosorejo?{' '}
          <span className="gradient-text">Daftarkan sekarang.</span>
        </h2>
        <p className="text-gray-400 max-w-md mx-auto text-sm">
          Tingkatkan visibilitas usaha Anda dan jangkau lebih banyak pelanggan
          melalui portal desa Plosorejo.
        </p>
        <Link
          href="/sektor/umkm"
          className="inline-block px-6 py-3 rounded-lg font-semibold text-sm text-black transition-opacity hover:opacity-90"
          style={{ background: 'var(--gradient)' }}
        >
          Lihat Katalog UMKM
        </Link>
      </section>

    </div>
  )
}
