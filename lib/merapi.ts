/**
 * Merapi status fetcher — hybrid source:
 * 1) MAGMA ESDM tingkat aktivitas (auto)
 * 2) Sanity override (manual, optional)
 *
 * Official page: https://magma.esdm.go.id/v1/gunung-api/tingkat-aktivitas
 */

export type MerapiLevel = 'Normal' | 'Waspada' | 'Siaga' | 'Awas'

export interface MerapiLiveStatus {
  level: MerapiLevel
  roman?: 'I' | 'II' | 'III' | 'IV'
  deskripsi: string
  updatedAt: string
  source: 'magma' | 'sanity' | 'fallback'
  sourceLabel: string
  reportUrl?: string
  officialUrl: string
  mountain: string
  fetchedAt: string
  rawLevelLabel?: string
}

export const MAGMA_TINGKAT_URL =
  'https://magma.esdm.go.id/v1/gunung-api/tingkat-aktivitas'

export const MAGMA_HOME_URL = 'https://magma.esdm.go.id'

const LEVEL_FROM_ROMAN: Record<string, MerapiLevel> = {
  I: 'Normal',
  II: 'Waspada',
  III: 'Siaga',
  IV: 'Awas',
}

const LEVEL_DESC: Record<MerapiLevel, string> = {
  Normal: 'Aktivitas vulkanik dalam batas normal (Level I). Tetap pantau info resmi.',
  Waspada: 'Peningkatan aktivitas terdeteksi (Level II). Waspada dan ikuti arahan BPPTKG/PVMBG.',
  Siaga:
    'Aktivitas tinggi / erupsi mungkin terjadi (Level III). Warga di zona bahaya mengikuti arahan resmi.',
  Awas: 'Bahaya tinggi (Level IV). Evakuasi / larangan masuk zona bahaya berlaku sesuai arahan resmi.',
}

/** Phrases that contradict a non-Normal level if used as the primary deskripsi */
const NORMALISH =
  /\b(batas normal|kondisi normal|aktivitas normal|dalam kondisi aman|tidak ada ancaman)\b/i

/**
 * Prefer MAGMA deskripsi; only keep CMS text as a side note when it does not
 * contradict the live level (e.g. "normal" while level is Siaga).
 */
export function mergeMerapiCopy(
  level: MerapiLevel,
  magmaDeskripsi?: string | null,
  cmsDeskripsi?: string | null,
): { deskripsi: string; note?: string } {
  const magma =
    (magmaDeskripsi || '').trim() ||
    LEVEL_DESC[level] ||
    LEVEL_DESC.Normal
  const cms = (cmsDeskripsi || '').trim()
  if (!cms) return { deskripsi: magma }

  // Manual-looking CMS copy that says "normal" while level is elevated → ignore for primary
  if (level !== 'Normal' && NORMALISH.test(cms)) {
    return { deskripsi: magma }
  }

  // Same / near-duplicate → keep magma only
  if (cms.toLowerCase() === magma.toLowerCase()) {
    return { deskripsi: magma }
  }

  // CMS is additive local note only
  return {
    deskripsi: magma,
    note: cms.length > 180 ? `${cms.slice(0, 180)}…` : cms,
  }
}

/** Simple in-memory cache for serverless warm instances */
let cache: { at: number; data: MerapiLiveStatus } | null = null
const CACHE_MS = 10 * 60 * 1000 // 10 minutes

function parseLevelLabel(text: string): { level: MerapiLevel; roman?: MerapiLiveStatus['roman']; raw: string } | null {
  const raw = text.replace(/\s+/g, ' ').trim()
  // Level III (Siaga) ...
  const m = raw.match(/Level\s+(I{1,3}|IV)\s*(?:\((Normal|Waspada|Siaga|Awas)\))?/i)
  if (m) {
    const romanKey = (m[1] || 'I').toUpperCase()
    const roman = (['I', 'II', 'III', 'IV'].includes(romanKey)
      ? romanKey
      : 'I') as NonNullable<MerapiLiveStatus['roman']>
    const fromRoman = LEVEL_FROM_ROMAN[roman] || 'Normal'
    const namedRaw = m[2]
    const named = (
      namedRaw && ['Normal', 'Waspada', 'Siaga', 'Awas'].includes(namedRaw)
        ? namedRaw
        : fromRoman
    ) as MerapiLevel
    return { level: named, roman, raw }
  }
  const lower = raw.toLowerCase()
  for (const lv of ['Awas', 'Siaga', 'Waspada', 'Normal'] as MerapiLevel[]) {
    if (lower.includes(lv.toLowerCase())) {
      const roman = ({ Normal: 'I', Waspada: 'II', Siaga: 'III', Awas: 'IV' } as const)[lv]
      return { level: lv, roman, raw }
    }
  }
  return null
}

/**
 * Parse MAGMA HTML table of volcanic alert levels.
 * Structure: rowspan level header rows, then mountain name rows.
 */
