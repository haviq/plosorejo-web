'use client'

import { useEffect, useRef } from 'react'

/**
 * v16 — FINAL
 * Sequence:
 * 1. Panel hitam + gold MASUK DARI ATAS ke bawah (slide down, cover screen)
 * 2. PLOSOREJO typewriter per huruf (smooth, satu per satu)
 * 3. Panel hitam + gold KELUAR KE ATAS dari bawah (slide up, reveal page)
 *
 * Server renders VISIBLE — tidak ada useState SSR null race.
 * CSS @keyframes — zero GSAP, zero hydration issue.
 * body overflow:hidden via CSS :has() selector.
 */
export default function SitePreloader() {
  const doneRef = useRef(false)

  useEffect(() => {
    if (doneRef.current) return
    // Hapus dari DOM setelah semua animasi selesai (~5s)
    const t = setTimeout(() => {
      doneRef.current = true
      const el = document.getElementById('site-preloader-v16')
      if (el) el.remove()
    }, 5200)
    return () => clearTimeout(t)
  }, [])

  const chars = 'PLOSOREJO'.split('')

  return (
    <div id="site-preloader-v16" aria-hidden="true">
      <style>{`
        /* Lock scroll selama preloader aktif */
        body:has(#site-preloader-v16) { overflow: hidden !important; }

        /* ── Keyframes ───────────────────────────────────────────── */

        /* Panel masuk: dari ATAS ke bawah (slide down) */
        @keyframes pl-enter {
          from { transform: translateY(-105%); }
          to   { transform: translateY(0%); }
        }

        /* Panel keluar: ke ATAS dari bawah (slide up) */
        @keyframes pl-exit {
          from { transform: translateY(0%); }
          to   { transform: translateY(-105%); }
        }

        /* Content fade in */
        @keyframes pl-show {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Content fade out */
        @keyframes pl-hide {
          from { opacity: 1; }
          to   { opacity: 0; }
        }

        /* Per-char typewriter reveal */
        @keyframes pl-type {
          from { opacity: 0; transform: translateY(12px); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0); }
        }

        /* Eyebrow letter-spacing reveal */
        @keyframes pl-eyebrow {
          from { opacity: 0; letter-spacing: 0.45em; }
          to   { opacity: 1; letter-spacing: 0.22em; }
        }

        /* Divider line grow */
        @keyframes pl-divider {
          from { transform: scaleX(0); opacity: 0; }
          to   { transform: scaleX(1); opacity: 1; }
        }

        /* ── Wrapper ─────────────────────────────────────────────── */
        #site-preloader-v16 {
          position: fixed;
          inset: 0;
          z-index: 99999;
          overflow: hidden;
          pointer-events: none;
        }

        /* ── Panel hitam (masuk dulu, keluar belakangan) ─────────── */
        #site-preloader-v16 .pl-blk {
          position: absolute; inset: 0; z-index: 1;
          background: #08070a;
          /* start: di atas layar */
          transform: translateY(-105%);
          will-change: transform;
          animation:
            pl-enter 0.7s cubic-bezier(0.76,0,0.24,1) 0s    forwards,
            pl-exit  0.78s cubic-bezier(0.76,0,0.24,1) 3.8s  forwards;
        }

        /* ── Panel gold (masuk +80ms, keluar +80ms) ──────────────── */
        #site-preloader-v16 .pl-gld {
          position: absolute; inset: 0; z-index: 2;
          background:
            radial-gradient(ellipse 75% 55% at 50% 46%, rgba(212,175,55,0.28) 0%, transparent 68%),
            linear-gradient(160deg, #0d0b07 0%, #110f0a 100%);
          transform: translateY(-105%);
          will-change: transform;
          animation:
            pl-enter 0.7s cubic-bezier(0.76,0,0.24,1) 0.08s forwards,
            pl-exit  0.78s cubic-bezier(0.76,0,0.24,1) 3.88s forwards;
        }

        /* ── Content layer ───────────────────────────────────────── */
        #site-preloader-v16 .pl-cnt {
          position: absolute; inset: 0; z-index: 3;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; padding: 0 2rem;
          gap: 0.4rem; pointer-events: none;
          opacity: 0;
          animation:
            pl-show 0.4s ease-out 0.85s forwards,
            pl-hide 0.3s ease-in  3.3s  forwards;
        }

        /* Eyebrow */
        #site-preloader-v16 .pl-eye {
          font-size: 0.62rem; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: #d4af37; margin-bottom: 0.4rem;
          opacity: 0;
          animation: pl-eyebrow 0.55s ease-out 0.95s forwards;
        }

        /* Title wrapper */
        #site-preloader-v16 .pl-ttl {
          font-family: 'Moderniz', var(--font-syne, sans-serif);
          font-size: clamp(2.8rem, 15vw, 4.4rem);
          font-weight: 900; letter-spacing: 0.08em;
          color: #f0ebe0; line-height: 1; margin: 0;
        }

        /* Per-char span */
        #site-preloader-v16 .pl-ch {
          display: inline-block; opacity: 0;
          animation: pl-type 0.38s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }

        /* Divider */
        #site-preloader-v16 .pl-div {
          width: 3rem; height: 1px;
          background: linear-gradient(90deg, transparent, #d4af37, transparent);
          transform-origin: center; transform: scaleX(0); opacity: 0;
          margin: 0.35rem 0;
          animation: pl-divider 0.45s ease-out 1.8s forwards;
        }

        /* Sub */
        #site-preloader-v16 .pl-sub {
          font-size: 0.58rem; font-weight: 600;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(240,235,224,0.42); opacity: 0;
          animation: pl-show 0.45s ease-out 1.9s forwards;
        }
      `}</style>

      {/* Panel hitam — masuk dari atas */}
      <div className="pl-blk" />

      {/* Panel gold — masuk dari atas +80ms */}
      <div className="pl-gld" />

      {/* Content */}
      <div className="pl-cnt">
        <p className="pl-eye">Padukuhan Plosorejo · Cangkringan</p>

        {/* PLOSOREJO typewriter per huruf */}
        <h1 className="pl-ttl">
          {chars.map((ch, i) => (
            <span
              key={i}
              className="pl-ch"
              style={{
                // Setiap huruf muncul berurutan (typewriter feel)
                animationDelay: `${1.05 + i * 0.07}s`,
              }}
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
