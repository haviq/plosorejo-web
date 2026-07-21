export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function formatTanggal(iso: string, opts?: Intl.DateTimeFormatOptions) {
  const d = new Date(iso)
  return d.toLocaleDateString('id-ID', opts ?? {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function waLink(phone: string, text?: string) {
  const cleaned = phone.replace(/[^0-9]/g, '')
  const base = `https://wa.me/${cleaned}`
  if (!text) return base
  return `${base}?text=${encodeURIComponent(text)}`
}

export function isOpenNow(jamBuka: string, now = new Date()): boolean {
  const match = jamBuka.match(/(\d{1,2})[.:](\d{2})\s*[–\-—]\s*(\d{1,2})[.:](\d{2})/)
  if (!match) return false

  const [, h1, m1, h2, m2] = match
  const utc = now.getTime() + now.getTimezoneOffset() * 60_000
  const jkt = new Date(utc + 7 * 60 * 60_000)
  const minutes = jkt.getHours() * 60 + jkt.getMinutes()

  const open = Number(h1) * 60 + Number(m1)
  const close = Number(h2) * 60 + Number(m2)
  if (close <= open) return minutes >= open || minutes < close
  return minutes >= open && minutes < close
}
