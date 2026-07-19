---
name: plosorejo-web
description: "Website Padukuhan Plosorejo — Next.js 16 project conventions, structure, and development workflow."
version: 1.0.0
author: KKN UGM Kelompok 1
license: MIT
platforms: [linux]
metadata:
  hermes:
    tags: [nextjs, plosorejo, kkn, website, padukuhan, tailwind]
    related_skills: [nextjs-deployment, design-md, sketch]
---

# Plosorejo Web — Project Skill

Website profil Padukuhan Plosorejo, Umbulharjo, Cangkringan, Sleman.
Dibuat oleh KKN UGM Kelompok 1 · 2026.

## Project Info

| Key | Value |
|-----|-------|
| **Path** | `/opt/data/plosorejo-web` |
| **Framework** | Next.js 16 (App Router) |
| **Styling** | Tailwind CSS |
| **Hosting** | Vercel (target) |
| **Theme** | Dark (`#080808`) + Gold (`#d4af37`) |
| **Design tokens** | `/opt/data/plosorejo-web/DESIGN.md` |
| **PRD** | `/opt/data/plosorejo-sample/PRD-Website-Padukuhan-Plosorejo.md` |
| **HTML Mockups** | `/opt/data/plosorejo-sample/sketches/` |

## ⚠️ Critical: Next.js Version Warning

> This project uses Next.js **16** — breaking changes apply vs. your training data.
> **Always read** `node_modules/next/dist/docs/` before writing any Next.js code.
> Heed deprecation notices in `plosorejo-web/AGENTS.md`.

## Directory Structure

```
plosorejo-web/
├── app/                    # App Router pages
│   ├── layout.tsx          # Root layout (dark theme, fonts)
│   ├── page.tsx            # Beranda (homepage)
│   ├── profil/             # Profil Padukuhan
│   ├── sektor/
│   │   ├── umkm/           # UMKM catalog
│   │   ├── pertanian/
│   │   ├── peternakan/
│   │   ├── pariwisata/
│   │   ├── pendidikan/
│   │   ├── kesehatan/
│   │   └── budaya/
│   ├── berita/
│   │   ├── page.tsx        # Daftar berita
│   │   └── [slug]/         # Detail berita
│   ├── galeri/             # Galeri KKN
│   └── kontak/
├── components/
│   ├── ui/                 # shadcn/ui base components
│   ├── layout/             # Navbar, Sidebar, Footer
│   ├── sections/           # Hero, SectorGrid, StatBar, etc.
│   └── widgets/            # MerapiStatus, NewsWidget, UMKMCard
├── content/
│   ├── berita/             # MDX artikel berita
│   ├── umkm/               # JSON data UMKM
│   ├── sektor/             # JSON data per sektor
│   └── galeri/             # JSON metadata galeri
├── public/
│   ├── images/             # Foto padukuhan, UMKM, wisata
│   └── icons/
├── lib/
│   ├── data.ts             # Data fetching helpers
│   └── utils.ts            # cn(), formatDate(), etc.
├── DESIGN.md               # Design tokens & visual system
├── SKILL.md                # This file
└── AGENTS.md               # Next.js version notes
```

## Route Map

```
/                    → Beranda (hero, status Merapi, sektor, berita)
/profil              → Profil Padukuhan
/sektor/umkm         → Katalog UMKM (12 usaha)
/sektor/pertanian    → Sektor Pertanian
/sektor/peternakan   → Sektor Peternakan (unggulan: sapi perah)
/sektor/pariwisata   → Wisata (3 destinasi)
/sektor/pendidikan   → Sektor Pendidikan
/sektor/kesehatan    → Jadwal Posyandu, Puskesmas
/sektor/budaya       → Budaya & Tradisi
/berita              → Daftar berita padukuhan
/berita/[slug]       → Detail artikel
/galeri              → Galeri KKN 2026
/kontak              → Kontak & Maps
```

## Design System Quick Reference

Lihat `DESIGN.md` untuk token lengkap. Ringkasan:

```css
/* Colors */
--bg: #080808          /* page background */
--surface: #111111     /* card */
--gold: #d4af37        /* primary accent */
--text: #ede8d8        /* body text */
--muted: #888888       /* secondary text */

/* Fonts */
--font-display: 'Playfair Display', serif   /* headings */
--font-body: 'Inter', sans-serif            /* UI/body */

/* Radius */
--radius-lg: 16px
--radius-pill: 99px
```

