# Sanity CMS — Plosorejo

Admin konten non-IT friendly untuk website Padukuhan Plosorejo.

## Fitur admin (`/studio`)

- **Berita** — judul, slug, tanggal, kategori, ringkasan, isi, foto
- **UMKM** — nama, pemilik, jenis, produk, harga, jam buka, WA, maps, status aktif, foto
- **Galeri** — album, deskripsi, foto array
- **Sektor** — deskripsi + statistik per sektor
- **Status Merapi** — level Normal/Waspada/Siaga/Awas
- **Pengaturan Situs** — alamat, WA, email, jam layanan

## Setup (sekali saja)

### 1. Buat project Sanity

1. Buka https://www.sanity.io/manage
2. Login (Google/GitHub)
3. **Create project** → nama: `plosorejo`
4. Dataset: `production`
5. Salin **Project ID**

> Project ID Plosorejo: `p7xgykwm`  
> Organization: `oul4xr266`

### 2. Isi environment

Lokal (`.env.local`):

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=p7xgykwm
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
```

Vercel → Project Settings → Environment Variables → isi 3 var di atas → Redeploy.

### 3. CORS / host

Di Sanity manage → Project → API → CORS origins, tambahkan:

- `http://localhost:3000`
- `https://your-domain.vercel.app`

### 4. Jalankan

```bash
npm run dev
# buka http://localhost:3000/studio
```

Login dengan akun Sanity yang membuat project.

## Fallback data

Kalau Project ID belum diisi / dataset kosong, website **tetap jalan** pakai file JSON:

- `content/berita.json`
- `content/umkm.json`
- `content/sektor.json`
- galeri fallback di `lib/data.ts`

Setelah isi konten di Studio dan publish, website otomatis ambil dari Sanity (revalidate 60 detik).

## Alur admin desa

1. Buka `https://domain-anda/studio`
2. Login
3. Pilih menu (Berita / UMKM / Galeri / ...)
4. Klik **Create** / edit
5. **Publish**
6. Tunggu ±1 menit → muncul di website

## Catatan keamanan

- Jangan commit `.env.local` / token write
- Invite admin lewat Sanity manage → Members (bisa Viewer/Editor)
- Studio hanya untuk orang terpercaya (perangkat desa / KKN)
