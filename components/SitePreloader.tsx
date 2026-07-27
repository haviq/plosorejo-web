'use client'

import { useEffect, useRef, useState } from 'react'

// v11: hanya cek sessionStorage (bukan localStorage)
// → preloader muncul tiap kali buka browser baru / tab baru
// → TIDAK muncul saat navigate antar halaman (route curtain yang handle itu)
const KEY = 'plosorejo-seen-v11'

function isSeen() {
  try { return sessionStorage.getItem(KEY) === '1' } catch { return false }
}
function markSeen() {
  try { sessionStorage.setItem(KEY, '1') } catch {}
}

export default function SitePreloader() {
  const [phase, setPhase] = useState<'pending' | 'active' | 'done'>('pending')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isSeen()) { setPhase('done'); return }

    document.body.style.overflow = 'hidden'
    setPhase('active')

    // Total: panels in 0.7s → hold text 1.5s → text out 0.35s → panels out 0.85s = ~4.4s
    timerRef.current = setTimeout(() => {
      markSeen()
      setPhase('done')
      document.body.style.removeProperty('overflow')
    }, 4500)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      document.body.style.removeProperty('overflow')
    }
  }, [])

  if (phase === 'done' || phase === 'pending') return null

  const chars = 'PLOSOREJO'.split('')

  return (
    <>
      <style>{`
        @keyframes pl-slide-in {
          0%   { transform: translateY(105%); }
          100% { transform: translateY(0%); }
        }
        @keyframes pl-slide-out {
          0%   { transform: translateY(0%); }
          100% { transform: translateY(-105%); }
        }
        @keyframes pl-fade-in {
          0%   { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0px); }
        }
        @keyframes pl-fade-out {
          0%   { opacity: 1; transform: translateY(0px); }
          100% { opacity: 0; transform: translateY(-12px); }
        }
        @keyframes pl-char {
          0%   { opacity: 0; transform: translateY(20px); filter: blur(8px); }
          100% { opacity: 1; transform: translateY(0px);  filter: blur(0px); }
        }
        @keyframes pl-eyebrow-in {
          0%   { opacity: 0; letter-spacing: 0.35em; }
          100% { opacity: 1; letter-spacing: 0.22em; }
        }

        .pl-wrap {
          position: fixed;
          inset: 0;
          z-index: 99999;
          overflow: hidden;
          pointer-events: all;
        }

        /* Panel black — enters first from below */
        .pl-panel-black {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: #08070a;
          animation:
            pl-slide-in  0.72s cubic-bezier(0.76,0,0.24,1) 0s    both,
            pl-slide-out 0.82s cubic-bezier(0.76,0,0.24,1) 3.55s both;
        }

        /* Panel gold — enters 90ms after black, exits 90ms after black */
        .pl-panel-gold {
          position: absolute;
          inset: 0;
          z-index: 2;
          background:
            radial-gradient(ellipse 75% 55% at 50% 46%, rgba(212,175,55,0.24) 0%, transparent 68%),
            linear-gradient(150deg, #0d0b07 0%, #110f0a 100%);
          animation:
            pl-slide-in  0.72s cubic-bezier(0.76,0,0.24,1) 0.09s both,
            pl-slide-out 0.82s cubic-bezier(0.76,0,0.24,1) 3.64s both;
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
          gap: 0.5rem;
          animation:
            pl-fade-in  0.45s ease-out 0.85s both,
            pl-fade-out 0.38s ease-in  3.1s  both;
        }

        .pl-eyebrow {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #d4af37;
          margin-bottom: 0.6rem;
          animation: pl-eyebrow-in 0.6s ease-out 0.9s both;
        }

        .pl-title {
          font-family: 'Moderniz', var(--font-syne, sans-serif);
          font-size: clamp(2.8rem, 15vw, 4.2rem);
          font-weight: 900;
          letter-spacing: 0.08em;
          color: #f0ebe0;
          line-height: 1;
          margin: 0;
        }

        .pl-char {
          display: inline-block;
          opacity: 0;
          animation: pl-char 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
        }

        .pl-divider {
          width: 2.5rem;
          height: 1px;
          background: linear-gradient(90deg, transparent, #d4af37, transparent);
          margin: 0.3rem auto;
          opacity: 0;
          animation: pl-fade-in 0.5s ease-out 1.6s both;
        }

        .pl-sub {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(240,235,224,0.45);
          margin-top: 0.2rem;
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
                style={{ animationDelay: `${0.95 + i * 0.06}s` }}
              >
                {ch}
              </span>
            ))}
          </h1>
          <div className="pl-divider" />
          <p className="pl-sub">Umbulharjo · Sleman · Lereng Merapi</p>
        </div>
      </div>
    </>
  )
}
