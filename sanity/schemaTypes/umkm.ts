import { defineField, defineType } from 'sanity'

export const umkm = defineType({
  name: 'umkm',
  title: 'UMKM',
  type: 'document',
  fields: [
    defineField({
      name: 'nama',
      title: 'Nama Usaha',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'pemilik',
      title: 'Pemilik',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'jenis',
      title: 'Jenis Usaha',
      type: 'string',
      options: {
        list: [
          { title: 'Koperasi', value: 'Koperasi' },
          { title: 'Kuliner', value: 'Kuliner' },
          { title: 'Kerajinan', value: 'Kerajinan' },
          { title: 'Pertanian', value: 'Pertanian' },
          { title: 'Jasa', value: 'Jasa' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'produk',
      title: 'Produk / Layanan',
      type: 'text',
      rows: 2,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'harga',
      title: 'Harga',
      type: 'string',
      description: 'Contoh: Rp 8.000/liter',
    }),
    defineField({
      name: 'emoji',
      title: 'Emoji',
      type: 'string',
      initialValue: '🏪',
    }),
    defineField({
      name: 'jamBuka',
      title: 'Jam Buka',
      type: 'string',
      description: 'Format: 08.00 – 17.00',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp',
      type: 'string',
      description: 'Format: 62812... (tanpa +)',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'alamat',
      title: 'Alamat',
      type: 'string',
    }),
    defineField({
      name: 'gmaps',
      title: 'Link Google Maps',
      type: 'url',
    }),
    defineField({
      name: 'aktif',
      title: 'Aktif',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'foto',
      title: 'Foto Usaha',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: 'nama',
      subtitle: 'jenis',
      media: 'foto',
      aktif: 'aktif',
    },
    prepare({ title, subtitle, media, aktif }) {
      return {
        title: `${aktif === false ? '⏸ ' : ''}${title}`,
        subtitle,
        media,
      }
    },
  },
})
