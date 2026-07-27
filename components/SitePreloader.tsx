'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const KEY = 'plosorejo-preloader-v6'
const FAILSAFE_MS = 5000

function isSeen(): boolean {
  try {
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

export default function SitePreloader() {
  // SSR-safe: 'done' → returns null on server + first hydration
  // useEffect sets 'animating' only on client if not seen
  const [phase, setPhase] = useState<'animating' | 'done'>('done')
  const doneRef = useRef(false)

  const panelARef = useRef<HTMLDivElement>(null)
  const panelBRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const charsRef = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    if (isSeen()) return

    // Show overlay first — panels start OFF-SCREEN below (yPercent 105)
    // so showing them won't flash anything visible
    setPhase('animating')

    // Lock scroll
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const finish = () => {
      if (doneRef.current) return
      doneRef.current = true
      markSeen()
      setPhase('done')
      document.body.style.removeProperty('overflow')
      document.documentElement.style.removeProperty('overflow')
    }

    const failsafe = window.setTimeout(finish, FAILSAFE_MS)

    // Wait 2 rAF cycles so React finishes painting + refs attach
    let rafId1: number, rafId2: number
    rafId1 = requestAnimationFrame(() => {
      rafId2 = requestAnimationFrame(() => {
        const chars = charsRef.current.filter(Boolean)

        if (!panelARef.current || !panelBRef.current || !contentRef.current) {
          // DOM not ready, use finish as fallback
          finish()
          return
        }

        const tl = gsap.timeline({ onComplete: finish })

        // ── 1. Panels enter from BELOW → cover full screen ─────────────
        tl.fromTo(
          panelBRef.current,
          { yPercent: 105 },
          { yPercent: 0, duration: 0.7, ease: 'power3.inOut' },
          0,
        )
        tl.fromTo(
          panelARef.current,
          { yPercent: 105 },
          { yPercent: 0, duration: 0.7, ease: 'power3.inOut' },
          0.07,
        )

        // ── 2. Content fade in ──────────────────────────────────────────
        tl.fromTo(
          contentRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out' },
          0.8,
        )

        // ── 3. PLOSOREJO per-char wave stagger ─────────────────────────
        if (chars.length > 0) {
          tl.fromTo(
            chars,
            { opacity: 0, y: 18, scaleY: 0.8, filter: 'blur(8px)' },
            {
              opacity: 1,
              y: 0,
              scaleY: 1,
              filter: 'blur(0px)',
              duration: 0.5,
              ease: 'power2.out',
              stagger: 0.05,
            },
            0.85,
          )
        }

        // ── 4. Hold ─────────────────────────────────────────────────────
        tl.to({}, { duration: 0.75 }, '>')

        // ── 5. Content fade out ─────────────────────────────────────────
        tl.to(
          contentRef.current,
          { opacity: 0, y: -10, duration: 0.28, ease: 'power2.in' },
          '>',
        )

        // ── 6. Panels exit UPWARD ───────────────────────────────────────
        // Panel A goes first, B overlaps slightly behind
        tl.to(
          panelARef.current,
          { yPercent: -105, duration: 0.75, ease: 'power3.inOut' },
          '>-0.05',
        )
        tl.to(
          panelBRef.current,
          { yPercent: -105, duration: 0.75, ease: 'power3.inOut' },
          '<0.08',
        )
      })
    })

    return () => {
      window.clearTimeout(failsafe)
      cancelAnimationFrame(rafId1)
      cancelAnimationFrame(rafId2)
      gsap.killTweensOf([
        panelARef.current,
        panelBRef.current,
        contentRef.current,
        ...charsRef.current,
      ])
    }
  }, [])

  if (phase === 'done') return null

  const chars = 'PLOSOREJO'.split('')

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        // overflow hidden so panels sliding from below don't show scrollbar
        overflow: 'hidden',
      }}
    >
      {/* Panel B — dark background (enters first, slightly faster) */}
      <div
        ref={panelBRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: '#090807',
          // Start below viewport
          transform: 'translateY(105%)',
          willChange: 'transform',
        }}
      />

      {/* Panel A — dark gold tinted (enters 70ms after B) */}
      <div
        ref={panelARef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          background: [
            'radial-gradient(ellipse 80% 50% at 50% 45%, rgba(212,175,55,0.18) 0%, transparent 70%)',
            'linear-gradient(160deg, #0d0b07 0%, #131008 100%)',
          ].join(', '),
          // Start below viewport
          transform: 'translateY(105%)',
          willChange: 'transform',
        }}
      />

      {/* Content — sits above both panels, centered */}
      <div
        ref={contentRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          pointerEvents: 'none',
          textAlign: 'center',
          padding: '0 2rem',
          gap: '0.15rem',
        }}
      >
        {/* Eyebrow */}
        <p
          style={{
            fontSize: '0.64rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: '#d4af37',
            marginBottom: '0.6rem',
          }}
        >
          Padukuhan Plosorejo · Cangkringan
        </p>

        {/* PLOSOREJO per-char */}
        <h1
          style={{
            fontFamily: 'var(--font-syne, sans-serif)',
            fontSize: 'clamp(2.4rem, 13vw, 3.4rem)',
            fontWeight: 800,
            letterSpacing: '0.1em',
            color: '#f5f0e8',
            lineHeight: 1,
            margin: 0,
          }}
        >
          {chars.map((ch, i) => (
            <span
              key={i}
              ref={(el) => { if (el) charsRef.current[i] = el }}
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

        {/* Sub */}
        <p
          style={{
            fontSize: '0.58rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'rgba(245,240,232,0.48)',
            marginTop: '0.55rem',
          }}
        >
          Umbulharjo · Sleman · Lereng Merapi
        </p>
      </div>
    </div>
  )
}
