import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import GaleriGrid from '@/components/GaleriGrid'
import Icon from '@/components/Icon'
import { getGaleriList } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Galeri KKN 2026',
  description: 'Dokumentasi foto kegiatan KKN UNRIYO 2026 di Padukuhan Plosorejo.',
}

export const revalidate = 60

export default async function GaleriPage() {
  const albums = await getGaleriList()
  const totalFoto = albums.reduce((sum, a) => sum + a.count, 0)

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
            'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.05))',
        }}
        aria-label="Informasi KKN"
      >
        <div
          className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center"
          style={{ background: 'var(--gold-glow)', color: 'var(--gold)' }}
          aria-hidden="true"
        >
          <Icon name="pendidikan" size={24} />
        </div>
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
