import type { Metadata } from 'next'
import StatCard from '@/components/StatCard'
import sektorData from '@/content/sektor.json'

export const metadata: Metadata = {
  title: 'Budaya & Tradisi',
  description: 'Kekayaan budaya dan tradisi adat Padukuhan Plosorejo — seni pertunjukan, ritual leluhur, dan festival tahunan.',
}

const sektor = sektorData.budaya

const kesenian = [
  {
    nama: 'Tari Topeng Malang',
    kategori: 'Tari Tradisional',
    deskripsi: 'Tari topeng khas Malang dengan kostum dan topeng berwarna warni. Ditampilkan dalam ritual bersih desa dan festival budaya.',
    anggota: 18,
    aktif: true,
    emoji: '🎭',
    color: 'var(--amber)',
  },
  {
    nama: 'Wayang Kulit Lakon Kuno',
    kategori: 'Pertunjukan',
    deskripsi: 'Pertunjukan wayang kulit semalam suntuk oleh dalang lokal Ki Slamet Wibowo yang mewarisi tradisi turun-temurun.',
    anggota: 12,
    aktif: true,
    emoji: '🪆',
    color: '#f97316',
  },
  {
    nama: 'Karawitan Gamelan Plosorejo',
    kategori: 'Musik Tradisional',
    deskripsi: 'Kelompok karawitan yang rutin tampil di acara desa dan lomba tingkat kabupaten. Beranggotakan lintas generasi.',
    anggota: 22,
    aktif: true,
    emoji: '🥁',
    color: 'var(--green)',
  },
  {
    nama: 'Ludruk Rukun Santoso',
    kategori: 'Teater Tradisional',
    deskripsi: 'Kelompok ludruk tertua di kecamatan, berdiri sejak 1978. Memainkan lakon sosial dan komedi khas Jawa Timuran.',
    anggota: 25,
    aktif: true,
    emoji: '🎪',
    color: '#818cf8',
  },
  {
    nama: 'Pencak Silat Mekar Sari',
    kategori: 'Bela Diri Tradisional',
    deskripsi: 'Perguruan pencak silat yang membina generasi muda. Rutin mengikuti kejuaraan tingkat kabupaten dan provinsi.',
    anggota: 35,
    aktif: true,
    emoji: '🥋',
    color: '#ef4444',
  },
  {
    nama: 'Kuda Lumping Maju Jaya',
    kategori: 'Tari Tradisional',
    deskripsi: 'Pertunjukan kuda lumping yang menampilkan atraksi kesurupan dan kesenian rakyat yang telah ada sejak ratusan tahun.',
    anggota: 30,
    aktif: true,
    emoji: '🐴',
    color: 'var(--amber)',
  },
]

const ritualTahunan = [
  {
    nama: 'Bersih Desa',
    waktu: 'Bulan Suro (Muharram)',
    deskripsi: 'Ritual tahunan membersihkan dan mendoakan desa, diikuti seluruh warga. Diakhiri dengan pertunjukan wayang kulit semalam suntuk.',
    peserta: '2.000+ warga',
    emoji: '🙏',
  },
  {
    nama: 'Maulid Nabi Tradisional',
    waktu: '12 Rabiul Awal',
    deskripsi: 'Peringatan Maulid Nabi Muhammad SAW dengan tradisi sholawatan, pengajian, dan pembagian berkat kepada warga.',
    peserta: '500+ warga',
    emoji: '🌙',
  },
  {
    nama: 'Festival Budaya Plosorejo',
    waktu: 'Juni setiap tahun',
    deskripsi: 'Festival tahunan menampilkan seluruh kesenian lokal, pameran UMKM, kuliner tradisional, dan lomba budaya tingkat kecamatan.',
    peserta: '2.000+ pengunjung',
    emoji: '🎉',
  },
  {
    nama: 'Sedekah Bumi',
    waktu: 'Setelah panen raya',
    deskripsi: 'Syukuran panen dengan membawa hasil bumi ke balai desa, didoakan bersama, lalu dibagikan kepada seluruh warga.',
    peserta: '300+ warga',
    emoji: '🌾',
  },
]

export default function BudayaPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">

      {/* Header */}
      <section className="space-y-3">
        <h1 className="text-4xl font-black">
          {sektor.icon} Budaya{' '}
          <span className="gradient-text">&amp; Tradisi</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">{sektor.deskripsi}</p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4" aria-label="Statistik budaya">
        {sektor.stats.map(({ label, value }, i) => (
          <StatCard
            key={label}
            label={label}
            value={value}
            accent={i % 2 === 0 ? 'amber' : 'green'}
          />
        ))}
      </section>

      {/* Kelompok Kesenian */}
      <section aria-label="Kelompok kesenian">
        <h2 className="text-2xl font-black mb-5">Kelompok Kesenian</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kesenian.map(({ nama, kategori, deskripsi, anggota, emoji, color }) => (
            <div
              key={nama}
              className="rounded-xl border p-5 space-y-3"
              style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: `${color}12` }}
                  aria-hidden="true"
                >
                  {emoji}
                </span>
                <div>
                  <h3 className="font-bold text-white text-sm leading-tight">{nama}</h3>
                  <span
                    className="text-xs font-medium"
                    style={{ color }}
                  >
                    {kategori}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{deskripsi}</p>
              <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                <span className="text-xs text-gray-500">{anggota} anggota aktif</span>
                <span
                  className="flex items-center gap-1 text-xs"
                  style={{ color: 'var(--green)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
                  Aktif
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ritual Tahunan */}
      <section aria-label="Ritual dan tradisi tahunan">
        <h2 className="text-2xl font-black mb-5">Ritual &amp; Tradisi Tahunan</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {ritualTahunan.map(({ nama, waktu, deskripsi, peserta, emoji }) => (
            <div
              key={nama}
              className="rounded-xl border p-6 space-y-3"
              style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl" aria-hidden="true">{emoji}</span>
                <div>
                  <h3 className="font-black text-white">{nama}</h3>
                  <p className="text-xs text-gray-500">{waktu}</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{deskripsi}</p>
              <div
                className="flex items-center gap-2 pt-2 border-t text-xs text-gray-500"
                style={{ borderColor: 'var(--border)' }}
              >
                <span>👥</span>
                <span>{peserta}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA pelestarian */}
      <section
        className="rounded-xl border p-8 text-center space-y-3"
        style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.06), rgba(34,197,94,0.06))',
          borderColor: 'var(--border)',
        }}
        aria-label="Ajakan pelestarian budaya"
      >
        <p className="text-3xl" aria-hidden="true">🎎</p>
        <h2 className="font-black text-xl">Lestarikan Warisan Leluhur</h2>
        <p className="text-sm text-gray-400 max-w-md mx-auto">
          Bergabunglah dengan kelompok kesenian lokal atau dukung program pelestarian budaya
          Padukuhan Plosorejo. Hubungi perangkat desa untuk informasi lebih lanjut.
        </p>
        <a
          href="/kontak"
          className="inline-block px-6 py-2.5 rounded-lg font-semibold text-sm text-black transition-opacity hover:opacity-85"
          style={{ background: 'var(--gradient)' }}
        >
          Hubungi Kami
        </a>
      </section>

    </div>
  )
}
