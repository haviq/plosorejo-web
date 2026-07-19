import type { Metadata } from 'next'
import BeritaCard from '@/components/BeritaCard'
import beritaData from '@/content/berita.json'

export const metadata: Metadata = {
  title: 'Berita',
  description: 'Informasi terkini seputar kegiatan dan pembangunan Padukuhan Plosorejo.',
}

const kategoriList = ['Semua', 'Pertanian', 'Kesehatan', 'KKN', 'Budaya', 'Pendidikan', 'Peternakan']

export default function BeritaPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">

      {/* Header */}
      <section className="space-y-3">
        <h1 className="text-4xl font-black">
          📰 Berita{' '}
          <span className="gradient-text">Padukuhan</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-xl">
          Informasi terkini seputar kegiatan, pembangunan, dan pencapaian warga Padukuhan Plosorejo.
        </p>
      </section>

      {/* Kategori filter — static display only, filtering via URL would require client component */}
      <section aria-label="Kategori berita">
        <div className="flex flex-wrap gap-2">
          {kategoriList.map((k, i) => (
            <span
              key={k}
              className="px-3 py-1 rounded-full text-xs font-medium border"
              style={{
                borderColor: i === 0 ? 'var(--amber)' : 'var(--border)',
                color: i === 0 ? 'var(--amber)' : '#9ca3af',
                backgroundColor: i === 0 ? 'rgba(245,158,11,0.08)' : 'transparent',
              }}
            >
              {k}
            </span>
          ))}
        </div>
      </section>

      {/* Grid berita */}
      <section aria-label="Daftar berita">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {beritaData.map(b => (
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

    </div>
  )
}
