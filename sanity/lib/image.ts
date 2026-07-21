import createImageUrlBuilder from '@sanity/image-url'
import { dataset, projectId, isSanityConfigured } from '../env'

const builder = isSanityConfigured()
  ? createImageUrlBuilder({ projectId, dataset })
  : null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlForImage(source: any) {
  if (!builder || !source) return null
  return builder.image(source).auto('format').fit('max')
}
