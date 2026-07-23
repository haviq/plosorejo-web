'use client'

import { useEffect, useState } from 'react'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'

type Theme = 'dark' | 'light'

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
  document.documentElement.style.colorScheme = theme
}

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem('plosorejo-theme') as Theme | null
    const preferred: Theme =
      stored === 'light' || stored === 'dark'
        ? stored
        : window.matchMedia('(prefers-color-scheme: light)').matches
          ? 'light'
          : 'dark'
    setTheme(preferred)
    applyTheme(preferred)
    setMounted(true)
  }, [])

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    applyTheme(next)
    window.localStorage.setItem('plosorejo-theme', next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`w-10 h-10 rounded-xl inline-flex items-center justify-center cursor-pointer transition-colors ${className}`}
      style={{
        border: '1px solid var(--border)',
        background: 'var(--surface-soft)',
        color: 'var(--text)',
      }}
      aria-label={theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
      title={theme === 'dark' ? 'Mode terang' : 'Mode gelap'}
    >
      {mounted ? (
        theme === 'dark' ? (
          <SunIcon className="w-4 h-4" aria-hidden="true" />
        ) : (
          <MoonIcon className="w-4 h-4" aria-hidden="true" />
        )
      ) : (
        <SunIcon className="w-4 h-4 opacity-60" aria-hidden="true" />
      )}
    </button>
  )
}
