'use client'

import { useEffect, useRef } from 'react'

/**
 * v15 — NO useState, NO conditional render
 * Server renders preloader VISIBLE (panels off-screen below via CSS)
 * CSS @keyframes fire immediately on mount — zero hydration race
 * body.overflow:hidden di-set lewat CSS selama animasi (no JS scroll lock race)
 */
export default function SitePreloader() {
  const doneRef = useRef(false)

  useEffect(() => {
    if (doneRef.current) return
    // Total animasi = panel exit selesai pada ~4.45s + buffer
    const t = setTimeout(() => {
      doneRef.current = true
      // Hapus dari DOM setelah animasi selesai
      const el = document.getElementById('site-preloader-v15')
      if (el) el.remove()
    }, 4600)
    return () => clearTimeout(t)
  }, [])

  const chars = 'PLOSOREJO'.split('')

  return (
    <div
      id="site-preloader-v15"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        overflow: 'hidden',
        // pointer-events: none selama animasi supaya user bisa tap setelah selesai
        // tapi full visible dari server
      }}
    >
      <style>{`
        /* Lock scroll selama preloader aktif */
        body:has(#site-preloader-v15) {
          overflow: hidden !important;
        }

        @keyframes pl-in {
          from { transform: translateY(105%); }
          to   { transform: translateY(0%); }
        }
        @keyframes pl-out {
          from { transform: translateY(0%); }
          to   { transform: translateY(-105%); }
        }
        @keyframes pl-content-in {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0px); }
        }
        @keyframes pl-content-out {
          from { opacity: 1; transform: translateY(0px); }
          to   { opacity: 0; transform: translateY(-12px); }
        }
        @keyframes pl-char {
          from { opacity: 0; transform: translateY(20px); filter: blur(8px); }
          to   { opacity: 1; transform: translateY(0px);  filter: blur(0px); }
        }
        @keyframes pl-eyebrow {
          from { opacity: 0; letter-spacing: 0.38em; }
          to   { opacity: 1; letter-spacing: 0.22em; }
        }
        @keyframes pl-line {
          from { opacity: 0; transform: scaleX(0); }
          to   { opacity: 1; transform: scaleX(1); }
        }

        /* Panel hitam — masuk dari bawah (0s), keluar ke atas (3.65s) */
        #site-preloader-v15 .pl-blk {
          position: absolute; inset: 0; z-index: 1;
          background: #08070a;
          transform: translateY(105%);
          will-change: transform;
          animation:
            pl-in  0.72s cubic-bezier(0.76,0,0.24,1) 0s    forwards,
            pl-out 0.78s cubic-bezier(0.76,0,0.24,1) 3.65s forwards;
        }

        /* Panel gold — masuk 90ms setelah hitam, keluar 90ms setelah hitam */
        #site-preloader-v15 .pl-gld {
          position: absolute; inset: 0; z-index: 2;
          background:
            radial-gradient(ellipse 75% 55% at 50% 46%, rgba(212,175,55,0.28) 0%, transparent 68%),
            linear-gradient(150deg, #0d0b07 0%, #110f0a 100%);
          transform: translateY(105%);
          will-change: transform;
          animation:
            pl-in  0.72s cubic-bezier(0.76,0,0.24,1) 0.09s forwards,
            pl-out 0.78s cubic-bezier(0.76,0,0.24,1) 3.74s forwards;
        }

        /* Content */
        #site-preloader-v15 .pl-cnt {
          position: absolute; inset: 0; z-index: 3;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; padding: 0 1.5rem; gap: 0.5rem;
          pointer-events: none; opacity: 0;
          animation:
            pl-content-in  0.45s ease-out 0.85s forwards,
            pl-content-out 0.35s ease-in  3.1s  forwards;
        }

        #site-preloader-v15 .pl-eyebrow {
          font-size: 0.62rem; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: #d4af37; margin-bottom: 0.5rem;
          opacity: 0;
          animation: pl-eyebrow 0.6s ease-out 0.9s forwards;
        }

        #site-preloader-v15 .pl-title {
          font-family: 'Moderniz', var(--font-syne, sans-serif);
          font-size: clamp(2.8rem, 15vw, 4.2rem);
          font-weight: 900; letter-spacing: 0.08em;
          color: #f0ebe0; line-height: 1; margin: 0;
        }

        #site-preloader-v15 .pl-ch {
          display: inline-block; opacity: 0;
          animation: pl-char 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }

        #site-preloader-v15 .pl-div {
          width: 2.5rem; height: 1px;
          background: linear-gradient(90deg, transparent, #d4af37, transparent);
          transform-origin: center; opacity: 0;
          animation: pl-line 0.5s ease-out 1.72s forwards;
        }

        #site-preloader-v15 .pl-sub {
          font-size: 0.6rem; font-weight: 600;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(240,235,224,0.45); opacity: 0;
          animation: pl-content-in 0.5s ease-out 1.8s forwards;
        }
      `}</style>

      <div className="pl-blk" />
      <div className="pl-gld" />
      <div className="pl-cnt">
        <p className="pl-eyebrow">Padukuhan Plosorejo · Cangkringan</p>
        <h1 className="pl-title">
          {chars.map((ch, i) => (
            <span
              key={i}
              className="pl-ch"
              style={{ animationDelay: `${0.95 + i * 0.06}s` }}
            >
              {ch}
            </span>
          ))}
        </h1>
        <div className="pl-div" />
        <p className="pl-sub">Umbulharjo · Sleman · Lereng Merapi</p>
      </div>
    </div>
  )
}
