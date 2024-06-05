import { ActivityLogGraph, People, Repository } from '@/_shared'
import { Button } from '@hamsurang/ui'
import type { RepositoryItem } from './_shared/components'
import type { ActivityLogGraphDataType } from './_shared/components/ActivityGraph/ActivityLogGraph'

const REPOSITORY_ITEMS: RepositoryItem[] = [
  {
    id: 1,
    title: '퉁이리의 링크드인',
    category: 'Social',
    description: '저에게 일촌을 신청해주세요!',
    url: 'https://www.linkedin.com/in/tooo1',
  },
  {
    id: 2,
    title: '퉁이리의 개발 블로그',
    category: 'Blog',
    description: '퉁이리는 프론트엔드 개발자야',
    url: 'https://github.com/tooooo1',
  },
]

const sampleData: ActivityLogGraphDataType[] = [
  { startDate: '2024-01-01', endDate: '2024-06-04', contents: '첫 번째 활동 내역' },
  { startDate: '2024-01-01', endDate: '2024-03-31', contents: '두 번째 활동 내역' },
]

export default function Page(): JSX.Element {
  return (
    <main>
      <section className="flex items-center w-full p-5">
        <ActivityLogGraph data={sampleData} />
      </section>
      <Button>Button</Button>
      <People />
      <Repository items={REPOSITORY_ITEMS} />
    </main>
  )
}
