import type { Metadata } from 'next'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import plosorejo from '@/content/tenants/plosorejo.json'
import sumberejo from '@/content/tenants/sumberejo.json'

export const metadata: Metadata = {
  title: 'Demo Multi-Desa (White-Label)',
  description:
    'Demo platform multi-tenant Padukuhan Digital — satu codebase, branding & data per desa.',
}

const tenants = [plosorejo, sumberejo]

export default function DemoIndexPage() {
  return (
    <div className="page-shell space-y-10">
      <PageHeader
        eyebrow="Platform"
        title="Demo"
        highlight="Multi-Desa"
        description="Satu platform white-label untuk banyak padukuhan/kalurahan. Branding, statistik, dan CTA per tenant — cocok untuk pitch 80–100 juta."
      />

      <section className="grid md:grid-cols-2 gap-5">
        {tenants.map((t) => (
          <article
            key={t.id}
            className="card-surface p-6 space-y-4"
            style={{
              borderColor: `${t.theme.gold}55`,
              boxShadow: `0 0 0 1px ${t.theme.gold}22`,
            }}
          >
            <div className="flex items-center gap-3">
              <span
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-black"
                style={{
                  background: `${t.theme.gold}22`,
                  color: t.theme.gold,
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                }}
              >
                {t.nama.slice(0, 1)}
              </span>
              <div>
                <h2 className="font-bold text-xl" style={{ color: 'var(--text)' }}>
                  {t.nama}
                </h2>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  {t.subtitle}
                </p>
              </div>
            </div>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              {t.tagline}
            </p>
            <ul className="text-sm space-y-1" style={{ color: 'var(--muted)' }}>
              {t.highlights.map((h) => (
                <li key={h}>• {h}</li>
              ))}
            </ul>
            <div className="grid grid-cols-4 gap-2">
              {t.stats.map((s) => (
                <div key={s.label} className="text-center rounded-xl p-2" style={{ background: 'var(--surface-soft)' }}>
                  <p className="font-bold tabular-nums" style={{ color: t.theme.gold }}>
                    {s.value}
                  </p>
                  <p className="text-[10px] uppercase" style={{ color: 'var(--muted)' }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
            <Link
              href={t.primaryHref}
              className="btn-primary w-full text-center"
              style={
                t.id === 'sumberejo'
                  ? { background: `linear-gradient(135deg, ${t.theme.gold}, ${t.theme.goldSoft})`, color: '#042f2e' }
                  : undefined
              }
            >
              Buka {t.nama}
              {'isDemo' in t && t.isDemo ? ' (demo)' : ''}
            </Link>
          </article>
        ))}
      </section>

      <section className="surface-panel p-6 space-y-3">
        <h2 className="section-heading text-xl">Kenapa multi-tenant menaikkan harga?</h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          Klien dinas/BUMDes membeli <strong style={{ color: 'var(--text)' }}>platform + setup N desa + training + SLA 12 bulan</strong>,
          bukan sekadar website satu domain. Lihat rincian di halaman proposal.
        </p>
        <Link href="/proposal" className="btn-primary inline-flex">
          Lihat proposal & BOQ 100 jt →
        </Link>
      </section>
    </div>
  )
}
