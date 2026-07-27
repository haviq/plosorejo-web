import Link from 'next/link'
import Icon from '@/components/Icon'

interface SektorCardProps {
  href: string
  icon: string
  nama: string
  deskripsi: string
  stats: { label: string; value: string }[]
  accent?: 'amber' | 'green' | 'indigo'
}

// iOS-style app tile card
export default function SektorCard({
  href,
  icon,
  nama,
  deskripsi,
  stats,
}: SektorCardProps) {
  const color = 'var(--gold)'
  const colorHex = '#d4af37'

  return (
    <Link
      href={href}
      className="reveal-item flex flex-col items-center gap-2.5 p-4 rounded-2xl active:scale-95 transition-all duration-150 group"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        textDecoration: 'none',
      }}
      aria-label={`Sektor ${nama}`}
    >
      {/* iOS icon tile */}
      <div
        className="w-16 h-16 rounded-[18px] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200"
        style={{
          background: `linear-gradient(135deg, ${colorHex}28 0%, ${colorHex}10 100%)`,
          border: `1.5px solid ${colorHex}35`,
        }}
        aria-hidden="true"
      >
        <Icon name={icon || nama} size={28} />
      </div>

      {/* Name */}
      <p
        className="text-[13px] font-bold text-center leading-tight"
        style={{ color: 'var(--text)' }}
      >
        {nama}
      </p>

      {/* Stat pill */}
      {stats?.[0] && (
        <span
          className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
          style={{
            background: `${colorHex}15`,
            color,
          }}
        >
          {stats[0].value}
        </span>
      )}
    </Link>
  )
}
