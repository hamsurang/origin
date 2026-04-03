import { DiscordInsights } from '@/_shared'
import discordStats from '../_data/discord-stats.json'

export default function InsightsPage() {
  return (
    <section className="flex flex-col flex-1 gap-2 px-2">
      <DiscordInsights stats={discordStats} />
    </section>
  )
}
