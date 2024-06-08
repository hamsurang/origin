import { People, Repository } from '@/_shared'
import { Button } from '@hamsurang/ui'
import type { RepositoryItem } from './_shared/components'

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

export default function Page(): JSX.Element {
  return (
    <main>
      <Button>Button</Button>
      <People />
      <Repository items={REPOSITORY_ITEMS} />
    </main>
  )
}
