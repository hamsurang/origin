import { DEFAULT_NAV_ITEM_ID, WikiMDX } from '@/_shared'
import './reset.css'

const WIKI_URI = 'https://raw.githubusercontent.com/wiki/hamsurang/origin'
const ENCODED_DASH = '%E2%80%90'

export default async function Page({ searchParams }: { searchParams: Record<'id', string> }) {
  const id = searchParams.id || DEFAULT_NAV_ITEM_ID

  const res = await fetch(`${WIKI_URI}/${id.replace(/-/g, ENCODED_DASH)}.md`)
  const wiki = await res.text()

  return <WikiMDX className="border-none pt-0 w-[896px] mobile:w-full" text={wiki} />
}
