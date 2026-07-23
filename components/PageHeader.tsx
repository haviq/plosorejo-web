'use client'

import type { ReactNode } from 'react'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  highlight?: string
  description?: string
  children?: ReactNode
}

/** Static header — no opacity animation (mobile reliability). */
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

      {eyebrow && <p className="section-label relative">{eyebrow}</p>}

      <h1
        className="font-black leading-tight relative"
        style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 'clamp(2rem, 5vw, 3.1rem)',
          color: 'var(--text)',
        }}
      >
        {title} {highlight && <span className="gold-text">{highlight}</span>}
      </h1>

      {description && (
        <p
          className="text-sm md:text-base max-w-2xl leading-relaxed relative"
          style={{ color: 'var(--muted)' }}
        >
          {description}
        </p>
      )}

      {children && <div className="relative pt-1">{children}</div>}
    </section>
  )
}
