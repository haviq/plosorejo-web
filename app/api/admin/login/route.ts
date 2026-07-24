import { NextResponse } from 'next/server'
import {
  adminCookieHeader,
  clearAdminCookieHeader,
  getAdminPin,
  mintAdminToken,
  requestIsAdmin,
} from '@/lib/admin-auth'
import { clientIp, rateLimit, rateLimitHeaders } from '@/lib/rate-limit'
import { secretsEqual } from '@/lib/secure-compare'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  return NextResponse.json(
    {
      ok: true,
      admin: requestIsAdmin(req),
      pinFromEnv: Boolean(
        (process.env.ADMIN_PIN || process.env.ADMIN_PIN_CODE || process.env.PLOSOREJO_ADMIN_PIN || '')
          .trim(),
      ),
    },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}

export async function POST(req: Request) {
  const ip = clientIp(req)
  const rl = rateLimit(`admin-login:${ip}`, { limit: 12, windowMs: 15 * 60 * 1000 })
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'too_many_attempts' },
      { status: 429, headers: { ...rateLimitHeaders(rl), 'Cache-Control': 'no-store' } },
    )
  }

  let body: { pin?: string; action?: string } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  if (body.action === 'logout') {
    return NextResponse.json(
      { ok: true, admin: false },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
          'Set-Cookie': clearAdminCookieHeader(),
        },
      },
    )
  }

  const pin = String(body.pin || '').trim()
  const expected = getAdminPin()
  if (pin.length < 4 || !secretsEqual(pin, expected)) {
    return NextResponse.json(
      { ok: false, error: 'invalid_pin' },
      { status: 401, headers: { ...rateLimitHeaders(rl), 'Cache-Control': 'no-store' } },
    )
  }

  const token = mintAdminToken(expected)
  return NextResponse.json(
    { ok: true, admin: true },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
        'Set-Cookie': adminCookieHeader(token),
        ...rateLimitHeaders(rl),
      },
    },
  )
}
