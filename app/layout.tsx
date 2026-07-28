import type { Metadata } from 'next'
import { Inter, Playfair_Display, Syne } from 'next/font/google'
import './globals.css'
import SiteShell from '@/components/SiteShell'
import SitePreloader from '@/components/SitePreloader'
import { getMerapiStatus, getSiteSettings } from '@/lib/data'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700', '900'],
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '600', '700', '800'],
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
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Plosorejo',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
}

/**
 * Before first paint:
 * - apply saved theme
 * - mark preloader as skip if already seen (session OR localStorage)
 * - wire early theme/hamburger handlers so buttons work BEFORE React hydrates
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
    // Skip intro on internal routes (admin / studio) OR if already shown this session
    try {
      var p = (location && location.pathname) || '';
      if (p.indexOf('/admin') === 0 || p.indexOf('/studio') === 0) seen = true;
    } catch (ePath) {}
    try {
      if (sessionStorage.getItem('plosorejo-preloader-seen') === '1') seen = true;
    } catch (eSS) {}
    if (seen) {
      document.documentElement.setAttribute('data-preloader', 'skip');
    }
  } catch (e) {}

  /* Early interactions — work even before React hydrates.
     When React is ready (data-react-nav=1), only help with theme;
     hamburger is handled by React onClick to avoid double-toggle. */
  try {
    var lastHam = 0;
    var lastTheme = 0;
    document.addEventListener('click', function(ev){
      var target = ev.target;
      if (!target || !target.closest) return;
      var reactReady = document.documentElement.getAttribute('data-react-nav') === '1';

      var themeBtn = target.closest('[data-theme-toggle="1"]');
      if (themeBtn) {
        /* Theme works pre-hydrate; after hydrate React also handles — gate shared via time */
        var nowT = Date.now();
        if (nowT - lastTheme < 350) {
          ev.preventDefault();
          ev.stopPropagation();
          return;
        }
        lastTheme = nowT;
        if (!reactReady) {
          ev.preventDefault();
          ev.stopPropagation();
          var cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
          var next = cur === 'dark' ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', next);
          document.documentElement.style.colorScheme = next;
          try { localStorage.setItem('plosorejo-theme', next); } catch (e3) {}
          try { window.dispatchEvent(new CustomEvent('plosorejo-theme', { detail: next })); } catch (e4) {}
        }
        return;
      }

      var ham = target.closest('[data-nav-hamburger="1"]');
      if (ham && !reactReady) {
        /* Pre-hydrate only: open/close CSS panel via attribute */
        ev.preventDefault();
        ev.stopPropagation();
        var nowH = Date.now();
        if (nowH - lastHam < 400) return;
        lastHam = nowH;
        var open = document.documentElement.getAttribute('data-mobile-nav') === 'open';
        if (open) {
          document.documentElement.removeAttribute('data-mobile-nav');
          ham.setAttribute('data-nav-open', '0');
          ham.setAttribute('aria-expanded', 'false');
          ham.innerHTML = '<span class="site-header__burger-line" style="background:#f0c040"></span><span class="site-header__burger-line" style="background:#f0c040"></span><span class="site-header__burger-line" style="background:#f0c040"></span>';
        } else {
          document.documentElement.setAttribute('data-mobile-nav', 'open');
          ham.setAttribute('data-nav-open', '1');
          ham.setAttribute('aria-expanded', 'true');
          ham.innerHTML = '<span class="site-header__close-x" aria-hidden="true"><span class="site-header__close-x-line site-header__close-x-line--a"></span><span class="site-header__close-x-line site-header__close-x-line--b"></span></span>';
        }
      }
    }, true);
  } catch (e) {}

  /* Hard failsafe: never leave intro longer than ~5.5s */
  try {
    window.setTimeout(function(){
      try {
        var el = document.getElementById('site-preloader-v16');
        document.documentElement.setAttribute('data-preloader', 'skip');
        if (el) {
          el.style.pointerEvents = 'none';
          el.style.display = 'none';
        }
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      } catch (e5) {}
    }, 5500);
  } catch (e) {}
})();`

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [site, merapi] = await Promise.all([getSiteSettings(), getMerapiStatus()])

  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable} ${syne.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootHeadScript }} />
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
      >
        <SitePreloader />
        <SiteShell
          whatsapp={site.whatsapp}
          merapi={{
            level: merapi.level,
            roman: merapi.roman,
            deskripsi: merapi.deskripsi,
            updatedAt: merapi.updatedAt,
          }}
        >
          {children}
        </SiteShell>
      </body>
    </html>
  )
}
