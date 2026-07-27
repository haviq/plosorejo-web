'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

type Phase = 'idle' | 'cover' | 'hold' | 'reveal'

const COVER_MS = 480   // waktu curtain menutup penuh
const HOLD_MS  = 60    // hold sebentar sebelum reveal
const REVEAL_MS = 360  // waktu curtain membuka

const LABELS: Record<string, string> = {
  beranda: 'Beranda',
  berita: 'Berita',
  profil: 'Profil',
  layanan: 'Layanan',
  galeri: 'Galeri',
  peta: 'Peta',
  kontak: 'Kontak',
  kkn: 'KKN',
  susu: 'Susu',
  sektor: 'Sektor',
  agenda: 'Agenda',
  darurat: 'Darurat',
}

function labelFromPath(pathname: string) {
  if (pathname === '/') return 'Beranda'
  const slug = pathname.replace(/^\//, '').split('/')[0] || ''
  return LABELS[slug] || slug.charAt(0).toUpperCase() + slug.slice(1)
}

export default function RouteCurtain() {
  const pathname = usePathname() || ''
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('idle')
  const [label, setLabel] = useState('')
  const firstMount = useRef(true)
  const busy = useRef(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const cycleId = useRef(0)

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  const finish = () => {
    busy.current = false
    setPhase('idle')
    setLabel('')
  }

  // Dipanggil saat link diklik — tunda navigasi sampai curtain cover
  const navigate = (href: string) => {
    if (busy.current) return
    if (document.getElementById('site-preloader-v16')) return

    const nextLabel = labelFromPath(new URL(href, location.href).pathname)
    busy.current = true
    const id = ++cycleId.current

    setLabel(nextLabel)
    setPhase('cover')

    // Setelah curtain cover selesai → navigasi → lalu reveal
    timers.current.push(
      setTimeout(() => {
        if (cycleId.current !== id) return
        setPhase('hold')
        // Navigate setelah curtain penuh menutup
        router.push(href)
      }, COVER_MS),
    )

    timers.current.push(
      setTimeout(() => {
        if (cycleId.current !== id) return
        setPhase('reveal')
      }, COVER_MS + HOLD_MS),
    )

    timers.current.push(
      setTimeout(() => {
        if (cycleId.current !== id) return
        finish()
      }, COVER_MS + HOLD_MS + REVEAL_MS),
    )

    // Failsafe
    timers.current.push(
      setTimeout(() => {
        if (cycleId.current !== id) return
        finish()
      }, 2200),
    )
  }

  // Intercept semua klik link internal
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return

      const anchor = (e.target as Element)?.closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')) return
      if (anchor.target === '_blank') return
      if (href.startsWith('/studio') || href.startsWith('/admin')) return

      // Sama dengan halaman sekarang? skip
      try {
        const url = new URL(href, location.href)
        if (url.pathname === location.pathname) return
      } catch { return }

      // Intercept — cegah navigasi default, jalankan curtain dulu
      e.preventDefault()
      e.stopPropagation()
      navigate(href)
    }

    document.addEventListener('click', onClick, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      clearTimers()
      finish()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Skip first mount (site preloader yang handle first load)
  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  if (phase === 'idle') return null

  return (
    <div
      className={`route-curtain route-curtain--${phase}`}
      aria-hidden="true"
      role="presentation"
    >
      <div className="route-curtain__panel route-curtain__panel--black" />
      <div className="route-curtain__panel route-curtain__panel--gold" />
      <div className="route-curtain__mark">
        <span className="route-curtain__brand">PLOSOREJO</span>
        {label ? <span className="route-curtain__label">{label}</span> : null}
      </div>
    </div>
  )
}
