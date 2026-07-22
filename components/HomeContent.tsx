'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import SektorCard from '@/components/SektorCard'
import BeritaCard from '@/components/BeritaCard'
import MerapiStatusServer from '@/components/MerapiStatusServer'
import StatsBar from '@/components/StatsBar'
import Icon from '@/components/Icon'
import { easeOut, fadeUp, staggerContainer } from '@/components/motion'

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
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/images/hero-merapi.svg"
                    alt="Pemandangan lereng Gunung Merapi"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ zIndex: 0 }}
                    fetchPriority="high"
                />

                <div
                    className="absolute inset-0"
                    style={{
                        zIndex: 1,
                        background:
                            'linear-gradient(to bottom, rgba(5,5,5,0.62) 0%, rgba(5,5,5,0.28) 38%, rgba(5,5,5,0.72) 72%, rgba(5,5,5,1) 100%)',
                    }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        zIndex: 2,
                        background:
                            'radial-gradient(ellipse at center, transparent 42%, rgba(5,5,5,0.72) 100%)',
                    }}
                />
                <div className="noise-overlay" style={{ zIndex: 2 }} />

                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-28 pb-24 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-center">
                    <motion.div
                        className="text-center lg:text-left"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeUp}>
                            <div
                                className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full"
                                style={{
                                    border: '1px solid var(--border)',
                                    background: 'rgba(212,175,55,0.08)',
                                }}
                            >
                                <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--gold)' }} />
                                <span className="text-xs tracking-[0.16em] uppercase" style={{ color: 'var(--gold)' }}>
                                    Cangkringan · Sleman · DIY
                                </span>
                            </div>
                        </motion.div>

                        <motion.div variants={fadeUp}>
                            <p className="section-label mb-4">Padukuhan Digital</p>
                        </motion.div>

                        <motion.div variants={fadeUp}>
                            <h1
                                className="font-black mb-5"
                                style={{
                                    fontFamily: 'var(--font-playfair), Georgia, serif',
                                    fontSize: 'clamp(2.6rem, 7vw, 5rem)',
                                    lineHeight: 1.05,
                                    color: 'var(--text)',
                                }}
                            >
                                Desa yang Hidup,
                                <br />
                                <span className="gold-text">Potensi yang Nyata</span>
                            </h1>
                        </motion.div>

                        <motion.div variants={fadeUp}>
                            <p
                                className="text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8"
                                style={{ color: 'var(--muted)' }}
                            >
                                Portal resmi Padukuhan Plosorejo — sentra sapi perah, UMKM lokal,
                                dan pariwisata lereng Merapi. Informasi warga, wisatawan, dan
                                mitra dalam satu tempat.
                            </p>
                        </motion.div>

                        <motion.div variants={fadeUp}>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                                <Link href="/profil" className="btn-primary">
                                    Jelajahi Padukuhan
                                </Link>
                                <Link href="/peta" className="btn-ghost">
                                    Lihat Peta
                                </Link>
                                <Link href="/sektor/umkm" className="btn-ghost">
                                    Direktori UMKM
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div variants={fadeUp}>
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
                                            border: '1px solid var(--border)',
                                            background: 'rgba(255,255,255,0.03)',
                                            color: 'var(--text)',
                                        }}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="w-full max-w-md mx-auto lg:max-w-none lg:ml-auto space-y-4"
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.65, delay: 0.15, ease: easeOut }}
                    >
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
                                    style={{ background: 'rgba(212,175,55,0.12)', color: 'var(--gold)' }}
                                    aria-hidden="true"
                                >
                                    <Icon name="merapi" size={20} />
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div
                                    className="rounded-xl p-3"
                                    style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid var(--border)' }}
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
                                            style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold)' }}
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
                    </motion.div>
                </div>

                <div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 scroll-indicator"
                    style={{ zIndex: 3 }}
                    aria-hidden="true"
                >
                    <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--muted)' }}>
                        Scroll
                    </span>
                    <div className="w-px h-8" style={{ backgroundColor: 'var(--gold-dim)' }} />
                </div>
            </section>

            <StatsBar />

            {/* ─── POTENSI ───────────────────────────────────────────────────── */}
            <section className="py-24 px-6" aria-labelledby="potensi-heading">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeUp}
                    >
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
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-5 auto-rows-[280px] md:auto-rows-[240px]"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                        variants={staggerContainer}
                    >
                        {potensiCards.map((card) => (
                            <motion.div key={card.href} variants={fadeUp} className={card.span}>
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
                                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-7">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span
                                                className="w-7 h-7 rounded-md flex items-center justify-center"
                                                style={{ background: 'rgba(212,175,55,0.12)', color: 'var(--gold)' }}
                                                aria-hidden="true"
                                            >
                                                <Icon name={card.icon} size={14} />
                                            </span>
                                            <span className="section-label">{card.kategori}</span>
                                        </div>
                                        <p
                                            className="font-black text-2xl md:text-3xl mb-1"
                                            style={{
                                                fontFamily: 'var(--font-playfair), Georgia, serif',
                                                color: 'var(--text)',
                                            }}
                                        >
                                            {card.headline}
                                        </p>
                                        <p className="text-sm" style={{ color: 'var(--muted)' }}>
                                            {card.sub}
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ─── QUICK ACCESS ──────────────────────────────────────────────── */}
            <section className="px-6 pb-8" aria-label="Akses cepat">
                <motion.div
                    className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={staggerContainer}
                >
                    {quickAccess.map((item) => (
                        <motion.div key={item.href} variants={fadeUp}>
                            <Link href={item.href} className="card-surface p-5 flex items-start gap-4 group h-full">
                                <span
                                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold)' }}
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
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ─── SEKTOR ────────────────────────────────────────────────────── */}
            <section
                className="py-24 px-6"
                style={{ backgroundColor: 'var(--s1)' }}
                aria-labelledby="sektor-heading"
            >
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                    >
                        <p className="section-label mb-3">Sektor Padukuhan</p>
                        <h2 id="sektor-heading" className="section-heading">
                            7 Sektor Kehidupan
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm md:text-base leading-relaxed" style={{ color: 'var(--muted)' }}>
                            Jelajahi data, program, dan peluang di setiap sektor pembangunan
                            Padukuhan Plosorejo.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={staggerContainer}
                    >
                        {sektorCards.map((card) => (
                            <SektorCard key={card.href} {...card} />
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ─── UMKM ──────────────────────────────────────────────────────── */}
            <section className="py-24 px-6" aria-labelledby="umkm-heading">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                    >
                        <div>
                            <p className="section-label mb-3">Ekonomi Lokal</p>
                            <h2 id="umkm-heading" className="section-heading">
                                UMKM <span className="gold-text">Pilihan</span>
                            </h2>
                        </div>
                        <Link href="/sektor/umkm" className="btn-ghost self-start md:self-auto">
                            Lihat semua UMKM →
                        </Link>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                        variants={staggerContainer}
                    >
                        {featuredUmkm.map((umkm) => (
                            <motion.div key={umkm.id} variants={fadeUp}>
                                <Link href="/sektor/umkm" className="card-surface p-5 flex flex-col gap-3 group h-full">
                                    <div className="flex items-center justify-between gap-2">
                                        <span
                                            className="w-11 h-11 rounded-xl flex items-center justify-center"
                                            style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold)' }}
                                            aria-hidden="true"
                                        >
                                            <Icon name={umkm.icon || umkm.jenis} size={20} />
                                        </span>
                                        <span
                                            className="badge"
                                            style={{ color: 'var(--gold)', background: 'rgba(212,175,55,0.12)' }}
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
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ─── BERITA ────────────────────────────────────────────────────── */}
            <section
                className="py-24 px-6"
                style={{ backgroundColor: 'var(--s1)' }}
                aria-labelledby="berita-heading"
            >
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="flex items-end justify-between gap-6 mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                    >
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
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-5"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                        variants={staggerContainer}
                    >
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
                    </motion.div>
                </div>
            </section>

            {/* ─── CTA ───────────────────────────────────────────────────────── */}
            <section className="py-24 px-6" aria-labelledby="cta-heading">
                <motion.div
                    className="max-w-4xl mx-auto text-center surface-panel px-6 py-14 md:px-12 relative overflow-hidden"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.55, ease: easeOut }}
                >
                    <div
                        className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl opacity-30"
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
                </motion.div>
            </section>
        </div>
    )
}
