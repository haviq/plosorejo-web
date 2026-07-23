'use client'

import { useEffect, useState } from 'react'

const TITLE = 'PADUKUHAN PLOSOREJO'
const TYPE_MS = 55
const HOLD_MS = 420
const EXIT_MS = 900

/**
 * Full-screen preloader:
 * - two curtains (gold + black) slide top → bottom
 * - letter-by-letter typing of PADUKUHAN PLOSOREJO
 * - then curtains slide away and unmount
 * Shown once per browser tab session.
 */
export default function SitePreloader() {
  const [visible, setVisible] = useState(false)
  const [phase, setPhase] = useState<'boot' | 'typing' | 'exit' | 'done'>('boot')
  const [typed, setTyped] = useState('')
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem('plosorejo-preloader') === '1') {
        setPhase('done')
        return
      }
    } catch {
      // private mode — still show once this mount
    }

    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReduceMotion(prefersReduce)
    setVisible(true)

    // lock scroll while preloader is up
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    if (prefersReduce) {
      setTyped(TITLE)
      setPhase('typing')
      const t = window.setTimeout(() => {
        setPhase('exit')
        window.setTimeout(() => {
          setPhase('done')
          setVisible(false)
          try {
            window.sessionStorage.setItem('plosorejo-preloader', '1')
          } catch {
            /* ignore */
          }
          document.body.style.overflow = prev
        }, 350)
      }, 500)
      return () => {
        window.clearTimeout(t)
        document.body.style.overflow = prev
      }
    }

    // brief curtain settle, then type
    const bootTimer = window.setTimeout(() => setPhase('typing'), 280)

    return () => {
      window.clearTimeout(bootTimer)
      document.body.style.overflow = prev
    }
  }, [])

  // typing effect
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

  // exit → done
  useEffect(() => {
    if (phase !== 'exit') return
    const t = window.setTimeout(() => {
      setPhase('done')
      setVisible(false)
      document.body.style.overflow = ''
      try {
        window.sessionStorage.setItem('plosorejo-preloader', '1')
      } catch {
        /* ignore */
      }
    }, EXIT_MS)
    return () => window.clearTimeout(t)
  }, [phase])

  if (!visible || phase === 'done') return null

  const exiting = phase === 'exit'

  return (
    <div
      className={`site-preloader${exiting ? ' site-preloader--exit' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Memuat Padukuhan Plosorejo"
    >
      {/* Layer 1 — black (back) */}
      <div className="site-preloader__layer site-preloader__layer--black" aria-hidden="true" />
      {/* Layer 2 — gold (front curtain) */}
      <div className="site-preloader__layer site-preloader__layer--gold" aria-hidden="true" />

      <div className="site-preloader__content">
        <p className="site-preloader__eyebrow">Portal Digital · Cangkringan</p>
        <h1 className="site-preloader__title" aria-label={TITLE}>
          {typed.split('').map((ch, i) => (
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
