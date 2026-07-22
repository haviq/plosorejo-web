import type { Metadata } from 'next'
import MapLoader from './MapLoader'

export const metadata: Metadata = {
  title: 'Peta Desa',
  description: 'Peta interaktif Padukuhan Plosorejo — batas wilayah RT/RW Balong, fasilitas, dan titik UMKM.',
}

const poiGroups = [
  {
    label: 'Peternakan Susu',
    color: 'var(--gold)',
    items: ['Kandang Sapi Koperasi', 'Peternakan Pak Harto', 'Peternakan Bu Rahayu'],
  },
  {
    label: 'UMKM',
    color: 'var(--gold)',
    items: ['Warung Bu Siti', 'Bengkel Las Mandiri', 'Batik Tulis Nusantara', 'Angkringan Wek-ji'],
  },
  {
    label: 'Fasilitas Desa',
    color: 'var(--gold)',
    items: [
      'Masjid Asy Syams',
      'Masjid Al Fath',
      'Masjid Al Ghofur',
      'SD Umbulharjo',
      'SMP Taman Dewasa',
      'Gedung Serbaguna',
      'TK ABA Balong',
    ],
  },
]

const rtLegend = [
  { name: 'RT 01 / RW 01', color: '#eab308' },
  { name: 'RT 02 / RW 01', color: 'var(--gold)' },
  { name: 'RT 03 / RW 01', color: 'var(--gold)' },
  { name: 'RT 04 / RW 01', color: 'var(--gold)' },
]

export default function PetaPage() {
  return (
    <div className="page-shell space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black mb-1" style={{ color: 'var(--text)' }}>
          <span className="gold-text">Peta</span> Padukuhan Plosorejo
        </h1>
        <p className="text-[var(--muted)] text-sm">
          Batas wilayah RT & RW · Jl. Balong, Umbulharjo, Cangkringan, Sleman
        </p>
      </div>

      {/* RT / RW legend */}
      <section aria-label="Legenda batas RT dan RW" className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mr-1">
            Batas RT
          </span>
          {rtLegend.map(({ name, color }) => (
            <span
              key={name}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border"
              style={{ color, borderColor: `${color}55`, backgroundColor: `${color}14` }}
            >
              <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: color }} aria-hidden="true" />
              {name}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mr-1">
            Batas RW
          </span>
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border"
            style={{ color: '#d4af37', borderColor: 'rgba(212,175,55,0.4)', backgroundColor: 'rgba(212,175,55,0.1)' }}
          >
            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#d4af37' }} aria-hidden="true" />
            RW 01 (seluruh padukuhan)
          </span>
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border"
            style={{ color: '#f0ead6', borderColor: 'rgba(240,234,214,0.35)', backgroundColor: 'rgba(240,234,214,0.06)' }}
          >
            <span
              className="w-4 h-0.5"
              style={{
                backgroundImage: 'repeating-linear-gradient(90deg,#f0ead6 0 4px,transparent 4px 7px)',
              }}
              aria-hidden="true"
            />
            Garis batas antar-RT
          </span>
        </div>
      </section>

      {/* Map */}
      <section aria-label="Peta interaktif desa">
        <MapLoader />
      </section>

      {/* Legend / POI groups */}
      <section aria-label="Legenda peta">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)] mb-4">
          Titik Penting
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {poiGroups.map(({ label, color, items }) => (
            <div
              key={label}
              className="rounded-xl border p-4 space-y-3"
              style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                <span className="text-sm font-semibold text-[var(--text)]">{label}</span>
              </div>
              <ul className="space-y-1">
                {items.map(item => (
                  <li key={item} className="text-xs text-[var(--muted)] flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-gray-600" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Info strip */}
      <section
        className="rounded-xl border p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center"
        style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
        aria-label="Informasi wilayah"
      >
        {[
          { label: 'Luas Wilayah', value: '±45 ha' },
          { label: 'Jumlah RT', value: '4' },
          { label: 'Jumlah RW', value: '1' },
          { label: 'Koordinat', value: '7°37′S 110°26′E' },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-lg font-bold gold-text tabular-nums">{value}</p>
            <p className="text-xs text-[var(--muted)] mt-0.5">{label}</p>
          </div>
        ))}
      </section>

      <p className="text-xs text-[var(--muted2)] text-center">
        * Batas RT/RW adalah estimasi organik berdasarkan cluster pemukiman & jalan OSM.
        Validasi GPS lapangan diperlukan untuk akurasi resmi.
      </p>

    </div>
  )
}
