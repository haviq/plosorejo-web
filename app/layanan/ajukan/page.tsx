import type { Metadata } from 'next'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import PengajuanSuratForm from '@/components/PengajuanSuratForm'
import Icon from '@/components/Icon'
import { getLayananList, getSiteSettings } from '@/lib/data'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Ajukan Surat Online',
  description:
    'Pengajuan layanan administrasi Padukuhan Plosorejo secara online — kirim data via WhatsApp ke petugas balai.',
}

export default async function AjukanSuratPage({
  searchParams,
}: {
  searchParams?: Promise<{ layanan?: string }>
}) {
  const sp = searchParams ? await searchParams : {}
  const [layanan, site] = await Promise.all([getLayananList(), getSiteSettings()])

  return (
    <div className="page-shell space-y-10">
      <PageHeader
        eyebrow="Layanan digital"
        title="Ajukan"
        highlight="Surat Online"
        description="Isi formulir, kirim ke WhatsApp petugas, lalu lengkapi syarat saat ambil di balai. Lebih cepat dari datang tanpa data."
      />

      <section className="grid sm:grid-cols-3 gap-3" aria-label="Langkah singkat">
        {[
          { n: '1', t: 'Pilih layanan', d: 'SKCK, domisili, usaha, dll.' },
          { n: '2', t: 'Isi data', d: 'Nama, NIK, RT, keperluan' },
          { n: '3', t: 'Kirim WA', d: 'Petugas proses & konfirmasi' },
        ].map((s) => (
          <div key={s.n} className="card-surface p-4 flex gap-3 items-start">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: 'var(--gold-glow)', color: 'var(--gold)' }}
            >
              {s.n}
            </span>
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
                {s.t}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                {s.d}
              </p>
            </div>
          </div>
        ))}
      </section>

      <PengajuanSuratForm
        layanan={layanan}
        whatsapp={site.whatsapp}
        defaultLayananId={sp.layanan}
      />

      <section className="surface-panel p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <Icon name="document" size={20} />
          <div>
            <p className="font-semibold" style={{ color: 'var(--text)' }}>
              Lihat syarat & alur lengkap
            </p>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Daftar semua layanan administrasi padukuhan
            </p>
          </div>
        </div>
        <Link href="/layanan" className="btn-ghost text-sm">
          Ke halaman layanan
        </Link>
      </section>
    </div>
  )
}
