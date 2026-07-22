'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { easeOut } from '@/components/motion'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  highlight?: string
  description?: string
  children?: ReactNode
}

export default function PageHeader({
  eyebrow,
  title,
  highlight,
  description,
  children,
}: PageHeaderProps) {
  return (
    <section className="space-y-4 relative">
      <div
        className="absolute -top-8 -left-8 w-40 h-40 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.35), transparent 70%)' }}
        aria-hidden="true"
      />

      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: easeOut }}
        >
          <p className="section-label relative">{eyebrow}</p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.05, ease: easeOut }}
      >
        <h1
          className="font-black leading-tight relative"
          style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(2rem, 5vw, 3.1rem)',
            color: 'var(--text)',
          }}
        >
          {title}{' '}
          {highlight && <span className="gold-text">{highlight}</span>}
        </h1>
      </motion.div>

      {description && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease: easeOut }}
        >
          <p
            className="text-sm md:text-base max-w-2xl leading-relaxed relative"
            style={{ color: 'var(--muted)' }}
          >
            {description}
          </p>
        </motion.div>
      )}

      {children && (
        <motion.div
          className="relative pt-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18, ease: easeOut }}
        >
          {children}
        </motion.div>
      )}
    </section>
  )
}
