import type { Metadata } from 'next'
import MapLoader from './MapLoader'
import { getPoiList } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Peta Desa',
  description: 'Peta interaktif Padukuhan Plosorejo — batas wilayah RT/RW Balong, fasilitas, dan titik UMKM.',
}

const rtLegend = [
  { name: 'RT 01 / RW 01', color: '#22c55e' },
  { name: 'RT 02 / RW 01', color: '#16a34a' },
  { name: 'RT 03 / RW 01', color: '#4ade80' },
  { name: 'RT 04 / RW 01', color: '#86efac' },
]

const typeMeta: Record<string, { label: string; color: string }> = {
  farm: { label: 'Peternakan Susu', color: '#f59e0b' },
  umkm: { label: 'UMKM', color: '#eab308' },
  facility: { label: 'Fasilitas Desa', color: '#60a5fa' },
  balai: { label: 'Balai / Kantor', color: '#d4af37' },
  masjid: { label: 'Masjid', color: '#14b8a6' },
  kesehatan: { label: 'Kesehatan', color: '#22c55e' },
  wisata: { label: 'Wisata', color: '#a78bfa' },
}

export default async function PetaPage() {
  const pois = await getPoiList()
  const groups = Object.entries(
    pois.reduce<Record<string, string[]>>((acc, p) => {
      const key = p.type || 'lain'
      acc[key] = acc[key] || []
      acc[key].push(p.label)
      return acc
    }, {}),
  )

  return (
    <div className="page-shell space-y-10">
      <div>
        <h1 className="text-3xl font-black mb-1" style={{ color: 'var(--text)' }}>
          <span className="gold-text">Peta</span> Padukuhan Plosorejo
        </h1>
        <p className="text-[var(--muted)] text-sm">
          Batas wilayah RT & RW · Jl. Balong, Umbulharjo, Cangkringan, Sleman · {pois.length} titik POI
        </p>
      </div>

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
            Batas padukuhan
          </span>
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border"
            style={{ color: '#15803d', borderColor: '#15803d55', backgroundColor: '#22c55e14' }}
          >
            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#15803d' }} aria-hidden="true" />
            Plosorejo (Balong) · RW 01
          </span>
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border"
            style={{ color: '#dc2626', borderColor: '#dc262655', backgroundColor: '#dc262614' }}
          >
            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#dc2626' }} aria-hidden="true" />
            Jalan utama (OSM)
          </span>
        </div>
      </section>

      <section aria-label="Peta interaktif desa">
        <MapLoader />
      </section>

      <section aria-label="Legenda peta">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)] mb-4">
          Titik penting (dari content/poi.json)
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map(([type, items]) => {
            const meta = typeMeta[type] || { label: type, color: 'var(--gold)' }
            return (
              <div
                key={type}
                className="rounded-xl border p-4 space-y-3"
                style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: meta.color }} aria-hidden="true" />
                  <span className="text-sm font-semibold text-[var(--text)]">{meta.label}</span>
                  <span className="text-xs ml-auto" style={{ color: 'var(--muted)' }}>{items.length}</span>
                </div>
                <ul className="space-y-1">
                  {items.map((item) => (
                    <li key={item} className="text-xs text-[var(--muted)] flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full" style={{ background: 'var(--gold)' }} aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      <section
        className="rounded-xl border p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center"
        style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
        aria-label="Informasi wilayah"
      >
        {[
          { label: 'Luas Wilayah', value: '±45 ha' },
          { label: 'Jumlah RT', value: '4' },
          { label: 'Jumlah RW', value: '1' },
          { label: 'POI', value: String(pois.length) },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-lg font-bold gold-text tabular-nums">{value}</p>
            <p className="text-xs text-[var(--muted)] mt-0.5">{label}</p>
          </div>
        ))}
      </section>

      <p className="text-xs text-[var(--muted2)] text-center">
        * Batas padukuhan & RT: estimasi organik mengikuti jalan OSM (Jl. Raya Merapi Golf,
        Jl. Menuju Lapangan Golf). Validasi GPS lapangan diperlukan untuk akurasi resmi.
        Edit POI di <code>content/poi.json</code>.
      </p>
    </div>
  )
}
