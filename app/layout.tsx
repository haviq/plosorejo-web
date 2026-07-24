import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import SiteShell from '@/components/SiteShell'
import { getSiteSettings } from '@/lib/data'

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
  metadataBase: new URL('https://plosorejo-web.vercel.app'),
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
    url: 'https://plosorejo-web.vercel.app',
    siteName: 'Plosorejo Padukuhan Digital',
    title: 'Plosorejo — Padukuhan Digital',
    description:
      'Portal digital Padukuhan Plosorejo — sentra sapi perah, UMKM, dan pariwisata lereng Merapi.',
    images: [{ url: '/images/og-cover.svg', width: 1200, height: 630, alt: 'Plosorejo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plosorejo — Padukuhan Digital',
    description:
      'Portal digital Padukuhan Plosorejo — sentra sapi perah, UMKM, dan pariwisata lereng Merapi.',
    images: ['/images/og-cover.svg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const themeBootScript = `
(function(){
  try {
    var t = localStorage.getItem('plosorejo-theme');
    if (t !== 'light' && t !== 'dark') {
      t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-theme', t);
    document.documentElement.style.colorScheme = t;
  } catch (e) {}
  /* Preloader: mark skip BEFORE first paint so returning tabs never flash */
  try {
    if (sessionStorage.getItem('plosorejo-preloader') === '1') {
      document.documentElement.setAttribute('data-preloader', 'skip');
    }
  } catch (e) {}
})();`

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const site = await getSiteSettings()

  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
      >
        <SiteShell whatsapp={site.whatsapp}>{children}</SiteShell>
      </body>
    </html>
  )
}
