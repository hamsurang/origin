import { ActivityLog, RepositoryList } from '@/_shared'
import { REPOSITORY_ITEMS, sampleData } from '../home.constants'

export default function Page() {
  return (
    <section className="flex flex-col flex-1 gap-4">
      <RepositoryList items={REPOSITORY_ITEMS} />
      <ActivityLog logs={sampleData} />
    </section>
  )
}
