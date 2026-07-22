'use client'

import { useEffect, useRef, useState } from 'react'

interface StatCounterProps {
  value: string
  label: string
}

/**
 * Animated numeric counter — counts up from 0 to `value` when it enters the viewport.
 * Non-numeric suffixes (e.g. " Jiwa", " RT") are preserved and appended after the number.
 */
export default function StatCounter({ value, label }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [displayed, setDisplayed] = useState('0')
  const [hasAnimated, setHasAnimated] = useState(false)

  const numericMatch = value.match(/^([\d.,]+)(.*)$/)
  const numericRaw = numericMatch ? numericMatch[1].replace(/\./g, '').replace(',', '.') : '0'
  const suffix = numericMatch ? numericMatch[2] : value
  const target = parseFloat(numericRaw)
  const isFloat = numericRaw.includes('.')

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const duration = 1400
          const start = performance.now()

          const tick = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            const current = eased * target

            if (isFloat) {
              setDisplayed(current.toFixed(1).replace('.', ','))
            } else {
              const rounded = Math.round(current)
              setDisplayed(rounded.toLocaleString('id-ID'))
            }

            if (progress < 1) requestAnimationFrame(tick)
          }

          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, isFloat, hasAnimated])

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
