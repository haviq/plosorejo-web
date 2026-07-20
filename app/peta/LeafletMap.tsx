'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Polygon, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default marker icon paths broken by webpack bundling
function fixLeafletIcons() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

function makeIcon(color: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24C24 5.373 18.627 0 12 0z"
            fill="${color}" stroke="rgba(0,0,0,0.4)" stroke-width="1"/>
      <circle cx="12" cy="12" r="5" fill="white" opacity="0.9"/>
    </svg>`
  return L.divIcon({
    html: svg,
    className: '',
    iconSize:   [24, 36],
    iconAnchor: [12, 36],
    popupAnchor:[0, -36],
  })
}

// Padukuhan Plosorejo, Cangkringan, Sleman — lereng Merapi
// Sumber: PRD v2 + estimasi 4 RT di area Balong (perlu validasi lapangan)
const CENTER: [number, number] = [-7.6032, 110.4478]

// Outer boundary Padukuhan Plosorejo / RT Balong (PRD v2)
const PADUKUHAN_POLYGON: [number, number][] = [
  [-7.5998, 110.4451],
  [-7.5998, 110.4510],
  [-7.6055, 110.4510],
  [-7.6055, 110.4451],
]

// Sub-zona 4 RT di dalam outer boundary
// Warna: kuning, merah, hijau, biru (request user)
const RT_ZONES: {
  name: string
  color: string
  fillColor: string
  coords: [number, number][]
}[] = [
  {
    name: 'RT 01',
    color: '#eab308', // kuning
    fillColor: '#eab308',
    coords: [
      [-7.5998, 110.4451],
      [-7.5998, 110.44805],
      [-7.60265, 110.44805],
      [-7.60265, 110.4451],
    ],
  },
  {
    name: 'RT 02',
    color: '#ef4444', // merah
    fillColor: '#ef4444',
    coords: [
      [-7.5998, 110.44805],
      [-7.5998, 110.4510],
      [-7.60265, 110.4510],
      [-7.60265, 110.44805],
    ],
  },
  {
    name: 'RT 03',
    color: '#22c55e', // hijau
    fillColor: '#22c55e',
    coords: [
      [-7.60265, 110.4451],
      [-7.60265, 110.44805],
      [-7.6055, 110.44805],
      [-7.6055, 110.4451],
    ],
  },
  {
    name: 'RT 04',
    color: '#3b82f6', // biru
    fillColor: '#3b82f6',
    coords: [
      [-7.60265, 110.44805],
      [-7.60265, 110.4510],
      [-7.6055, 110.4510],
      [-7.6055, 110.44805],
    ],
  },
]

const markers: { pos: [number, number]; label: string; type: 'balai' | 'masjid' | 'farm' | 'umkm' | 'facility' }[] = [
  // Titik dari PRD v2
  { pos: [-7.6032, 110.4478], label: 'Balai Padukuhan Plosorejo', type: 'balai' },
  { pos: [-7.6025, 110.4465], label: 'Masjid RT Balong',          type: 'masjid' },
  { pos: [-7.6040, 110.4490], label: 'Kandang Sapi Koperasi',     type: 'farm' },
  { pos: [-7.6018, 110.4472], label: 'SD Umbulharjo',             type: 'facility' },
  { pos: [-7.5980, 110.4420], label: 'Puskesmas Cangkringan',     type: 'facility' },
  // Titik UMKM / peternakan lokal
  { pos: [-7.6005, 110.4460], label: 'Peternakan Pak Harto',      type: 'farm' },
  { pos: [-7.6045, 110.4500], label: 'Peternakan Bu Rahayu',      type: 'farm' },
  { pos: [-7.6010, 110.4495], label: 'Warung Bu Siti',            type: 'umkm' },
  { pos: [-7.6050, 110.4470], label: 'Bengkel Las Mandiri',       type: 'umkm' },
  { pos: [-7.6035, 110.4505], label: 'Batik Tulis Nusantara',     type: 'umkm' },
]

const TYPE_COLOR: Record<string, string> = {
  balai:    '#d4af37',
  masjid:   '#14b8a6',
  farm:     '#f59e0b',
  umkm:     '#22c55e',
  facility: '#818cf8',
}

const TYPE_LABEL: Record<string, string> = {
  balai:    'Balai',
  masjid:   'Masjid',
  farm:     'Peternakan',
  umkm:     'UMKM',
  facility: 'Fasilitas',
}

export default function LeafletMap() {
  useEffect(() => { fixLeafletIcons() }, [])

  return (
    <MapContainer
      center={CENTER}
      zoom={15}
      style={{ height: 480, width: '100%', borderRadius: '0.75rem', border: '1px solid var(--border)' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />

      {/* Outer boundary Padukuhan / RT Balong */}
      <Polygon
        positions={PADUKUHAN_POLYGON}
        pathOptions={{
          color: '#d4af37',
          fillColor: '#d4af37',
          fillOpacity: 0.04,
          weight: 3,
        }}
      >
        <Tooltip sticky>
          <span style={{ fontWeight: 600 }}>Batas Padukuhan Plosorejo (RT Balong)</span>
        </Tooltip>
      </Polygon>

      {/* Batas wilayah per RT */}
      {RT_ZONES.map((rt) => (
        <Polygon
          key={rt.name}
          positions={rt.coords}
          pathOptions={{
            color: rt.color,
            fillColor: rt.fillColor,
            fillOpacity: 0.18,
            weight: 2,
            dashArray: '6 4',
          }}
        >
          <Tooltip
            permanent
            direction="center"
            className="rt-label"
          >
            <span style={{
              fontWeight: 700,
              fontSize: '12px',
              color: rt.color,
              textShadow: '0 1px 3px rgba(0,0,0,0.8)',
              background: 'rgba(0,0,0,0.65)',
              padding: '2px 6px',
              borderRadius: '4px',
              border: `1px solid ${rt.color}`,
            }}>
              {rt.name}
            </span>
          </Tooltip>
        </Polygon>
      ))}

      {markers.map(({ pos, label, type }) => (
        <Marker
          key={label}
          position={pos}
          icon={makeIcon(TYPE_COLOR[type])}
        >
          <Popup>
            <div style={{ minWidth: 140 }}>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{TYPE_LABEL[type]}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
