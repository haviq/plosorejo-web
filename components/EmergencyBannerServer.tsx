import EmergencyBanner from '@/components/EmergencyBanner'
import { getMerapiStatus } from '@/lib/data'

export default async function EmergencyBannerServer() {
  const status = await getMerapiStatus()
  return (
    <EmergencyBanner
      level={status.level}
      roman={status.roman}
      deskripsi={status.deskripsi}
      updatedAt={status.updatedAt}
    />
  )
}
