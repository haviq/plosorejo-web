import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import SiteShell from '@/components/SiteShell'
import SitePreloader from '@/components/SitePreloader'
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

/**
 * Before first paint:
 * - apply saved theme
 * - mark preloader as skip if already seen (session OR localStorage)
 * Never removeChild here — React owns the preloader node (avoids hydrate resurrection).
 */
const bootHeadScript = `
(function(){
  try {
    var t = localStorage.getItem('plosorejo-theme');
    if (t !== 'light' && t !== 'dark') {
      t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-theme', t);
    document.documentElement.style.colorScheme = t;
  } catch (e) {}
  try {
    var seen = false;
    try { seen = sessionStorage.getItem('plosorejo-preloader') === '1'; } catch (e1) {}
    try { if (!seen) seen = localStorage.getItem('plosorejo-preloader') === '1'; } catch (e2) {}
    if (seen) {
      document.documentElement.setAttribute('data-preloader', 'skip');
    }
  } catch (e) {}
  /* Hard failsafe: allow typewriter (~3.5s) then force-hide */
  try {
    window.setTimeout(function(){
      try {
        var el = document.getElementById('site-preloader');
        if (!el) return;
        if (document.documentElement.getAttribute('data-preloader') === 'skip') return;
        document.documentElement.setAttribute('data-preloader', 'skip');
        el.style.pointerEvents = 'none';
        el.style.display = 'none';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        try { sessionStorage.setItem('plosorejo-preloader', '1'); } catch (e3) {}
        try { localStorage.setItem('plosorejo-preloader', '1'); } catch (e4) {}
      } catch (e5) {}
    }, 4500);
  } catch (e) {}
})();`

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const site = await getSiteSettings()

  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootHeadScript }} />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
      >
        <SitePreloader />
        <SiteShell whatsapp={site.whatsapp}>{children}</SiteShell>
      </body>
    </html>
  )
}
