import { DEFAULT_NAV_ITEM_ID, NAV_ITEMS_INFO } from '@/_shared'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const docsId = searchParams.get('id')

  if (!docsId) {
    return NextResponse.redirect(new URL(`/docs?id=${DEFAULT_NAV_ITEM_ID}`, origin))
  }

  if (!Object.keys(NAV_ITEMS_INFO).find((id) => id === docsId)) {
    return NextResponse.redirect(new URL(`/docs?id=${DEFAULT_NAV_ITEM_ID}`, origin))
  }
}

export const config = {
  matcher: ['/docs'],
}
