/** Shared site constants & helpers */

export const SITE_URL = 'https://plosorejo-web.vercel.app'

export function normalizeWa(input?: string | null): string {
  if (!input) return ''
  // Keep digits only; reject absurd lengths
  const digits = input.replace(/\D/g, '').slice(0, 18)
  if (!digits) return ''
  if (digits.startsWith('0')) return `62${digits.slice(1)}`
  if (digits.startsWith('62')) return digits
  // Local mobile without leading 0 (8xxxx) → assume ID
  if (digits.startsWith('8') && digits.length >= 9) return `62${digits}`
  return digits
}

/** Demo / sample numbers used in seed content — do not show as live contact */
export function isPlaceholderWa(input?: string | null): boolean {
  const wa = normalizeWa(input)
  if (!wa) return true
  // Sequential demo patterns: 6281234567890, 6281234560001, etc.
  if (/^628123456(789[0-9]|00\d{2})$/.test(wa)) return true
  if (/^62812(3456){1,2}\d*$/.test(wa) && wa.includes('123456')) return true
  return false
}

export function formatWaDisplay(input?: string | null): string {
  if (isPlaceholderWa(input)) return 'Belum diisi (admin)'
  const wa = normalizeWa(input)
  if (!wa) return '-'
  // 62812... -> +62 812-...
  if (wa.startsWith('62') && wa.length >= 10) {
    const rest = wa.slice(2)
    const a = rest.slice(0, 3)
    const b = rest.slice(3, 7)
    const c = rest.slice(7)
    return `+62 ${a}${b ? `-${b}` : ''}${c ? `-${c}` : ''}`
  }
  return `+${wa}`
}

export function waLink(number?: string | null, text?: string): string {
  if (isPlaceholderWa(number)) return '#'
  const wa = normalizeWa(number)
  // Indonesian mobile typically 10–15 digits with country code
  if (!wa || wa.length < 10 || wa.length > 16) return '#'
  const base = `https://wa.me/${wa}`
  if (!text) return base
  // Cap message size so we don't build huge URLs
  const safe = text.slice(0, 900)
  return `${base}?text=${encodeURIComponent(safe)}`
}

export function shareWhatsApp(url: string, title: string): string {
  const text = `${title.slice(0, 200)}\n${url}`.slice(0, 900)
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

export function shareFacebook(url: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
}

export function shareX(url: string, title: string): string {
  return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title.slice(0, 200))}`
}
