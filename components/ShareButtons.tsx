'use client'

import { shareFacebook, shareWhatsApp, shareX } from '@/lib/site'

interface ShareButtonsProps {
  url: string
  title: string
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const items = [
    { label: 'WhatsApp', href: shareWhatsApp(url, title) },
    { label: 'Facebook', href: shareFacebook(url) },
    { label: 'X', href: shareX(url, title) },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Bagikan berita">
      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
        Bagikan
      </span>
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="badge border transition-opacity hover:opacity-80"
          style={{ borderColor: 'var(--border)', color: 'var(--gold)' }}
        >
          {item.label}
        </a>
      ))}
    </div>
  )
}
