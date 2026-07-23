import { defineField, defineType } from 'sanity'

export const merapiStatus = defineType({
  name: 'merapiStatus',
  title: 'Status Merapi',
  type: 'document',
  fields: [
    defineField({
      name: 'manualOverride',
      title: 'Pakai data manual (override MAGMA)',
      type: 'boolean',
      description:
        'Kalau aktif, website menampilkan level manual di bawah — bukan auto MAGMA. Matikan untuk kembali otomatis.',
      initialValue: false,
    }),
    defineField({
      name: 'level',
      title: 'Level (manual)',
      type: 'string',
      options: {
        list: [
          { title: 'Normal (I)', value: 'Normal' },
          { title: 'Waspada (II)', value: 'Waspada' },
          { title: 'Siaga (III)', value: 'Siaga' },
          { title: 'Awas (IV)', value: 'Awas' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
      initialValue: 'Normal',
      hidden: ({ document }) => !document?.manualOverride,
    }),
    defineField({
      name: 'deskripsi',
      title: 'Catatan / deskripsi',
      type: 'text',
      rows: 3,
      description:
        'Catatan lokal untuk warga (jalur evakuasi, imbauan dukuh, dll). Ditampilkan meski sumber MAGMA otomatis.',
    }),
    defineField({
      name: 'updatedAt',
      title: 'Diperbarui (manual)',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      hidden: ({ document }) => !document?.manualOverride,
    }),
  ],
  preview: {
    select: {
      title: 'level',
      subtitle: 'updatedAt',
      manual: 'manualOverride',
    },
    prepare({ title, subtitle, manual }) {
      return {
        title: `🌋 ${title || 'Auto MAGMA'}${manual ? ' (manual)' : ' (auto)'}`,
        subtitle: subtitle ? new Date(subtitle).toLocaleString('id-ID') : 'Sumber MAGMA ESDM',
      }
    },
  },
})
