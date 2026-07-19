import type { Metadata } from 'next'
import MapLoader from './MapLoader'

export const metadata: Metadata = {
  title: 'Peta Desa',
  description: 'Peta interaktif wilayah Desa Plosorejo — titik usaha, sumber air, dan lahan pertanian.',
}

const poiGroups = [
  {
    label: 'Peternakan Susu',
    color: 'var(--amber)',
    items: ['Peternakan Pak Harto', 'Peternakan Bu Rahayu', 'Peternakan Pak Suryono'],
  },
  {
    label: 'UMKM',
    color: 'var(--green)',
    items: ['Warung Bu Siti', 'Bengkel Las Mandiri', 'Batik Tulis Nusantara'],
  },
  {
    label: 'Fasilitas Desa',
    color: '#818cf8',
    items: ['Balai Desa', 'Puskesmas', 'SDN Plosorejo 1'],
  },
]

export default function PetaPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black mb-1" style={{ color: '#e5e7eb' }}>
          🗺️ <span className="gradient-text">Peta Desa</span> Plosorejo
        </h1>
        <p className="text-gray-400 text-sm">
          Visualisasi interaktif wilayah desa · Kecamatan Gondanglegi, Malang
        </p>
      </div>

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
          { label: 'Luas Wilayah',  value: '12.6 km²'      },
          { label: 'Jumlah Dusun',  value: '4'             },
          { label: 'RT / RW',       value: '38 / 12'       },
          { label: 'Koordinat',     value: '8.17°S 112.7°E' },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-lg font-bold gradient-text tabular-nums">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </section>

    </div>
  )
}
