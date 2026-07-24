/**
 * Server-only crypto helpers. Do NOT import from client components.
 */
import { timingSafeEqual } from 'crypto'

/** Timing-safe string compare for secrets (Node / Edge-compatible via Buffer). */
export function timingSafeEqualString(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ba.length !== bb.length) return false
  try {
    return timingSafeEqual(ba, bb)
  } catch {
    return false
  }
}
