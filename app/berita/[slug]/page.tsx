import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBeritaBySlug, getBeritaList, getBeritaSlugs } from '@/lib/data'
import { formatTanggal } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getBeritaSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const berita = await getBeritaBySlug(slug)
  if (!berita) return { title: 'Berita tidak ditemukan' }
  return {
    title: berita.judul,
    description: berita.ringkasan,
  }
}

const kategoriColor: Record<string, string> = {
  Pertanian: 'var(--gold)',
  Kesehatan: 'var(--gold)',
  KKN: 'var(--gold)',
  Budaya: 'var(--gold)',
  Pendidikan: 'var(--gold)',
  Peternakan: 'var(--gold)',
}

export default async function BeritaDetailPage({ params }: Props) {
  const { slug } = await params
  const berita = await getBeritaBySlug(slug)
  if (!berita) notFound()

  const color = kategoriColor[berita.kategori] ?? 'var(--muted)'
  const paragraphs = berita.isi.split('\n\n').filter(Boolean)
  const all = await getBeritaList()
  const lainnya = all.filter((b) => b.slug !== slug).slice(0, 3)

  return (
    <div className="page-shell max-w-4xl space-y-10">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted)' }}>
        <Link href="/" className="hover:opacity-80 transition-opacity">
          Beranda
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/berita" className="hover:opacity-80 transition-opacity">
          Berita
        </Link>
        <span aria-hidden="true">/</span>
        <span className="line-clamp-1" style={{ color: 'var(--text)' }}>
          {berita.judul}
        </span>
      </nav>

      <article className="space-y-6">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="badge" style={{ color, backgroundColor: `${color}18` }}>
            {berita.kategori}
          </span>
          <time dateTime={berita.tanggal} className="text-xs" style={{ color: 'var(--muted)' }}>
            {formatTanggal(berita.tanggal, {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>
        </div>

        <h1
          className="font-black leading-tight"
          style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            color: 'var(--text)',
          }}
        >
          {berita.judul}
        </h1>

        <p
          className="text-base leading-relaxed border-l-2 pl-4 italic"
          style={{ borderColor: color, color: 'var(--muted)' }}
        >
          {berita.ringkasan}
        </p>

        <hr style={{ borderColor: 'var(--border)' }} />

        <div className="space-y-4">
          {paragraphs.map((p, i) => (
            <p key={i} className="leading-relaxed text-sm md:text-base" style={{ color: 'var(--text)' }}>
              {p}
            </p>
          ))}
        </div>
      </article>

      {lainnya.length > 0 && (
        <section aria-label="Berita lainnya" className="space-y-4">
          <h2 className="section-label">Berita Lainnya</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {lainnya.map((b) => {
              const c = kategoriColor[b.kategori] ?? 'var(--muted)'
              return (
                <Link key={b.slug} href={`/berita/${b.slug}`} className="card-surface p-4 flex flex-col gap-2">
                  <span className="self-start badge" style={{ color: c, backgroundColor: `${c}18` }}>
                    {b.kategori}
                  </span>
                  <p className="text-sm font-semibold line-clamp-2 leading-snug" style={{ color: 'var(--text)' }}>
                    {b.judul}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>
                    {formatTanggal(b.tanggal)}
                  </p>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <Link href="/berita" className="btn-ghost" aria-label="Kembali ke daftar berita">
        ← Kembali ke Berita
      </Link>
    </div>
  )
}
