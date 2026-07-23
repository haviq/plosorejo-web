# Roadmap Plosorejo Web — 3 Fase

Status implementasi di codebase (Juli 2026).

## Fase A — Bisa dipamerkan resmi ✅ (fondasi)

| Item | Status | Catatan |
|---|---|---|
| Sanity Studio `/studio` | ✅ wired | Admin harus **Register Studio** + env Vercel |
| Schema konten lengkap | ✅ | berita, umkm, galeri, sektor, merapi, siteSettings, layanan, kkn, produksiSusu |
| Fallback JSON | ✅ | `content/*.json` |
| Kontak/WA dari settings | ✅ | `getSiteSettings()` + form WA dinamis |
| Seed script | ✅ | `npm run cms:seed` (butuh write token) |
| SOP admin | ✅ | `docs/SOP-ADMIN.md` |
| Foto asli | ⚠️ themed SVG | Ganti lewat Studio/upload foto real |

**Aksi manusia yang masih perlu:**
1. Register Studio di production  
2. Set env Vercel (`NEXT_PUBLIC_SANITY_*`)  
3. Ganti nomor WA/email real di Pengaturan Situs  
4. Upload foto asli berita/galeri/UMKM  

## Fase B — Dipakai warga ✅

| Item | Status | Path |
|---|---|---|
| Halaman Layanan administrasi | ✅ | `/layanan` |
| Share berita (WA/FB/X) + OG | ✅ | `/berita/[slug]` |
| POI peta diperkaya | ✅ | `content/poi.json` + `/peta` |
| UMKM WA order | ✅ | `UMKMCard` sudah pakai `waLink` |
| Merapi dari CMS | ✅ | schema + `getMerapiStatus` |
| Nav/Footer link layanan | ✅ | |

## Fase C — Data & operasional ✅ (fondasi)

| Item | Status | Catatan |
|---|---|---|
| Model data susu | ✅ | `content/susu.json` + schema `produksiSusu` + `/susu` |
| Arsip KKN | ✅ | `/kkn` + schema `kknArsip` |
| Backup konten | ✅ | `npm run content:backup` |
| Evaluasi Directus | 📝 docs | Pakai kalau data tabular harian makin berat |

## Perintah IT

```bash
# backup JSON lokal
npm run content:backup

# seed Sanity (butuh SANITY_API_WRITE_TOKEN)
npm run cms:seed
```

## Prioritas next (setelah deploy)

1. Register Studio + invite admin  
2. Ganti data dummy kontak  
3. Seed konten  
4. Upload foto  
5. Latih 1 admin desa dengan SOP
