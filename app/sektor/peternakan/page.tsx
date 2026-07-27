import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import sektorData from '@/content/sektor.json'

export const metadata: Metadata = {
  title: 'Peternakan Sapi Perah',
  description: 'Sektor peternakan sapi perah unggulan Padukuhan Plosorejo — produksi susu, data ternak, dan kelompok peternak.',
}

const sektor = sektorData.peternakan

const kelompokPeternak = [
  { nama: 'Kelompok A – Pak Harto',     ekor: 68, produksi: '320 L/hari', grade: 'A'  },
  { nama: 'Kelompok B – Bu Rahayu',     ekor: 55, produksi: '285 L/hari', grade: 'A'  },
  { nama: 'Kelompok C – Pak Suryono',   ekor: 42, produksi: '198 L/hari', grade: 'B'  },
  { nama: 'Kelompok D – Bu Sari',       ekor: 48, produksi: '241 L/hari', grade: 'B+' },
  { nama: 'Kelompok E – Pak Darmawan',  ekor: 38, produksi: '187 L/hari', grade: 'A'  },
  { nama: 'Kelompok F – Bu Mulyani',    ekor: 61, produksi: '309 L/hari', grade: 'A'  },
]

const koperasiInfo = [
  { label: 'Tahun Berdiri', val: '1968' },
  { label: 'Anggota Aktif', val: '47 peternak' },
  { label: 'Mitra Utama',   val: 'KUD Sleman' },
]

export default function PeternakanPage() {
  return (
    <div className="page-shell pb-16">

      {/* ── Header ── */}
      <div className="px-4 pt-4 pb-6">
        <PageHeader
          eyebrow="Sektor Unggulan"
          title="Peternakan"
          highlight="Sapi Perah"
          description={sektor.deskripsi}
          backLabel="Sektor"
          backHref="/sektor"
        />
      </div>

      {/* ── Stats horizontal scroll ── */}
      <section aria-label="Statistik peternakan" className="mb-6">
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

      {/* ── Jenis ternak — iOS grouped list ── */}
      <section aria-label="Jenis ternak" className="mb-6">
        <p className="px-4 mb-2 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted)' }}>
          Jenis Ternak
        </p>
        <div
          className="mx-4 rounded-2xl overflow-hidden"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          {sektor.items.map((item, i) => (
            <div
              key={item}
              className="flex items-center gap-3 px-4 py-3"
              style={{
                borderTop: i > 0 ? '1px solid var(--border)' : undefined,
              }}
            >
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                style={{ backgroundColor: 'rgba(245,158,11,0.12)' }}
                aria-hidden="true"
              >🐄</span>
              <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Kelompok peternak — iOS grouped list ── */}
      <section aria-label="Kelompok peternak" className="mb-6">
        <p className="px-4 mb-2 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted)' }}>
          Kelompok Peternak
        </p>
        <div
          className="mx-4 rounded-2xl overflow-hidden"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          {kelompokPeternak.map(({ nama, ekor, produksi, grade }, i) => (
            <div
              key={nama}
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderTop: i > 0 ? '1px solid var(--border)' : undefined }}
            >
              {/* Grade badge */}
              <span
                className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black flex-shrink-0"
                style={{ backgroundColor: 'rgba(212,175,55,0.14)', color: 'var(--gold)' }}
              >
                {grade}
              </span>

              {/* Name + ekor */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{nama}</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--muted)' }}>{ekor} ekor</p>
              </div>

              {/* Produksi */}
              <p className="text-xs font-semibold tabular-nums" style={{ color: 'var(--gold)' }}>{produksi}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Koperasi — iOS info section ── */}
      <section aria-label="Koperasi Susu" className="mb-6">
        <p className="px-4 mb-2 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted)' }}>
          Koperasi Susu Plosorejo
        </p>
        <div
          className="mx-4 rounded-2xl p-4 space-y-3"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            Seluruh hasil produksi susu segar disetorkan melalui Koperasi Susu Plosorejo yang berdiri
            sejak 1968. Koperasi mengelola chilling unit, distribusi ke KUD Sleman, dan unit pengolahan
            susu menjadi yogurt serta keju lokal.
          </p>
          <div
            className="grid grid-cols-3 gap-2 pt-3"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            {koperasiInfo.map(({ label, val }) => (
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
