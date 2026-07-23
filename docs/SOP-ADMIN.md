# SOP Admin Konten — Plosorejo

Panduan singkat untuk perangkat padukuhan / KKN (non-IT).

## 1. Buka CMS

1. Buka: https://plosorejo-web.vercel.app/studio  
2. Login akun Sanity yang di-undang (Editor)  
3. Jika muncul **Register Studio** → klik **Register Studio** (sekali saja)

## 2. Ganti data kontak (WA / alamat)

1. Menu **Pengaturan Situs**  
2. Isi:
   - WhatsApp Admin: `62812...` (tanpa +)
   - Telepon, email, jam layanan
   - Perangkat padukuhan (nama + WA)
3. Klik **Publish**

Website update dalam ±1 menit.

## 3. Tulis berita

1. Menu **Berita** → **Create**  
2. Isi judul, tanggal, kategori, ringkasan, isi  
3. (Opsional) upload foto  
4. **Publish**

## 4. Update UMKM

1. Menu **UMKM**  
2. Edit nama, produk, harga, jam buka, WhatsApp  
3. Centang **Aktif**  
4. **Publish**

## 5. Status Merapi

1. Menu **Status Merapi**  
2. Pilih level: Normal / Waspada / Siaga / Awas  
3. Isi deskripsi singkat  
4. **Publish**

## 6. Layanan administrasi

1. Menu **Layanan Administrasi**  
2. Edit syarat / alur / PIC  
3. **Publish**

## 7. Aturan aman

- Jangan bagikan password / token ke orang luar  
- Hanya 1–2 admin (Dukuh + 1 pendamping)  
- Setelah publish, cek halaman publik (hard refresh di HP)  
- Kalau CMS error, website tetap jalan pakai data cadangan JSON

## 8. Bantuan teknis

- Dokumentasi CMS: `CMS.md`  
- Roadmap fitur: `ROADMAP.md`  
- Seed data awal (IT only): `npm run cms:seed`  
- Backup JSON: `npm run content:backup`
