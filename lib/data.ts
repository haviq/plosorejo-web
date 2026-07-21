import beritaJson from '@/content/berita.json'
import umkmJson from '@/content/umkm.json'
import sektorJson from '@/content/sektor.json'
import { sanityFetch } from '@/sanity/lib/client'
import {
  beritaListQuery,
  beritaBySlugQuery,
  beritaSlugsQuery,
  umkmListQuery,
  galeriListQuery,
  sektorListQuery,
  merapiStatusQuery,
} from '@/sanity/lib/queries'
import type { BeritaItem, UMKMItem, SektorData, GaleriAlbum } from '@/lib/types'

// Fallback galeri (local) when Sanity empty/unconfigured
const galeriFallback: GaleriAlbum[] = [
  {
    id: 1,
    judul: 'Penyambutan Tim KKN',
    tanggal: '1 Juli 2026',
    emoji: '🎉',
    count: 12,
    deskripsi:
      'Upacara penyambutan 12 mahasiswa KKN UNRIYO angkatan 2026 oleh perangkat padukuhan dan warga.',
    warna: 'var(--gold)',
  },
  {
    id: 2,
    judul: 'Kegiatan Posyandu',
    tanggal: '5 Juli 2026',
    emoji: '🏥',
    count: 18,
    deskripsi:
      'Mahasiswa KKN membantu pelaksanaan Posyandu Balita — penimbangan, imunisasi, dan penyuluhan gizi.',
    warna: '#34d399',
  },
  {
    id: 3,
    judul: 'Pelatihan Pupuk Organik',
    tanggal: '8 Juli 2026',
    emoji: '🌱',
    count: 15,
    deskripsi:
      'Workshop pembuatan pupuk organik dari kotoran sapi bersama kelompok tani Maju Bersama.',
    warna: 'var(--green)',
  },
  {
    id: 4,
    judul: 'Panen Raya Padi',
    tanggal: '10 Juli 2026',
    emoji: '🌾',
    count: 24,
    deskripsi:
      'Dokumentasi kegiatan panen raya padi serentak yang diikuti ratusan petani Padukuhan Plosorejo.',
    warna: 'var(--gold)',
  },
  {
    id: 5,
    judul: 'Pelatihan UMKM Digital',
    tanggal: '12 Juli 2026',
    emoji: '💻',
    count: 9,
    deskripsi:
      'Pelatihan pemasaran digital dan penggunaan media sosial untuk pelaku UMKM padukuhan.',
    warna: '#818cf8',
  },
  {
    id: 6,
    judul: 'Kunjungan Peternakan',
    tanggal: '14 Juli 2026',
    emoji: '🐄',
    count: 20,
    deskripsi:
      'Tim KKN mengunjungi peternakan sapi perah unggulan dan mempelajari proses produksi susu.',
    warna: 'var(--gold)',
  },
  {
    id: 7,
    judul: 'Lomba Mewarnai Anak',
    tanggal: '16 Juli 2026',
    emoji: '🎨',
    count: 30,
    deskripsi:
      'Lomba mewarnai tingkat PAUD dan TK sebagai bagian dari program pengembangan karakter anak.',
    warna: '#f97316',
  },
  {
    id: 8,
    judul: 'Pengerjaan Web Desa',
    tanggal: '18 Juli 2026',
    emoji: '🌐',
    count: 8,
    deskripsi:
      'Tim divisi teknologi KKN mengerjakan portal informasi digital Padukuhan Plosorejo.',
    warna: '#60a5fa',
  },
]

type SanityBerita = {
  slug: string
  judul: string
  tanggal: string
  kategori: string
  ringkasan: string
  isi: string
  fotoUrl?: string | null
}

type SanityUMKM = {
  id: string
  nama: string
  pemilik: string
  jenis: string
  produk: string
  harga?: string
  emoji?: string
  jamBuka: string
  whatsapp: string
  alamat?: string
  gmaps?: string
  aktif?: boolean
  fotoUrl?: string | null
}

type SanityGaleri = {
  id: string
  judul: string
  tanggal?: string
  emoji?: string
  deskripsi?: string
  warna?: string
  count?: number
  fotoCount?: number
  fotoUrls?: string[]
}

