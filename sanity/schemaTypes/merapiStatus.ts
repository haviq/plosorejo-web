import { defineField, defineType } from 'sanity'

export const merapiStatus = defineType({
  name: 'merapiStatus',
  title: 'Status Merapi',
  type: 'document',
  fields: [
    defineField({
      name: 'level',
      title: 'Level',
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
    }),
    defineField({
      name: 'deskripsi',
      title: 'Deskripsi',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'updatedAt',
      title: 'Diperbarui',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'level',
      subtitle: 'updatedAt',
    },
    prepare({ title, subtitle }) {
      return {
        title: `🌋 ${title || 'Normal'}`,
        subtitle: subtitle ? new Date(subtitle).toLocaleString('id-ID') : '',
      }
    },
  },
})
