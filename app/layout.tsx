import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import SiteShell from '@/components/SiteShell'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700', '900'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://plosorejo.vercel.app'),
  title: {
    default: 'Plosorejo — Padukuhan Digital',
    template: '%s | Plosorejo',
  },
  description:
    'Portal digital Padukuhan Plosorejo, Cangkringan, Sleman — sentra peternakan sapi perah, UMKM, dan pariwisata lereng Merapi.',
  keywords: ['Plosorejo', 'Cangkringan', 'Sleman', 'desa digital', 'sapi perah', 'UMKM', 'Merapi'],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'Plosorejo Padukuhan Digital',
    title: 'Plosorejo — Padukuhan Digital',
    description:
      'Portal digital Padukuhan Plosorejo — sentra sapi perah, UMKM, dan pariwisata lereng Merapi.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plosorejo — Padukuhan Digital',
    description:
      'Portal digital Padukuhan Plosorejo — sentra sapi perah, UMKM, dan pariwisata lereng Merapi.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col"
        style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
      >
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  )
}
