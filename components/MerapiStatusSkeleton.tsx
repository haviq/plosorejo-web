/**
 * Loading skeleton for MerapiStatus card.
 * Mirrors the card layout (icon + two lines of text + two link stubs)
 * using the dark+gold shimmer animation consistent with the site theme.
 */
export default function MerapiStatusSkeleton() {
  return (
    <div
      className="rounded-2xl border p-4 flex items-center gap-4 shadow-lg"
      style={{
        backgroundColor: 'var(--s2)',
        borderColor: 'var(--border)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
      }}
      role="status"
      aria-label="Memuat status Gunung Merapi…"
      aria-busy="true"
    >
      {/* Icon placeholder */}
      <span
        className="w-12 h-12 rounded-xl flex-shrink-0 skeleton-shimmer"
        aria-hidden="true"
      />

      <div className="flex-1 min-w-0 space-y-2">
        {/* Label row */}
        <div className="flex items-center gap-2">
          <div className="skeleton-shimmer h-3 w-32 rounded" />
          <div className="skeleton-shimmer h-4 w-16 rounded-full" />
        </div>
        {/* Level text */}
        <div className="skeleton-shimmer h-5 w-24 rounded" />
        {/* Description */}
        <div className="skeleton-shimmer h-3 w-48 rounded" />
        {/* Link stubs */}
        <div className="flex gap-2 mt-2">
          <div className="skeleton-shimmer h-3 w-28 rounded" />
          <div className="skeleton-shimmer h-3 w-24 rounded" />
        </div>
      </div>
    </div>
  )
}
