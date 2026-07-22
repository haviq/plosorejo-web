'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { formatTanggal } from '@/lib/utils'
import { fadeUp } from '@/components/motion'

interface BeritaCardProps {
  slug: string
  judul: string
  tanggal: string
  kategori: string
  ringkasan: string
}

export default function BeritaCard({
  slug,
  judul,
  tanggal,
  kategori,
  ringkasan,
}: BeritaCardProps) {
  const color = 'var(--gold)'

  return (
    <motion.div variants={fadeUp} className="h-full">
      <Link
        href={`/berita/${slug}`}
        className="card-surface group p-5 flex flex-col gap-3 h-full relative overflow-hidden"
        aria-label={`Baca berita: ${judul}`}
      >
        <div
          className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          }}
          aria-hidden="true"
        />

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="badge" style={{ color, backgroundColor: `${color}18` }}>
            {kategori}
          </span>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {formatTanggal(tanggal)}
          </span>
        </div>

        <h3
          className="font-bold leading-snug line-clamp-2 group-hover:underline underline-offset-2"
          style={{
            color: 'var(--text)',
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: '1.05rem',
          }}
        >
          {judul}
        </h3>

        <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--muted)' }}>
          {ringkasan}
        </p>

        <span
          className="text-xs mt-auto font-semibold inline-flex items-center gap-1 transition-transform duration-300 group-hover:translate-x-1"
          style={{ color: 'var(--gold)' }}
        >
          Baca selengkapnya
          <span aria-hidden="true">→</span>
        </span>
      </Link>
    </motion.div>
  )
}
