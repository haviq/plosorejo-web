import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontak',
  description: 'Hubungi perangkat Padukuhan Plosorejo — alamat, telepon, dan lokasi di Google Maps.',
}

const kontakList = [
  {
    icon: '🏠',
    label: 'Alamat',
    value: 'Padukuhan Plosorejo, Kalurahan Umbulharjo, Kapanewon Cangkringan, Kabupaten Sleman, DIY 55583',
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
  { nama: 'Slamet Widodo',  jabatan: 'Dukuh / Kepala Padukuhan', wa: '6281234567890' },
  { nama: 'Sri Lestari',    jabatan: 'Sekretaris Padukuhan',      wa: '6281234567891' },
  { nama: 'Agus Prayitno',  jabatan: 'Bendahara Padukuhan',       wa: '6281234567892' },
]

export default function KontakPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">

      {/* Header */}
      <section className="space-y-3">
        <h1 className="text-4xl font-black">
          📬 Kontak{' '}
          <span className="gradient-text">Kami</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-xl">
          Hubungi perangkat Padukuhan Plosorejo untuk informasi lebih lanjut, pengaduan,
          atau keperluan administrasi.
        </p>
      </section>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* Info Kontak */}
        <section className="space-y-4" aria-label="Informasi kontak">
          <h2 className="text-lg font-bold text-gray-300">Informasi Kontak</h2>
          <div
            className="rounded-xl border divide-y"
            style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)', '--tw-divide-opacity': '1' } as React.CSSProperties}
          >
            {kontakList.map(({ icon, label, value }) => (
              <div key={label} className="flex items-start gap-4 p-4" style={{ borderColor: 'var(--border)' }}>
                <span className="text-xl mt-0.5 flex-shrink-0" aria-hidden="true">{icon}</span>
                <div>
                  <p className="text-xs text-gray-500 font-medium">{label}</p>
                  <p className="text-sm text-gray-200 mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Perangkat Desa */}
        <section className="space-y-4" aria-label="Kontak perangkat desa">
          <h2 className="text-lg font-bold text-gray-300">Perangkat Padukuhan</h2>
          <div className="space-y-3">
            {perangkat.map(({ nama, jabatan, wa }) => (
              <div
                key={nama}
                className="rounded-xl border p-4 flex items-center justify-between gap-4"
                style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                    style={{ backgroundColor: 'rgba(245,158,11,0.12)' }}
                    aria-hidden="true"
                  >
                    👤
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{nama}</p>
                    <p className="text-xs text-gray-500">{jabatan}</p>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${wa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-black flex-shrink-0 transition-opacity hover:opacity-85"
                  style={{ background: 'var(--gradient)' }}
                  aria-label={`WhatsApp ${nama}`}
                >
                  WA
                </a>
              </div>
            ))}
          </div>

          {/* Formulir singkat */}
          <div
            className="rounded-xl border p-5 space-y-4 mt-4"
            style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
          >
            <h3 className="font-semibold text-white">Kirim Pesan</h3>
            <p className="text-xs text-gray-500">
              Isi form di bawah ini dan kami akan merespons dalam 1×24 jam.
            </p>
            <form
              action={`https://wa.me/6281234567890?text=`}
              target="_blank"
              className="space-y-3"
              aria-label="Form pesan ke padukuhan"
            >
              <div>
                <label htmlFor="nama-pengirim" className="block text-xs text-gray-400 mb-1">Nama</label>
                <input
                  id="nama-pengirim"
                  type="text"
                  placeholder="Nama Anda"
                  className="w-full rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 border outline-none focus:border-amber-500 transition-colors"
                  style={{ backgroundColor: 'var(--s2)', borderColor: 'var(--border)' }}
                />
              </div>
              <div>
                <label htmlFor="pesan" className="block text-xs text-gray-400 mb-1">Pesan</label>
                <textarea
                  id="pesan"
                  rows={3}
                  placeholder="Tulis pesan Anda..."
                  className="w-full rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 border outline-none focus:border-amber-500 transition-colors resize-none"
                  style={{ backgroundColor: 'var(--s2)', borderColor: 'var(--border)' }}
                />
              </div>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full text-center px-4 py-2 rounded-lg text-sm font-semibold text-black transition-opacity hover:opacity-85"
                style={{ background: 'var(--gradient)' }}
              >
                Kirim via WhatsApp
              </a>
            </form>
          </div>
        </section>
      </div>

      {/* Google Maps embed */}
      <section aria-label="Lokasi padukuhan di peta">
        <h2 className="text-lg font-bold text-gray-300 mb-4">Lokasi Padukuhan</h2>
        <div
          className="rounded-xl overflow-hidden border"
          style={{ borderColor: 'var(--border)' }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.8!2d112.7!3d-8.17!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwMTAnMTIuMCJTIDExMsKwNDInMDAuMCJF!5e0!3m2!1sid!2sid!4v1"
            width="100%"
            height="400"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Padukuhan Plosorejo di Google Maps"
          />
        </div>
        <p className="text-xs text-gray-600 mt-2 text-center">
          Padukuhan Plosorejo · Kapanewon Cangkringan, Kabupaten Sleman · 7°36′S 110°27′E
        </p>
      </section>

    </div>
  )
}
