import {
  MAIN_ROADS,
  PADUKUHAN_BOUNDARY,
  RT_DIVIDERS,
  RT_ZONES,
  polyToSvgPoints,
} from '@/lib/map-geometry'

const W = 1000
const H = 1000

/**
 * Pure SVG RT/padukuhan/road overlay — works without Leaflet.
 * Use over OSM tiles/iframe so boundaries never disappear.
 */
export default function MapBoundarySvg({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      {RT_ZONES.map((rt) => (
        <polygon
          key={rt.name}
          points={polyToSvgPoints(rt.coords, W, H)}
          fill={rt.fillColor}
          fillOpacity={0.34}
          stroke="#14532d"
          strokeWidth={3}
          strokeLinejoin="round"
        />
      ))}

      <polygon
        points={polyToSvgPoints(PADUKUHAN_BOUNDARY, W, H)}
        fill="#22c55e"
        fillOpacity={0.06}
        stroke="#166534"
        strokeWidth={5}
        strokeLinejoin="round"
      />

      {RT_DIVIDERS.map((line) => (
        <polyline
          key={line.name}
          points={polyToSvgPoints(line.coords, W, H)}
          fill="none"
          stroke="#052e16"
          strokeWidth={3}
          strokeDasharray="10 7"
          strokeLinecap="round"
          opacity={0.9}
        />
      ))}

      {MAIN_ROADS.map((road) => (
        <polyline
          key={road.name}
          points={polyToSvgPoints(road.coords, W, H)}
          fill="none"
          stroke="#dc2626"
          strokeWidth={road.weight * 1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.92}
        />
      ))}

      {/* RT labels */}
      {RT_ZONES.map((rt) => {
        const pts = rt.coords
        const midLat = pts.reduce((s, c) => s + c[0], 0) / pts.length
        const midLng = pts.reduce((s, c) => s + c[1], 0) / pts.length
        const [x, y] = (() => {
          const { west, south, east, north } = {
            west: 110.4315,
            south: -7.6285,
            east: 110.4445,
            north: -7.6165,
          }
          return [
            ((midLng - west) / (east - west)) * W,
            ((north - midLat) / (north - south)) * H,
          ] as [number, number]
        })()
        return (
          <g key={`${rt.name}-label`}>
            <rect
              x={x - 42}
              y={y - 18}
              width={84}
              height={36}
              rx={8}
              fill="rgba(6,78,59,0.86)"
              stroke={rt.fillColor}
              strokeWidth={2}
            />
            <text
              x={x}
              y={y - 2}
              textAnchor="middle"
              fill="#ecfdf5"
              fontSize={16}
              fontWeight={800}
              style={{ fontFamily: 'system-ui,sans-serif' }}
            >
              {rt.name}
            </text>
            <text
              x={x}
              y={y + 14}
              textAnchor="middle"
              fill="#d1fae5"
              fontSize={12}
              fontWeight={600}
              style={{ fontFamily: 'system-ui,sans-serif' }}
            >
              {rt.rw}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
