'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// v13: NO useState, NO isSeen — preloader SELALU muncul setiap load
// Render via static HTML di server (visible by default), GSAP animate on client
export default function SitePreloader() {
  const wrapRef    = useRef<HTMLDivElement>(null)
  const blkRef     = useRef<HTMLDivElement>(null)
  const goldRef    = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const charsRef   = useRef<HTMLSpanElement[]>([])
  const doneRef    = useRef(false)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || doneRef.current) return

    // Lock scroll
    document.body.style.overflow = 'hidden'

    const finish = () => {
      if (doneRef.current) return
      doneRef.current = true
      document.body.style.removeProperty('overflow')
      gsap.to(wrap, { autoAlpha: 0, duration: 0.2, onComplete: () => { wrap.style.display = 'none' } })
    }

    const failsafe = setTimeout(finish, 6000)

    requestAnimationFrame(() => {
      const chars = charsRef.current.filter(Boolean)
      if (!blkRef.current || !goldRef.current || !contentRef.current) {
        finish(); return
      }

      const tl = gsap.timeline({ onComplete: finish })

      // 1. Panels masuk dari bawah
      tl.fromTo(blkRef.current,
        { yPercent: 105 },
        { yPercent: 0, duration: 0.72, ease: 'power3.inOut' }, 0)
      tl.fromTo(goldRef.current,
        { yPercent: 105 },
        { yPercent: 0, duration: 0.72, ease: 'power3.inOut' }, 0.08)

      // 2. Content fade in
      tl.fromTo(contentRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.82)

      // 3. PLOSOREJO per-char wave
      if (chars.length) {
        tl.fromTo(chars,
          { opacity: 0, y: 20, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)',
            duration: 0.5, ease: 'back.out(1.4)', stagger: 0.06 }, 0.9)
      }

      // 4. Hold
      tl.to({}, { duration: 1.0 }, '>')

      // 5. Content fade out
      tl.to(contentRef.current, { opacity: 0, y: -12, duration: 0.32, ease: 'power2.in' }, '>')

      // 6. Panels exit ke atas
      tl.to(goldRef.current, { yPercent: -105, duration: 0.78, ease: 'power3.inOut' }, '>')
      tl.to(blkRef.current,  { yPercent: -105, duration: 0.78, ease: 'power3.inOut' }, '<0.08')
    })

    return () => {
      clearTimeout(failsafe)
      doneRef.current = true
      document.body.style.removeProperty('overflow')
    }
  }, [])

  const chars = 'PLOSOREJO'.split('')

  // Server renders ini visible — user lihat preloader langsung sebelum JS hydrate
  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        overflow: 'hidden',
        pointerEvents: 'all',
        // Container transparan — hanya panels yang cover layar
        background: 'transparent',
      }}
    >
      {/* Panel hitam */}
      <div ref={blkRef} style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: '#08070a',
        transform: 'translateY(105%)',
        willChange: 'transform',
      }} />

      {/* Panel gold */}
      <div ref={goldRef} style={{
        position: 'absolute', inset: 0, zIndex: 2,
        background: [
          'radial-gradient(ellipse 75% 55% at 50% 46%, rgba(212,175,55,0.26) 0%, transparent 68%)',
          'linear-gradient(150deg, #0d0b07 0%, #110f0a 100%)',
        ].join(','),
        transform: 'translateY(105%)',
        willChange: 'transform',
      }} />

      {/* Content */}
      <div ref={contentRef} style={{
        position: 'absolute', inset: 0, zIndex: 3,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 1.5rem',
        gap: '0.5rem', opacity: 0,
        pointerEvents: 'none',
      }}>
        <p style={{
          fontSize: '0.62rem', fontWeight: 700,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: '#d4af37', marginBottom: '0.5rem',
        }}>
          Padukuhan Plosorejo · Cangkringan
        </p>

        <h1 style={{
          fontFamily: "'Moderniz', var(--font-syne, sans-serif)",
          fontSize: 'clamp(2.8rem, 15vw, 4.2rem)',
          fontWeight: 900, letterSpacing: '0.08em',
          color: '#f0ebe0', lineHeight: 1, margin: 0,
        }}>
          {chars.map((ch, i) => (
            <span
              key={i}
              ref={el => { if (el) charsRef.current[i] = el }}
              style={{ display: 'inline-block', opacity: 0 }}
            >
              {ch}
            </span>
          ))}
        </h1>

        <div style={{
          width: '2.5rem', height: '1px', margin: '0.2rem auto',
          background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
        }} />

        <p style={{
          fontSize: '0.6rem', fontWeight: 600,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: 'rgba(240,235,224,0.45)', marginTop: '0.1rem',
        }}>
          Umbulharjo · Sleman · Lereng Merapi
        </p>
      </div>
    </div>
  )
}
