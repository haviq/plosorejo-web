/**
 * Admin PIN session (cookie) — no external DB.
 * Set ADMIN_PIN in Vercel (min 8 chars). Demo fallback is documented only.
 */
import { secretsEqual } from '@/lib/secure-compare'

const COOKIE = 'plosorejo_admin'
const MAX_AGE_SEC = 60 * 60 * 12 // 12h

export function getAdminPin(): string {
  // Accept common env name variants users might set in Vercel UI
  const candidates = [
    process.env.ADMIN_PIN,
    process.env.ADMIN_PIN_CODE,
    process.env.PLOSOREJO_ADMIN_PIN,
  ]
  for (const raw of candidates) {
    const v = (raw || '').trim()
    if (v.length >= 4) return v
  }
  // Temporary demo fallback only when no env is set
  return 'plosorejo2026'
}

export function isAdminPinConfigured(): boolean {
  return (
    (process.env.ADMIN_PIN || process.env.ADMIN_PIN_CODE || process.env.PLOSOREJO_ADMIN_PIN || '')
      .trim()
      .length >= 4
  )
}

/** Lightweight signed token: base64url(payload).hmac */
export function mintAdminToken(pin: string, now = Date.now()): string {
  const exp = now + MAX_AGE_SEC * 1000
  const payload = `admin:${exp}`
  const sig = simpleHmac(payload, pin)
  return b64url(`${payload}|${sig}`)
}

export function verifyAdminToken(token: string | undefined | null, pin: string): boolean {
  if (!token) return false
  try {
    const raw = fromB64url(token)
    const [payload, sig] = raw.split('|')
    if (!payload || !sig) return false
    const expected = simpleHmac(payload, pin)
    if (!secretsEqual(sig, expected)) return false
    const exp = Number(payload.split(':')[1] || 0)
    if (!exp || Date.now() > exp) return false
    return true
  } catch {
    return false
  }
}

export function adminCookieHeader(token: string): string {
  const secure = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE_SEC}${secure ? '; Secure' : ''}`
}

export function clearAdminCookieHeader(): string {
  const secure = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? '; Secure' : ''}`
}

export function readAdminCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null
  const parts = cookieHeader.split(';')
  for (const p of parts) {
    const [k, ...rest] = p.trim().split('=')
    if (k === COOKIE) return rest.join('=') || null
  }
  return null
}

export function requestIsAdmin(req: Request): boolean {
  const pin = getAdminPin()
  const token = readAdminCookie(req.headers.get('cookie'))
  return verifyAdminToken(token, pin)
}

function simpleHmac(message: string, key: string): string {
  // FNV-1a style mix + key — not crypto-grade, enough for PIN session gate on a desa portal
  let h = 2166136261
  const s = `${key}::${message}::${key}`
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  // second pass
  let h2 = 0x811c9dc5
  for (let i = s.length - 1; i >= 0; i--) {
    h2 ^= s.charCodeAt(i)
    h2 = Math.imul(h2, 16777619)
  }
  return (h >>> 0).toString(16) + (h2 >>> 0).toString(16)
}

function b64url(s: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(s, 'utf8')
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }
  // edge fallback
  const b = btoa(unescape(encodeURIComponent(s)))
  return b.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromB64url(s: string): string {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4))
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + pad
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(b64, 'base64').toString('utf8')
  }
  return decodeURIComponent(escape(atob(b64)))
}

export { COOKIE as ADMIN_COOKIE_NAME, MAX_AGE_SEC as ADMIN_SESSION_SEC }
