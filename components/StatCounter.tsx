'use client'

import { useEffect, useRef, useState } from 'react'

interface StatCounterProps {
  value: string
  label: string
}

/**
 * Always shows the real value first.
 * Optional count-up is a progressive enhancement that never leaves "0" stuck.
 */
export default function StatCounter({ value, label }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null)

  const numericMatch = value.match(/^([\d.,]+)(.*)$/)
  const numericRaw = numericMatch
    ? numericMatch[1].replace(/\./g, '').replace(',', '.')
    : '0'
  const suffix = numericMatch ? numericMatch[2] : ''
  const target = parseFloat(numericRaw)
  const isFloat = numericRaw.includes('.')

  const format = (n: number) => {
    if (Number.isNaN(n)) return value
    if (isFloat) return n.toFixed(1).replace('.', ',')
    return Math.round(n).toLocaleString('id-ID')
  }

  // Start with the final value so mobile never shows "0"
  const [displayed, setDisplayed] = useState(() => format(target))

  useEffect(() => {
    const el = ref.current
    if (!el || Number.isNaN(target) || target === 0) return

    let raf = 0
    let started = false

    const animate = () => {
      if (started) return
      started = true
      const duration = 1000
      const start = performance.now()

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplayed(format(eased * target))
        if (progress < 1) raf = requestAnimationFrame(tick)
        else setDisplayed(format(target))
      }

      // Restart from 0 only once we know we're visible
      setDisplayed(format(0))
      raf = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate()
          observer.disconnect()
        }
      },
      { threshold: 0.01, rootMargin: '100px 0px' },
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, isFloat, value])

  return (
    <div ref={ref} className="flex flex-col items-center gap-1.5 text-center">
      <span
        className="text-3xl md:text-4xl font-black tabular-nums leading-none"
        style={{
          color: 'var(--gold)',
          textShadow: '0 0 28px rgba(212,175,55,0.18)',
        }}
        aria-label={`${value} ${label}`}
      >
        {displayed}
        {suffix}
      </span>
      <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
        {label}
      </span>
    </div>
  )
}
