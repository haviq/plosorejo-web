export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function formatTanggal(iso: string, opts?: Intl.DateTimeFormatOptions) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('id-ID', opts ?? {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Parse "HH:MM–HH:MM" jam buka and check if currently open (WIB / Asia/Jakarta).
 */
export function isOpenNow(jamBuka: string, now = new Date()): boolean {
  const match = jamBuka.match(/(\d{1,2})[.:](\d{2})\s*[–\-—]\s*(\d{1,2})[.:](\d{2})/)
  if (!match) return false

  const [, h1, m1, h2, m2] = match
  // Prefer Intl Asia/Jakarta over manual UTC offset
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(now)
    const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0)
    const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0)
    const minutes = hour * 60 + minute
    const open = Number(h1) * 60 + Number(m1)
    const close = Number(h2) * 60 + Number(m2)
    if (close <= open) return minutes >= open || minutes < close
    return minutes >= open && minutes < close
  } catch {
    const utc = now.getTime() + now.getTimezoneOffset() * 60_000
    const jkt = new Date(utc + 7 * 60 * 60_000)
    const minutes = jkt.getHours() * 60 + jkt.getMinutes()
    const open = Number(h1) * 60 + Number(m1)
    const close = Number(h2) * 60 + Number(m2)
    if (close <= open) return minutes >= open || minutes < close
    return minutes >= open && minutes < close
  }
}

// Re-export site helpers so callers can import from one place if preferred
export { waLink, formatWaDisplay, normalizeWa } from '@/lib/site'
