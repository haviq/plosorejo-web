'use client'

import dynamic from 'next/dynamic'

// ssr: false is only allowed inside a Client Component in Next.js 16
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-xl flex items-center justify-center text-gray-500 text-sm"
      style={{ height: 480, backgroundColor: 'var(--s2)', border: '1px solid var(--border)' }}
    >
      <span>Memuat peta…</span>
    </div>
  ),
})

export default function MapLoader() {
  return <LeafletMap />
}
