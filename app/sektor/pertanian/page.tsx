import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import Icon from '@/components/Icon'
import sektorData from '@/content/sektor.json'

export const metadata: Metadata = {
  title: 'Pertanian',
  description: 'Sektor pertanian Padukuhan Plosorejo — padi, salak pondoh, cabai, dan sayuran organik.',
}

const sektor = sektorData.pertanian

const komoditas = [
  { nama: 'Padi',            varietas: 'IR64 & Ciherang',       luas: '52 ha',  panen: '6,2 t/ha', musim: '2× / tahun'    },
  { nama: 'Salak Pondoh',    varietas: 'Salak Pondoh Super',    luas: '18 ha',  panen: '15 t/ha',  musim: 'Sepanjang tahun' },
  { nama: 'Cabai Merah',     varietas: 'Keriting & Rawit',      luas: '9 ha',   panen: '8 t/ha',   musim: '3× / tahun'    },
  { nama: 'Jagung Hibrida',  varietas: 'NK 212',                luas: '5 ha',   panen: '8,5 t/ha', musim: '2× / tahun'    },
  { nama: 'Kedelai Edamame', varietas: 'Ryoko',                 luas: '2 ha',   panen: '4 t/ha',   musim: '2× / tahun'    },
  { nama: 'Sayuran Organik', varietas: 'Kangkung, Bayam, Sawi', luas: '1 ha',   panen: '10 t/ha',  musim: 'Sepanjang tahun' },
]

const jadwalMusimTanam = [
  { musim: 'MT I (Nov – Feb)',  komoditas: 'Padi IR64',      status: 'Selesai',  dot: '#22c55e' },
  { musim: 'MT II (Mar – Jun)', komoditas: 'Padi Ciherang',  status: 'Selesai',  dot: '#22c55e' },
  { musim: 'MT III (Jul – Okt)',komoditas: 'Cabai & Jagung', status: 'Berjalan', dot: '#f59e0b' },
]

const irigasiInfo = [
  { label: 'Panjang Saluran', val: '8,4 km' },
  { label: 'Lahan Terlayani', val: '87 ha'  },
  { label: 'Pompa Air',       val: '4 unit' },
]

export default function PertanianPage() {
  return (
    <div className="page-shell pb-16">

      {/* ── Header ── */}
      <div className="px-4 pt-4 pb-6">
        <PageHeader
          eyebrow="Komoditas & Kelompok Tani"
          title="Pertanian"
          highlight="Plosorejo"
          description={sektor.deskripsi}
          backLabel="Sektor"
          backHref="/sektor"
        />
      </div>

      {/* ── Stats horizontal scroll ── */}
      <section aria-label="Statistik pertanian" className="mb-6">
        <p className="px-4 mb-2 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted)' }}>
          Ringkasan
        </p>
        <div className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-none snap-x snap-mandatory">
          {sektor.stats.map(({ label, value }) => (
            <div
              key={label}
              className="flex-shrink-0 snap-start w-28 rounded-2xl p-3 text-center"
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <p className="text-lg font-black tabular-nums" style={{ color: 'var(--gold)' }}>{value}</p>
              <p className="text-[10px] mt-0.5 leading-tight" style={{ color: 'var(--muted)' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Komoditas unggulan — iOS grouped list ── */}
      <section aria-label="Komoditas unggulan" className="mb-6">
        <p className="px-4 mb-2 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted)' }}>
          Komoditas Unggulan
        </p>
        <div
          className="mx-4 rounded-2xl overflow-hidden"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          {komoditas.map(({ nama, varietas, luas, panen, musim }, i) => (
            <div
              key={nama}
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderTop: i > 0 ? '1px solid var(--border)' : undefined }}
            >
              {/* Icon tile */}
              <span
                className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                style={{ backgroundColor: 'rgba(34,197,94,0.12)' }}
                aria-hidden="true"
              >
                <Icon name="pertanian" size={16} />
              </span>

              {/* Name + varietas */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{nama}</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--muted)' }}>{varietas}</p>
              </div>

              {/* Micro stats */}
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-bold tabular-nums" style={{ color: 'var(--gold)' }}>{panen}</p>
                <p className="text-[10px]" style={{ color: 'var(--muted)' }}>{luas} · {musim}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Jadwal musim tanam — iOS grouped list ── */}
      <section aria-label="Jadwal musim tanam" className="mb-6">
        <p className="px-4 mb-2 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted)' }}>
          Jadwal Musim Tanam 2026
        </p>
        <div
          className="mx-4 rounded-2xl overflow-hidden"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          {jadwalMusimTanam.map(({ musim, komoditas: k, status, dot }, i) => (
            <div
              key={musim}
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderTop: i > 0 ? '1px solid var(--border)' : undefined }}
            >
              {/* Status dot */}
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: dot }}
                aria-hidden="true"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{musim}</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--muted)' }}>{k}</p>
              </div>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: `${dot}1a`, color: dot }}
              >
                {status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Irigasi — iOS info section ── */}
      <section aria-label="Sistem irigasi" className="mb-6">
        <p className="px-4 mb-2 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted)' }}>
          Sistem Irigasi Terpadu
        </p>
        <div
          className="mx-4 rounded-2xl p-4 space-y-3"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            Jaringan irigasi teknis sepanjang 8,4 km mengalirkan air dari Sungai Lesti melalui saluran
            primer dan sekunder ke seluruh lahan. Program pompanisasi memastikan pasokan air sepanjang tahun.
          </p>
          <div
            className="grid grid-cols-3 gap-2 pt-3"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            {irigasiInfo.map(({ label, val }) => (
              <div key={label} className="text-center">
                <p className="text-sm font-black" style={{ color: 'var(--gold)' }}>{val}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--muted)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
