import type { RepositoryItem } from './_shared'
import type { ActivityLogGraphDataType } from './_shared/components/ActivityGraph/ActivityLogGraph'

export const REPOSITORY_ITEMS: RepositoryItem[] = [
  {
    id: 1,
    title: '함수랑크리틱',
    category: 'Repo',
    tag: '정규활동',
    description: '고민거리, 함수랑크리틱에서 치열하게 논의해요',
    url: 'https://hamsurang.notion.site/48d713cdac644ae4a4b159a2662c88cf',
  },
  {
    id: 2,
    title: '함수랑투게더',
    category: 'Repo',
    tag: '정규활동',
    description: '함수랑투게더에서는 함께하는 즐거움을 느껴요',
    url: 'https://hamsurang.notion.site/fc592575d8374a64bda88b6639cadaf1',
  },
  {
    id: 2,
    title: '함수랑마라톤',
    category: 'Repo',
    tag: '정규활동',
    description: '함수랑산악회에서 진행되는 해커톤에서 함께 달려요',
    url: 'https://hamsurang.notion.site/4d15bc3cb2b54e6ca804871be3fccabc',
  },
  {
    id: 2,
    title: '함수랑학예회',
    category: 'Repo',
    tag: '대외활동',
    description: '클라이머의 멋진 발표를 학예회에서 함께해요',
    url: 'https://hamsurang.notion.site/d51cec47044342cabe9ed11cac6f2993',
  },
]

export const sampleData: ActivityLogGraphDataType[] = [
  { startDate: '2024-01-01', endDate: '2024-06-04', contents: '첫 번째 활동 내역' },
  { startDate: '2024-01-01', endDate: '2024-03-31', contents: '두 번째 활동 내역' },
]
