import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profil Padukuhan',
  description: 'Sejarah, visi-misi, struktur organisasi, dan data wilayah Padukuhan Plosorejo.',
}

const strukturOrg = [
  { jabatan: 'Dukuh / Kepala Padukuhan', nama: 'Bapak Slamet Widodo', rt: null },
  { jabatan: 'Sekretaris Padukuhan',      nama: 'Ibu Sri Lestari',    rt: null },
  { jabatan: 'Bendahara Padukuhan',       nama: 'Bapak Agus Prayitno', rt: null },
]

const rtList = [
  { rt: 'RT 01', rw: 'RW 01', ketua: 'Pak Rudi Hartono',  kk: 89,  warga: 312 },
  { rt: 'RT 02', rw: 'RW 01', ketua: 'Bu Eni Sulistyowati', kk: 76, warga: 278 },
  { rt: 'RT 03', rw: 'RW 02', ketua: 'Pak Joko Santoso',  kk: 94,  warga: 341 },
  { rt: 'RT 04', rw: 'RW 02', ketua: 'Bu Mulyani',        kk: 82,  warga: 295 },
  { rt: 'RT 05', rw: 'RW 03', ketua: 'Pak Suyono',        kk: 71,  warga: 258 },
  { rt: 'RT 06', rw: 'RW 03', ketua: 'Pak Wahyu Widodo',  kk: 88,  warga: 317 },
  { rt: 'RT 07', rw: 'RW 04', ketua: 'Bu Kartini',        kk: 67,  warga: 241 },
  { rt: 'RT 08', rw: 'RW 04', ketua: 'Pak Hadi Purnomo',  kk: 93,  warga: 334 },
  { rt: 'RT 09', rw: 'RW 05', ketua: 'Bu Yayuk Suryani',  kk: 79,  warga: 283 },
  { rt: 'RT 10', rw: 'RW 05', ketua: 'Pak Bambang Eko',   kk: 85,  warga: 306 },
  { rt: 'RT 11', rw: 'RW 06', ketua: 'Pak Supardi',       kk: 72,  warga: 261 },
  { rt: 'RT 12', rw: 'RW 06', ketua: 'Bu Srinatun',       kk: 80,  warga: 295 },
]

const infoWilayah = [
  { label: 'Luas Wilayah',    value: '12,6 km²' },
  { label: 'Jumlah RT / RW',  value: '12 / 6' },
  { label: 'Jumlah Penduduk', value: '4.821 jiwa' },
  { label: 'Jumlah KK',       value: '1.347 KK' },
  { label: 'Ketinggian',      value: '±600 mdpl' },
  { label: 'Kecamatan',       value: 'Cangkringan' },
  { label: 'Kabupaten',       value: 'Sleman' },
  { label: 'Kode Pos',        value: '55583' },
]

