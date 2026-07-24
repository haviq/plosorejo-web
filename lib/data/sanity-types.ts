import type {
  BeritaItem,
  UMKMItem,
  SektorData,
  GaleriAlbum,
  SiteSettings,
  LayananItem,
  KknArsipItem,
  SusuRow,
  MerapiStatusData,
} from '@/lib/types'

/** Raw shapes returned by Sanity GROQ (subset used by mappers). */
export type SanityBerita = {
  slug: string
  judul: string
  tanggal: string
  kategori: string
  ringkasan: string
  isi: string
  fotoUrl?: string | null
}

export type SanityUMKM = {
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

export type SanityGaleri = {
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

export type SanitySektor = {
  key: string
  nama: string
  icon: string
  deskripsi: string
  stats?: { label: string; value: string }[]
  items?: string[]
}

export type SanitySite = Partial<SiteSettings> & {
  perangkat?: SiteSettings['perangkat']
}

export type SanityLayanan = {
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

export type SanityKkn = {
  id?: string
  judul: string
  tanggal?: string
  kategori?: string
  ringkasan?: string
  status?: string
  link?: string
}

export type SanitySusu = {
  tanggal?: string
  peternak?: string
  volumeLiter?: number
  kualitas?: string
  status?: string
}

export type SanityMerapi = {
  level?: MerapiStatusData['level']
  deskripsi?: string
  updatedAt?: string
  manualOverride?: boolean
}

export type {
  BeritaItem,
  UMKMItem,
  SektorData,
  GaleriAlbum,
  SiteSettings,
  LayananItem,
  KknArsipItem,
  SusuRow,
  MerapiStatusData,
}
