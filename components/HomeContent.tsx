import Link from 'next/link'
import SektorCard from '@/components/SektorCard'
import BeritaCard from '@/components/BeritaCard'
import MerapiStatusServer from '@/components/MerapiStatusServer'
import StatsBar from '@/components/StatsBar'
import Icon from '@/components/Icon'
import ScrollReveal from '@/components/ScrollReveal'

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
                    src="/images/hero-identity.svg"
                    alt="Identitas visual Padukuhan Plosorejo di lereng Merapi"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                    style={{ zIndex: 0 }}
                    fetchPriority="high"
                    draggable={false}
                />

                {/* gradient overlays */}
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

                {/* vertical line decorators */}
                <div
                    className="hero-line-deco pointer-events-none"
                    style={{ position: 'absolute', top: 0, bottom: 0, left: '20%', zIndex: 3 }}
                    aria-hidden="true"
                />
                <div
                    className="hero-line-deco pointer-events-none"
                    style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', zIndex: 3 }}
                    aria-hidden="true"
                />
                <div
                    className="hero-line-deco pointer-events-none"
                    style={{ position: 'absolute', top: 0, bottom: 0, left: '80%', zIndex: 3 }}
                    aria-hidden="true"
                />

                <div className="relative z-20 hero-interactive on-dark w-full max-w-7xl mx-auto px-6 pt-28 pb-24 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-center">
                    <div className="text-center lg:text-left">

                        {/* pill badge */}
                        <div>
                            <div
                                className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full"
                                style={{
                                    border: '1px solid rgba(212,175,55,0.45)',
                                    background: 'var(--gold-glow)',
                                }}
                            >
                                <span aria-hidden="true">🌋</span>
                                <span className="text-xs tracking-[0.16em] uppercase font-medium" style={{ color: 'var(--gold)' }}>
                                    Lereng Merapi · Cangkringan
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
                                    fontFamily: 'var(--font-syne), var(--font-playfair), Georgia, serif',
                                    fontSize: 'clamp(2.6rem, 7vw, 5rem)',
                                    lineHeight: 1.05,
                                    color: 'var(--on-dark-text)',
                                    letterSpacing: '-0.02em',
                                }}
                            >
                                Padukuhan<br />
                                <span className="gold-text">Plosorejo</span>
                            </h1>
                        </div>

                        <div>
                            <p
                                className="text-base md:text-lg leading-relaxed mb-4 max-w-lg"
                                style={{ color: 'var(--on-dark-muted)' }}
                            >
                                Komunitas agraris lereng Merapi yang memadukan tradisi
                                dan inovasi digital untuk pemberdayaan warga.
                            </p>
                            {/* thin gold rule below subtitle */}
                            <div
                                style={{
                                    width: '3.5rem',
                                    height: '1px',
                                    background: 'var(--gold)',
                                    marginBottom: '1.5rem',
                                    opacity: 0.7,
                                }}
                                aria-hidden="true"
                            />
                        </div>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                            <Link href="/profil" className="btn-primary touch-manipulation">
                                Jelajahi Plosorejo
                            </Link>
                            <Link href="/sektor" className="btn-ghost touch-manipulation">
                                Lihat Sektor →
                            </Link>
                        </div>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                            {[
                                { label: '↑ 320 Warga Aktif', href: '/profil' },
                                { label: '🐄 Sapi Perah Grade A', href: '/sektor/peternakan' },
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

                    {/* right column */}
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

                {/* scroll indicator */}
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

            {/* ─── STATS BAR ─────────────────────────────────────────────────── */}
            <ScrollReveal>
                <div className="reveal-item reveal-item--delay-1">
                    <StatsBar />
                </div>
            </ScrollReveal>

            {/* ─── SEKTOR ────────────────────────────────────────────────────── */}
            <section className="py-24 px-6" aria-labelledby="sektor-heading">
                <div className="max-w-7xl mx-auto">
                    <div className="section-sep">
                        <div className="section-sep__line" />
                        <div className="section-sep__dot" />
                        <div className="section-sep__line" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div>
                            <p className="section-label">SEKTOR UNGGULAN</p>
                            <h2 id="sektor-heading" className="section-heading">
                                Pilar <span className="gold-text">Ekonomi</span>
                            </h2>
                        </div>
                        <Link href="/sektor" className="btn-ghost" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                            Lihat semua →
                        </Link>
                    </div>

                    <ScrollReveal>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {sektorCards.map((card, i) => (
                                <div
                                    key={card.href}
                                    className={`reveal-item reveal-item--delay-${Math.min(i + 1, 6)}`}
                                >
                                    <SektorCard {...card} />
                                </div>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* ─── QUICK ACCESS (mobile grid) ────────────────────────────────── */}
            <section
                className="py-12 px-6 lg:hidden"
                aria-labelledby="quick-access-heading"
                style={{ backgroundColor: 'var(--s1)' }}
            >
                <div className="max-w-7xl mx-auto">
                    <div className="section-sep">
                        <div className="section-sep__line" />
                        <div className="section-sep__dot" />
                        <div className="section-sep__line" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div>
                            <p className="section-label">NAVIGASI CEPAT</p>
                            <h2 id="quick-access-heading" className="section-heading">
                                Akses Layanan
                            </h2>
                        </div>
                        <Link href="/sektor" className="btn-ghost" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                            Lihat semua →
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {quickAccess.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="surface-panel p-4 flex flex-col gap-2 rounded-2xl touch-manipulation transition-all hover:scale-[1.02]"
                                aria-label={item.title}
                            >
                                <span
                                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                                    style={{ background: 'var(--gold-glow)', color: 'var(--gold)' }}
                                    aria-hidden="true"
                                >
                                    <Icon name={item.icon} size={16} />
                                </span>
                                <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                                    {item.title}
                                </span>
                                <span className="text-xs leading-snug" style={{ color: 'var(--muted)' }}>
                                    {item.desc}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── POTENSI ───────────────────────────────────────────────────── */}
            <section className="py-24 px-6" aria-labelledby="potensi-heading">
                <div className="max-w-7xl mx-auto">
                    <div className="section-sep">
                        <div className="section-sep__line" />
                        <div className="section-sep__dot" />
                        <div className="section-sep__line" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div>
                            <p className="section-label">POTENSI UNGGULAN</p>
                            <h2 id="potensi-heading" className="section-heading">
                                Kekuatan <span className="gold-text">Plosorejo</span>
                            </h2>
                            <p className="mt-3 max-w-xl text-sm md:text-base leading-relaxed" style={{ color: 'var(--muted)' }}>
                                Dari peternakan sapi perah hingga UMKM dan wisata lereng Merapi —
                                semua potensi digarap bersama warga.
                            </p>
                        </div>
                        <Link href="/profil" className="btn-ghost" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                            Lihat semua →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 auto-rows-[280px] md:auto-rows-[240px]">
                        {potensiCards.map((card) => (
                            <div key={card.href}>
                                <Link
                                    href={card.href}
                                    className="group relative rounded-2xl overflow-hidden block shimmer-border h-full min-h-[240px] touch-manipulation"
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
                                                'linear-gradient(to top, rgba(5,5,5,0.96) 0%, rgba(5,5,5,0.55) 55%, transparent 100%)',
                                        }}
                                        aria-hidden="true"
                                    />
                                    <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
                                        <p
                                            className="text-xs uppercase tracking-widest mb-1 font-medium"
                                            style={{ color: 'var(--gold)' }}
                                        >
                                            {card.kategori}
                                        </p>
                                        <h3
                                            className="text-lg font-bold leading-snug mb-1"
                                            style={{ color: 'var(--on-dark-text)' }}
                                        >
                                            {card.headline}
                                        </h3>
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

            {/* ─── UMKM ──────────────────────────────────────────────────────── */}
            <section
                className="py-24 px-6"
                style={{ backgroundColor: 'var(--s1)' }}
                aria-labelledby="umkm-heading"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="section-sep">
                        <div className="section-sep__line" />
                        <div className="section-sep__dot" />
                        <div className="section-sep__line" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div>
                            <p className="section-label">USAHA WARGA</p>
                            <h2 id="umkm-heading" className="section-heading">
                                UMKM <span className="gold-text">Unggulan</span>
                            </h2>
                        </div>
                        <Link href="/sektor/umkm" className="btn-ghost" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                            Lihat semua →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {featuredUmkm.map((umkm) => (
                            <div key={umkm.id}>
                                <Link
                                    href={`/sektor/umkm/${umkm.id}`}
                                    className="surface-panel p-5 block rounded-2xl touch-manipulation transition-all hover:scale-[1.015] group"
                                    style={{
                                        borderLeft: '3px solid var(--gold)',
                                        paddingLeft: '1rem',
                                    }}
                                >
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div>
                                            <p
                                                className="font-bold text-base leading-snug"
                                                style={{ color: 'var(--text)' }}
                                            >
                                                {umkm.icon && (
                                                    <span className="mr-1.5" aria-hidden="true">
                                                        {umkm.icon}
                                                    </span>
                                                )}
                                                {umkm.nama}
                                            </p>
                                            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                                                {umkm.jenis}
                                            </p>
                                        </div>
                                        {umkm.aktif && (
                                            <span
                                                className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                                                style={{
                                                    background: 'var(--gold-glow)',
                                                    color: 'var(--gold)',
                                                    border: '1px solid rgba(212,175,55,0.3)',
                                                }}
                                            >
                                                Aktif
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm mb-3" style={{ color: 'var(--muted)' }}>
                                        {umkm.produk}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold" style={{ color: 'var(--gold)' }}>
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
                    <div className="section-sep">
                        <div className="section-sep__line" />
                        <div className="section-sep__dot" />
                        <div className="section-sep__line" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div>
                            <p className="section-label">KABAR PADUKUHAN</p>
                            <h2 id="berita-heading" className="section-heading">
                                Berita Terbaru
                            </h2>
                        </div>
                        <Link href="/berita" className="btn-ghost" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                            Lihat semua →
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
                                fontFamily: 'var(--font-syne), var(--font-playfair), Georgia, serif',
                                fontSize: 'clamp(2rem, 5vw, 3.25rem)',
                                color: 'var(--text)',
                                lineHeight: 1.1,
                            }}
                        >
                            Daftarkan Usaha Anda
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
