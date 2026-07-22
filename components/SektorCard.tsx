'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Icon from '@/components/Icon'
import { fadeUp } from '@/components/motion'

interface SektorCardProps {
  href: string
  icon: string
  nama: string
  deskripsi: string
  stats: { label: string; value: string }[]
  accent?: 'amber' | 'green' | 'indigo'
}

export default function SektorCard({
  href,
  icon,
  nama,
  deskripsi,
  stats,
}: SektorCardProps) {
  const color = 'var(--gold)'

  return (
    <motion.div variants={fadeUp} className="h-full">
      <Link
        href={href}
        className="card-surface group p-5 flex flex-col gap-4 h-full relative overflow-hidden"
        aria-label={`Lihat sektor ${nama}`}
      >
        <div
          className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: color }}
          aria-hidden="true"
        />

        <div className="relative flex items-center gap-3">
          <span
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${color}18`, color }}
            aria-hidden="true"
          >
            <Icon name={icon || nama} size={20} />
          </span>
          <h3
            className="font-bold group-hover:underline underline-offset-2"
            style={{ color: 'var(--text)' }}
          >
            {nama}
          </h3>
        </div>

        <p className="relative text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--muted)' }}>
          {deskripsi}
        </p>

        {stats.length > 0 && (
          <div
            className="relative grid grid-cols-2 gap-2 mt-auto pt-3 border-t"
            style={{ borderColor: 'var(--border)' }}
          >
            {stats.slice(0, 2).map(({ label, value }) => (
              <div key={label}>
                <p className="text-sm font-bold tabular-nums" style={{ color }}>
                  {value}
                </p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        )}

        <span
          className="relative text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0"
          style={{ color }}
        >
          Jelajahi sektor →
        </span>
      </Link>
    </motion.div>
  )
}
