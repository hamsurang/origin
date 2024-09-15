import { DEFAULT_NAV_ITEM_ID, NAV_ITEMS } from '@/_shared/constants/nav/nav.constants'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const docsId = searchParams.get('id')
  const isWrongDocsId =
    !docsId ||
    !NAV_ITEMS.find(
      (item) => item.id === docsId || item.subItems.find((subItem) => subItem.id === docsId),
    )

  if (isWrongDocsId) {
    return NextResponse.redirect(new URL(`?id=${DEFAULT_NAV_ITEM_ID}`, origin))
  }
}

export const config = {
  matcher: ['/'],
}
