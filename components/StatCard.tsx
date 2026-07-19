import { clsx } from 'clsx'

interface StatCardProps {
  label: string
  value: string
  sub?: string
  /** 'amber' | 'green' | 'neutral' — controls accent colour */
  accent?: 'amber' | 'green' | 'neutral'
  icon?: React.ReactNode
}

export default function StatCard({
  label,
  value,
  sub,
  accent = 'neutral',
  icon,
}: StatCardProps) {
  const accentColor = {
    amber:   'var(--amber)',
    green:   'var(--green)',
    neutral: '#6b7280',
  }[accent]

  return (
    <div
      className="rounded-xl p-5 border flex flex-col gap-3"
      style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium uppercase tracking-widest text-gray-500">
          {label}
        </span>
        {icon && (
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
      </div>

      <p
        className={clsx('text-3xl font-bold tabular-nums leading-none')}
        style={{ color: accentColor !== '#6b7280' ? accentColor : 'white' }}
      >
        {value}
      </p>

      {sub && <p className="text-xs text-gray-500">{sub}</p>}
    </div>
  )
}
