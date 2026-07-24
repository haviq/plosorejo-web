import type { Metadata } from 'next'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import PrintButton from '@/components/PrintButton'

export const metadata: Metadata = {
  title: 'Proposal & BOQ Platform Padukuhan Digital',
  description:
    'Proposal komersial Platform Padukuhan Digital white-label — BOQ 100 juta, SLA 12 bulan, multi-desa.',
  robots: { index: false, follow: false },
}

const boq = [
  { item: 'Lisensi platform white-label (12 bulan / perpetual limited)', nilai: 35 },
  { item: 'Implementasi 1–3 padukuhan (branding, data, peta, CMS, migrasi)', nilai: 25 },
  { item: 'Modul layanan surat + tracking status + admin PIN', nilai: 8 },
  { item: 'Modul UMKM order + agenda + darurat/Merapi', nilai: 7 },
  { item: 'Training perangkat (2 sesi) + dokumentasi SOP', nilai: 8 },
  { item: 'Hosting, backup, maintenance & support 12 bulan', nilai: 12 },
  { item: 'Custom / contingency (domain, integrasi, revisi)', nilai: 5 },
]

const total = boq.reduce((s, r) => s + r.nilai, 0)

export default function ProposalPage() {
  return (
    <div className="page-shell space-y-10 proposal-print">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          eyebrow="Dokumen komersial"
          title="Proposal"
          highlight="100 Juta"
          description="Siap dipresentasikan ke BUMDes, kalurahan, dinas, atau kampus KKN. Cetak / Save as PDF dari browser."
        />
      </div>

      <div className="no-print flex flex-wrap gap-3">
        <Link href="/demo" className="btn-ghost text-sm">
          Demo multi-desa
        </Link>
        <Link href="/admin" className="btn-ghost text-sm">
          Panel admin
        </Link>
        <PrintButton />
      </div>

      <article className="card-surface p-6 md:p-8 space-y-8" id="proposal-body">
        <header className="space-y-2 border-b pb-6" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--gold)' }}>
            Padukuhan Digital · White-Label Platform
          </p>
          <h2
            className="text-2xl md:text-3xl font-black"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif', color: 'var(--text)' }}
          >
            Sistem Informasi Padukuhan Siap Pakai
          </h2>
          <p className="text-sm leading-relaxed max-w-2xl" style={{ color: 'var(--muted)' }}>
            Portal warga + CMS + peta + status Merapi + layanan surat online + UMKM + agenda + panel
            admin + opsi multi-desa. Termasuk implementasi, training, dan operasi 12 bulan.
          </p>
          <p className="text-xs" style={{ color: 'var(--muted2)' }}>
            Live: https://plosorejo-web.vercel.app · Demo: /demo · Status: PLJ-DEMO01 · Admin: /admin
          </p>
        </header>

        <section className="space-y-3">
          <h3 className="font-bold text-lg" style={{ color: 'var(--gold)' }}>
            1. Ringkasan nilai
          </h3>
          <ul className="text-sm space-y-2" style={{ color: 'var(--muted)' }}>
            <li>• Bukan sekadar website — sistem layanan warga yang dioperasikan perangkat desa</li>
            <li>• Modul darurat Merapi (relevan lereng) + nomor penting</li>
            <li>• Ekonomi lokal: order UMKM via WhatsApp terstruktur</li>
            <li>• White-label: satu platform, banyak branding desa</li>
            <li>• Live product (bukan mockup Figma)</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h3 className="font-bold text-lg" style={{ color: 'var(--gold)' }}>
            2. Lingkup pekerjaan
          </h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm" style={{ color: 'var(--muted)' }}>
            <div className="rounded-xl p-4" style={{ background: 'var(--surface-soft)' }}>
              <p className="font-semibold mb-2" style={{ color: 'var(--text)' }}>
                Untuk warga
              </p>
              <p>
                Beranda, berita, layanan & ajukan surat, cek status, agenda, darurat, peta, UMKM,
                galeri, kontak
              </p>
            </div>
            <div className="rounded-xl p-4" style={{ background: 'var(--surface-soft)' }}>
              <p className="font-semibold mb-2" style={{ color: 'var(--text)' }}>
                Untuk pengurus
              </p>
              <p>Admin PIN status surat, Sanity Studio konten, SOP, demo multi-desa, PWA install</p>
            </div>
          </div>
        </section>

        <section className="space-y-3" id="boq">
          <h3 className="font-bold text-lg" style={{ color: 'var(--gold)' }}>
            3. Bill of Quantity (BOQ) — Rp 100 juta
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--muted)' }}>
                  <th className="text-left py-2 pr-3 font-semibold">Komponen</th>
                  <th className="text-right py-2 font-semibold whitespace-nowrap">Nilai (jt)</th>
                </tr>
              </thead>
              <tbody>
                {boq.map((row) => (
                  <tr key={row.item} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="py-2.5 pr-3" style={{ color: 'var(--text)' }}>
                      {row.item}
                    </td>
                    <td
                      className="py-2.5 text-right tabular-nums font-semibold"
                      style={{ color: 'var(--gold)' }}
                    >
                      {row.nilai}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="py-3 pr-3 font-bold" style={{ color: 'var(--text)' }}>
                    Total
                  </td>
                  <td
                    className="py-3 text-right tabular-nums font-black text-lg"
                    style={{ color: 'var(--gold)' }}
                  >
                    {total}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs" style={{ color: 'var(--muted2)' }}>
            Angka dalam juta rupiah. Dapat disesuaikan (pecah paket 35 / 65 / 100 jt).
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="font-bold text-lg" style={{ color: 'var(--gold)' }}>
            4. Skema pembayaran
          </h3>
          <ol className="text-sm space-y-1 list-decimal pl-5" style={{ color: 'var(--muted)' }}>
            <li>
              <strong style={{ color: 'var(--text)' }}>60%</strong> DP saat kontrak & kickoff
            </li>
            <li>
              <strong style={{ color: 'var(--text)' }}>30%</strong> saat go-live production
            </li>
            <li>
              <strong style={{ color: 'var(--text)' }}>10%</strong> serah terima + training selesai
            </li>
          </ol>
        </section>

        <section className="space-y-3">
          <h3 className="font-bold text-lg" style={{ color: 'var(--gold)' }}>
            5. SLA & support (12 bulan)
          </h3>
          <ul className="text-sm space-y-1" style={{ color: 'var(--muted)' }}>
            <li>• Target uptime 99% (hosting managed)</li>
            <li>• Response issue kritis ≤ 1 hari kerja</li>
            <li>• Backup konten berkala + restore drill 1×</li>
            <li>• 2 sesi training + 1 sesi refresh mid-year</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h3 className="font-bold text-lg" style={{ color: 'var(--gold)' }}>
            6. Timeline (indikatif 8 minggu)
          </h3>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            M1–2 admin & surat · M2–3 UMKM & analytics · M3–4 peta/POI · M4–5 alert Merapi · M5–6
            multi-tenant · M7–8 laporan, PWA, serah terima.
          </p>
        </section>

        <footer
          className="pt-4 border-t text-xs space-y-1"
          style={{ borderColor: 'var(--border)', color: 'var(--muted2)' }}
        >
          <p>Dokumen non-binding — penawaran final mengikuti BoQ yang disepakati dalam kontrak.</p>
          <p>Kontak: WA +62 878-7268-0562 · Portal Plosorejo KKN UNRIYO 2026</p>
        </footer>
      </article>
    </div>
  )
}
