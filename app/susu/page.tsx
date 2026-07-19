import type { Metadata } from 'next'
import StatCard from '@/components/StatCard'

export const metadata: Metadata = {
  title: 'Produksi Susu',
  description: 'Dashboard data produksi susu harian dan bulanan Desa Plosorejo.',
}

const monthlyData = [
  { month: 'Jan', value: 62 },
  { month: 'Feb', value: 58 },
  { month: 'Mar', value: 71 },
  { month: 'Apr', value: 75 },
  { month: 'Mei', value: 80 },
  { month: 'Jun', value: 78 },
  { month: 'Jul', value: 85 },
  { month: 'Ags', value: 83 },
  { month: 'Sep', value: 79 },
  { month: 'Okt', value: 88 },
  { month: 'Nov', value: 91 },
  { month: 'Des', value: 86 },
]

const recentRows = [
  { date: '15 Jul 2026', peternak: 'Kelompok A – Pak Harto',  volume: '320 L',  kualitas: 'A',  status: 'Diterima' },
  { date: '15 Jul 2026', peternak: 'Kelompok B – Bu Rahayu', volume: '285 L',  kualitas: 'A',  status: 'Diterima' },
  { date: '15 Jul 2026', peternak: 'Kelompok C – Pak Suryono', volume: '198 L', kualitas: 'B',  status: 'Diterima' },
  { date: '14 Jul 2026', peternak: 'Kelompok A – Pak Harto',  volume: '310 L',  kualitas: 'A',  status: 'Diterima' },
  { date: '14 Jul 2026', peternak: 'Kelompok D – Bu Sari',    volume: '241 L',  kualitas: 'B+', status: 'Diterima' },
  { date: '14 Jul 2026', peternak: 'Kelompok B – Bu Rahayu', volume: '277 L',  kualitas: 'A',  status: 'Diterima' },
  { date: '13 Jul 2026', peternak: 'Kelompok C – Pak Suryono', volume: '203 L', kualitas: 'B',  status: 'Pending' },
]

const maxVal = Math.max(...monthlyData.map(d => d.value))

function BarChart() {
  const chartH = 160
  const barW   = 28
  const gap    = 12
  const totalW = monthlyData.length * (barW + gap) - gap
  const padB   = 24 // space for month labels

  return (
    <svg
      viewBox={`0 0 ${totalW} ${chartH + padB}`}
      width="100%"
      aria-label="Bar chart produksi susu bulanan"
      role="img"
    >
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
        const y = chartH - pct * chartH
        return (
          <line
            key={pct}
            x1={0} y1={y} x2={totalW} y2={y}
            stroke="var(--border)" strokeWidth={1}
          />
        )
      })}

      {/* Bars */}
      {monthlyData.map(({ month, value }, i) => {
        const barH  = (value / maxVal) * chartH
        const x     = i * (barW + gap)
        const y     = chartH - barH
        const isMax = value === maxVal

        return (
          <g key={month}>
            <defs>
              <linearGradient id={`bar-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={isMax ? 'var(--green)'  : 'var(--amber)'} />
                <stop offset="100%" stopColor={isMax ? '#15803d'       : '#b45309'} stopOpacity={0.6} />
              </linearGradient>
            </defs>

            <rect
              x={x} y={y}
              width={barW} height={barH}
              fill={`url(#bar-${i})`}
              rx={4}
            />

            {/* Value label on top */}
            <text
              x={x + barW / 2} y={y - 4}
              textAnchor="middle"
              fontSize={8}
              fill={isMax ? 'var(--green)' : 'var(--amber)'}
              fontFamily="inherit"
            >
              {value}
            </text>

            {/* Month label */}
            <text
              x={x + barW / 2} y={chartH + padB - 4}
              textAnchor="middle"
              fontSize={9}
              fill="#6b7280"
              fontFamily="inherit"
            >
              {month}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

const qualityColor: Record<string, string> = {
  'A': 'var(--green)',
  'B+':'var(--amber)',
  B:   '#fb923c',
}

export default function SusuPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black mb-1" style={{ color: '#e5e7eb' }}>
          🥛 Dashboard{' '}
          <span className="gradient-text">Produksi Susu</span>
        </h1>
        <p className="text-gray-400 text-sm">Data produksi susu sapi Desa Plosorejo · Diperbarui 15 Jul 2026</p>
      </div>

      {/* Stat cards */}
      <section aria-label="Statistik produksi">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Produksi Hari Ini"
            value="1.631 L"
            sub="↑ 4.2% dari kemarin"
            accent="amber"
            icon={<span aria-hidden>🥛</span>}
          />
          <StatCard
            label="Produksi Bulan Ini"
            value="48.9 t"
            sub="Target: 50 ton"
            accent="green"
            icon={<span aria-hidden>📦</span>}
          />
          <StatCard
            label="Peternak Aktif"
            value="47"
            sub="Dari 52 terdaftar"
            accent="amber"
            icon={<span aria-hidden>👨‍🌾</span>}
          />
          <StatCard
            label="Rata-rata / Sapi"
            value="18.4 L"
            sub="Per hari per ekor"
            accent="green"
            icon={<span aria-hidden>🐄</span>}
          />
        </div>
      </section>

      {/* Bar chart */}
      <section
        className="rounded-xl border p-6"
        style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
        aria-label="Grafik produksi bulanan"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-bold text-white">Tren Produksi 2026</h2>
            <p className="text-xs text-gray-500 mt-0.5">Satuan: ton/bulan</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: 'var(--amber)' }} />
              Normal
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: 'var(--green)' }} />
              Tertinggi
            </span>
          </div>
        </div>
        <BarChart />
      </section>

      {/* Recent table */}
      <section aria-label="Data setoran terakhir">
        <h2 className="font-bold text-white mb-4">Setoran Terakhir</h2>
        <div
          className="rounded-xl border overflow-hidden"
          style={{ borderColor: 'var(--border)' }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--s2)', borderBottom: `1px solid var(--border)` }}>
                {['Tanggal', 'Peternak', 'Volume', 'Kualitas', 'Status'].map(col => (
                  <th
                    key={col}
                    className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentRows.map((row, i) => (
                <tr
                  key={i}
                  className="transition-colors hover:bg-white/[0.02]"
                  style={{
                    backgroundColor: i % 2 === 0 ? 'var(--s1)' : 'var(--s2)',
                    borderTop: i > 0 ? '1px solid var(--border)' : undefined,
                  }}
                >
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{row.date}</td>
                  <td className="px-4 py-3 font-medium text-white">{row.peternak}</td>
                  <td className="px-4 py-3 tabular-nums text-gray-200">{row.volume}</td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-block px-2 py-0.5 rounded text-xs font-bold"
                      style={{
                        color: qualityColor[row.kualitas] ?? '#9ca3af',
                        backgroundColor: `${qualityColor[row.kualitas] ?? '#9ca3af'}18`,
                      }}
                    >
                      {row.kualitas}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1 text-xs"
                      style={{ color: row.status === 'Diterima' ? 'var(--green)' : 'var(--amber)' }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  )
}
