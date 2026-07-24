import { NextResponse } from 'next/server'
import { fetchMerapiFromMagma, fallbackMerapiStatus } from '@/lib/merapi'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * GET /api/cron/merapi
 * Warm MAGMA cache. Protected by middleware when CRON_SECRET is set
 * (Authorization: Bearer <CRON_SECRET>).
 *
 * Always refuse unauthenticated access if CRON_SECRET is missing in production
 * so the endpoint cannot be used as a free SSRF/proxy hammer.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'

  if (isProd && (!secret || secret.length < 16)) {
    // Fail closed in production when secret not configured
    return NextResponse.json(
      { ok: false, error: 'cron_not_configured' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  // Defense in depth (middleware already checks when secret exists)
  if (secret && secret.length >= 16) {
    const auth = req.headers.get('authorization') || ''
    const bearer = auth.startsWith('Bearer ') ? auth.slice(7).trim() : ''
    const url = new URL(req.url)
    const q = url.searchParams.get('secret') || ''
    if (bearer !== secret && q !== secret) {
      return NextResponse.json(
        { ok: false, error: 'unauthorized' },
        { status: 401, headers: { 'Cache-Control': 'no-store' } },
      )
    }
  }

  try {
    const live = await fetchMerapiFromMagma({ force: true, timeoutMs: 20000 })
    if (!live) {
      return NextResponse.json(
        {
          ok: false,
          data: fallbackMerapiStatus('Cron fetch gagal'),
          at: new Date().toISOString(),
        },
        { status: 502, headers: { 'Cache-Control': 'no-store' } },
      )
    }

    return NextResponse.json(
      {
        ok: true,
        data: {
          level: live.level,
          roman: live.roman,
          source: live.source,
          updatedAt: live.updatedAt,
          fetchedAt: live.fetchedAt,
        },
        at: new Date().toISOString(),
        message: 'MAGMA status refreshed in process cache',
      },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch {
    return NextResponse.json(
      { ok: false, error: 'cron_failed', at: new Date().toISOString() },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
