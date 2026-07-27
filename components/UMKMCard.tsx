'use client'

import { useState } from 'react'
import type { UMKMItem } from '@/lib/types'
import { isOpenNow } from '@/lib/utils'
import { waLink } from '@/lib/site'
import { safeMapsHref } from '@/lib/safe-url'
import Icon from '@/components/Icon'
import OrderUMKMForm from '@/components/OrderUMKMForm'

interface UMKMCardProps {
  item: UMKMItem
}

export default function UMKMCard({ item }: UMKMCardProps) {
  const [orderOpen, setOrderOpen] = useState(false)
  const open = item.aktif && isOpenNow(item.jamBuka)
  const waUrl = waLink(
    item.whatsapp,
    `Halo, saya tertarik dengan produk ${item.nama}. Boleh saya tahu info lebih lanjut?`,
  )
  const mapsUrl = safeMapsHref(item.gmaps)
  const iconName = item.icon || item.jenis || 'umkm'
  const canOrder = waUrl !== '#'

  return (
    <article
      className="flex flex-col gap-3 p-4 rounded-2xl border h-full"
      style={{
        backgroundColor: 'var(--s1)',
        borderColor: 'var(--border)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
      }}
    >
      {/* Header: icon tile + name + status */}
      <div className="flex items-start gap-3">
        {/* Icon tile 48x48 */}
        <span
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--gradient)', color: 'var(--btn-primary-fg)' }}
          aria-hidden="true"
        >
          <Icon name={iconName} size={22} />
        </span>

        {/* Name + owner */}
        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="font-bold leading-tight line-clamp-1 text-sm" style={{ color: 'var(--text)' }}>
            {item.nama}
          </h3>
          {item.pemilik && (
            <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--muted)' }}>
              {item.pemilik}
            </p>
          )}
        </div>

        {/* Open/closed pill — top-right */}
        <span
          className="flex-shrink-0 mt-0.5 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold leading-none border"
          style={
            open
              ? {
                  color: 'var(--gold)',
                  borderColor: 'rgba(212,175,55,0.35)',
                  backgroundColor: 'var(--gold-glow)',
                }
              : {
                  color: 'var(--muted)',
                  borderColor: 'var(--border)',
                  backgroundColor: 'transparent',
                }
          }
        >
          {open ? 'Buka' : 'Tutup'}
        </span>
      </div>

      {/* Jenis badge + harga */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold leading-none"
          style={{ color: 'var(--gold)', backgroundColor: 'var(--gold-glow)' }}
        >
          {item.jenis}
        </span>
        {item.harga && (
          <span className="text-xs inline-flex items-center gap-1" style={{ color: 'var(--muted)' }}>
            <Icon name="money" size={12} />
            {item.harga}
          </span>
        )}
        {item.jamBuka && (
          <span className="text-xs inline-flex items-center gap-1" style={{ color: 'var(--muted)' }}>
            <Icon name="clock" size={12} />
            {item.jamBuka}
          </span>
        )}
      </div>

      {/* Produk description */}
      {item.produk && (
        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--muted)' }}>
          {item.produk}
        </p>
      )}

      {/* Alamat */}
      {item.alamat && (
        <p className="text-xs line-clamp-1 inline-flex items-center gap-1" style={{ color: 'var(--muted2)' }}>
          <Icon name="location" size={12} />
          {item.alamat}
        </p>
      )}

      {/* Order form or action buttons */}
      {orderOpen && canOrder ? (
        <div
          className="mt-1 rounded-xl p-3 border"
          style={{ borderColor: 'rgba(212,175,55,0.35)', background: 'var(--surface-soft)' }}
        >
          <OrderUMKMForm item={item} onClose={() => setOrderOpen(false)} />
        </div>
      ) : (
        <div className="mt-auto pt-1 flex items-center gap-2">
          {/* Secondary actions: Maps + Chat */}
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs font-semibold border transition-colors active:scale-[0.97]"
              style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
              aria-label={`Lokasi ${item.nama} di Google Maps`}
            >
              <Icon name="location" size={13} />
              Maps
            </a>
          )}
          {canOrder && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs font-semibold border transition-colors active:scale-[0.97]"
              style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
              aria-label={`Chat ${item.nama} via WhatsApp`}
            >
              <Icon name="phone" size={13} />
              Chat
            </a>
          )}

          {/* Primary: Pesan */}
          {canOrder ? (
            <button
              type="button"
              onClick={() => setOrderOpen(true)}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs font-semibold transition-opacity hover:opacity-90 active:scale-[0.97]"
              style={{ background: 'var(--gradient)', color: 'var(--btn-primary-fg)' }}
            >
              Pesan
            </button>
          ) : (
            <span className="text-xs ml-auto" style={{ color: 'var(--muted2)' }}>
              WA belum diisi
            </span>
          )}
        </div>
      )}
    </article>
  )
}
