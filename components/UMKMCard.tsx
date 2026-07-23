import { isOpenNow, waLink } from '@/lib/utils'
import type { UMKMItem } from '@/lib/types'
import Icon from '@/components/Icon'

interface UMKMCardProps {
  item: UMKMItem
}

export default function UMKMCard({ item }: UMKMCardProps) {
  const color = 'var(--gold)'
  const open = item.aktif && isOpenNow(item.jamBuka)
  const waUrl = waLink(
    item.whatsapp,
    `Halo, saya tertarik dengan produk ${item.nama}. Boleh saya tahu info lebih lanjut?`,
  )
  const iconName = item.icon || item.jenis || 'umkm'

  return (
    <article className="card-surface p-5 flex flex-col gap-3 h-full">
      <div className="flex items-start gap-3">
        <span
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}18`, color }}
          aria-hidden="true"
        >
          <Icon name={iconName} size={20} />
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
            color: open ? 'var(--gold)' : 'var(--muted)',
            borderColor: open ? 'rgba(212,175,55,0.35)' : 'var(--border)',
            backgroundColor: open ? 'rgba(212,175,55,0.12)' : 'transparent',
          }}
        >
          {open ? 'Buka' : 'Tutup'}
        </span>
      </div>

      <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--muted)' }}>
        {item.produk}
      </p>

      <div className="flex flex-wrap gap-3 text-xs" style={{ color: 'var(--muted)' }}>
        <span className="inline-flex items-center gap-1">
          <Icon name="money" size={14} />
          {item.harga}
        </span>
        <span className="inline-flex items-center gap-1">
          <Icon name="clock" size={14} />
          {item.jamBuka}
        </span>
      </div>

      {item.alamat && (
        <p className="text-xs line-clamp-1 inline-flex items-center gap-1" style={{ color: 'var(--muted2)' }}>
          <Icon name="location" size={14} />
          {item.alamat}
        </p>
      )}

      <div
        className="flex items-center justify-between mt-auto pt-3 border-t gap-2"
        style={{ borderColor: 'var(--border)' }}
      >
        <span
          className="flex items-center gap-1 text-xs"
          style={{ color: item.aktif ? 'var(--gold)' : 'var(--muted)' }}
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-90"
            style={{ background: 'var(--gradient)', color: 'var(--btn-primary-fg)' }}
            aria-label={`Hubungi ${item.nama} via WhatsApp`}
          >
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  )
}
