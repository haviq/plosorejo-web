'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { MerapiLevel } from '@/lib/merapi'
import { levelColor } from '@/lib/merapi'
import Icon from '@/components/Icon'

interface EmergencyBannerProps {
  level: MerapiLevel
  roman?: string
  deskripsi?: string
  updatedAt?: string
}

/**
 * Sticky top banner when Merapi is elevated (Waspada / Siaga / Awas).
 * Dismissible per session; reappears on next visit if still elevated.
 */
export default function EmergencyBanner({
  level,
  roman,
  deskripsi,
  updatedAt,
}: EmergencyBannerProps) {
  const elevated = level === 'Waspada' || level === 'Siaga' || level === 'Awas'
  const [dismissed, setDismissed] = useState(true) // start hidden until client check

  useEffect(() => {
    if (!elevated) {
      setDismissed(true)
      return
    }
    try {
      const key = `plosorejo-emg-${level}`
      setDismissed(sessionStorage.getItem(key) === '1')
    } catch {
      setDismissed(false)
    }
  }, [elevated, level])

  if (!elevated || dismissed) return null

  const cfg = levelColor(level)
  const time = updatedAt
    ? new Date(updatedAt).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta',
      })
    : ''

  function dismiss() {
    try {
      sessionStorage.setItem(`plosorejo-emg-${level}`, '1')
    } catch {
      /* ignore */
    }
    setDismissed(true)
  }

  return (
    <div
      className="emergency-banner"
      role="alert"
      aria-live="assertive"
      style={{
        background: cfg.bg,
        borderBottom: `1px solid ${cfg.border}`,
        color: 'var(--text)',
      }}
    >
      <div className="emergency-banner__inner">
        <span
          className="emergency-banner__icon"
          style={{ color: cfg.color, borderColor: cfg.border }}
          aria-hidden="true"
        >
          <Icon name="merapi" size={18} />
        </span>
        <div className="emergency-banner__body min-w-0">
          <p className="emergency-banner__title" style={{ color: cfg.color }}>
            Status Merapi: {level}
            {roman ? ` · ${roman}` : ''}
            {time ? ` · ${time} WIB` : ''}
          </p>
          <p className="emergency-banner__desc">
            {deskripsi ||
              'Ikuti arahan resmi BPBD / BPPTKG. Cek nomor penting & jalur di halaman darurat.'}
          </p>
        </div>
        <div className="emergency-banner__actions">
          <Link href="/darurat" className="emergency-banner__cta" style={{ color: cfg.color }}>
            Info darurat
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="emergency-banner__close"
            aria-label="Tutup peringatan"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
