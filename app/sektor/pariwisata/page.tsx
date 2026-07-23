import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import StatCard from '@/components/StatCard'
import Icon from '@/components/Icon'
import sektorData from '@/content/sektor.json'
import { getSiteSettings } from '@/lib/data'
import { waLink } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Pariwisata',
  description:
    'Destinasi wisata alam dan agrowisata di Padukuhan Plosorejo — kebun salak, peternakan, dan trekking.',
}

export const revalidate = 60

const sektor = sektorData.pariwisata

const destinasi = [
  {
    nama: 'Agrowisata Kebun Salak',
    icon: 'pertanian',
    deskripsi:
      'Kunjungi kebun salak pondoh seluas 18 hektar milik warga. Wisatawan dapat memetik salak langsung dari pohon, belajar teknik budidaya, dan membeli produk olahan salak khas Plosorejo.',
    tiket: 'Rp 25.000/orang',
    jamBuka: '08.00 – 16.00',
    fasilitas: ['Pemandu lokal', 'Area parkir', 'Warung oleh-oleh', 'Toilet'],
    color: 'var(--gold)',
  },
  {
    nama: 'Wisata Edukasi Peternakan',
    icon: 'peternakan',
    deskripsi:
      'Saksikan langsung proses pemerahan susu sapi Friesian Holstein, pengolahan susu segar, hingga pembuatan yogurt dan keju lokal. Cocok untuk wisata edukasi keluarga dan rombongan pelajar.',
    tiket: 'Rp 30.000/orang',
    jamBuka: '06.00 – 10.00',
    fasilitas: ['Sesi pemerahan', 'Icip susu segar', 'Pembelian produk', 'Foto bersama sapi'],
    color: 'var(--gold)',
  },
  {
    nama: 'Trekking Perbukitan Plosorejo',
    icon: 'pariwisata',
    deskripsi:
      'Jalur trekking ringan hingga sedang melalui perbukitan hijau dengan pemandangan Gunung Merapi dan hamparan sawah. Rute tersedia untuk pemula (2 km) dan menengah (5 km), dengan pemandu lokal berpengalaman.',
    tiket: 'Rp 50.000/orang',
    jamBuka: '05.00 – 17.00',
    fasilitas: ['Pemandu lokal', 'Titik istirahat', 'Spot foto Merapi', 'Air mineral'],
    color: 'var(--gold)',
  },
]

const paket = [
  {
    nama: 'Paket Keluarga',
    harga: 'Rp 150.000',
    min: '4 orang',
    include: ['Agrowisata salak', 'Edukasi peternakan', 'Snack lokal', 'Dokumentasi'],
  },
  {
    nama: 'Paket Edukasi Sekolah',
    harga: 'Rp 75.000',
    min: '20 siswa',
    include: ['Tur peternakan', 'Workshop singkat', 'Susu segar', 'Sertifikat kunjungan'],
  },
  {
    nama: 'Paket Trekking Merapi View',
    harga: 'Rp 200.000',
    min: '2 orang',
    include: ['Guide lokal', 'Trekking 5 km', 'Snack & air', 'Antar-jemput titik temu'],
  },
]

export default async function PariwisataPage() {
  const site = await getSiteSettings()
  const pesanWa = waLink(site.whatsapp, 'Halo, saya ingin memesan paket wisata Plosorejo')

  return (
    <div className="page-shell space-y-10">
      <PageHeader
        eyebrow="Sektor Pariwisata"
        title="Destinasi"
        highlight="Plosorejo"
        description={sektor.deskripsi}
      />

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Statistik pariwisata">
        {sektor.stats.map(({ label, value }) => (
          <StatCard key={label} label={label} value={value} accent="amber" />
        ))}
      </section>

      <section className="space-y-4" aria-label="Destinasi wisata">
        <h2 className="section-label">Destinasi unggulan</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {destinasi.map(({ nama, icon, deskripsi, tiket, jamBuka, fasilitas, color }) => (
            <article key={nama} className="card-surface p-5 flex flex-col gap-3 h-full">
              <div className="flex items-center gap-3">
                <span
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--gold-glow)', color }}
                >
                  <Icon name={icon} size={20} />
                </span>
                <h3 className="font-bold" style={{ color: 'var(--text)' }}>{nama}</h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{deskripsi}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg p-2.5" style={{ background: 'var(--surface-soft)' }}>
                  <p style={{ color: 'var(--muted)' }}>Tiket</p>
                  <p className="font-semibold" style={{ color: 'var(--text)' }}>{tiket}</p>
                </div>
                <div className="rounded-lg p-2.5" style={{ background: 'var(--surface-soft)' }}>
                  <p style={{ color: 'var(--muted)' }}>Jam buka</p>
                  <p className="font-semibold" style={{ color: 'var(--text)' }}>{jamBuka}</p>
                </div>
              </div>
              <ul className="space-y-1.5">
                {fasilitas.map((f) => (
                  <li key={f} className="text-xs flex gap-2" style={{ color: 'var(--text)' }}>
                    <span style={{ color: 'var(--gold)' }}>•</span>
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4" aria-label="Paket wisata">
        <h2 className="section-label">Paket wisata</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {paket.map(({ nama, harga, min, include }) => (
            <div key={nama} className="card-surface p-5 flex flex-col gap-3 h-full">
              <h3 className="font-bold" style={{ color: 'var(--text)' }}>{nama}</h3>
              <p className="text-lg font-black" style={{ color: 'var(--gold)' }}>{harga}</p>
              <p className="text-xs text-[var(--muted)]">Min. {min}</p>
              <ul className="space-y-1.5 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                {include.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-[var(--text)]">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: 'var(--gold)' }}
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={pesanWa}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-block text-center px-4 py-2 rounded-lg text-xs font-semibold transition-opacity hover:opacity-85"
                style={{ background: 'var(--gradient)', color: 'var(--btn-primary-fg)' }}
              >
                Pesan Sekarang
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
