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
  const isAccented = accent !== 'neutral'

  return (
    <div
      className="rounded-2xl p-4 border flex flex-col gap-2 relative overflow-hidden"
      style={{
        backgroundColor: 'var(--s1)',
        borderColor: 'var(--border)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
        background: isAccented
          ? 'var(--gradient-soft), var(--s1)'
          : 'var(--s1)',
      }}
    >
      {/* Icon tile — top-right */}
      {icon && (
        <span
          className="absolute top-3.5 right-3.5 w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--gradient)', color: 'var(--btn-primary-fg)' }}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}

      {/* Label */}
      <span
        className="text-[10px] font-semibold uppercase tracking-widest leading-none"
        style={{ color: 'var(--muted)' }}
      >
        {label}
      </span>

      {/* Value */}
      <p
        className="text-3xl font-bold tabular-nums leading-none"
        style={{ color: isAccented ? 'var(--gold)' : 'var(--text)' }}
      >
        {value}
      </p>

      {/* Sub */}
      {sub && (
        <p className="text-xs leading-none" style={{ color: 'var(--muted2)' }}>
          {sub}
        </p>
      )}
    </div>
  )
}
