import { NextResponse } from 'next/server'
import { fetchMerapiFromMagma, fallbackMerapiStatus, MAGMA_TINGKAT_URL } from '@/lib/merapi'
import { sanityFetch } from '@/sanity/lib/client'
import { merapiStatusQuery } from '@/sanity/lib/queries'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * GET /api/merapi
 * Live Merapi status (MAGMA auto + Sanity override).
 * Optional: ?force=1 to bypass short cache.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const force = searchParams.get('force') === '1'

  try {
    const cms = await sanityFetch<{
      level?: 'Normal' | 'Waspada' | 'Siaga' | 'Awas'
      deskripsi?: string
      updatedAt?: string
      manualOverride?: boolean
    } | null>(merapiStatusQuery)

    if (cms?.manualOverride && cms.level) {
      return NextResponse.json({
        ok: true,
        data: {
          level: cms.level,
          deskripsi: cms.deskripsi,
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
          deskripsi: cms?.deskripsi?.trim() ? cms.deskripsi : live.deskripsi,
        },
      })
    }

    if (cms?.level) {
      return NextResponse.json({
        ok: true,
        data: {
          level: cms.level,
          deskripsi: cms.deskripsi || 'Cadangan CMS',
          updatedAt: cms.updatedAt || new Date().toISOString(),
          source: 'sanity',
          sourceLabel: 'Cadangan CMS (MAGMA gagal)',
          officialUrl: MAGMA_TINGKAT_URL,
          mountain: 'Gunung Merapi',
        },
      })
    }

    return NextResponse.json({ ok: true, data: fallbackMerapiStatus() })
  } catch (err) {
    console.error('[api/merapi]', err)
    return NextResponse.json(
      { ok: false, data: fallbackMerapiStatus('Error server'), error: 'fetch_failed' },
      { status: 200 },
    )
  }
}
