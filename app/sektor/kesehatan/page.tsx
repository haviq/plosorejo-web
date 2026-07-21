import type { Metadata } from 'next'
import StatCard from '@/components/StatCard'
import sektorData from '@/content/sektor.json'

export const metadata: Metadata = {
  title: 'Kesehatan',
  description: 'Layanan kesehatan Padukuhan Plosorejo — Posyandu, Puskesmas, dan program kesehatan masyarakat.',
}

const sektor = sektorData.kesehatan

const posyandu = [
  {
    nama: 'Posyandu Melati (RT 01–02)',
    jenis: 'Balita',
    jadwal: 'Setiap Senin pertama',
    kader: 5,
    sasaran: 38,
    lokasi: 'Balai RT 02',
    color: '#34d399',
  },
  {
    nama: 'Posyandu Mawar (RT 03–04)',
    jenis: 'Balita',
    jadwal: 'Setiap Selasa pertama',
    kader: 5,
    sasaran: 42,
    lokasi: 'Rumah Kader Ibu Mulyani',
    color: '#34d399',
  },
  {
    nama: 'Posyandu Lansia Sehat',
    jenis: 'Lansia',
    jadwal: 'Setiap Jumat kedua',
    kader: 4,
    sasaran: 89,
    lokasi: 'Balai Padukuhan',
    color: '#818cf8',
  },
]

const layananKesehatan = [
  {
    nama: 'Bidan Desa Plosorejo',
    deskripsi: 'Pelayanan kesehatan ibu dan anak, persalinan normal, KB, dan imunisasi dasar.',
    jam: '08.00 – 14.00 (Senin–Sabtu)',
    lokasi: 'Jl. Raya Plosorejo No. 12',
    color: 'var(--green)',
    emoji: '👩‍⚕️',
  },
  {
    nama: 'Puskesmas Cangkringan',
    deskripsi: 'Pelayanan kesehatan umum, rawat jalan, laboratorium, UGD, dan rujukan.',
    jam: '07.30 – 16.00 (Senin–Jumat), 07.30 – 12.00 (Sabtu)',
    lokasi: 'Jl. Raya Cangkringan (±2 km)',
    color: '#60a5fa',
    emoji: '🏥',
  },
  {
    nama: 'RSUD Sleman',
    deskripsi: 'Rumah Sakit Umum Daerah Kabupaten Sleman untuk rujukan lanjutan.',
    jam: '24 jam (IGD)',
    lokasi: 'Kalasan, Sleman (±12 km)',
    color: '#f97316',
    emoji: '🏨',
  },
]

const programKesehatan = [
  { nama: 'Imunisasi Dasar Lengkap', target: '100%', capaian: '98,2%', status: 'Baik' },
  { nama: 'ASI Eksklusif 6 Bulan',   target: '80%',  capaian: '76,4%', status: 'Hampir' },
  { nama: 'Balita Gizi Baik',        target: '100%', capaian: '98,0%', status: 'Baik' },
  { nama: 'Ibu Hamil Risti Terpantau',target: '100%', capaian: '100%', status: 'Baik' },
]

export default function KesehatanPage() {
  return (
    <div className="page-shell space-y-10">

      {/* Header */}
      <section className="space-y-3">
        <h1 className="text-4xl font-black">
          {sektor.icon} Kesehatan{' '}
          <span className="gradient-text">Masyarakat</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">{sektor.deskripsi}</p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4" aria-label="Statistik kesehatan">
        {sektor.stats.map(({ label, value }, i) => (
          <StatCard
            key={label}
            label={label}
            value={value}
            accent={i % 2 === 0 ? 'green' : 'amber'}
          />
        ))}
      </section>

      {/* Posyandu */}
      <section aria-label="Daftar Posyandu">
        <h2 className="text-2xl font-black mb-5">Posyandu Aktif</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posyandu.map(({ nama, jenis, jadwal, kader, sasaran, lokasi, color }) => (
            <div
              key={nama}
              className="rounded-xl border p-5 space-y-3"
              style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-white text-sm leading-tight">{nama}</h3>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ color, backgroundColor: `${color}18` }}
                >
                  {jenis}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-gray-400">
                <p>📅 {jadwal}</p>
                <p>📍 {lokasi}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t text-center" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <p className="text-sm font-bold tabular-nums" style={{ color }}>{kader}</p>
                  <p className="text-xs text-gray-600">Kader</p>
                </div>
                <div>
                  <p className="text-sm font-bold tabular-nums" style={{ color }}>{sasaran}</p>
                  <p className="text-xs text-gray-600">Sasaran</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fasilitas Kesehatan */}
      <section aria-label="Fasilitas kesehatan">
        <h2 className="text-2xl font-black mb-5">Fasilitas Kesehatan</h2>
        <div className="space-y-4">
          {layananKesehatan.map(({ nama, deskripsi, jam, lokasi, color, emoji }) => (
            <div
              key={nama}
              className="rounded-xl border p-5 flex gap-4"
              style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
            >
              <span
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: `${color}12` }}
                aria-hidden="true"
              >
                {emoji}
              </span>
              <div className="space-y-1">
                <h3 className="font-bold text-white">{nama}</h3>
                <p className="text-sm text-gray-400">{deskripsi}</p>
                <div className="flex flex-wrap gap-4 text-xs text-gray-500 pt-1">
                  <span>🕐 {jam}</span>
                  <span>📍 {lokasi}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Program Kesehatan */}
      <section aria-label="Capaian program kesehatan">
        <h2 className="text-2xl font-black mb-5">Capaian Program Kesehatan 2026</h2>
        <div className="space-y-3">
          {programKesehatan.map(({ nama, target, capaian, status }) => {
            const isGood = status === 'Baik'
            const statusColor = isGood ? 'var(--green)' : 'var(--amber)'
            const pct = parseInt(capaian)
            return (
              <div
                key={nama}
                className="rounded-xl border p-4"
                style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
              >
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <p className="text-sm font-semibold text-white">{nama}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-gray-500">Target: {target}</span>
                    <span className="font-bold" style={{ color: statusColor }}>{capaian}</span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: statusColor }}
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${nama}: ${capaian}`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>

    </div>
  )
}
