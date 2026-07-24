import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import AdminDashboard from '@/components/AdminDashboard'

export const metadata: Metadata = {
  title: 'Admin Padukuhan',
  description: 'Panel admin pengajuan surat Padukuhan Plosorejo.',
  robots: { index: false, follow: false },
}

export default function AdminPage() {
  return (
    <div className="page-shell space-y-8">
      <PageHeader
        eyebrow="Operasional"
        title="Admin"
        highlight="Padukuhan"
        description="Kelola status pengajuan surat warga. Login dengan PIN admin (set ADMIN_PIN di Vercel)."
      />
      <AdminDashboard />
    </div>
  )
}
