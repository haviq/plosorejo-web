export const beritaListQuery = `*[_type == "berita"] | order(tanggal desc) {
  "slug": slug.current,
  judul,
  tanggal,
  kategori,
  ringkasan,
  isi,
  "fotoUrl": foto.asset->url
}`

export const beritaBySlugQuery = `*[_type == "berita" && slug.current == $slug][0] {
  "slug": slug.current,
  judul,
  tanggal,
  kategori,
  ringkasan,
  isi,
  "fotoUrl": foto.asset->url
}`

export const beritaSlugsQuery = `*[_type == "berita" && defined(slug.current)]{ "slug": slug.current }`

export const umkmListQuery = `*[_type == "umkm"] | order(nama asc) {
  "id": _id,
  nama,
  pemilik,
  jenis,
  produk,
  harga,
  emoji,
  jamBuka,
  whatsapp,
  alamat,
  gmaps,
  aktif,
  "fotoUrl": foto.asset->url
}`

export const galeriListQuery = `*[_type == "galeri"] | order(_createdAt desc) {
  "id": _id,
  judul,
  tanggal,
  emoji,
  deskripsi,
  warna,
  count,
  "fotoCount": count(foto),
  "fotoUrls": foto[].asset->url
}`

export const sektorListQuery = `*[_type == "sektor"] {
  key,
  nama,
  icon,
  deskripsi,
  stats[]{ label, value },
  items
}`

export const merapiStatusQuery = `*[_type == "merapiStatus"] | order(updatedAt desc)[0] {
  level,
  deskripsi,
  updatedAt
}`

export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  title,
  tagline,
  alamat,
  telepon,
  whatsapp,
  email,
  jamLayanan,
  mapsUrl,
  instagram,
  facebook,
  youtube,
  perangkat[]{ nama, jabatan, whatsapp, icon }
}`

export const layananListQuery = `*[_type == "layanan" && aktif != false] | order(nama asc) {
  "id": _id,
  "slug": slug.current,
  nama,
  kategori,
  deskripsi,
  waktu,
  biaya,
  syarat,
  alur,
  pic,
  icon,
  aktif
}`

export const kknArsipQuery = `*[_type == "kknArsip"] | order(tanggal desc) {
  "id": _id,
  judul,
  tanggal,
  kategori,
  ringkasan,
  status,
  link
}`

export const produksiSusuRecentQuery = `*[_type == "produksiSusu"] | order(tanggal desc)[0...30] {
  tanggal,
  peternak,
  volumeLiter,
  kualitas,
  status
}`
