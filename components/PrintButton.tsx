'use client'

export default function PrintButton({ label = 'Cetak / Save PDF' }: { label?: string }) {
  return (
    <button
      type="button"
      className="btn-primary text-sm no-print"
      onClick={() => {
        if (typeof window !== 'undefined') window.print()
      }}
    >
      {label}
    </button>
  )
}
