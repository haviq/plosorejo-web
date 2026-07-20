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

// ============================================================
// Lokasi real: Padukuhan Plosorejo / Balong, Umbulharjo,
// Cangkringan, Sleman — di sekitar Masjid Asy Syams &
// Jalan Menuju Lapangan Golf Umbulharjo-Kepuharjo
// Sumber OSM Nominatim (Juli 2026)
// ============================================================
const CENTER: [number, number] = [-7.6228, 110.4372]

// Outer boundary organik — mengikuti cluster pemukiman
// di sekitar Jl. Golf Umbulharjo / Balong (bukan kotak)
const PADUKUHAN_POLYGON: [number, number][] = [
  [-7.6168, 110.4338],
  [-7.6162, 110.4365],
  [-7.6168, 110.4392],
  [-7.6185, 110.4408],
  [-7.6210, 110.4416],
  [-7.6238, 110.4414],
  [-7.6262, 110.4405],
  [-7.6278, 110.4388],
  [-7.6282, 110.4365],
  [-7.6275, 110.4342],
  [-7.6255, 110.4328],
  [-7.6228, 110.4324],
  [-7.6200, 110.4328],
  [-7.6180, 110.4334],
]

// 4 RT organik — bentuk tidak beraturan, mengikuti jalan/pemukiman
// Warna: kuning / merah / hijau / biru
const RT_ZONES: {
  name: string
  color: string
  fillColor: string
  coords: [number, number][]
}[] = [
  {
    // RT 01 — barat laut (arah TK ABA Balong / utara)
    name: 'RT 01',
    color: '#eab308',
    fillColor: '#eab308',
    coords: [
      [-7.6168, 110.4338],
      [-7.6162, 110.4365],
      [-7.6168, 110.4380],
      [-7.6188, 110.4384],
      [-7.6205, 110.4376],
      [-7.6208, 110.4355],
      [-7.6200, 110.4336],
      [-7.6180, 110.4334],
    ],
  },
  {
    // RT 02 — timur laut (arah Jl. Golf ke utara-timur)
    name: 'RT 02',
    color: '#ef4444',
    fillColor: '#ef4444',
    coords: [
      [-7.6168, 110.4380],
      [-7.6168, 110.4392],
      [-7.6185, 110.4408],
      [-7.6210, 110.4416],
      [-7.6225, 110.4408],
      [-7.6222, 110.4386],
      [-7.6205, 110.4376],
      [-7.6188, 110.4384],
    ],
  },
  {
    // RT 03 — barat daya (arah SD Umbulharjo / selatan-barat)
    name: 'RT 03',
    color: '#22c55e',
    fillColor: '#22c55e',
    coords: [
      [-7.6200, 110.4336],
      [-7.6208, 110.4355],
      [-7.6222, 110.4370],
      [-7.6245, 110.4368],
      [-7.6260, 110.4355],
      [-7.6275, 110.4342],
      [-7.6255, 110.4328],
      [-7.6228, 110.4324],
    ],
  },
  {
    // RT 04 — tenggara (Masjid Asy Syams / selatan-timur)
    name: 'RT 04',
    color: '#3b82f6',
    fillColor: '#3b82f6',
    coords: [
      [-7.6205, 110.4376],
      [-7.6222, 110.4386],
      [-7.6225, 110.4408],
      [-7.6238, 110.4414],
      [-7.6262, 110.4405],
      [-7.6278, 110.4388],
      [-7.6282, 110.4365],
      [-7.6260, 110.4355],
      [-7.6245, 110.4368],
      [-7.6222, 110.4370],
      [-7.6208, 110.4355],
    ],
  },
]

// Marker di titik OSM nyata + estimasi UMKM di sekitar
const markers: {
  pos: [number, number]
  label: string
  type: 'balai' | 'masjid' | 'farm' | 'umkm' | 'facility'
}[] = [
  // Landmark OSM (real)
  {
    pos: [-7.62428, 110.43829],
    label: 'Masjid Asy Syams',
    type: 'masjid',
  },
  {
    pos: [-7.62505, 110.43628],
    label: 'SD Umbulharjo',
    type: 'facility',
  },
  {
    pos: [-7.62532, 110.43587],
    label: 'Gedung Serbaguna Umbulharjo',
    type: 'balai',
  },
  {
    pos: [-7.61769, 110.43537],
    label: 'TK ABA Balong',
    type: 'facility',
  },
  // Estimasi titik lokal di area Balong/Plosorejo
  {
    pos: [-7.6235, 110.4375],
    label: 'Balai Padukuhan Plosorejo',
    type: 'balai',
  },
  {
    pos: [-7.6215, 110.4360],
    label: 'Kandang Sapi Koperasi',
    type: 'farm',
  },
  {
    pos: [-7.6195, 110.4348],
    label: 'Peternakan Pak Harto',
    type: 'farm',
  },
  {
    pos: [-7.6255, 110.4390],
    label: 'Peternakan Bu Rahayu',
    type: 'farm',
  },
  {
    pos: [-7.6220, 110.4388],
    label: 'Warung Bu Siti',
    type: 'umkm',
  },
  {
    pos: [-7.6265, 110.4372],
    label: 'Bengkel Las Mandiri',
    type: 'umkm',
  },
  {
    pos: [-7.6208, 110.4395],
    label: 'Batik Tulis Nusantara',
    type: 'umkm',
  },
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
      zoom={16}
      style={{ height: 520, width: '100%', borderRadius: '0.75rem', border: '1px solid var(--border)' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />

      {/* Outer boundary Padukuhan — organik */}
      <Polygon
        positions={PADUKUHAN_POLYGON}
        pathOptions={{
          color: '#d4af37',
          fillColor: '#d4af37',
          fillOpacity: 0.04,
          weight: 2.5,
        }}
      >
        <Tooltip sticky>
          <span style={{ fontWeight: 600 }}>Batas Padukuhan Plosorejo (Balong)</span>
        </Tooltip>
      </Polygon>

      {/* Batas wilayah per RT — bentuk organik */}
      {RT_ZONES.map((rt) => (
        <Polygon
          key={rt.name}
          positions={rt.coords}
          pathOptions={{
            color: rt.color,
            fillColor: rt.fillColor,
            fillOpacity: 0.2,
            weight: 2,
          }}
        >
          <Tooltip permanent direction="center" className="rt-label">
            <span style={{
              fontWeight: 700,
              fontSize: '12px',
              color: rt.color,
              textShadow: '0 1px 3px rgba(0,0,0,0.85)',
              background: 'rgba(0,0,0,0.65)',
              padding: '2px 7px',
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
            <div style={{ minWidth: 150 }}>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{TYPE_LABEL[type]}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
