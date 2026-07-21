import MerapiStatus from '@/components/MerapiStatus'
import { getMerapiStatus } from '@/lib/data'

export default async function MerapiStatusServer() {
  const status = await getMerapiStatus()
  return (
    <MerapiStatus
      level={status.level}
      deskripsi={status.deskripsi}
      updatedAt={status.updatedAt}
    />
  )
}
