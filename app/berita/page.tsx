import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import BeritaList from '@/components/BeritaList'
import { getBeritaList } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Berita',
  description: 'Informasi terkini seputar kegiatan dan pembangunan Padukuhan Plosorejo.',
}

export const revalidate = 60

export default async function BeritaPage() {
  const items = await getBeritaList()

  return (
    <div className="page-shell space-y-10">
      <PageHeader
        eyebrow="Kabar Padukuhan"
        title="Berita"
        highlight="Padukuhan"
        description="Informasi terkini seputar kegiatan, pembangunan, dan pencapaian warga Padukuhan Plosorejo."
      />

      <BeritaList items={items} />
    </div>
  )
}
