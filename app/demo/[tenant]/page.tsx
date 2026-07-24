import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import plosorejo from '@/content/tenants/plosorejo.json'
import sumberejo from '@/content/tenants/sumberejo.json'

const map = {
  plosorejo,
  sumberejo,
} as const

type TenantId = keyof typeof map

export function generateStaticParams() {
  return Object.keys(map).map((tenant) => ({ tenant }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string }>
}): Promise<Metadata> {
  const { tenant } = await params
  const t = map[tenant as TenantId]
  if (!t) return { title: 'Demo' }
  return {
    title: `Demo ${t.nama} — White-Label`,
    description: `${t.tagline}. Demo multi-desa Padukuhan Digital.`,
  }
}

export default async function TenantDemoPage({
  params,
}: {
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params
  const t = map[tenant as TenantId]
  if (!t) notFound()

  const isAlt = tenant === 'sumberejo'

  return (
    <div
      className="min-h-[70vh]"
      style={
        {
          // tenant skin for demo only
          ['--tenant-gold' as string]: t.theme.gold,
          ['--tenant-bg' as string]: t.theme.bg,
        } as React.CSSProperties
      }
    >
      <section
        className="relative overflow-hidden rounded-none md:rounded-3xl md:mx-6 md:mt-6 border"
        style={{
          background: `radial-gradient(ellipse at top, ${t.theme.gold}22, transparent 55%), ${t.theme.bg}`,
          borderColor: `${t.theme.gold}44`,
        }}
      >
        <div className="page-shell py-14 md:py-20 space-y-8">
          <p
            className="text-xs font-bold uppercase tracking-[0.2em]"
            style={{ color: t.theme.goldSoft }}
          >
            {t.subtitle}
          </p>
          <h1
            className="text-4xl md:text-6xl font-black leading-tight max-w-3xl"
            style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              color: '#f8fafc',
            }}
          >
            {t.nama}
            <span className="block mt-2" style={{ color: t.theme.gold }}>
              {t.tagline}
            </span>
          </h1>
          <p className="text-base max-w-xl" style={{ color: '#cbd5e1' }}>
            {t.alamat}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
            {t.stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-4 border"
                style={{
                  borderColor: `${t.theme.gold}33`,
                  background: 'rgba(0,0,0,0.35)',
                }}
              >
                <p className="text-2xl font-black tabular-nums" style={{ color: t.theme.gold }}>
                  {s.value}
                </p>
                <p className="text-xs uppercase tracking-wide" style={{ color: '#94a3b8' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <ul className="space-y-2 max-w-lg">
            {t.highlights.map((h) => (
              <li key={h} className="text-sm flex gap-2" style={{ color: '#e2e8f0' }}>
                <span style={{ color: t.theme.gold }}>✓</span>
                {h}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={isAlt ? '/demo' : '/layanan/ajukan'}
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-bold"
              style={{
                background: `linear-gradient(135deg, ${t.theme.gold}, ${t.theme.goldSoft})`,
                color: isAlt ? '#042f2e' : '#1a1408',
              }}
            >
              {isAlt ? 'Kembali ke daftar demo' : 'Coba ajukan surat'}
            </Link>
            <Link
              href="/proposal"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold border"
              style={{ borderColor: `${t.theme.gold}66`, color: t.theme.goldSoft }}
            >
              Proposal 100 jt
            </Link>
            {!isAlt && (
              <Link
                href="/demo/sumberejo"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold border"
                style={{ borderColor: '#334155', color: '#94a3b8' }}
              >
                Lihat branding desa lain →
              </Link>
            )}
          </div>

          {isAlt && (
            <p className="text-xs max-w-xl" style={{ color: '#64748b' }}>
              Ini skin demo <strong style={{ color: t.theme.gold }}>Sumberejo</strong> — data fiktif untuk
              pitch white-label. Production tenant pakai domain/subdomain + CMS terpisah.
            </p>
          )}
        </div>
      </section>

      <div className="page-shell py-10 grid md:grid-cols-3 gap-4">
        {[
          { t: 'Modul warga', d: 'Surat online, status, agenda, darurat, peta' },
          { t: 'Modul ekonomi', d: 'UMKM order WA, katalog, sektor' },
          { t: 'Modul ops', d: 'Admin PIN, Sanity CMS, Merapi live' },
        ].map((c) => (
          <div key={c.t} className="card-surface p-5">
            <p className="font-bold" style={{ color: t.theme.gold }}>
              {c.t}
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
              {c.d}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
