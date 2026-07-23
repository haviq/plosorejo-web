'use client'

import { useState } from 'react'
import { waLink } from '@/lib/site'

interface KontakFormProps {
  whatsapp?: string
}

export default function KontakForm({ whatsapp = '6281234567890' }: KontakFormProps) {
  const [nama, setNama] = useState('')
  const [pesan, setPesan] = useState('')
  const [kategori, setKategori] = useState('Informasi Umum')

  const isValid = nama.trim().length >= 2 && pesan.trim().length >= 5

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return

    const text = [
      `*Pesan dari Website Plosorejo*`,
      ``,
      `Nama: ${nama.trim()}`,
      `Kategori: ${kategori}`,
      ``,
      `Pesan:`,
      pesan.trim(),
    ].join('\n')

    const url = waLink(whatsapp, text)
    if (url === '#') return
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const inputStyle: React.CSSProperties = {
    backgroundColor: 'var(--s2)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3" aria-label="Form pesan ke padukuhan">
      <div>
        <label htmlFor="nama-pengirim" className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>
          Nama <span style={{ color: 'var(--gold)' }}>*</span>
        </label>
        <input
          id="nama-pengirim"
          type="text"
          required
          minLength={2}
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Nama Anda"
          className="w-full rounded-lg px-3 py-2 text-sm border outline-none transition-colors focus:border-[var(--gold)]"
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="kategori-pesan" className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>
          Kategori
        </label>
        <select
          id="kategori-pesan"
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="w-full rounded-lg px-3 py-2 text-sm border outline-none transition-colors focus:border-[var(--gold)]"
          style={inputStyle}
        >
          {['Informasi Umum', 'Pengaduan', 'Administrasi', 'UMKM', 'KKN', 'Lainnya'].map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="pesan" className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>
          Pesan <span style={{ color: 'var(--gold)' }}>*</span>
        </label>
        <textarea
          id="pesan"
          required
          minLength={5}
          rows={4}
          value={pesan}
          onChange={(e) => setPesan(e.target.value)}
          placeholder="Tulis pesan Anda..."
          className="w-full rounded-lg px-3 py-2 text-sm border outline-none transition-colors focus:border-[var(--gold)] resize-none"
          style={inputStyle}
        />
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Kirim via WhatsApp →
      </button>

      <p className="text-xs text-center" style={{ color: 'var(--muted2)' }}>
        Pesan akan dibuka di WhatsApp Anda — tinggal tekan kirim.
      </p>
    </form>
  )
}
