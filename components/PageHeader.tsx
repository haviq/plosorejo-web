'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  highlight?: string
  description?: string
  backHref?: string
  backLabel?: string
  children?: ReactNode
}

/** iOS-style compact page header — no noise blob, back button row, pill eyebrow. */
export default function PageHeader({
  eyebrow,
  title,
  highlight,
  description,
  backHref = '/sektor',
  backLabel = 'Sektor',
  children,
}: PageHeaderProps) {
  return (
    <section className="space-y-3">
      {/* Back button row */}
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm font-medium"
        style={{ color: 'var(--gold)' }}
        aria-label={`Kembali ke ${backLabel}`}
      >
        <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true">
          <path d="M6 1L1 6l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {backLabel}
      </Link>

      {/* Eyebrow pill badge */}
      {eyebrow && (
        <p
          className="inline-block text-[10px] font-bold uppercase tracking-[0.16em] px-2.5 py-1 rounded-full"
          style={{
            color: 'var(--gold)',
            backgroundColor: 'rgba(212,175,55,0.12)',
            border: '1px solid rgba(212,175,55,0.25)',
          }}
        >
          {eyebrow}
        </p>
      )}

      {/* Title */}
      <h1
        className="font-black leading-tight"
        style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 'clamp(1.75rem, 5vw, 2.6rem)',
          color: 'var(--text)',
        }}
      >
        {title}{highlight && <> <span style={{ color: 'var(--gold)' }}>{highlight}</span></>}
      </h1>

      {/* Description */}
      {description && (
        <p
          className="text-sm leading-relaxed max-w-xl"
          style={{ color: 'var(--muted)' }}
        >
          {description}
        </p>
      )}

      {children && <div className="pt-1">{children}</div>}
    </section>
  )
}
