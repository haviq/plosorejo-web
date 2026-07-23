import { defineField, defineType } from 'sanity'

export const produksiSusu = defineType({
  name: 'produksiSusu',
  title: 'Produksi Susu Harian',
  type: 'document',
  fields: [
    defineField({ name: 'tanggal', title: 'Tanggal', type: 'date', validation: (r) => r.required() }),
    defineField({ name: 'peternak', title: 'Peternak / Kelompok', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'volumeLiter', title: 'Volume (liter)', type: 'number' }),
    defineField({
      name: 'kualitas',
      title: 'Kualitas / Grade',
      type: 'string',
      options: { list: ['A', 'A+', 'B+', 'B', 'C'] },
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['Diterima', 'Pending', 'Ditolak'] },
      initialValue: 'Diterima',
    }),
    defineField({ name: 'catatan', title: 'Catatan', type: 'text', rows: 2 }),
  ],
  orderings: [
    {
      title: 'Tanggal terbaru',
      name: 'tanggalDesc',
      by: [{ field: 'tanggal', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'peternak', subtitle: 'tanggal', volume: 'volumeLiter' },
    prepare({ title, subtitle, volume }) {
      return {
        title: title || 'Produksi',
        subtitle: `${subtitle || ''} · ${volume ?? '-'} L`,
      }
    },
  },
})
