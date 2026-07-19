'use client'

import { useEffect, useState } from 'react'

type Level = 'Normal' | 'Waspada' | 'Siaga' | 'Awas'

const levelConfig: Record<Level, { color: string; bg: string; desc: string }> = {
  Normal: { color: 'var(--green)',  bg: 'rgba(34,197,94,0.08)',   desc: 'Aktivitas vulkanik dalam batas normal' },
  Waspada: { color: 'var(--amber)', bg: 'rgba(245,158,11,0.08)',  desc: 'Peningkatan aktivitas vulkanik, waspada' },
  Siaga:   { color: '#f97316',      bg: 'rgba(249,115,22,0.08)',  desc: 'Aktivitas tinggi, siaga evakuasi' },
  Awas:    { color: '#ef4444',      bg: 'rgba(239,68,68,0.08)',   desc: 'Bahaya tinggi — evakuasi segera' },
}

export default function MerapiStatus() {
  const [level, setLevel] = useState<Level>('Normal')
  const [lastUpdate, setLastUpdate] = useState<string>('')

  useEffect(() => {
    // Static representative data — replace with live PVMBG API when available
    setLevel('Normal')
    setLastUpdate(new Date().toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
    }))
  }, [])

  const cfg = levelConfig[level]

  return (
    <div
      className="rounded-xl border p-4 flex items-center gap-4"
      style={{ backgroundColor: cfg.bg, borderColor: 'var(--border)' }}
      role="status"
      aria-label={`Status Gunung Semeru: ${level}`}
    >
      {/* Volcano icon */}
      <span className="text-2xl flex-shrink-0" aria-hidden="true">🌋</span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status Gunung Semeru
          </span>
          <span
            className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ color: cfg.color, backgroundColor: cfg.bg }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" aria-hidden="true" />
            {level}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{cfg.desc}</p>
        {lastUpdate && (
          <p className="text-xs text-gray-600 mt-1">Diperbarui: {lastUpdate}</p>
        )}
      </div>
    </div>
  )
}
