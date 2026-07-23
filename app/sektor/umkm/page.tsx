import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import UMKMCatalog from '@/components/UMKMCatalog'
import { getSektorMap, getUMKMList, getSiteSettings } from '@/lib/data'
import { waLink } from '@/lib/site'

export const metadata: Metadata = {
  title: 'UMKM Padukuhan',
  description:
    'Direktori lengkap UMKM aktif di Padukuhan Plosorejo — kuliner, kerajinan, jasa, dan pertanian.',
}

export const revalidate = 60

export default async function UMKMPage() {
  const [items, sektorMap, site] = await Promise.all([
    getUMKMList(),
    getSektorMap(),
    getSiteSettings(),
  ])
  const sektor = sektorMap.umkm || {
    nama: 'UMKM',
    deskripsi: 'Direktori UMKM Padukuhan Plosorejo.',
    icon: 'umkm',
    stats: [],
    items: [],
  }

  return (
    <div className="page-shell space-y-10">
      <PageHeader
        eyebrow="Sektor Ekonomi"
        title="UMKM"
        highlight="Padukuhan"
        description={sektor.deskripsi}
      />

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4" aria-label="Statistik UMKM">
        {sektor.stats.map(({ label, value }) => (
          <div key={label} className="card-surface p-4 text-center">
            <p className="stat-value text-xl">{value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              {label}
            </p>
          </div>
        ))}
      </section>

      {sektor.items.length > 0 && (
        <section aria-label="Jenis UMKM">
          <h2 className="section-label mb-3">Bidang Usaha</h2>
          <div className="flex flex-wrap gap-2">
            {sektor.items.map((item) => (
              <span
                key={item}
                className="badge border"
                style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      )}

      <section aria-label="Katalog UMKM" className="space-y-4">
        <h2 className="section-label">Direktori Usaha</h2>
        <UMKMCatalog items={items} />
      </section>

      <section
        className="card-surface p-8 text-center space-y-4"
        style={{
          background:
            'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.05))',
        }}
        aria-label="Daftarkan UMKM"
      >
        <h2
          className="text-xl font-black"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Punya usaha di Plosorejo?{' '}
          <span className="gold-text">Daftarkan sekarang.</span>
        </h2>
        <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--muted)' }}>
          Tingkatkan visibilitas usaha Anda dan jangkau lebih banyak pelanggan melalui portal desa.
        </p>
        <a
          href={waLink(site.whatsapp, 'Saya ingin mendaftarkan UMKM saya di Padukuhan Plosorejo')}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Daftar via WhatsApp
        </a>
      </section>
    </div>
  )
}
