export interface UMKMItem {
  id: number
  nama: string
  pemilik: string
  jenis: string
  produk: string
  harga: string
  emoji: string
  jamBuka: string
  whatsapp: string
  aktif: boolean
  gmaps?: string
  alamat?: string
}

export interface BeritaItem {
  slug: string
  judul: string
  tanggal: string
  kategori: string
  ringkasan: string
  isi: string
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
  emoji: string
  count: number
  deskripsi: string
  warna: string
  foto?: string[]
}
