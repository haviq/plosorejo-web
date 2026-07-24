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

/**
 * Progressive map loader:
 * 1) Always show OSM embed immediately (never blank spinner-only)
 * 2) Try Leaflet interactive in background
 * 3) Swap to Leaflet when ready; keep OSM if it fails
 */
const LOAD_TIMEOUT_MS = 8000

function StaticMapFallback({
  reason,
  compact,
}: {
  reason?: string
  compact?: boolean
}) {
  const bbox = '110.4315,-7.6285,110.4445,-7.6165'
  const marker = '-7.62428,110.43829'
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`

  return (
    <div className="w-full space-y-3">
      <div
        className="w-full overflow-hidden rounded-xl"
        style={{
          height: compact ? 360 : 480,
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
          allowFullScreen
        />
      </div>
      {reason ? (
        <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
          {reason}
        </p>
      ) : null}
      <p className="text-xs text-center" style={{ color: 'var(--muted2)' }}>
        <a
          href="https://www.openstreetmap.org/?mlat=-7.62428&mlon=110.43829#map=16/-7.6228/110.4372"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          style={{ color: 'var(--gold)' }}
        >
          Buka di OpenStreetMap
        </a>
        {' · '}
        Peta interaktif (batas RT hijau + jalan merah) dimuat otomatis bila perangkat mendukung.
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

  componentDidCatch(error: Error) {
    this.props.onError(error.message || 'Render peta gagal')
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

export default function MapLoader() {
  const [Map, setMap] = useState<MapComponent | null>(null)
  const [phase, setPhase] = useState<'osm' | 'leaflet' | 'error'>('osm')
  const [status, setStatus] = useState('Memuat peta interaktif di latar…')
  const [attempt, setAttempt] = useState(0)
  const requestIdRef = useRef(0)
  const cancelledRef = useRef(false)

  useEffect(() => {
    cancelledRef.current = false
    const requestId = ++requestIdRef.current
    let timeoutId = 0

    // Fresh import every attempt — never reuse a rejected module promise
    const load = () => import('./LeafletMap')

    const fail = (msg: string) => {
      if (cancelledRef.current || requestId !== requestIdRef.current) return
      setMap(null)
      setPhase('error')
      setStatus(msg)
    }

    const ok = (comp: MapComponent) => {
      if (cancelledRef.current || requestId !== requestIdRef.current) return
      window.clearTimeout(timeoutId)
      setMap(() => comp)
      setPhase('leaflet')
      setStatus('')
    }

    timeoutId = window.setTimeout(() => {
      // Keep OSM visible; stop waiting for Leaflet
      if (requestId === requestIdRef.current && !cancelledRef.current) {
        setPhase((p) => (p === 'leaflet' ? p : 'error'))
        setStatus('Peta interaktif tidak tersedia di perangkat ini — menampilkan peta cadangan.')
      }
    }, LOAD_TIMEOUT_MS)

    setPhase('osm')
    setStatus('Memuat peta interaktif di latar…')
    setMap(null)

    load()
      .then((mod) => {
        if (typeof mod?.default === 'function') {
          ok(mod.default)
        } else {
          fail('Modul peta tidak valid.')
        }
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Gagal memuat modul peta'
        if (attempt < 1) {
          window.setTimeout(() => {
            if (!cancelledRef.current && requestId === requestIdRef.current) {
              setAttempt((n) => n + 1)
            }
          }, 400)
          return
        }
        fail(msg)
      })

    return () => {
      cancelledRef.current = true
      window.clearTimeout(timeoutId)
    }
  }, [attempt])

  // Leaflet ready
  if (phase === 'leaflet' && Map) {
    return (
      <div className="space-y-2">
        <MapErrorBoundary
          onError={(msg) => {
            setMap(null)
            setPhase('error')
            setStatus(msg)
          }}
        >
          <Map />
        </MapErrorBoundary>
      </div>
    )
  }

  // Always show OSM immediately — never spinner-only
  return (
    <div className="space-y-3">
      {phase !== 'error' ? (
        <div
          className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-xs"
          style={{
            backgroundColor: 'var(--s1)',
            border: '1px solid var(--border)',
            color: 'var(--muted)',
          }}
          role="status"
          aria-live="polite"
        >
          <span>{status || 'Menyiapkan peta interaktif…'}</span>
          <button
            type="button"
            onClick={() => {
              cancelledRef.current = true
              setPhase('error')
              setStatus('Menggunakan peta cadangan.')
              setMap(null)
            }}
            className="shrink-0 px-3 py-2 rounded-lg font-semibold touch-manipulation"
            style={{
              border: '1px solid var(--border)',
              color: 'var(--text)',
              minHeight: 40,
            }}
          >
            Cukup peta ini
          </button>
        </div>
      ) : (
        <div
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-3 py-2 text-xs"
          style={{
            backgroundColor: 'var(--s1)',
            border: '1px solid var(--border)',
            color: 'var(--muted)',
          }}
          role="status"
        >
          <span>{status || 'Mode peta cadangan'}</span>
          <button
            type="button"
            onClick={() => {
              cancelledRef.current = false
              setAttempt((n) => n + 1)
            }}
            className="shrink-0 px-3 py-2 rounded-lg font-semibold touch-manipulation"
            style={{ color: 'var(--gold)', border: '1px solid var(--border)', minHeight: 40 }}
          >
            Coba interaktif
          </button>
        </div>
      )}
      <StaticMapFallback reason={phase === 'error' ? status || undefined : undefined} />
    </div>
  )
}
