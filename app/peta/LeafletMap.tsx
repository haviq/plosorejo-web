'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet'
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
