import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Plosorejo — Sistem Informasi Desa',
    template: '%s | Plosorejo',
  },
  description:
    'Portal digital Desa Plosorejo: data produksi susu, peta wilayah, dan layanan UMKM terintegrasi.',
  keywords: ['Plosorejo', 'desa', 'susu', 'UMKM', 'peta'],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ backgroundColor: 'var(--bg)', color: '#e5e7eb' }}>
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="border-t text-center text-xs py-6 text-gray-500" style={{ borderColor: 'var(--border)' }}>
          © {new Date().getFullYear()} Desa Plosorejo · Dibangun dengan ❤️ untuk warga
        </footer>
      </body>
    </html>
  )
}
