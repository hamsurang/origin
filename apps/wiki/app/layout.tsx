import '@hamsurang/ui/globals.css'

import { Inter } from 'next/font/google'
import type { PropsWithChildren } from 'react'
import { SideNav } from './_shared'

const inter = Inter({ subsets: ['latin'] })

const NAV_ITEMS = [
  {
    id: 1,
    title: '정규활동',
    subItems: [
      { id: 1, name: '함수랑마라톤', url: '/hamsurang/origin/wiki/함수랑마라톤' },
      { id: 2, name: '함수랑학예회', url: '/hamsurang/origin/wiki/함수랑학예회' },
    ],
  },
  {
    id: 2,
    title: '디스코드',
    subItems: [
      { id: 3, name: '함수랑크리틱', url: '/hamsurang/origin/wiki/함수랑크리틱' },
      { id: 4, name: '함수랑상영회', url: '/hamsurang/origin/wiki/함수랑상영회' },
    ],
  },
]

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        {children}
        <SideNav items={NAV_ITEMS} />
      </body>
    </html>
  )
}
