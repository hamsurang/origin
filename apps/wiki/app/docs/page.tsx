'use client'

import { Docs, type NAV_ITEMS_INFO } from '@/_shared'
import { useSearchParams } from 'next/navigation'

export default function Page() {
  const { get } = useSearchParams()

  /**
   * middleware에서 username을 검증하므로 타입 단언을 사용합니다.
   */
  const docsId = get('id') as keyof typeof NAV_ITEMS_INFO

  return <Docs id={docsId} />
}
