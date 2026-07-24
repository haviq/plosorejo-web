/**
 * Secret comparison helpers.
 * Edge-safe (middleware) — no Node Buffer / crypto module.
 */

/** Constant-time-ish string compare for secrets (Edge + Node). */
export function secretsEqual(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  const enc = new TextEncoder()
  const ba = enc.encode(a)
  const bb = enc.encode(b)
  // Length leak is acceptable for auth tokens of fixed-ish size; still XOR full min length
  const len = Math.max(ba.length, bb.length)
  let out = ba.length === bb.length ? 0 : 1
  for (let i = 0; i < len; i++) {
    const x = i < ba.length ? ba[i] : 0
    const y = i < bb.length ? bb[i] : 0
    out |= x ^ y
  }
  return out === 0
}

/** @deprecated use secretsEqual — kept for Node callers */
export function timingSafeEqualString(a: string, b: string): boolean {
  return secretsEqual(a, b)
}
