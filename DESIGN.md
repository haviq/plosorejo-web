# DESIGN.md — Website Padukuhan Plosorejo

> Design token reference & visual system for the Plosorejo web project.
> Generated from PRD v1.0 · KKN UNRIYO Unit 9 · 2026

---

## 1. Brand Identity

| Attribute | Value |
|-----------|-------|
| **Product name** | Website Padukuhan Plosorejo |
| **Tagline** | *Desa yang Hidup, Potensi yang Nyata* |
| **Audience** | Warga, UMKM, wisatawan, instansi |
| **Voice** | Informatif, hangat, lokal, terpercaya |

---

## 2. Color Tokens

### Base Palette

```css
--color-bg:        #080808;   /* near-black page background */
--color-surface:   #111111;   /* card / panel surface */
--color-surface2:  #1a1a1a;   /* nested surface, hover state */
--color-border:    rgba(212, 175, 55, 0.18); /* subtle gold border */

--color-gold:      #d4af37;   /* primary accent */
--color-gold-dim:  #a08828;   /* dimmed / hover gold */
--color-gold-glow: rgba(212, 175, 55, 0.12); /* glow / highlight bg */

--color-text:      #ede8d8;   /* primary text (warm white) */
--color-muted:     #888888;   /* secondary text */
--color-muted2:    #444444;   /* disabled / placeholder */
```

### Semantic / Status

```css
--color-success:   #22c55e;   /* status normal / open / active */
--color-warning:   #f59e0b;   /* status waspada */
--color-danger:    #ef4444;   /* status siaga / awas */
--color-info:      #60a5fa;   /* informational */
```

### Merapi Status Colors

| Level | Color | Token |
|-------|-------|-------|
| Normal (I) | `#22c55e` | `--color-success` |
| Waspada (II) | `#f59e0b` | `--color-warning` |
| Siaga (III) | `#f97316` | `--color-orange` |
| Awas (IV) | `#ef4444` | `--color-danger` |

---

## 3. Typography

### Font Stack

```css
--font-display: 'Playfair Display', Georgia, serif;  /* headings */
--font-body:    'Inter', system-ui, sans-serif;       /* body, UI */
--font-mono:    'JetBrains Mono', monospace;          /* code */
```

### Scale

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `--text-xs` | 0.68rem | 400 | Labels, captions, dates |
| `--text-sm` | 0.8rem | 400 | Secondary body, card desc |
| `--text-base` | 0.9rem | 400 | Primary body text |
| `--text-md` | 1rem | 500–600 | Card titles |
| `--text-lg` | 1.25rem | 700 | Section subheadings |
| `--text-xl` | 1.4–1.6rem | 700 | Page titles (Inter) |
| `--text-2xl` | 2.2–2.8rem | 700 | Hero headings (Playfair) |

### Rules
- Headings in pages: `Playfair Display` — editorial feel
- UI labels, nav, buttons: `Inter`
- Letter-spacing on UPPERCASE labels: `0.10–0.15em`
- Line-height body: `1.6` · headings: `1.15`

---

## 4. Spacing & Layout

```css
--radius-sm:   6px;
--radius-md:   10px;
--radius-lg:   16px;
--radius-pill: 99px;

--gap-xs:  6px;
--gap-sm:  10px;
--gap-md:  16px;
--gap-lg:  24px;
--gap-xl:  32px;
--gap-2xl: 48px;

--max-width: 1200px;
--sidebar-w: 260px;        /* editorial layout sidebar */
```

---

## 5. Component Patterns

### Card

```css
background: var(--color-surface);
border: 1px solid var(--color-border);
border-radius: var(--radius-lg);
padding: 24px;
transition: border-color 0.2s, box-shadow 0.2s;
/* hover */
border-color: var(--color-gold-dim);
box-shadow: 0 0 24px var(--color-gold-glow);
```

### Button — Primary

```css
background: var(--color-gold);
color: #000;
font-weight: 600;
font-size: 0.85rem;
padding: 12px 24px;
border-radius: var(--radius-md);
border: none;
```

### Button — Ghost

```css
background: transparent;
color: var(--color-gold);
border: 1px solid var(--color-border);
border-radius: var(--radius-md);
/* hover */
background: var(--color-gold-glow);
```

### Badge / Chip

```css
/* Active/open */
background: rgba(34, 197, 94, 0.1);
border: 1px solid rgba(34, 197, 94, 0.3);
color: #22c55e;
border-radius: var(--radius-pill);
padding: 4px 12px;
font-size: 0.72rem;
font-weight: 600;
```

### Section Label

```css
font-size: 0.68–0.7rem;
text-transform: uppercase;
letter-spacing: 0.12em;
color: var(--color-gold);
font-weight: 600;
```

### Stat Value

```css
font-size: 2.2rem;
font-weight: 700;
color: var(--color-gold);
```

### Stat Bar

```css
height: 4px;
background: var(--color-surface2);
border-radius: var(--radius-pill);
/* fill */
background: linear-gradient(90deg, var(--color-gold-dim), var(--color-gold));
```

---

## 6. Layout Variants

Two approved layout patterns (both dark+gold):

### A. Bento Dashboard (`001-dashboard-bento`)
- Top navbar horizontal
- Hero split: content left + stat cards right
- Main content: CSS grid bento cards (span 1–2 cols/rows)
- Best for: showcase all sectors at once

### B. Editorial Sidebar (`002-editorial-sidebar`)
- Fixed left sidebar (260px) with section nav
- Top topbar with breadcrumb + status pills
- Main area: feed (articles + cards) + right sidebar (widgets)
- Best for: content browsing, news, UMKM catalog

> Mockups at: `/opt/data/plosorejo-sample/sketches/`

---

## 7. Navigation Structure

```
/                    → Beranda
/profil              → Profil Padukuhan
/sektor/umkm         → UMKM
/sektor/pertanian    → Pertanian
/sektor/peternakan   → Peternakan
/sektor/pariwisata   → Pariwisata
/sektor/pendidikan   → Pendidikan
/sektor/kesehatan    → Kesehatan
/sektor/budaya       → Budaya
/berita              → Berita Padukuhan
/berita/[slug]       → Detail Berita
/galeri              → Galeri KKN
/kontak              → Kontak
```

---

## 8. Iconography & Media

- Icons: Lucide React (preferred) or emoji for MVP
- No stock photos — real dokumentasi lapangan only
- Hero image: foto padukuhan / Merapi landscape
- UMKM product images: rasio `4:3` atau `1:1`, min `400×400px`
- Galeri: masonry grid, foto landscape preferred

---

## 9. Animation

```css
/* Standard transition */
transition: all 0.2s ease;

/* Pulse (status active) */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}
animation: pulse 2s infinite;
```

No heavy animations — performance matters on mobile (rural 4G).

---

## 10. Accessibility Notes

- Minimum contrast: 4.5:1 for body text
- Gold `#d4af37` on `#080808` → contrast ratio ≈ 9.3:1 ✅
- Focus rings: `outline: 2px solid var(--color-gold); outline-offset: 2px`
- All images must have `alt` text
- Semantic HTML: `<nav>`, `<main>`, `<article>`, `<aside>`, `<section>`
