export type NavItem = { id: string; name: string }
export type NavItems = (NavItem & { subItems: NavItem[] })[]

export const NAV_ITEMS = [
  {
    id: 'main-activity',
    name: '정규활동',
    subItems: [
      { id: 'hamsurang‐critique', name: '함수랑크리틱' },
      { id: 'hamsurang-festival', name: '함수랑학예회' },
      { id: 'hamsurang‐marathon', name: '함수랑마라톤' },
    ],
  },
] as const

export const DEFAULT_NAV_ITEM_ID = NAV_ITEMS[0].id
