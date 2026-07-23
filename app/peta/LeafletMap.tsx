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
import poiData from '@/content/poi.json'

// Fix default marker icon paths broken by webpack bundling
function fixLeafletIcons() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
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
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
  })
}

// ============================================================
// Padukuhan Plosorejo / Balong, Umbulharjo, Cangkringan
// 1 RW · 4 RT
// Batas hijau organik + jalan merah mengikuti geometri OSM
// (Jl. Raya Merapi Golf N–S, Jl. Menuju Lapangan Golf E–W)
// ============================================================

const CENTER: [number, number] = [-7.6228, 110.4372]

/**
 * Batas luar padukuhan (hijau) — mengikuti pola peta resmi:
 * barat menempel Jl. Raya Merapi Golf, selatan menempel
 * Jl. Menuju Lapangan Golf, utara/timur mengikuti cluster pemukiman.
 * Bentuk organik (bukan kotak).
 */
const PADUKUHAN_BOUNDARY: [number, number][] = [
  // barat laut → utara (sepanjang Jl Merapi Golf + sisi utara)
  [-7.61720, 110.43390],
  [-7.61695, 110.43540],
  [-7.61720, 110.43720],
  [-7.61730, 110.43900],
  [-7.61720, 110.44020],
  [-7.61710, 110.44180],
  // timur laut
  [-7.61740, 110.44310],
  [-7.61820, 110.44340],
  [-7.61940, 110.44350],
  [-7.62040, 110.44355],
  [-7.62130, 110.44345],
  [-7.62240, 110.44340],
  [-7.62350, 110.44320],
  [-7.62470, 110.44285],
  // tenggara → selatan (menuju simpang Jl Lapangan Golf)
  [-7.62580, 110.44250],
  [-7.62670, 110.44200],
  [-7.62695, 110.44185],
  // selatan sepanjang Jl Menuju Lapangan Golf (timur → barat)
  [-7.62650, 110.44100],
  [-7.62590, 110.44030],
  [-7.62570, 110.43940],
  [-7.62540, 110.43820],
  [-7.62542, 110.43720],
  [-7.62555, 110.43620],
  [-7.62572, 110.43500],
  [-7.62573, 110.43355],
  // barat daya naik Jl Raya Merapi Golf (selatan → utara)
  [-7.62480, 110.43346],
  [-7.62398, 110.43337],
  [-7.62300, 110.43324],
  [-7.62200, 110.43324],
  [-7.62100, 110.43335],
  [-7.61974, 110.43354],
  [-7.61832, 110.43374],
]