Tailwind class equivalents:
```
bg-[#080808]  bg-[#111]  text-[#d4af37]  text-[#ede8d8]
border-[rgba(212,175,55,0.18)]
```

## Data Layer

Konten disimpan sebagai flat JSON/MDX — tidak ada CMS untuk V1.

### UMKM (`content/umkm/`)
```ts
interface UMKM {
  id: string
  nama: string
  pemilik: string
  jenis: string
  produk: string[]
  harga: string
  foto: string[]
  jamOperasional: string
  whatsapp?: string
  gmaps?: string
  sosmed?: string
  aktif: boolean
}
```

### Berita (`content/berita/` — MDX)
```
---
title: "Kerja Bakti RT 04"
date: "2026-07-18"
kategori: "gotong-royong"
foto: "/images/berita/kerja-bakti-rt04.jpg"
---
```

### Sektor (`content/sektor/[nama].json`)
```ts
interface SektorData {
  nama: string
  deskripsi: string
  stats: { label: string; value: string }[]
  items: object[]   // varies per sector
  dokumentasi: string[]
}
```

## Key Components

### `<MerapiStatus />`
- Fetch data manual (update by admin)
- Level: I Normal | II Waspada | III Siaga | IV Awas
- Color: green → yellow → orange → red
- Display: animated pulse dot + label

### `<UMKMCard />`
- Foto produk, nama, jenis, jam buka dot, tombol WA
- Tombol WA: `https://wa.me/62${nomor}`
- Foto: lightbox on click

### `<SectorGrid />`
- 6 kartu sektor di beranda
- Hover: gold border + gold-glow bg
- Icon: emoji atau Lucide icon

### `<NewsWidget />`
- List 4–5 berita terbaru
- Date + title, link ke `/berita/[slug]`

### `<GaleriGrid />`
- Masonry atau uniform grid
- Swipe carousel di mobile
- Caption per foto

## Development Workflow

```bash
cd /opt/data/plosorejo-web

# Install deps
uv run npm install   # or npm install

# Dev server
npm run dev          # localhost:3000

# Build
npm run build

# Check Next.js docs
cat node_modules/next/dist/docs/*.md | head -100
```

## Content Update Guide (untuk admin padukuhan)

1. Edit file JSON di `content/umkm/` untuk update data UMKM
2. Tambah file `.mdx` di `content/berita/` untuk berita baru
3. Ganti foto di `public/images/` (nama file sama)
4. Push ke GitHub → Vercel auto-deploy

## Pitfalls

- **Next.js 16 breaking changes** — jangan asumsi API sama dengan versi 14/15. Cek `AGENTS.md` dan docs.
- **Font loading** — gunakan `next/font` bukan `<link>` di `<head>`
- **Image optimization** — selalu pakai `next/image`, bukan `<img>`
- **Tailwind arbitrary values** — untuk warna custom pakai `bg-[#d4af37]` syntax
- **Mobile first** — semua komponen harus responsive, test di 375px
- **WhatsApp link** — format `https://wa.me/62XXXXXXXXX` (tanpa `0` di depan)
- **Maps embed** — Google Maps embed gratis tapi perlu API key untuk fitur advanced
- **Peta wilayah** — tunggu proker fisik sebelum implementasi

## Acceptance Criteria (dari PRD)

- [ ] 12 halaman/seksi terisi konten riil
- [ ] Accessible via domain/subdomain publik
- [ ] Tampil baik di Android Chrome (375px)
- [ ] Semua WA UMKM berfungsi
- [ ] Google Maps embed di /kontak
- [ ] Galeri ≥ 30 foto
- [ ] Status Merapi di Beranda
- [ ] Admin bisa update berita tanpa developer

## Related Files

- `DESIGN.md` — design tokens lengkap
- `/opt/data/plosorejo-sample/PRD-Website-Padukuhan-Plosorejo.md` — PRD v1.0
- `/opt/data/plosorejo-sample/sketches/001-dashboard-bento/` — mockup bento
- `/opt/data/plosorejo-sample/sketches/002-editorial-sidebar/` — mockup editorial
