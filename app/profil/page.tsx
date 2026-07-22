import type { Metadata } from 'next'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'

export const metadata: Metadata = {
  title: 'Profil Padukuhan',
  description: 'Sejarah, visi-misi, struktur organisasi, dan data wilayah Padukuhan Plosorejo.',
}

const strukturOrg = [
  { jabatan: 'Dukuh / Kepala Padukuhan', nama: 'Bapak Slamet Widodo', icon: '👑' },
  { jabatan: 'Sekretaris Padukuhan', nama: 'Ibu Sri Lestari', icon: '📋' },
  { jabatan: 'Bendahara Padukuhan', nama: 'Bapak Agus Prayitno', icon: '💰' },
]

const rtList = [
  { rt: 'RT 01', rw: 'RW 01', ketua: 'Pak Rudi Hartono', kk: 48, warga: 168, color: 'var(--gold)' },
  { rt: 'RT 02', rw: 'RW 01', ketua: 'Bu Eni Sulistyowati', kk: 42, warga: 151, color: '#34d399' },
  { rt: 'RT 03', rw: 'RW 01', ketua: 'Pak Joko Santoso', kk: 51, warga: 179, color: '#60a5fa' },
  { rt: 'RT 04', rw: 'RW 01', ketua: 'Bu Mulyani', kk: 45, warga: 160, color: '#818cf8' },
]

const totalKK = rtList.reduce((s, r) => s + r.kk, 0)
const totalWarga = rtList.reduce((s, r) => s + r.warga, 0)

const infoWilayah = [
  { label: 'Luas Wilayah', value: '±45 ha', icon: '🗺️' },
  { label: 'Jumlah RT / RW', value: '4 / 1', icon: '🏘️' },
  { label: 'Jumlah Penduduk', value: `${totalWarga.toLocaleString('id-ID')} jiwa`, icon: '👥' },
  { label: 'Jumlah KK', value: `${totalKK} KK`, icon: '🏠' },
  { label: 'Ketinggian', value: '±600 mdpl', icon: '⛰️' },
  { label: 'Kecamatan', value: 'Cangkringan', icon: '📍' },
  { label: 'Kabupaten', value: 'Sleman', icon: '🏛️' },
  { label: 'Kode Pos', value: '55583', icon: '📮' },
]

const misi = [
  'Meningkatkan kualitas SDM melalui pendidikan dan pelatihan',
  'Mengembangkan pertanian dan peternakan berbasis teknologi',
  'Mendorong pertumbuhan UMKM dan ekonomi kreatif',
  'Melestarikan budaya dan tradisi lokal',
  'Membangun infrastruktur desa yang merata dan berkelanjutan',
]

