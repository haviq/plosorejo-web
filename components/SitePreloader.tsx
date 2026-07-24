'use client'

import { useEffect, useState } from 'react'

const KEY = 'plosorejo-preloader'
const HOLD_MS = 650
const EXIT_MS = 420
const FAILSAFE_MS = 1500

function isSeen(): boolean {
  try {
    if (document.documentElement.getAttribute('data-preloader') === 'skip') return true
  } catch {
    /* ignore */
  }
  try {
    if (sessionStorage.getItem(KEY) === '1') return true
  } catch {
    /* ignore */
  }
  try {
    if (localStorage.getItem(KEY) === '1') return true
  } catch {
    /* ignore */
  }
  return false
}

function markSeen() {
  try {
    sessionStorage.setItem(KEY, '1')
  } catch {
    /* ignore */
  }
  try {
    localStorage.setItem(KEY, '1')
  } catch {
    /* ignore */
  }
  try {
    document.documentElement.setAttribute('data-preloader', 'skip')
  } catch {
    /* ignore */
  }
}

function unlockScroll() {
  try {
    document.body.style.removeProperty('overflow')
    document.documentElement.style.removeProperty('overflow')
  } catch {
    /* ignore */
  }
}

/**
 * First-visit auto curtain. React owns the node (no native removeChild)
 * so hydration cannot resurrect a stuck overlay that blocks the navbar.
 */
export default function SitePreloader() {
  // SSR + first client paint: show markup (CSS hides if data-preloader=skip)
  const [phase, setPhase] = useState<'show' | 'exit' | 'gone'>('show')

  useEffect(() => {
    if (isSeen()) {
      markSeen()
      unlockScroll()
      setPhase('gone')
      return
    }

    let reduced = false
    try {
      reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    } catch {
      /* ignore */
    }

    document.documentElement.setAttribute('data-preloader', 'active')
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    let finished = false
    const timers: number[] = []

    const finish = (instant: boolean) => {
      if (finished) return
      finished = true
      markSeen()
      unlockScroll()
      if (instant) {
        setPhase('gone')
        return
      }
      setPhase('exit')
      timers.push(
        window.setTimeout(() => {
          setPhase('gone')
        }, EXIT_MS + 40),
      )
    }

    if (reduced) {
      timers.push(window.setTimeout(() => finish(true), 250))
    } else {
      timers.push(window.setTimeout(() => finish(false), HOLD_MS + 500))
      timers.push(window.setTimeout(() => finish(true), FAILSAFE_MS))
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') finish(false)
    }
    document.addEventListener('keydown', onKey, true)

    return () => {
      timers.forEach((id) => window.clearTimeout(id))
      document.removeEventListener('keydown', onKey, true)
      unlockScroll()
    }
  }, [])

  if (phase === 'gone') return null

  return (
    <div
      id="site-preloader"
      className={`site-preloader site-preloader--auto${phase === 'exit' ? ' site-preloader--exit' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Memuat Padukuhan Plosorejo"
      onClick={() => {
        markSeen()
        unlockScroll()
        setPhase('exit')
        window.setTimeout(() => setPhase('gone'), EXIT_MS + 40)
      }}
    >
      <div className="site-preloader__layer site-preloader__layer--black" aria-hidden="true" />
      <div className="site-preloader__layer site-preloader__layer--gold" aria-hidden="true" />
      <div className="site-preloader__content">
        <p className="site-preloader__eyebrow">Portal Digital · Cangkringan</p>
        <h1 className="site-preloader__title" aria-label="PADUKUHAN PLOSOREJO">
          <span className="site-preloader__line-text">PADUKUHAN</span>
          <span className="site-preloader__line-text">PLOSOREJO</span>
        </h1>
        <div className="site-preloader__rule" aria-hidden="true" />
        <p className="site-preloader__sub">Umbulharjo · Sleman · Lereng Merapi</p>
        <p className="site-preloader__hint">Membuka portal…</p>
      </div>
    </div>
  )
}
