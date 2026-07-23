import type { Metadata } from 'next'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import Icon from '@/components/Icon'
import { getKknData } from '@/lib/data'
import { formatTanggal } from '@/lib/utils'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Arsip KKN',
  description: 'Dokumentasi program KKN UNRIYO di Padukuhan Plosorejo — kegiatan, fokus, dan arsip kerja.',
}

export default async function KknPage() {
  const kkn = await getKknData()

  return (
    <div className="page-shell space-y-12">
      <PageHeader
        eyebrow={`${kkn.universitas} · ${kkn.unit}`}
        title="Arsip"
        highlight="KKN"
        description={`Periode ${kkn.periode}. ${kkn.jumlahMahasiswa} mahasiswa mendampingi warga di ${kkn.lokasi}.`}
      />

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tahun', value: String(kkn.tahun) },
          { label: 'Mahasiswa', value: String(kkn.jumlahMahasiswa) },
          { label: 'Unit', value: kkn.unit },
          { label: 'Arsip kegiatan', value: String(kkn.arsip.length) },
        ].map((s) => (
          <div key={s.label} className="card-surface p-4">
            <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--muted)' }}>{s.label}</p>
            <p className="text-xl font-bold mt-1" style={{ color: 'var(--gold)' }}>{s.value}</p>
          </div>
        ))}
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        <div className="card-surface p-6 space-y-4">
          <h2 className="section-label">Fokus program</h2>
          <ul className="space-y-2">
            {kkn.fokus.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text)' }}>
                <span style={{ color: 'var(--gold)' }}>▸</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-surface p-6 space-y-3">
          <h2 className="section-label">Kontak tim</h2>
          <p className="text-sm" style={{ color: 'var(--text)' }}>
            <span style={{ color: 'var(--muted)' }}>DPL: </span>{kkn.kontak.dpl}
          </p>
          <p className="text-sm" style={{ color: 'var(--text)' }}>
            <span style={{ color: 'var(--muted)' }}>Ketua tim: </span>{kkn.kontak.ketuaTim}
          </p>
          <p className="text-sm" style={{ color: 'var(--text)' }}>
            <span style={{ color: 'var(--muted)' }}>Email: </span>{kkn.kontak.email}
          </p>
          <p className="text-xs pt-2" style={{ color: 'var(--muted2)' }}>
            Update arsip bisa lewat CMS Studio (tipe Arsip KKN) atau file content/kkn.json.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="section-label">Timeline arsip</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {kkn.arsip.map((item) => (
            <article key={item.id} className="card-surface p-5 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="badge" style={{ color: 'var(--gold)', background: 'var(--gold-glow)' }}>
                  {item.kategori}
                </span>
                <span
                  className="badge border text-xs"
                  style={{
                    borderColor: item.status === 'Selesai' ? 'var(--border-strong)' : 'var(--border)',
                    color: item.status === 'Selesai' ? 'var(--gold)' : 'var(--muted)',
                  }}
                >
                  {item.status}
                </span>
              </div>
              <h3 className="font-bold" style={{ color: 'var(--text)' }}>{item.judul}</h3>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                {item.tanggal ? formatTanggal(item.tanggal) : 'Tanpa tanggal'}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                {item.ringkasan}
              </p>
              {item.link && (
                <Link href={item.link} className="text-sm font-semibold" style={{ color: 'var(--gold)' }}>
                  Lihat terkait →
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="surface-panel p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <span
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--gold-glow)', color: 'var(--gold)' }}
          >
            <Icon name="digital" size={18} />
          </span>
          <div>
            <p className="font-semibold" style={{ color: 'var(--text)' }}>Portal digital hasil KKN</p>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Website ini adalah salah satu deliverable utama program.
            </p>
          </div>
        </div>
        <Link href="/" className="btn-primary">
          Ke beranda
        </Link>
      </section>
    </div>
  )
}
