/**
 * In-memory ops store for pengajuan surat.
 * Seeded from content/pengajuan.json. On serverless, data resets on cold start —
 * fine for demo/pitch; production can swap to Sanity/KV later.
 */
import seed from '@/content/pengajuan.json'

export type PengajuanStatus =
  | 'diterima'
  | 'diproses'
  | 'menunggu_berkas'
  | 'siap_diambil'
  | 'selesai'
  | 'ditolak'

export interface PengajuanItem {
  kode: string
  layananId: string
  layananNama: string
  nama: string
  nikMasked: string
  rt: string
  telepon?: string
  keperluan: string
  catatan?: string
  status: PengajuanStatus
  createdAt: string
  updatedAt: string
  adminNote?: string
}

const g = globalThis as unknown as { __plosorejoPengajuan?: Map<string, PengajuanItem> }

function store(): Map<string, PengajuanItem> {
  if (!g.__plosorejoPengajuan) {
    g.__plosorejoPengajuan = new Map()
    for (const row of seed as PengajuanItem[]) {
      g.__plosorejoPengajuan.set(row.kode.toUpperCase(), { ...row, kode: row.kode.toUpperCase() })
    }
  }
  return g.__plosorejoPengajuan
}

export const STATUS_LABEL: Record<PengajuanStatus, string> = {
  diterima: 'Diterima',
  diproses: 'Diproses',
  menunggu_berkas: 'Menunggu berkas',
  siap_diambil: 'Siap diambil',
  selesai: 'Selesai',
  ditolak: 'Ditolak',
}

export function maskNik(nik: string): string {
  const d = nik.replace(/\D/g, '')
  if (d.length < 8) return '****'
  return `${d.slice(0, 4)}********${d.slice(-4)}`
}

export function makeKode(): string {
  const t = Date.now().toString(36).toUpperCase().slice(-5)
  const r = Math.random().toString(36).toUpperCase().slice(2, 5)
  return `PLJ-${t}${r}`.slice(0, 12)
}

export function listPengajuan(): PengajuanItem[] {
  return Array.from(store().values()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export function getPengajuan(kode: string): PengajuanItem | null {
  if (!kode) return null
  return store().get(kode.trim().toUpperCase()) || null
}

export function createPengajuan(input: {
  layananId: string
  layananNama: string
  nama: string
  nik: string
  rt: string
  telepon?: string
  keperluan: string
  catatan?: string
  kode?: string
}): PengajuanItem {
  const now = new Date().toISOString()
  let kode = (input.kode || makeKode()).toUpperCase()
  while (store().has(kode)) kode = makeKode()
  const item: PengajuanItem = {
    kode,
    layananId: input.layananId.slice(0, 64),
    layananNama: input.layananNama.slice(0, 120),
    nama: input.nama.trim().slice(0, 80),
    nikMasked: maskNik(input.nik),
    rt: input.rt.slice(0, 4),
    telepon: input.telepon?.slice(0, 20),
    keperluan: input.keperluan.trim().slice(0, 500),
    catatan: input.catatan?.trim().slice(0, 400),
    status: 'diterima',
    createdAt: now,
    updatedAt: now,
  }
  store().set(kode, item)
  return item
}

export function updatePengajuanStatus(
  kode: string,
  status: PengajuanStatus,
  adminNote?: string,
): PengajuanItem | null {
  const item = getPengajuan(kode)
  if (!item) return null
  if (!(status in STATUS_LABEL)) return null
  const next: PengajuanItem = {
    ...item,
    status,
    updatedAt: new Date().toISOString(),
    adminNote: adminNote !== undefined ? adminNote.slice(0, 400) : item.adminNote,
  }
  store().set(item.kode, next)
  return next
}

/** Public-safe view (no full phone dump beyond partial) */
export function publicView(item: PengajuanItem) {
  return {
    kode: item.kode,
    layananNama: item.layananNama,
    nama: item.nama.length > 2 ? `${item.nama[0]}***${item.nama.slice(-1)}` : '***',
    nikMasked: item.nikMasked,
    rt: item.rt,
    status: item.status,
    statusLabel: STATUS_LABEL[item.status],
    keperluan: item.keperluan.slice(0, 120),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    adminNote: item.adminNote || null,
  }
}
