import type { ActivityLogProps, RepositoryItem } from './_shared'

export const REPOSITORY_ITEMS: RepositoryItem[] = [
  {
    id: 1,
    title: '코드 컴플리트',
    category: 'Repo',
    tag: '1기활동',
    description: '변하지 않는 기술에 집중하며 코드 컴플리트 원칙을 함께 학습해요',
    url: 'https://hamsurang.notion.site/2f845f0c788b80f9899aee806838614d',
  },
  {
    id: 2,
    title: 'Vite Deep Dive',
    category: 'Repo',
    tag: '1기활동',
    description: 'Vite 생태계에 기여하기 위해 번들러를 깊이 탐구해요',
    url: 'https://hamsurang.notion.site/2f845f0c788b804c823ddd82f4c92dca',
  },
  {
    id: 3,
    title: '퇴근 메이커',
    category: 'Repo',
    tag: '1기활동',
    description: 'n8n으로 반복 업무를 자동화하고 일찍 퇴근해요',
    url: 'https://hamsurang.notion.site/2f845f0c788b809e8c1dffbe9cd69ba5',
  },
  {
    id: 4,
    title: '함수랑 엑싯해',
    category: 'Repo',
    tag: '1기활동',
    description: '사이드 프로젝트를 운영하고 그로쓰해서 엑싯해요',
    url: 'https://hamsurang.notion.site/2f845f0c788b807dbf63d5f0b33488f6',
  },
  {
    id: 5,
    title: 'HookForm',
    category: 'Repo',
    tag: '정규활동',
    description: 'react hook form 라이브러리를 한글 번역본으로 제공해요',
    url: 'https://hamsurang.notion.site/1ff45f0c788b8090a286c92a07321cbf',
  },
  {
    id: 6,
    title: '함수랑크리틱',
    category: 'Repo',
    tag: '정규활동',
    description: '고민거리, 함수랑크리틱에서 치열하게 논의해요',
    url: 'https://hamsurang.notion.site/48d713cdac644ae4a4b159a2662c88cf',
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
