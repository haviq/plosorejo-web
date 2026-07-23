# Checklist go-live CMS Plosorejo

## 1) Vercel env
Project Settings → Environment Variables:

- `NEXT_PUBLIC_SANITY_PROJECT_ID=p7xgykwm`
- `NEXT_PUBLIC_SANITY_DATASET=production`
- `NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01`

Redeploy setelah simpan.

## 2) Register Studio
1. Buka https://plosorejo-web.vercel.app/studio
2. Klik **Register Studio**
3. Login project Sanity `plosorejo`

## 3) Invite admin
Sanity Manage → Members → invite 1–2 orang sebagai **Editor**.

## 4) Ganti data real (wajib)
Studio → **Pengaturan Situs**:
- WhatsApp admin (format `62812...`)
- Telepon, email, jam layanan
- Daftar perangkat + WA masing-masing

Publish → hard refresh website.

## 5) Seed konten (opsional IT)
```bash
export SANITY_API_WRITE_TOKEN=sk...
npm run cms:seed
```

## 6) Upload foto
- Galeri albums
- Cover berita
- Foto UMKM (kalau ada field)

## 7) Cek halaman
- `/` beranda
- `/layanan`
- `/kontak` (WA tombol)
- `/berita` + share
- `/peta`
- `/kkn`
- `/susu`
- mode cerah + gelap di HP

## 8) Backup
```bash
npm run content:backup
```
