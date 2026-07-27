import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import UMKMCatalog from '@/components/UMKMCatalog'
import { getSektorMap, getUMKMList, getSiteSettings } from '@/lib/data'
import { waLink } from '@/lib/site'

export const metadata: Metadata = {
  title: 'UMKM Padukuhan',
  description: 'Direktori lengkap UMKM aktif di Padukuhan Plosorejo — kuliner, kerajinan, jasa, dan pertanian.',
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
    <div className="page-shell pb-16">

      {/* ── Header ── */}
      <div className="px-4 pt-4 pb-6">
        <PageHeader
          eyebrow="Sektor Ekonomi"
          title="UMKM"
          highlight="Padukuhan"
          description={sektor.deskripsi}
          backLabel="Sektor"
          backHref="/sektor"
        />
      </div>

      {/* ── Stats horizontal scroll ── */}
      {sektor.stats.length > 0 && (
        <section aria-label="Statistik UMKM" className="mb-6">
          <p className="px-4 mb-2 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted)' }}>
            Ringkasan
          </p>
          <div className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-none snap-x snap-mandatory">
            {sektor.stats.map(({ label, value }) => (
              <div
                key={label}
                className="flex-shrink-0 snap-start w-28 rounded-2xl p-3 text-center"
                style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <p className="text-lg font-black tabular-nums" style={{ color: 'var(--gold)' }}>{value}</p>
                <p className="text-[10px] mt-0.5 leading-tight" style={{ color: 'var(--muted)' }}>{label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Bidang usaha — iOS grouped list ── */}
      {sektor.items.length > 0 && (
        <section aria-label="Bidang usaha" className="mb-6">
          <p className="px-4 mb-2 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted)' }}>
            Bidang Usaha
          </p>
          <div
            className="mx-4 rounded-2xl overflow-hidden"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            {sektor.items.map((item, i) => (
              <div
                key={item}
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderTop: i > 0 ? '1px solid var(--border)' : undefined }}
              >
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                  style={{ backgroundColor: 'rgba(212,175,55,0.12)' }}
                  aria-hidden="true"
                >🏪</span>
                <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{item}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Direktori usaha ── */}
      <section aria-label="Direktori UMKM" className="mb-6">
        <p className="px-4 mb-2 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted)' }}>
          Direktori Usaha
        </p>
        <div className="px-4">
          <UMKMCatalog items={items} />
        </div>
      </section>

      {/* ── CTA daftar — iOS info card ── */}
      <section aria-label="Daftarkan UMKM" className="px-4">
        <div
          className="rounded-2xl p-5 flex flex-col items-start gap-3"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            background: 'linear-gradient(135deg, rgba(212,175,55,0.07), rgba(212,175,55,0.03))',
          }}
        >
          <div>
            <p className="font-black text-base" style={{ color: 'var(--text)' }}>
              Punya usaha di Plosorejo?
            </p>
            <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>
              Tingkatkan visibilitas usaha Anda dan jangkau lebih banyak pelanggan melalui portal desa.
            </p>
          </div>
          <a
            href={waLink(site.whatsapp, 'Saya ingin mendaftarkan UMKM saya di Padukuhan Plosorejo')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm"
          >
            Daftar via WhatsApp
          </a>
        </div>
      </section>

    </div>
  )
}
