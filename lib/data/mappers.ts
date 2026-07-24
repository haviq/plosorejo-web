import type {
  BeritaItem,
  UMKMItem,
  SektorData,
  GaleriAlbum,
  SiteSettings,
  LayananItem,
  KknArsipItem,
  SusuRow,
  SanityBerita,
  SanityUMKM,
  SanityGaleri,
  SanitySektor,
  SanitySite,
  SanityLayanan,
  SanityKkn,
  SanitySusu,
} from '@/lib/data/sanity-types'
import { safeMapsHref, isSafeHref, safeExternalHref } from '@/lib/safe-url'
import { normalizeWa } from '@/lib/site'

const JENIS_ICON: Record<string, string> = {
  Koperasi: 'koperasi',
  Kuliner: 'kuliner',
  Kerajinan: 'kerajinan',
  Pertanian: 'pertanian',
  Jasa: 'jasa',
}

function asNumberId(raw: unknown, fallback: number): number {
  const n = Number(raw)
  return Number.isFinite(n) ? n : fallback
}

function cleanText(input?: string | null, max = 2000): string {
  if (!input) return ''
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim()
    .slice(0, max)
}

export function mapBerita(items: SanityBerita[]): BeritaItem[] {
  return items.map((b) => ({
    slug: cleanText(b.slug, 120),
    judul: cleanText(b.judul, 200),
    tanggal: b.tanggal,
    kategori: cleanText(b.kategori, 80),
    ringkasan: cleanText(b.ringkasan, 500),
    isi: cleanText(b.isi, 20000),
    fotoUrl: b.fotoUrl || undefined,
  }))
}

export function mapUMKM(items: SanityUMKM[]): UMKMItem[] {
  return items.map((u, i) => ({
    id: asNumberId(u.id, i + 1),
    nama: cleanText(u.nama, 120),
    pemilik: cleanText(u.pemilik, 80),
    jenis: cleanText(u.jenis, 40),
    produk: cleanText(u.produk, 300),
    harga: cleanText(u.harga, 80) || '-',
    icon: JENIS_ICON[u.jenis] || cleanText(u.emoji, 40) || 'umkm',
    jamBuka: cleanText(u.jamBuka, 40),
    whatsapp: normalizeWa(u.whatsapp) || cleanText(u.whatsapp, 20),
    aktif: u.aktif !== false,
    alamat: cleanText(u.alamat, 200) || undefined,
    gmaps: safeMapsHref(u.gmaps) || undefined,
  }))
}

export function mapGaleri(items: SanityGaleri[]): GaleriAlbum[] {
  return items.map((g, i) => ({
    id: asNumberId(g.id, i + 1),
    judul: cleanText(g.judul, 120),
    tanggal: g.tanggal || '',
    icon: cleanText(g.emoji, 40) || 'galeri',
    count: g.fotoCount || g.count || g.fotoUrls?.length || 0,
    deskripsi: cleanText(g.deskripsi, 400),
    warna: cleanText(g.warna, 40) || 'var(--gold)',
    foto: (g.fotoUrls || []).filter((u): u is string => Boolean(u && /^https?:\/\//i.test(u))),
  }))
}

export function mapSektor(items: SanitySektor[]): Record<string, SektorData> {
  const out: Record<string, SektorData> = {}
  for (const s of items) {
    if (!s.key) continue
    out[cleanText(s.key, 40)] = {
      nama: cleanText(s.nama, 80),
      deskripsi: cleanText(s.deskripsi, 800),
      icon: cleanText(s.icon, 40),
      stats: (s.stats || []).map((st) => ({
        label: cleanText(st.label, 60),
        value: cleanText(st.value, 40),
      })),
      items: (s.items || []).map((it) => cleanText(it, 120)),
    }
  }
  return out
}

export function mapLayanan(items: SanityLayanan[]): LayananItem[] {
  return items
    .filter((l) => l.aktif !== false)
    .map((l, i) => ({
      id: cleanText(l.slug || l.id, 80) || `layanan-${i + 1}`,
      nama: cleanText(l.nama, 120),
      kategori: cleanText(l.kategori, 60) || 'Lainnya',
      deskripsi: cleanText(l.deskripsi, 800),
      waktu: cleanText(l.waktu, 80) || '-',
      biaya: cleanText(l.biaya, 80) || 'Gratis',
      syarat: (l.syarat || []).map((x) => cleanText(x, 200)),
      alur: (l.alur || []).map((x) => cleanText(x, 200)),
      pic: cleanText(l.pic, 80) || 'Petugas padukuhan',
      icon: cleanText(l.icon, 40) || 'document',
    }))
}

export function mapKknArsip(items: SanityKkn[]): KknArsipItem[] {
  return items.map((k, i) => {
    const rawLink = k.link?.trim()
    let link: string | undefined
    if (rawLink && isSafeHref(rawLink)) {
      link = rawLink.startsWith('/') ? rawLink : safeExternalHref(rawLink) || undefined
    }
    return {
      id: cleanText(k.id, 80) || `kkn-${i + 1}`,
      judul: cleanText(k.judul, 160),
      tanggal: k.tanggal || '',
      kategori: cleanText(k.kategori, 60) || 'Lainnya',
      ringkasan: cleanText(k.ringkasan, 500),
      status: cleanText(k.status, 40) || 'Berjalan',
      link,
    }
  })
}

export function mapSusuRows(items: SanitySusu[]): SusuRow[] {
  return items.map((r) => ({
    date: r.tanggal || '',
    peternak: cleanText(r.peternak, 80) || '-',
    volume: r.volumeLiter != null ? `${r.volumeLiter} L` : '-',
    kualitas: cleanText(r.kualitas, 40) || '-',
    status: cleanText(r.status, 40) || 'Diterima',
  }))
}

export function mergeSiteSettings(
  data: SanitySite | null | undefined,
  fallback: SiteSettings,
): SiteSettings {
  if (!data) return fallback
  return {
    title: cleanText(data.title, 120) || fallback.title,
    tagline: cleanText(data.tagline, 200) || fallback.tagline,
    alamat: cleanText(data.alamat, 300) || fallback.alamat,
    telepon: cleanText(data.telepon, 40) || fallback.telepon,
    whatsapp: normalizeWa(data.whatsapp) || fallback.whatsapp,
    email: cleanText(data.email, 120) || fallback.email,
    jamLayanan: cleanText(data.jamLayanan, 80) || fallback.jamLayanan,
    mapsUrl: safeMapsHref(data.mapsUrl) || fallback.mapsUrl,
    instagram: cleanText(data.instagram, 120) || fallback.instagram,
    facebook: cleanText(data.facebook, 120) || fallback.facebook,
    youtube: cleanText(data.youtube, 120) || fallback.youtube,
    perangkat:
      data.perangkat && data.perangkat.length > 0
        ? data.perangkat.map((p) => ({
            ...p,
            nama: cleanText(p.nama, 80),
            jabatan: cleanText(p.jabatan, 80),
            whatsapp: normalizeWa(p.whatsapp) || p.whatsapp,
          }))
        : fallback.perangkat,
  }
}
