import type { Metadata } from 'next'
import { Suspense } from 'react'
import PageHeader from '@/components/PageHeader'
import StatusTracker from '@/components/StatusTracker'

export const metadata: Metadata = {
  title: 'Cek Status Surat',
  description:
    'Lacak status pengajuan surat administrasi Padukuhan Plosorejo dengan kode pengajuan.',
}

export default function StatusPage() {
  return (
    <div className="page-shell space-y-8">
      <PageHeader
        eyebrow="Layanan digital"
        title="Cek Status"
        highlight="Surat"
        description="Masukkan kode pengajuan (contoh PLJ-DEMO01) untuk melihat progress di balai."
      />
      <Suspense
        fallback={
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Memuat pelacak status…
          </p>
        }
      >
        <StatusTracker />
      </Suspense>
    </div>
  )
}
