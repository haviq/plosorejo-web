'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import type { PengajuanStatus } from '@/lib/ops-store'

type Row = {
  kode: string
  layananNama: string
  nama: string
  nikMasked: string
  rt: string
  status: PengajuanStatus
  keperluan: string
  createdAt: string
  updatedAt: string
  adminNote?: string
  telepon?: string
}

const STATUSES: { id: PengajuanStatus; label: string }[] = [
  { id: 'diterima', label: 'Diterima' },
  { id: 'diproses', label: 'Diproses' },
  { id: 'menunggu_berkas', label: 'Menunggu berkas' },
  { id: 'siap_diambil', label: 'Siap diambil' },
  { id: 'selesai', label: 'Selesai' },
  { id: 'ditolak', label: 'Ditolak' },
]

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<Row[]>([])
  const [busyKode, setBusyKode] = useState<string | null>(null)
  const [hint, setHint] = useState('')

  const refresh = useCallback(async () => {
    const r = await fetch('/api/pengajuan?all=1', { credentials: 'include' })
    if (r.status === 401) {
      setAuthed(false)
      setItems([])
      return
    }
    const data = await r.json()
    if (data.ok) {
      setAuthed(true)
      setItems(data.items || [])
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        const s = await fetch('/api/admin/login', { credentials: 'include' })
        const j = await s.json()
        if (j.admin) {
          setAuthed(true)
          await refresh()
        }
        if (!j.pinFromEnv) {
          setHint('Demo PIN: plosorejo2026 — set ADMIN_PIN di Vercel untuk produksi.')
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false)
      }
    })()
  }, [refresh])

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const r = await fetch('/api/admin/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    })
    const j = await r.json()
    if (!j.ok) {
      setError(j.error === 'too_many_attempts' ? 'Terlalu banyak percobaan. Tunggu sebentar.' : 'PIN salah.')
      return
    }
    setAuthed(true)
    setPin('')
    await refresh()
  }

  async function logout() {
    await fetch('/api/admin/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    })
    setAuthed(false)
    setItems([])
  }

  async function setStatus(kode: string, status: PengajuanStatus) {
    setBusyKode(kode)
    try {
      const r = await fetch('/api/pengajuan', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', kode, status }),
      })
      if (r.ok) await refresh()
    } finally {
      setBusyKode(null)
    }
  }

  const inputStyle: React.CSSProperties = {
    backgroundColor: 'var(--s2)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  }

  if (loading) {
    return (
      <p className="text-sm" style={{ color: 'var(--muted)' }}>
        Memuat panel admin…
      </p>
    )
  }

  if (!authed) {
    return (
      <form onSubmit={login} className="card-surface p-6 max-w-md space-y-4">
        <div>
          <h2 className="font-bold text-lg" style={{ color: 'var(--text)' }}>
            Masuk Admin Padukuhan
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            Kelola status pengajuan surat. PIN diset di environment <code>ADMIN_PIN</code>.
          </p>
        </div>
        <div>
          <label htmlFor="admin-pin" className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>
            PIN admin
          </label>
          <input
            id="admin-pin"
            type="password"
            autoComplete="current-password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full rounded-xl px-3 py-3 text-sm border outline-none focus:border-[var(--gold)]"
            style={inputStyle}
            required
            minLength={4}
          />
        </div>
        {error && (
          <p className="text-sm" style={{ color: '#e57373' }}>
            {error}
          </p>
        )}
        {hint && (
          <p className="text-xs" style={{ color: 'var(--muted2)' }}>
            {hint}
          </p>
        )}
        <button type="submit" className="btn-primary w-full min-h-[48px]">
          Masuk
        </button>
        <p className="text-xs" style={{ color: 'var(--muted2)' }}>
          Konten berita/UMKM tetap lewat <Link href="/studio" className="underline" style={{ color: 'var(--gold)' }}>/studio</Link> (Sanity).
        </p>
      </form>
    )
  }

  const counts = STATUSES.reduce(
    (acc, s) => {
      acc[s.id] = items.filter((i) => i.status === s.id).length
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-bold text-xl" style={{ color: 'var(--text)' }}>
            Dashboard pengajuan
          </h2>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {items.length} berkas · update status agar warga bisa cek di /layanan/status
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => refresh()} className="btn-ghost text-sm">
            Refresh
          </button>
          <button type="button" onClick={logout} className="btn-ghost text-sm">
            Keluar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {STATUSES.map((s) => (
          <div key={s.id} className="card-surface p-3 text-center">
            <p className="text-lg font-bold tabular-nums" style={{ color: 'var(--gold)' }}>
              {counts[s.id] || 0}
            </p>
            <p className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Belum ada pengajuan. Warga submit lewat /layanan/ajukan.
          </p>
        ) : (
          items.map((row) => (
            <article key={row.kode} className="card-surface p-4 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-sm font-bold" style={{ color: 'var(--gold)' }}>
                    {row.kode}
                  </p>
                  <p className="font-semibold" style={{ color: 'var(--text)' }}>
                    {row.layananNama}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                    {row.nama} · NIK {row.nikMasked} · RT {row.rt}
                  </p>
                </div>
                <span className="badge" style={{ color: 'var(--gold)', background: 'var(--gold-glow)' }}>
                  {STATUSES.find((s) => s.id === row.status)?.label || row.status}
                </span>
              </div>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                {row.keperluan}
              </p>
              {row.adminNote && (
                <p className="text-xs" style={{ color: 'var(--muted2)' }}>
                  Catatan: {row.adminNote}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                <label className="text-xs" style={{ color: 'var(--muted)' }}>
                  Ubah status
                  <select
                    className="ml-2 rounded-lg px-2 py-1.5 text-xs border outline-none"
                    style={inputStyle}
                    value={row.status}
                    disabled={busyKode === row.kode}
                    onChange={(e) => setStatus(row.kode, e.target.value as PengajuanStatus)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </label>
                <Link
                  href={`/layanan/status?kode=${encodeURIComponent(row.kode)}`}
                  className="text-xs underline-offset-2 hover:underline"
                  style={{ color: 'var(--gold)' }}
                  target="_blank"
                >
                  Lihat publik →
                </Link>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="surface-panel p-4 text-sm space-y-2" style={{ color: 'var(--muted)' }}>
        <p className="font-semibold" style={{ color: 'var(--text)' }}>
          Modul admin lanjutan
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Agenda / darurat: edit file JSON atau Sanity — shortcut{' '}
            <Link href="/agenda" style={{ color: 'var(--gold)' }}>
              /agenda
            </Link>
            ,{' '}
            <Link href="/darurat" style={{ color: 'var(--gold)' }}>
              /darurat
            </Link>
          </li>
          <li>
            Konten berita & UMKM: <Link href="/studio" style={{ color: 'var(--gold)' }}>/studio</Link>
          </li>
          <li>
            Multi-desa demo:{' '}
            <Link href="/demo" style={{ color: 'var(--gold)' }}>
              /demo
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
