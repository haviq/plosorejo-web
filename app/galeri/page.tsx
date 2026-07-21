import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import GaleriGrid from '@/components/GaleriGrid'
import type { GaleriAlbum } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Galeri KKN 2026',
  description: 'Dokumentasi foto kegiatan KKN UNRIYO 2026 di Padukuhan Plosorejo.',
}

const albums: GaleriAlbum[] = [
  {
    id: 1,
    judul: 'Penyambutan Tim KKN',
    tanggal: '1 Juli 2026',
    emoji: '🎉',
    count: 12,
    deskripsi:
      'Upacara penyambutan 12 mahasiswa KKN UNRIYO angkatan 2026 oleh perangkat padukuhan dan warga.',
    warna: 'var(--gold)',
  },
  {
    id: 2,
    judul: 'Kegiatan Posyandu',
    tanggal: '5 Juli 2026',
    emoji: '🏥',
    count: 18,
    deskripsi:
      'Mahasiswa KKN membantu pelaksanaan Posyandu Balita — penimbangan, imunisasi, dan penyuluhan gizi.',
    warna: '#34d399',
  },
  {
    id: 3,
    judul: 'Pelatihan Pupuk Organik',
    tanggal: '8 Juli 2026',
    emoji: '🌱',
    count: 15,
    deskripsi:
      'Workshop pembuatan pupuk organik dari kotoran sapi bersama kelompok tani Maju Bersama.',
    warna: 'var(--green)',
  },
  {
    id: 4,
    judul: 'Panen Raya Padi',
    tanggal: '10 Juli 2026',
    emoji: '🌾',
    count: 24,
    deskripsi:
      'Dokumentasi kegiatan panen raya padi serentak yang diikuti ratusan petani Padukuhan Plosorejo.',
    warna: 'var(--gold)',
  },
  {
    id: 5,
    judul: 'Pelatihan UMKM Digital',
    tanggal: '12 Juli 2026',
    emoji: '💻',
    count: 9,
    deskripsi:
      'Pelatihan pemasaran digital dan penggunaan media sosial untuk pelaku UMKM padukuhan.',
    warna: '#818cf8',
  },
  {
    id: 6,
    judul: 'Kunjungan Peternakan',
    tanggal: '14 Juli 2026',
    emoji: '🐄',
    count: 20,
    deskripsi:
      'Tim KKN mengunjungi peternakan sapi perah unggulan dan mempelajari proses produksi susu.',
    warna: 'var(--gold)',
  },
  {
    id: 7,
    judul: 'Lomba Mewarnai Anak',
    tanggal: '16 Juli 2026',
    emoji: '🎨',
    count: 30,
    deskripsi:
      'Lomba mewarnai tingkat PAUD dan TK sebagai bagian dari program pengembangan karakter anak.',
    warna: '#f97316',
  },
  {
    id: 8,
    judul: 'Pengerjaan Web Desa',
    tanggal: '18 Juli 2026',
    emoji: '🌐',
    count: 8,
    deskripsi:
      'Tim divisi teknologi KKN mengerjakan portal informasi digital Padukuhan Plosorejo.',
    warna: '#60a5fa',
  },
]

const totalFoto = albums.reduce((sum, a) => sum + a.count, 0)

export default function GaleriPage() {
  return (
    <div className="page-shell space-y-10">
      <PageHeader
        eyebrow="KKN UNRIYO 2026 · Juli – Agustus"
        title="Galeri"
        highlight="Dokumentasi"
        description="Dokumentasi foto kegiatan KKN UNRIYO angkatan 2026 di Padukuhan Plosorejo selama masa pengabdian 60 hari."
      />

      <section
        className="card-surface p-5 grid grid-cols-3 gap-4 text-center"
        aria-label="Statistik galeri"
      >
        {[
          { label: 'Total Album', value: String(albums.length) },
          { label: 'Total Foto', value: String(totalFoto) },
          { label: 'Mahasiswa KKN', value: '12' },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="stat-value text-2xl">{value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              {label}
            </p>
          </div>
        ))}
      </section>

      <section aria-label="Daftar album foto" className="space-y-4">
        <h2 className="section-label">Album Kegiatan</h2>
        <GaleriGrid albums={albums} />
      </section>

      <section
        className="card-surface p-6 text-center space-y-3"
        style={{
          background:
            'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(34,197,94,0.05))',
        }}
        aria-label="Informasi KKN"
      >
        <p className="text-2xl" aria-hidden="true">
          🎓
        </p>
        <h2 className="font-black text-lg">KKN UNRIYO Angkatan 2026</h2>
        <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--muted)' }}>
          12 mahasiswa Universitas Respati Yogyakarta dari berbagai fakultas menjalankan pengabdian
          masyarakat di Padukuhan Plosorejo selama 1 Juli — 31 Agustus 2026.
        </p>
        <div className="flex flex-wrap justify-center gap-2 pt-1">
          {['Pertanian', 'Teknik', 'Kesehatan', 'Sosial', 'Ekonomi', 'MIPA'].map((fak) => (
            <span
              key={fak}
              className="badge border"
              style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
            >
              {fak}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}
