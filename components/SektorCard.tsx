import Link from 'next/link'

interface SektorCardProps {
  href: string
  icon: string
  nama: string
  deskripsi: string
  stats: { label: string; value: string }[]
  accent?: 'amber' | 'green' | 'indigo'
}

const accentMap = {
  amber: 'var(--amber)',
  green: 'var(--green)',
  indigo: '#818cf8',
}

export default function SektorCard({
  href,
  icon,
  nama,
  deskripsi,
  stats,
  accent = 'amber',
}: SektorCardProps) {
  const color = accentMap[accent]

  return (
    <Link
      href={href}
      className="group rounded-xl border p-5 flex flex-col gap-4 transition-colors hover:border-current"
      style={{
        backgroundColor: 'var(--s1)',
        borderColor: 'var(--border)',
        // @ts-expect-error CSS custom property
        '--tw-border-opacity': 1,
      }}
      aria-label={`Lihat sektor ${nama}`}
    >
      {/* Icon + title */}
      <div className="flex items-center gap-3">
        <span
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ backgroundColor: `${color}18` }}
          aria-hidden="true"
        >
          {icon}
        </span>
        <h3 className="font-bold text-white group-hover:underline underline-offset-2">
          {nama}
        </h3>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">{deskripsi}</p>

      {/* Stats row */}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-auto pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
          {stats.slice(0, 2).map(({ label, value }) => (
            <div key={label}>
              <p className="text-sm font-bold tabular-nums" style={{ color }}>{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      )}
    </Link>
  )
}
