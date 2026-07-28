import Link from 'next/link'

export const metadata = {
  title: '404 — Halaman tidak ditemukan',
}

export default function NotFound() {
  return (
    <div className="page-shell flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center">
      <div className="card-surface p-10 space-y-6 max-w-md w-full">
        {/* 404 number */}
        <p
          className="text-8xl font-black leading-none"
          style={{ color: 'var(--gold)' }}
          aria-hidden="true"
        >
          404
        </p>

        {/* Title */}
        <div className="space-y-2">
          <h1
            className="text-2xl font-black"
            style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              color: 'var(--text)',
            }}
          >
            Halaman tidak ditemukan
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Halaman yang Anda cari tidak ada atau sudah dipindahkan.
          </p>
        </div>

        {/* Divider */}
        <div
          className="w-12 h-0.5 mx-auto rounded-full"
          style={{ backgroundColor: 'var(--gold)' }}
          aria-hidden="true"
        />

        {/* CTA */}
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          ← Kembali ke Beranda
        </Link>
      </div>

      <p className="text-xs" style={{ color: 'var(--muted2)' }}>
        Portal digital Padukuhan Plosorejo
      </p>
    </div>
  )
}
