import { ActivityLogGraph } from '@/_shared'
import { RepositoryList } from './_shared/components/Repository/Repository.list'
import { REPOSITORY_ITEMS, sampleData } from './home.constants'

export default function Page(): JSX.Element {
  return (
    <section className="flex flex-col gap-4 flex-1">
      <RepositoryList items={REPOSITORY_ITEMS} />

      <ActivityLogGraph data={sampleData} />
    </section>
  )
}
