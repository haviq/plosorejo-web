'use client'

import { useEffect, useRef, useState } from 'react'

const LINE_1 = 'PADUKUHAN'
const LINE_2 = 'PLOSOREJO'
const FULL = `${LINE_1} ${LINE_2}`
const TYPE_MS = 42
const HOLD_MS = 720
const EXIT_MS = 780
/** Hard cap — never trap the user longer than this */
const MAX_MS = 3200
const STORAGE_KEY = 'plosorejo-preloader'

type Phase = 'boot' | 'typing' | 'exit' | 'done'

function alreadySeen(): boolean {
  if (typeof document === 'undefined') return false
  if (document.documentElement.getAttribute('data-preloader') === 'skip') return true
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function markSeen() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    /* private mode / blocked storage */
  }
  document.documentElement.setAttribute('data-preloader', 'skip')
}

function unlockScroll() {
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
  document.documentElement.removeAttribute('data-preloader')
  // re-apply skip so returning paint stays clean
  try {
    if (window.sessionStorage.getItem(STORAGE_KEY) === '1') {
      document.documentElement.setAttribute('data-preloader', 'skip')
    }
  } catch {
    /* ignore */
  }
}

/**
 * Full-screen preloader (gold + black, two-line title).
 * - Always in first paint (SSR HTML)
 * - Hard timeout + tap-to-skip so mobile never gets trapped
 * - Title is 2 lines so letter-spacing never wraps mid-word
 */
export default function SitePreloader() {
  const [phase, setPhase] = useState<Phase>('boot')
  const [typed, setTyped] = useState('')
  const [reduceMotion, setReduceMotion] = useState(false)
  const finished = useRef(false)

  const finish = (toExit: boolean) => {
    if (finished.current) return
    if (toExit) {
      setPhase('exit')
      return
    }
    finished.current = true
    markSeen()
    unlockScroll()
    setPhase('done')
  }

  // Boot + hard failsafe
  useEffect(() => {
    if (alreadySeen()) {
      finished.current = true
      setPhase('done')
      unlockScroll()
      return
    }

    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReduceMotion(prefersReduce)

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.documentElement.setAttribute('data-preloader', 'active')

    // Absolute failsafe — always release UI
    const hard = window.setTimeout(() => {
      finished.current = true
      markSeen()
      unlockScroll()
      setPhase('done')
    }, MAX_MS)

    if (prefersReduce) {
      setTyped(FULL)
      setPhase('typing')
      const t = window.setTimeout(() => setPhase('exit'), 700)
      return () => {
        window.clearTimeout(hard)
        window.clearTimeout(t)
      }
    }

    const bootTimer = window.setTimeout(() => setPhase('typing'), 260)
    return () => {
      window.clearTimeout(hard)
      window.clearTimeout(bootTimer)
    }
  }, [])

  // Typewriter across "PADUKUHAN PLOSOREJO"
  useEffect(() => {
    if (phase !== 'typing' || reduceMotion) return
    if (typed.length >= FULL.length) {
      const hold = window.setTimeout(() => setPhase('exit'), HOLD_MS)
      return () => window.clearTimeout(hold)
    }
    const t = window.setTimeout(() => {
      setTyped(FULL.slice(0, typed.length + 1))
    }, TYPE_MS)
    return () => window.clearTimeout(t)
  }, [phase, typed, reduceMotion])

  // Exit → unmount
  useEffect(() => {
    if (phase !== 'exit') return
    const t = window.setTimeout(() => finish(false), EXIT_MS)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  // Always unlock if component unmounts mid-flight
  useEffect(() => {
    return () => {
      unlockScroll()
    }
  }, [])

  if (phase === 'done') return null

  const exiting = phase === 'exit'
  // Boot/exit/reduced: full title. Typing: progressive.
  const display =
    typed || (phase === 'boot' || phase === 'exit' || reduceMotion ? FULL : '')

  // Split for two-line layout without mid-word wrap
  const spaceIdx = display.indexOf(' ')
  const line1 =
    spaceIdx === -1
      ? display
      : display.slice(0, Math.min(spaceIdx, LINE_1.length))
  // After space starts line 2; if still typing line 1, line2 empty
  const line2 =
    spaceIdx === -1
      ? ''
      : display.slice(spaceIdx + 1)

  const showCaret = phase === 'typing' && typed.length < FULL.length && !reduceMotion
  const caretOnLine1 = showCaret && spaceIdx === -1
  const caretOnLine2 = showCaret && spaceIdx !== -1

  return (
    <div
      id="site-preloader"
      className={`site-preloader${exiting ? ' site-preloader--exit' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Memuat Padukuhan Plosorejo"
      onClick={() => finish(phase !== 'exit')}
      onTouchEnd={(e) => {
        e.preventDefault()
        finish(phase !== 'exit')
      }}
    >
      <div className="site-preloader__layer site-preloader__layer--black" aria-hidden="true" />
      <div className="site-preloader__layer site-preloader__layer--gold" aria-hidden="true" />

      <div className="site-preloader__content">
        <p className="site-preloader__eyebrow">Portal Digital · Cangkringan</p>

        <h1 className="site-preloader__title" aria-label={FULL}>
          <span className="site-preloader__line-text">
            {line1.split('').map((ch, i) => (
              <span key={`a${i}`} className="site-preloader__char">
                {ch}
              </span>
            ))}
            {caretOnLine1 ? <span className="site-preloader__caret" aria-hidden="true" /> : null}
          </span>
          <span className="site-preloader__line-text">
            {line2.split('').map((ch, i) => (
              <span key={`b${i}`} className="site-preloader__char">
                {ch}
              </span>
            ))}
            {caretOnLine2 ? <span className="site-preloader__caret" aria-hidden="true" /> : null}
            {/* Keep second line height stable while typing line 1 */}
            {!line2 && !caretOnLine2 ? (
              <span className="site-preloader__line-placeholder" aria-hidden="true">
                {LINE_2}
              </span>
            ) : null}
          </span>
        </h1>

        <div className="site-preloader__rule" aria-hidden="true" />
        <p className="site-preloader__sub">Umbulharjo · Sleman · Lereng Merapi</p>
        <p className="site-preloader__hint">Ketuk untuk lanjut</p>
      </div>
    </div>
  )
}
