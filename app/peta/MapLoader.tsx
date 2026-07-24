'use client'

import {
  Component,
  useEffect,
  useState,
  type ErrorInfo,
  type ReactNode,
} from 'react'
import dynamic from 'next/dynamic'
import MapBoundarySvg from '@/components/MapBoundarySvg'
import { MAP_BBOX, MAP_CENTER } from '@/lib/map-geometry'

const LeafletMapDynamic = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-xl animate-pulse"
      style={{ height: 500, backgroundColor: 'var(--s2)', border: '1px solid var(--border)' }}
      aria-hidden="true"
    />
  ),
})

function BoundaryMapFallback({
  reason,
  showRetry,
  onRetry,
}: {
  reason?: string
  showRetry?: boolean
  onRetry?: () => void
}) {
  const { west, south, east, north } = MAP_BBOX
  const bbox = `${west},${south},${east},${north}`
  const marker = `${MAP_CENTER[0]},${MAP_CENTER[1]}`
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`

  return (
    <div className="w-full space-y-3">
      <div
        className="relative w-full overflow-hidden rounded-xl"
        style={{
          height: 500,
          border: '1px solid var(--border)',
          backgroundColor: 'var(--s2)',
        }}
      >
        <iframe
          title="Peta Padukuhan Plosorejo (OpenStreetMap)"
          src={src}
          className="absolute inset-0 w-full h-full border-0"
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          style={{ zIndex: 0 }}
        />
        <MapBoundarySvg />
        <div
          className="absolute left-2 bottom-2 rounded-lg px-2 py-1 text-[10px] font-semibold"
          style={{
            zIndex: 3,
            background: 'rgba(8,8,8,0.78)',
            color: '#ecfdf5',
            border: '1px solid rgba(74,222,128,0.55)',
            pointerEvents: 'none',
          }}
        >
          Hijau = batas RT · Merah = jalan
        </div>
      </div>

      <div
        className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-3 py-2 text-xs"
        style={{
          backgroundColor: 'var(--s1)',
          border: '1px solid var(--border)',
          color: 'var(--muted)',
        }}
        role="status"
      >
        <span>
          <strong style={{ color: 'var(--gold)' }}>Batas RT tetap ditampilkan.</strong>
          {reason ? ` ${reason}` : ' Mode cadangan (OSM + overlay).'}
        </span>
        {showRetry && onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="shrink-0 px-3 py-2 rounded-lg font-semibold touch-manipulation"
            style={{ color: 'var(--gold)', border: '1px solid var(--border)', minHeight: 40 }}
          >
            Coba interaktif
          </button>
        ) : null}
      </div>
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

/**
 * Prefer Leaflet. On render error → OSM + SVG borders.
 * No aggressive timeout that kills a healthy Leaflet map.
 */
export default function MapLoader() {
  const [failed, setFailed] = useState(false)
  const [status, setStatus] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    // Soft check: if after 12s still no .leaflet-container, show fallback with borders
    if (failed) return
    const t = window.setTimeout(() => {
      if (!document.querySelector('.leaflet-container')) {
        setStatus('Peta interaktif lambat dimuat')
        setFailed(true)
      }
    }, 12000)
    return () => window.clearTimeout(t)
  }, [failed, attempt])

  const retry = () => {
    setStatus('')
    setFailed(false)
    setAttempt((n) => n + 1)
  }

  if (failed) {
    return <BoundaryMapFallback reason={status || undefined} showRetry onRetry={retry} />
  }

  return (
    <div className="space-y-2" key={`leaflet-${attempt}`}>
      <MapErrorBoundary
        onError={(msg) => {
          setStatus(msg)
          setFailed(true)
        }}
      >
        <LeafletMapDynamic />
      </MapErrorBoundary>
      <p className="text-[11px] text-center" style={{ color: 'var(--muted2)' }}>
        Hijau = batas RT/padukuhan · Merah = jalan utama · Ketuk zona untuk detail
      </p>
    </div>
  )
}
