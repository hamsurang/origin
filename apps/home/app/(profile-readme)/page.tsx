import { ActivityLog, DiscordActivity, RepositoryList } from '@/_shared'
import discordStats from '../_data/discord-stats.json'
import { ACTIVITY_LOGS, REPOSITORY_ITEMS } from '../home.constants'

export default function Page() {
  return (
    <section className="flex flex-col flex-1 gap-2">
      <p className="mt-3">Discord Activity</p>
      <DiscordActivity stats={discordStats} />
      <p className="mt-5">Pinned</p>
      <RepositoryList items={REPOSITORY_ITEMS} />
      <p className="mt-5">Activity Logs</p>
      <ActivityLog logs={ACTIVITY_LOGS} />
    </section>
  )
}
