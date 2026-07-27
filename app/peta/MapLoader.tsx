'use client'

import { Component, type ErrorInfo, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import MapBoundarySvg from '@/components/MapBoundarySvg'
import { MAP_BBOX, MAP_CENTER } from '@/lib/map-geometry'

// ─── Leaflet (kept for future use, currently disabled) ────────────────────────
const _LeafletMapDynamic = dynamic(() => import('./LeafletMap'), { ssr: false })

class _MapErrorBoundary extends Component<
  { children: ReactNode; onError: (msg: string) => void },
  { hasError: boolean }
> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error: Error, _info: ErrorInfo) { this.props.onError(error.message) }
  render() { return this.state.hasError ? null : this.props.children }
}
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert lat/lng to OSM tile coordinates at zoom level z.
 */
function latLngToTile(lat: number, lng: number, z: number) {
  const n = Math.pow(2, z)
  const x = Math.floor(((lng + 180) / 360) * n)
  const latRad = (lat * Math.PI) / 180
  const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n)
  return { x, y }
}

/**
 * Static tile grid map: renders OSM tiles as <img> tags in a grid.
 * Zero JS dependency, zero CSP issues, works everywhere.
 */
function StaticTileMap() {
  const z = 16
  const [clat, clng] = MAP_CENTER
  const center = latLngToTile(clat, clng, z)

  // 3×3 grid of tiles centered on map center
  const cols = 3
  const rows = 4
  const offsetX = Math.floor(cols / 2)
  const offsetY = Math.floor(rows / 2)

  const tiles: { x: number; y: number; col: number; row: number }[] = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      tiles.push({
        x: center.x - offsetX + col,
        y: center.y - offsetY + row,
        col,
        row,
      })
    }
  }

  const tileSize = 256
  const mapW = cols * tileSize
  const mapH = rows * tileSize

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl"
      style={{
        height: 480,
        border: '1px solid var(--border)',
        backgroundColor: '#e8e0d0',
      }}
      aria-label="Peta Padukuhan Plosorejo"
    >
      {/* Tile grid container — centered on map */}
      <div
        style={{
          position: 'absolute',
          width: mapW,
          height: mapH,
          // Center the tile grid in the container
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%)`,
        }}
      >
        {tiles.map(({ x, y, col, row }) => {
          const subdomain = ['a', 'b', 'c'][(x + y) % 3]
          const src = `https://${subdomain}.tile.openstreetmap.org/${z}/${x}/${y}.png`
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${x}-${y}`}
              src={src}
              alt=""
              width={tileSize}
              height={tileSize}
              style={{
                position: 'absolute',
                left: col * tileSize,
                top: row * tileSize,
                display: 'block',
              }}
              loading="eager"
              draggable={false}
            />
          )
        })}
      </div>

      {/* SVG batas padukuhan + RT overlay */}
      <MapBoundarySvg />

      {/* Legend */}
      <div
        className="absolute left-2 bottom-2 rounded-lg px-2 py-1 text-[10px] font-semibold"
        style={{
          zIndex: 3,
          background: 'rgba(8,8,8,0.82)',
          color: '#ecfdf5',
          border: '1px solid rgba(74,222,128,0.55)',
          pointerEvents: 'none',
        }}
      >
        Hijau = batas RT · Merah = jalan
      </div>

      {/* Attribution */}
      <div
        className="absolute right-1 bottom-1 text-[9px]"
        style={{ zIndex: 3, color: 'rgba(0,0,0,0.55)', pointerEvents: 'none' }}
      >
        © OpenStreetMap
      </div>
    </div>
  )
}

export default function MapLoader() {
  return (
    <div className="space-y-2">
      <StaticTileMap />
      <p className="text-[11px] text-center" style={{ color: 'var(--muted2)' }}>
        Hijau = batas RT/padukuhan · Merah = jalan utama · Batas wilayah Plosorejo
      </p>
    </div>
  )
}
