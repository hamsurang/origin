export const NAV_ITEMS_INFO = {
  'main-activity': {
    id: 'main-activity',
    name: '정규활동',
    url: '/docs?id=hamsurang‐critique',
  },
  'hamsurang‐critique': {
    id: 'hamsurang‐critique',
    name: '함수랑크리틱',
    url: '/docs?id=hamsurang‐critique',
  },
  'hamsurang-festival': {
    id: 'hamsurang-festival',
    name: '함수랑학예회',
    url: '/docs?id=hamsurang-festival',
  },
  'hamsurang‐marathon': {
    id: 'hamsurang‐marathon',
    name: '함수랑마라톤',
    url: '/docs?id=hamsurang‐marathon',
  },
} as const

export const NAV_ITEMS = [
  {
    ...NAV_ITEMS_INFO['main-activity'],
    subItems: [
      NAV_ITEMS_INFO['hamsurang‐critique'],
      NAV_ITEMS_INFO['hamsurang-festival'],
      NAV_ITEMS_INFO['hamsurang‐marathon'],
    ],
  },
] as const

export const DEFAULT_NAV_ITEM_ID = NAV_ITEMS_INFO['main-activity'].id
