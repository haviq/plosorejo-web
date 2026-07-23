'use client'

import { useEffect, useRef, useState } from 'react'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'

type Theme = 'dark' | 'light'

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
  document.documentElement.style.colorScheme = theme
}

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)
  const lastToggleAt = useRef(0)

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
    const now = Date.now()
    if (now - lastToggleAt.current < 180) return
    lastToggleAt.current = now
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      applyTheme(next)
      window.localStorage.setItem('plosorejo-theme', next)
      return next
    })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`site-header__icon-btn touch-manipulation ${className}`}
      style={{ position: 'relative', zIndex: 2 }}
      aria-label={theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
      title={theme === 'dark' ? 'Mode terang' : 'Mode gelap'}
    >
      {mounted && theme === 'light' ? (
        <MoonIcon className="w-5 h-5 pointer-events-none" aria-hidden="true" />
      ) : (
        <SunIcon className="w-5 h-5 pointer-events-none" aria-hidden="true" />
      )}
    </button>
  )
}
