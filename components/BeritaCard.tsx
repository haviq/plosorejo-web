import Link from 'next/link'

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
  Budaya: 'var(--amber)',
  Pendidikan: '#60a5fa',
  Peternakan: 'var(--amber)',
}

function formatTanggal(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BeritaCard({ slug, judul, tanggal, kategori, ringkasan }: BeritaCardProps) {
  const color = kategoriColor[kategori] ?? '#9ca3af'

  return (
    <Link
      href={`/berita/${slug}`}
      className="group rounded-xl border p-5 flex flex-col gap-3 transition-colors hover:border-gray-600"
      style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
      aria-label={`Baca berita: ${judul}`}
    >
      {/* Kategori + tanggal */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ color, backgroundColor: `${color}18` }}
        >
          {kategori}
        </span>
        <span className="text-xs text-gray-500">{formatTanggal(tanggal)}</span>
      </div>

      {/* Title */}
      <h3 className="font-bold text-white leading-snug group-hover:underline underline-offset-2 line-clamp-2">
        {judul}
      </h3>

      {/* Ringkasan */}
      <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">{ringkasan}</p>

      {/* Read more */}
      <span className="text-xs mt-auto" style={{ color: 'var(--amber)' }}>
        Baca selengkapnya →
      </span>
    </Link>
  )
}
