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
  softFileUrl?: string
  softFileName?: string
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
          // Don't block login screen on slow fetch
          void refresh()
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setBooting(false)
        clearTimeout(failsafe)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [refresh])

  async function login(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError('')
    try {
      const { r, data } = await fetchJson('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      })
      if (r.ok && data?.ok) {
        setAuthed(true)
        setPin('')
        await refresh()
      } else {
        setError(data?.error === 'wrong_pin' ? 'PIN salah.' : 'Login gagal.')
      }
    } catch {
      setError('Jaringan bermasalah.')
    } finally {
      setSubmitting(false)
    }
  }

  async function logout() {
    await fetchJson('/api/admin/login', { method: 'DELETE' })
    setAuthed(false)
    setItems([])
  }

  async function setStatus(kode: string, status: PengajuanStatus) {
    if (busyKode) return
    setBusyKode(kode)
    try {
      await fetchJson('/api/pengajuan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', kode, status }),
      })
      await refresh()
    } finally {
      setBusyKode(null)
    }
  }

  const counts = STATUSES.reduce(
    (acc, s) => {
      acc[s.id] = items.filter((i) => i.status === s.id).length
      return acc
    },
    {} as Record<PengajuanStatus, number>,
  )

  if (booting) {
    return (
      <div className="p-8 text-center text-sm" style={{ color: 'var(--muted)' }}>
        Memuat…
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="max-w-sm mx-auto space-y-6">
        <div className="card-surface p-6 space-y-4">
          <p className="font-semibold text-center" style={{ color: 'var(--text)' }}>
            Login Admin
          </p>
          {pinFromEnv === false && (
            <p className="text-xs text-center rounded-lg px-3 py-2" style={{ background: 'var(--surface-soft)', color: '#e57373' }}>
              ADMIN_PIN belum diset di environment. Dashboard tidak dapat diakses.
            </p>
          )}
          <form onSubmit={(e) => void login(e)} className="space-y-3">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN admin"
              autoComplete="current-password"
              className="w-full rounded-xl px-3 py-3 text-sm border outline-none focus:border-[var(--gold)]"
              style={{ backgroundColor: 'var(--s2)', borderColor: 'var(--border)', color: 'var(--text)' }}
            />
            {error && (
              <p className="text-xs text-center" style={{ color: '#e57373' }}>
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting || !pin}
              className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]"
            >
              {submitting ? 'Masuk…' : 'Masuk'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-semibold" style={{ color: 'var(--text)' }}>
          Dashboard Admin · {items.length} pengajuan
        </p>
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
              {row.softFileUrl && (
                <p className="text-xs">
                  <a
                    href={row.softFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-2 hover:underline"
                    style={{ color: 'var(--gold)' }}
                  >
                    📎 {row.softFileName || 'Lihat soft file'} →
                  </a>
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <label className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted)' }}>
                  Status:
                  <select
                    className="rounded-lg px-2 py-1 text-xs border outline-none focus:border-[var(--gold)]"
                    style={{ backgroundColor: 'var(--s2)', borderColor: 'var(--border)', color: 'var(--text)' }}
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
