export const NAV_ITEMS_INFO = {
  'main-activity': {
    id: 'main-activity',
    name: '정규활동',
  },
  'hamsurang‐critique': {
    id: 'hamsurang‐critique',
    name: '함수랑크리틱',
  },
  'hamsurang-festival': {
    id: 'hamsurang-festival',
    name: '함수랑학예회',
  },
  'hamsurang‐marathon': {
    id: 'hamsurang‐marathon',
    name: '함수랑마라톤',
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