export function parseMagmaTingkatHtml(html: string): MerapiLiveStatus | null {
  // Strip scripts/styles
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')

  // Extract table rows roughly
  const trs = cleaned.match(/<tr[\s\S]*?<\/tr>/gi) || []
  let current: { level: MerapiLevel; roman?: MerapiLiveStatus['roman']; raw: string; desc: string } | null =
    null

  for (const tr of trs) {
    // Prefer first cell text for level headers
    const cells = [...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((m) => {
      const inner = m[1]
      const href = (inner.match(/href=["']([^"']+)["']/i) || [])[1]
      const text = inner
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
      return { text, href }
    })
    if (!cells.length) continue

    const first = cells[0].text
    const maybeLevel = parseLevelLabel(first)
    if (maybeLevel && /Level\s+(I{1,3}|IV)/i.test(first)) {
      // Description often continues in same cell after level name
      const descMatch = first
        .replace(/Level\s+(I{1,3}|IV)\s*(\((Normal|Waspada|Siaga|Awas)\))?/i, '')
        .trim()
      current = {
        level: maybeLevel.level,
        roman: maybeLevel.roman,
        raw: maybeLevel.raw,
        desc: descMatch || LEVEL_DESC[maybeLevel.level],
      }
      continue
    }

    // Mountain rows
    for (const cell of cells) {
      // Exact Merapi (not Marapi Sumatera)
      if (/\bMerapi\b/i.test(cell.text) && !/\bMarapi\b/i.test(cell.text.replace(/Merapi/gi, ''))) {
        // Marapi check: "Merapi - Daerah Istimewa Yogyakarta"
        if (!/Merapi/i.test(cell.text)) continue
        // Avoid false positive Marapi: if text is Marapi only
        if (/^Marapi\b/i.test(cell.text)) continue

        const isYogyaMerapi =
          /Merapi/i.test(cell.text) &&
          (/Yogyakarta|Jawa Tengah|DIY|Istimewa/i.test(cell.text) || !/Sumatera|Barat/i.test(cell.text))

        // Prefer Yogyakarta Merapi; if text just "Merapi - ..." with YK, take it
        if (!isYogyaMerapi && /Sumatera/i.test(cell.text)) continue

        if (!current) continue

        let reportUrl = cell.href
        if (reportUrl && reportUrl.startsWith('/')) {
          reportUrl = `https://magma.esdm.go.id${reportUrl}`
        }

        const now = new Date().toISOString()
        return {
          level: current.level,
          roman: current.roman,
          deskripsi: current.desc || LEVEL_DESC[current.level],
          updatedAt: now,
          source: 'magma',
          sourceLabel: 'MAGMA ESDM (PVMBG)',
          reportUrl,
          officialUrl: MAGMA_TINGKAT_URL,
          mountain: 'Gunung Merapi',
          fetchedAt: now,
          rawLevelLabel: current.raw,
        }
      }
    }
  }

  return null
}

export async function fetchMerapiFromMagma(options?: {
  force?: boolean
  timeoutMs?: number
}): Promise<MerapiLiveStatus | null> {
  const force = options?.force === true
  const timeoutMs = options?.timeoutMs ?? 12000

  if (!force && cache && Date.now() - cache.at < CACHE_MS) {
    return cache.data
  }

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    const res = await fetch(MAGMA_TINGKAT_URL, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'PlosorejoWeb/1.0 (+https://plosorejo-web.vercel.app; desa digital status widget)',
        Accept: 'text/html,application/xhtml+xml',
      },
      // Next.js fetch cache — revalidate every 15 minutes when used on server
      next: { revalidate: 900 },
    } as RequestInit & { next?: { revalidate: number } })
    clearTimeout(timer)

    if (!res.ok) {
      console.error('[merapi] MAGMA HTTP', res.status)
      return cache?.data ?? null
    }

    const html = await res.text()
    const parsed = parseMagmaTingkatHtml(html)
    if (parsed) {
      cache = { at: Date.now(), data: parsed }
      return parsed
    }
    console.error('[merapi] failed to parse Merapi row from MAGMA HTML')
    return cache?.data ?? null
  } catch (err) {
    console.error('[merapi] fetch error', err)
    return cache?.data ?? null
  }
}

export function fallbackMerapiStatus(reason = 'Data cadangan lokal'): MerapiLiveStatus {
  const now = new Date().toISOString()
  return {
    level: 'Normal',
    roman: 'I',
    deskripsi: `${reason}. Cek sumber resmi MAGMA untuk kepastian.`,
    updatedAt: now,
    source: 'fallback',
    sourceLabel: 'Fallback lokal',
    officialUrl: MAGMA_TINGKAT_URL,
    mountain: 'Gunung Merapi',
    fetchedAt: now,
  }
}

export function levelColor(level: MerapiLevel): { color: string; bg: string; border: string } {
  switch (level) {
    case 'Awas':
      return { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.35)' }
    case 'Siaga':
      return { color: '#f97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.35)' }
    case 'Waspada':
      return { color: '#eab308', bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.35)' }
    default:
      return { color: 'var(--gold)', bg: 'rgba(212,175,55,0.10)', border: 'var(--border)' }
  }
}
