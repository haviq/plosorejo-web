import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import KontakForm from '@/components/KontakForm'
import Icon from '@/components/Icon'
import { getSiteSettings } from '@/lib/data'
import { formatWaDisplay, waLink } from '@/lib/site'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Kontak',
  description: 'Hubungi perangkat Padukuhan Plosorejo — alamat, telepon, dan lokasi di Google Maps.',
}

export default async function KontakPage() {
  const site = await getSiteSettings()

  const kontakList = [
    { icon: 'home', label: 'Alamat', value: site.alamat },
    { icon: 'phone', label: 'Telepon Dukuh', value: site.telepon || formatWaDisplay(site.whatsapp) },
    { icon: 'phone', label: 'WhatsApp', value: formatWaDisplay(site.whatsapp) },
    { icon: 'email', label: 'Email', value: site.email },
    { icon: 'clock', label: 'Jam Pelayanan', value: site.jamLayanan },
  ]

  return (
    <div className="page-shell space-y-14">
      <PageHeader
        eyebrow="Hubungi Kami"
        title="Kontak"
        highlight="Padukuhan"
        description="Hubungi perangkat Padukuhan Plosorejo untuk informasi lebih lanjut, pengaduan, atau keperluan administrasi."
      />

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="space-y-4" aria-label="Informasi kontak">
          <h2 className="section-label">Informasi Kontak</h2>
          <div className="card-surface divide-y" style={{ borderColor: 'var(--border)' }}>
            {kontakList.map(({ icon, label, value }) => (
              <div key={label} className="flex items-start gap-4 p-4" style={{ borderColor: 'var(--border)' }}>
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: 'var(--gold-glow)', color: 'var(--gold)' }}
                  aria-hidden="true"
                >
                  <Icon name={icon} size={18} />
                </span>
                <div>
                  <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{label}</p>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--text)' }}>{value}</p>
                </div>
              </div>
            ))}
          </div>

          {site.mapsUrl && (
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost w-full"
            >
              Buka di Google Maps →
            </a>
          )}

          <p className="text-xs" style={{ color: 'var(--muted2)' }}>
            Data kontak bisa diubah admin lewat <strong>/studio → Pengaturan Situs</strong>.
          </p>
        </section>

        <section className="space-y-4" aria-label="Kontak perangkat desa">
          <h2 className="section-label">Perangkat Padukuhan</h2>
          <div className="space-y-3">
            {site.perangkat.map(({ nama, jabatan, whatsapp, icon }) => (
              <div key={nama} className="card-surface p-4 flex items-center gap-4">
                <span
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--gold-glow)', color: 'var(--gold)' }}
                  aria-hidden="true"
                >
                  <Icon name={icon || 'people'} size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{nama}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>{jabatan}</p>
                </div>
                <a
                  href={waLink(whatsapp, `Halo ${nama}, saya ingin bertanya terkait padukuhan.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="badge border"
                  style={{ borderColor: 'var(--border)', color: 'var(--gold)' }}
                >
                  WA
                </a>
              </div>
            ))}
          </div>

          <div className="card-surface p-5 space-y-3">
            <h3 className="font-semibold" style={{ color: 'var(--text)' }}>Kirim pesan cepat</h3>
            <KontakForm whatsapp={site.whatsapp} />
          </div>
        </section>
      </div>
    </div>
  )
}
