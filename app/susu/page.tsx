import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import StatCard from '@/components/StatCard'
import Icon from '@/components/Icon'
import { getSusuData, getSiteSettings } from '@/lib/data'
import { waLink } from '@/lib/site'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Produksi Susu',
  description: 'Dashboard data produksi susu harian dan bulanan Padukuhan Plosorejo.',
}

function BarChart({ monthly }: { monthly: { month: string; value: number }[] }) {
  const maxVal = Math.max(...monthly.map((d) => d.value), 1)
  const chartH = 160
  const barW = 28
  const gap = 12
  const totalW = monthly.length * (barW + gap) - gap
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

      {monthly.map(({ month, value }, i) => {
        const barH = (value / maxVal) * chartH
        const x = i * (barW + gap)
        const y = chartH - barH
        const isMax = value === maxVal
        const color = 'var(--gold)'

        return (
          <g key={month}>
            <defs>
              <linearGradient id={`bar-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isMax ? '#f0c040' : '#d4af37'} stopOpacity={0.95} />
                <stop offset="100%" stopColor={isMax ? '#a08828' : '#7a6110'} stopOpacity={0.7} />
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
  'A+': 'var(--gold)',
  'B+': 'var(--gold)',
  B: 'var(--warning)',
}

export default async function SusuPage() {
  const [data, site] = await Promise.all([getSusuData(), getSiteSettings()])

  return (
    <div className="page-shell space-y-10">
      <PageHeader
        eyebrow="Sektor Unggulan"
        title="Dashboard"
        highlight="Produksi Susu"
        description={`Data produksi susu sapi Padukuhan Plosorejo · Diperbarui ${data.updatedAt}`}
      />

      <section aria-label="Statistik produksi">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Produksi harian"
            value={data.summary.produksiHarian}
            sub="Estimasi volume harian"
            accent="amber"
            icon={<Icon name="susu" size={16} />}
          />
          <StatCard
            label="Sapi aktif"
            value={String(data.summary.sapiAktif)}
            sub={`${data.summary.kelompok} kelompok`}
            accent="amber"
            icon={<Icon name="peternakan" size={16} />}
          />
          <StatCard
            label="Grade dominan"
            value={data.summary.gradeDominan}
            sub="Kualitas setoran"
            accent="amber"
            icon={<Icon name="chart" size={16} />}
          />
          <StatCard
            label="Data source"
            value="JSON/CMS"
            sub="Siap diisi admin"
            accent="neutral"
            icon={<Icon name="digital" size={16} />}
          />
        </div>
      </section>

      <section className="card-surface p-6" aria-label="Grafik produksi bulanan">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="font-bold" style={{ color: 'var(--text)' }}>Tren Produksi</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Satuan: {data.unit}</p>
          </div>
        </div>
        <BarChart monthly={data.monthly} />
      </section>

      <section aria-label="Data setoran terakhir" className="space-y-4">
        <h2 className="section-label">Setoran terakhir</h2>
        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--s2)', borderBottom: '1px solid var(--border)' }}>
                  {['Tanggal', 'Peternak', 'Volume', 'Kualitas', 'Status'].map((col) => (
                    <th
                      key={col}
                      className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--muted)' }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.recent.map((row, i) => (
                  <tr
                    key={`${row.date}-${row.peternak}-${i}`}
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
                      <span className="inline-flex items-center gap-1 text-xs" style={{ color: 'var(--gold)' }}>
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
        <p className="text-xs" style={{ color: 'var(--muted2)' }}>
          Sumber: <code>content/susu.json</code> atau CMS Studio tipe <strong>Produksi Susu Harian</strong>.
        </p>
      </section>

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
          href={waLink(site.whatsapp, 'Saya ingin info koperasi susu Plosorejo')}
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
