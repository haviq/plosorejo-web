import { defineField, defineType } from 'sanity'

export const layanan = defineType({
  name: 'layanan',
  title: 'Layanan Administrasi',
  type: 'document',
  fields: [
    defineField({ name: 'nama', title: 'Nama Layanan', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'nama', maxLength: 64 },
    }),
    defineField({
      name: 'kategori',
      title: 'Kategori',
      type: 'string',
      options: {
        list: ['Kependudukan', 'Administrasi', 'UMKM', 'Sosial', 'Lainnya'],
      },
    }),
    defineField({ name: 'deskripsi', title: 'Deskripsi', type: 'text', rows: 3 }),
    defineField({ name: 'waktu', title: 'Perkiraan Waktu', type: 'string' }),
    defineField({ name: 'biaya', title: 'Biaya', type: 'string', initialValue: 'Gratis' }),
    defineField({
      name: 'syarat',
      title: 'Syarat',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'alur',
      title: 'Alur Pengurusan',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({ name: 'pic', title: 'PIC / Petugas', type: 'string' }),
    defineField({ name: 'icon', title: 'Icon key', type: 'string', initialValue: 'document' }),
    defineField({ name: 'aktif', title: 'Aktif', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { title: 'nama', subtitle: 'kategori' },
  },
})
