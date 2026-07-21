import { defineField, defineType } from 'sanity'

export const galeri = defineType({
  name: 'galeri',
  title: 'Galeri',
  type: 'document',
  fields: [
    defineField({
      name: 'judul',
      title: 'Judul Album',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tanggal',
      title: 'Tanggal',
      type: 'string',
      description: 'Contoh: 1 Juli 2026',
    }),
    defineField({
      name: 'emoji',
      title: 'Emoji',
      type: 'string',
      initialValue: '📸',
    }),
    defineField({
      name: 'deskripsi',
      title: 'Deskripsi',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'warna',
      title: 'Warna Accent',
      type: 'string',
      description: 'CSS color, contoh: #d4af37 atau var(--gold)',
      initialValue: 'var(--gold)',
    }),
    defineField({
      name: 'count',
      title: 'Jumlah Foto (manual)',
      type: 'number',
      description: 'Opsional jika belum upload foto',
    }),
    defineField({
      name: 'foto',
      title: 'Foto',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
  ],
  preview: {
    select: {
      title: 'judul',
      subtitle: 'tanggal',
      media: 'foto.0',
    },
  },
})
