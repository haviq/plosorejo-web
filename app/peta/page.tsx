import type { Metadata } from 'next'
import MapLoader from './MapLoader'

export const metadata: Metadata = {
  title: 'Peta Desa',
  description: 'Peta interaktif Padukuhan Plosorejo — batas wilayah RT Balong, fasilitas, dan titik UMKM.',
}

const poiGroups = [
  {
    label: 'Peternakan Susu',
    color: 'var(--amber)',
    items: ['Kandang Sapi Koperasi', 'Peternakan Pak Harto', 'Peternakan Bu Rahayu'],
  },
  {
    label: 'UMKM',
    color: 'var(--green)',
    items: ['Warung Bu Siti', 'Bengkel Las Mandiri', 'Batik Tulis Nusantara'],
  },
  {
    label: 'Fasilitas Desa',
    color: '#818cf8',
    items: ['Balai Padukuhan', 'Masjid Asy Syams', 'SD Umbulharjo', 'TK ABA Balong', 'Gedung Serbaguna'],
  },
]

const rtLegend = [
  { name: 'RT 01', color: '#eab308' },
  { name: 'RT 02', color: '#ef4444' },
  { name: 'RT 03', color: '#22c55e' },
  { name: 'RT 04', color: '#3b82f6' },
]

export default function PetaPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black mb-1" style={{ color: '#e5e7eb' }}>
          🗺️ <span className="gradient-text">Peta</span> Padukuhan Plosorejo
        </h1>
        <p className="text-gray-400 text-sm">
          Batas wilayah per RT · Jl. Balong, Umbulharjo, Cangkringan, Sleman
        </p>
      </div>

      {/* RT color legend */}
      <section aria-label="Legenda batas RT">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mr-1">
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
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border"
            style={{ color: '#d4af37', borderColor: 'rgba(212,175,55,0.35)', backgroundColor: 'rgba(212,175,55,0.08)' }}
          >
            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#d4af37' }} aria-hidden="true" />
            Outer Padukuhan
          </span>
        </div>
      </section>

      {/* Map — client component owns the dynamic Leaflet import */}
      <section aria-label="Peta interaktif desa">
        <MapLoader />
      </section>

      {/* Legend / POI groups */}
      <section aria-label="Legenda peta">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
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
                <span className="text-sm font-semibold text-white">{label}</span>
              </div>
              <ul className="space-y-1">
                {items.map(item => (
                  <li key={item} className="text-xs text-gray-400 flex items-center gap-2">
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
          { label: 'Jumlah RT',    value: '4' },
          { label: 'Jumlah RW',    value: '1' },
          { label: 'Koordinat',    value: '7°37′S 110°26′E' },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-lg font-bold gradient-text tabular-nums">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </section>

      <p className="text-xs text-gray-600 text-center">
        * Polygon batas RT adalah estimasi berdasarkan area Jl. Balong / Padukuhan Plosorejo.
        Validasi GPS lapangan diperlukan untuk akurasi resmi.
      </p>

    </div>
  )
}
