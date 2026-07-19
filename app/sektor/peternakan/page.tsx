import type { Metadata } from 'next'
import StatCard from '@/components/StatCard'
import sektorData from '@/content/sektor.json'

export const metadata: Metadata = {
  title: 'Peternakan Sapi Perah',
  description: 'Sektor peternakan sapi perah unggulan Padukuhan Plosorejo — produksi susu, data ternak, dan kelompok peternak.',
}

const sektor = sektorData.peternakan

const kelompokPeternak = [
  { nama: 'Kelompok A – Pak Harto',   ekor: 68, produksi: '320 L/hari', grade: 'A',  aktif: true },
  { nama: 'Kelompok B – Bu Rahayu',   ekor: 55, produksi: '285 L/hari', grade: 'A',  aktif: true },
  { nama: 'Kelompok C – Pak Suryono', ekor: 42, produksi: '198 L/hari', grade: 'B',  aktif: true },
  { nama: 'Kelompok D – Bu Sari',     ekor: 48, produksi: '241 L/hari', grade: 'B+', aktif: true },
  { nama: 'Kelompok E – Pak Darmawan',ekor: 38, produksi: '187 L/hari', grade: 'A',  aktif: true },
  { nama: 'Kelompok F – Bu Mulyani',  ekor: 61, produksi: '309 L/hari', grade: 'A',  aktif: true },
]

const gradeColor: Record<string, string> = {
  'A': 'var(--green)', 'A+': 'var(--green)',
  'B+': 'var(--amber)', 'B': '#f97316',
}

export default function PeternakanPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">

      {/* Header */}
      <section className="space-y-3">
        <h1 className="text-4xl font-black">
          {sektor.icon} Peternakan{' '}
          <span className="gradient-text">Sapi Perah</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">{sektor.deskripsi}</p>
      </section>

      {/* Stat cards */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4" aria-label="Statistik peternakan">
        {sektor.stats.map(({ label, value }, i) => (
          <StatCard
            key={label}
            label={label}
            value={value}
            accent={i % 2 === 0 ? 'amber' : 'green'}
          />
        ))}
      </section>

      {/* Jenis ternak */}
      <section className="space-y-4" aria-label="Jenis ternak">
        <h2 className="text-2xl font-black">Jenis Ternak</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {sektor.items.map((item) => (
            <div
              key={item}
              className="rounded-xl border p-4 flex items-center gap-3"
              style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
            >
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                style={{ backgroundColor: 'rgba(245,158,11,0.12)' }}
                aria-hidden="true"
              >
                🐄
              </span>
              <p className="text-sm text-gray-200">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Kelompok peternak */}
      <section aria-label="Daftar kelompok peternak">
        <h2 className="text-2xl font-black mb-5">Kelompok Peternak Aktif</h2>
        <div
          className="rounded-xl border overflow-hidden"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--s2)' }}>
                  {['Kelompok', 'Jumlah Sapi', 'Produksi', 'Grade', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {kelompokPeternak.map((row, i) => (
                  <tr
                    key={row.nama}
                    className="border-t"
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: i % 2 === 0 ? 'var(--s1)' : 'transparent',
                    }}
                  >
                    <td className="px-4 py-3 text-white font-medium">{row.nama}</td>
                    <td className="px-4 py-3 tabular-nums text-gray-300">{row.ekor} ekor</td>
                    <td className="px-4 py-3 tabular-nums font-semibold" style={{ color: 'var(--amber)' }}>{row.produksi}</td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ color: gradeColor[row.grade] ?? '#9ca3af', backgroundColor: `${gradeColor[row.grade] ?? '#9ca3af'}18` }}
                      >
                        {row.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--green)' }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
                        Aktif
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Info Koperasi */}
      <section
        className="rounded-xl border p-6 space-y-3"
        style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
        aria-label="Informasi koperasi susu"
      >
        <h2 className="text-lg font-black">🤝 Koperasi Susu Plosorejo</h2>
        <p className="text-sm text-gray-300 leading-relaxed">
          Seluruh hasil produksi susu segar disetorkan melalui Koperasi Susu Plosorejo yang berdiri
          sejak 1968. Koperasi mengelola chilling unit, distribusi ke KUD Sleman, dan unit pengolahan
          susu menjadi yogurt serta keju lokal. Anggota koperasi mendapat akses pinjaman bergulir
          untuk pengembangan usaha peternakan.
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          {[
            { label: 'Tahun Berdiri', val: '1968' },
            { label: 'Anggota Aktif', val: '47 peternak' },
            { label: 'Mitra Utama', val: 'KUD Sleman' },
          ].map(({ label, val }) => (
            <div key={label}>
              <p className="text-sm font-bold" style={{ color: 'var(--amber)' }}>{val}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