type SanitySektor = {
  key: string
  nama: string
  icon: string
  deskripsi: string
  stats?: { label: string; value: string }[]
  items?: string[]
}

export type MerapiStatusData = {
  level: 'Normal' | 'Waspada' | 'Siaga' | 'Awas'
  deskripsi?: string
  updatedAt?: string
}

function mapBerita(items: SanityBerita[]): BeritaItem[] {
  return items.map((b) => ({
    slug: b.slug,
    judul: b.judul,
    tanggal: b.tanggal,
    kategori: b.kategori,
    ringkasan: b.ringkasan,
    isi: b.isi,
  }))
}

function mapUMKM(items: SanityUMKM[]): UMKMItem[] {
  return items.map((u, i) => ({
    id: Number.isFinite(Number(u.id)) ? Number(u.id) : i + 1,
    nama: u.nama,
    pemilik: u.pemilik,
    jenis: u.jenis,
    produk: u.produk,
    harga: u.harga || '-',
    emoji: u.emoji || '🏪',
    jamBuka: u.jamBuka,
    whatsapp: u.whatsapp,
    aktif: u.aktif !== false,
    alamat: u.alamat,
    gmaps: u.gmaps,
  }))
}

function mapGaleri(items: SanityGaleri[]): GaleriAlbum[] {
  return items.map((g, i) => ({
    id: i + 1,
    judul: g.judul,
    tanggal: g.tanggal || '',
    emoji: g.emoji || '📸',
    count: g.fotoCount || g.count || 0,
    deskripsi: g.deskripsi || '',
    warna: g.warna || 'var(--gold)',
    foto: g.fotoUrls?.filter(Boolean),
  }))
}

function mapSektor(items: SanitySektor[]): Record<string, SektorData> {
  const out: Record<string, SektorData> = {}
  for (const s of items) {
    out[s.key] = {
      nama: s.nama,
      icon: s.icon,
      deskripsi: s.deskripsi,
      stats: s.stats || [],
      items: s.items || [],
    }
  }
  return out
}

export async function getBeritaList(): Promise<BeritaItem[]> {
  const data = await sanityFetch<SanityBerita[]>(beritaListQuery)
  if (data && data.length > 0) return mapBerita(data)
  return beritaJson as BeritaItem[]
}

export async function getBeritaBySlug(slug: string): Promise<BeritaItem | null> {
  const data = await sanityFetch<SanityBerita | null>(beritaBySlugQuery, { slug })
  if (data?.slug) return mapBerita([data])[0]
  const local = (beritaJson as BeritaItem[]).find((b) => b.slug === slug)
  return local || null
}

export async function getBeritaSlugs(): Promise<string[]> {
  const data = await sanityFetch<{ slug: string }[]>(beritaSlugsQuery)
  if (data && data.length > 0) return data.map((d) => d.slug).filter(Boolean)
  return (beritaJson as BeritaItem[]).map((b) => b.slug)
}

export async function getUMKMList(): Promise<UMKMItem[]> {
  const data = await sanityFetch<SanityUMKM[]>(umkmListQuery)
  if (data && data.length > 0) return mapUMKM(data)
  return umkmJson as UMKMItem[]
}

export async function getGaleriList(): Promise<GaleriAlbum[]> {
  const data = await sanityFetch<SanityGaleri[]>(galeriListQuery)
  if (data && data.length > 0) return mapGaleri(data)
  return galeriFallback
}

export async function getSektorMap(): Promise<Record<string, SektorData>> {
  const data = await sanityFetch<SanitySektor[]>(sektorListQuery)
  if (data && data.length > 0) return mapSektor(data)
  return sektorJson as Record<string, SektorData>
}

export async function getMerapiStatus(): Promise<MerapiStatusData> {
  const data = await sanityFetch<MerapiStatusData | null>(merapiStatusQuery)
  if (data?.level) return data
  return {
    level: 'Normal',
    deskripsi: 'Aktivitas vulkanik dalam batas normal',
    updatedAt: new Date().toISOString(),
  }
}
