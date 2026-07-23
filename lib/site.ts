/** Shared site constants & helpers */

export const SITE_URL = 'https://plosorejo-web.vercel.app'

export function normalizeWa(input?: string | null): string {
  if (!input) return ''
  const digits = input.replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('0')) return `62${digits.slice(1)}`
  if (digits.startsWith('62')) return digits
  return digits
}

export function formatWaDisplay(input?: string | null): string {
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
  const wa = normalizeWa(number)
  if (!wa) return '#'
  const base = `https://wa.me/${wa}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}

export function shareWhatsApp(url: string, title: string): string {
  const text = `${title}\n${url}`
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

export function shareFacebook(url: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
}

export function shareX(url: string, title: string): string {
  return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
}
