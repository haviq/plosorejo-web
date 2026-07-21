import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import BeritaList from '@/components/BeritaList'
import beritaData from '@/content/berita.json'
import type { BeritaItem } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Berita',
  description: 'Informasi terkini seputar kegiatan dan pembangunan Padukuhan Plosorejo.',
}

export default function BeritaPage() {
  return (
    <div className="page-shell space-y-10">
      <PageHeader
        eyebrow="Kabar Padukuhan"
        title="Berita"
        highlight="Padukuhan"
        description="Informasi terkini seputar kegiatan, pembangunan, dan pencapaian warga Padukuhan Plosorejo."
      />

      <BeritaList items={beritaData as BeritaItem[]} />
    </div>
  )
}
