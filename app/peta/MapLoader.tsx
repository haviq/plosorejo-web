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
 * Prefer interactive Leaflet (RT boundaries + roads).
 * OSM embed is only fallback when Leaflet fails/timeouts.
 */
const LOAD_TIMEOUT_MS = 12000

function StaticMapFallback({
  reason,
  compact,
}: {
  reason?: string
  compact?: boolean
}) {
  // Static OSM has no custom RT polygons — show clear notice
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
      <div
        className="rounded-xl px-3 py-2 text-xs"
        style={{
          backgroundColor: 'var(--s1)',
          border: '1px solid var(--border)',
          color: 'var(--muted)',
        }}
        role="status"
      >
        <strong style={{ color: 'var(--gold)' }}>Mode cadangan:</strong> batas RT hijau & jalan
        merah hanya ada di peta interaktif.
        {reason ? ` (${reason})` : null}
      </div>
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
  const [phase, setPhase] = useState<'loading' | 'leaflet' | 'error'>('loading')
  const [status, setStatus] = useState('Memuat peta interaktif…')
  const [attempt, setAttempt] = useState(0)
  const requestIdRef = useRef(0)
  const cancelledRef = useRef(false)

  useEffect(() => {
    cancelledRef.current = false
    const requestId = ++requestIdRef.current
    let timeoutId = 0

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
      if (requestId === requestIdRef.current && !cancelledRef.current) {
        // Only fall back if Leaflet not ready
        setPhase((p) => (p === 'leaflet' ? p : 'error'))
        setStatus('Timeout memuat peta interaktif')
      }
    }, LOAD_TIMEOUT_MS)

    setPhase('loading')
    setStatus(attempt > 0 ? 'Mencoba lagi…' : 'Memuat peta interaktif (batas RT + jalan)…')
    setMap(null)

    // Prefetch CSS already bundled with LeafletMap; dynamic import for chunk
    import('./LeafletMap')
      .then((mod) => {
        if (typeof mod?.default === 'function') {
          ok(mod.default)
        } else {
          fail('Modul peta tidak valid')
        }
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Gagal memuat modul peta'
        if (attempt < 2) {
          window.setTimeout(() => {
            if (!cancelledRef.current && requestId === requestIdRef.current) {
              setAttempt((n) => n + 1)
            }
          }, 500)
          return
        }
        fail(msg)
      })

    return () => {
      cancelledRef.current = true
      window.clearTimeout(timeoutId)
    }
  }, [attempt])

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
        <p className="text-[11px] text-center" style={{ color: 'var(--muted2)' }}>
          Hijau = batas RT/padukuhan · Merah = jalan utama · Ketuk zona untuk detail
        </p>
      </div>
    )
  }

  if (phase === 'loading') {
    // Show OSM underneath while loading so page never looks blank,
    // but auto-upgrade when Leaflet ready
    return (
      <div className="space-y-2">
        <div
          className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-xs"
          style={{
            backgroundColor: 'var(--s1)',
            border: '1px solid var(--border)',
            color: 'var(--muted)',
          }}
          role="status"
        >
          <span>{status}</span>
          <button
            type="button"
            onClick={() => {
              cancelledRef.current = false
              setAttempt((n) => n + 1)
            }}
            className="shrink-0 px-3 py-2 rounded-lg font-semibold touch-manipulation"
            style={{ color: 'var(--gold)', border: '1px solid var(--border)', minHeight: 40 }}
          >
            Muat ulang
          </button>
        </div>
        {/* Temporary basemap while chunk loads */}
        <StaticMapFallback compact />
      </div>
    )
  }

  // error → OSM + retry
  return (
    <div className="space-y-2">
      <div
        className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-3 py-2 text-xs"
        style={{
          backgroundColor: 'var(--s1)',
          border: '1px solid var(--border)',
          color: 'var(--muted)',
        }}
        role="status"
      >
        <span>{status || 'Peta interaktif gagal dimuat'}</span>
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
      <StaticMapFallback reason={status || undefined} />
    </div>
  )
}
