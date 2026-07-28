import { NextResponse } from 'next/server'
import { clientIp, rateLimit, rateLimitHeaders } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
const ALLOWED_EXTS = ['.pdf', '.jpg', '.jpeg', '.png']

export async function POST(req: Request) {
  const ip = clientIp(req)
  const rl = rateLimit(`upload-file:${ip}`, { limit: 10, windowMs: 10 * 60_000 })
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'rate_limited' },
      { status: 429, headers: rateLimitHeaders(rl) },
    )
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET
  if (!cloudName || !uploadPreset) {
    return NextResponse.json(
      { ok: false, error: 'upload_not_configured' },
      { status: 503, headers: rateLimitHeaders(rl) },
    )
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json(
      { ok: false, error: 'invalid_form_data' },
      { status: 400, headers: rateLimitHeaders(rl) },
    )
  }

  const file = formData.get('file')
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: 'file_required' },
      { status: 400, headers: rateLimitHeaders(rl) },
    )
  }

  // Validate file size
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { ok: false, error: 'file_too_large', maxMB: 5 },
      { status: 413, headers: rateLimitHeaders(rl) },
    )
  }

  // Validate MIME type
  const mimeOk = ALLOWED_TYPES.includes(file.type)
  // Validate extension as secondary check
  const ext = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`
  const extOk = ALLOWED_EXTS.includes(ext)
  if (!mimeOk || !extOk) {
    return NextResponse.json(
      { ok: false, error: 'invalid_file_type', allowed: 'pdf, jpg, jpeg, png' },
      { status: 415, headers: rateLimitHeaders(rl) },
    )
  }

  // Build multipart payload for Cloudinary unsigned upload
  const cloudForm = new FormData()
  cloudForm.append('file', file)
  cloudForm.append('upload_preset', uploadPreset)
  cloudForm.append('folder', 'plosorejo/pengajuan')

  let cloudRes: Response
  try {
    cloudRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      { method: 'POST', body: cloudForm },
    )
  } catch {
    return NextResponse.json(
      { ok: false, error: 'upload_network_error' },
      { status: 502, headers: rateLimitHeaders(rl) },
    )
  }

  let cloudData: Record<string, unknown>
  try {
    cloudData = await cloudRes.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: 'upload_bad_response' },
      { status: 502, headers: rateLimitHeaders(rl) },
    )
  }

  if (!cloudRes.ok || !cloudData.secure_url) {
    const msg = typeof cloudData.error === 'object' && cloudData.error !== null
      ? String((cloudData.error as Record<string, unknown>).message ?? 'upload_failed')
      : 'upload_failed'
    return NextResponse.json(
      { ok: false, error: msg },
      { status: cloudRes.status || 500, headers: rateLimitHeaders(rl) },
    )
  }

  return NextResponse.json(
    {
      ok: true,
      url: cloudData.secure_url as string,
      publicId: cloudData.public_id as string,
    },
    { status: 200, headers: { 'Cache-Control': 'no-store', ...rateLimitHeaders(rl) } },
  )
}
