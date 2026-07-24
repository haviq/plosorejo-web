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

async function fetchJson(url: string, init?: RequestInit, ms = 8000) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), ms)
  try {
    const r = await fetch(url, { ...init, signal: ctrl.signal, credentials: 'include' })
    const data = await r.json().catch(() => ({}))
    return { r, data }
  } finally {
    clearTimeout(t)
  }
}

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  // Start false so SSR + slow JS never leave user stuck on "Memuat…"
  const [booting, setBooting] = useState(true)
  const [items, setItems] = useState<Row[]>([])
  const [busyKode, setBusyKode] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [pinFromEnv, setPinFromEnv] = useState<boolean | null>(null)

  const refresh = useCallback(async () => {
    try {
      const { r, data } = await fetchJson('/api/pengajuan?all=1')
      if (r.status === 401) {
        setAuthed(false)
        setItems([])
        return false
      }
      if (data?.ok) {
        setAuthed(true)
        setItems(Array.isArray(data.items) ? data.items : [])
        return true
      }
      return false
    } catch {
      return false
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const failsafe = setTimeout(() => {
      if (!cancelled) setBooting(false)
    }, 2500)

    ;(async () => {
      try {
        const { data } = await fetchJson('/api/admin/login')
        if (cancelled) return
        if (typeof data?.pinFromEnv === 'boolean') setPinFromEnv(data.pinFromEnv)
        if (data?.admin) {
          setAuthed(true)
          // Don't block login form forever if list API is slow
          void refresh()
        }
      } catch {
        /* show login form anyway */
      } finally {
        if (!cancelled) setBooting(false)
      }
    })()

    return () => {
      cancelled = true
      clearTimeout(failsafe)
    }
  }, [refresh])

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const { r, data } = await fetchJson('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      })
      if (!r.ok || !data?.ok) {
        setError(
          data?.error === 'too_many_attempts'
            ? 'Terlalu banyak percobaan. Tunggu sebentar.'
            : 'Kode akses salah.',
        )
        return
      }
      setAuthed(true)
      setPin('')
      await refresh()
    } catch {
      setError('Jaringan bermasalah. Coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  async function logout() {
    try {
      await fetchJson('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      })
    } catch {
      /* ignore */
    }
    setAuthed(false)
    setItems([])
  }

  async function setStatus(kode: string, status: PengajuanStatus) {
    setBusyKode(kode)
    try {
      const { r } = await fetchJson('/api/pengajuan', {
        method: 'POST',
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

  // Brief boot spinner only — never permanent
  if (booting && !authed) {
    return (
      <div className="card-surface p-6 max-w-md mx-auto space-y-3 text-center">
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Memuat…
        </p>
        <button
          type="button"
          className="btn-ghost text-xs"
          onClick={() => setBooting(false)}
        >
          Lewati
        </button>
      </div>
    )
  }

  if (!authed) {
    return (
      <form onSubmit={login} className="card-surface p-6 max-w-md space-y-4 mx-auto">
        <div>
          <h2 className="font-bold text-lg" style={{ color: 'var(--text)' }}>
            Akses internal
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            Halaman ini tidak dipublikasikan. Masukkan kode akses.
          </p>
        </div>
        <div>
          <label htmlFor="admin-pin" className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>
            Kode akses
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
            autoFocus
          />
        </div>
        {error && (
          <p className="text-sm" style={{ color: '#e57373' }}>
            {error}
          </p>
        )}
        {pinFromEnv === false && (
          <p className="text-xs rounded-lg p-2" style={{ background: 'var(--surface-soft)', color: 'var(--muted)' }}>
            Env <code>ADMIN_PIN</code> belum terbaca di server. Di Vercel: Settings → Environment
            Variables → Production → simpan → <strong>Redeploy</strong>.
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full min-h-[48px] disabled:opacity-50"
        >
          {submitting ? 'Memeriksa…' : 'Masuk'}
        </button>
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
            Antrian pengajuan
          </h2>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {items.length} data · sesi 12 jam
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn-ghost text-sm" onClick={() => void refresh()}>
            Refresh
          </button>
          <button type="button" className="btn-ghost text-sm" onClick={() => void logout()}>
            Keluar
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <span
            key={s.id}
            className="text-xs rounded-full px-2.5 py-1 tabular-nums"
            style={{ background: 'var(--surface-soft)', color: 'var(--muted)' }}
          >
            {s.label}: <strong style={{ color: 'var(--gold)' }}>{counts[s.id] || 0}</strong>
          </span>
        ))}
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm card-surface p-4" style={{ color: 'var(--muted)' }}>
            Belum ada pengajuan di memori server (cold start mengosongkan demo store). Ajukan via
            /layanan/ajukan lalu refresh.
          </p>
        ) : (
          items.map((row) => (
            <article key={row.kode} className="card-surface p-4 space-y-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-mono font-bold" style={{ color: 'var(--gold)' }}>
                    {row.kode}
                  </p>
                  <p className="font-semibold" style={{ color: 'var(--text)' }}>
                    {row.nama} · RT {row.rt}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    {row.layananNama}
                  </p>
                </div>
                <span className="text-xs badge" style={{ color: 'var(--gold)' }}>
                  {STATUSES.find((s) => s.id === row.status)?.label || row.status}
                </span>
              </div>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                {row.keperluan}
              </p>
              <p className="text-xs" style={{ color: 'var(--muted2)' }}>
                NIK {row.nikMasked}
                {row.telepon ? ` · ${row.telepon}` : ''} ·{' '}
                {new Date(row.updatedAt).toLocaleString('id-ID')}
              </p>
              {row.adminNote && (
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  Catatan: {row.adminNote}
                </p>
              )}
              <div className="flex flex-wrap gap-2 items-center">
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
    </div>
  )
}
