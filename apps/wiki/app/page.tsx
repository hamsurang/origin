import { DEFAULT_NAV_ITEM_ID, Docs } from '@/_shared'
import './reset.css'

export default function Page({ searchParams }: { searchParams: Record<'id', string> }) {
  return <Docs id={searchParams.id || DEFAULT_NAV_ITEM_ID} />
}
