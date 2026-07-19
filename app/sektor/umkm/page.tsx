import type { Metadata } from 'next'
import UMKMCard from '@/components/UMKMCard'
import umkmData from '@/content/umkm.json'
import sektorData from '@/content/sektor.json'

export const metadata: Metadata = {
  title: 'UMKM Padukuhan',
  description: 'Direktori lengkap UMKM aktif di Padukuhan Plosorejo — kuliner, kerajinan, jasa, dan pertanian.',
}

const sektor = sektorData.umkm

export default function UMKMPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">

      {/* Header */}
      <section className="space-y-3">
        <h1 className="text-4xl font-black">
          {sektor.icon} <span className="gradient-text">UMKM</span> Padukuhan
        </h1>
        <p className="text-gray-400 text-sm max-w-xl">{sektor.deskripsi}</p>
      </section>

      {/* Stats */}
      <section
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        aria-label="Statistik UMKM"
      >
        {sektor.stats.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl border p-4 text-center"
            style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
          >
            <p className="text-xl font-bold gradient-text tabular-nums">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </section>

      {/* Jenis UMKM */}
      <section aria-label="Jenis UMKM">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
          Bidang Usaha
        </h2>
        <div className="flex flex-wrap gap-2">
          {sektor.items.map((item) => (
            <span
              key={item}
              className="px-3 py-1 rounded-full text-xs border"
              style={{ borderColor: 'var(--border)', color: '#9ca3af' }}
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* Katalog */}
      <section aria-label="Katalog UMKM">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-5">
          Direktori Usaha ({umkmData.length} usaha terdaftar)
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {umkmData.map((item) => (
            <UMKMCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* CTA Daftar */}
      <section
        className="rounded-xl border p-8 text-center space-y-3"
        style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.06), rgba(34,197,94,0.06))',
          borderColor: 'var(--border)',
        }}
        aria-label="Daftarkan UMKM"
      >
        <h2 className="text-xl font-black">
          Punya usaha di Plosorejo?{' '}
          <span className="gradient-text">Daftarkan sekarang.</span>
        </h2>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Tingkatkan visibilitas usaha Anda dan jangkau lebih banyak pelanggan melalui portal desa.
        </p>
        <a
          href="https://wa.me/6281234567890?text=Saya%20ingin%20mendaftarkan%20UMKM%20saya%20di%20Padukuhan%20Plosorejo"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2.5 rounded-lg font-semibold text-sm text-black transition-opacity hover:opacity-85"
          style={{ background: 'var(--gradient)' }}
        >
          Daftar via WhatsApp
        </a>
      </section>

    </div>
  )
}
