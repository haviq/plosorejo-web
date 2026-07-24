import type { Metadata } from 'next'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import Icon from '@/components/Icon'
import { getAgendaList, getSiteSettings } from '@/lib/data'
import { waLink } from '@/lib/site'
import type { AgendaItem } from '@/lib/types'

export const revalidate = 120

export const metadata: Metadata = {
  title: 'Agenda Padukuhan',
  description:
    'Jadwal kegiatan Padukuhan Plosorejo — posyandu, ronda, merti, pelatihan UMKM, dan kesiapsiagaan Merapi.',
}

function formatTanggal(iso: string): string {
  try {
    return new Date(`${iso}T00:00:00+07:00`).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
    })
  } catch {
    return iso
  }
}

function isUpcoming(iso: string): boolean {
  const today = new Date()
  const d = new Date(`${iso}T23:59:59+07:00`)
  return d.getTime() >= today.getTime() - 86400000
}

function AgendaCard({ item }: { item: AgendaItem }) {
  return (
    <article className="card-surface p-5 flex flex-col gap-3 h-full">
      <div className="flex flex-wrap items-center gap-2">
        <span className="badge" style={{ color: 'var(--gold)', background: 'var(--gold-glow)' }}>
          {item.kategori}
        </span>
        {item.penting ? (
          <span
            className="badge border"
            style={{
              color: 'var(--gold)',
              borderColor: 'rgba(212,175,55,0.4)',
              background: 'rgba(212,175,55,0.1)',
            }}
          >
            Prioritas
          </span>
        ) : null}
      </div>
      <h3
        className="font-bold text-lg leading-snug"
        style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          color: 'var(--text)',
        }}
      >
        {item.judul}
      </h3>
      <ul className="space-y-1.5 text-sm" style={{ color: 'var(--muted)' }}>
        <li className="inline-flex items-center gap-2">
          <Icon name="clock" size={14} />
          {formatTanggal(item.tanggal)} · {item.waktu}
        </li>
        <li className="inline-flex items-center gap-2">
          <Icon name="location" size={14} />
          {item.lokasi}
        </li>
      </ul>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
        {item.deskripsi}
      </p>
    </article>
  )
}

export default async function AgendaPage() {
  const [agenda, site] = await Promise.all([getAgendaList(), getSiteSettings()])
  const upcoming = agenda.filter((a) => isUpcoming(a.tanggal))
  const past = agenda.filter((a) => !isUpcoming(a.tanggal))

  return (
    <div className="page-shell space-y-10">
      <PageHeader
        eyebrow="Kegiatan warga"
        title="Agenda"
        highlight="Padukuhan"
        description="Jadwal posyandu, ronda, budaya, UMKM, dan kesiapsiagaan. Update berkala oleh pengurus."
      />

      <section className="space-y-4" aria-label="Agenda mendatang">
        <h2 className="section-label">Mendatang</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Belum ada agenda terdekat. Hubungi admin untuk usulan kegiatan.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {upcoming.map((item) => (
              <AgendaCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section className="space-y-4" aria-label="Agenda lewat">
          <h2 className="section-label">Sudah lewat</h2>
          <div className="grid md:grid-cols-2 gap-4 opacity-75">
            {past.map((item) => (
              <AgendaCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      <section className="surface-panel p-6 text-center space-y-3">
        <h2 className="section-heading text-xl">Ingin mengusulkan kegiatan?</h2>
        <p className="text-sm max-w-lg mx-auto" style={{ color: 'var(--muted)' }}>
          Kirim usulan ke admin padukuhan via WhatsApp.
        </p>
        <a
          href={waLink(site.whatsapp, 'Halo, saya ingin mengusulkan kegiatan untuk agenda padukuhan:')}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex"
        >
          Usulkan via WA
        </a>
        <div className="pt-2">
          <Link href="/layanan" className="text-sm underline-offset-2 hover:underline" style={{ color: 'var(--gold)' }}>
            Atau lihat layanan administrasi →
          </Link>
        </div>
      </section>
    </div>
  )
}
