interface UMKMItem {
  id: number
  nama: string
  pemilik: string
  jenis: string
  produk: string
  harga: string
  emoji: string
  jamBuka: string
  whatsapp: string
  aktif: boolean
}

interface UMKMCardProps {
  item: UMKMItem
}

const jenisColor: Record<string, string> = {
  Koperasi: 'var(--amber)',
  Kuliner: '#f97316',
  Kerajinan: '#a78bfa',
  Pertanian: 'var(--green)',
  Jasa: '#60a5fa',
}

export default function UMKMCard({ item }: UMKMCardProps) {
  const color = jenisColor[item.jenis] ?? '#9ca3af'
  const waUrl = `https://wa.me/${item.whatsapp}?text=${encodeURIComponent(`Halo, saya tertarik dengan produk ${item.nama}. Boleh saya tahu info lebih lanjut?`)}`

  return (
    <div
      className="rounded-xl border p-5 flex flex-col gap-3"
      style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <span
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ backgroundColor: `${color}18` }}
          aria-hidden="true"
        >
          {item.emoji}
        </span>
        <div className="min-w-0">
          <h3 className="font-bold text-white leading-tight line-clamp-1">{item.nama}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{item.pemilik}</p>
        </div>
      </div>

      {/* Badge jenis */}
      <span
        className="self-start text-xs font-semibold px-2 py-0.5 rounded-full"
        style={{ color, backgroundColor: `${color}18` }}
      >
        {item.jenis}
      </span>

      {/* Produk */}
      <p className="text-sm text-gray-300 line-clamp-2">{item.produk}</p>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        <span>💰 {item.harga}</span>
        <span>🕐 {item.jamBuka}</span>
      </div>

      {/* Status + WA */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t gap-2" style={{ borderColor: 'var(--border)' }}>
        <span
          className="flex items-center gap-1 text-xs"
          style={{ color: item.aktif ? 'var(--green)' : '#6b7280' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
          {item.aktif ? 'Aktif' : 'Tidak Aktif'}
        </span>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-black transition-opacity hover:opacity-85"
          style={{ background: 'var(--gradient)' }}
          aria-label={`Hubungi ${item.nama} via WhatsApp`}
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          WhatsApp
        </a>
      </div>
    </div>
  )
}
