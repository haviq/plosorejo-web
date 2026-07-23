import type { MetadataRoute } from 'next'
import beritaData from '@/content/berita.json'

const base = 'https://plosorejo-web.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/profil',
    '/berita',
    '/layanan',
    '/galeri',
    '/kontak',
    '/peta',
    '/susu',
    '/kkn',
    '/sektor/umkm',
    '/sektor/peternakan',
    '/sektor/pertanian',
    '/sektor/pariwisata',
    '/sektor/pendidikan',
    '/sektor/kesehatan',
    '/sektor/budaya',
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }))

  const beritaRoutes = beritaData.map((b) => ({
    url: `${base}/berita/${b.slug}`,
    lastModified: new Date(b.tanggal),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...beritaRoutes]
}
