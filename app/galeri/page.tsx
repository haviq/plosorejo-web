import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Galeri KKN 2026',
  description: 'Dokumentasi foto kegiatan KKN UGM 2026 di Padukuhan Plosorejo.',
}

const albums = [
  {
    id: 1,
    judul: 'Penyambutan Tim KKN',
    tanggal: '1 Juli 2026',
    emoji: '🎉',
    count: 12,
    deskripsi: 'Upacara penyambutan 12 mahasiswa KKN UGM angkatan 2026 oleh perangkat padukuhan dan warga.',
    warna: 'var(--amber)',
  },
  {
    id: 2,
    judul: 'Kegiatan Posyandu',
    tanggal: '5 Juli 2026',
    emoji: '🏥',
    count: 18,
    deskripsi: 'Mahasiswa KKN membantu pelaksanaan Posyandu Balita — penimbangan, imunisasi, dan penyuluhan gizi.',
    warna: '#34d399',
  },
  {
    id: 3,
    judul: 'Pelatihan Pupuk Organik',
    tanggal: '8 Juli 2026',
    emoji: '🌱',
    count: 15,
    deskripsi: 'Workshop pembuatan pupuk organik dari kotoran sapi bersama kelompok tani Maju Bersama.',
    warna: 'var(--green)',
  },
  {
    id: 4,
    judul: 'Panen Raya Padi',
    tanggal: '10 Juli 2026',
    emoji: '🌾',
    count: 24,
    deskripsi: 'Dokumentasi kegiatan panen raya padi serentak yang diikuti ratusan petani Padukuhan Plosorejo.',
    warna: 'var(--amber)',
  },
  {
    id: 5,
    judul: 'Pelatihan UMKM Digital',
    tanggal: '12 Juli 2026',
    emoji: '💻',
    count: 9,
    deskripsi: 'Pelatihan pemasaran digital dan penggunaan media sosial untuk pelaku UMKM padukuhan.',
    warna: '#818cf8',
  },
  {
    id: 6,
    judul: 'Kunjungan Peternakan',
    tanggal: '14 Juli 2026',
    emoji: '🐄',
    count: 20,
    deskripsi: 'Tim KKN mengunjungi peternakan sapi perah unggulan dan mempelajari proses produksi susu.',
    warna: 'var(--amber)',
  },
  {
    id: 7,
    judul: 'Lomba Mewarnai Anak',
    tanggal: '16 Juli 2026',
    emoji: '🎨',
    count: 30,
    deskripsi: 'Lomba mewarnai tingkat PAUD dan TK sebagai bagian dari program pengembangan karakter anak.',
    warna: '#f97316',
  },
  {
    id: 8,
    judul: 'Pengerjaan Web Desa',
    tanggal: '18 Juli 2026',
    emoji: '🌐',
    count: 8,
    deskripsi: 'Tim divisi teknologi KKN mengerjakan portal informasi digital Padukuhan Plosorejo.',
    warna: '#60a5fa',
  },
]

const totalFoto = albums.reduce((sum, a) => sum + a.count, 0)

export default function GaleriPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">

      {/* Header */}
      <section className="space-y-4">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border"
          style={{ borderColor: 'var(--border)', color: 'var(--amber)', backgroundColor: 'rgba(245,158,11,0.08)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
          KKN UGM 2026 · Juli – Agustus
        </div>
        <h1 className="text-4xl font-black">
          📸 Galeri{' '}
          <span className="gradient-text">Dokumentasi</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-xl">
          Dokumentasi foto kegiatan KKN UGM angkatan 2026 di Padukuhan Plosorejo
          selama masa pengabdian 60 hari.
        </p>
      </section>

      {/* Stats ringkas */}
      <section
        className="rounded-xl border p-5 grid grid-cols-3 gap-4 text-center"
        style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
        aria-label="Statistik galeri"
      >
        {[
          { label: 'Total Album', value: String(albums.length) },
          { label: 'Total Foto', value: String(totalFoto) },
          { label: 'Mahasiswa KKN', value: '12 orang' },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-2xl font-black gradient-text tabular-nums">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </section>

      {/* Album grid */}
      <section aria-label="Daftar album foto">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-5">
          Album Kegiatan
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {albums.map((album) => (
            <div
              key={album.id}
              className="rounded-xl border overflow-hidden flex flex-col transition-colors hover:border-gray-600 cursor-pointer"
              style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
              role="article"
              aria-label={`Album: ${album.judul}`}
            >
              {/* Thumbnail placeholder */}
              <div
                className="h-36 flex items-center justify-center text-5xl"
                style={{ backgroundColor: `${album.warna}10` }}
                aria-hidden="true"
              >
                {album.emoji}
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col gap-2 flex-1">
                <h3 className="font-bold text-white text-sm leading-snug">{album.judul}</h3>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{album.deskripsi}</p>
                <div className="flex items-center justify-between mt-auto pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-xs text-gray-500">{album.tanggal}</span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ color: album.warna, backgroundColor: `${album.warna}18` }}
                  >
                    {album.count} foto
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Info tambahan */}
      <section
        className="rounded-xl border p-6 text-center space-y-3"
        style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.06), rgba(34,197,94,0.06))',
          borderColor: 'var(--border)',
        }}
        aria-label="Informasi KKN"
      >
        <p className="text-2xl" aria-hidden="true">🎓</p>
        <h2 className="font-black text-lg">KKN UGM Angkatan 2026</h2>
        <p className="text-sm text-gray-400 max-w-md mx-auto">
          12 mahasiswa Universitas Gadjah Mada dari berbagai fakultas menjalankan pengabdian
          masyarakat di Padukuhan Plosorejo selama 1 Juli — 31 Agustus 2026.
        </p>
        <div className="flex flex-wrap justify-center gap-2 pt-1">
          {['Pertanian', 'Teknik', 'Kesehatan', 'Sosial', 'Ekonomi', 'MIPA'].map((fak) => (
            <span
              key={fak}
              className="px-2 py-0.5 rounded-full text-xs border"
              style={{ borderColor: 'var(--border)', color: '#9ca3af' }}
            >
              {fak}
            </span>
          ))}
        </div>
      </section>

    </div>
  )
}
