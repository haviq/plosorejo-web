'use client'

import { motion } from 'framer-motion'
import Icon from '@/components/Icon'

type Level = 'Normal' | 'Waspada' | 'Siaga' | 'Awas'

const levelConfig: Record<Level, { color: string; bg: string; desc: string }> = {
  Normal: {
    color: 'var(--gold)',
    bg: 'rgba(212,175,55,0.08)',
    desc: 'Aktivitas vulkanik dalam batas normal',
  },
  Waspada: {
    color: 'var(--gold)',
    bg: 'rgba(212,175,55,0.1)',
    desc: 'Peningkatan aktivitas vulkanik, waspada',
  },
  Siaga: {
    color: 'var(--gold)',
    bg: 'rgba(212,175,55,0.12)',
    desc: 'Aktivitas tinggi, siaga evakuasi',
  },
  Awas: {
    color: 'var(--gold)',
    bg: 'rgba(212,175,55,0.14)',
    desc: 'Bahaya tinggi — evakuasi segera',
  },
}

interface MerapiStatusProps {
  level?: Level
  deskripsi?: string
  updatedAt?: string
}

export default function MerapiStatus({
  level = 'Normal',
  deskripsi,
  updatedAt,
}: MerapiStatusProps) {
  const cfg = levelConfig[level] || levelConfig.Normal
  const desc = deskripsi || cfg.desc
  const lastUpdate = updatedAt
    ? new Date(updatedAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="rounded-2xl border p-4 flex items-center gap-4 shadow-lg"
        style={{
          backgroundColor: cfg.bg,
          borderColor: 'var(--border)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
        }}
        role="status"
        aria-label={`Status Gunung Merapi: ${level}`}
      >
        <span
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'rgba(0,0,0,0.25)',
            border: '1px solid var(--border)',
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
                border: `1px solid ${cfg.color}33`,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current pulse-dot" aria-hidden="true" />
              {level}
            </span>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            {desc}
          </p>
          {lastUpdate && (
            <p className="text-xs mt-1" style={{ color: 'var(--muted2)' }}>
              Diperbarui: {lastUpdate}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
