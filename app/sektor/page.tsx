import type { Metadata } from 'next'
import Link from 'next/link'
import sektorData from '@/content/sektor.json'

export const metadata: Metadata = {
  title: 'Sektor Unggulan',
  description: 'Tujuh sektor unggulan Padukuhan Plosorejo — peternakan sapi perah, pertanian, UMKM, pariwisata, pendidikan, kesehatan, dan budaya.',
}

const sektors = [
  { slug: 'peternakan', ...sektorData.peternakan, emoji: '🐄', color: '#f59e0b' },
  { slug: 'pertanian',  ...sektorData.pertanian,  emoji: '🌾', color: '#22c55e' },
  { slug: 'umkm',       ...sektorData.umkm,       emoji: '🏪', color: '#d4af37' },
  { slug: 'pariwisata', ...sektorData.pariwisata, emoji: '🏔️', color: '#06b6d4' },
  { slug: 'pendidikan', ...sektorData.pendidikan, emoji: '📚', color: '#8b5cf6' },
  { slug: 'kesehatan',  ...sektorData.kesehatan,  emoji: '🏥', color: '#ef4444' },
  { slug: 'budaya',     ...sektorData.budaya,     emoji: '🎭', color: '#f97316' },
]

export default function SektorIndexPage() {
  return (
    <main className="min-h-screen pb-16" style={{ backgroundColor: 'var(--bg)' }}>

      {/* ── iOS-style page header ── */}
      <div className="px-5 pt-24 pb-4">
        <p
          className="text-[10px] font-bold uppercase tracking-[0.18em] mb-1"
          style={{ color: 'var(--gold)' }}
        >
          Padukuhan Plosorejo
        </p>
        <h1 className="text-2xl font-black" style={{ color: 'var(--text)' }}>
          Sektor Unggulan
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
          7 pilar ekonomi &amp; sosial desa
        </p>
      </div>

      {/* ── Section label "Semua Sektor" ── */}
      <div className="px-4 mb-2">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.14em]"
          style={{ color: 'var(--muted)' }}
        >
          Semua Sektor
        </p>
      </div>

      {/* ── iOS 3-column app grid ── */}
      <div className="px-4 pb-8">
        <div className="grid grid-cols-3 gap-3">
          {sektors.map((s) => (
            <Link
              key={s.slug}
              href={`/sektor/${s.slug}`}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl active:scale-95 transition-transform duration-150"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
              }}
              aria-label={`Sektor ${s.nama}`}
            >
              {/* Icon tile */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
                style={{
                  background: `${s.color}22`,
                  border: `1.5px solid ${s.color}44`,
                }}
              >
                <span aria-hidden="true">{s.emoji}</span>
              </div>

              {/* Label */}
              <p
                className="text-[11px] font-semibold text-center leading-tight"
                style={{ color: 'var(--text)' }}
              >
                {s.nama}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* ── List view (secondary, below grid) ── */}
      <div className="px-4">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-2"
          style={{ color: 'var(--muted)' }}
        >
          Detail Sektor
        </p>
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          {sektors.map((s, i) => (
            <Link
              key={`list-${s.slug}`}
              href={`/sektor/${s.slug}`}
              className="flex items-center gap-3 px-4 py-3 active:opacity-70 transition-opacity"
              style={{ borderTop: i > 0 ? '1px solid var(--border)' : undefined }}
              aria-label={`Sektor ${s.nama}`}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: `${s.color}20`, border: `1px solid ${s.color}35` }}
              >
                {s.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>{s.nama}</p>
                <p className="text-xs line-clamp-1 mt-0.5" style={{ color: 'var(--muted)' }}>{s.deskripsi}</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M5 3l4 4-4 4" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          ))}
        </div>
      </div>

    </main>
  )
}