/** Jalan utama merah — sample dari OSM Overpass (2026-07) */
const MAIN_ROADS: {
  name: string
  weight: number
  coords: [number, number][]
}[] = [
  {
    // N–S spine di sisi barat padukuhan
    name: 'Jl. Raya Merapi Golf',
    weight: 5,
    coords: [
      [-7.61689, 110.43396],
      [-7.61717, 110.43391],
      [-7.61832, 110.43374],
      [-7.61974, 110.43354],
      [-7.62147, 110.43329],
      [-7.62180, 110.43326],
      [-7.62241, 110.43321],
      [-7.62300, 110.43324],
      [-7.62398, 110.43337],
      [-7.62480, 110.43346],
      [-7.62573, 110.43355],
      [-7.62665, 110.43366],
      [-7.62701, 110.43373],
      [-7.62748, 110.43376],
    ],
  },
  {
    // E–W spine di sisi selatan padukuhan
    name: 'Jl. Menuju Lapangan Golf Umbulharjo–Kepuharjo',
    weight: 5,
    coords: [
      [-7.62573, 110.43355],
      [-7.62576, 110.43390],
      [-7.62584, 110.43477],
      [-7.62577, 110.43508],
      [-7.62564, 110.43548],
      [-7.62553, 110.43653],
      [-7.62547, 110.43722],
      [-7.62541, 110.43741],
      [-7.62544, 110.43812],
      [-7.62542, 110.43875],
      [-7.62539, 110.43913],
      [-7.62547, 110.43937],
      [-7.62563, 110.43948],
      [-7.62573, 110.43962],
      [-7.62583, 110.44013],
      [-7.62590, 110.44037],
      [-7.62620, 110.44070],
      [-7.62650, 110.44098],
      [-7.62685, 110.44159],
      [-7.62695, 110.44185],
    ],
  },
  {
    // Lanjutan timur Jl Lapangan Golf (keluar area, tipis)
    name: 'Jl. Menuju Lapangan Golf (timur)',
    weight: 3.5,
    coords: [
      [-7.62695, 110.44185],
      [-7.62697, 110.44211],
      [-7.62699, 110.44279],
      [-7.62700, 110.44302],
      [-7.62699, 110.44342],
      [-7.62697, 110.44417],
    ],
  },
  {
    // Sisi timur padukuhan (unclassified OSM)
    name: 'Jalan sisi timur padukuhan',
    weight: 3.5,
    coords: [
      [-7.61742, 110.44360],
      [-7.61802, 110.44338],
      [-7.61841, 110.44339],
      [-7.61911, 110.44354],
      [-7.61961, 110.44354],
      [-7.62021, 110.44355],
      [-7.62062, 110.44359],
      [-7.62106, 110.44351],
      [-7.62155, 110.44344],
      [-7.62197, 110.44359],
      [-7.62232, 110.44355],
      [-7.62303, 110.44341],
      [-7.62383, 110.44309],
      [-7.62492, 110.44280],
      [-7.62576, 110.44252],
      [-7.62634, 110.44219],
      [-7.62695, 110.44185],
    ],
  },
  {
    // Sisi utara (penghubung pemukiman)
    name: 'Jalan sisi utara padukuhan',
    weight: 3,
    coords: [
      [-7.61689, 110.43396],
      [-7.61701, 110.43474],
      [-7.61713, 110.43546],
      [-7.61727, 110.43603],
      [-7.61727, 110.43716],
      [-7.61727, 110.43736],
      [-7.61737, 110.43795],
      [-7.61741, 110.43832],
      [-7.61737, 110.43888],
      [-7.61728, 110.43970],
      [-7.61723, 110.43985],
    ],
  },
]

/**
 * 4 RT organik di dalam batas padukuhan.
 * Dipotong oleh sumbu jalan:
 *  - N–S internal ~110.4372 (tengah)
 *  - E–W internal ~-7.6230 (tengah) + selatan di Jl Lapangan Golf
 * Warna hijau berjenjang seperti peta resmi.
 */
