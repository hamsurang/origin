import { DEFAULT_NAV_ITEM_ID, Docs, type NAV_ITEMS_INFO } from '@/_shared'

export default function Page({
  searchParams,
}: { searchParams: Record<'id', keyof typeof NAV_ITEMS_INFO> }) {
  return <Docs id={searchParams.id || DEFAULT_NAV_ITEM_ID} />
}
