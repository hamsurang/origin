import { getFollowers } from '../../../lib/github/get-followers'
import { PeopleFollowersTabs } from './PeopleFollowersTabs'

export const PeopleFollowersSection = async () => {
  const followers = await getFollowers()

  return <PeopleFollowersTabs followers={followers} />
}
