'use client'

import { useMemo, useState } from 'react'
import type { LayananItem } from '@/lib/types'
import { waLink } from '@/lib/site'
import Icon from '@/components/Icon'

interface PengajuanSuratFormProps {
  layanan: LayananItem[]
  whatsapp?: string
  /** Pre-select layanan by id from query ?layanan= */
  defaultLayananId?: string
}

export default function PengajuanSuratForm({
  layanan,
  whatsapp,
  defaultLayananId,
}: PengajuanSuratFormProps) {
  const firstId = defaultLayananId && layanan.some((l) => l.id === defaultLayananId)
    ? defaultLayananId
    : layanan[0]?.id || ''

  const [layananId, setLayananId] = useState(firstId)
  const [nama, setNama] = useState('')
  const [nik, setNik] = useState('')
  const [rt, setRt] = useState('01')
  const [telepon, setTelepon] = useState('')
  const [keperluan, setKeperluan] = useState('')
  const [catatan, setCatatan] = useState('')

  const selected = useMemo(
    () => layanan.find((l) => l.id === layananId) || layanan[0],
    [layanan, layananId],
  )

  const nikOk = /^\d{16}$/.test(nik.trim())
  const isValid =
    nama.trim().length >= 3 &&
    nikOk &&
    keperluan.trim().length >= 5 &&
    Boolean(selected)

  const waReady = waLink(whatsapp || '', 'x') !== '#'

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid || !waReady || !selected) return

    const kode = `PLJ-${Date.now().toString(36).toUpperCase().slice(-6)}`
    const text = [
      `*Pengajuan Layanan Padukuhan Plosorejo*`,
      `Kode: ${kode}`,
      ``,
      `Layanan: ${selected.nama}`,
      `Kategori: ${selected.kategori}`,
      `Estimasi: ${selected.waktu}`,
      `Biaya: ${selected.biaya}`,
      ``,
      `Nama: ${nama.trim()}`,
      `NIK: ${nik.trim()}`,
      `RT: ${rt}`,
      telepon.trim() ? `No. HP: ${telepon.trim()}` : null,
      ``,
      `Keperluan:`,
      keperluan.trim(),
      catatan.trim() ? `\nCatatan:\n${catatan.trim()}` : null,
      ``,
      `_Dikirim dari portal plosorejo-web_`,
    ]
      .filter((line) => line !== null)
      .join('\n')

    const url = waLink(whatsapp || '', text)
    if (url === '#') return
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const inputStyle: React.CSSProperties = {
    backgroundColor: 'var(--s2)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" aria-label="Form pengajuan surat online">
      <div className="card-surface p-4 md:p-5 space-y-4">
        <div className="flex items-start gap-3">
          <span
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--gold-glow)', color: 'var(--gold)' }}
          >
            <Icon name="document" size={18} />
          </span>
          <div>
            <h2 className="font-bold" style={{ color: 'var(--text)' }}>
              Form pengajuan online
            </h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
              Isi data → kirim via WhatsApp ke petugas. Surat tetap diambil/diambil sesuai alur balai.
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="layanan-jenis" className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>
            Jenis layanan <span style={{ color: 'var(--gold)' }}>*</span>
          </label>
          <select
            id="layanan-jenis"
            value={layananId}
            onChange={(e) => setLayananId(e.target.value)}
            className="w-full rounded-xl px-3 py-3 text-sm border outline-none focus:border-[var(--gold)]"
            style={inputStyle}
          >
            {layanan.map((l) => (
              <option key={l.id} value={l.id}>
                {l.nama} · {l.waktu}
              </option>
            ))}
          </select>
        </div>

        {selected && (
          <div
            className="rounded-xl p-3 text-sm space-y-1"
            style={{ background: 'var(--surface-soft)', border: '1px solid var(--border)' }}
          >
            <p style={{ color: 'var(--muted)' }}>{selected.deskripsi}</p>
            <p className="text-xs" style={{ color: 'var(--gold)' }}>
              PIC: {selected.pic} · Biaya: {selected.biaya}
            </p>
            {selected.syarat?.length > 0 && (
              <ul className="text-xs mt-2 space-y-0.5" style={{ color: 'var(--muted)' }}>
                {selected.syarat.slice(0, 4).map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="card-surface p-4 md:p-5 grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label htmlFor="pg-nama" className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>
            Nama lengkap <span style={{ color: 'var(--gold)' }}>*</span>
          </label>
          <input
            id="pg-nama"
            type="text"
            required
            minLength={3}
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Sesuai KTP"
            className="w-full rounded-xl px-3 py-3 text-sm border outline-none focus:border-[var(--gold)]"
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="pg-nik" className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>
            NIK (16 digit) <span style={{ color: 'var(--gold)' }}>*</span>
          </label>
          <input
            id="pg-nik"
            type="text"
            inputMode="numeric"
            pattern="\d{16}"
            maxLength={16}
            required
            value={nik}
            onChange={(e) => setNik(e.target.value.replace(/\D/g, '').slice(0, 16))}
            placeholder="3201xxxxxxxxxxxx"
            className="w-full rounded-xl px-3 py-3 text-sm border outline-none focus:border-[var(--gold)]"
            style={inputStyle}
            aria-invalid={nik.length > 0 && !nikOk}
          />
          {nik.length > 0 && !nikOk && (
            <p className="text-xs mt-1" style={{ color: '#e57373' }}>
              NIK harus 16 digit angka
            </p>
          )}
        </div>

        <div>
          <label htmlFor="pg-rt" className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>
            RT
          </label>
          <select
            id="pg-rt"
            value={rt}
            onChange={(e) => setRt(e.target.value)}
            className="w-full rounded-xl px-3 py-3 text-sm border outline-none focus:border-[var(--gold)]"
            style={inputStyle}
          >
            {['01', '02', '03', '04'].map((r) => (
              <option key={r} value={r}>
                RT {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="pg-tel" className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>
            No. HP / WhatsApp
          </label>
          <input
            id="pg-tel"
            type="tel"
            value={telepon}
            onChange={(e) => setTelepon(e.target.value)}
            placeholder="08xxxxxxxxxx"
            className="w-full rounded-xl px-3 py-3 text-sm border outline-none focus:border-[var(--gold)]"
            style={inputStyle}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="pg-kep" className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>
            Keperluan surat <span style={{ color: 'var(--gold)' }}>*</span>
          </label>
          <textarea
            id="pg-kep"
            required
            minLength={5}
            rows={3}
            value={keperluan}
            onChange={(e) => setKeperluan(e.target.value)}
            placeholder="Contoh: untuk melamar kerja / daftar sekolah / buka rekening"
            className="w-full rounded-xl px-3 py-3 text-sm border outline-none focus:border-[var(--gold)] resize-none"
            style={inputStyle}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="pg-cat" className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>
            Catatan tambahan
          </label>
          <textarea
            id="pg-cat"
            rows={2}
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Opsional"
            className="w-full rounded-xl px-3 py-3 text-sm border outline-none focus:border-[var(--gold)] resize-none"
            style={inputStyle}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!isValid || !waReady}
        className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation min-h-[48px]"
      >
        {waReady ? 'Kirim pengajuan via WhatsApp →' : 'Nomor WA admin belum diisi'}
      </button>
      <p className="text-xs text-center" style={{ color: 'var(--muted2)' }}>
        Data dikirim ke WhatsApp petugas — bukan disimpan di server. Siapkan fotokopi syarat saat ambil surat.
      </p>
    </form>
  )
}
