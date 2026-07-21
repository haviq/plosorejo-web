'use client'

import { useMemo, useState } from 'react'
import BeritaCard from '@/components/BeritaCard'
import type { BeritaItem } from '@/lib/types'

interface BeritaListProps {
  items: BeritaItem[]
}

export default function BeritaList({ items }: BeritaListProps) {
  const [kategori, setKategori] = useState('Semua')
  const [query, setQuery] = useState('')

  const kategoriList = useMemo(() => {
    const set = new Set(items.map((i) => i.kategori))
    return ['Semua', ...Array.from(set).sort()]
  }, [items])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items
      .filter((item) => {
        if (kategori !== 'Semua' && item.kategori !== kategori) return false
        if (!q) return true
        return (
          item.judul.toLowerCase().includes(q) ||
          item.ringkasan.toLowerCase().includes(q) ||
          item.kategori.toLowerCase().includes(q)
        )
      })
      .sort((a, b) => +new Date(b.tanggal) - +new Date(a.tanggal))
  }, [items, kategori, query])

  return (
    <div className="space-y-6">
      <div className="card-surface p-4 md:p-5 space-y-4">
        <label className="block">
          <span className="sr-only">Cari berita</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul atau topik berita..."
            className="w-full rounded-xl px-4 py-3 text-sm outline-none"
            style={{
              backgroundColor: 'var(--s2)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {kategoriList.map((k) => {
            const active = kategori === k
            return (
              <button
                key={k}
                type="button"
                onClick={() => setKategori(k)}
                className="badge border transition-colors"
                style={{
                  borderColor: active ? 'var(--gold)' : 'var(--border)',
                  color: active ? 'var(--gold)' : 'var(--muted)',
                  backgroundColor: active ? 'var(--gold-glow)' : 'transparent',
                  cursor: 'pointer',
                }}
              >
                {k}
              </button>
            )
          })}
        </div>
      </div>

      <p className="text-sm" style={{ color: 'var(--muted)' }}>
        {filtered.length} berita ditampilkan
      </p>

      {filtered.length === 0 ? (
        <div className="card-surface p-10 text-center space-y-2">
          <p className="text-2xl" aria-hidden="true">📰</p>
          <p className="font-semibold">Belum ada berita di kategori ini</p>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Coba pilih kategori lain atau hapus kata kunci pencarian.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((b) => (
            <BeritaCard
              key={b.slug}
              slug={b.slug}
              judul={b.judul}
              tanggal={b.tanggal}
              kategori={b.kategori}
              ringkasan={b.ringkasan}
            />
          ))}
        </div>
      )}
    </div>
  )
}
