import beritaJson from '@/content/berita.json'
import umkmJson from '@/content/umkm.json'
import sektorJson from '@/content/sektor.json'
import siteJson from '@/content/site.json'
import layananJson from '@/content/layanan.json'
import kknJson from '@/content/kkn.json'
import susuJson from '@/content/susu.json'
import poiJson from '@/content/poi.json'
import galeriJson from '@/content/galeri.json'
import { sanityFetch } from '@/sanity/lib/client'
import {
  beritaListQuery,
  beritaBySlugQuery,
  beritaSlugsQuery,
  umkmListQuery,
  galeriListQuery,
  sektorListQuery,
  merapiStatusQuery,
  siteSettingsQuery,
  layananListQuery,
  kknArsipQuery,
  produksiSusuRecentQuery,
} from '@/sanity/lib/queries'
import {
  fallbackMerapiStatus,
  fetchMerapiFromMagma,
} from '@/lib/merapi'
import type {
  BeritaItem,
  UMKMItem,
  SektorData,
  GaleriAlbum,
  SiteSettings,
  LayananItem,
  KknData,
  KknArsipItem,
  SusuData,
  SusuRow,
  PoiItem,
  MerapiStatusData,
} from '@/lib/types'

// Fallback galeri (local) when Sanity empty/unconfigured
const galeriFallback = galeriJson as GaleriAlbum[]

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

type SanitySite = Partial<SiteSettings> & {
  perangkat?: SiteSettings['perangkat']
}

type SanityLayanan = {
  id?: string
  slug?: string
  nama: string
  kategori?: string
  deskripsi?: string
  waktu?: string
  biaya?: string
  syarat?: string[]
  alur?: string[]
  pic?: string
  icon?: string
  aktif?: boolean
}

type SanityKkn = {
  id?: string
  judul: string
  tanggal?: string
  kategori?: string
  ringkasan?: string
  status?: string
  link?: string
}

type SanitySusu = {
  tanggal?: string
  peternak?: string
  volumeLiter?: number
  kualitas?: string
  status?: string
}

function mapBerita(items: SanityBerita[]): BeritaItem[] {
  return items.map((b) => ({
    slug: b.slug,
    judul: b.judul,
    tanggal: b.tanggal,
    kategori: b.kategori,
    ringkasan: b.ringkasan,
    isi: b.isi,
    fotoUrl: b.fotoUrl,
  }))
}

function mapUMKM(items: SanityUMKM[]): UMKMItem[] {
  const jenisIcon: Record<string, string> = {
    Koperasi: 'koperasi',
    Kuliner: 'kuliner',
    Kerajinan: 'kerajinan',
    Pertanian: 'pertanian',
    Jasa: 'jasa',
  }
  return items.map((u, i) => ({
    id: Number.isFinite(Number(u.id)) ? Number(u.id) : i + 1,
    nama: u.nama,
    pemilik: u.pemilik,
    jenis: u.jenis,
    produk: u.produk,
    harga: u.harga || '-',
    icon: jenisIcon[u.jenis] || u.emoji || 'umkm',
    jamBuka: u.jamBuka,
    whatsapp: u.whatsapp,
    aktif: u.aktif !== false,
    alamat: u.alamat,
    gmaps: u.gmaps,
  }))
}

function mapGaleri(items: SanityGaleri[]): GaleriAlbum[] {
  return items.map((g, i) => ({
    id: Number.isFinite(Number(g.id)) ? Number(g.id) : i + 1,
    judul: g.judul,
    tanggal: g.tanggal || '',
    icon: g.emoji || 'galeri',
    count: g.fotoCount || g.count || g.fotoUrls?.length || 0,
    deskripsi: g.deskripsi || '',
    warna: g.warna || 'var(--gold)',
    foto: g.fotoUrls?.filter(Boolean) || [],
  }))
}

function mapSektor(items: SanitySektor[]): Record<string, SektorData> {
  const out: Record<string, SektorData> = {}
  for (const s of items) {
    if (!s.key) continue
    out[s.key] = {
      nama: s.nama,
      deskripsi: s.deskripsi,
      icon: s.icon,
      stats: s.stats || [],
      items: s.items || [],
    }
  }
  return out
}

function mapLayanan(items: SanityLayanan[]): LayananItem[] {
  return items
    .filter((l) => l.aktif !== false)
    .map((l, i) => ({
      id: l.slug || l.id || `layanan-${i + 1}`,
      nama: l.nama,
      kategori: l.kategori || 'Lainnya',
      deskripsi: l.deskripsi || '',
      waktu: l.waktu || '-',
      biaya: l.biaya || 'Gratis',
      syarat: l.syarat || [],
      alur: l.alur || [],
      pic: l.pic || 'Petugas padukuhan',
      icon: l.icon || 'document',
    }))
}

