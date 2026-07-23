# Status Merapi real-time (hybrid)

## Ringkas
Website menampilkan status Gunung Merapi dari **MAGMA ESDM** secara otomatis.
Admin bisa **override manual** lewat Sanity Studio bila perlu.

## Sumber
1. **MAGMA ESDM** — https://magma.esdm.go.id/v1/gunung-api/tingkat-aktivitas (utama)
2. **Sanity** — override manual + catatan lokal
3. **Fallback** — jika MAGMA dan CMS gagal

## Alur
```
Request halaman / API
        |
        v
Sanity manualOverride?
   | yes -> tampilkan level CMS
   | no
   v
Fetch MAGMA HTML -> parse baris Merapi Yogyakarta
   | sukses -> level auto + catatan CMS (opsional)
   | gagal  -> CMS level / fallback lokal
```

## Endpoint
- `GET /api/merapi` — status live (JSON)
- `GET /api/merapi?force=1` — bypass cache proses
- `GET /api/cron/merapi` — refresh terjadwal (setiap 30 menit via vercel.json)

Lindungi cron (opsional) dengan env `CRON_SECRET` dan header:
`Authorization: Bearer <CRON_SECRET>`

## Admin CMS
Studio -> **Status Merapi**
- `manualOverride = false` -> otomatis MAGMA (default)
- `manualOverride = true` -> pakai level manual
- `deskripsi` -> catatan lokal warga (tampil juga di mode auto)

## Level
| Roman | Status UI |
|---|---|
| I | Normal |
| II | Waspada |
| III | Siaga |
| IV | Awas |

## Warna UI
- Normal -> emas
- Waspada -> kuning
- Siaga -> oranye
- Awas -> merah

## Catatan teknis
- Parser HTML MAGMA bisa berubah jika layout situs berubah.
- Ada cache in-memory ~10 menit + fetch revalidate 15 menit.
- Selalu tampilkan link "Cek sumber resmi".
- Marapi (Sumatera Barat) diabaikan; hanya Merapi DIY/Jateng.
