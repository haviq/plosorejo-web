'use client'

import { useState } from 'react'
import type { GaleriAlbum } from '@/lib/types'
import Icon from '@/components/Icon'

interface GaleriGridProps {
  albums: GaleriAlbum[]
}

/** Static grid + simple dialog — no framer opacity animations. */
export default function GaleriGrid({ albums }: GaleriGridProps) {
  const [active, setActive] = useState<GaleriAlbum | null>(null)
  const accent = 'var(--gold)'

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {albums.map((album) => (
          <button
            key={album.id}
            type="button"
            onClick={() => setActive(album)}
            className="card-surface overflow-hidden flex flex-col text-left"
            aria-label={`Buka album: ${album.judul}`}
          >
            <div
              className="h-36 flex items-center justify-center"
              style={{ backgroundColor: 'rgba(212,175,55,0.1)', color: accent }}
              aria-hidden="true"
            >
              <Icon name={album.icon || album.emoji || 'galeri'} size={36} />
            </div>
            <div className="p-4 flex flex-col gap-2 flex-1">
              <h3 className="font-bold text-sm leading-snug" style={{ color: 'var(--text)' }}>
                {album.judul}
              </h3>
              <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--muted)' }}>
                {album.deskripsi}
              </p>
              <div
                className="flex items-center justify-between mt-auto pt-2 border-t"
                style={{ borderColor: 'var(--border)' }}
              >
                <span className="text-xs" style={{ color: 'var(--muted)' }}>
                  {album.tanggal}
                </span>
                <span
                  className="badge"
                  style={{ color: accent, backgroundColor: 'rgba(212,175,55,0.12)' }}
                >
                  {album.count} foto
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80"
          role="dialog"
          aria-modal="true"
          aria-label={`Detail album ${active.judul}`}
          onClick={() => setActive(null)}
        >
          <div
            className="card-surface max-w-lg w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(212,175,55,0.12)', color: accent }}
                >
                  <Icon name={active.icon || active.emoji || 'galeri'} size={24} />
                </span>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: 'var(--text)' }}>
                    {active.judul}
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>
                    {active.tanggal}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="text-sm px-3 py-1.5 rounded-lg border"
                style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
              >
                Tutup
              </button>
            </div>

            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              {active.deskripsi}
            </p>

            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: Math.min(active.count, 6) }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(212,175,55,0.1)',
                    border: '1px solid var(--border)',
                    color: accent,
                  }}
                >
                  <Icon name={active.icon || active.emoji || 'galeri'} size={22} />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs" style={{ color: 'var(--muted)' }}>
              <span>{active.tanggal}</span>
              <span style={{ color: accent }}>{active.count} foto dokumentasi</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
