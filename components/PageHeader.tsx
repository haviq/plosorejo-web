interface PageHeaderProps {
  eyebrow?: string
  title: string
  highlight?: string
  description?: string
  children?: React.ReactNode
}

export default function PageHeader({
  eyebrow,
  title,
  highlight,
  description,
  children,
}: PageHeaderProps) {
  return (
    <section className="space-y-4">
      {eyebrow && <p className="section-label">{eyebrow}</p>}
      <h1
        className="font-black leading-tight"
        style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          color: 'var(--text)',
        }}
      >
        {title}{' '}
        {highlight && <span className="gold-text">{highlight}</span>}
      </h1>
      {description && (
        <p className="text-sm md:text-base max-w-2xl leading-relaxed" style={{ color: 'var(--muted)' }}>
          {description}
        </p>
      )}
      {children}
    </section>
  )
}
