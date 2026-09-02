import type { Metadata } from 'next'
import Link from 'next/link'
import MerapiHero from '@/components/MerapiHero'
import MotionSection from '@/components/MotionSection'
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
  { href: '/sektor/peternakan', icon: sektorData.peternakan.icon, nama: sektorData.peternakan.nama, deskripsi: sektorData.peternakan.deskripsi, stats: sektorData.peternakan.stats, accent: 'amber' as const },
  { href: '/sektor/pertanian', icon: sektorData.pertanian.icon, nama: sektorData.pertanian.nama, deskripsi: sektorData.pertanian.deskripsi, stats: sektorData.pertanian.stats, accent: 'green' as const },
  { href: '/sektor/umkm', icon: sektorData.umkm.icon, nama: sektorData.umkm.nama, deskripsi: sektorData.umkm.deskripsi, stats: sektorData.umkm.stats, accent: 'indigo' as const },
  { href: '/sektor/pariwisata', icon: sektorData.pariwisata.icon, nama: sektorData.pariwisata.nama, deskripsi: sektorData.pariwisata.deskripsi, stats: sektorData.pariwisata.stats, accent: 'amber' as const },
  { href: '/sektor/pendidikan', icon: sektorData.pendidikan.icon, nama: sektorData.pendidikan.nama, deskripsi: sektorData.pendidikan.deskripsi, stats: sektorData.pendidikan.stats, accent: 'green' as const },
  { href: '/sektor/kesehatan', icon: sektorData.kesehatan.icon, nama: sektorData.kesehatan.nama, deskripsi: sektorData.kesehatan.deskripsi, stats: sektorData.kesehatan.stats, accent: 'green' as const },
  { href: '/sektor/budaya', icon: sektorData.budaya.icon, nama: sektorData.budaya.nama, deskripsi: sektorData.budaya.deskripsi, stats: sektorData.budaya.stats, accent: 'amber' as const },
]

const potensiCards = [
  { href: '/sektor/peternakan', emoji: '🐄', kategori: 'Peternakan', headline: '1.631 L/hari', deskripsi: 'Susu segar dari 47 peternak aktif Koperasi Plosorejo' },
  { href: '/sektor/pertanian', emoji: '🌾', kategori: 'Pertanian', headline: '52 ha sawah', deskripsi: 'Padi, salak pondoh 18 ha, dan sayuran organik' },
  { href: '/sektor/umkm', emoji: '🏪', kategori: 'UMKM', headline: '12 usaha aktif', deskripsi: 'Kuliner, kerajinan batik, dan jasa warga' },
  { href: '/sektor/pariwisata', emoji: '🏞️', kategori: 'Pariwisata', headline: '4 destinasi', deskripsi: 'Agrowisata salak, peternakan, dan trekking Merapi' },
]

const beritaTerbaru = (beritaData as { slug: string; judul: string; tanggal: string; kategori: string; ringkasan: string; isi: string }[]).slice(0, 3)

export default function HomePage() {
  return (
    <div style={{ backgroundColor: 'var(--bg)' }}>
      <MerapiHero />

      {/* Merapi status */}
      <div className="page-shell -mt-10 relative" style={{ zIndex: 5 }}>
        <MerapiStatusServer />
      </div>

      {/* Stats bar */}
      <MotionSection className="page-shell mt-10" delay={0.05}>
        <StatsBar />
      </MotionSection>

      {/* Potensi unggulan */}
      <MotionSection className="page-shell mt-16 space-y-6" delay={0.1}>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="section-label">Potensi Unggulan</p>
            <h2 className="text-2xl md:text-3xl font-black" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Empat Pilar <span className="gold-text">Ekonomi Desa</span>
            </h2>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {potensiCards.map((c) => (
            <Link key={c.href + c.kategori} href={c.href} className="card-surface p-5 flex flex-col gap-3">
              <span className="text-3xl" aria-hidden="true">{c.emoji}</span>
              <span className="badge self-start" style={{ color: 'var(--gold)', backgroundColor: 'var(--gold-glow)' }}>{c.kategori}</span>
              <p className="text-xl font-black gold-text">{c.headline}</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{c.deskripsi}</p>
            </Link>
          ))}
        </div>
      </MotionSection>

      {/* 7 Sektor */}
      <MotionSection className="page-shell mt-16 space-y-6" delay={0.1}>
        <div>
          <p className="section-label">Sektor Kehidupan</p>
          <h2 className="text-2xl md:text-3xl font-black" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Tujuh Sektor <span className="gold-text">Padukuhan</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sektorCards.map((s) => (
            <SektorCard key={s.href} {...s} />
          ))}
        </div>
      </MotionSection>

      {/* Berita terbaru */}
      <MotionSection className="page-shell mt-16 space-y-6" delay={0.1}>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="section-label">Kabar Terkini</p>
            <h2 className="text-2xl md:text-3xl font-black" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Berita <span className="gold-text">Terbaru</span>
            </h2>
          </div>
          <Link href="/berita" className="btn-ghost text-xs">Semua Berita →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {beritaTerbaru.map((b) => (
            <BeritaCard key={b.slug} {...b} />
          ))}
        </div>
      </MotionSection>

      {/* CTA */}
      <MotionSection className="page-shell my-16" delay={0.1}>
        <div
          className="card-surface p-8 md:p-12 text-center space-y-5"
          style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(34,197,94,0.06))' }}
        >
          <h2 className="text-2xl md:text-3xl font-black" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Kenali Plosorejo <span className="gold-text">Lebih Dekat</span>
          </h2>
          <p className="text-sm max-w-lg mx-auto" style={{ color: 'var(--muted)' }}>
            Dari susu segar pagi hari hingga festival budaya tahunan — ada cerita di setiap sudut padukuhan.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/profil" className="btn-primary">Profil Padukuhan</Link>
            <Link href="/kontak" className="btn-ghost">Hubungi Kami</Link>
          </div>
        </div>
      </MotionSection>
    </div>
  )
}
