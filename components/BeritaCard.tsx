import Link from 'next/link'
import { ChevronRightIcon, NewspaperIcon } from '@heroicons/react/24/outline'
import { formatTanggal } from '@/lib/utils'

interface BeritaCardProps {
  slug: string
  judul: string
  tanggal: string
  kategori: string
  ringkasan: string
}

export default function BeritaCard({
  slug,
  judul,
  tanggal,
  kategori,
  ringkasan: _ringkasan,
}: BeritaCardProps) {
  return (
    <Link
      href={`/berita/${slug}`}
      className="flex items-center gap-3 p-3.5 rounded-2xl border transition-transform active:scale-[0.98]"
      style={{
        backgroundColor: 'var(--s1)',
        borderColor: 'var(--border)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
      }}
      aria-label={`Baca berita: ${judul}`}
    >
      {/* Icon tile */}
      <span
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'var(--gradient)', color: 'var(--btn-primary-fg)' }}
        aria-hidden="true"
      >
        <NewspaperIcon width={20} height={20} />
      </span>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Category + date row */}
        <div className="flex items-center gap-2 mb-1">
          <span
            className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold leading-none"
            style={{
              color: 'var(--gold)',
              backgroundColor: 'var(--gold-glow)',
            }}
          >
            {kategori}
          </span>
          <span className="text-[11px] leading-none" style={{ color: 'var(--muted2)' }}>
            {formatTanggal(tanggal)}
          </span>
        </div>

        {/* Title */}
        <p
          className="font-bold leading-snug line-clamp-2 text-sm"
          style={{ color: 'var(--text)' }}
        >
          {judul}
        </p>
      </div>

      {/* Chevron */}
      <ChevronRightIcon
        width={16}
        height={16}
        className="flex-shrink-0"
        style={{ color: 'var(--muted2)' }}
        aria-hidden="true"
      />
    </Link>
  )
}
