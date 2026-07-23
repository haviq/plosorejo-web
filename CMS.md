# Sanity CMS — Plosorejo

Admin konten non-IT friendly untuk website Padukuhan Plosorejo.

## Fitur admin (`/studio`)

- **Berita** — judul, slug, tanggal, kategori, ringkasan, isi, foto
- **UMKM** — nama, pemilik, jenis, produk, harga, jam buka, WA, maps, status aktif, foto
- **Galeri** — album, deskripsi, foto array
- **Sektor** — deskripsi + statistik per sektor
- **Status Merapi** — level Normal/Waspada/Siaga/Awas
- **Pengaturan Situs** — alamat, WA, email, jam layanan, perangkat
- **Layanan Administrasi** — syarat, alur, PIC, biaya
- **Arsip KKN** — dokumentasi kegiatan
- **Produksi Susu Harian** — setoran per kelompok

## Setup (sekali saja)

### 1. Buat / pakai project Sanity

1. Buka https://www.sanity.io/manage
2. Login (Google/GitHub)
3. Project: `plosorejo`
4. Dataset: `production`
5. Project ID: `p7xgykwm`

### 2. Environment

Lokal (`.env.local`):

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=p7xgykwm
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
# optional for seed:
SANITY_API_WRITE_TOKEN=sk...
```

Vercel → Project Settings → Environment Variables → isi 3 var `NEXT_PUBLIC_*` → Redeploy.

### 3. Register Studio + CORS

1. Buka https://plosorejo-web.vercel.app/studio
2. Klik **Register Studio** (recommended)
3. Pastikan origin production terdaftar

### 4. Seed konten awal (opsional, IT)

```bash
export SANITY_API_WRITE_TOKEN=sk...
npm run cms:seed
```

### 5. Jalankan lokal

```bash
npm run dev
# buka http://localhost:3000/studio
```

## Fallback data

Kalau Project ID belum diisi / dataset kosong, website **tetap jalan** pakai file JSON:

- `content/berita.json`
- `content/umkm.json`
- `content/sektor.json`
- `content/site.json`
- `content/layanan.json`
- `content/kkn.json`
- `content/susu.json`
- `content/poi.json`
- galeri fallback di `lib/data.ts`

Setelah isi konten di Studio dan publish, website otomatis ambil dari Sanity (revalidate 60 detik).

## Alur admin desa

Lihat `docs/SOP-ADMIN.md`.

1. Buka `/studio`
2. Login
3. Create / edit
4. **Publish**
5. Tunggu ±1 menit

## Backup

```bash
npm run content:backup
# hasil di content/backups/<timestamp>/
```

## Catatan keamanan

- Jangan commit `.env.local` / token write
- Invite admin lewat Sanity manage → Members (Editor)
- Studio hanya untuk orang terpercaya (perangkat desa / KKN)