const RT_ZONES: {
  name: string
  rw: string
  color: string
  fillColor: string
  coords: [number, number][]
}[] = [
  {
    // Barat Laut — Masjid Al Fath, TK ABA Balong
    name: 'RT 01',
    rw: 'RW 01',
    color: '#15803d',
    fillColor: '#22c55e',
    coords: [
      [-7.61720, 110.43390],
      [-7.61695, 110.43540],
      [-7.61720, 110.43720],
      [-7.61950, 110.43715],
      [-7.62150, 110.43710],
      [-7.62300, 110.43715],
      [-7.62300, 110.43580],
      [-7.62300, 110.43450],
      [-7.62300, 110.43324],
      [-7.62200, 110.43324],
      [-7.62100, 110.43335],
      [-7.61974, 110.43354],
      [-7.61832, 110.43374],
    ],
  },
  {
    // Timur Laut — Masjid Al Ghofur
    name: 'RT 02',
    rw: 'RW 01',
    color: '#166534',
    fillColor: '#16a34a',
    coords: [
      [-7.61720, 110.43720],
      [-7.61730, 110.43900],
      [-7.61720, 110.44020],
      [-7.61710, 110.44180],
      [-7.61740, 110.44310],
      [-7.61820, 110.44340],
      [-7.61940, 110.44350],
      [-7.62040, 110.44355],
      [-7.62130, 110.44345],
      [-7.62240, 110.44340],
      [-7.62300, 110.44330],
      [-7.62300, 110.44120],
      [-7.62300, 110.43920],
      [-7.62300, 110.43715],
      [-7.62150, 110.43710],
      [-7.61950, 110.43715],
    ],
  },
  {
    // Barat Daya — SD/SMP, Angkringan, area selatan barat
    name: 'RT 03',
    rw: 'RW 01',
    color: '#14532d',
    fillColor: '#4ade80',
    coords: [
      [-7.62300, 110.43324],
      [-7.62300, 110.43450],
      [-7.62300, 110.43580],
      [-7.62300, 110.43715],
      [-7.62420, 110.43725],
      [-7.62542, 110.43720],
      [-7.62555, 110.43620],
      [-7.62572, 110.43500],
      [-7.62573, 110.43355],
      [-7.62480, 110.43346],
      [-7.62398, 110.43337],
    ],
  },
  {
    // Tenggara — Masjid Asy Syams, Balai, area selatan timur
    name: 'RT 04',
    rw: 'RW 01',
    color: '#052e16',
    fillColor: '#86efac',
    coords: [
      [-7.62300, 110.43715],
      [-7.62300, 110.43920],
      [-7.62300, 110.44120],
      [-7.62300, 110.44330],
      [-7.62350, 110.44320],
      [-7.62470, 110.44285],
      [-7.62580, 110.44250],
      [-7.62670, 110.44200],
      [-7.62695, 110.44185],
      [-7.62650, 110.44100],
      [-7.62590, 110.44030],
      [-7.62570, 110.43940],
      [-7.62540, 110.43820],
      [-7.62542, 110.43720],
      [-7.62420, 110.43725],
    ],
  },
]

/** Garis batas internal RT (putus-putus hijau gelap) di atas sumbu jalan */
const RT_DIVIDERS: { name: string; coords: [number, number][] }[] = [
  {
    name: 'Batas RT utara–selatan (tengah)',
    coords: [
      [-7.61720, 110.43720],
      [-7.61950, 110.43715],
      [-7.62150, 110.43710],
      [-7.62300, 110.43715],
      [-7.62420, 110.43725],
      [-7.62542, 110.43720],
    ],
  },
  {
    name: 'Batas RT barat–timur (tengah)',
    coords: [
      [-7.62300, 110.43324],
      [-7.62300, 110.43450],
      [-7.62300, 110.43580],
      [-7.62300, 110.43715],
      [-7.62300, 110.43920],
      [-7.62300, 110.44120],
      [-7.62300, 110.44330],
    ],
  },
]

const TYPE_COLOR: Record<string, string> = {
  farm: '#f59e0b',
  umkm: '#eab308',
  facility: '#60a5fa',
  balai: '#d4af37',
  masjid: '#14b8a6',
  kesehatan: '#22c55e',
  wisata: '#a78bfa',
}

const TYPE_LABEL: Record<string, string> = {
  farm: 'Peternakan',
  umkm: 'UMKM',
  facility: 'Fasilitas',
  balai: 'Balai / Kantor',
  masjid: 'Masjid',
  kesehatan: 'Kesehatan',
  wisata: 'Wisata',
}

const markers = (poiData as { lat: number; lng: number; label: string; type: string; desc?: string }[]).map(
  (p) => ({
    pos: [p.lat, p.lng] as [number, number],
    label: p.label,
    type: p.type,
    desc: p.desc,
  }),
)