export default function ProfilPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">

      {/* Header */}
      <section className="space-y-4">
        <h1 className="text-4xl font-black">
          🏡 Profil{' '}
          <span className="gradient-text">Padukuhan Plosorejo</span>
        </h1>
        <p className="text-gray-400 max-w-2xl leading-relaxed">
          Padukuhan Plosorejo terletak di Kapanewon Cangkringan, Kabupaten Sleman, Daerah Istimewa Yogyakarta.
          Dikenal sebagai sentra peternakan sapi perah dan pertanian organik di lereng Gunung Merapi, wilayah Sleman.
        </p>
      </section>

      {/* Info Wilayah Grid */}
      <section aria-label="Informasi wilayah">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-5">
          Informasi Wilayah
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {infoWilayah.map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl border p-4 text-center"
              style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
            >
              <p className="text-xl font-bold gradient-text tabular-nums">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sejarah */}
      <section className="space-y-4" aria-label="Sejarah padukuhan">
        <h2 className="text-2xl font-black">Sejarah Singkat</h2>
        <div
          className="rounded-xl border p-6 space-y-4 text-sm text-gray-300 leading-relaxed"
          style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
        >
          <p>
            Padukuhan Plosorejo merupakan salah satu dari empat padukuhan di Desa Plosorejo yang
            telah berdiri sejak zaman penjajahan Belanda. Nama &ldquo;Plosorejo&rdquo; berasal dari
            kata dalam bahasa Jawa yang berarti &ldquo;tempat yang makmur dan subur&rdquo;,
            mencerminkan kesuburan tanah dan kemakmuran warganya.
          </p>
          <p>
            Sejak tahun 1960-an, Padukuhan Plosorejo berkembang sebagai sentra peternakan sapi
            perah dengan bantuan program pemerintah melalui Koperasi Unit Desa (KUD). Program ini
            membawa transformasi besar bagi perekonomian warga dan menjadikan susu segar sebagai
            komoditas unggulan yang memasok kebutuhan industri susu di DIY.
          </p>
          <p>
            Pada era reformasi, padukuhan ini mulai mengembangkan sektor pertanian organik,
            kerajinan tangan, dan pariwisata berbasis alam. Kini Padukuhan Plosorejo telah
            menjadi salah satu contoh desa mandiri dan berdaya di Kabupaten Sleman.
          </p>
        </div>
      </section>

      {/* Visi Misi */}
      <section className="grid md:grid-cols-2 gap-6" aria-label="Visi dan misi">
        <div
          className="rounded-xl border p-6 space-y-3"
          style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
        >
          <h2 className="text-lg font-black flex items-center gap-2">
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center text-black text-sm font-black"
              style={{ background: 'var(--gradient)' }}
              aria-hidden="true"
            >V</span>
            Visi
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed italic">
            &ldquo;Terwujudnya Padukuhan Plosorejo yang mandiri, sejahtera, berbudaya,
            dan berdaya saing berbasis pertanian dan peternakan berkelanjutan.&rdquo;
          </p>
        </div>

        <div
          className="rounded-xl border p-6 space-y-4"
          style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
        >
          <h2 className="text-lg font-black flex items-center gap-2">
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center text-black text-sm font-black"
              style={{ background: 'var(--gradient)' }}
              aria-hidden="true"
            >M</span>
            Misi
          </h2>
          <ul className="space-y-2 text-sm text-gray-300">
            {[
              'Meningkatkan kualitas SDM melalui pendidikan dan pelatihan',
              'Mengembangkan pertanian dan peternakan berbasis teknologi',
              'Mendorong pertumbuhan UMKM dan ekonomi kreatif',
              'Melestarikan budaya dan tradisi lokal',
              'Membangun infrastruktur desa yang merata dan berkelanjutan',
            ].map((m, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: 'var(--amber)' }} aria-hidden="true" />
                {m}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Struktur Organisasi */}
      <section aria-label="Struktur organisasi">
        <h2 className="text-2xl font-black mb-5">Struktur Organisasi</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {strukturOrg.map(({ jabatan, nama }) => (
            <div
              key={jabatan}
              className="rounded-xl border p-5 text-center space-y-2"
              style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}
            >
              <div
                className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-xl"
                style={{ backgroundColor: 'rgba(245,158,11,0.12)' }}
                aria-hidden="true"
              >
                👤
              </div>
              <p className="font-bold text-white text-sm">{nama}</p>
              <p className="text-xs text-gray-500">{jabatan}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tabel RT/RW */}
      <section aria-label="Daftar RT dan RW">
        <h2 className="text-2xl font-black mb-5">Daftar RT / RW</h2>
        <div
          className="rounded-xl border overflow-hidden"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--s2)' }}>
                  {['RT', 'RW', 'Ketua RT', 'Jumlah KK', 'Jumlah Warga'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rtList.map((row, i) => (
                  <tr
                    key={row.rt}
                    className="border-t"
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: i % 2 === 0 ? 'var(--s1)' : 'transparent',
                    }}
                  >
                    <td className="px-4 py-3 font-semibold" style={{ color: 'var(--amber)' }}>{row.rt}</td>
                    <td className="px-4 py-3 text-gray-400">{row.rw}</td>
                    <td className="px-4 py-3 text-white">{row.ketua}</td>
                    <td className="px-4 py-3 tabular-nums text-gray-300">{row.kk}</td>
                    <td className="px-4 py-3 tabular-nums text-gray-300">{row.warga}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  )
}
