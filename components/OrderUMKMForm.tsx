'use client'

import { useMemo, useState } from 'react'
import type { UMKMItem } from '@/lib/types'
import { waLink } from '@/lib/site'
import Icon from '@/components/Icon'

interface OrderUMKMFormProps {
  item: UMKMItem
  onClose?: () => void
}

export default function OrderUMKMForm({ item, onClose }: OrderUMKMFormProps) {
  const [nama, setNama] = useState('')
  const [telepon, setTelepon] = useState('')
  const [produk, setProduk] = useState(item.produk.split(',')[0]?.trim() || item.produk)
  const [jumlah, setJumlah] = useState('1')
  const [catatan, setCatatan] = useState('')
  const [antar, setAntar] = useState(false)

  const isValid = nama.trim().length >= 2 && produk.trim().length >= 2 && Number(jumlah) > 0
  const waReady = waLink(item.whatsapp, 'x') !== '#'

  const produkOptions = useMemo(() => {
    const parts = item.produk
      .split(/[,;/|]/)
      .map((s) => s.trim())
      .filter(Boolean)
    return parts.length > 1 ? parts : [item.produk]
  }, [item.produk])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid || !waReady) return

    const text = [
      `*Pesanan UMKM — Portal Plosorejo*`,
      ``,
      `Usaha: ${item.nama}`,
      `Pemilik: ${item.pemilik}`,
      ``,
      `Pemesan: ${nama.trim()}`,
      telepon.trim() ? `HP: ${telepon.trim()}` : null,
      ``,
      `Produk: ${produk.trim()}`,
      `Jumlah: ${jumlah}`,
      `Estimasi harga: ${item.harga}`,
      `Mode: ${antar ? 'Antar / diantar (jika tersedia)' : 'Ambil di tempat'}`,
      catatan.trim() ? `\nCatatan:\n${catatan.trim()}` : null,
      ``,
      `_Mohon konfirmasi ketersediaan & total bayar_`,
    ]
      .filter((line) => line !== null)
      .join('\n')

    const url = waLink(item.whatsapp, text)
    if (url === '#') return
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const inputStyle: React.CSSProperties = {
    backgroundColor: 'var(--s2)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3"
      aria-label={`Form pesan ${item.nama}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--gold)' }}>
            Pesan via WhatsApp
          </p>
          <h3 className="font-bold" style={{ color: 'var(--text)' }}>
            {item.nama}
          </h3>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-sm px-2 py-1 rounded-lg border"
            style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
            aria-label="Tutup form"
          >
            Tutup
          </button>
        )}
      </div>

      <div>
        <label className="block text-xs mb-1" style={{ color: 'var(--muted)' }} htmlFor={`ord-nama-${item.id}`}>
          Nama pemesan <span style={{ color: 'var(--gold)' }}>*</span>
        </label>
        <input
          id={`ord-nama-${item.id}`}
          type="text"
          required
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="w-full rounded-lg px-3 py-2 text-sm border outline-none focus:border-[var(--gold)]"
          style={inputStyle}
        />
      </div>

      <div>
        <label className="block text-xs mb-1" style={{ color: 'var(--muted)' }} htmlFor={`ord-tel-${item.id}`}>
          No. HP
        </label>
        <input
          id={`ord-tel-${item.id}`}
          type="tel"
          value={telepon}
          onChange={(e) => setTelepon(e.target.value)}
          className="w-full rounded-lg px-3 py-2 text-sm border outline-none focus:border-[var(--gold)]"
          style={inputStyle}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs mb-1" style={{ color: 'var(--muted)' }} htmlFor={`ord-prod-${item.id}`}>
            Produk
          </label>
          {produkOptions.length > 1 ? (
            <select
              id={`ord-prod-${item.id}`}
              value={produk}
              onChange={(e) => setProduk(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm border outline-none focus:border-[var(--gold)]"
              style={inputStyle}
            >
              {produkOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={`ord-prod-${item.id}`}
              type="text"
              value={produk}
              onChange={(e) => setProduk(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm border outline-none focus:border-[var(--gold)]"
              style={inputStyle}
            />
          )}
        </div>
        <div>
          <label className="block text-xs mb-1" style={{ color: 'var(--muted)' }} htmlFor={`ord-qty-${item.id}`}>
            Jumlah
          </label>
          <input
            id={`ord-qty-${item.id}`}
            type="number"
            min={1}
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
            className="w-full rounded-lg px-3 py-2 text-sm border outline-none focus:border-[var(--gold)]"
            style={inputStyle}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--muted)' }}>
        <input
          type="checkbox"
          checked={antar}
          onChange={(e) => setAntar(e.target.checked)}
          className="accent-[var(--gold)]"
        />
        Minta diantar (jika tersedia)
      </label>

      <div>
        <label className="block text-xs mb-1" style={{ color: 'var(--muted)' }} htmlFor={`ord-cat-${item.id}`}>
          Catatan
        </label>
        <textarea
          id={`ord-cat-${item.id}`}
          rows={2}
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          placeholder="Varian, waktu ambil, alamat antar…"
          className="w-full rounded-lg px-3 py-2 text-sm border outline-none focus:border-[var(--gold)] resize-none"
          style={inputStyle}
        />
      </div>

      <p className="text-xs inline-flex items-center gap-1" style={{ color: 'var(--muted)' }}>
        <Icon name="money" size={14} />
        Estimasi: {item.harga}
      </p>

      <button
        type="submit"
        disabled={!isValid || !waReady}
        className="btn-primary w-full text-sm disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]"
      >
        {waReady ? 'Kirim pesanan WA →' : 'WA toko belum diisi'}
      </button>
    </form>
  )
}
