'use client'

import { useMemo, useState } from 'react'
import UMKMCard from '@/components/UMKMCard'
import type { UMKMItem } from '@/lib/types'

interface UMKMCatalogProps {
  items: UMKMItem[]
}

export default function UMKMCatalog({ items }: UMKMCatalogProps) {
  const [query, setQuery] = useState('')
  const [jenis, setJenis] = useState('Semua')
  const [onlyOpen, setOnlyOpen] = useState(false)

  const jenisList = useMemo(() => {
    const set = new Set(items.map((i) => i.jenis))
    return ['Semua', ...Array.from(set).sort()]
  }, [items])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((item) => {
      if (jenis !== 'Semua' && item.jenis !== jenis) return false
      if (onlyOpen && !item.aktif) return false
      if (!q) return true
      return (
        item.nama.toLowerCase().includes(q) ||
        item.pemilik.toLowerCase().includes(q) ||
        item.produk.toLowerCase().includes(q) ||
        item.jenis.toLowerCase().includes(q)
      )
    })
  }, [items, query, jenis, onlyOpen])

  return (
    <div className="space-y-6">
      <div className="card-surface p-4 md:p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <label className="flex-1">
            <span className="sr-only">Cari UMKM</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama, produk, atau pemilik..."
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{
                backgroundColor: 'var(--s2)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            />
          </label>
          <button
            type="button"
            onClick={() => setOnlyOpen((v) => !v)}
            className="px-4 py-3 rounded-xl text-sm font-semibold border transition-colors"
            style={{
              borderColor: onlyOpen ? 'var(--green)' : 'var(--border)',
              color: onlyOpen ? 'var(--green)' : 'var(--muted)',
              backgroundColor: onlyOpen ? 'rgba(34,197,94,0.1)' : 'transparent',
            }}
          >
            {onlyOpen ? '● Hanya Aktif' : '○ Semua Status'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {jenisList.map((j) => {
            const active = jenis === j
            return (
              <button
                key={j}
                type="button"
                onClick={() => setJenis(j)}
                className="badge border transition-colors"
                style={{
                  borderColor: active ? 'var(--gold)' : 'var(--border)',
                  color: active ? 'var(--gold)' : 'var(--muted)',
                  backgroundColor: active ? 'var(--gold-glow)' : 'transparent',
                  cursor: 'pointer',
                }}
              >
                {j}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Menampilkan <span style={{ color: 'var(--gold)' }}>{filtered.length}</span> dari {items.length} usaha
        </p>
        {(query || jenis !== 'Semua' || onlyOpen) && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setJenis('Semua')
              setOnlyOpen(false)
            }}
            className="text-xs font-semibold"
            style={{ color: 'var(--gold)' }}
          >
            Reset filter
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="card-surface p-10 text-center space-y-2">
          <p className="text-2xl" aria-hidden="true">🔍</p>
          <p className="font-semibold" style={{ color: 'var(--text)' }}>Tidak ada UMKM ditemukan</p>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Coba ubah kata kunci atau filter jenis usaha.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((item) => (
            <UMKMCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
