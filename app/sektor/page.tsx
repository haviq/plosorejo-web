import type { Metadata } from 'next'
import Link from 'next/link'
import Icon from '@/components/Icon'
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
    <main className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Header */}
      <div className="px-5 pt-24 pb-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] mb-1" style={{ color: 'var(--gold)' }}>
          Padukuhan Plosorejo
        </p>
        <h1 className="text-2xl font-black" style={{ color: 'var(--text)' }}>
          Sektor Unggulan
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
          7 pilar ekonomi &amp; sosial desa
        </p>
      </div>

      {/* iOS-style app grid */}
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
              <span
                className="text-[11px] font-semibold text-center leading-tight"
                style={{ color: 'var(--text)' }}
              >
                {s.nama}
              </span>
              {/* Stat pill */}
              {s.stats?.[0] && (
                <span
                  className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: `${s.color}18`,
                    color: s.color,
                  }}
                >
                  {s.stats[0].value}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Detail cards (list view below grid) */}
      <div className="px-4 pb-16 space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.14em] mb-3" style={{ color: 'var(--muted)' }}>
          Detail Sektor
        </p>
        {sektors.map((s) => (
          <Link
            key={`detail-${s.slug}`}
            href={`/sektor/${s.slug}`}
            className="flex items-center gap-4 p-4 rounded-2xl active:scale-[0.99] transition-transform"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
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
    </main>
  )
}
