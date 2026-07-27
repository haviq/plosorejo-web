'use client'

import { useEffect, useRef, useState } from 'react'

const KEY = 'plosorejo-seen-v10'

function isSeen() {
  try {
    return (
      sessionStorage.getItem(KEY) === '1' ||
      localStorage.getItem(KEY) === '1'
    )
  } catch { return false }
}

function markSeen() {
  try {
    sessionStorage.setItem(KEY, '1')
    localStorage.setItem(KEY, '1')
  } catch {}
}

// Pure CSS preloader — no GSAP, no race condition, no hydration mismatch
// Phase: 'pending' → check if seen → 'hidden' (skip) or 'active' (animate) → 'done'
export default function SitePreloader() {
  const [phase, setPhase] = useState<'pending' | 'active' | 'done'>('pending')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Must run client-only
    if (isSeen()) {
      setPhase('done')
      return
    }

    // Lock scroll
    document.body.style.overflow = 'hidden'

    // Show preloader
    setPhase('active')

    // Total animation: ~3.4s then done
    // panels in: 0.7s, hold text: 1.2s, text out: 0.3s, panels out: 0.8s
    timerRef.current = setTimeout(() => {
      markSeen()
      setPhase('done')
      document.body.style.removeProperty('overflow')
    }, 3600)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      document.body.style.removeProperty('overflow')
    }
  }, [])

  if (phase === 'done') return null
  if (phase === 'pending') return null

  const chars = 'PLOSOREJO'.split('')

  return (
    <>
      <style>{`
        @keyframes pl-slide-in {
          0%   { transform: translateY(100%); }
          100% { transform: translateY(0%); }
        }
        @keyframes pl-slide-out {
          0%   { transform: translateY(0%); }
          100% { transform: translateY(-100%); }
        }
        @keyframes pl-fade-in {
          0%   { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0px); }
        }
        @keyframes pl-fade-out {
          0%   { opacity: 1; transform: translateY(0px); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        @keyframes pl-char {
          0%   { opacity: 0; transform: translateY(18px); filter: blur(6px); }
          100% { opacity: 1; transform: translateY(0px);  filter: blur(0px); }
        }

        .pl-wrap {
          position: fixed;
          inset: 0;
          z-index: 99999;
          overflow: hidden;
          pointer-events: all;
        }

        /* Panel black — enters first */
        .pl-panel-black {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: #08070a;
          animation:
            pl-slide-in  0.68s cubic-bezier(0.76,0,0.24,1) 0s    both,
            pl-slide-out 0.72s cubic-bezier(0.76,0,0.24,1) 2.8s  both;
        }

        /* Panel gold — enters 80ms after black, exits 60ms after black */
        .pl-panel-gold {
          position: absolute;
          inset: 0;
          z-index: 2;
          background:
            radial-gradient(ellipse 72% 52% at 50% 46%, rgba(212,175,55,0.22) 0%, transparent 68%),
            linear-gradient(150deg, #0c0a06 0%, #100e09 100%);
          animation:
            pl-slide-in  0.68s cubic-bezier(0.76,0,0.24,1) 0.08s both,
            pl-slide-out 0.72s cubic-bezier(0.76,0,0.24,1) 2.86s both;
        }

        /* Content layer */
        .pl-content {
          position: absolute;
          inset: 0;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0 1.5rem;
          gap: 0.4rem;
          animation:
            pl-fade-in  0.4s ease-out 0.8s  both,
            pl-fade-out 0.3s ease-in  2.45s both;
        }

        .pl-eyebrow {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #d4af37;
          margin-bottom: 0.5rem;
        }

        .pl-title {
          font-family: var(--font-syne, sans-serif);
          font-size: clamp(2.6rem, 14vw, 3.8rem);
          font-weight: 900;
          letter-spacing: 0.08em;
          color: #f0ebe0;
          line-height: 1;
          margin: 0;
        }

        .pl-char {
          display: inline-block;
          opacity: 0;
          animation: pl-char 0.45s ease-out both;
        }

        .pl-sub {
          font-size: 0.58rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(240,235,224,0.42);
          margin-top: 0.3rem;
        }
      `}</style>

      <div className="pl-wrap" aria-hidden="true">
        <div className="pl-panel-black" />
        <div className="pl-panel-gold" />
        <div className="pl-content">
          <p className="pl-eyebrow">Padukuhan Plosorejo · Cangkringan</p>
          <h1 className="pl-title">
            {chars.map((ch, i) => (
              <span
                key={i}
                className="pl-char"
                style={{ animationDelay: `${0.9 + i * 0.055}s` }}
              >
                {ch}
              </span>
            ))}
          </h1>
          <p className="pl-sub">Umbulharjo · Sleman · Lereng Merapi</p>
        </div>
      </div>
    </>
  )
}
