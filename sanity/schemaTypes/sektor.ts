import { defineField, defineType } from 'sanity'

export const sektor = defineType({
  name: 'sektor',
  title: 'Sektor',
  type: 'document',
  fields: [
    defineField({
      name: 'key',
      title: 'Key',
      type: 'string',
      description: 'Contoh: peternakan, umkm, pertanian',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'nama',
      title: 'Nama Sektor',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon / Emoji',
      type: 'string',
      initialValue: '📌',
    }),
    defineField({
      name: 'deskripsi',
      title: 'Deskripsi',
      type: 'text',
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'stats',
      title: 'Statistik',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'value', title: 'Value', type: 'string' }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'value' },
          },
        },
      ],
    }),
    defineField({
      name: 'items',
      title: 'Daftar Item',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
  preview: {
    select: {
      title: 'nama',
      subtitle: 'key',
      icon: 'icon',
    },
    prepare({ title, subtitle, icon }) {
      return {
        title: `${icon || ''} ${title}`.trim(),
        subtitle,
      }
    },
  },
})
