import Link from 'next/link'
import SektorCard from '@/components/SektorCard'
import BeritaCard from '@/components/BeritaCard'
import MerapiStatusServer from '@/components/MerapiStatusServer'
import StatsBar from '@/components/StatsBar'
import Icon from '@/components/Icon'

type SektorCardData = {
    href: string
    icon: string
    nama: string
    deskripsi: string
    stats: { label: string; value: string }[]
    accent: 'amber' | 'green' | 'indigo'
}

type PotensiCard = {
    href: string
    icon: string
    kategori: string
    headline: string
    sub: string
    img: string
    imgAlt: string
    span: string
}

type QuickAccess = {
    href: string
    icon: string
    title: string
    desc: string
}

type BeritaItem = {
    slug: string
    judul: string
    tanggal: string
    kategori: string
    ringkasan: string
}

type UmkmItem = {
    id: number
    nama: string
    jenis: string
    produk: string
    harga: string
    jamBuka: string
    icon?: string
    aktif: boolean
}

interface HomeContentProps {
    sektorCards: SektorCardData[]
    potensiCards: PotensiCard[]
    quickAccess: QuickAccess[]
    latestBerita: BeritaItem[]
    featuredUmkm: UmkmItem[]
}

export default function HomeContent({
    sektorCards,
    potensiCards,
    quickAccess,
    latestBerita,
    featuredUmkm,
}: HomeContentProps) {
    return (
        <div>
            {/* ─── HERO ──────────────────────────────────────────────────────── */}
            <section
                className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden"
                aria-label="Hero — Padukuhan Plosorejo"
                style={{ zIndex: 0 }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/images/hero-merapi.svg"
                    alt="Pemandangan lereng Gunung Merapi"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                    style={{ zIndex: 0 }}
                    fetchPriority="high"
                    draggable={false}
                />

                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        zIndex: 1,
                        background:
                            'linear-gradient(to bottom, rgba(5,5,5,0.78) 0%, rgba(5,5,5,0.55) 40%, rgba(5,5,5,0.82) 72%, rgba(5,5,5,1) 100%)',
                    }}
                    aria-hidden="true"
                />
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        zIndex: 2,
                        background:
                            'radial-gradient(ellipse at center, transparent 42%, rgba(5,5,5,0.72) 100%)',
                    }}
                    aria-hidden="true"
                />
                <div className="noise-overlay pointer-events-none" style={{ zIndex: 2 }} aria-hidden="true" />

                <div className="relative z-20 on-dark w-full max-w-7xl mx-auto px-6 pt-28 pb-24 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-center pointer-events-auto">
                    <div className="text-center lg:text-left">
                        <div>
                            <div
                                className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full"
                                style={{
                                    border: '1px solid var(--border)',
                                    background: 'var(--gold-glow)',
                                }}
                            >
                                <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--gold)' }} />
                                <span className="text-xs tracking-[0.16em] uppercase" style={{ color: 'var(--gold)' }}>
                                    Cangkringan · Sleman · DIY
                                </span>
                            </div>
                        </div>

                        <div>
                            <p className="section-label mb-4">Padukuhan Digital</p>
                        </div>

                        <div>
                            <h1
                                className="font-black mb-5"
                                style={{
                                    fontFamily: 'var(--font-playfair), Georgia, serif',
                                    fontSize: 'clamp(2.6rem, 7vw, 5rem)',
                                    lineHeight: 1.05,
                                    color: 'var(--on-dark-text)',
                                }}
                            >
                                Desa yang Hidup,
                                <br />
                                <span className="gold-text">Potensi yang Nyata</span>
                            </h1>
                        </div>

                        <div>
                            <p
                                className="text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8"
                                style={{ color: 'var(--on-dark-muted)' }}
                            >
                                Portal resmi Padukuhan Plosorejo — sentra sapi perah, UMKM lokal,
                                dan pariwisata lereng Merapi. Informasi warga, wisatawan, dan
                                mitra dalam satu tempat.
                            </p>
                        </div>

                        <div>
                            <div className="relative z-20 flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                                <Link href="/profil" className="btn-primary touch-manipulation">
                                    Jelajahi Padukuhan
                                </Link>
                                <Link href="/peta" className="btn-ghost touch-manipulation">
                                    Lihat Peta
                                </Link>
                                <Link href="/sektor/umkm" className="btn-ghost touch-manipulation">
                                    Direktori UMKM
                                </Link>
                            </div>
                        </div>

                        <div>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                                {[
                                    { label: '658 Jiwa', href: '/profil' },
                                    { label: '312 Sapi Perah', href: '/sektor/peternakan' },
                                    { label: '89 UMKM Aktif', href: '/sektor/umkm' },
                                ].map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="px-3 py-2 rounded-full text-xs font-medium transition-all hover:scale-[1.03]"
                                        style={{
                                            border: '1px solid rgba(240,192,64,0.35)',
                                            background: 'rgba(0,0,0,0.35)',
                                            color: 'var(--on-dark-text)',
                                        }}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="w-full max-w-md mx-auto lg:max-w-none lg:ml-auto space-y-4" style={{ color: 'var(--text)' }}>
                        <MerapiStatusServer />

                        <div className="surface-panel p-5 space-y-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="section-label mb-2">Sorotan Hari Ini</p>
                                    <h2
                                        className="text-xl font-bold"
                                        style={{
                                            fontFamily: 'var(--font-playfair), Georgia, serif',
                                            color: 'var(--text)',
                                        }}
                                    >
                                        Plosorejo di ujung jari
                                    </h2>
                                </div>
                                <span
                                    className="w-10 h-10 rounded-xl flex items-center justify-center float-soft"
                                    style={{ background: 'var(--gold-glow)', color: 'var(--gold)' }}
                                    aria-hidden="true"
                                >
                                    <Icon name="merapi" size={20} />
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div
                                    className="rounded-xl p-3"
                                    style={{ background: 'var(--gold-glow)', border: '1px solid var(--border)' }}
                                >
                                    <p className="text-lg font-bold" style={{ color: 'var(--gold)' }}>
                                        Grade A
                                    </p>
                                    <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                                        Kualitas susu harian
                                    </p>
                                </div>
                                <div
                                    className="rounded-xl p-3"
                                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}
                                >
                                    <p className="text-lg font-bold" style={{ color: 'var(--text)' }}>
                                        7 Sektor
                                    </p>
                                    <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                                        Potensi terintegrasi
                                    </p>
                                </div>
                            </div>

                            <div className="divider-gold" />

                            <div className="space-y-2">
                                {quickAccess.slice(0, 3).map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:translate-x-1"
                                        style={{
                                            background: 'rgba(255,255,255,0.02)',
                                            border: '1px solid transparent',
                                        }}
                                    >
                                        <span
                                            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                                            style={{ background: 'var(--gold-glow)', color: 'var(--gold)' }}
                                            aria-hidden="true"
                                        >
                                            <Icon name={item.icon} size={16} />
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block text-sm font-semibold" style={{ color: 'var(--text)' }}>
                                                {item.title}
                                            </span>
                                            <span className="block text-xs truncate" style={{ color: 'var(--muted)' }}>
                                                {item.desc}
                                            </span>
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 scroll-indicator pointer-events-none"
                    style={{ zIndex: 3 }}
                    aria-hidden="true"
                >
                    <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--on-dark-muted)' }}>
                        Scroll
                    </span>
                    <div className="w-px h-8" style={{ backgroundColor: 'var(--gold-dim)' }} />
                </div>
            </section>

            <StatsBar />

            {/* ─── POTENSI ───────────────────────────────────────────────────── */}
            <section className="py-24 px-6" aria-labelledby="potensi-heading">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                        <div>
                            <p className="section-label mb-3">Potensi Unggulan</p>
                            <h2 id="potensi-heading" className="section-heading">
                                Kekuatan <span className="gold-text">Plosorejo</span>
                            </h2>
                            <p className="mt-3 max-w-xl text-sm md:text-base leading-relaxed" style={{ color: 'var(--muted)' }}>
                                Dari peternakan sapi perah hingga UMKM dan wisata lereng Merapi —
                                semua potensi digarap bersama warga.
                            </p>
                        </div>
                        <Link href="/profil" className="btn-ghost self-start md:self-auto">
                            Profil lengkap →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 auto-rows-[280px] md:auto-rows-[240px]">
                        {potensiCards.map((card) => (
                            <div key={card.href}>
                                <Link
                                    href={card.href}
                                    className="group relative rounded-2xl overflow-hidden block shimmer-border h-full min-h-[240px]"
                                    aria-label={`${card.kategori}: ${card.headline}`}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={card.img}
                                        alt={card.imgAlt}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background:
                                                'linear-gradient(to top, rgba(5,5,5,0.96) 0%, rgba(5,5,5,0.55) 48%, rgba(5,5,5,0.18) 100%)',
                                        }}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-7 on-dark">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span
                                                className="w-7 h-7 rounded-md flex items-center justify-center"
                                                style={{ background: 'rgba(0,0,0,0.35)', color: 'var(--on-dark-gold)' }}
                                                aria-hidden="true"
                                            >
                                                <Icon name={card.icon} size={14} />
                                            </span>
                                            <span className="section-label" style={{ color: 'var(--on-dark-gold)' }}>{card.kategori}</span>
                                        </div>
                                        <p
                                            className="font-black text-2xl md:text-3xl mb-1"
                                            style={{
                                                fontFamily: 'var(--font-playfair), Georgia, serif',
                                                color: 'var(--on-dark-text)',
                                            }}
                                        >
                                            {card.headline}
                                        </p>
                                        <p className="text-sm" style={{ color: 'var(--on-dark-muted)' }}>
                                            {card.sub}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── QUICK ACCESS ──────────────────────────────────────────────── */}
            <section className="px-6 pb-8" aria-label="Akses cepat">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickAccess.map((item) => (
                        <div key={item.href}>
                            <Link href={item.href} className="card-surface p-5 flex items-start gap-4 group h-full">
                                <span
                                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'var(--gold-glow)', color: 'var(--gold)' }}
                                    aria-hidden="true"
                                >
                                    <Icon name={item.icon} size={20} />
                                </span>
                                <span>
                                    <span
                                        className="block font-semibold mb-1 group-hover:underline underline-offset-2"
                                        style={{ color: 'var(--text)' }}
                                    >
                                        {item.title}
                                    </span>
                                    <span className="block text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                                        {item.desc}
                                    </span>
                                </span>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── SEKTOR ────────────────────────────────────────────────────── */}
            <section
                className="py-24 px-6"
                style={{ backgroundColor: 'var(--s1)' }}
                aria-labelledby="sektor-heading"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <p className="section-label mb-3">Sektor Padukuhan</p>
                        <h2 id="sektor-heading" className="section-heading">
                            7 Sektor Kehidupan
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm md:text-base leading-relaxed" style={{ color: 'var(--muted)' }}>
                            Jelajahi data, program, dan peluang di setiap sektor pembangunan
                            Padukuhan Plosorejo.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {sektorCards.map((card) => (
                            <SektorCard key={card.href} {...card} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── UMKM ──────────────────────────────────────────────────────── */}
            <section className="py-24 px-6" aria-labelledby="umkm-heading">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                        <div>
                            <p className="section-label mb-3">Ekonomi Lokal</p>
                            <h2 id="umkm-heading" className="section-heading">
                                UMKM <span className="gold-text">Pilihan</span>
                            </h2>
                        </div>
                        <Link href="/sektor/umkm" className="btn-ghost self-start md:self-auto">
                            Lihat semua UMKM →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {featuredUmkm.map((umkm) => (
                            <div key={umkm.id}>
                                <Link href="/sektor/umkm" className="card-surface p-5 flex flex-col gap-3 group h-full">
                                    <div className="flex items-center justify-between gap-2">
                                        <span
                                            className="w-11 h-11 rounded-xl flex items-center justify-center"
                                            style={{ background: 'var(--gold-glow)', color: 'var(--gold)' }}
                                            aria-hidden="true"
                                        >
                                            <Icon name={umkm.icon || umkm.jenis} size={20} />
                                        </span>
                                        <span
                                            className="badge"
                                            style={{ color: 'var(--gold)', background: 'var(--gold-glow)' }}
                                        >
                                            {umkm.jenis}
                                        </span>
                                    </div>
                                    <h3
                                        className="font-bold group-hover:underline underline-offset-2"
                                        style={{ color: 'var(--text)' }}
                                    >
                                        {umkm.nama}
                                    </h3>
                                    <p className="text-sm line-clamp-2" style={{ color: 'var(--muted)' }}>
                                        {umkm.produk}
                                    </p>
                                    <div
                                        className="mt-auto pt-3 border-t flex items-center justify-between gap-2"
                                        style={{ borderColor: 'var(--border)' }}
                                    >
                                        <span className="text-xs font-semibold" style={{ color: 'var(--gold)' }}>
                                            {umkm.harga}
                                        </span>
                                        <span className="text-xs" style={{ color: 'var(--muted)' }}>
                                            {umkm.jamBuka}
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── BERITA ────────────────────────────────────────────────────── */}
            <section
                className="py-24 px-6"
                style={{ backgroundColor: 'var(--s1)' }}
                aria-labelledby="berita-heading"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-end justify-between gap-6 mb-12">
                        <div>
                            <p className="section-label mb-3">Kabar Padukuhan</p>
                            <h2 id="berita-heading" className="section-heading">
                                Berita Terbaru
                            </h2>
                        </div>
                        <Link
                            href="/berita"
                            className="text-sm font-semibold transition-opacity hover:opacity-80"
                            style={{ color: 'var(--gold)' }}
                        >
                            Semua berita →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {latestBerita.map((item) => (
                            <BeritaCard
                                key={item.slug}
                                slug={item.slug}
                                judul={item.judul}
                                tanggal={item.tanggal}
                                kategori={item.kategori}
                                ringkasan={item.ringkasan}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA ───────────────────────────────────────────────────────── */}
            <section className="py-24 px-6" aria-labelledby="cta-heading">
                <div className="max-w-4xl mx-auto text-center surface-panel px-6 py-14 md:px-12 relative overflow-hidden">
                    <div
                        className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl opacity-30 pointer-events-none"
                        style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.45), transparent 70%)' }}
                        aria-hidden="true"
                    />
                    <div className="relative">
                        <p className="section-label mb-4">Bergabung</p>
                        <h2
                            id="cta-heading"
                            className="font-black mb-4"
                            style={{
                                fontFamily: 'var(--font-playfair), Georgia, serif',
                                fontSize: 'clamp(2rem, 5vw, 3.25rem)',
                                color: 'var(--text)',
                                lineHeight: 1.2,
                            }}
                        >
                            Punya usaha di <span className="gold-text">Plosorejo?</span>
                        </h2>
                        <p
                            className="text-base mb-8 max-w-md mx-auto leading-relaxed"
                            style={{ color: 'var(--muted)' }}
                        >
                            Daftarkan usaha Anda ke direktori digital Padukuhan Plosorejo.
                            Jangkau lebih banyak pelanggan dan akses program pemberdayaan UMKM.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/sektor/umkm" className="btn-primary">
                                Daftar UMKM
                            </Link>
                            <Link href="/kontak" className="btn-ghost">
                                Hubungi Kami
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
