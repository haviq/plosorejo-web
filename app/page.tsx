import type { Metadata } from 'next'
import HomeContent from '@/components/HomeContent'
import beritaData from '@/content/berita.json'
import sektorData from '@/content/sektor.json'
import umkmData from '@/content/umkm.json'

export const metadata: Metadata = {
  title: 'Beranda',
  description:
    'Portal digital Padukuhan Plosorejo — sentra sapi perah, UMKM, dan pariwisata lereng Merapi, Cangkringan, Sleman.',
}

const sektorCards = [
  {
    href: '/sektor/peternakan',
    icon: sektorData.peternakan.icon,
    nama: sektorData.peternakan.nama,
    deskripsi: sektorData.peternakan.deskripsi,
    stats: sektorData.peternakan.stats,
    accent: 'amber' as const,
  },
  {
    href: '/sektor/pertanian',
    icon: sektorData.pertanian.icon,
    nama: sektorData.pertanian.nama,
    deskripsi: sektorData.pertanian.deskripsi,
    stats: sektorData.pertanian.stats,
    accent: 'amber' as const,
  },
  {
    href: '/sektor/umkm',
    icon: sektorData.umkm.icon,
    nama: sektorData.umkm.nama,
    deskripsi: sektorData.umkm.deskripsi,
    stats: sektorData.umkm.stats,
    accent: 'amber' as const,
  },
  {
    href: '/sektor/pariwisata',
    icon: sektorData.pariwisata.icon,
    nama: sektorData.pariwisata.nama,
    deskripsi: sektorData.pariwisata.deskripsi,
    stats: sektorData.pariwisata.stats,
    accent: 'amber' as const,
  },
  {
    href: '/sektor/pendidikan',
    icon: sektorData.pendidikan.icon,
    nama: sektorData.pendidikan.nama,
    deskripsi: sektorData.pendidikan.deskripsi,
    stats: sektorData.pendidikan.stats,
    accent: 'amber' as const,
  },
  {
    href: '/sektor/kesehatan',
    icon: sektorData.kesehatan.icon,
    nama: sektorData.kesehatan.nama,
    deskripsi: sektorData.kesehatan.deskripsi,
    stats: sektorData.kesehatan.stats,
    accent: 'amber' as const,
  },
  {
    href: '/sektor/budaya',
    icon: sektorData.budaya.icon,
    nama: sektorData.budaya.nama,
    deskripsi: sektorData.budaya.deskripsi,
    stats: sektorData.budaya.stats,
    accent: 'amber' as const,
  },
]

const potensiCards = [
  {
    href: '/sektor/peternakan',
    icon: 'peternakan',
    kategori: 'Peternakan',
    headline: sektorData.peternakan.stats[1]?.value ?? '2,8 ton/hari',
    sub: 'Produksi susu segar Grade A',
    img: '/images/placeholder-card.svg',
    imgAlt: 'Sapi perah Friesian Holstein',
    span: 'md:col-span-2 md:row-span-2',
  },
  {
    href: '/sektor/umkm',
    icon: 'umkm',
    kategori: 'UMKM',
    headline: sektorData.umkm.stats[0]?.value ?? '89 usaha',
    sub: 'Kuliner, kerajinan, & agribisnis',
    img: '/images/placeholder-card.svg',
    imgAlt: 'Pasar dan produk UMKM lokal',
    span: '',
  },
  {
    href: '/sektor/pariwisata',
    icon: 'pariwisata',
    kategori: 'Pariwisata',
    headline: sektorData.pariwisata.stats[0]?.value ?? '3 Destinasi',
    sub: 'Agrowisata & trekking Merapi',
    img: '/images/placeholder-card.svg',
    imgAlt: 'Pemandangan alam lereng Merapi',
    span: '',
  },
]

const quickAccess = [
  {
    href: '/layanan',
    icon: 'document',
    title: 'Layanan Administrasi',
    desc: 'Syarat surat, alur, dan jam pelayanan balai',
  },
  {
    href: '/susu',
    icon: 'susu',
    title: 'Produksi Susu',
    desc: 'Data harian & rantai pasok susu segar',
  },
  {
    href: '/peta',
    icon: 'peta',
    title: 'Peta Interaktif',
    desc: 'Lokasi UMKM, fasilitas, dan destinasi',
  },
  {
    href: '/kkn',
    icon: 'digital',
    title: 'Arsip KKN',
    desc: 'Dokumentasi program KKN UNRIYO Unit 9',
  },
]

export default function HomePage() {
  const latestBerita = beritaData.slice(0, 3)
  const featuredUmkm = umkmData.filter((u) => u.aktif).slice(0, 4)

  return (
    <HomeContent
      sektorCards={sektorCards}
      potensiCards={potensiCards}
      quickAccess={quickAccess}
      latestBerita={latestBerita}
      featuredUmkm={featuredUmkm}
    />
  )
}
