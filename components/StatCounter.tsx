'use client'

import { useEffect, useRef, useState } from 'react'

interface StatCounterProps {
  value: string
  label: string
}

/**
 * Animated numeric counter — counts up from 0 to `value` when it enters the viewport.
 * Falls back to the final value if the observer never fires (common on some mobile WebViews).
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

  const formatFinal = () => {
    if (Number.isNaN(target)) return value
    if (isFloat) return target.toFixed(1).replace('.', ',')
    return Math.round(target).toLocaleString('id-ID')
  }

  useEffect(() => {
    const el = ref.current
    if (!el || hasAnimated) return

    let raf = 0
    let done = false

    const run = () => {
      if (done) return
      done = true
      setHasAnimated(true)
      const duration = 1200
      const start = performance.now()

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        const current = eased * target

        if (isFloat) {
          setDisplayed(current.toFixed(1).replace('.', ','))
        } else {
          setDisplayed(Math.round(current).toLocaleString('id-ID'))
        }

        if (progress < 1) {
          raf = requestAnimationFrame(tick)
        } else {
          setDisplayed(formatFinal())
        }
      }

      raf = requestAnimationFrame(tick)
    }

    // Fallback: always show final value if observer never triggers
    const fallback = window.setTimeout(() => {
      if (!done) {
        setHasAnimated(true)
        setDisplayed(formatFinal())
      }
    }, 1800)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run()
          observer.disconnect()
          window.clearTimeout(fallback)
        }
      },
      { threshold: 0.05, rootMargin: '60px 0px' },
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      window.clearTimeout(fallback)
      if (raf) cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, isFloat, hasAnimated, value])

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
