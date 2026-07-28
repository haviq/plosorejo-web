'use client'

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import type { LayananItem } from '@/lib/types'
import { waLink } from '@/lib/site'
import Icon from '@/components/Icon'

interface PengajuanSuratFormProps {
  layanan: LayananItem[]
  whatsapp?: string
  defaultLayananId?: string
}

export default function PengajuanSuratForm({
  layanan,
  whatsapp,
  defaultLayananId,
}: PengajuanSuratFormProps) {
  const firstId =
    defaultLayananId && layanan.some((l) => l.id === defaultLayananId)
      ? defaultLayananId
      : layanan[0]?.id || ''

  const [layananId, setLayananId] = useState(firstId)
  const [nama, setNama] = useState('')
  const [nik, setNik] = useState('')
  const [rt, setRt] = useState('01')
  const [telepon, setTelepon] = useState('')
  const [keperluan, setKeperluan] = useState('')
  const [catatan, setCatatan] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resultKode, setResultKode] = useState<string | null>(null)
  const [formError, setFormError] = useState('')

  // Soft file state
  const [softFile, setSoftFile] = useState<File | null>(null)
  const [uploadingFile, setUploadingFile] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selected = useMemo(
    () => layanan.find((l) => l.id === layananId) || layanan[0],
    [layanan, layananId],
  )

  const nikOk = /^\d{16}$/.test(nik.trim())
  const isValid =
    nama.trim().length >= 3 &&
    nikOk &&
    keperluan.trim().length >= 5 &&
    (layanan.length === 0 || Boolean(selected))

  const waReady = waLink(whatsapp || '', 'x') !== '#'

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setSoftFile(file)
    setFormError('')
  }

  function handleFileRemove() {
    setSoftFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setFormError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid || !selected || submitting) return
    setSubmitting(true)
    setFormError('')
    setResultKode(null)

    let softFileUrl: string | undefined
    let softFileName: string | undefined

    try {
      // Upload soft file first if one is selected
      if (softFile) {
        setUploadingFile(true)
        try {
          const fd = new FormData()
          fd.append('file', softFile)
          const uploadRes = await fetch('/api/upload-file', {
            method: 'POST',
            body: fd,
          })
          const uploadData = await uploadRes.json()
          if (!uploadRes.ok || !uploadData.ok) {
            setFormError(
              uploadData.error === 'rate_limited'
                ? 'Terlalu banyak upload. Coba lagi beberapa menit.'
                : uploadData.error === 'file_too_large'
                  ? 'File terlalu besar (maks 5 MB).'
                  : uploadData.error === 'invalid_file_type'
                    ? 'Tipe file tidak didukung. Gunakan PDF, JPG, atau PNG.'
                    : uploadData.error === 'upload_not_configured'
                      ? 'Fitur upload belum dikonfigurasi.'
                      : 'Gagal mengupload file. Coba lagi.',
            )
            return
          }
          softFileUrl = uploadData.url as string
          softFileName = softFile.name
        } finally {
          setUploadingFile(false)
        }
      }

      const res = await fetch('/api/pengajuan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          layananId: selected.id,
          layananNama: selected.nama,
          nama: nama.trim(),
          nik: nik.trim(),
          rt,
          telepon: telepon.trim() || undefined,
          keperluan: keperluan.trim(),
          catatan: catatan.trim() || undefined,
          softFileUrl,
          softFileName,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setFormError('Gagal menyimpan pengajuan. Coba lagi.')
        return
      }

      const kode = data.item?.kode as string
      setResultKode(kode)

      if (waReady) {
        const text = [
          `*Pengajuan Layanan Padukuhan Plosorejo*`,
          `Kode: ${kode}`,
          `Cek status: https://plosorejo-web.vercel.app/layanan/status?kode=${kode}`,
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
          softFileUrl ? `Soft file: ${softFileUrl}` : null,
          ``,
          `_Dikirim dari portal plosorejo-web_`,
        ]
          .filter((line) => line !== null)
          .join('\n')

        const url = waLink(whatsapp || '', text)
        if (url !== '#') window.open(url, '_blank', 'noopener,noreferrer')
      }
    } catch {
      setFormError('Jaringan bermasalah. Coba lagi.')
    } finally {
      setSubmitting(false)
      setUploadingFile(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    backgroundColor: 'var(--s2)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  }

  if (resultKode) {
    return (
      <div className="card-surface p-6 space-y-4 text-center">
        <p className="text-xs uppercase tracking-wider font-bold" style={{ color: 'var(--gold)' }}>
          Pengajuan tercatat
        </p>
        <p className="font-mono text-2xl font-black" style={{ color: 'var(--gold)' }}>
          {resultKode}
        </p>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Simpan kode ini untuk melacak status pengajuan Anda.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href={`/layanan/status?kode=${encodeURIComponent(resultKode)}`}
            className="btn-primary"
          >
            Cek status →
          </Link>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              setResultKode(null)
              setNama('')
              setNik('')
              setRt('01')
              setTelepon('')
              setKeperluan('')
              setCatatan('')
              setSoftFile(null)
              if (fileInputRef.current) fileInputRef.current.value = ''
            }}
          >
            Ajukan lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5" noValidate>
      <div className="card-surface p-4 space-y-1">
        <div className="flex items-start gap-3">
          <Icon name="info" size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--gold)' }} />
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
              Pengajuan surat layanan
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              Isi form di bawah. Admin padukuhan akan memproses dan menghubungi Anda (jika nomor tersedia).
            </p>
          </div>
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
          className="rounded-xl px-4 py-3 text-xs space-y-1"
          style={{ background: 'var(--surface-soft)', color: 'var(--muted)' }}
        >
          <p>
            <span className="font-semibold" style={{ color: 'var(--text)' }}>
              {selected.nama}
            </span>{' '}
            · {selected.kategori}
          </p>
          <p>Estimasi: {selected.waktu} · Biaya: {selected.biaya}</p>
          {selected.syarat && selected.syarat.length > 0 && (
            <p>Syarat: {selected.syarat.join(', ')}</p>
          )}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nama" className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>
            Nama lengkap <span style={{ color: 'var(--gold)' }}>*</span>
          </label>
          <input
            id="nama"
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Sesuai KTP"
            maxLength={80}
            autoComplete="name"
            className="w-full rounded-xl px-3 py-3 text-sm border outline-none focus:border-[var(--gold)]"
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="nik" className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>
            NIK <span style={{ color: 'var(--gold)' }}>*</span>
          </label>
          <input
            id="nik"
            type="text"
            inputMode="numeric"
            value={nik}
            onChange={(e) => setNik(e.target.value.replace(/\D/g, '').slice(0, 16))}
            placeholder="16 digit"
            maxLength={16}
            autoComplete="off"
            className="w-full rounded-xl px-3 py-3 text-sm border outline-none focus:border-[var(--gold)]"
            style={{
              ...inputStyle,
              borderColor: nik && !nikOk ? '#e57373' : inputStyle.borderColor,
            }}
          />
          {nik && !nikOk && (
            <p className="text-xs mt-1" style={{ color: '#e57373' }}>
              NIK harus 16 digit angka
            </p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="rt" className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>
            RT
          </label>
          <select
            id="rt"
            value={rt}
            onChange={(e) => setRt(e.target.value)}
            className="w-full rounded-xl px-3 py-3 text-sm border outline-none focus:border-[var(--gold)]"
            style={inputStyle}
          >
            {['01', '02', '03', '04', '05', '06'].map((r) => (
              <option key={r} value={r}>
                RT {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="telepon" className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>
            No. HP / WhatsApp
          </label>
          <input
            id="telepon"
            type="tel"
            value={telepon}
            onChange={(e) => setTelepon(e.target.value)}
            placeholder="Opsional"
            maxLength={20}
            autoComplete="tel"
            className="w-full rounded-xl px-3 py-3 text-sm border outline-none focus:border-[var(--gold)]"
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label htmlFor="keperluan" className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>
          Keperluan / keterangan <span style={{ color: 'var(--gold)' }}>*</span>
        </label>
        <textarea
          id="keperluan"
          value={keperluan}
          onChange={(e) => setKeperluan(e.target.value)}
          placeholder="Jelaskan keperluan Anda…"
          rows={3}
          maxLength={500}
          className="w-full rounded-xl px-3 py-3 text-sm border outline-none focus:border-[var(--gold)] resize-none"
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="catatan" className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>
          Catatan tambahan
        </label>
        <textarea
          id="catatan"
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          placeholder="Opsional — info tambahan untuk admin…"
          rows={2}
          maxLength={400}
          className="w-full rounded-xl px-3 py-3 text-sm border outline-none focus:border-[var(--gold)] resize-none"
          style={inputStyle}
        />
      </div>

      {/* Soft file upload */}
      <div>
        <label className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>
          Soft file pendukung (opsional)
        </label>
        <p className="text-xs mb-2" style={{ color: 'var(--muted2)' }}>
          KTP, KK, atau dokumen lain · PDF/JPG/PNG maks 5 MB
        </p>

        {softFile ? (
          <div
            className="flex items-center justify-between rounded-xl px-3 py-2.5 border text-sm"
            style={inputStyle}
          >
            <span className="truncate max-w-[calc(100%-2rem)]" style={{ color: 'var(--text)' }}>
              📎 {softFile.name}
            </span>
            <button
              type="button"
              aria-label="Hapus file"
              onClick={handleFileRemove}
              className="ml-2 shrink-0 text-lg leading-none hover:opacity-70 transition-opacity"
              style={{ color: 'var(--muted)' }}
            >
              ×
            </button>
          </div>
        ) : (
          <label
            htmlFor="soft-file"
            className="flex items-center gap-2 w-full rounded-xl px-3 py-3 text-sm border outline-none cursor-pointer hover:border-[var(--gold)] transition-colors"
            style={inputStyle}
          >
            <span style={{ color: 'var(--muted)' }}>Pilih file…</span>
            <input
              id="soft-file"
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
        )}
      </div>

      {formError && (
        <p className="text-sm text-center" style={{ color: '#e57373' }}>
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={!isValid || submitting}
        className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation min-h-[48px]"
      >
        {uploadingFile
          ? 'Mengupload file…'
          : submitting
            ? 'Menyimpan…'
            : waReady
              ? 'Simpan & kirim via WhatsApp →'
              : 'Simpan pengajuan (WA admin belum diisi)'}
      </button>
      <p className="text-xs text-center" style={{ color: 'var(--muted2)' }}>
        Setelah submit Anda dapat kode pelacakan. NIK tidak ditampilkan penuh di status publik.
      </p>
    </form>
  )
}
