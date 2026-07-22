import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import KontakForm from '@/components/KontakForm'
import Icon from '@/components/Icon'

export const metadata: Metadata = {
  title: 'Kontak',
  description: 'Hubungi perangkat Padukuhan Plosorejo — alamat, telepon, dan lokasi di Google Maps.',
}

const kontakList = [
  {
    icon: 'home',
    label: 'Alamat',
    value: 'Jl. Balong, Padukuhan Plosorejo, Kalurahan Umbulharjo, Kapanewon Cangkringan, Kabupaten Sleman, DIY 55583',
  },
  {
    icon: 'phone',
    label: 'Telepon Dukuh',
    value: '+62 812-3456-7890',
  },
  {
    icon: 'phone',
    label: 'WhatsApp',
    value: '+62 812-3456-7890',
  },
  {
    icon: 'email',
    label: 'Email',
    value: 'padukuhan.plosorejo@gmail.com',
  },
  {
    icon: 'clock',
    label: 'Jam Pelayanan',
    value: 'Senin – Jumat: 08.00 – 14.00 WIB',
  },
]

const perangkat = [
  { nama: 'Slamet Widodo', jabatan: 'Dukuh / Kepala Padukuhan', wa: '6281234567890', icon: 'people' },
  { nama: 'Sri Lestari', jabatan: 'Sekretaris Padukuhan', wa: '6281234567891', icon: 'chart' },
  { nama: 'Agus Prayitno', jabatan: 'Bendahara Padukuhan', wa: '6281234567892', icon: 'money' },
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
        <section className="space-y-4" aria-label="Informasi kontak">
          <h2 className="section-label">Informasi Kontak</h2>
          <div className="card-surface divide-y" style={{ borderColor: 'var(--border)' }}>
            {kontakList.map(({ icon, label, value }) => (
              <div key={label} className="flex items-start gap-4 p-4" style={{ borderColor: 'var(--border)' }}>
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold)' }}
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
        </section>

        <section className="space-y-4" aria-label="Kontak perangkat desa">
          <h2 className="section-label">Perangkat Padukuhan</h2>
          <div className="space-y-3">
            {perangkat.map(({ nama, jabatan, wa, icon }) => (
              <div key={nama} className="card-surface p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(212,175,55,0.15)', color: 'var(--gold)' }}
                    aria-hidden="true"
                  >
                    <Icon name={icon} size={18} />
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

          <div className="card-surface p-5 space-y-4 mt-4">
            <h3 className="font-semibold" style={{ color: 'var(--text)' }}>Kirim Pesan</h3>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Isi form di bawah ini dan kami akan merespons dalam 1×24 jam.
            </p>
            <KontakForm />
          </div>
        </section>
      </div>
    </div>
  )
}
