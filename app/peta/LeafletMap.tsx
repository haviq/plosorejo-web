'use client'

import { useEffect } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  Polygon,
  Polyline,
  Tooltip,
} from 'react-leaflet'
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
// Struktur: 1 RW (RW 01) · 4 RT (RT 01–04)
// Koordinat OSM real + batas organik mengikuti jalan
// ============================================================

const CENTER: [number, number] = [-7.6234, 110.4372]

// RW 01 = outer boundary padukuhan (organik)
const RW_ZONES: {
  name: string
  color: string
  coords: [number, number][]
}[] = [
  {
    name: 'RW 01',
    color: '#d4af37',
    coords: [
      [-7.6186, 110.4340],
      [-7.6182, 110.4360],
      [-7.6184, 110.4382],
      [-7.6190, 110.4400],
      [-7.6202, 110.4414],
      [-7.6218, 110.4420],
      [-7.6234, 110.4420],
      [-7.6250, 110.4414],
      [-7.6264, 110.4404],
      [-7.6272, 110.4388],
      [-7.6274, 110.4370],
      [-7.6268, 110.4350],
      [-7.6258, 110.4336],
      [-7.6242, 110.4328],
      [-7.6224, 110.4326],
      [-7.6206, 110.4330],
      [-7.6194, 110.4336],
    ],
  },
]

// Garis batas internal (lebih tegas) — sumbu jalan utama
// N–S ~ Jl. Raya Merapi Golf · E–W ~ Jl. Menuju Lapangan Golf
const BOUNDARY_LINES: { name: string; coords: [number, number][] }[] = [
  {
    name: 'Batas RT (utara–selatan)',
    coords: [
      [-7.6185, 110.4371],
      [-7.6210, 110.4370],
      [-7.6230, 110.4372],
      [-7.6252, 110.4375],
      [-7.6270, 110.4369],
    ],
  },
  {
    name: 'Batas RT (barat–timur)',
    coords: [
      [-7.6232, 110.4328],
      [-7.6234, 110.4348],
      [-7.6230, 110.4362],
      [-7.6230, 110.4372],
      [-7.6236, 110.4386],
      [-7.6240, 110.4406],
      [-7.6234, 110.4420],
    ],
  },
]

