import { clsx } from 'clsx'

interface StatCardProps {
  label: string
  value: string
  sub?: string
  /** kept for compatibility — all accents now use gold */
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
  const accentColor = accent === 'neutral' ? 'var(--muted)' : 'var(--gold)'

  return (
    <div
      className="rounded-xl p-5 border flex flex-col gap-3"
      style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium uppercase tracking-widest text-[var(--muted)]">
          {label}
        </span>
        {icon && (
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(212,175,55,0.12)', color: 'var(--gold)' }}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
      </div>

      <p
        className={clsx('text-3xl font-bold tabular-nums leading-none')}
        style={{ color: accent === 'neutral' ? 'var(--text)' : accentColor }}
      >
        {value}
      </p>

      {sub && <p className="text-xs text-[var(--muted)]">{sub}</p>}
    </div>
  )
}
