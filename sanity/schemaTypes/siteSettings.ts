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
      name: 'telepon',
      title: 'Telepon',
      type: 'string',
      description: 'Format tampilan, mis. +62 812-xxxx-xxxx',
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp Admin',
      type: 'string',
      description: 'Format: 62812... (tanpa + dan spasi)',
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
    defineField({
      name: 'mapsUrl',
      title: 'Link Google Maps',
      type: 'url',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'facebook',
      title: 'Facebook URL',
      type: 'url',
    }),
    defineField({
      name: 'youtube',
      title: 'YouTube URL',
      type: 'url',
    }),
    defineField({
      name: 'perangkat',
      title: 'Perangkat Padukuhan',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'nama', title: 'Nama', type: 'string' }),
            defineField({ name: 'jabatan', title: 'Jabatan', type: 'string' }),
            defineField({
              name: 'whatsapp',
              title: 'WhatsApp',
              type: 'string',
              description: '62812...',
            }),
            defineField({
              name: 'icon',
              title: 'Icon key',
              type: 'string',
              initialValue: 'people',
            }),
          ],
          preview: {
            select: { title: 'nama', subtitle: 'jabatan' },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Pengaturan Situs' }
    },
  },
})
