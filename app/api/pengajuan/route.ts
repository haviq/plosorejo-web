import { NextResponse } from 'next/server'
import { requestIsAdmin } from '@/lib/admin-auth'
import {
  createPengajuan,
  getPengajuan,
  listPengajuan,
  publicView,
  updatePengajuanStatus,
  type PengajuanStatus,
  STATUS_LABEL,
} from '@/lib/ops-store'
import { clientIp, rateLimit, rateLimitHeaders } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const STATUSES = Object.keys(STATUS_LABEL) as PengajuanStatus[]

export async function GET(req: Request) {
  const url = new URL(req.url)
  const kode = (url.searchParams.get('kode') || '').trim()
  const ip = clientIp(req)
  const rl = rateLimit(`pengajuan-get:${ip}`, { limit: 60, windowMs: 60_000 })
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'rate_limited' },
      { status: 429, headers: rateLimitHeaders(rl) },
    )
  }

  // Admin list
  if (url.searchParams.get('all') === '1') {
    if (!requestIsAdmin(req)) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
    }
    const items = listPengajuan()
    return NextResponse.json(
      { ok: true, items },
      { headers: { 'Cache-Control': 'no-store', ...rateLimitHeaders(rl) } },
    )
  }

  if (!kode) {
    return NextResponse.json({ ok: false, error: 'kode_required' }, { status: 400 })
  }

  const item = getPengajuan(kode)
  if (!item) {
    return NextResponse.json(
      { ok: false, error: 'not_found' },
      { status: 404, headers: { 'Cache-Control': 'no-store', ...rateLimitHeaders(rl) } },
    )
  }

  return NextResponse.json(
    { ok: true, item: publicView(item) },
    { headers: { 'Cache-Control': 'no-store', ...rateLimitHeaders(rl) } },
  )
}

export async function POST(req: Request) {
  const ip = clientIp(req)
  const rl = rateLimit(`pengajuan-post:${ip}`, { limit: 20, windowMs: 10 * 60_000 })
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'rate_limited' },
      { status: 429, headers: rateLimitHeaders(rl) },
    )
  }

  let body: Record<string, unknown> = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  // Admin status update
  if (body.action === 'update_status') {
    if (!requestIsAdmin(req)) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
    }
    const kode = String(body.kode || '').trim()
    const status = String(body.status || '') as PengajuanStatus
    if (!kode || !STATUSES.includes(status)) {
      return NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 })
    }
    const updated = updatePengajuanStatus(kode, status, body.adminNote ? String(body.adminNote) : undefined)
    if (!updated) {
      return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 })
    }
    return NextResponse.json(
      { ok: true, item: updated },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  }

  // Public create (from form)
  const nama = String(body.nama || '').trim()
  const nik = String(body.nik || '').replace(/\D/g, '')
  const layananId = String(body.layananId || '').slice(0, 64)
  const layananNama = String(body.layananNama || '').slice(0, 120)
  const rt = String(body.rt || '01').slice(0, 4)
  const keperluan = String(body.keperluan || '').trim()
  const telepon = body.telepon ? String(body.telepon).slice(0, 20) : undefined
  const catatan = body.catatan ? String(body.catatan).slice(0, 400) : undefined
  const preferredKode = body.kode ? String(body.kode).toUpperCase().slice(0, 16) : undefined

  if (nama.length < 3 || nik.length !== 16 || !layananNama || keperluan.length < 5) {
    return NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 })
  }

  const item = createPengajuan({
    layananId: layananId || 'lainnya',
    layananNama,
    nama,
    nik,
    rt,
    telepon,
    keperluan,
    catatan,
    kode: preferredKode,
  })

  return NextResponse.json(
    {
      ok: true,
      item: publicView(item),
      trackingUrl: `/layanan/status?kode=${encodeURIComponent(item.kode)}`,
    },
    { status: 201, headers: { 'Cache-Control': 'no-store', ...rateLimitHeaders(rl) } },
  )
}
