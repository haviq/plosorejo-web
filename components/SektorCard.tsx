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
  amber: 'var(--gold)',
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
      className="card-surface group p-5 flex flex-col gap-4 h-full"
      aria-label={`Lihat sektor ${nama}`}
    >
      <div className="flex items-center gap-3">
        <span
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ backgroundColor: `${color}18` }}
          aria-hidden="true"
        >
          {icon}
        </span>
        <h3
          className="font-bold group-hover:underline underline-offset-2"
          style={{ color: 'var(--text)' }}
        >
          {nama}
        </h3>
      </div>

      <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--muted)' }}>
        {deskripsi}
      </p>

      {stats.length > 0 && (
        <div
          className="grid grid-cols-2 gap-2 mt-auto pt-3 border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          {stats.slice(0, 2).map(({ label, value }) => (
            <div key={label}>
              <p className="text-sm font-bold tabular-nums" style={{ color }}>
                {value}
              </p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      )}
    </Link>
  )
}
