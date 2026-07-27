'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const KEY = 'plosorejo-preloader-v4'
const FAILSAFE_MS = 4000

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
 * GSAP-powered preloader.
 * SSR: renders nothing (mounted=false).
 * Client: checks isSeen() — if already seen, skip entirely.
 * Otherwise: dual curtain slide down → typewriter PLOSOREJO → curtain slide up.
 */
export default function SitePreloader() {
  // Start hidden (SSR safe) — useEffect decides whether to run or skip
  const [show, setShow] = useState(false)
  const [done, setDone] = useState(false)
  const doneRef = useRef(false)

  const topRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const charsRef = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    // Skip if already seen this session
    if (isSeen()) return

    // Show the overlay and start animation
    setShow(true)

    // Lock scroll
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const finish = () => {
      if (doneRef.current) return
      doneRef.current = true
      markSeen()
      document.body.style.removeProperty('overflow')
      document.documentElement.style.removeProperty('overflow')
      setDone(true)
    }

    // Failsafe
    const failsafe = window.setTimeout(finish, FAILSAFE_MS)

    // Small delay to ensure DOM refs are ready after setShow(true)
    const startTimer = window.setTimeout(() => {
      const tl = gsap.timeline({ onComplete: finish })

      // 1. Curtains slide in from top
      tl.fromTo(
        [topRef.current, bottomRef.current],
        { yPercent: -105 },
        { yPercent: 0, duration: 0.68, ease: 'power3.inOut', stagger: 0.07 },
        0,
      )

      // 2. Content fade in
      tl.fromTo(
        contentRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out' },
        0.52,
      )

      // 3. Per-char stagger reveal (PLOSOREJO)
      tl.fromTo(
        charsRef.current.filter(Boolean),
        { opacity: 0, y: 16, rotationX: -50 },
        {
          opacity: 1, y: 0, rotationX: 0,
          duration: 0.2, ease: 'back.out(1.6)',
          stagger: 0.048,
        },
        1.05,
      )

      // 4. Hold
      tl.to({}, { duration: 0.7 }, '>')

      // 5. Content fade out
      tl.to(contentRef.current, { opacity: 0, y: -10, duration: 0.28, ease: 'power2.in' }, '>')

      // 6. Curtains exit upward
      tl.to(
        [bottomRef.current, topRef.current],
        { yPercent: -105, duration: 0.62, ease: 'power3.inOut', stagger: 0.06 },
        '>-0.05',
      )
    }, 30)

    return () => {
      window.clearTimeout(failsafe)
      window.clearTimeout(startTimer)
      gsap.killTweensOf([topRef.current, bottomRef.current, contentRef.current, ...charsRef.current])
    }
  }, [])

  // SSR: nothing rendered
  if (!show || done) return null

  const chars = 'PLOSOREJO'.split('')

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        pointerEvents: 'none',
        isolation: 'isolate',
      }}
    >
      {/* Top curtain — gold */}
      <div
        ref={topRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(160deg, #c9a227 0%, #d4af37 60%, #b8941f 100%)',
          transform: 'translate3d(0,-105%,0)',
          zIndex: 1,
        }}
      />

      {/* Bottom curtain — near-black */}
      <div
        ref={bottomRef}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: '#090807',
          transform: 'translate3d(0,-105%,0)',
          zIndex: 1,
        }}
      />

      {/* Center content */}
      <div
        ref={contentRef}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          opacity: 0,
          textAlign: 'center',
          padding: '0 1.5rem',
          pointerEvents: 'none',
        }}
      >
        <p style={{
          fontSize: '0.68rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.16em',
          color: '#d4af37',
          marginBottom: '0.7rem',
        }}>
          Padukuhan Plosorejo · Cangkringan
        </p>

        <h1 style={{
          fontFamily: 'var(--font-syne, sans-serif)',
          fontSize: 'clamp(2rem, 11vw, 3rem)',
          fontWeight: 800,
          letterSpacing: '0.1em',
          color: '#f5f0e8',
          lineHeight: 1,
          margin: 0,
        }}>
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

        <p style={{
          fontSize: '0.6rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.13em',
          color: 'rgba(245,240,232,0.55)',
          marginTop: '0.6rem',
        }}>
          Umbulharjo · Sleman · Lereng Merapi
        </p>
      </div>
    </div>
  )
}
