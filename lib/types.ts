export interface UMKMItem {
  id: number
  nama: string
  pemilik: string
  jenis: string
  produk: string
  harga: string
  icon: string
  jamBuka: string
  whatsapp: string
  aktif: boolean
  gmaps?: string
  alamat?: string
  /** @deprecated use icon */
  emoji?: string
}

export interface BeritaItem {
  slug: string
  judul: string
  tanggal: string
  kategori: string
  ringkasan: string
  isi: string
  fotoUrl?: string | null
}

export interface SektorStat {
  label: string
  value: string
}

export interface SektorData {
  nama: string
  deskripsi: string
  icon: string
  stats: SektorStat[]
  items: string[]
}

export interface GaleriAlbum {
  id: number
  judul: string
  tanggal: string
  icon: string
  count: number
  deskripsi: string
  warna: string
  foto?: string[]
  /** @deprecated use icon */
  emoji?: string
}

export interface SitePerangkat {
  nama: string
  jabatan: string
  whatsapp: string
  icon?: string
}

export interface SiteSettings {
  title: string
  tagline: string
  alamat: string
  telepon: string
  whatsapp: string
  email: string
  jamLayanan: string
  mapsUrl?: string
  instagram?: string
  facebook?: string
  youtube?: string
  perangkat: SitePerangkat[]
}

export interface LayananItem {
  id: string
  nama: string
  kategori: string
  deskripsi: string
  waktu: string
  biaya: string
  syarat: string[]
  alur: string[]
  pic: string
  icon?: string
}

export interface KknArsipItem {
  id: string
  judul: string
  tanggal: string
  kategori: string
  ringkasan: string
  status: string
  link?: string
}

export interface KknData {
  tahun: number
  universitas: string
  unit: string
  periode: string
  jumlahMahasiswa: number
  lokasi: string
  fokus: string[]
  kontak: {
    dpl: string
    ketuaTim: string
    email: string
  }
  arsip: KknArsipItem[]
}

export interface SusuRow {
  date: string
  peternak: string
  volume: string
  kualitas: string
  status: string
}

export interface SusuData {
  updatedAt: string
  unit: string
  summary: {
    produksiHarian: string
    sapiAktif: number
    kelompok: number
    gradeDominan: string
  }
  monthly: { month: string; value: number }[]
  recent: SusuRow[]
}

export interface PoiItem {
  lat: number
  lng: number
  label: string
  type: string
  desc?: string
}

export interface MerapiStatusData {
  level: 'Normal' | 'Waspada' | 'Siaga' | 'Awas'
  roman?: 'I' | 'II' | 'III' | 'IV'
  deskripsi?: string
  updatedAt?: string
  source?: 'magma' | 'sanity' | 'fallback'
  sourceLabel?: string
  reportUrl?: string
  officialUrl?: string
  mountain?: string
  fetchedAt?: string
  rawLevelLabel?: string
  note?: string
}
