import Link from 'next/link'
import { formatTanggal } from '@/lib/utils'

interface BeritaCardProps {
  slug: string
  judul: string
  tanggal: string
  kategori: string
  ringkasan: string
}

const kategoriColor: Record<string, string> = {
  Pertanian: 'var(--green)',
  Kesehatan: '#34d399',
  KKN: '#818cf8',
  Budaya: 'var(--gold)',
  Pendidikan: '#60a5fa',
  Peternakan: 'var(--gold)',
}

export default function BeritaCard({
  slug,
  judul,
  tanggal,
  kategori,
  ringkasan,
}: BeritaCardProps) {
  const color = kategoriColor[kategori] ?? '#9ca3af'

  return (
    <Link
      href={`/berita/${slug}`}
      className="card-surface group p-5 flex flex-col gap-3 h-full"
      aria-label={`Baca berita: ${judul}`}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="badge" style={{ color, backgroundColor: `${color}18` }}>
          {kategori}
        </span>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          {formatTanggal(tanggal)}
        </span>
      </div>

      <h3
        className="font-bold leading-snug line-clamp-2 group-hover:underline underline-offset-2"
        style={{ color: 'var(--text)' }}
      >
        {judul}
      </h3>

      <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--muted)' }}>
        {ringkasan}
      </p>

      <span className="text-xs mt-auto font-semibold" style={{ color: 'var(--gold)' }}>
        Baca selengkapnya →
      </span>
    </Link>
  )
}
