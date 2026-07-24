import type { Metadata } from 'next'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import Icon from '@/components/Icon'
import MerapiStatusServer from '@/components/MerapiStatusServer'
import { getDaruratData, getSiteSettings } from '@/lib/data'
import { formatWaDisplay, isPlaceholderWa, normalizeWa, waLink } from '@/lib/site'
import { safeOfficialHref } from '@/lib/safe-url'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Info Darurat & Nomor Penting',
  description:
    'Status Merapi, titik kumpul, jalur evakuasi, dan nomor penting Padukuhan Plosorejo, Cangkringan.',
}

function telHref(raw?: string): string | null {
  if (!raw) return null
  const digits = raw.replace(/\D/g, '')
  if (!digits) return null
  // short emergency numbers (119, 112)
  if (digits.length <= 4) return `tel:${digits}`
  const wa = normalizeWa(raw)
  if (wa && !isPlaceholderWa(wa)) return `tel:+${wa}`
  return `tel:${digits}`
}

export default async function DaruratPage() {
  const [darurat, site] = await Promise.all([getDaruratData(), getSiteSettings()])

  return (
    <div className="page-shell space-y-10">
      <PageHeader
        eyebrow="Kesiapsiagaan"
        title="Info"
        highlight="Darurat"
        description="Status Merapi, titik kumpul, dan nomor penting. Simpan halaman ini di HP (PWA) agar cepat dibuka saat dibutuhkan."
      />

      <MerapiStatusServer />

      <section className="grid md:grid-cols-2 gap-4">
        <div className="card-surface p-5 space-y-2">
          <p className="text-xs uppercase tracking-wider font-bold" style={{ color: 'var(--gold)' }}>
            Titik kumpul
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
            {darurat.titikKumpul}
          </p>
        </div>
        <div className="card-surface p-5 space-y-2">
          <p className="text-xs uppercase tracking-wider font-bold" style={{ color: 'var(--gold)' }}>
            Jalur evakuasi
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
            {darurat.jalurEvakuasi}
          </p>
        </div>
      </section>

      <section className="space-y-4" aria-label="Nomor penting">
        <h2 className="section-label">Nomor penting</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {darurat.kontak.map((k) => {
            const phone = telHref(k.telepon)
            const wa =
              k.telepon && !isPlaceholderWa(k.telepon) && normalizeWa(k.telepon).length >= 10
                ? waLink(k.telepon, 'Halo, saya butuh bantuan terkait kondisi di Plosorejo.')
                : null
            const web = safeOfficialHref(k.url)

            return (
              <article key={k.id} className="card-surface p-4 flex flex-col gap-2">
                <div className="flex items-start gap-3">
                  <span
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--gold-glow)', color: 'var(--gold)' }}
                  >
                    <Icon name={k.kategori === 'Kesehatan' ? 'kesehatan' : 'phone'} size={18} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>
                      {k.nama}
                    </h3>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>
                      {k.jabatan} · {k.kategori}
                    </p>
                    {k.telepon ? (
                      <p className="text-sm mt-1 font-semibold tabular-nums" style={{ color: 'var(--gold)' }}>
                        {k.telepon.length <= 4
                          ? k.telepon
                          : formatWaDisplay(k.telepon) !== 'Belum diisi (admin)'
                            ? formatWaDisplay(k.telepon)
                            : k.telepon}
                      </p>
                    ) : null}
                    {k.catatan ? (
                      <p className="text-xs mt-1" style={{ color: 'var(--muted2)' }}>
                        {k.catatan}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-auto pt-1">
                  {phone && (
                    <a href={phone} className="btn-primary text-xs px-3 py-2 min-h-0">
                      Telepon
                    </a>
                  )}
                  {wa && wa !== '#' && (
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost text-xs px-3 py-2 min-h-0"
                    >
                      WhatsApp
                    </a>
                  )}
                  {web && (
                    <a
                      href={web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost text-xs px-3 py-2 min-h-0"
                    >
                      Buka situs
                    </a>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="surface-panel p-6 text-center space-y-3">
        <h2 className="section-heading text-xl">Butuh bantuan padukuhan?</h2>
        <p className="text-sm max-w-lg mx-auto" style={{ color: 'var(--muted)' }}>
          Hubungi admin padukuhan atau lihat peta titik penting.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={waLink(site.whatsapp, 'Halo, saya butuh bantuan darurat di Plosorejo.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            WA Padukuhan
          </a>
          <Link href="/peta" className="btn-ghost">
            Buka peta
          </Link>
        </div>
      </section>
    </div>
  )
}
