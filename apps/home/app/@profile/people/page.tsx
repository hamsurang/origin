import { Profile } from '../../_shared'
import { PROFILE_INFO } from './people.constants'

export default function Page({
  searchParams,
}: {
  searchParams: { username: string }
}) {
  /**
   * middleware에서 username을 검증하므로 타입 단언을 사용합니다.
   */
  const userInfo = PROFILE_INFO[searchParams.username as keyof typeof PROFILE_INFO]

  return <Profile {...userInfo} />
}
