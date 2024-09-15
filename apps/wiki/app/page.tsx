import { DEFAULT_NAV_ITEM_ID, Docs } from '@/_shared'

export default function Page({ searchParams }: { searchParams: Record<'id', string> }) {
  return <Docs id={searchParams.id || DEFAULT_NAV_ITEM_ID} />
}
