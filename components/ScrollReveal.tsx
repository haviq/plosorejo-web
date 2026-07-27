'use client'
import { useEffect, useRef } from 'react'

export default function ScrollReveal({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    const items = ref.current.querySelectorAll('.reveal-item')
    items.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return <div ref={ref} className={className}>{children}</div>
}
