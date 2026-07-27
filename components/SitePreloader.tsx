'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const KEY = 'plosorejo-preloader-v5'
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

/**
 * GSAP dual-curtain preloader:
 * 1. Panel A (gold) + B (black) enter from BELOW  (translateY 105%→0)
 * 2. Per-char wave reveal "PLOSOREJO" (translateY + blur + scaleY stagger)
 * 3. Hold
 * 4. Both panels exit UPWARD (translateY 0→-105%)
 *
 * SSR-safe: phase starts 'done' → renders null → useEffect flips to 'animating'
 */
export default function SitePreloader() {
  const [phase, setPhase] = useState<'animating' | 'done'>('done')
  const doneRef = useRef(false)

  const panelARef = useRef<HTMLDivElement>(null)
  const panelBRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const charsRef = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    if (isSeen()) return

    // Lock scroll
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    // Show overlay
    setPhase('animating')

    const finish = () => {
      if (doneRef.current) return
      doneRef.current = true
      markSeen()
      setPhase('done')
      document.body.style.removeProperty('overflow')
      document.documentElement.style.removeProperty('overflow')
    }

    const failsafe = window.setTimeout(finish, FAILSAFE_MS)

    // Small delay so DOM refs attach after setPhase('animating') re-render
    const startTimer = window.setTimeout(() => {
      const chars = charsRef.current.filter(Boolean)

      const tl = gsap.timeline({ onComplete: finish })

      // ── 1. Panels enter from BELOW ─────────────────────────────────────
      // Panel B first (no stagger), Panel A staggered +0.08s
      tl.fromTo(
        panelBRef.current,
        { yPercent: 105 },
        { yPercent: 0, duration: 0.72, ease: 'power3.inOut' },
        0,
      )
      tl.fromTo(
        panelARef.current,
        { yPercent: 105 },
        { yPercent: 0, duration: 0.72, ease: 'power3.inOut' },
        0.08,
      )

      // ── 2. Content fade in after panels settle ─────────────────────────
      tl.fromTo(
        contentRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
        0.85,
      )

      // ── 3. Per-char wave reveal (all chars rendered, CSS-like stagger) ──
      // Wait for panel enter to fully finish before chars appear
      tl.fromTo(
        chars,
        { opacity: 0, y: 14, scaleY: 0.85, filter: 'blur(6px)' },
        {
          opacity: 1,
          y: 0,
          scaleY: 1,
          filter: 'blur(0px)',
          duration: 0.55,
          ease: 'power2.out',
          stagger: 0.048,
        },
        0.9,
      )

      // ── 4. Hold ─────────────────────────────────────────────────────────
      tl.to({}, { duration: 0.72 }, '>')

      // ── 5. Content fade out ──────────────────────────────────────────────
      tl.to(
        contentRef.current,
        { opacity: 0, y: -8, duration: 0.3, ease: 'power2.in' },
        '>',
      )

      // ── 6. Panels exit UPWARD ────────────────────────────────────────────
      // Panel A exits first, Panel B staggered +0.12s
      tl.to(
        panelARef.current,
        { yPercent: -105, duration: 0.78, ease: 'power3.inOut' },
        '>-0.05',
      )
      tl.to(
        panelBRef.current,
        { yPercent: -105, duration: 0.78, ease: 'power3.inOut' },
        '>-0.66', // overlapping slightly for smooth feel
      )
    }, 30)

    return () => {
      window.clearTimeout(failsafe)
      window.clearTimeout(startTimer)
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
        pointerEvents: 'none',
      }}
    >
      {/* Panel B — background dark (enters first) */}
      <div
        ref={panelBRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: '#090807',
          transform: 'translate3d(0,105%,0)',
          willChange: 'transform',
        }}
      />

      {/* Panel A — gold overlay with content (enters 80ms after B) */}
      <div
        ref={panelARef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          background: [
            'radial-gradient(700px 380px at 50% 45%, rgba(212,175,55,0.14), transparent 65%)',
            'linear-gradient(160deg, #0c0a06 0%, #131008 100%)',
          ].join(', '),
          transform: 'translate3d(0,105%,0)',
          willChange: 'transform',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />

      {/* Content layer — centered above both panels */}
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
        }}
      >
        {/* Eyebrow */}
        <p
          style={{
            fontSize: '0.65rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            color: '#d4af37',
            marginBottom: '0.8rem',
          }}
        >
          Padukuhan Plosorejo · Cangkringan
        </p>

        {/* Main title with per-char wave */}
        <h1
          style={{
            fontFamily: 'var(--font-syne, sans-serif)',
            fontSize: 'clamp(2.2rem, 12vw, 3.2rem)',
            fontWeight: 800,
            letterSpacing: '0.1em',
            color: '#f5f0e8',
            lineHeight: 1,
            margin: 0,
            perspective: '400px', // needed for rotationX on children
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
            fontSize: '0.6rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.13em',
            color: 'rgba(245,240,232,0.5)',
            marginTop: '0.65rem',
          }}
        >
          Umbulharjo · Sleman · Lereng Merapi
        </p>
      </div>
    </div>
  )
}
