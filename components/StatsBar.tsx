'use client'

import { motion } from 'framer-motion'
import StatCounter from '@/components/StatCounter'
import { fadeUp, staggerContainer } from '@/components/motion'

const stats = [
  { value: '658', label: 'Jiwa' },
  { value: '4', label: 'RT' },
  { value: '312', label: 'Sapi Perah' },
  { value: '89', label: 'UMKM' },
  { value: '3', label: 'Destinasi Wisata' },
]

export default function StatsBar() {
  return (
    <div
      className="w-full py-12 px-6 relative overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, rgba(17,17,17,1) 0%, rgba(12,12,12,1) 100%)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
      aria-label="Statistik padukuhan"
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(212,175,55,0.08), transparent 65%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          {stats.map((stat, i) => (
            <motion.div key={stat.label} className="flex items-center" variants={fadeUp}>
              <div className="flex-1">
                <StatCounter value={stat.value} label={stat.label} />
              </div>
              {i < stats.length - 1 && (
                <div
                  className="hidden md:block w-px self-stretch mx-2 opacity-40"
                  style={{
                    background:
                      'linear-gradient(to bottom, transparent, var(--gold-dim), transparent)',
                  }}
                  aria-hidden="true"
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
