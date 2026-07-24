'use client'

import Icon from '@/components/Icon'
import { levelColor, type MerapiLevel } from '@/lib/merapi'
import { safeOfficialHref } from '@/lib/safe-url'

interface MerapiStatusProps {
  level?: MerapiLevel
  deskripsi?: string
  updatedAt?: string
  source?: 'magma' | 'sanity' | 'fallback'
  sourceLabel?: string
  reportUrl?: string
  officialUrl?: string
  roman?: 'I' | 'II' | 'III' | 'IV'
  note?: string
}

/** Static card — no framer opacity (mobile reliability). */
export default function MerapiStatus({
  level = 'Normal',
  deskripsi,
  updatedAt,
  source = 'fallback',
  sourceLabel,
  reportUrl,
  officialUrl = 'https://magma.esdm.go.id/v1/gunung-api/tingkat-aktivitas',
  roman,
  note,
}: MerapiStatusProps) {
  const cfg = levelColor(level)
  const lastUpdate = updatedAt
    ? new Date(updatedAt).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta',
      })
    : ''

  const sourceText =
    sourceLabel ||
    (source === 'magma'
      ? 'MAGMA ESDM (otomatis)'
      : source === 'sanity'
        ? 'Admin CMS'
        : 'Data cadangan')

  const safeReport = safeOfficialHref(reportUrl)
  const safeOfficial =
    safeOfficialHref(officialUrl) ||
    'https://magma.esdm.go.id/v1/gunung-api/tingkat-aktivitas'

  return (
    <div
      className="rounded-2xl border p-4 flex items-center gap-4 shadow-lg"
      style={{
        backgroundColor: cfg.bg,
        borderColor: cfg.border,
        backdropFilter: 'blur(16px)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
      }}
      role="status"
      aria-label={`Status Gunung Merapi: ${level}`}
    >
      <span
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: 'var(--surface-soft)',
          border: `1px solid ${cfg.border}`,
          color: cfg.color,
        }}
        aria-hidden="true"
      >
        <Icon name="merapi" size={22} />
      </span>

      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: 'var(--muted)' }}
          >
            Status Gunung Merapi
          </span>
          <span
            className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              color: cfg.color,
              backgroundColor: cfg.bg,
              border: `1px solid ${cfg.border}`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current pulse-dot" aria-hidden="true" />
            {level}
            {roman ? ` · ${roman}` : ''}
          </span>
        </div>

        <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>
          {deskripsi || 'Memuat status aktivitas…'}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
          <p className="text-[11px]" style={{ color: 'var(--muted2)' }}>
            Sumber: {sourceText}
            {lastUpdate ? ` · ${lastUpdate} WIB` : ''}
          </p>
          {note && (
            <p className="text-[11px]" style={{ color: 'var(--muted2)' }}>
              {note}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {safeReport && (
            <a
              href={safeReport}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold underline-offset-2 hover:underline"
              style={{ color: cfg.color }}
            >
              Laporan MAGMA →
            </a>
          )}
          <a
            href={safeOfficial}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold underline-offset-2 hover:underline"
            style={{ color: 'var(--muted)' }}
          >
            Cek sumber resmi
          </a>
        </div>
      </div>
    </div>
  )
}
