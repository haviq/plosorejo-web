'use client'

import { useEffect, useRef, useState } from 'react'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'

type Theme = 'dark' | 'light'

const STORAGE_KEY = 'plosorejo-theme'

function readTheme(): Theme {
  try {
    const attr = document.documentElement.getAttribute('data-theme')
    if (attr === 'light' || attr === 'dark') return attr
  } catch {
    /* ignore */
  }
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* ignore */
  }
  try {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.setAttribute('data-theme', theme)
  root.style.colorScheme = theme
  try {
    window.localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* ignore */
  }
}

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)
  const lastToggleAt = useRef(0)

  useEffect(() => {
    const preferred = readTheme()
    setTheme(preferred)
    applyTheme(preferred)
    setMounted(true)

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
        setTheme(e.newValue)
        applyTheme(e.newValue)
      }
    }
    const onCustom = (e: Event) => {
      const next = (e as CustomEvent<Theme>).detail
      if (next === 'light' || next === 'dark') {
        setTheme(next)
        applyTheme(next)
      }
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener('plosorejo-theme', onCustom as EventListener)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('plosorejo-theme', onCustom as EventListener)
    }
  }, [])

  const toggle = () => {
    const now = Date.now()
    // Single gate — blocks pointerup+click double fire without extra listeners
    if (now - lastToggleAt.current < 400) return
    lastToggleAt.current = now
    const current = readTheme()
    const next: Theme = current === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    setTheme(next)
    try {
      window.dispatchEvent(new CustomEvent('plosorejo-theme', { detail: next }))
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      className={`site-header__icon-btn touch-manipulation ${className}`.trim()}
      data-theme-toggle="1"
      aria-label={theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
      title={theme === 'dark' ? 'Mode terang' : 'Mode gelap'}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle()
      }}
      style={{
        color: '#f0c040',
        borderColor: 'rgba(240,192,64,0.9)',
        background: 'rgba(8,8,8,0.92)',
        boxShadow: '0 0 0 1px rgba(240,192,64,0.4), 0 2px 10px rgba(0,0,0,0.45)',
      }}
    >
      {mounted && theme === 'light' ? (
        <MoonIcon className="w-5 h-5 pointer-events-none" aria-hidden="true" strokeWidth={2.4} />
      ) : (
        <SunIcon className="w-5 h-5 pointer-events-none" aria-hidden="true" strokeWidth={2.4} />
      )}
    </button>
  )
}
