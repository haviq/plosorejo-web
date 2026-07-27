'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const KEY = 'plosorejo-preloader-v3'
const FAILSAFE_MS = 3200

function isSeen(): boolean {
  try {
    if (typeof window === 'undefined') return true
    if (document.documentElement.getAttribute('data-preloader') === 'skip') return true
    if (sessionStorage.getItem(KEY) === '1') return true
    if (localStorage.getItem(KEY) === '1') return true
  } catch {}
  return false
}

function markSeen() {
  try {
    sessionStorage.setItem(KEY, '1')
    localStorage.setItem(KEY, '1')
    document.documentElement.setAttribute('data-preloader', 'skip')
  } catch {}
}

/**
 * GSAP-powered preloader: dual curtain (top+bottom) → typewriter PLOSOREJO → exit upward.
 * Much smoother than CSS-only — GSAP handles stagger, ease, and sequencing.
 */
export default function SitePreloader() {
  const [phase, setPhase] = useState<'idle' | 'animating' | 'done'>('done')
  const doneRef = useRef(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const charsRef = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    if (isSeen()) {
      setPhase('done')
      return
    }

    // Lock scroll during preloader
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const tl = gsap.timeline({
      onComplete: () => {
        markSeen()
        setPhase('done')
        document.body.style.removeProperty('overflow')
        document.documentElement.style.removeProperty('overflow')
      },
    })

    setPhase('animating')

    // 1. Curtains slide down from top (cover screen)
    tl.fromTo(
      [topRef.current, bottomRef.current],
      { yPercent: -105 },
      {
        yPercent: 0,
        duration: 0.72,
        ease: 'power3.inOut',
        stagger: 0.08, // bottom slightly after top
      },
      0,
    )

    // 2. Content fade in (eyebrow + title placeholder)
    tl.fromTo(
      contentRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.42, ease: 'power2.out' },
      0.5,
    )

    // 3. Typewriter reveal: stagger each char with bounce
    tl.fromTo(
      charsRef.current,
      { opacity: 0, y: 18, rotationX: -45 },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.22,
        ease: 'back.out(1.4)',
        stagger: 0.045, // per-char delay
      },
      1.1,
    )

    // 4. Hold for a beat
    tl.to({}, { duration: 0.65 }, '>')

    // 5. Content fade out
    tl.to(contentRef.current, { opacity: 0, y: -12, duration: 0.32, ease: 'power2.in' }, '>')

    // 6. Curtains slide up (reveal site)
    tl.to(
      [bottomRef.current, topRef.current],
      {
        yPercent: -105,
        duration: 0.68,
        ease: 'power3.inOut',
        stagger: 0.06,
      },
      '>-0.1',
    )

    // Failsafe: force done after timeout
    const failsafe = window.setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true
        markSeen()
        setPhase('done')
        document.body.style.removeProperty('overflow')
        document.documentElement.style.removeProperty('overflow')
      }
    }, FAILSAFE_MS)

    return () => {
      window.clearTimeout(failsafe)
      tl.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (phase === 'done') return null

  const text = 'PLOSOREJO'
  const chars = text.split('')

  return (
    <div
      ref={rootRef}
      className="site-preloader"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        pointerEvents: 'auto',
        isolation: 'isolate',
      }}
      aria-hidden="false"
    >
      {/* Top curtain (gold) */}
      <div
        ref={topRef}
        className="site-preloader__layer site-preloader__layer--gold"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
          zIndex: 1,
          transform: 'translate3d(0, -105%, 0)',
        }}
      />

      {/* Bottom curtain (black) */}
      <div
        ref={bottomRef}
        className="site-preloader__layer site-preloader__layer--black"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: '#0a0a0a',
          zIndex: 1,
          transform: 'translate3d(0, -105%, 0)',
        }}
      />

      {/* Content overlay */}
      <div
        ref={contentRef}
        className="site-preloader__content"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          pointerEvents: 'none',
          color: '#ecfdf5',
          textAlign: 'center',
          padding: '0 1.5rem',
          opacity: 0,
        }}
      >
        <p
          className="site-preloader__eyebrow"
          style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: '#d4af37',
            marginBottom: '0.75rem',
          }}
        >
          Padukuhan Plosorejo · Cangkringan
        </p>

        <h1
          className="site-preloader__title"
          style={{
            fontFamily: 'var(--font-syne), sans-serif',
            fontSize: 'clamp(1.85rem, 10vw, 2.85rem)',
            fontWeight: 800,
            letterSpacing: '0.08em',
            lineHeight: 1.1,
            color: '#ecfdf5',
          }}
        >
          {chars.map((ch, i) => (
            <span
              key={i}
              ref={(el) => {
                if (el) charsRef.current[i] = el
              }}
              style={{
                display: 'inline-block',
                opacity: 0,
                transformOrigin: '50% 100%',
              }}
            >
              {ch}
            </span>
          ))}
        </h1>

        <p
          className="site-preloader__sub"
          style={{
            fontSize: '0.65rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'rgba(236,253,245,0.62)',
            marginTop: '0.55rem',
          }}
        >
          Umbulharjo · Sleman · Lereng Merapi
        </p>
      </div>
    </div>
  )
}
