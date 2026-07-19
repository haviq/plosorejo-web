import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import beritaData from '@/content/berita.json'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return beritaData.map((b) => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const berita = beritaData.find((b) => b.slug === slug)
  if (!berita) return { title: 'Berita tidak ditemukan' }
  return {
    title: berita.judul,
    description: berita.ringkasan,
  }
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
  return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function BeritaDetailPage({ params }: Props) {
  const { slug } = await params
  const berita = beritaData.find((b) => b.slug === slug)
  if (!berita) notFound()

  const color = kategoriColor[berita.kategori] ?? '#9ca3af'
  const paragraphs = berita.isi.split('\n\n').filter(Boolean)
  const lainnya = beritaData.filter((b) => b.slug !== slug).slice(0, 3)

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
        <span aria-hidden="true">/</span>
        <Link href="/berita" className="hover:text-white transition-colors">Berita</Link>
        <span aria-hidden="true">/</span>
        <span className="text-gray-400 line-clamp-1">{berita.judul}</span>
      </nav>

      {/* Artikel */}
      <article className="space-y-6">
        {/* Kategori + tanggal */}
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ color, backgroundColor: `${color}18` }}
          >
            {berita.kategori}
          </span>
          <time dateTime={berita.tanggal} className="text-xs text-gray-500">
            {formatTanggal(berita.tanggal)}
          </time>
        </div>

        {/* Judul */}
        <h1 className="text-3xl sm:text-4xl font-black leading-tight text-white">
          {berita.judul}
        </h1>

        {/* Ringkasan */}
        <p
          className="text-base text-gray-300 leading-relaxed border-l-2 pl-4 italic"
          style={{ borderColor: color }}
        >
          {berita.ringkasan}
        </p>

        {/* Divider */}
        <hr style={{ borderColor: 'var(--border)' }} />

        {/* Body */}
        <div className="space-y-4">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-gray-300 leading-relaxed text-sm">
              {p}
            </p>
          ))}
        </div>
      </article>

      {/* Berita lainnya */}
      {lainnya.length > 0 && (
        <section aria-label="Berita lainnya">
          <h2 className="text-lg font-black mb-4">Berita Lainnya</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {lainnya.map((b) => {
              const c = kategoriColor[b.kategori] ?? '#9ca3af'
              return (
                <Link
                  key={b.slug}
                  href={`/berita/${b.slug}`}
                  className="rounded-xl border p-4 flex flex-col gap-2 hover:border-gray-600 transition-colors"
                  style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
                >
                  <span
                    className="self-start text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ color: c, backgroundColor: `${c}18` }}
                  >
                    {b.kategori}
                  </span>
                  <p className="text-sm font-semibold text-white line-clamp-2 leading-snug">
                    {b.judul}
                  </p>
                  <p className="text-xs text-gray-500">{formatTanggal(b.tanggal)}</p>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Back */}
      <Link
        href="/berita"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        aria-label="Kembali ke daftar berita"
      >
        ← Kembali ke Berita
      </Link>

    </div>
  )
}
