'use client'

import StatCounter from '@/components/StatCounter'

const stats = [
  { value: '658',  label: 'Jiwa' },
  { value: '4',    label: 'RT' },
  { value: '142',  label: 'Sapi Perah' },
  { value: '8',    label: 'UMKM' },
  { value: '3',    label: 'Destinasi Wisata' },
]

export default function StatsBar() {
  return (
    <div
      className="w-full py-10 px-6"
      style={{ backgroundColor: 'var(--s1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
      aria-label="Statistik padukuhan"
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-0">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center">
              {/* Stat */}
              <div className="flex-1">
                <StatCounter value={stat.value} label={stat.label} />
              </div>
              {/* Separator — hidden on last, hidden on mobile */}
              {i < stats.length - 1 && (
                <div
                  className="hidden md:block w-px self-stretch mx-2 opacity-30"
                  style={{ backgroundColor: 'var(--border)' }}
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
