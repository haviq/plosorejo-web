'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// Bump this key whenever you want ALL users to see the preloader again
const KEY = 'plosorejo-seen-v9'
const FAILSAFE_MS = 6000

function isSeen() {
  try { return sessionStorage.getItem(KEY) === '1' || localStorage.getItem(KEY) === '1' } catch {}
  return false
}
function markSeen() {
  try { sessionStorage.setItem(KEY, '1'); localStorage.setItem(KEY, '1') } catch {}
}

export default function SitePreloader() {
  const wrapRef  = useRef<HTMLDivElement>(null)
  const blkRef   = useRef<HTMLDivElement>(null)
  const goldRef  = useRef<HTMLDivElement>(null)
  const bodyRef  = useRef<HTMLDivElement>(null)
  const doneRef  = useRef(false)
  // Store span refs in an array — populated by the ref callback below
  const charRefs = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    // ── Already seen → remove from DOM immediately ──────────────────────
    if (isSeen()) {
      wrap.remove()
      return
    }

    // ── Make container visible ───────────────────────────────────────────
    // (was display:none in CSS for SSR, now show it)
    wrap.style.display = 'block'

    // Lock scroll
    document.body.style.overflow = 'hidden'

    const finish = () => {
      if (doneRef.current) return
      doneRef.current = true
      markSeen()
      document.body.style.removeProperty('overflow')
      // Slide wrap off-screen then remove
      gsap.to(wrap, {
        opacity: 0, duration: 0.2, onComplete: () => wrap.remove(),
      })
    }

    const failsafe = setTimeout(finish, FAILSAFE_MS)

    // Wait 2 frames so browser has painted the newly-visible container
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const chars = charRefs.current.filter(Boolean)
      if (!blkRef.current || !goldRef.current || !bodyRef.current) {
        finish(); return
      }

      const tl = gsap.timeline({ onComplete: finish })

      // 1 ── black panel slides up from below
      tl.fromTo(blkRef.current,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.65, ease: 'power3.inOut' }, 0)

      // 2 ── gold panel slides up, 80ms after black
      tl.fromTo(goldRef.current,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.65, ease: 'power3.inOut' }, 0.08)

      // 3 ── body content fades in
      tl.fromTo(bodyRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, 0.75)

      // 4 ── PLOSOREJO typewriter wave (per-char)
      if (chars.length) {
        tl.fromTo(chars,
          { opacity: 0, y: 16, filter: 'blur(6px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)',
            duration: 0.45, ease: 'power2.out', stagger: 0.055 }, 0.82)
      }

      // 5 ── Hold
      tl.to({}, { duration: 0.85 }, '>')

      // 6 ── body fades out
      tl.to(bodyRef.current,
        { opacity: 0, y: -10, duration: 0.25, ease: 'power2.in' }, '>')

      // 7 ── gold exits upward
      tl.to(goldRef.current,
        { yPercent: -100, duration: 0.7, ease: 'power3.inOut' }, '>')

      // 8 ── black exits upward, slight overlap
      tl.to(blkRef.current,
        { yPercent: -100, duration: 0.7, ease: 'power3.inOut' }, '<0.07')
    }))

    return () => {
      clearTimeout(failsafe)
      doneRef.current = true
      document.body.style.removeProperty('overflow')
    }
  }, [])

  const WORD = 'PLOSOREJO'

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      style={{
        // display:none during SSR — useEffect flips to 'block' on client
        display: 'none',
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        overflow: 'hidden',
        pointerEvents: 'all',
      }}
    >
      {/* ── Panel 1: pure black ── */}
      <div
        ref={blkRef}
        style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: '#08070a',
          transform: 'translateY(100%)',
          willChange: 'transform',
        }}
      />

      {/* ── Panel 2: gold-tinted ── */}
      <div
        ref={goldRef}
        style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: [
            'radial-gradient(ellipse 70% 55% at 50% 48%, rgba(212,175,55,0.22) 0%, transparent 68%)',
            'linear-gradient(150deg, #0c0a06 0%, #100e09 100%)',
          ].join(','),
          transform: 'translateY(100%)',
          willChange: 'transform',
        }}
      />

      {/* ── Content (above both panels) ── */}
      <div
        ref={bodyRef}
        style={{
          position: 'absolute', inset: 0, zIndex: 3,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          opacity: 0,
          gap: '0.5rem',
          padding: '0 1.5rem',
          textAlign: 'center',
        }}
      >
        {/* Eyebrow */}
        <p style={{
          fontSize: '0.62rem', fontWeight: 700,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: '#d4af37', marginBottom: '0.6rem',
        }}>
          Padukuhan Plosorejo · Cangkringan
        </p>

        {/* PLOSOREJO — per-char spans */}
        <h1 style={{
          fontFamily: 'var(--font-syne, sans-serif)',
          fontSize: 'clamp(2.6rem, 14vw, 3.8rem)',
          fontWeight: 900,
          letterSpacing: '0.08em',
          color: '#f0ebe0',
          lineHeight: 1,
          margin: 0,
        }}>
          {WORD.split('').map((ch, i) => (
            <span
              key={i}
              ref={el => { if (el) charRefs.current[i] = el }}
              style={{ display: 'inline-block', opacity: 0 }}
            >
              {ch}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '0.58rem', fontWeight: 600,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'rgba(240,235,224,0.42)', marginTop: '0.4rem',
        }}>
          Umbulharjo · Sleman · Lereng Merapi
        </p>
      </div>
    </div>
  )
}
