import { NextResponse } from 'next/server'
import { fetchMerapiFromMagma, fallbackMerapiStatus } from '@/lib/merapi'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * GET /api/cron/merapi
 * Optional scheduled refresh endpoint.
 * Protect with CRON_SECRET if set (Authorization: Bearer token).
 * Vercel cron: every 30 minutes via vercel.json
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get('authorization') || ''
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
    }
  }

  const live = await fetchMerapiFromMagma({ force: true, timeoutMs: 20000 })
  if (!live) {
    return NextResponse.json({
      ok: false,
      data: fallbackMerapiStatus('Cron fetch gagal'),
      at: new Date().toISOString(),
    })
  }

  return NextResponse.json({
    ok: true,
    data: live,
    at: new Date().toISOString(),
    message: 'MAGMA status refreshed in process cache',
  })
}
