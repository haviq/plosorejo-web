'use client'

import {
  Component,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ErrorInfo,
  type ReactNode,
} from 'react'

type MapComponent = ComponentType

/** Fail fast to OSM embed — better than a stuck spinner on slow mobile. */
const LOAD_TIMEOUT_MS = 4500

/** Warm the chunk as soon as this module evaluates (peta page only). */
const mapChunkPromise: Promise<{ default: MapComponent }> | null =
  typeof window !== 'undefined'
    ? import('./LeafletMap').catch((err) => {
        // Keep rejection for callers; do not throw at module scope
        return Promise.reject(err)
      })
    : null

/** OpenStreetMap embed — always works even if Leaflet chunk fails on mobile */
function StaticMapFallback({ reason }: { reason?: string }) {
  const bbox = '110.4315,-7.6285,110.4445,-7.6165'
  const marker = '-7.62428,110.43829' // Masjid Asy Syams
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`

  return (
    <div className="w-full space-y-3">
      <div
        className="w-full overflow-hidden rounded-xl"
        style={{
          height: 480,
          border: '1px solid var(--border)',
          backgroundColor: 'var(--s2)',
        }}
      >
        <iframe
          title="Peta Padukuhan Plosorejo (OpenStreetMap)"
          src={src}
          className="w-full h-full border-0"
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      {reason ? (
        <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
          Mode cadangan: {reason}
        </p>
      ) : null}
      <p className="text-xs text-center" style={{ color: 'var(--muted2)' }}>
        Peta interaktif penuh (batas RT hijau + jalan merah) membutuhkan JavaScript modern.{' '}
        <a
          href={`https://www.openstreetmap.org/?mlat=-7.62428&mlon=110.43829#map=16/-7.6228/110.4372`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          style={{ color: 'var(--gold)' }}
        >
          Buka di OpenStreetMap
        </a>
      </p>
    </div>
  )
}

class MapErrorBoundary extends Component<
  { children: ReactNode; onError: (msg: string) => void },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, _info: ErrorInfo) {
    this.props.onError(error.message || 'Render peta gagal')
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

export default function MapLoader() {
  const [Map, setMap] = useState<MapComponent | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [attempt, setAttempt] = useState(0)
  const [useFallback, setUseFallback] = useState(false)
  const requestIdRef = useRef(0)
  const manualSkipRef = useRef(false)

  useEffect(() => {
    if (manualSkipRef.current) return

    const requestId = ++requestIdRef.current
    let timeoutId = 0
    let settled = false

    setLoading(true)
    setError(null)
    setUseFallback(false)
    setMap(null)

    const settleError = (msg: string) => {
      if (settled || requestId !== requestIdRef.current || manualSkipRef.current) return
      settled = true
      window.clearTimeout(timeoutId)
      setError(msg)
      setLoading(false)
      setUseFallback(true)
    }

    const settleOk = (comp: MapComponent) => {
      if (settled || requestId !== requestIdRef.current || manualSkipRef.current) return
      settled = true
      window.clearTimeout(timeoutId)
      setMap(() => comp)
      setLoading(false)
      setError(null)
      setUseFallback(false)
    }

    timeoutId = window.setTimeout(() => {
      settleError('Peta interaktif terlalu lama dimuat — menampilkan peta cadangan.')
    }, LOAD_TIMEOUT_MS)

    const load = mapChunkPromise ?? import('./LeafletMap')

    load
      .then((mod) => {
        if (typeof mod?.default === 'function') {
          settleOk(mod.default)
        } else {
          settleError('Modul peta tidak valid.')
        }
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Gagal memuat modul peta'
        // One automatic retry on first failure (network flake)
        if (attempt === 0) {
          window.setTimeout(() => {
            if (!settled && requestId === requestIdRef.current) {
              setAttempt(1)
            }
          }, 300)
          return
        }
        settleError(msg)
      })

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [attempt])

  const skipToFallback = () => {
    manualSkipRef.current = true
    setUseFallback(true)
    setLoading(false)
    setError('Dilewati manual — menampilkan peta cadangan.')
    setMap(null)
  }

  const retryInteractive = () => {
    manualSkipRef.current = false
    setAttempt((n) => n + 1)
  }

  if (useFallback || (error && !Map)) {
    return (
      <div className="space-y-3">
        <div
          className="w-full rounded-xl flex flex-col items-center justify-center gap-3 text-sm px-4 py-4 text-center"
          style={{
            backgroundColor: 'var(--s1)',
            border: '1px solid var(--border)',
            color: 'var(--muted)',
          }}
          role="status"
        >
          <p style={{ color: 'var(--text)', fontWeight: 600 }}>Peta cadangan aktif</p>
          {error ? <p className="text-xs max-w-md">{error}</p> : null}
          <button
            type="button"
            onClick={retryInteractive}
            className="mt-1 px-4 py-2 rounded-lg text-xs font-semibold touch-manipulation"
            style={{
              border: '1px solid var(--border)',
              color: 'var(--gold)',
              minHeight: 44,
            }}
          >
            Coba peta interaktif lagi
          </button>
        </div>
        <StaticMapFallback reason={error || undefined} />
      </div>
    )
  }

  if (loading || !Map) {
    return (
      <div
        className="w-full rounded-xl flex flex-col items-center justify-center gap-3 text-[var(--muted)] text-sm px-4"
        style={{ height: 480, backgroundColor: 'var(--s2)', border: '1px solid var(--border)' }}
        aria-busy="true"
        aria-live="polite"
      >
        <span>Memuat peta interaktif…</span>
        <span className="text-[11px] opacity-70">Batas RT, jalan, dan titik penting desa</span>
        <div
          className="w-40 h-1.5 rounded-full overflow-hidden"
          style={{ background: 'var(--border)' }}
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full"
            style={{
              width: '40%',
              background: 'var(--gold)',
              animation: 'map-load-pulse 1.1s ease-in-out infinite',
            }}
          />
        </div>
        <button
          type="button"
          onClick={skipToFallback}
          className="mt-2 px-4 py-2 rounded-lg text-xs font-semibold touch-manipulation"
          style={{
            border: '1px solid var(--border)',
            color: 'var(--text)',
            minHeight: 44,
          }}
        >
          Tampilkan peta sekarang
        </button>
        <style jsx>{`
          @keyframes map-load-pulse {
            0% {
              transform: translateX(-120%);
            }
            100% {
              transform: translateX(280%);
            }
          }
        `}</style>
      </div>
    )
  }

  return (
    <MapErrorBoundary
      onError={(msg) => {
        setError(msg)
        setUseFallback(true)
        setMap(null)
      }}
    >
      <Map />
    </MapErrorBoundary>
  )
}
