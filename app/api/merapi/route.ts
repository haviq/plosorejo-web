import { NextResponse } from 'next/server'
import { fetchMerapiFromMagma, fallbackMerapiStatus, MAGMA_TINGKAT_URL } from '@/lib/merapi'
import { sanityFetch } from '@/sanity/lib/client'
import { merapiStatusQuery } from '@/sanity/lib/queries'
import { safeOfficialHref } from '@/lib/safe-url'
import { clientIp, rateLimit, rateLimitHeaders } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const ALLOWED_LEVELS = new Set(['Normal', 'Waspada', 'Siaga', 'Awas'])

type CmsMerapi = {
  level?: 'Normal' | 'Waspada' | 'Siaga' | 'Awas'
  deskripsi?: string
  updatedAt?: string
  manualOverride?: boolean
}

function sanitizeText(input?: string | null, max = 500): string | undefined {
  if (!input) return undefined
  const cleaned = input
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim()
  if (!cleaned) return undefined
  return cleaned.slice(0, max)
}

/**
 * GET /api/merapi
 * Live Merapi status (MAGMA auto + Sanity override).
 * Rate limited per IP:
 *  - normal: 60 req / minute
 *  - force=1: 10 req / minute
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const force = searchParams.get('force') === '1'
  const ip = clientIp(req)

  if (req.url.length > 2048) {
    return NextResponse.json({ ok: false, error: 'bad_request' }, { status: 400 })
  }

  const rl = rateLimit(`merapi:${force ? 'force' : 'std'}:${ip}`, {
    limit: force ? 10 : 60,
    windowMs: 60_000,
  })
  const rlHeaders = rateLimitHeaders(rl)

  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'rate_limited', retryAfter: rl.retryAfterSec },
      { status: 429, headers: rlHeaders },
    )
  }

  try {
    const cms = await sanityFetch<CmsMerapi | null>(merapiStatusQuery)

    if (cms?.manualOverride && cms.level && ALLOWED_LEVELS.has(cms.level)) {
      return NextResponse.json(
        {
          ok: true,
          data: {
            level: cms.level,
            deskripsi: sanitizeText(cms.deskripsi, 400) || 'Override admin',
            updatedAt: cms.updatedAt || new Date().toISOString(),
            source: 'sanity',
            sourceLabel: 'Override admin (Sanity)',
            officialUrl: MAGMA_TINGKAT_URL,
            mountain: 'Gunung Merapi',
          },
        },
        { headers: rlHeaders },
      )
    }

    const live = await fetchMerapiFromMagma({ force, timeoutMs: 15000 })
    if (live) {
      return NextResponse.json(
        {
          ok: true,
          data: {
            ...live,
            deskripsi: sanitizeText(cms?.deskripsi, 400) || live.deskripsi,
            reportUrl: safeOfficialHref(live.reportUrl) || undefined,
            officialUrl: safeOfficialHref(live.officialUrl) || MAGMA_TINGKAT_URL,
          },
        },
        { headers: rlHeaders },
      )
    }

    if (cms?.level && ALLOWED_LEVELS.has(cms.level)) {
      return NextResponse.json(
        {
          ok: true,
          data: {
            level: cms.level,
            deskripsi: sanitizeText(cms.deskripsi, 400) || 'Cadangan CMS',
            updatedAt: cms.updatedAt || new Date().toISOString(),
            source: 'sanity',
            sourceLabel: 'Cadangan CMS (MAGMA gagal)',
            officialUrl: MAGMA_TINGKAT_URL,
            mountain: 'Gunung Merapi',
          },
        },
        { headers: rlHeaders },
      )
    }

    return NextResponse.json({ ok: true, data: fallbackMerapiStatus() }, { headers: rlHeaders })
  } catch {
    return NextResponse.json(
      { ok: false, data: fallbackMerapiStatus('Layanan sementara terbatas'), error: 'fetch_failed' },
      { status: 200, headers: rlHeaders },
    )
  }
}