function mapKknArsip(items: SanityKkn[]): KknArsipItem[] {
  return items.map((k, i) => ({
    id: k.id || `kkn-${i + 1}`,
    judul: k.judul,
    tanggal: k.tanggal || '',
    kategori: k.kategori || 'Lainnya',
    ringkasan: k.ringkasan || '',
    status: k.status || 'Berjalan',
    link: k.link,
  }))
}

function mapSusuRows(items: SanitySusu[]): SusuRow[] {
  return items.map((r) => ({
    date: r.tanggal || '',
    peternak: r.peternak || '-',
    volume: r.volumeLiter != null ? `${r.volumeLiter} L` : '-',
    kualitas: r.kualitas || '-',
    status: r.status || 'Diterima',
  }))
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
  if (data && data.length > 0) return data.map((d) => d.slug)
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

type SanityMerapi = {
  level?: MerapiStatusData['level']
  deskripsi?: string
  updatedAt?: string
  manualOverride?: boolean
}

/**
 * Hybrid Merapi status:
 * - Sanity manualOverride=true → pakai level CMS
 * - else → fetch MAGMA ESDM auto
 * - deskripsi CMS (catatan lokal) selalu bisa menempel di data auto
 */
export async function getMerapiStatus(): Promise<MerapiStatusData> {
  const cms = await sanityFetch<SanityMerapi | null>(merapiStatusQuery)

  // Manual override from Studio
  if (cms?.manualOverride && cms.level) {
    return {
      level: cms.level,
      deskripsi: cms.deskripsi || undefined,
      updatedAt: cms.updatedAt || new Date().toISOString(),
      source: 'sanity',
      sourceLabel: 'Override admin (Sanity)',
      officialUrl: 'https://magma.esdm.go.id/v1/gunung-api/tingkat-aktivitas',
      mountain: 'Gunung Merapi',
      note: 'Mode manual aktif di CMS',
    }
  }

  const live = await fetchMerapiFromMagma()
  if (live) {
    return {
      ...live,
      // local note from CMS if any
      deskripsi: cms?.deskripsi?.trim() ? cms.deskripsi : live.deskripsi,
      note: cms?.deskripsi?.trim() ? 'Level dari MAGMA · catatan lokal dari admin' : undefined,
    }
  }

  // fallback
  const fb = fallbackMerapiStatus('MAGMA tidak terjangkau')
  if (cms?.level) {
    return {
      level: cms.level,
      deskripsi: cms.deskripsi || fb.deskripsi,
      updatedAt: cms.updatedAt || fb.updatedAt,
      source: 'sanity',
      sourceLabel: 'Cadangan CMS (MAGMA gagal)',
      officialUrl: fb.officialUrl,
      mountain: 'Gunung Merapi',
    }
  }
  return fb
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await sanityFetch<SanitySite | null>(siteSettingsQuery)
  const fallback = siteJson as SiteSettings
  if (!data) return fallback
  return {
    title: data.title || fallback.title,
    tagline: data.tagline || fallback.tagline,
    alamat: data.alamat || fallback.alamat,
    telepon: data.telepon || fallback.telepon,
    whatsapp: data.whatsapp || fallback.whatsapp,
    email: data.email || fallback.email,
    jamLayanan: data.jamLayanan || fallback.jamLayanan,
    mapsUrl: data.mapsUrl || fallback.mapsUrl,
    instagram: data.instagram || fallback.instagram,
    facebook: data.facebook || fallback.facebook,
    youtube: data.youtube || fallback.youtube,
    perangkat:
      data.perangkat && data.perangkat.length > 0 ? data.perangkat : fallback.perangkat,
  }
}

export async function getLayananList(): Promise<LayananItem[]> {
  const data = await sanityFetch<SanityLayanan[]>(layananListQuery)
  if (data && data.length > 0) return mapLayanan(data)
  return layananJson as LayananItem[]
}

export async function getKknData(): Promise<KknData> {
  const fallback = kknJson as KknData
  const data = await sanityFetch<SanityKkn[]>(kknArsipQuery)
  if (data && data.length > 0) {
    return { ...fallback, arsip: mapKknArsip(data) }
  }
  return fallback
}

export async function getSusuData(): Promise<SusuData> {
  const fallback = susuJson as SusuData
  const data = await sanityFetch<SanitySusu[]>(produksiSusuRecentQuery)
  if (data && data.length > 0) {
    return {
      ...fallback,
      recent: mapSusuRows(data),
      updatedAt: data[0]?.tanggal || fallback.updatedAt,
    }
  }
  return fallback
}

export async function getPoiList(): Promise<PoiItem[]> {
  return poiJson as PoiItem[]
}

export type { MerapiStatusData }
