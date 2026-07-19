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
const CENTER: [number, number] = [-7.603, 110.448]

// Batas wilayah per RT — polygon kasar berdasarkan area Padukuhan Plosorejo
const RT_ZONES: {
  name: string
  color: string
  fillColor: string
  coords: [number, number][]
}[] = [
  {
    name: 'RT 01',
    color: '#eab308',
    fillColor: '#eab308',
    coords: [
      [-7.598, 110.443],
      [-7.598, 110.449],
      [-7.603, 110.449],
      [-7.603, 110.443],
    ],
  },
  {
    name: 'RT 02',
    color: '#ef4444',
    fillColor: '#ef4444',
    coords: [
      [-7.598, 110.449],
      [-7.598, 110.456],
      [-7.603, 110.456],
      [-7.603, 110.449],
    ],
  },
  {
    name: 'RT 03',
    color: '#22c55e',
    fillColor: '#22c55e',
    coords: [
      [-7.603, 110.443],
      [-7.603, 110.449],
      [-7.609, 110.449],
      [-7.609, 110.443],
    ],
  },
  {
    name: 'RT 04',
    color: '#3b82f6',
    fillColor: '#3b82f6',
    coords: [
      [-7.603, 110.449],
      [-7.603, 110.456],
      [-7.609, 110.456],
      [-7.609, 110.449],
    ],
  },
]

const markers: { pos: [number, number]; label: string; type: 'farm' | 'umkm' | 'facility' }[] = [
  { pos: [-7.600, 110.445], label: 'Peternakan Pak Harto',     type: 'farm'     },
  { pos: [-7.605, 110.452], label: 'Peternakan Bu Rahayu',     type: 'farm'     },
  { pos: [-7.598, 110.455], label: 'Peternakan Pak Suryono',   type: 'farm'     },
  { pos: [-7.603, 110.447], label: 'Warung Bu Siti',           type: 'umkm'     },
  { pos: [-7.608, 110.449], label: 'Bengkel Las Mandiri',      type: 'umkm'     },
  { pos: [-7.606, 110.457], label: 'Batik Tulis Nusantara',    type: 'umkm'     },
  { pos: [-7.602, 110.450], label: 'Balai Desa',               type: 'facility' },
  { pos: [-7.601, 110.446], label: 'Puskesmas',                type: 'facility' },
  { pos: [-7.604, 110.453], label: 'SDN Plosorejo 1',          type: 'facility' },
]

const TYPE_COLOR: Record<string, string> = {
  farm:     '#f59e0b',
  umkm:     '#22c55e',
  facility: '#818cf8',
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

      {/* Batas wilayah per RT */}
      {RT_ZONES.map((rt) => (
        <Polygon
          key={rt.name}
          positions={rt.coords}
          pathOptions={{
            color: rt.color,
            fillColor: rt.fillColor,
            fillOpacity: 0.15,
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
              fontSize: '13px',
              color: rt.color,
              textShadow: '0 1px 3px rgba(0,0,0,0.8)',
              background: 'rgba(0,0,0,0.6)',
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
            <span style={{ fontWeight: 600 }}>{label}</span>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
