/**
 * Content data access: Sanity first, local JSON fallback.
 * Mappers live in ./data/mappers — keep this file as the public API.
 */
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
import { fallbackMerapiStatus, fetchMerapiFromMagma, MAGMA_TINGKAT_URL } from '@/lib/merapi'
import {
  mapBerita,
  mapUMKM,
  mapGaleri,
  mapSektor,
  mapLayanan,
  mapKknArsip,
  mapSusuRows,
  mergeSiteSettings,
} from '@/lib/data/mappers'
import type {
  SanityBerita,
  SanityUMKM,
  SanityGaleri,
  SanitySektor,
  SanitySite,
  SanityLayanan,
  SanityKkn,
  SanitySusu,
  SanityMerapi,
} from '@/lib/data/sanity-types'
import type {
  BeritaItem,
  UMKMItem,
  SektorData,
  GaleriAlbum,
  SiteSettings,
  LayananItem,
  KknData,
  SusuData,
  PoiItem,
  MerapiStatusData,
} from '@/lib/types'

const galeriFallback = galeriJson as GaleriAlbum[]

export async function getBeritaList(): Promise<BeritaItem[]> {
  const data = await sanityFetch<SanityBerita[]>(beritaListQuery)
  if (data && data.length > 0) return mapBerita(data)
  return beritaJson as BeritaItem[]
}

export async function getBeritaBySlug(slug: string): Promise<BeritaItem | null> {
  const safeSlug = slug.slice(0, 160)
  const data = await sanityFetch<SanityBerita | null>(beritaBySlugQuery, { slug: safeSlug })
  if (data?.slug) return mapBerita([data])[0]
  const local = (beritaJson as BeritaItem[]).find((b) => b.slug === safeSlug)
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

/**
 * Hybrid Merapi status:
 * - Sanity manualOverride=true → CMS level
 * - else → MAGMA ESDM auto
 * - CMS deskripsi can annotate live data
 */
export async function getMerapiStatus(): Promise<MerapiStatusData> {
  const cms = await sanityFetch<SanityMerapi | null>(merapiStatusQuery)

  if (cms?.manualOverride && cms.level) {
    return {
      level: cms.level,
      deskripsi: cms.deskripsi || undefined,
      updatedAt: cms.updatedAt || new Date().toISOString(),
      source: 'sanity',
      sourceLabel: 'Override admin (Sanity)',
      officialUrl: MAGMA_TINGKAT_URL,
      mountain: 'Gunung Merapi',
      note: 'Mode manual aktif di CMS',
    }
  }

  const live = await fetchMerapiFromMagma()
  if (live) {
    return {
      ...live,
      deskripsi: cms?.deskripsi?.trim() ? cms.deskripsi : live.deskripsi,
      note: cms?.deskripsi?.trim() ? 'Level dari MAGMA · catatan lokal dari admin' : undefined,
    }
  }

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
  return mergeSiteSettings(data, siteJson as SiteSettings)
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
