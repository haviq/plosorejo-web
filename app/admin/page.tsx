import type { Metadata } from 'next'
import AdminDashboard from '@/components/AdminDashboard'

/** Internal ops page — unlisted (no nav, sitemap, robots). */
export const metadata: Metadata = {
  title: 'Internal',
  description: 'Akses internal',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
}

export default function AdminPage() {
  return (
    <div className="page-shell py-10 max-w-3xl mx-auto">
      <AdminDashboard />
    </div>
  )
}
