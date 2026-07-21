import type { Metadata } from 'next'
import StatCard from '@/components/StatCard'
import sektorData from '@/content/sektor.json'

export const metadata: Metadata = {
  title: 'Pariwisata',
  description: 'Destinasi wisata alam dan agrowisata di Padukuhan Plosorejo — kebun salak, peternakan, dan trekking.',
}

const sektor = sektorData.pariwisata

const destinasi = [
  {
    nama: 'Agrowisata Kebun Salak',
    emoji: '🍈',
    deskripsi:
      'Kunjungi kebun salak pondoh seluas 18 hektar milik warga. Wisatawan dapat memetik salak langsung dari pohon, belajar teknik budidaya, dan membeli produk olahan salak khas Plosorejo.',
    tiket: 'Rp 25.000/orang',
    jamBuka: '08.00 – 16.00',
    fasilitas: ['Pemandu lokal', 'Area parkir', 'Warung oleh-oleh', 'Toilet'],
    color: 'var(--green)',
  },
  {
    nama: 'Wisata Edukasi Peternakan',
    emoji: '🐄',
    deskripsi:
      'Saksikan langsung proses pemerahan susu sapi Friesian Holstein, pengolahan susu segar, hingga pembuatan yogurt dan keju lokal. Cocok untuk wisata edukasi keluarga dan rombongan pelajar.',
    tiket: 'Rp 30.000/orang',
    jamBuka: '06.00 – 10.00',
    fasilitas: ['Sesi pemerahan', 'Icip susu segar', 'Pembelian produk', 'Foto bersama sapi'],
    color: 'var(--amber)',
  },
  {
    nama: 'Trekking Perbukitan Plosorejo',
    emoji: '🏔️',
    deskripsi:
      'Jalur trekking ringan hingga sedang melalui perbukitan hijau dengan pemandangan Gunung Merapi dan hamparan sawah. Rute tersedia untuk pemula (2 km) dan menengah (5 km), dengan pemandu lokal berpengalaman.',
    tiket: 'Rp 50.000/orang',
    jamBuka: '05.30 – 12.00',
    fasilitas: ['Pemandu trekking', 'Titik panorama', 'Warung transit', 'P3K'],
    color: '#818cf8',
  },
]

const paketWisata = [
  {
    nama: 'Paket Keluarga',
    harga: 'Rp 150.000/orang',
    min: '5 orang',
    include: ['Agrowisata Salak', 'Edukasi Peternakan', 'Makan siang', 'Oleh-oleh'],
  },
  {
    nama: 'Paket Pelajar',
    harga: 'Rp 75.000/orang',
    min: '20 siswa',
    include: ['Edukasi Peternakan', 'Workshop pertanian', 'Makan siang', 'Sertifikat'],
  },
  {
    nama: 'Paket Petualangan',
    harga: 'Rp 120.000/orang',
    min: '4 orang',
    include: ['Trekking 5 km', 'Sarapan lokal', 'Pemandu', 'Snack trail'],
  },
]

export default function PariwisataPage() {
  return (
    <div className="page-shell space-y-10">

      {/* Header */}
      <section className="space-y-3">
        <h1 className="text-4xl font-black">
          {sektor.icon} Pariwisata{' '}
          <span className="gradient-text">Plosorejo</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">{sektor.deskripsi}</p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4" aria-label="Statistik pariwisata">
        {sektor.stats.map(({ label, value }, i) => (
          <StatCard
            key={label}
            label={label}
            value={value}
            accent={i % 2 === 0 ? 'amber' : 'green'}
          />
        ))}
      </section>

      {/* Destinasi wisata */}
      <section aria-label="Destinasi wisata">
        <h2 className="text-2xl font-black mb-5">Destinasi Wisata</h2>
        <div className="space-y-5">
          {destinasi.map(({ nama, emoji, deskripsi, tiket, jamBuka, fasilitas, color }) => (
            <div
              key={nama}
              className="rounded-xl border p-6 space-y-4"
              style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-start gap-4">
                <span
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: `${color}12` }}
                  aria-hidden="true"
                >
                  {emoji}
                </span>
                <div className="flex-1">
                  <h3 className="font-black text-white text-lg">{nama}</h3>
                  <div className="flex flex-wrap gap-4 mt-1 text-xs text-gray-500">
                    <span>🎫 {tiket}</span>
                    <span>🕐 {jamBuka}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{deskripsi}</p>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Fasilitas:</p>
                <div className="flex flex-wrap gap-2">
                  {fasilitas.map((f) => (
                    <span
                      key={f}
                      className="px-2 py-0.5 rounded-full text-xs border"
                      style={{ borderColor: 'var(--border)', color: '#9ca3af' }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Paket wisata */}
      <section aria-label="Paket wisata">
        <h2 className="text-2xl font-black mb-5">Paket Wisata</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {paketWisata.map(({ nama, harga, min, include }) => (
            <div
              key={nama}
              className="rounded-xl border p-5 flex flex-col gap-3"
              style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
            >
              <h3 className="font-bold text-white">{nama}</h3>
              <p className="text-lg font-black" style={{ color: 'var(--amber)' }}>{harga}</p>
              <p className="text-xs text-gray-500">Min. {min}</p>
              <ul className="space-y-1.5 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                {include.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--green)' }} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="https://wa.me/6281234567890?text=Halo%2C%20saya%20ingin%20memesan%20paket%20wisata%20Plosorejo"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-block text-center px-4 py-2 rounded-lg text-xs font-semibold text-black transition-opacity hover:opacity-85"
                style={{ background: 'var(--gradient)' }}
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
