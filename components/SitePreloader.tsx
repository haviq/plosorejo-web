/**
 * Server-rendered preloader markup only.
 * Dismiss logic lives in layout.tsx inline script (runs without React).
 */
export default function SitePreloader() {
  return (
    <div
      id="site-preloader"
      className="site-preloader"
      role="status"
      aria-live="polite"
      aria-label="Memuat Padukuhan Plosorejo"
    >
      <div className="site-preloader__layer site-preloader__layer--black" aria-hidden="true" />
      <div className="site-preloader__layer site-preloader__layer--gold" aria-hidden="true" />
      <div className="site-preloader__content">
        <p className="site-preloader__eyebrow">Portal Digital · Cangkringan</p>
        <h1 className="site-preloader__title" aria-label="PADUKUHAN PLOSOREJO">
          <span className="site-preloader__line-text">PADUKUHAN</span>
          <span className="site-preloader__line-text">PLOSOREJO</span>
        </h1>
        <div className="site-preloader__rule" aria-hidden="true" />
        <p className="site-preloader__sub">Umbulharjo · Sleman · Lereng Merapi</p>
        <p className="site-preloader__hint">Ketuk untuk lanjut</p>
      </div>
    </div>
  )
}
