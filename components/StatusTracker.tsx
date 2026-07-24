'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Icon from '@/components/Icon'

type PublicItem = {
  kode: string
  layananNama: string
  nama: string
  nikMasked: string
  rt: string
  status: string
  statusLabel: string
  keperluan: string
  createdAt: string
  updatedAt: string
  adminNote?: string | null
}

const STATUS_COLOR: Record<string, string> = {
  diterima: 'var(--gold)',
  diproses: '#60a5fa',
  menunggu_berkas: '#fbbf24',
  siap_diambil: '#34d399',
  selesai: '#a3a3a3',
  ditolak: '#f87171',
}

export default function StatusTracker() {
  const sp = useSearchParams()
  const [kode, setKode] = useState(sp.get('kode') || '')
  const [item, setItem] = useState<PublicItem | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function lookup(code: string) {
    const c = code.trim().toUpperCase()
    if (!c) return
    setLoading(true)
    setError('')
    setItem(null)
    try {
      const r = await fetch(`/api/pengajuan?kode=${encodeURIComponent(c)}`)
      const j = await r.json()
      if (!j.ok) {
        setError(j.error === 'not_found' ? 'Kode tidak ditemukan. Cek lagi atau hubungi balai.' : 'Gagal memuat status.')
        return
      }
      setItem(j.item)
      // keep URL shareable
      if (typeof window !== 'undefined') {
        const u = new URL(window.location.href)
        u.searchParams.set('kode', c)
        window.history.replaceState({}, '', u.toString())
      }
    } catch {
      setError('Jaringan bermasalah. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const initial = sp.get('kode')
    if (initial) {
      setKode(initial)
      void lookup(initial)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    void lookup(kode)
  }

  const inputStyle: React.CSSProperties = {
    backgroundColor: 'var(--s2)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  }

  const color = item ? STATUS_COLOR[item.status] || 'var(--gold)' : 'var(--gold)'

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="card-surface p-5 flex flex-col sm:flex-row gap-3">
        <label className="flex-1">
          <span className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>
            Kode pengajuan (contoh PLJ-DEMO01)
          </span>
          <input
            type="text"
            value={kode}
            onChange={(e) => setKode(e.target.value.toUpperCase())}
            placeholder="PLJ-XXXXXX"
            className="w-full rounded-xl px-3 py-3 text-sm border font-mono outline-none focus:border-[var(--gold)]"
            style={inputStyle}
            required
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary sm:self-end min-h-[48px] disabled:opacity-50"
        >
          {loading ? 'Mencari…' : 'Cek status'}
        </button>
      </form>

      {error && (
        <p className="text-sm card-surface p-4" style={{ color: '#e57373' }}>
          {error}
        </p>
      )}

      {item && (
        <article className="card-surface p-6 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                Kode
              </p>
              <p className="font-mono text-xl font-bold" style={{ color: 'var(--gold)' }}>
                {item.kode}
              </p>
            </div>
            <span
              className="badge border text-sm px-3 py-1"
              style={{
                color,
                borderColor: color,
                background: `${color}22`,
              }}
            >
              {item.statusLabel}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p style={{ color: 'var(--muted)' }}>Layanan</p>
              <p className="font-semibold" style={{ color: 'var(--text)' }}>
                {item.layananNama}
              </p>
            </div>
            <div>
              <p style={{ color: 'var(--muted)' }}>Pemohon</p>
              <p className="font-semibold" style={{ color: 'var(--text)' }}>
                {item.nama} · RT {item.rt}
              </p>
              <p className="text-xs" style={{ color: 'var(--muted2)' }}>
                NIK {item.nikMasked}
              </p>
            </div>
          </div>

          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {item.keperluan}
          </p>

          {item.adminNote && (
            <div
              className="rounded-xl p-3 text-sm"
              style={{ background: 'var(--surface-soft)', border: '1px solid var(--border)' }}
            >
              <p className="text-xs uppercase font-bold mb-1" style={{ color: 'var(--gold)' }}>
                Catatan petugas
              </p>
              <p style={{ color: 'var(--text)' }}>{item.adminNote}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-4 text-xs" style={{ color: 'var(--muted2)' }}>
            <span className="inline-flex items-center gap-1">
              <Icon name="clock" size={14} />
              Diajukan:{' '}
              {new Date(item.createdAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
            </span>
            <span>
              Update:{' '}
              {new Date(item.updatedAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
            </span>
          </div>

          {item.status === 'siap_diambil' && (
            <p className="text-sm font-semibold" style={{ color: '#34d399' }}>
              Silakan ambil di balai pada jam layanan. Bawa KTP & fotokopi syarat.
            </p>
          )}
        </article>
      )}

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/layanan/ajukan" className="btn-primary">
          Ajukan surat baru
        </Link>
        <Link href="/layanan" className="btn-ghost">
          Daftar layanan
        </Link>
      </div>

      <p className="text-xs" style={{ color: 'var(--muted2)' }}>
        Coba demo: <button type="button" className="underline" style={{ color: 'var(--gold)' }} onClick={() => { setKode('PLJ-DEMO01'); void lookup('PLJ-DEMO01') }}>PLJ-DEMO01</button>
        {' · '}
        <button type="button" className="underline" style={{ color: 'var(--gold)' }} onClick={() => { setKode('PLJ-DEMO02'); void lookup('PLJ-DEMO02') }}>PLJ-DEMO02</button>
      </p>
    </div>
  )
}
