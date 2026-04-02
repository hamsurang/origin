import type { ActivityLogProps, RepositoryItem } from './_shared'

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
    id: 3,
    title: '함수랑마라톤',
    category: 'Repo',
    tag: '정규활동',
    description: '함수랑산악회에서 진행되는 해커톤에서 함께 달려요',
    url: 'https://hamsurang.notion.site/4d15bc3cb2b54e6ca804871be3fccabc',
  },
  {
    id: 4,
    title: '함수랑학예회',
    category: 'Repo',
    tag: '대외활동',
    description: '클라이머의 멋진 발표를 학예회에서 함께해요',
    url: 'https://hamsurang.notion.site/d51cec47044342cabe9ed11cac6f2993',
  },
]

export const sampleData: ActivityLogProps['logs'] = [
  { startDate: '2024-01-01', endDate: '2024-06-04', contents: '첫 번째 활동 내역' },
  { startDate: '2024-01-01', endDate: '2024-03-31', contents: '두 번째 활동 내역' },
]

export const ACTIVITY_LOGS: ActivityLogProps['logs'] = [
  {
    startDate: '2023-07-13',
    endDate: '2023-09-21',
    contents: '쏙쏙쑥쑥 1기',
  },
  {
    startDate: '2023-10-25',
    endDate: '2023-12-27',
    contents: '쏙쏙쑥쑥 2기',
  },
  {
    startDate: '2023-06-01',
    endDate: '2024-07-04',
    contents: '함수랑크리틱 V1',
  },
  {
    startDate: '2024-06-09',
    endDate: '2024-06-09',
    contents: '함수랑마라톤',
  },
  {
    startDate: '2024-06-22',
    endDate: '2024-06-22',
    contents: '함수랑학예회',
  },
  {
    startDate: '2024-06-28',
    endDate: '2024-06-28',
    contents: '2분기정기모임',
  },
  {
    startDate: '2026-01-26',
    endDate: '2026-01-26',
    contents: '1기 OT',
  },
  {
    startDate: '2026-01-30',
    endDate: '2026-01-30',
    contents: '1기 오프라인 만남',
  },
  {
    startDate: '2026-01-30',
    endDate: '2026-04-24',
    contents: '1기 활동',
  },
  {
    startDate: '2026-02-05',
    endDate: '2026-04-24',
    contents: '함수랑크리틱 V2',
    url: 'https://hamsurang.notion.site/critique',
    loop: { daysOfWeek: ['Thu'] },
    links: {
      '2026-02-05': {
        url: 'https://hamsurang.notion.site/AI-2fd45f0c788b808a9f59ca6998240da9',
        label: '크리틱 - AI와 함께 성장',
      },
      '2026-02-19': {
        url: 'https://hamsurang.notion.site/30a45f0c788b803ca417c19b772d3b2e',
        label: '크리틱 - 최고의 엔지니어 공통 특성',
      },
      '2026-02-26': {
        url: 'https://hamsurang.notion.site/30d45f0c788b8014af65fe5b642113e5',
        label: '크리틱 - 문제를 잘 정의한다는 것',
      },
      '2026-03-12': {
        url: 'https://hamsurang.notion.site/31345f0c788b8013a6e9fa0973bb4d1c',
        label: '크리틱 - 개라밸',
      },
      '2026-03-19': {
        url: 'https://hamsurang.notion.site/30e45f0c788b8080bd84e0a65d7527e2',
        label: '크리틱 - 여러분의 고민',
      },
    },
  },
  {
    startDate: '2026-02-27',
    endDate: '2026-02-27',
    contents: '2월 정규모임 (중간 발표회)',
  },
  {
    startDate: '2026-03-07',
    endDate: '2026-03-07',
    contents: '함수랑마라톤 with OB',
  },
  {
    startDate: '2026-04-15',
    endDate: '2026-04-15',
    contents: '함수랑테크콘서트 - 생산성 높이는 앱',
  },
  {
    startDate: '2026-04-17',
    endDate: '2026-04-17',
    contents: '함수랑테크콘서트 - Medication Error',
  },
  {
    startDate: '2026-03-29',
    endDate: '2026-03-29',
    contents: '3월 정규모임 (오프라인 크리틱)',
  },
]
