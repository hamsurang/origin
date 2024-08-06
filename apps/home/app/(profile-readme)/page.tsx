import { ActivityLog, RepositoryList } from '@/_shared'
import { REPOSITORY_ITEMS, sampleData } from '../home.constants'

export default function Page() {
  return (
    <section className="flex-1">
      <RepositoryList items={REPOSITORY_ITEMS} />
      <ActivityLog logs={sampleData} />
    </section>
  )
}