// 4 RT di dalam RW 01
const RT_ZONES: {
  name: string
  rw: string
  color: string
  fillColor: string
  coords: [number, number][]
}[] = [
  {
    // Barat Laut — Adi Prawoto, Anaryoto, Masjid Al Fath
    name: 'RT 01',
    rw: 'RW 01',
    color: '#eab308',
    fillColor: '#eab308',
    coords: [
      [-7.6186, 110.4340],
      [-7.6182, 110.4360],
      [-7.6188, 110.4372],
      [-7.6210, 110.4370],
      [-7.6230, 110.4362],
      [-7.6234, 110.4348],
      [-7.6224, 110.4326],
      [-7.6206, 110.4330],
      [-7.6194, 110.4336],
    ],
  },
  {
    // Timur Laut — Anjar Wiyanto, Masjid Al Ghofur
    name: 'RT 02',
    rw: 'RW 01',
    color: 'var(--gold)',
    fillColor: 'var(--gold)',
    coords: [
      [-7.6188, 110.4372],
      [-7.6184, 110.4382],
      [-7.6190, 110.4400],
      [-7.6202, 110.4414],
      [-7.6218, 110.4420],
      [-7.6234, 110.4420],
      [-7.6240, 110.4406],
      [-7.6236, 110.4386],
      [-7.6230, 110.4372],
      [-7.6210, 110.4370],
    ],
  },
  {
    // Barat Daya — SD Umbulharjo, Gedung Serbaguna
    name: 'RT 03',
    rw: 'RW 01',
    color: 'var(--gold)',
    fillColor: 'var(--gold)',
    coords: [
      [-7.6234, 110.4348],
      [-7.6230, 110.4362],
      [-7.6236, 110.4374],
      [-7.6252, 110.4376],
      [-7.6264, 110.4368],
      [-7.6268, 110.4350],
      [-7.6258, 110.4336],
      [-7.6242, 110.4328],
    ],
  },
  {
    // Tenggara — Masjid Asy Syams, Bakir, Basuki
    name: 'RT 04',
    rw: 'RW 01',
    color: 'var(--gold)',
    fillColor: 'var(--gold)',
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

const markers: {
  pos: [number, number]
  label: string
  type: 'balai' | 'masjid' | 'farm' | 'umkm' | 'facility'
}[] = [
  { pos: [-7.624274, 110.438280], label: 'Masjid Asy Syams',            type: 'masjid' },
  { pos: [-7.622214, 110.435219], label: 'Masjid Al Fath',              type: 'masjid' },
  { pos: [-7.622196, 110.440536], label: 'Masjid Al Ghofur',            type: 'masjid' },
  { pos: [-7.625043, 110.436251], label: 'SD Umbulharjo',               type: 'facility' },
  { pos: [-7.624993, 110.435467], label: 'SMP Taman Dewasa',            type: 'facility' },
  { pos: [-7.625309, 110.435846], label: 'Gedung Serbaguna Umbulharjo', type: 'balai' },
  { pos: [-7.617692, 110.435375], label: 'TK ABA Balong',               type: 'facility' },
  { pos: [-7.625888, 110.434990], label: 'Angkringan Wek-ji',           type: 'umkm' },
  { pos: [-7.6238, 110.4375],     label: 'Balai Padukuhan Plosorejo',   type: 'balai' },
  { pos: [-7.6218, 110.4358],     label: 'Kandang Sapi Koperasi',       type: 'farm' },
  { pos: [-7.6200, 110.4345],     label: 'Peternakan Pak Harto',        type: 'farm' },
  { pos: [-7.6252, 110.4395],     label: 'Peternakan Bu Rahayu',        type: 'farm' },
  { pos: [-7.6225, 110.4388],     label: 'Warung Bu Siti',              type: 'umkm' },
  { pos: [-7.6260, 110.4375],     label: 'Bengkel Las Mandiri',         type: 'umkm' },
  { pos: [-7.6215, 110.4405],     label: 'Batik Tulis Nusantara',       type: 'umkm' },
]

const TYPE_COLOR: Record<string, string> = {
  balai:    '#d4af37',
  masjid:   '#14b8a6',
  farm:     'var(--gold)',
  umkm:     'var(--gold)',
  facility: 'var(--gold)',
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
      style={{ height: 560, width: '100%', borderRadius: '0.75rem', border: '1px solid var(--border)' }}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />

      {/* ===== RW boundary (outer) ===== */}
      {RW_ZONES.map((rw) => (
        <Polygon
          key={rw.name}
          positions={rw.coords}
          pathOptions={{
            color: rw.color,
            fillColor: rw.color,
            fillOpacity: 0.02,
            weight: 3.5,
            opacity: 0.95,
          }}
        >
          <Tooltip sticky>
            <span style={{ fontWeight: 700 }}>
              {rw.name} · Batas wilayah padukuhan
            </span>
          </Tooltip>
          <Tooltip permanent direction="center" offset={[0, -90]}>
            <span style={{
              fontWeight: 800,
              fontSize: '13px',
              letterSpacing: '0.04em',
              color: rw.color,
              textShadow: '0 1px 3px rgba(0,0,0,0.9)',
              background: 'rgba(0,0,0,0.72)',
              padding: '3px 10px',
              borderRadius: '999px',
              border: `1.5px solid ${rw.color}`,
            }}>
              {rw.name}
            </span>
          </Tooltip>
        </Polygon>
      ))}

      {/* ===== Garis batas internal RT (lebih tegas) ===== */}
      {BOUNDARY_LINES.map((line) => (
        <Polyline
          key={line.name}
          positions={line.coords}
          pathOptions={{
            color: 'var(--on-dark-text)',
            weight: 2.5,
            opacity: 0.75,
            dashArray: '8 5',
          }}
        >
          <Tooltip sticky>
            <span style={{ fontWeight: 600 }}>{line.name}</span>
          </Tooltip>
        </Polyline>
      ))}

      {/* ===== RT zones ===== */}
      {RT_ZONES.map((rt) => (
        <Polygon
          key={rt.name}
          positions={rt.coords}
          pathOptions={{
            color: rt.color,
            fillColor: rt.fillColor,
            fillOpacity: 0.24,
            weight: 2.5,
            opacity: 0.95,
          }}
        >
          <Tooltip sticky>
            <div style={{ fontWeight: 700 }}>
              {rt.name} / {rt.rw}
              <div style={{ fontWeight: 400, fontSize: 11, marginTop: 2, color: 'var(--muted)' }}>
                Klik untuk detail batas wilayah
              </div>
            </div>
          </Tooltip>
          <Tooltip permanent direction="center">
            <span style={{
              fontWeight: 800,
              fontSize: '12px',
              color: rt.color,
              textShadow: '0 1px 3px rgba(0,0,0,0.9)',
              background: 'rgba(0,0,0,0.72)',
              padding: '3px 8px',
              borderRadius: '6px',
              border: `1.5px solid ${rt.color}`,
              display: 'inline-block',
              lineHeight: 1.25,
              textAlign: 'center',
            }}>
              {rt.name}
              <br />
              <span style={{ fontWeight: 600, fontSize: '10px', opacity: 0.9 }}>{rt.rw}</span>
            </span>
          </Tooltip>
          <Popup>
            <div style={{ minWidth: 160 }}>
              <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>
                {rt.name} / {rt.rw}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                Batas wilayah administratif Padukuhan Plosorejo (Balong)
              </div>
              <div style={{
                marginTop: 8,
                display: 'inline-block',
                width: 12,
                height: 12,
                borderRadius: 3,
                background: rt.color,
                verticalAlign: 'middle',
                marginRight: 6,
              }} />
              <span style={{ fontSize: 12, color: rt.color, fontWeight: 700 }}>
                Warna zona {rt.name}
              </span>
            </div>
          </Popup>
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
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{TYPE_LABEL[type]}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
