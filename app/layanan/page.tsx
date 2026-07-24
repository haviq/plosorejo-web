import type { Metadata } from 'next'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import Icon from '@/components/Icon'
import { getLayananList, getSiteSettings } from '@/lib/data'
import { waLink } from '@/lib/site'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Layanan Administrasi',
  description:
    'Daftar layanan administrasi Padukuhan Plosorejo — syarat, alur, waktu, dan biaya pengurusan surat.',
}

export default async function LayananPage() {
  const [layanan, site] = await Promise.all([getLayananList(), getSiteSettings()])

  return (
    <div className="page-shell space-y-12">
      <PageHeader
        eyebrow="Pelayanan warga"
        title="Layanan"
        highlight="Administrasi"
        description="Syarat, alur, dan estimasi waktu pengurusan surat di balai padukuhan. Datang pada jam layanan atau hubungi petugas via WhatsApp."
      />

      <section className="grid sm:grid-cols-3 gap-4" aria-label="Info layanan">
        {[
          { label: 'Jam layanan', value: site.jamLayanan, icon: 'clock' },
          { label: 'Lokasi', value: 'Balai Padukuhan Plosorejo', icon: 'home' },
          { label: 'Biaya default', value: 'Gratis (kecuali disebutkan)', icon: 'money' },
        ].map((item) => (
          <div key={item.label} className="card-surface p-4 flex items-start gap-3">
            <span
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--gold-glow)', color: 'var(--gold)' }}
            >
              <Icon name={item.icon} size={18} />
            </span>
            <div>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>{item.label}</p>
              <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--text)' }}>{item.value}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-4" aria-label="Daftar layanan">
        <h2 className="section-label">Daftar layanan</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {layanan.map((item) => (
            <article key={item.id} className="card-surface p-5 space-y-4 h-full flex flex-col">
              <div className="flex items-start gap-3">
                <span
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--gold-glow)', color: 'var(--gold)' }}
                >
                  <Icon name={item.icon || 'document'} size={20} />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="badge" style={{ color: 'var(--gold)', background: 'var(--gold-glow)' }}>
                      {item.kategori}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>{item.waktu}</span>
                  </div>
                  <h3 className="font-bold" style={{ color: 'var(--text)' }}>{item.nama}</h3>
                  <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {item.deskripsi}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg p-3" style={{ background: 'var(--surface-soft)' }}>
                  <p style={{ color: 'var(--muted)' }}>Biaya</p>
                  <p className="font-semibold mt-0.5" style={{ color: 'var(--text)' }}>{item.biaya}</p>
                </div>
                <div className="rounded-lg p-3" style={{ background: 'var(--surface-soft)' }}>
                  <p style={{ color: 'var(--muted)' }}>PIC</p>
                  <p className="font-semibold mt-0.5" style={{ color: 'var(--text)' }}>{item.pic}</p>
                </div>
              </div>

              {item.syarat.length > 0 && (
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--gold)' }}>Syarat</p>
                  <ul className="space-y-1.5">
                    {item.syarat.map((s) => (
                      <li key={s} className="text-sm flex gap-2" style={{ color: 'var(--text)' }}>
                        <span style={{ color: 'var(--gold)' }}>•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {item.alur.length > 0 && (
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--gold)' }}>Alur</p>
                  <ol className="space-y-1.5">
                    {item.alur.map((step, i) => (
                      <li key={step} className="text-sm flex gap-2" style={{ color: 'var(--text)' }}>
                        <span className="font-semibold tabular-nums" style={{ color: 'var(--gold)' }}>{i + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="mt-auto pt-2 flex flex-col gap-2">
                <Link
                  href={`/layanan/ajukan?layanan=${item.id}`}
                  className="btn-primary w-full text-sm text-center"
                >
                  Ajukan online →
                </Link>
                <a
                  href={waLink(
                    site.whatsapp,
                    `Halo, saya ingin bertanya tentang layanan: ${item.nama}`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost w-full text-sm"
                >
                  Tanya via WhatsApp
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="surface-panel p-6 md:p-8 text-center space-y-3">
        <h2 className="section-heading text-2xl">Ajukan surat tanpa antre dulu?</h2>
        <p className="text-sm max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
          Isi form online, kirim ke WhatsApp petugas, lalu datang tinggal melengkapi syarat.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link href="/layanan/ajukan" className="btn-primary">
            Form pengajuan online
          </Link>
          <a
            href={waLink(site.whatsapp, 'Halo, saya ingin bertanya tentang layanan administrasi padukuhan.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            Chat WhatsApp
          </a>
          <Link href="/kontak" className="btn-ghost">
            Halaman kontak
          </Link>
        </div>
      </section>
    </div>
  )
}
