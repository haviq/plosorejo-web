import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, useCdn, isSanityConfigured } from '../env'

export const sanityClient = isSanityConfigured()
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn,
      perspective: 'published',
    })
  : null

export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  if (!sanityClient) return null
  try {
    return await sanityClient.fetch<T>(query, params)
  } catch (error) {
    console.error('[sanityFetch]', error)
    return null
  }
}