export default function ProfilPage() {
  return (
    <div className="page-shell space-y-14">
      <PageHeader
        eyebrow="Tentang Kami"
        title="Profil"
        highlight="Plosorejo"
        description="Padukuhan Plosorejo, Jl. Balong, Kalurahan Umbulharjo, Cangkringan, Sleman — sentra sapi perah dan UMKM olahan susu di lereng Merapi."
      />

      {/* Info Wilayah */}
      <section aria-label="Informasi wilayah" className="space-y-4">
        <h2 className="section-label">Informasi Wilayah</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {infoWilayah.map(({ label, value, icon }) => (
            <div key={label} className="card-surface p-4 text-center">
              <p className="text-2xl mb-1" aria-hidden="true">{icon}</p>
              <p className="stat-value text-lg">{value}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sejarah */}
      <section aria-label="Sejarah padukuhan" className="space-y-4">
        <h2 className="section-label">Sejarah Singkat</h2>
        <div className="card-surface p-6 space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
          <p>
            Padukuhan Plosorejo merupakan salah satu padukuhan di Kalurahan Umbulharjo,
            Kapanewon Cangkringan. Nama &ldquo;Plosorejo&rdquo; berasal dari bahasa Jawa yang
            berarti &ldquo;tempat yang makmur dan subur&rdquo;, mencerminkan kesuburan tanah
            lereng Merapi dan kemakmuran warganya.
          </p>
          <p>
            Sejak tahun 1960-an, Padukuhan Plosorejo berkembang sebagai sentra peternakan sapi
            perah dengan dukungan koperasi susu. Program ini membawa transformasi besar bagi
            perekonomian warga dan menjadikan susu segar sebagai komoditas unggulan yang
            memasok kebutuhan industri susu di DIY.
          </p>
          <p>
            Pada era modern, padukuhan ini mengembangkan sektor UMKM olahan susu, pertanian
            salak pondoh, kerajinan, dan pariwisata berbasis alam. Kini Plosorejo menjadi
            salah satu contoh padukuhan mandiri di lereng Merapi, Kabupaten Sleman.
          </p>
        </div>
      </section>

      {/* Visi Misi */}
      <section className="grid md:grid-cols-2 gap-6" aria-label="Visi dan misi">
        <div className="card-surface p-6 space-y-3">
          <h2 className="text-lg font-black flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-black text-sm font-black" style={{ background: 'var(--gradient)' }} aria-hidden="true">
              V
            </span>
            Visi
          </h2>
          <p className="text-sm leading-relaxed italic" style={{ color: 'var(--muted)' }}>
            &ldquo;Terwujudnya Padukuhan Plosorejo yang mandiri, sejahtera, berbudaya,
            dan berdaya saing berbasis pertanian dan peternakan berkelanjutan.&rdquo;
          </p>
        </div>

        <div className="card-surface p-6 space-y-4">
          <h2 className="text-lg font-black flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-black text-sm font-black" style={{ background: 'var(--gradient)' }} aria-hidden="true">
              M
            </span>
            Misi
          </h2>
          <ul className="space-y-2 text-sm" style={{ color: 'var(--text)' }}>
            {misi.map((m, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: 'var(--gold)' }} aria-hidden="true" />
                {m}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Struktur Organisasi */}
      <section aria-label="Struktur organisasi" className="space-y-4">
        <h2 className="section-label">Struktur Organisasi</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {strukturOrg.map(({ jabatan, nama, icon }) => (
            <div key={jabatan} className="card-surface p-5 text-center space-y-2">
              <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-xl" style={{ backgroundColor: 'var(--gold-dim)' }} aria-hidden="true">
                {icon}
              </div>
              <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>{nama}</p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>{jabatan}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tabel RT/RW */}
      <section aria-label="Daftar RT dan RW" className="space-y-4">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <h2 className="section-label">Daftar RT / RW Balong</h2>
          <Link href="/peta" className="btn-ghost text-xs">
            Lihat di Peta →
          </Link>
        </div>

        <div className="flex flex-wrap gap-3">
          {rtList.map(({ rt, color }) => (
            <span key={rt} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted)' }}>
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} aria-hidden="true" />
              {rt}
            </span>
          ))}
        </div>

        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--s2)' }}>
                  {['RT', 'RW', 'Ketua RT', 'Jumlah KK', 'Jumlah Warga'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rtList.map((row, i) => (
                  <tr key={row.rt} className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 0 ? 'var(--s1)' : 'transparent' }}>
                    <td className="px-4 py-3 font-semibold">
                      <span className="inline-flex items-center gap-2" style={{ color: row.color }}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: row.color }} aria-hidden="true" />
                        {row.rt}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--muted)' }}>{row.rw}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--text)' }}>{row.ketua}</td>
                    <td className="px-4 py-3 tabular-nums" style={{ color: 'var(--muted)' }}>{row.kk}</td>
                    <td className="px-4 py-3 tabular-nums" style={{ color: 'var(--muted)' }}>{row.warga}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--s2)' }}>
                  <td className="px-4 py-3 font-bold" style={{ color: 'var(--text)' }} colSpan={3}>Total</td>
                  <td className="px-4 py-3 font-bold tabular-nums" style={{ color: 'var(--gold)' }}>{totalKK}</td>
                  <td className="px-4 py-3 font-bold tabular-nums" style={{ color: 'var(--gold)' }}>{totalWarga}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <p className="text-xs" style={{ color: 'var(--muted2)' }}>
          * Data penduduk placeholder — diganti hasil survei lapangan. Koordinat batas RT di peta
          adalah estimasi dan perlu validasi GPS.
        </p>
      </section>
    </div>
  )
}
