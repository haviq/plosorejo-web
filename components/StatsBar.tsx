'use client'

import StatCounter from '@/components/StatCounter'

const stats = [
  { value: '658', label: 'Jiwa' },
  { value: '4', label: 'RT' },
  { value: '312', label: 'Sapi Perah' },
  { value: '89', label: 'UMKM' },
  { value: '3', label: 'Destinasi Wisata' },
]

/** No framer-motion here — pure static grid for max mobile reliability. */
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
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(212,175,55,0.08), transparent 65%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto relative">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-0">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center">
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
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
