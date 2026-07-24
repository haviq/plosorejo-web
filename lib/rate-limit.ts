/**
 * Simple in-memory sliding window rate limiter for serverless warm instances.
 * Not a global edge limit — still blocks noisy single-instance abuse / scrapers.
 */

type Bucket = {
  count: number
  resetAt: number
}

const store = new Map<string, Bucket>()
const MAX_KEYS = 5000

function prune(now: number) {
  if (store.size < MAX_KEYS) return
  for (const [k, v] of store) {
    if (v.resetAt <= now) store.delete(k)
  }
  // hard cap: drop oldest-ish keys
  if (store.size >= MAX_KEYS) {
    let i = 0
    for (const k of store.keys()) {
      store.delete(k)
      if (++i > 500) break
    }
  }
}

export type RateLimitResult = {
  ok: boolean
  limit: number
  remaining: number
  resetAt: number
  retryAfterSec: number
}

export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now()
  prune(now)
  const existing = store.get(key)
  if (!existing || existing.resetAt <= now) {
    const resetAt = now + opts.windowMs
    store.set(key, { count: 1, resetAt })
    return {
      ok: true,
      limit: opts.limit,
      remaining: opts.limit - 1,
      resetAt,
      retryAfterSec: Math.ceil(opts.windowMs / 1000),
    }
  }
  existing.count += 1
  const remaining = Math.max(0, opts.limit - existing.count)
  const ok = existing.count <= opts.limit
  return {
    ok,
    limit: opts.limit,
    remaining,
    resetAt: existing.resetAt,
    retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
  }
}

/** Best-effort client IP behind Vercel / proxies */
export function clientIp(req: Request): string {
  const h = (name: string) => req.headers.get(name) || ''
  const xff = h('x-forwarded-for')
  if (xff) {
    const first = xff.split(',')[0]?.trim()
    if (first) return first.slice(0, 64)
  }
  const real = h('x-real-ip') || h('cf-connecting-ip') || h('x-vercel-forwarded-for')
  if (real) return real.split(',')[0].trim().slice(0, 64)
  return 'unknown'
}

export function rateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
    ...(result.ok ? {} : { 'Retry-After': String(result.retryAfterSec) }),
  }
}
