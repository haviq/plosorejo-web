'use client'

import { useEffect, useState } from 'react'

const TITLE = 'PADUKUHAN PLOSOREJO'
const TYPE_MS = 48
const HOLD_MS = 700
const EXIT_MS = 950
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

/**
 * Full-screen preloader (gold + black curtains + typewriter).
 * Markup is always in the first client paint so mobile never skips it.
 * Returning tabs are skipped via inline boot script (data-preloader=skip).
 */
export default function SitePreloader() {
  // Always start as 'boot' so SSR HTML matches client hydrate (no mismatch).
  // Returning tabs are hidden pre-paint via html[data-preloader=skip] + boot script.
  const [phase, setPhase] = useState<Phase>('boot')
  const [typed, setTyped] = useState('')
  const [reduceMotion, setReduceMotion] = useState(false)

  // Resolve once on mount — hide immediately if already seen this session
  useEffect(() => {
    if (alreadySeen()) {
      setPhase('done')
      return
    }

    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReduceMotion(prefersReduce)

    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.setAttribute('data-preloader', 'active')

    if (prefersReduce) {
      setTyped(TITLE)
      setPhase('typing')
      const t = window.setTimeout(() => setPhase('exit'), 650)
      return () => {
        window.clearTimeout(t)
        document.body.style.overflow = prev
      }
    }

    const bootTimer = window.setTimeout(() => setPhase('typing'), 320)
    return () => {
      window.clearTimeout(bootTimer)
      document.body.style.overflow = prev
    }
  }, [])

  // Typewriter
  useEffect(() => {
    if (phase !== 'typing' || reduceMotion) return
    if (typed.length >= TITLE.length) {
      const hold = window.setTimeout(() => setPhase('exit'), HOLD_MS)
      return () => window.clearTimeout(hold)
    }
    const t = window.setTimeout(() => {
      setTyped(TITLE.slice(0, typed.length + 1))
    }, TYPE_MS)
    return () => window.clearTimeout(t)
  }, [phase, typed, reduceMotion])

  // Exit → done
  useEffect(() => {
    if (phase !== 'exit') return
    const t = window.setTimeout(() => {
      setPhase('done')
      markSeen()
      document.body.style.overflow = ''
    }, EXIT_MS)
    return () => window.clearTimeout(t)
  }, [phase])

  // Skip paint entirely when already seen
  if (phase === 'done') return null

  const exiting = phase === 'exit'
  // During SSR/boot show full title so first paint is never empty gold/black void
  const display =
    typed ||
    (phase === 'boot' || phase === 'exit' || reduceMotion ? TITLE : '')

  return (
    <div
      id="site-preloader"
      className={`site-preloader${exiting ? ' site-preloader--exit' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Memuat Padukuhan Plosorejo"
    >
      <div className="site-preloader__layer site-preloader__layer--black" aria-hidden="true" />
      <div className="site-preloader__layer site-preloader__layer--gold" aria-hidden="true" />

      <div className="site-preloader__content">
        <p className="site-preloader__eyebrow">Portal Digital · Cangkringan</p>
        <h1 className="site-preloader__title" aria-label={TITLE}>
          {display.split('').map((ch, i) => (
            <span
              key={`${ch}-${i}`}
              className={`site-preloader__char${ch === ' ' ? ' site-preloader__char--space' : ''}`}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          ))}
          {phase === 'typing' && typed.length < TITLE.length ? (
            <span className="site-preloader__caret" aria-hidden="true" />
          ) : null}
        </h1>
        <div className="site-preloader__line" aria-hidden="true" />
        <p className="site-preloader__sub">Umbulharjo · Sleman · Lereng Merapi</p>
      </div>
    </div>
  )
}
