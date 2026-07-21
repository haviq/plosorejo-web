'use client'

import { isOpenNow, waLink } from '@/lib/utils'
import type { UMKMItem } from '@/lib/types'

interface UMKMCardProps {
  item: UMKMItem
}

const jenisColor: Record<string, string> = {
  Koperasi: 'var(--gold)',
  Kuliner: '#f97316',
  Kerajinan: '#a78bfa',
  Pertanian: 'var(--green)',
  Jasa: '#60a5fa',
}

export default function UMKMCard({ item }: UMKMCardProps) {
  const color = jenisColor[item.jenis] ?? '#9ca3af'
  const open = item.aktif && isOpenNow(item.jamBuka)
  const waUrl = waLink(
    item.whatsapp,
    `Halo, saya tertarik dengan produk ${item.nama}. Boleh saya tahu info lebih lanjut?`,
  )

  return (
    <article className="card-surface p-5 flex flex-col gap-3 h-full">
      <div className="flex items-start gap-3">
        <span
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ backgroundColor: `${color}18` }}
          aria-hidden="true"
        >
          {item.emoji}
        </span>
        <div className="min-w-0">
          <h3 className="font-bold leading-tight line-clamp-1" style={{ color: 'var(--text)' }}>
            {item.nama}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {item.pemilik}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="badge" style={{ color, backgroundColor: `${color}18` }}>
          {item.jenis}
        </span>
        <span
          className="badge border"
          style={{
            color: open ? 'var(--green)' : 'var(--muted)',
            borderColor: open ? 'rgba(34,197,94,0.35)' : 'var(--border)',
            backgroundColor: open ? 'rgba(34,197,94,0.12)' : 'transparent',
          }}
        >
          {open ? '● Buka' : '○ Tutup'}
        </span>
      </div>

      <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--muted)' }}>
        {item.produk}
      </p>

      <div className="flex flex-wrap gap-3 text-xs" style={{ color: 'var(--muted)' }}>
        <span>💰 {item.harga}</span>
        <span>🕐 {item.jamBuka}</span>
      </div>

      {item.alamat && (
        <p className="text-xs line-clamp-1" style={{ color: 'var(--muted2)' }}>
          📍 {item.alamat}
        </p>
      )}

      <div
        className="flex items-center justify-between mt-auto pt-3 border-t gap-2"
        style={{ borderColor: 'var(--border)' }}
      >
        <span
          className="flex items-center gap-1 text-xs"
          style={{ color: item.aktif ? 'var(--green)' : 'var(--muted)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
          {item.aktif ? 'Aktif' : 'Tidak Aktif'}
        </span>

        <div className="flex items-center gap-2">
          {item.gmaps && (
            <a
              href={item.gmaps}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors"
              style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
              aria-label={`Lokasi ${item.nama} di Google Maps`}
            >
              Maps
            </a>
          )}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-black transition-opacity hover:opacity-90"
            style={{ background: 'var(--gradient)' }}
            aria-label={`Hubungi ${item.nama} via WhatsApp`}
          >
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  )
}
