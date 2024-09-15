import { Readme } from '@/_shared'

const WIKI_URI = 'https://raw.githubusercontent.com/wiki/hamsurang/origin'
const ENCODED_DASH = '%E2%80%90'

export const Docs = async ({ id }: { id: string }) => {
  const res = await fetch(`${WIKI_URI}/${id.replace(/-/g, ENCODED_DASH)}.md`)
  const wiki = await res.text()

  return <Readme className="border-none pt-0 w-[896px] mobile:w-full" text={wiki} />
}