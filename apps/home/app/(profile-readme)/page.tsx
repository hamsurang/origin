import { ActivityLog, RepositoryList } from '@/_shared'
import { ACTIVITY_LOGS, REPOSITORY_ITEMS } from '../home.constants'

export default function Page() {
  return (
    <section className="flex flex-col flex-1 gap-2">
      <p className="mt-3">Pinned</p>
      <RepositoryList items={REPOSITORY_ITEMS} />
      <p className="mt-5">Activity Logs</p>
      <ActivityLog logs={ACTIVITY_LOGS} />
    </section>
  )
}
