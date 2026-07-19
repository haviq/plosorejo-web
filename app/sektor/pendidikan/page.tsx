import type { Metadata } from 'next'
import StatCard from '@/components/StatCard'
import sektorData from '@/content/sektor.json'

export const metadata: Metadata = {
  title: 'Pendidikan',
  description: 'Fasilitas pendidikan Padukuhan Plosorejo — PAUD hingga SMA, program beasiswa, dan data siswa.',
}

const sektor = sektorData.pendidikan

const lembagaPendidikan = [
  {
    nama: 'PAUD Tunas Bangsa',
    jenjang: 'PAUD',
    siswa: 42,
    guru: 4,
    akreditasi: 'B',
    alamat: 'RT 03, Padukuhan Plosorejo',
    color: '#f97316',
  },
  {
    nama: 'TK Aisyiyah Plosorejo',
    jenjang: 'TK',
    siswa: 65,
    guru: 6,
    akreditasi: 'A',
    alamat: 'RT 05, Padukuhan Plosorejo',
    color: '#f59e0b',
  },
  {
    nama: 'SDN Plosorejo 1',
    jenjang: 'SD',
    siswa: 248,
    guru: 18,
    akreditasi: 'A',
    alamat: 'RT 01, Padukuhan Plosorejo',
    color: 'var(--amber)',
  },
  {
    nama: 'SDN Plosorejo 2',
    jenjang: 'SD',
    siswa: 187,
    guru: 14,
    akreditasi: 'B',
    alamat: 'RT 08, Padukuhan Plosorejo',
    color: 'var(--amber)',
  },
  {
    nama: 'SMP Negeri 2 Gondanglegi',
    jenjang: 'SMP',
    siswa: 186,
    guru: 22,
    akreditasi: 'A',
    alamat: 'Kec. Gondanglegi (2 km)',
    color: 'var(--green)',
  },
  {
    nama: 'SMA Negeri 1 Gondanglegi',
    jenjang: 'SMA',
    siswa: 114,
    guru: 28,
    akreditasi: 'A',
    alamat: 'Kec. Gondanglegi (3 km)',
    color: '#60a5fa',
  },
]

const jenjangColor: Record<string, string> = {
  PAUD: '#f97316', TK: 'var(--amber)', SD: 'var(--amber)',
  SMP: 'var(--green)', SMA: '#60a5fa', SMK: '#60a5fa',
}

const programBeasiswa = [
  {
    nama: 'Beasiswa Prestasi Akademik',
    nilai: 'Rp 3.000.000/tahun',
    syarat: 'Ranking 3 besar, dari keluarga tidak mampu',
  },
  {
    nama: 'Beasiswa Anak Yatim/Piatu',
    nilai: 'Rp 2.400.000/tahun',
    syarat: 'Terdaftar di data sosial padukuhan',
  },
  {
    nama: 'Beasiswa Perguruan Tinggi',
    nilai: 'Rp 6.000.000/tahun',
    syarat: 'Lolos PTN, IPK min. 3.0, dari keluarga kurang mampu',
  },
]

export default function PendidikanPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">

      {/* Header */}
      <section className="space-y-3">
        <h1 className="text-4xl font-black">
          {sektor.icon} Pendidikan{' '}
          <span className="gradient-text">Plosorejo</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">{sektor.deskripsi}</p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4" aria-label="Statistik pendidikan">
        {sektor.stats.map(({ label, value }, i) => (
          <StatCard
            key={label}
            label={label}
            value={value}
            accent={i % 2 === 0 ? 'amber' : 'green'}
          />
        ))}
      </section>

      {/* Lembaga pendidikan */}
      <section aria-label="Lembaga pendidikan">
        <h2 className="text-2xl font-black mb-5">Lembaga Pendidikan</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lembagaPendidikan.map(({ nama, jenjang, siswa, guru, akreditasi, alamat, color }) => (
            <div
              key={nama}
              className="rounded-xl border p-5 space-y-3"
              style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
            >
              {/* Jenjang badge */}
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ color: jenjangColor[jenjang] ?? color, backgroundColor: `${jenjangColor[jenjang] ?? color}18` }}
              >
                {jenjang}
              </span>

              {/* Nama */}
              <h3 className="font-bold text-white text-sm leading-tight">{nama}</h3>
              <p className="text-xs text-gray-500">{alamat}</p>

              {/* Statistik */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t text-center" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <p className="text-sm font-bold tabular-nums" style={{ color }}>{siswa}</p>
                  <p className="text-xs text-gray-600">Siswa</p>
                </div>
                <div>
                  <p className="text-sm font-bold tabular-nums" style={{ color }}>{guru}</p>
                  <p className="text-xs text-gray-600">Guru</p>
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: akreditasi === 'A' ? 'var(--green)' : 'var(--amber)' }}>
                    {akreditasi}
                  </p>
                  <p className="text-xs text-gray-600">Akreditasi</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Program Beasiswa */}
      <section aria-label="Program beasiswa">
        <h2 className="text-2xl font-black mb-5">Program Beasiswa</h2>
        <div className="space-y-4">
          {programBeasiswa.map(({ nama, nilai, syarat }) => (
            <div
              key={nama}
              className="rounded-xl border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
            >
              <div className="space-y-1">
                <h3 className="font-bold text-white text-sm">{nama}</h3>
                <p className="text-xs text-gray-500">{syarat}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-black text-lg tabular-nums" style={{ color: 'var(--amber)' }}>{nilai}</p>
                <p className="text-xs text-gray-600">per tahun</p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-4 rounded-xl border p-5 text-center space-y-2"
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.06), rgba(34,197,94,0.06))',
            borderColor: 'var(--border)',
          }}
        >
          <p className="text-sm text-gray-300">Daftar beasiswa dibuka setiap <strong className="text-white">Januari & Juli</strong></p>
          <p className="text-xs text-gray-500">Pendaftaran melalui Sekretariat Padukuhan atau WhatsApp perangkat desa</p>
        </div>
      </section>

    </div>
  )
}
