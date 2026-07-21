'use client'

import { useState } from 'react'
import type { GaleriAlbum } from '@/lib/types'

interface GaleriGridProps {
  albums: GaleriAlbum[]
}

export default function GaleriGrid({ albums }: GaleriGridProps) {
  const [active, setActive] = useState<GaleriAlbum | null>(null)

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
              className="h-36 flex items-center justify-center text-5xl"
              style={{ backgroundColor: `${album.warna}15` }}
              aria-hidden="true"
            >
              {album.emoji}
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
                  style={{ color: album.warna, backgroundColor: `${album.warna}18` }}
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
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.82)' }}
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
              <div>
                <p className="section-label mb-2">Album Kegiatan</p>
                <h3
                  className="text-xl font-bold"
                  style={{
                    fontFamily: 'var(--font-playfair), Georgia, serif',
                    color: 'var(--text)',
                  }}
                >
                  {active.emoji} {active.judul}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="w-9 h-9 rounded-lg border text-sm"
                style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              {active.deskripsi}
            </p>

            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: Math.min(active.count, 6) }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${active.warna}15`, border: '1px solid var(--border)' }}
                >
                  {active.emoji}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs" style={{ color: 'var(--muted)' }}>
              <span>{active.tanggal}</span>
              <span style={{ color: active.warna }}>{active.count} foto dokumentasi</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
