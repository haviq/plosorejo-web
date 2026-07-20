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
// Padukuhan Plosorejo / Balong, Umbulharjo, Cangkringan
// Koordinat & landmark dari OpenStreetMap (Overpass, Juli 2026)
// Batas RT = estimasi organik mengikuti jalan & cluster rumah
// ============================================================

// Center di antara Masjid Asy Syams & Jl. Raya Merapi Golf
const CENTER: [number, number] = [-7.6234, 110.4372]

// Outer boundary — envelope organik cluster pemukiman Balong
// Mengikuti sebaran jalan: Anaryoto–Anjar Wiyanto–Masjid Asy Syams–SD
const PADUKUHAN_POLYGON: [number, number][] = [
  [-7.6186, 110.4340], // utara-barat dekat Adi Prawoto
  [-7.6182, 110.4360],
  [-7.6184, 110.4382],
  [-7.6190, 110.4400],
  [-7.6202, 110.4414], // utara-timur Anjar Wiyanto
  [-7.6218, 110.4420],
  [-7.6234, 110.4420], // timur Al Ghofur / Budi Sanyoto
  [-7.6250, 110.4414],
  [-7.6264, 110.4404],
  [-7.6272, 110.4388], // selatan-timur
  [-7.6274, 110.4370],
  [-7.6268, 110.4350], // selatan Angkringan / SD
  [-7.6258, 110.4336],
  [-7.6242, 110.4328], // barat-selatan TK Ibnu Abbas
  [-7.6224, 110.4326], // barat Anaryoto / Anto
  [-7.6206, 110.4330],
  [-7.6194, 110.4336],
]

// 4 RT organik — dipisah kira-kira oleh:
//   - Jl. Raya Merapi Golf (N–S, ~110.4355)
//   - Jl. Menuju Lapangan Golf (E–W, ~-7.6245)
// Warna: kuning / merah / hijau / biru
const RT_ZONES: {
  name: string
  color: string
  fillColor: string
  coords: [number, number][]
}[] = [
  {
    // RT 01 — Barat Laut
    // Adi Prawoto, Anaryoto, Anto, Masjid Al Fath
    name: 'RT 01',
    color: '#eab308',
    fillColor: '#eab308',
    coords: [
      [-7.6186, 110.4340],
      [-7.6182, 110.4360],
      [-7.6188, 110.4372],
      [-7.6210, 110.4370], // ke Jl. Golf E-W
      [-7.6230, 110.4362],
      [-7.6234, 110.4348], // Masjid Al Fath area
      [-7.6224, 110.4326],
      [-7.6206, 110.4330],
      [-7.6194, 110.4336],
    ],
  },
  {
    // RT 02 — Timur Laut
    // Anjar Wiyanto, Masjid Al Ghofur, Budi Sanyoto
    name: 'RT 02',
    color: '#ef4444',
    fillColor: '#ef4444',
    coords: [
      [-7.6188, 110.4372],
      [-7.6184, 110.4382],
      [-7.6190, 110.4400],
      [-7.6202, 110.4414],
      [-7.6218, 110.4420],
      [-7.6234, 110.4420],
      [-7.6240, 110.4406],
      [-7.6236, 110.4386], // Budi Suharto / Bakir utara
      [-7.6230, 110.4372],
      [-7.6210, 110.4370],
    ],
  },
  {
    // RT 03 — Barat Daya
    // SD Umbulharjo, Gedung Serbaguna, SMP Taman Dewasa, Angkringan
    name: 'RT 03',
    color: '#22c55e',
    fillColor: '#22c55e',
    coords: [
      [-7.6234, 110.4348],
      [-7.6230, 110.4362],
      [-7.6236, 110.4374], // ke Jl. Golf E-W
      [-7.6252, 110.4376],
      [-7.6264, 110.4368],
      [-7.6268, 110.4350],
      [-7.6258, 110.4336],
      [-7.6242, 110.4328],
    ],
  },
  {
    // RT 04 — Tenggara
    // Masjid Asy Syams, Bakir, Basuki, Bardi Puroyo, Budi Suharto
    name: 'RT 04',
    color: '#3b82f6',
    fillColor: '#3b82f6',
    coords: [
      [-7.6230, 110.4372],
      [-7.6236, 110.4386],
      [-7.6240, 110.4406],
      [-7.6234, 110.4420],
      [-7.6250, 110.4414],
      [-7.6264, 110.4404],
      [-7.6272, 110.4388],
      [-7.6274, 110.4370],
      [-7.6264, 110.4368],
      [-7.6252, 110.4376],
      [-7.6236, 110.4374],
    ],
  },
]

// Marker: prioritas OSM real, sisanya estimasi lokal
const markers: {
  pos: [number, number]
  label: string
  type: 'balai' | 'masjid' | 'farm' | 'umkm' | 'facility'
}[] = [
  // === Landmark OSM real ===
  { pos: [-7.624274, 110.438280], label: 'Masjid Asy Syams',              type: 'masjid' },
  { pos: [-7.622214, 110.435219], label: 'Masjid Al Fath',                type: 'masjid' },
  { pos: [-7.622196, 110.440536], label: 'Masjid Al Ghofur',              type: 'masjid' },
  { pos: [-7.625043, 110.436251], label: 'SD Umbulharjo',                 type: 'facility' },
  { pos: [-7.624993, 110.435467], label: 'SMP Taman Dewasa',              type: 'facility' },
  { pos: [-7.625309, 110.435846], label: 'Gedung Serbaguna Umbulharjo',   type: 'balai' },
  { pos: [-7.617692, 110.435375], label: 'TK ABA Balong',                 type: 'facility' },
  { pos: [-7.625888, 110.434990], label: 'Angkringan Wek-ji',             type: 'umkm' },

  // === Estimasi titik lokal di area Balong ===
  { pos: [-7.6238, 110.4375], label: 'Balai Padukuhan Plosorejo', type: 'balai' },
  { pos: [-7.6218, 110.4358], label: 'Kandang Sapi Koperasi',    type: 'farm' },
  { pos: [-7.6200, 110.4345], label: 'Peternakan Pak Harto',     type: 'farm' },
  { pos: [-7.6252, 110.4395], label: 'Peternakan Bu Rahayu',     type: 'farm' },
  { pos: [-7.6225, 110.4388], label: 'Warung Bu Siti',           type: 'umkm' },
  { pos: [-7.6260, 110.4375], label: 'Bengkel Las Mandiri',      type: 'umkm' },
  { pos: [-7.6215, 110.4405], label: 'Batik Tulis Nusantara',    type: 'umkm' },
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
      style={{ height: 540, width: '100%', borderRadius: '0.75rem', border: '1px solid var(--border)' }}
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
          fillOpacity: 0.03,
          weight: 2.5,
        }}
      >
        <Tooltip sticky>
          <span style={{ fontWeight: 600 }}>Batas Padukuhan Plosorejo (Balong)</span>
        </Tooltip>
      </Polygon>

      {/* Batas wilayah per RT — bentuk organik mengikuti jalan */}
      {RT_ZONES.map((rt) => (
        <Polygon
          key={rt.name}
          positions={rt.coords}
          pathOptions={{
            color: rt.color,
            fillColor: rt.fillColor,
            fillOpacity: 0.22,
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
