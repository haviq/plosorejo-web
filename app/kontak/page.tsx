import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'

export const metadata: Metadata = {
  title: 'Kontak',
  description: 'Hubungi perangkat Padukuhan Plosorejo — alamat, telepon, dan lokasi di Google Maps.',
}

const kontakList = [
  {
    icon: '🏠',
    label: 'Alamat',
    value: 'Jl. Balong, Padukuhan Plosorejo, Kalurahan Umbulharjo, Kapanewon Cangkringan, Kabupaten Sleman, DIY 55583',
  },
  {
    icon: '📞',
    label: 'Telepon Dukuh',
    value: '+62 812-3456-7890',
  },
  {
    icon: '📱',
    label: 'WhatsApp',
    value: '+62 812-3456-7890',
  },
  {
    icon: '✉️',
    label: 'Email',
    value: 'padukuhan.plosorejo@gmail.com',
  },
  {
    icon: '🕐',
    label: 'Jam Pelayanan',
    value: 'Senin – Jumat: 08.00 – 14.00 WIB',
  },
]

const perangkat = [
  { nama: 'Slamet Widodo', jabatan: 'Dukuh / Kepala Padukuhan', wa: '6281234567890', icon: '👑' },
  { nama: 'Sri Lestari', jabatan: 'Sekretaris Padukuhan', wa: '6281234567891', icon: '📋' },
  { nama: 'Agus Prayitno', jabatan: 'Bendahara Padukuhan', wa: '6281234567892', icon: '💰' },
]

export default function KontakPage() {
  return (
    <div className="page-shell space-y-14">
      <PageHeader
        eyebrow="Hubungi Kami"
        title="Kontak"
        highlight="Padukuhan"
        description="Hubungi perangkat Padukuhan Plosorejo untuk informasi lebih lanjut, pengaduan, atau keperluan administrasi."
      />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Info Kontak */}
        <section className="space-y-4" aria-label="Informasi kontak">
          <h2 className="section-label">Informasi Kontak</h2>
          <div className="card-surface divide-y" style={{ '--tw-divide-opacity': '1' } as React.CSSProperties}>
            {kontakList.map(({ icon, label, value }) => (
              <div key={label} className="flex items-start gap-4 p-4" style={{ borderColor: 'var(--border)' }}>
                <span className="text-xl mt-0.5 flex-shrink-0" aria-hidden="true">{icon}</span>
                <div>
                  <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{label}</p>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--text)' }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Perangkat Desa */}
        <section className="space-y-4" aria-label="Kontak perangkat desa">
          <h2 className="section-label">Perangkat Padukuhan</h2>
          <div className="space-y-3">
            {perangkat.map(({ nama, jabatan, wa, icon }) => (
              <div key={nama} className="card-surface p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: 'var(--gold-dim)' }} aria-hidden="true">
                    {icon}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{nama}</p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>{jabatan}</p>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${wa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-xs py-1.5 px-3 flex-shrink-0"
                  aria-label={`WhatsApp ${nama}`}
                >
                  WA
                </a>
              </div>
            ))}
          </div>

          {/* Kirim Pesan */}
          <div className="card-surface p-5 space-y-4 mt-4">
            <h3 className="font-semibold" style={{ color: 'var(--text)' }}>Kirim Pesan</h3>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Isi form di bawah ini dan kami akan merespons dalam 1×24 jam.
            </p>
            <div className="space-y-3" aria-label="Form pesan ke padukuhan">
              <div>
                <label htmlFor="nama-pengirim" className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>Nama</label>
                <input
                  id="nama-pengirim"
                  type="text"
                  placeholder="Nama Anda"
                  className="w-full rounded-lg px-3 py-2 text-sm border outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--s2)',
                    borderColor: 'var(--border)',
                    color: 'var(--text)',
                  }}
                />
              </div>
              <div>
                <label htmlFor="pesan" className="block text-xs mb-1" style={{ color: 'var(--muted)' }}>Pesan</label>
                <textarea
                  id="pesan"
                  rows={3}
                  placeholder="Tulis pesan Anda..."
                  className="w-full rounded-lg px-3 py-2 text-sm border outline-none transition-colors resize-none"
                  style={{
                    backgroundColor: 'var(--s2)',
                    borderColor: 'var(--border)',
                    color: 'var(--text)',
                  }}
                />
              </div>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full text-center block"
              >
                Kirim via WhatsApp
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Google Maps */}
      <section aria-label="Lokasi padukuhan di peta" className="space-y-4">
        <h2 className="section-label">Lokasi Padukuhan</h2>
        <div className="card-surface overflow-hidden">
          <iframe
            src="https://www.google.com/maps?q=-7.62428,110.43829&hl=id&z=16&output=embed"
            width="100%"
            height="400"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Padukuhan Plosorejo di Google Maps"
          />
        </div>
        <p className="text-xs text-center" style={{ color: 'var(--muted2)' }}>
          Jl. Balong · Padukuhan Plosorejo · Cangkringan, Sleman · 7°37′27″S 110°26′18″E
        </p>
      </section>
    </div>
  )
}
