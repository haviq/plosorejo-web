'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

type Phase = 'idle' | 'cover' | 'reveal'

const COVER_MS  = 420  // waktu panel menutup
const REVEAL_MS = 380  // waktu panel membuka setelah nav

const LABELS: Record<string, string> = {
  beranda: 'Beranda', berita: 'Berita', profil: 'Profil',
  layanan: 'Layanan', galeri: 'Galeri', peta: 'Peta',
  kontak: 'Kontak', kkn: 'KKN', susu: 'Susu',
  sektor: 'Sektor', agenda: 'Agenda', darurat: 'Darurat',
}

function labelFromPath(p: string) {
  if (p === '/') return 'Beranda'
  const slug = p.replace(/^\//, '').split('/')[0] || ''
  return LABELS[slug] || slug.charAt(0).toUpperCase() + slug.slice(1)
}

export default function RouteCurtain() {
  const pathname = usePathname() || ''
  const router   = useRouter()
  const [phase, setPhase] = useState<Phase>('idle')
  const [label, setLabel] = useState('')
  const prevPath = useRef(pathname)
  const busy     = useRef(false)
  const timers   = useRef<ReturnType<typeof setTimeout>[]>([])

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = [] }

  const done = () => {
    busy.current = false
    setPhase('idle')
    setLabel('')
    // Un-hide page content
    document.documentElement.removeAttribute('data-nav-pending')
  }

  // Pathname changed → start reveal phase
  useEffect(() => {
    if (prevPath.current === pathname) return
    prevPath.current = pathname
    if (!busy.current) return // first mount or manual nav

    // Start reveal
    clear()
    setPhase('reveal')
    timers.current.push(setTimeout(done, REVEAL_MS))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return
      if (document.getElementById('site-preloader-v16')) return

      const anchor = (e.target as Element)?.closest('a[href]') as HTMLAnchorElement | null
      if (!anchor) return

      const href = anchor.getAttribute('href') || ''
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return
      if (anchor.target === '_blank') return

      let url: URL
      try { url = new URL(href, location.href) } catch { return }

      // External or same-origin non-app paths
      if (url.origin !== location.origin) return
      if (url.pathname.startsWith('/studio') || url.pathname.startsWith('/admin')) return
      if (url.pathname === location.pathname) return

      // Intercept!
      e.preventDefault()
      e.stopPropagation()

      if (busy.current) return
      busy.current = true

      const nextLabel = labelFromPath(url.pathname)
      setLabel(nextLabel)

      // 1. Hide page content immediately via attribute
      document.documentElement.setAttribute('data-nav-pending', '1')

      // 2. Show curtain cover
      setPhase('cover')

      // 3. After curtain covers → navigate (React swap happens behind curtain)
      timers.current.push(
        setTimeout(() => {
          router.push(href)
          // reveal starts when pathname useEffect fires above
        }, COVER_MS)
      )

      // Failsafe — if pathname never changes
      timers.current.push(setTimeout(done, COVER_MS + REVEAL_MS + 800))
    }

    document.addEventListener('click', onClick, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      clear()
      done()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
