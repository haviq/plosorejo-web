import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Profil Padukuhan',
  description: 'Sejarah, visi-misi, struktur organisasi, dan data wilayah Padukuhan Plosorejo.',
}

const strukturOrg = [
  { jabatan: 'Dukuh / Kepala Padukuhan', nama: 'Bapak Slamet Widodo', rt: null },
  { jabatan: 'Sekretaris Padukuhan',      nama: 'Ibu Sri Lestari',    rt: null },
  { jabatan: 'Bendahara Padukuhan',       nama: 'Bapak Agus Prayitno', rt: null },
]

// RT Balong / Padukuhan Plosorejo — 4 RT (sesuai data lapangan)
const rtList = [
  { rt: 'RT 01', rw: 'RW 01', ketua: 'Pak Rudi Hartono',   kk: 48, warga: 168, color: '#eab308' },
  { rt: 'RT 02', rw: 'RW 01', ketua: 'Bu Eni Sulistyowati', kk: 42, warga: 151, color: '#ef4444' },
  { rt: 'RT 03', rw: 'RW 01', ketua: 'Pak Joko Santoso',   kk: 51, warga: 179, color: '#22c55e' },
  { rt: 'RT 04', rw: 'RW 01', ketua: 'Bu Mulyani',         kk: 45, warga: 160, color: '#3b82f6' },
]

const totalKK = rtList.reduce((s, r) => s + r.kk, 0)
const totalWarga = rtList.reduce((s, r) => s + r.warga, 0)

const infoWilayah = [
  { label: 'Luas Wilayah',    value: '±45 ha' },
  { label: 'Jumlah RT / RW',  value: '4 / 1' },
  { label: 'Jumlah Penduduk', value: `${totalWarga.toLocaleString('id-ID')} jiwa` },
  { label: 'Jumlah KK',       value: `${totalKK} KK` },
  { label: 'Ketinggian',      value: '±600 mdpl' },
  { label: 'Kecamatan',       value: 'Cangkringan' },
  { label: 'Kabupaten',       value: 'Sleman' },
  { label: 'Kode Pos',        value: '55583' },
]

export default function ProfilPage() {
  return (
    <div className="page-shell space-y-16">

      {/* Header */}
      <section className="space-y-4">
        <h1 className="text-4xl font-black">
          🏡 Profil{' '}
          <span className="gradient-text">Padukuhan Plosorejo</span>
        </h1>
        <p className="text-gray-400 max-w-2xl leading-relaxed">
          Padukuhan Plosorejo terletak di Jl. Balong, Kalurahan Umbulharjo, Kapanewon Cangkringan,
          Kabupaten Sleman, DIY 55583. Dikenal sebagai sentra peternakan sapi perah dan UMKM
          olahan susu di lereng Gunung Merapi.
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

      {/* Tabel RT/RW — 4 RT */}
      <section aria-label="Daftar RT dan RW">
        <div className="flex items-end justify-between gap-4 mb-5 flex-wrap">
          <h2 className="text-2xl font-black">Daftar RT / RW Balong</h2>
          <Link
            href="/peta"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-opacity hover:opacity-85"
            style={{ borderColor: 'var(--amber)', color: 'var(--amber)' }}
          >
            Lihat di Peta →
          </Link>
        </div>

        {/* Color legend */}
        <div className="flex flex-wrap gap-3 mb-4">
          {rtList.map(({ rt, color }) => (
            <span key={rt} className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} aria-hidden="true" />
              {rt}
            </span>
          ))}
        </div>

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
                    <td className="px-4 py-3 font-semibold">
                      <span className="inline-flex items-center gap-2" style={{ color: row.color }}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: row.color }} aria-hidden="true" />
                        {row.rt}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{row.rw}</td>
                    <td className="px-4 py-3 text-white">{row.ketua}</td>
                    <td className="px-4 py-3 tabular-nums text-gray-300">{row.kk}</td>
                    <td className="px-4 py-3 tabular-nums text-gray-300">{row.warga}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--s2)' }}>
                  <td className="px-4 py-3 font-bold text-white" colSpan={3}>Total</td>
                  <td className="px-4 py-3 font-bold tabular-nums" style={{ color: 'var(--amber)' }}>{totalKK}</td>
                  <td className="px-4 py-3 font-bold tabular-nums" style={{ color: 'var(--amber)' }}>{totalWarga}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-3">
          * Data penduduk placeholder — diganti hasil survei lapangan. Koordinat batas RT di peta
          adalah estimasi dan perlu validasi GPS.
        </p>
      </section>

    </div>
  )
}