export default function LeafletMap() {
  useEffect(() => {
    fixLeafletIcons()
  }, [])

  return (
    <MapContainer
      center={CENTER}
      zoom={16}
      style={{ height: 560, width: '100%', borderRadius: '0.75rem', border: '1px solid var(--border)' }}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ZoomControl position="bottomright" />

      {/* ===== RT zones (hijau berjenjang) ===== */}
      {RT_ZONES.map((rt) => (
        <Polygon
          key={rt.name}
          positions={rt.coords}
          pathOptions={{
            color: rt.color,
            fillColor: rt.fillColor,
            fillOpacity: 0.28,
            weight: 1.5,
            opacity: 0.85,
          }}
        >
          <Tooltip sticky>
            <div style={{ fontWeight: 700 }}>
              {rt.name} / {rt.rw}
              <div style={{ fontWeight: 400, fontSize: 11, marginTop: 2, color: '#666' }}>
                Zona administratif Padukuhan Plosorejo
              </div>
            </div>
          </Tooltip>
          <Tooltip permanent direction="center">
            <span
              style={{
                fontWeight: 800,
                fontSize: '12px',
                color: '#ecfdf5',
                textShadow: '0 1px 3px rgba(0,0,0,0.85)',
                background: 'rgba(6,78,59,0.82)',
                padding: '3px 8px',
                borderRadius: '6px',
                border: `1.5px solid ${rt.fillColor}`,
                display: 'inline-block',
                lineHeight: 1.25,
                textAlign: 'center',
              }}
            >
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
              <div style={{ fontSize: 12, color: '#666' }}>
                Batas wilayah administratif Padukuhan Plosorejo (Balong)
              </div>
            </div>
          </Popup>
        </Polygon>
      ))}

      {/* ===== Outer green padukuhan boundary ===== */}
      <Polygon
        positions={PADUKUHAN_BOUNDARY}
        pathOptions={{
          color: '#15803d',
          fillColor: '#22c55e',
          fillOpacity: 0.04,
          weight: 3.5,
          opacity: 0.95,
        }}
      >
        <Tooltip sticky>
          <span style={{ fontWeight: 700 }}>Batas Padukuhan Plosorejo (Balong)</span>
        </Tooltip>
        <Tooltip permanent direction="center" offset={[0, -110]}>
          <span
            style={{
              fontWeight: 800,
              fontSize: '12px',
              letterSpacing: '0.03em',
              color: '#ecfdf5',
              textShadow: '0 1px 3px rgba(0,0,0,0.9)',
              background: 'rgba(6,78,59,0.88)',
              padding: '4px 12px',
              borderRadius: '999px',
              border: '1.5px solid #4ade80',
            }}
          >
            Padukuhan Plosorejo
          </span>
        </Tooltip>
      </Polygon>

      {/* ===== RT dividers (dashed) ===== */}
      {RT_DIVIDERS.map((line) => (
        <Polyline
          key={line.name}
          positions={line.coords}
          pathOptions={{
            color: '#14532d',
            weight: 2,
            opacity: 0.7,
            dashArray: '7 5',
          }}
        >
          <Tooltip sticky>
            <span style={{ fontWeight: 600 }}>{line.name}</span>
          </Tooltip>
        </Polyline>
      ))}

      {/* ===== Red roads (OSM-aligned) ===== */}
      {MAIN_ROADS.map((road) => (
        <Polyline
          key={road.name}
          positions={road.coords}
          pathOptions={{
            color: '#dc2626',
            weight: road.weight,
            opacity: 0.92,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        >
          <Tooltip sticky>
            <span style={{ fontWeight: 700, color: '#b91c1c' }}>{road.name}</span>
          </Tooltip>
        </Polyline>
      ))}

      {/* ===== POI markers ===== */}
      {markers.map(({ pos, label, type, desc }) => (
        <Marker key={label} position={pos} icon={makeIcon(TYPE_COLOR[type] || '#d4af37')}>
          <Popup>
            <div style={{ minWidth: 150 }}>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 12, color: '#c4bca8' }}>{TYPE_LABEL[type] || type}</div>
              {desc ? <div style={{ fontSize: 11, marginTop: 4, color: '#9a9a9a' }}>{desc}</div> : null}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
