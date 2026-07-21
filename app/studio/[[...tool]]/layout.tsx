export const metadata = {
  title: 'CMS Studio | Plosorejo',
  description: 'Manajemen konten Padukuhan Plosorejo',
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ height: '100vh', margin: 0, padding: 0, overflow: 'auto' }}>
      {children}
    </div>
  )
}
