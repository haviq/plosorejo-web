import { defineField, defineType } from 'sanity'

export const berita = defineType({
  name: 'berita',
  title: 'Berita',
  type: 'document',
  fields: [
    defineField({
      name: 'judul',
      title: 'Judul',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'judul', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tanggal',
      title: 'Tanggal',
      type: 'date',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'kategori',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          { title: 'Pertanian', value: 'Pertanian' },
          { title: 'Peternakan', value: 'Peternakan' },
          { title: 'Kesehatan', value: 'Kesehatan' },
          { title: 'Pendidikan', value: 'Pendidikan' },
          { title: 'Budaya', value: 'Budaya' },
          { title: 'KKN', value: 'KKN' },
          { title: 'UMKM', value: 'UMKM' },
          { title: 'Umum', value: 'Umum' },
        ],
        layout: 'dropdown',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'ringkasan',
      title: 'Ringkasan',
      type: 'text',
      rows: 3,
      validation: (r) => r.required().max(280),
    }),
    defineField({
      name: 'isi',
      title: 'Isi Berita',
      type: 'text',
      rows: 12,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'foto',
      title: 'Foto Cover',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  orderings: [
    {
      title: 'Tanggal Terbaru',
      name: 'tanggalDesc',
      by: [{ field: 'tanggal', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'judul',
      subtitle: 'kategori',
      media: 'foto',
      tanggal: 'tanggal',
    },
    prepare({ title, subtitle, media, tanggal }) {
      return {
        title,
        subtitle: `${subtitle || 'Umum'} · ${tanggal || ''}`,
        media,
      }
    },
  },
})
