'use client'

import { useSearchParams } from 'next/navigation'
import { Profile } from '../../../_shared'
import { PROFILE_INFO } from './people.constants'

export default function Page() {
  const { get } = useSearchParams()
  /**
   * middleware에서 username을 검증하므로 타입 단언을 사용합니다.
   */
  const userInfo = PROFILE_INFO[get('username') as keyof typeof PROFILE_INFO]

  return <Profile {...userInfo} />
}
