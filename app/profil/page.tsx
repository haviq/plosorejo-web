import type { Metadata } from 'next'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import Icon from '@/components/Icon'

export const metadata: Metadata = {
  title: 'Profil Padukuhan',
  description: 'Sejarah, visi-misi, struktur organisasi, dan data wilayah Padukuhan Plosorejo.',
}

const strukturOrg = [
  { jabatan: 'Dukuh / Kepala Padukuhan', nama: 'Bapak Slamet Widodo', icon: 'people' },
  { jabatan: 'Sekretaris Padukuhan', nama: 'Ibu Sri Lestari', icon: 'chart' },
  { jabatan: 'Bendahara Padukuhan', nama: 'Bapak Agus Prayitno', icon: 'money' },
]

const rtList = [
  { rt: 'RT 01', rw: 'RW 01', ketua: 'Pak Rudi Hartono', kk: 48, warga: 168, color: 'var(--gold)' },
  { rt: 'RT 02', rw: 'RW 01', ketua: 'Bu Eni Sulistyowati', kk: 42, warga: 151, color: 'var(--gold)' },
  { rt: 'RT 03', rw: 'RW 01', ketua: 'Pak Joko Santoso', kk: 51, warga: 179, color: 'var(--gold)' },
  { rt: 'RT 04', rw: 'RW 01', ketua: 'Bu Mulyani', kk: 45, warga: 160, color: 'var(--gold)' },
]

const totalKK = rtList.reduce((s, r) => s + r.kk, 0)
const totalWarga = rtList.reduce((s, r) => s + r.warga, 0)

const infoWilayah = [
  { label: 'Luas Wilayah', value: '±45 ha', icon: 'peta' },
  { label: 'Jumlah RT / RW', value: '4 / 1', icon: 'home' },
  { label: 'Jumlah Penduduk', value: `${totalWarga.toLocaleString('id-ID')} jiwa`, icon: 'people' },
  { label: 'Jumlah KK', value: `${totalKK} KK`, icon: 'home' },
  { label: 'Ketinggian', value: '±600 mdpl', icon: 'pariwisata' },
  { label: 'Kecamatan', value: 'Cangkringan', icon: 'location' },
  { label: 'Kabupaten', value: 'Sleman', icon: 'globe' },
  { label: 'Kode Pos', value: '55583', icon: 'location' },
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

      <section aria-label="Identitas visual padukuhan" className="space-y-4">
        <h2 className="section-label">Wajah Padukuhan</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {[
            { src: '/images/identity-warga.svg', alt: 'Warga dan gotong royong', title: 'Warga' },
            { src: '/images/identity-susu.svg', alt: 'Sentra sapi perah', title: 'Sapi perah' },
            { src: '/images/identity-alam.svg', alt: 'Alam lereng Merapi', title: 'Alam' },
            { src: '/images/identity-budaya.svg', alt: 'Budaya dan tradisi', title: 'Budaya' },
            { src: '/images/identity-umkm.svg', alt: 'UMKM lokal', title: 'UMKM' },
            { src: '/images/identity-masjid.svg', alt: 'Kehidupan spiritual', title: 'Masjid' },
          ].map((item) => (
            <figure
              key={item.src}
              className="relative overflow-hidden rounded-2xl border min-h-[140px] sm:min-h-[170px]"
              style={{ borderColor: 'var(--border)', background: 'var(--s1)' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                loading="lazy"
                draggable={false}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(5,5,5,0.8) 0%, rgba(5,5,5,0.1) 55%, transparent 100%)',
                }}
                aria-hidden="true"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 p-3 text-sm font-semibold" style={{ color: 'var(--on-dark-text)' }}>
                {item.title}
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="text-xs" style={{ color: 'var(--muted2)' }}>
          Foto lapangan bisa diganti lewat CMS/Sanity atau file di <code>public/images/</code>.
        </p>
      </section>

      <section aria-label="Informasi wilayah" className="space-y-4">
        <h2 className="section-label">Informasi Wilayah</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {infoWilayah.map(({ label, value, icon }) => (
            <div key={label} className="card-surface p-4 text-center">
              <div
                className="w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--gold-glow)', color: 'var(--gold)' }}
                aria-hidden="true"
              >
                <Icon name={icon} size={18} />
              </div>
              <p className="stat-value text-lg">{value}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

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

      <section aria-label="Visi dan misi" className="space-y-4">
        <h2 className="section-label">Visi & Misi</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card-surface p-6 space-y-3">
            <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--gold)' }}>Visi</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
              Mewujudkan Padukuhan Plosorejo yang mandiri, sejahtera, dan berdaya saing berbasis
              potensi lokal serta kearifan budaya.
            </p>
          </div>
          <div className="card-surface p-6 space-y-3">
            <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--gold)' }}>Misi</p>
            <ul className="space-y-2">
              {misi.map((item) => (
                <li key={item} className="text-sm flex gap-2" style={{ color: 'var(--text)' }}>
                  <span style={{ color: 'var(--gold)' }}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-label="Struktur organisasi" className="space-y-4">
        <h2 className="section-label">Struktur Organisasi</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {strukturOrg.map(({ jabatan, nama, icon }) => (
            <div key={jabatan} className="card-surface p-5 flex items-center gap-3">
              <span
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--gold-glow)', color: 'var(--gold)' }}
                aria-hidden="true"
              >
                <Icon name={icon} size={20} />
              </span>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{nama}</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>{jabatan}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section aria-label="Data RT" className="space-y-4">
        <h2 className="section-label">Data RT / RW</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {rtList.map((rt) => (
            <div key={rt.rt} className="card-surface p-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-bold" style={{ color: rt.color }}>{rt.rt} / {rt.rw}</p>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>{rt.ketua}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="stat-value text-xl">{rt.kk}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>KK</p>
                </div>
                <div>
                  <p className="stat-value text-xl">{rt.warga}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>Jiwa</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/peta" className="btn-primary">Lihat Peta</Link>
        <Link href="/kontak" className="btn-ghost">Hubungi Kami</Link>
      </div>
    </div>
  )
}
