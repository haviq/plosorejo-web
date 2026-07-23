/**
 * Seed Sanity CMS from local content JSON.
 *
 * Prerequisites:
 * 1. Register Studio at /studio (CORS + project connection)
 * 2. Create a write token: Sanity Manage → API → Tokens → Editor
 * 3. Set env:
 *    NEXT_PUBLIC_SANITY_PROJECT_ID=p7xgykwm
 *    NEXT_PUBLIC_SANITY_DATASET=production
 *    SANITY_API_WRITE_TOKEN=sk...
 *
 * Run:
 *   node --env-file=.env.local scripts/seed-sanity.mjs
 *   # or
 *   SANITY_API_WRITE_TOKEN=... npm run cms:seed
 */

import { createClient } from '@sanity/client'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

function loadJson(rel) {
  const p = resolve(root, rel)
  if (!existsSync(p)) throw new Error(`Missing ${rel}`)
  return JSON.parse(readFileSync(p, 'utf8'))
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'p7xgykwm'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!token) {
  console.error('❌ SANITY_API_WRITE_TOKEN belum di-set.')
  console.error('   Buat token Editor di https://www.sanity.io/manage → API → Tokens')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01',
  token,
  useCdn: false,
})

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function upsert(doc) {
  const res = await client.createOrReplace(doc)
  console.log('  ✓', doc._type, res._id)
  return res
}

async function main() {
  console.log(`Seeding Sanity project=${projectId} dataset=${dataset}`)

  const berita = loadJson('content/berita.json')
  const umkm = loadJson('content/umkm.json')
  const sektor = loadJson('content/sektor.json')
  const site = loadJson('content/site.json')
  const layanan = loadJson('content/layanan.json')
  const kkn = loadJson('content/kkn.json')
  const susu = loadJson('content/susu.json')

  console.log('\n— siteSettings')
  await upsert({
    _id: 'siteSettings',
    _type: 'siteSettings',
    title: site.title,
    tagline: site.tagline,
    alamat: site.alamat,
    telepon: site.telepon,
    whatsapp: site.whatsapp,
    email: site.email,
    jamLayanan: site.jamLayanan,
    mapsUrl: site.mapsUrl,
    instagram: site.instagram || undefined,
    facebook: site.facebook || undefined,
    youtube: site.youtube || undefined,
    perangkat: site.perangkat || [],
  })

  console.log('\n— merapiStatus')
  await upsert({
    _id: 'merapiStatus-current',
    _type: 'merapiStatus',
    level: 'Normal',
    deskripsi: 'Aktivitas vulkanik dalam batas normal',
    updatedAt: new Date().toISOString(),
  })

  console.log('\n— berita')
  for (const b of berita) {
    await upsert({
      _id: `berita-${b.slug}`,
      _type: 'berita',
      judul: b.judul,
      slug: { _type: 'slug', current: b.slug },
      tanggal: b.tanggal,
      kategori: b.kategori,
      ringkasan: b.ringkasan,
      isi: b.isi,
    })
  }

  console.log('\n— umkm')
  for (const u of umkm) {
    await upsert({
      _id: `umkm-${u.id}`,
      _type: 'umkm',
      nama: u.nama,
      pemilik: u.pemilik,
      jenis: u.jenis,
      produk: u.produk,
      harga: u.harga,
      jamBuka: u.jamBuka,
      whatsapp: u.whatsapp,
      alamat: u.alamat,
      gmaps: u.gmaps,
      aktif: u.aktif !== false,
      emoji: u.icon,
    })
  }

  console.log('\n— sektor')
  for (const [key, s] of Object.entries(sektor)) {
    await upsert({
      _id: `sektor-${key}`,
      _type: 'sektor',
      key,
      nama: s.nama,
      icon: s.icon,
      deskripsi: s.deskripsi,
      stats: s.stats || [],
      items: s.items || [],
    })
  }

  console.log('\n— layanan')
  for (const l of layanan) {
    await upsert({
      _id: `layanan-${l.id}`,
      _type: 'layanan',
      nama: l.nama,
      slug: { _type: 'slug', current: l.id },
      kategori: l.kategori,
      deskripsi: l.deskripsi,
      waktu: l.waktu,
      biaya: l.biaya,
      syarat: l.syarat,
      alur: l.alur,
      pic: l.pic,
      icon: l.icon,
      aktif: true,
    })
  }

  console.log('\n— kknArsip')
  for (const a of kkn.arsip || []) {
    await upsert({
      _id: `kkn-${a.id}`,
      _type: 'kknArsip',
      judul: a.judul,
      tanggal: a.tanggal,
      kategori: a.kategori,
      ringkasan: a.ringkasan,
      status: a.status,
      link: a.link,
    })
  }

  console.log('\n— produksiSusu (recent sample)')
  for (const [i, r] of (susu.recent || []).entries()) {
    const liters = Number(String(r.volume).replace(/[^\d.]/g, '')) || 0
    // crude date parse from "15 Jul 2026"
    await upsert({
      _id: `susu-sample-${i + 1}`,
      _type: 'produksiSusu',
      tanggal: susu.updatedAt || '2026-07-15',
      peternak: r.peternak,
      volumeLiter: liters,
      kualitas: r.kualitas,
      status: r.status,
      catatan: 'Seeded sample row',
    })
  }

  console.log('\n✅ Seed selesai. Buka /studio untuk cek & Publish jika perlu.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
