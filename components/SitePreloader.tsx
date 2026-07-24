'use client'

import { useEffect, useMemo, useState } from 'react'

const KEY = 'plosorejo-preloader'
// Keep intro short so header controls are usable almost immediately
const CURTAIN_IN_MS = 280
const TYPE_CHAR_MS = 28
const HOLD_AFTER_TYPE_MS = 280
const EXIT_MS = 360
const FAILSAFE_MS = 1600

const EYEBROW = 'Portal Digital · Cangkringan'
const LINE1 = 'PADUKUHAN'
const LINE2 = 'PLOSOREJO'
const SUB = 'Umbulharjo · Sleman · Lereng Merapi'
const HINT = 'Membuka portal…'

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

function TypeLine({
  text,
  visibleCount,
  showCaret,
  className = '',
}: {
  text: string
  visibleCount: number
  showCaret: boolean
  className?: string
}) {
  const chars = useMemo(() => text.split(''), [text])
  const n = Math.max(0, Math.min(visibleCount, chars.length))

  return (
    <span className={`site-preloader__line-text ${className}`.trim()}>
      <span className="site-preloader__typed" aria-hidden={visibleCount === 0}>
        {chars.slice(0, n).map((ch, i) => (
          <span key={`${ch}-${i}`} className="site-preloader__char">
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
        {showCaret ? <span className="site-preloader__caret" aria-hidden="true" /> : null}
      </span>
      <span className="site-preloader__line-placeholder" aria-hidden="true">
        {text}
      </span>
    </span>
  )
}

/**
 * First-visit auto curtain (visual only — never blocks header taps).
 * pointer-events: none so ☰ / theme work during the intro.
 */
export default function SitePreloader() {
  // If boot script already marked skip, never paint a blocking overlay
  const [phase, setPhase] = useState<'show' | 'exit' | 'gone'>(() => {
    if (typeof document !== 'undefined') {
      try {
        if (document.documentElement.getAttribute('data-preloader') === 'skip') return 'gone'
        if (sessionStorage.getItem(KEY) === '1') return 'gone'
        if (localStorage.getItem(KEY) === '1') return 'gone'
      } catch {
        /* ignore */
      }
    }
    return 'show'
  })
  const [typed, setTyped] = useState(0)
  const [typingReady, setTypingReady] = useState(false)

  const totalChars = LINE1.length + LINE2.length
  const line1Count = Math.min(typed, LINE1.length)
  const line2Count = Math.max(0, typed - LINE1.length)
  const typingDone = typed >= totalChars
  const caretOnLine1 = typingReady && !typingDone && typed < LINE1.length
  const caretOnLine2 = typingReady && !typingDone && typed >= LINE1.length

  useEffect(() => {
    if (isSeen() || phase === 'gone') {
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
    // Do NOT lock body overflow — that can feel like a frozen UI on mobile WebView
    // document.body.style.overflow = 'hidden'

    let finished = false
    const timers: number[] = []
    let typeInterval = 0

    const finish = (instant: boolean) => {
      if (finished) return
      finished = true
      if (typeInterval) window.clearInterval(typeInterval)
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

    timers.push(window.setTimeout(() => finish(false), FAILSAFE_MS))

    if (reduced) {
      setTyped(totalChars)
      setTypingReady(true)
      timers.push(window.setTimeout(() => finish(true), 120))
      return () => {
        timers.forEach((id) => window.clearTimeout(id))
        if (typeInterval) window.clearInterval(typeInterval)
      }
    }

    timers.push(
      window.setTimeout(() => {
        setTypingReady(true)
        let i = 0
        typeInterval = window.setInterval(() => {
          i += 1
          setTyped(i)
          if (i >= totalChars) {
            window.clearInterval(typeInterval)
            typeInterval = 0
            timers.push(window.setTimeout(() => finish(false), HOLD_AFTER_TYPE_MS))
          }
        }, TYPE_CHAR_MS)
      }, CURTAIN_IN_MS),
    )

    // Tap anywhere on page (except header) can skip — handled via capture on document
    const onSkip = (e: Event) => {
      const t = e.target as Element | null
      if (t?.closest?.('.site-header, [data-theme-toggle], [data-nav-hamburger]')) return
      finish(false)
    }
    document.addEventListener('pointerdown', onSkip, true)

    return () => {
      timers.forEach((id) => window.clearTimeout(id))
      if (typeInterval) window.clearInterval(typeInterval)
      document.removeEventListener('pointerdown', onSkip, true)
    }
  }, [phase, totalChars])

  if (phase === 'gone') return null

  return (
    <div
      id="site-preloader"
      className={`site-preloader${phase === 'exit' ? ' site-preloader--exit' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Memuat Padukuhan Plosorejo"
      data-preloader-phase={phase}
      // Never capture taps — header must stay interactive during intro
      style={{ pointerEvents: 'none' }}
    >
      <div className="site-preloader__layer site-preloader__layer--black" aria-hidden="true" />
      <div className="site-preloader__layer site-preloader__layer--gold" aria-hidden="true" />
      <div className="site-preloader__content">
        <p className="site-preloader__eyebrow">{EYEBROW}</p>
        <h1 className="site-preloader__title" aria-label={`${LINE1} ${LINE2}`}>
          <TypeLine text={LINE1} visibleCount={line1Count} showCaret={caretOnLine1} />
          <TypeLine text={LINE2} visibleCount={line2Count} showCaret={caretOnLine2} />
        </h1>
        <div className="site-preloader__rule" aria-hidden="true" />
        <p className="site-preloader__sub">{SUB}</p>
        <p className="site-preloader__hint">{HINT}</p>
      </div>
    </div>
  )
}
