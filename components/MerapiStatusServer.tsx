import MerapiStatus from '@/components/MerapiStatus'
import { getMerapiStatus } from '@/lib/data'

export default async function MerapiStatusServer() {
  const status = await getMerapiStatus()
  return (
    <MerapiStatus
      level={status.level}
      deskripsi={status.deskripsi}
      updatedAt={status.updatedAt}
      source={status.source}
      sourceLabel={status.sourceLabel}
      reportUrl={status.reportUrl}
      officialUrl={status.officialUrl}
      roman={status.roman}
      note={status.note}
    />
  )
}
