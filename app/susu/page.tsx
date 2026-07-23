import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import StatCard from '@/components/StatCard'
import Icon from '@/components/Icon'

export const metadata: Metadata = {
  title: 'Produksi Susu',
  description: 'Dashboard data produksi susu harian dan bulanan Padukuhan Plosorejo.',
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
  { date: '15 Jul 2026', peternak: 'Kelompok A – Pak Harto', volume: '320 L', kualitas: 'A', status: 'Diterima' },
  { date: '15 Jul 2026', peternak: 'Kelompok B – Bu Rahayu', volume: '285 L', kualitas: 'A', status: 'Diterima' },
  { date: '15 Jul 2026', peternak: 'Kelompok C – Pak Suryono', volume: '198 L', kualitas: 'B', status: 'Diterima' },
  { date: '14 Jul 2026', peternak: 'Kelompok A – Pak Harto', volume: '310 L', kualitas: 'A', status: 'Diterima' },
  { date: '14 Jul 2026', peternak: 'Kelompok D – Bu Sari', volume: '241 L', kualitas: 'B+', status: 'Diterima' },
  { date: '14 Jul 2026', peternak: 'Kelompok B – Bu Rahayu', volume: '277 L', kualitas: 'A', status: 'Diterima' },
  { date: '13 Jul 2026', peternak: 'Kelompok C – Pak Suryono', volume: '203 L', kualitas: 'B', status: 'Pending' },
]

const maxVal = Math.max(...monthlyData.map((d) => d.value))

function BarChart() {
  const chartH = 160
  const barW = 28
  const gap = 12
  const totalW = monthlyData.length * (barW + gap) - gap
  const padB = 24

  return (
    <svg
      viewBox={`0 0 ${totalW} ${chartH + padB}`}
      width="100%"
      aria-label="Bar chart produksi susu bulanan"
      role="img"
    >
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
        const y = chartH - pct * chartH
        return (
          <line key={pct} x1={0} y1={y} x2={totalW} y2={y} stroke="var(--border)" strokeWidth={1} />
        )
      })}

      {monthlyData.map(({ month, value }, i) => {
        const barH = (value / maxVal) * chartH
        const x = i * (barW + gap)
        const y = chartH - barH
        const isMax = value === maxVal
        const color = isMax ? 'var(--gold)' : 'var(--gold)'

        return (
          <g key={month}>
            <defs>
              <linearGradient id={`bar-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} />
                <stop offset="100%" stopColor={isMax ? '#15803d' : '#92400e'} stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <rect x={x} y={y} width={barW} height={barH} fill={`url(#bar-${i})`} rx={4} />
            <text
              x={x + barW / 2}
              y={y - 4}
              textAnchor="middle"
              fontSize={8}
              fill={color}
              fontFamily="inherit"
            >
              {value}
            </text>
            <text
              x={x + barW / 2}
              y={chartH + padB - 4}
              textAnchor="middle"
              fontSize={9}
              fill="var(--muted)"
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
  A: 'var(--gold)',
  'B+': 'var(--gold)',
  B: '#fb923c',
}

export default function SusuPage() {
  return (
    <div className="page-shell space-y-10">
      <PageHeader
        eyebrow="Sektor Unggulan"
        title="Dashboard"
        highlight="Produksi Susu"
        description="Data produksi susu sapi Padukuhan Plosorejo · Diperbarui 15 Juli 2026"
      />

      {/* Stat cards */}
      <section aria-label="Statistik produksi">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Produksi Hari Ini" value="1.631 L" sub="↑ 4.2% dari kemarin" accent="amber" icon={<Icon name="susu" size={16} />} />
          <StatCard label="Produksi Bulan Ini" value="48.9 t" sub="Target: 50 ton" accent="amber" icon={<Icon name="chart" size={16} />} />
          <StatCard label="Peternak Aktif" value="47" sub="Dari 52 terdaftar" accent="amber" icon={<Icon name="people" size={16} />} />
          <StatCard label="Rata-rata / Sapi" value="18.4 L" sub="Per hari per ekor" accent="amber" icon={<Icon name="peternakan" size={16} />} />
        </div>
      </section>

      {/* Bar chart */}
      <section className="card-surface p-6" aria-label="Grafik produksi bulanan">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="font-bold" style={{ color: 'var(--text)' }}>Tren Produksi 2026</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Satuan: ton/bulan</p>
          </div>
          <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--muted)' }}>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: 'var(--gold)' }} />
              Normal
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: 'var(--gold)' }} />
              Tertinggi
            </span>
          </div>
        </div>
        <BarChart />
      </section>

      {/* Recent table */}
      <section aria-label="Data setoran terakhir" className="space-y-4">
        <h2 className="section-label">Setoran Terakhir</h2>
        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--s2)', borderBottom: '1px solid var(--border)' }}>
                  {['Tanggal', 'Peternak', 'Volume', 'Kualitas', 'Status'].map((col) => (
                    <th key={col} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
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
                      backgroundColor: i % 2 === 0 ? 'var(--s1)' : 'transparent',
                      borderTop: i > 0 ? '1px solid var(--border)' : undefined,
                    }}
                  >
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: 'var(--muted)' }}>{row.date}</td>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--text)' }}>{row.peternak}</td>
                    <td className="px-4 py-3 tabular-nums" style={{ color: 'var(--muted)' }}>{row.volume}</td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-block px-2 py-0.5 rounded text-xs font-bold"
                        style={{
                          color: qualityColor[row.kualitas] ?? 'var(--muted)',
                          backgroundColor: `${qualityColor[row.kualitas] ?? 'var(--muted)'}18`,
                        }}
                      >
                        {row.kualitas}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1 text-xs"
                        style={{ color: row.status === 'Diterima' ? 'var(--gold)' : 'var(--gold)' }}
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
        </div>
      </section>

      {/* Info koperasi */}
      <section
        className="card-surface p-6 text-center space-y-3"
        style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.05))' }}
        aria-label="Informasi koperasi susu"
      >
        <div
          className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center"
          style={{ background: 'var(--gold-glow)', color: 'var(--gold)' }}
          aria-hidden="true"
        >
          <Icon name="peternakan" size={22} />
        </div>
        <h2 className="font-black text-lg">Koperasi Susu Plosorejo</h2>
        <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--muted)' }}>
          Setoran susu setiap hari pukul 05.30 – 07.30 dan 15.30 – 17.30 WIB di TPS Plosorejo.
          Pembayaran setiap tanggal 10 per bulan.
        </p>
        <a
          href="https://wa.me/6281234567890?text=Saya%20ingin%20info%20koperasi%20susu%20Plosorejo"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Hubungi Pengurus
        </a>
      </section>
    </div>
  )
}
