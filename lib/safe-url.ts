/**
 * URL / href safety helpers — prevent javascript: / data: openers from CMS content.
 * Browser-safe: no Node Buffer / crypto (safe to import from client components).
 */

const BLOCKED_PROTOCOLS = /^(javascript|data|vbscript|file):/i

/** True if value is a same-origin path or safe http(s) URL. */
export function isSafeHref(value?: string | null): value is string {
  if (!value) return false
  const v = value.trim()
  if (!v || BLOCKED_PROTOCOLS.test(v)) return false
  // Relative / absolute path on this site
  if (v.startsWith('/') && !v.startsWith('//')) return true
  // Hash-only
  if (v.startsWith('#')) return true
  try {
    const u = new URL(v)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}

/** Prefer https external links; reject anything unsafe. */
export function safeExternalHref(value?: string | null): string | null {
  if (!isSafeHref(value)) return null
  const v = value.trim()
  if (v.startsWith('/') || v.startsWith('#')) return v
  try {
    const u = new URL(v)
    // Block credentials in URL
    if (u.username || u.password) return null
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null
    return u.toString()
  } catch {
    return null
  }
}

/** Google Maps / OSM / generic maps link from CMS */
export function safeMapsHref(value?: string | null): string | null {
  const href = safeExternalHref(value)
  if (!href) return null
  try {
    const u = new URL(href)
    const host = u.hostname.replace(/^www\./, '')
    const allowed = [
      'google.com',
      'maps.google.com',
      'goo.gl',
      'maps.app.goo.gl',
      'openstreetmap.org',
      'osm.org',
    ]
    if (allowed.some((h) => host === h || host.endsWith(`.${h}`))) return href
    // Allow any https maps-like path as fallback only if https
    if (u.protocol === 'https:') return href
    return null
  } catch {
    return null
  }
}

/** MAGMA / official report links */
export function safeOfficialHref(value?: string | null): string | null {
  const href = safeExternalHref(value)
  if (!href) return null
  try {
    const u = new URL(href)
    if (u.protocol !== 'https:') return null
    return href
  } catch {
    return null
  }
}
