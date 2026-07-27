'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const KEY = 'plosorejo-preloader-v8'
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

const CHARS = 'PLOSOREJO'.split('')

export default function SitePreloader() {
  const doneRef = useRef(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const panelARef = useRef<HTMLDivElement>(null)
  const panelBRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const charsRef = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Already seen → hide immediately, no animation
    if (isSeen()) {
      container.style.display = 'none'
      return
    }

    // Make container visible (was rendered hidden for SSR safety)
    container.style.visibility = 'visible'
    container.style.opacity = '1'

    // Lock scroll
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const finish = () => {
      if (doneRef.current) return
      doneRef.current = true
      markSeen()
      // Hide container after animation
      if (container) container.style.display = 'none'
      document.body.style.removeProperty('overflow')
      document.documentElement.style.removeProperty('overflow')
    }

    const failsafe = window.setTimeout(finish, FAILSAFE_MS)

    // 1 rAF is enough — refs are already attached (DOM rendered before this effect)
    const rafId = requestAnimationFrame(() => {
      const chars = charsRef.current.filter(Boolean)

      if (!panelARef.current || !panelBRef.current || !contentRef.current) {
        finish()
        return
      }

      const tl = gsap.timeline({ onComplete: finish })

      // ── 1. Panel B enters from below ───────────────────────────────────
      tl.fromTo(
        panelBRef.current,
        { y: '100vh' },
        { y: '0vh', duration: 0.7, ease: 'power3.inOut' },
        0,
      )

      // ── 2. Panel A enters from below, stagger +0.08s ───────────────────
      tl.fromTo(
        panelARef.current,
        { y: '100vh' },
        { y: '0vh', duration: 0.7, ease: 'power3.inOut' },
        0.08,
      )

      // ── 3. Content fade in ─────────────────────────────────────────────
      tl.fromTo(
        contentRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out' },
        0.8,
      )

      // ── 4. PLOSOREJO per-char: opacity + translateY + blur ─────────────
      if (chars.length > 0) {
        tl.fromTo(
          chars,
          { opacity: 0, y: 20, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.5,
            ease: 'power2.out',
            stagger: 0.05,
          },
          0.85,
        )
      }

      // ── 5. Hold 0.8s ──────────────────────────────────────────────────
      tl.to({}, { duration: 0.8 }, '>')

      // ── 6. Content fade out ────────────────────────────────────────────
      tl.to(
        contentRef.current,
        { opacity: 0, y: -10, duration: 0.28, ease: 'power2.in' },
        '>',
      )

      // ── 7. Panel A exits upward ────────────────────────────────────────
      tl.to(
        panelARef.current,
        { y: '-100vh', duration: 0.75, ease: 'power3.inOut' },
        '>-0.05',
      )

      // ── 8. Panel B exits upward, slight overlap ────────────────────────
      tl.to(
        panelBRef.current,
        { y: '-100vh', duration: 0.75, ease: 'power3.inOut' },
        '<0.08',
      )
    })

    return () => {
      window.clearTimeout(failsafe)
      cancelAnimationFrame(rafId)
      gsap.killTweensOf([
        panelARef.current,
        panelBRef.current,
        contentRef.current,
        ...charsRef.current,
      ])
    }
  }, [])

  // Always render into the DOM — visibility:hidden + opacity:0 hides it during SSR/hydration.
  // useEffect will either hide it immediately (isSeen) or reveal + animate it.
  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        overflow: 'hidden',
        // Hidden until useEffect fires — prevents flash on pages where preloader shouldn't show
        visibility: 'hidden',
        opacity: 0,
      }}
    >
      {/* Panel B — pure black, enters first */}
      <div
        ref={panelBRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: '#090807',
          transform: 'translateY(100vh)',
          willChange: 'transform',
        }}
      />

      {/* Panel A — gold-tinted dark, enters 80ms after B */}
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
          transform: 'translateY(100vh)',
          willChange: 'transform',
        }}
      />

      {/* Content — centered above both panels */}
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
          {CHARS.map((ch, i) => (
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
