import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Pengaturan Situs',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nama Situs',
      type: 'string',
      initialValue: 'Plosorejo — Padukuhan Digital',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      initialValue: 'Desa yang Hidup, Potensi yang Nyata',
    }),
    defineField({
      name: 'alamat',
      title: 'Alamat',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp Admin',
      type: 'string',
      description: 'Format: 62812...',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'jamLayanan',
      title: 'Jam Layanan',
      type: 'string',
      initialValue: 'Senin – Jumat: 08.00 – 14.00 WIB',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Pengaturan Situs' }
    },
  },
})
