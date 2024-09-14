import { Profile } from '../../../_shared'
import { PROFILE_INFO } from './people.constants'

export default function Page({
  searchParams,
}: { searchParams: Record<'username', keyof typeof PROFILE_INFO> }) {
  return <Profile {...PROFILE_INFO[searchParams.username]} />
}
