'use client'

import { useEffect, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  Polygon,
  Polyline,
  Tooltip,
  useMap,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import poiData from '@/content/poi.json'
import {
  MAP_CENTER as CENTER,
  PADUKUHAN_BOUNDARY,
  MAIN_ROADS,
  RT_ZONES,
  RT_DIVIDERS,
} from '@/lib/map-geometry'

/** Fix blank/gray map on mobile when container size settles after mount */
function MapResizeFix() {
  const map = useMap()
  useEffect(() => {
    const invalidate = () => {
      try {
        map.invalidateSize({ animate: false })
      } catch {
        // ignore
      }
    }
    invalidate()
    const t1 = window.setTimeout(invalidate, 100)
    const t2 = window.setTimeout(invalidate, 400)
    const t3 = window.setTimeout(invalidate, 1000)
    window.addEventListener('orientationchange', invalidate)
    window.addEventListener('resize', invalidate)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
      window.removeEventListener('orientationchange', invalidate)
      window.removeEventListener('resize', invalidate)
    }
  }, [map])
  return null
}

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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      fixLeafletIcons()
    } catch {
      // ignore icon path fix failures — divIcon markers still work
    }

    // Leaflet sometimes leaves body/document handlers that feel "stuck"
    // after drag; ensure page scroll & nav remain usable when leaving map.
    const unlockUi = () => {
      document.body.style.removeProperty('overflow')
      document.documentElement.style.removeProperty('overflow')
    }
    window.addEventListener('pointerup', unlockUi, { passive: true })
    window.addEventListener('touchend', unlockUi, { passive: true })
    return () => {
      unlockUi()
      window.removeEventListener('pointerup', unlockUi)
      window.removeEventListener('touchend', unlockUi)
    }
  }, [])

  // Client-only mount gate (avoids SSR/hydration blank map)
  if (!mounted) {
    return (
      <div
        className="w-full rounded-xl"
        style={{ height: 560, backgroundColor: 'var(--s2)', border: '1px solid var(--border)' }}
        aria-hidden="true"
      />
    )
  }

  return (
    <div className="peta-map-shell">
      <MapContainer
        center={CENTER}
        zoom={16}
        style={{
          height: 560,
          width: '100%',
          maxWidth: '100%',
          borderRadius: '0.75rem',
          border: '1px solid var(--border)',
          zIndex: 0,
          background: '#1a1a1a',
        }}
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom={false}
        dragging
        doubleClickZoom
        touchZoom
        boxZoom={false}
        keyboard={false}
        // Don't trap browser page with inertia overscroll on mobile
        inertia
        worldCopyJump={false}
      >
        <MapResizeFix />
        <TileLayer
          // Carto Voyager — often more reliable than OSM tile CDN on mobile networks
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          maxZoom={19}
          subdomains="abcd"
        />
        <ZoomControl position="bottomright" />

      {/* ===== RT zones (hijau berjenjang) — stroke tebal biar kelihatan di mobile ===== */}
      {RT_ZONES.map((rt) => (
        <Polygon
          key={rt.name}
          positions={rt.coords}
          pathOptions={{
            color: '#14532d',
            fillColor: rt.fillColor,
            fillOpacity: 0.38,
            weight: 3,
            opacity: 1,
            lineJoin: 'round',
            lineCap: 'round',
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
          color: '#166534',
          fillColor: '#22c55e',
          fillOpacity: 0.06,
          weight: 4.5,
          opacity: 1,
          dashArray: undefined,
          lineJoin: 'round',
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
            color: '#052e16',
            weight: 3,
            opacity: 0.9,
            dashArray: '8 6',
            lineCap: 'round',
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
    </div>
  )
}
