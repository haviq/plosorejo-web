'use client'

import { useCallback, useEffect, useState, type ComponentType } from 'react'

type MapComponent = ComponentType

const LOAD_TIMEOUT_MS = 15000

export default function MapLoader() {
  const [Map, setMap] = useState<MapComponent | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [attempt, setAttempt] = useState(0)

  const retry = useCallback(() => {
    setAttempt((n) => n + 1)
  }, [])

  useEffect(() => {
    let cancelled = false
    let timeoutId = 0

    setLoading(true)
    setError(null)
    setMap(null)

    timeoutId = window.setTimeout(() => {
      if (!cancelled) {
        setError('Peta terlalu lama dimuat. Periksa koneksi lalu coba lagi.')
        setLoading(false)
      }
    }, LOAD_TIMEOUT_MS)

    import('./LeafletMap')
      .then((mod) => {
        if (cancelled) return
        window.clearTimeout(timeoutId)
        setMap(() => mod.default)
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        window.clearTimeout(timeoutId)
        const msg = err instanceof Error ? err.message : 'Gagal memuat modul peta'
        setError(msg)
        setLoading(false)
      })

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [attempt])

  if (error) {
    return (
      <div
        className="w-full rounded-xl flex flex-col items-center justify-center gap-3 text-sm px-4 text-center"
        style={{
          height: 480,
          backgroundColor: 'var(--s2)',
          border: '1px solid var(--border)',
          color: 'var(--muted)',
        }}
        role="alert"
      >
        <p style={{ color: 'var(--text)', fontWeight: 600 }}>Peta gagal dimuat</p>
        <p className="text-xs max-w-sm">{error}</p>
        <button
          type="button"
          onClick={retry}
          className="px-4 py-2 rounded-lg text-xs font-bold"
          style={{
            backgroundColor: 'var(--gold)',
            color: '#111',
            minHeight: 44,
            minWidth: 120,
          }}
        >
          Coba lagi
        </button>
      </div>
    )
  }

  if (loading || !Map) {
    return (
      <div
        className="w-full rounded-xl flex flex-col items-center justify-center gap-2 text-[var(--muted)] text-sm"
        style={{ height: 480, backgroundColor: 'var(--s2)', border: '1px solid var(--border)' }}
        aria-busy="true"
        aria-live="polite"
      >
        <span>Memuat peta…</span>
        <span className="text-[11px] opacity-70">Mengambil peta interaktif & data wilayah</span>
      </div>
    )
  }

  return <Map />
}
