'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useRef } from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.15 * i, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export default function MerapiHero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yMountain = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const yGlow = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden"
      aria-label="Hero — Padukuhan Plosorejo"
    >
      {/* Layered Merapi background */}
      <div className="absolute inset-0" style={{ zIndex: 0, background: 'linear-gradient(to bottom, #0d0d0d 0%, #1a1408 55%, #080808 100%)' }} />

      {/* Glow behind summit */}
      <motion.div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          y: yGlow,
          background: 'radial-gradient(ellipse 70% 45% at 50% 36%, rgba(212,175,55,0.22), transparent 70%)',
        }}
      />

      {/* Stars */}
      <div className="absolute inset-0" style={{ zIndex: 1 }} aria-hidden="true">
        {[
          { l: '12%', t: '16%' }, { l: '27%', t: '10%' }, { l: '44%', t: '7%' },
          { l: '65%', t: '13%' }, { l: '81%', t: '9%' }, { l: '92%', t: '18%' },
        ].map((s, i) => (
          <motion.span
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{ left: s.l, top: s.t, backgroundColor: 'var(--gold)', opacity: 0.6 }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2.4 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Mountain silhouette (SVG) */}
      <motion.svg
        viewBox="0 0 1920 640"
        preserveAspectRatio="xMidYMax slice"
        className="absolute bottom-0 left-0 w-full"
        style={{ zIndex: 2, y: yMountain, height: '62vh' }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="hero-mtn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a2f12" />
            <stop offset="100%" stopColor="#0a0805" />
          </linearGradient>
        </defs>
        <path d="M0 640 L0 480 L300 430 L520 480 L760 370 L960 140 L1160 370 L1400 480 L1620 430 L1920 500 L1920 640 Z" fill="url(#hero-mtn)" />
        <path d="M880 220 L960 140 L1040 220 L1010 230 L990 205 L960 225 L930 205 L910 230 Z" fill="#d4af37" opacity="0.9" />
        <path d="M0 640 L0 560 Q480 500 960 545 T1920 525 L1920 640 Z" fill="#070707" />
      </motion.svg>

      {/* Bottom fade into page */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{ zIndex: 3, height: '30vh', background: 'linear-gradient(to bottom, transparent, var(--bg))' }}
      />

      {/* Content */}
      <motion.div
        className="relative px-6 max-w-4xl mx-auto flex flex-col items-center gap-6"
        style={{ zIndex: 4, opacity }}
      >
        <motion.p variants={fadeUp} initial="hidden" animate="show" custom={0} className="section-label" style={{ letterSpacing: '0.25em' }}>
          Padukuhan Plosorejo · Cangkringan · Sleman
        </motion.p>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="leading-tight font-black"
          style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            color: 'var(--text)',
          }}
        >
          Desa yang Hidup,
          <br />
          <span className="gold-text">Potensi yang Nyata</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="text-base md:text-lg max-w-xl leading-relaxed"
          style={{ color: 'var(--muted)' }}
        >
          Sentra sapi perah, UMKM olahan susu, dan agrowisata di lereng Gunung Merapi —
          dikelola warga, untuk warga.
        </motion.p>

        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3} className="flex flex-wrap justify-center gap-3 pt-2">
          <Link href="/sektor/peternakan" className="btn-primary">
            Jelajahi Potensi
          </Link>
          <Link href="/peta" className="btn-ghost">
            Lihat Peta
          </Link>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="absolute -bottom-24 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <span className="text-xs" style={{ color: 'var(--muted)' }}>scroll</span>
          <span className="w-px h-8" style={{ background: 'linear-gradient(to bottom, var(--gold), transparent)' }} />
        </motion.div>
      </motion.div>
    </section>
  )
}
