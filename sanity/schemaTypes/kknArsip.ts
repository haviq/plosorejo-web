import { defineField, defineType } from 'sanity'

export const kknArsip = defineType({
  name: 'kknArsip',
  title: 'Arsip KKN',
  type: 'document',
  fields: [
    defineField({ name: 'judul', title: 'Judul Kegiatan', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'tanggal', title: 'Tanggal', type: 'date' }),
    defineField({
      name: 'kategori',
      title: 'Kategori',
      type: 'string',
      options: {
        list: ['Teknologi', 'Ekonomi', 'Pertanian', 'Kesehatan', 'Budaya', 'Lainnya'],
      },
    }),
    defineField({ name: 'ringkasan', title: 'Ringkasan', type: 'text', rows: 3 }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['Berjalan', 'Selesai', 'Ditunda'] },
      initialValue: 'Berjalan',
    }),
    defineField({ name: 'link', title: 'Link terkait', type: 'string' }),
    defineField({ name: 'foto', title: 'Foto', type: 'image', options: { hotspot: true } }),
  ],
  orderings: [
    {
      title: 'Tanggal terbaru',
      name: 'tanggalDesc',
      by: [{ field: 'tanggal', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'judul', subtitle: 'kategori', media: 'foto' },
  },
})
