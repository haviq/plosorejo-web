import { NextResponse } from 'next/server'
import { fetchMerapiFromMagma, fallbackMerapiStatus, MAGMA_TINGKAT_URL } from '@/lib/merapi'
import { sanityFetch } from '@/sanity/lib/client'
import { merapiStatusQuery } from '@/sanity/lib/queries'
import { safeOfficialHref } from '@/lib/safe-url'

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
  // Strip control chars / HTML-ish tags from CMS free text
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
 * Public read-only JSON for the site widget.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const force = searchParams.get('force') === '1'

  // Reject oversized query abuse
  if (req.url.length > 2048) {
    return NextResponse.json({ ok: false, error: 'bad_request' }, { status: 400 })
  }

  try {
    const cms = await sanityFetch<CmsMerapi | null>(merapiStatusQuery)

    if (cms?.manualOverride && cms.level && ALLOWED_LEVELS.has(cms.level)) {
      return NextResponse.json({
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
      })
    }

    const live = await fetchMerapiFromMagma({ force, timeoutMs: 15000 })
    if (live) {
      return NextResponse.json({
        ok: true,
        data: {
          ...live,
          deskripsi: sanitizeText(cms?.deskripsi, 400) || live.deskripsi,
          reportUrl: safeOfficialHref(live.reportUrl) || undefined,
          officialUrl: safeOfficialHref(live.officialUrl) || MAGMA_TINGKAT_URL,
        },
      })
    }

    if (cms?.level && ALLOWED_LEVELS.has(cms.level)) {
      return NextResponse.json({
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
      })
    }

    return NextResponse.json({ ok: true, data: fallbackMerapiStatus() })
  } catch {
    // Never leak stack / internal error details to clients
    return NextResponse.json(
      { ok: false, data: fallbackMerapiStatus('Layanan sementara terbatas'), error: 'fetch_failed' },
      { status: 200 },
    )
  }
}
