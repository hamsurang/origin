import { ActivityLogGraph, People, Profile, Repository } from '@/_shared'
import type { ActivityLog, RepositoryItem } from './_shared/components'

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

const sampleLogs: ActivityLog[] = [
  { startDate: '2024-01-01', endDate: '2024-06-04', contents: '첫 번째 활동 내역' },
  { startDate: '2024-01-01', endDate: '2024-03-31', contents: '두 번째 활동 내역' },
]

export default function Page(): JSX.Element {
  return (
    <main className="flex gap-2 mobile:flex-col px-4 mt-2 max-w-[1200px] mx-auto">
      <aside className="mobile:w-full w-[296px]">
        <Profile
          name="함수랑산악회"
          username="hamsurang"
          email="hamsurang@gmail.com"
          description="프론트엔드의 거대한 산을 등반하자"
        />
        <People />
      </aside>

      <section className="flex-1">
        <Repository items={REPOSITORY_ITEMS} />
        <ActivityLogGraph logs={sampleLogs} />
      </section>
    </main>
  )
}
