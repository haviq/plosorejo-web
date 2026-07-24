'use client'

import { useEffect, useMemo, useState } from 'react'

const KEY = 'plosorejo-preloader'
const CURTAIN_IN_MS = 600
const TYPE_CHAR_MS = 55
const HOLD_AFTER_TYPE_MS = 700
const EXIT_MS = 520
const FAILSAFE_MS = 4200

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
      {/* Reserve full line width so layout doesn't jump while typing */}
      <span className="site-preloader__line-placeholder" aria-hidden="true">
        {text}
      </span>
    </span>
  )
}

/**
 * First-visit auto curtain:
 * 1) slide top → bottom
 * 2) type title letter-by-letter
 * 3) slide bottom → top (exit upward)
 * React owns the node (no native removeChild) so hydration cannot resurrect it.
 */
export default function SitePreloader() {
  const [phase, setPhase] = useState<'show' | 'exit' | 'gone'>('show')
  const [typed, setTyped] = useState(0)
  const [typingReady, setTypingReady] = useState(false)

  const totalChars = LINE1.length + LINE2.length
  const line1Count = Math.min(typed, LINE1.length)
  const line2Count = Math.max(0, typed - LINE1.length)
  const typingDone = typed >= totalChars
  const caretOnLine1 = typingReady && !typingDone && typed < LINE1.length
  const caretOnLine2 = typingReady && !typingDone && typed >= LINE1.length

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

    // Failsafe: never block forever
    timers.push(window.setTimeout(() => finish(false), FAILSAFE_MS))

    if (reduced) {
      setTyped(totalChars)
      setTypingReady(true)
      timers.push(window.setTimeout(() => finish(true), 280))
      return () => {
        timers.forEach((id) => window.clearTimeout(id))
        if (typeInterval) window.clearInterval(typeInterval)
      }
    }

    // After curtain slides in, start typewriter
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

    // Manual skip: tap anywhere
    const onSkip = () => finish(false)
    const root = document.getElementById('site-preloader')
    root?.addEventListener('click', onSkip)
    root?.addEventListener('pointerdown', onSkip)

    return () => {
      timers.forEach((id) => window.clearTimeout(id))
      if (typeInterval) window.clearInterval(typeInterval)
      root?.removeEventListener('click', onSkip)
      root?.removeEventListener('pointerdown', onSkip)
    }
  }, [totalChars])

  if (phase === 'gone') return null

  return (
    <div
      id="site-preloader"
      className={`site-preloader${phase === 'exit' ? ' site-preloader--exit' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Memuat Padukuhan Plosorejo"
      data-preloader-phase={phase}
      onClick={() => {
        // React path for skip (native listener also set in effect)
        markSeen()
        unlockScroll()
        setPhase('exit')
        window.setTimeout(() => setPhase('gone'), EXIT_MS + 40)
      }}
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
