import type { Metadata } from 'next'
import StatCard from '@/components/StatCard'
import sektorData from '@/content/sektor.json'

export const metadata: Metadata = {
  title: 'Pertanian',
  description: 'Sektor pertanian Padukuhan Plosorejo — padi, salak pondoh, cabai, dan sayuran organik.',
}

const sektor = sektorData.pertanian

const komoditas = [
  {
    nama: 'Padi',
    varietas: 'IR64 & Ciherang',
    luas: '52 ha',
    panen: '6,2 t/ha',
    musim: '2× / tahun',
    emoji: '🌾',
    color: 'var(--amber)',
  },
  {
    nama: 'Salak Pondoh',
    varietas: 'Salak Pondoh Super',
    luas: '18 ha',
    panen: '15 t/ha',
    musim: 'Sepanjang tahun',
    emoji: '🍈',
    color: 'var(--green)',
  },
  {
    nama: 'Cabai Merah',
    varietas: 'Keriting & Rawit',
    luas: '9 ha',
    panen: '8 t/ha',
    musim: '3× / tahun',
    emoji: '🌶️',
    color: '#ef4444',
  },
  {
    nama: 'Jagung Hibrida',
    varietas: 'NK 212',
    luas: '5 ha',
    panen: '8,5 t/ha',
    musim: '2× / tahun',
    emoji: '🌽',
    color: 'var(--amber)',
  },
  {
    nama: 'Kedelai Edamame',
    varietas: 'Ryoko',
    luas: '2 ha',
    panen: '4 t/ha',
    musim: '2× / tahun',
    emoji: '🫘',
    color: 'var(--green)',
  },
  {
    nama: 'Sayuran Organik',
    varietas: 'Kangkung, Bayam, Sawi',
    luas: '1 ha',
    panen: '10 t/ha',
    musim: 'Sepanjang tahun',
    emoji: '🥬',
    color: 'var(--green)',
  },
]

const jadwalMusimTanam = [
  { musim: 'MT I (Nov – Feb)',  komoditas: 'Padi IR64',       status: 'Selesai',    color: 'var(--green)' },
  { musim: 'MT II (Mar – Jun)', komoditas: 'Padi Ciherang',   status: 'Selesai',    color: 'var(--green)' },
  { musim: 'MT III (Jul – Okt)',komoditas: 'Cabai & Jagung',  status: 'Berjalan',   color: 'var(--amber)' },
]

export default function PertanianPage() {
  return (
    <div className="page-shell space-y-10">

      {/* Header */}
      <section className="space-y-3">
        <h1 className="text-4xl font-black">
          {sektor.icon} Pertanian{' '}
          <span className="gradient-text">Plosorejo</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">{sektor.deskripsi}</p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4" aria-label="Statistik pertanian">
        {sektor.stats.map(({ label, value }, i) => (
          <StatCard
            key={label}
            label={label}
            value={value}
            accent={i % 2 === 0 ? 'green' : 'amber'}
          />
        ))}
      </section>

      {/* Komoditas unggulan */}
      <section aria-label="Komoditas unggulan">
        <h2 className="text-2xl font-black mb-5">Komoditas Unggulan</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {komoditas.map(({ nama, varietas, luas, panen, musim, emoji, color }) => (
            <div
              key={nama}
              className="rounded-xl border p-5 space-y-3"
              style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: `${color}12` }}
                  aria-hidden="true"
                >
                  {emoji}
                </span>
                <div>
                  <h3 className="font-bold text-white">{nama}</h3>
                  <p className="text-xs text-gray-500">{varietas}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t text-center" style={{ borderColor: 'var(--border)' }}>
                {[
                  { l: 'Luas', v: luas },
                  { l: 'Hasil', v: panen },
                  { l: 'Musim', v: musim },
                ].map(({ l, v }) => (
                  <div key={l}>
                    <p className="text-xs font-semibold tabular-nums" style={{ color }}>{v}</p>
                    <p className="text-xs text-gray-600">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Jadwal musim tanam */}
      <section aria-label="Jadwal musim tanam">
        <h2 className="text-2xl font-black mb-5">Jadwal Musim Tanam 2026</h2>
        <div className="space-y-3">
          {jadwalMusimTanam.map(({ musim, komoditas: k, status, color }) => (
            <div
              key={musim}
              className="rounded-xl border p-4 flex items-center justify-between gap-4 flex-wrap"
              style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
            >
              <div>
                <p className="font-semibold text-white text-sm">{musim}</p>
                <p className="text-xs text-gray-500 mt-0.5">{k}</p>
              </div>
              <span
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
                style={{ color, backgroundColor: `${color}18` }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
                {status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Info irigasi */}
      <section
        className="rounded-xl border p-6 space-y-3"
        style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
        aria-label="Sistem irigasi"
      >
        <h2 className="text-lg font-black">💧 Sistem Irigasi Terpadu</h2>
        <p className="text-sm text-gray-300 leading-relaxed">
          Padukuhan Plosorejo dilengkapi jaringan irigasi teknis sepanjang 8,4 km yang mengalirkan
          air dari Sungai Lesti melalui saluran primer dan sekunder ke seluruh lahan pertanian.
          Program pompanisasi juga tersedia untuk lahan yang tidak terjangkau irigasi gravitasi,
          memastikan pasokan air sepanjang tahun.
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          {[
            { label: 'Panjang Saluran', val: '8,4 km' },
            { label: 'Lahan Terlayani', val: '87 ha' },
            { label: 'Pompa Air', val: '4 unit' },
          ].map(({ label, val }) => (
            <div key={label}>
              <p className="text-sm font-bold" style={{ color: 'var(--green)' }}>{val}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
