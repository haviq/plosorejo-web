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

/** Theme + preloader skip flag before first paint */
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
    if (sessionStorage.getItem('plosorejo-preloader') === '1') {
      document.documentElement.setAttribute('data-preloader', 'skip');
    }
  } catch (e) {}
})();`

/**
 * Native preloader controller — no React.
 * Must work even if hydration fails / is delayed on mobile.
 */
const preloaderBodyScript = `
(function(){
  var KEY='plosorejo-preloader';
  var dead=false;

  function mark(){
    try{sessionStorage.setItem(KEY,'1');}catch(e){}
    document.documentElement.setAttribute('data-preloader','skip');
  }
  function unlock(){
    try{
      document.body.style.overflow='';
      document.documentElement.style.overflow='';
    }catch(e){}
  }
  function kill(){
    if(dead) return;
    dead=true;
    mark();
    unlock();
    var el=document.getElementById('site-preloader');
    if(!el) return;
    el.classList.add('site-preloader--exit');
    el.style.pointerEvents='none';
    el.style.opacity='0';
    el.style.transition='opacity .28s ease';
    window.setTimeout(function(){
      if(el && el.parentNode) el.parentNode.removeChild(el);
    }, 320);
  }

  function boot(){
    var el=document.getElementById('site-preloader');
    if(!el) return;

    /* Already seen this tab session */
    try{
      if(sessionStorage.getItem(KEY)==='1' ||
         document.documentElement.getAttribute('data-preloader')==='skip'){
        mark();
        unlock();
        if(el.parentNode) el.parentNode.removeChild(el);
        return;
      }
    }catch(e){}

    document.body.style.overflow='hidden';
    document.documentElement.style.overflow='hidden';
    document.documentElement.setAttribute('data-preloader','active');

    function onSkip(ev){
      if(ev){
        try{ev.preventDefault();}catch(e){}
        try{ev.stopPropagation();}catch(e){}
      }
      kill();
    }

    /* Multiple event types for stubborn mobile browsers */
    el.addEventListener('click', onSkip, true);
    el.addEventListener('touchend', onSkip, true);
    el.addEventListener('touchstart', onSkip, true);
    el.addEventListener('pointerup', onSkip, true);
    document.addEventListener('keydown', function(e){
      if(e.key==='Escape'||e.key==='Enter'||e.key===' ') onSkip(e);
    }, true);

    /* Hard auto-close — never trap the user */
    window.setTimeout(kill, 2200);
    /* Extra failsafe */
    window.setTimeout(kill, 4000);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
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
        <script dangerouslySetInnerHTML={{ __html: preloaderBodyScript }} />
        <SiteShell whatsapp={site.whatsapp}>{children}</SiteShell>
      </body>
    </html>
  )
}
