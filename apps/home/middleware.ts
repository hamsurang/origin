import { HAMSURANG_PEOPLE } from '@/_shared/components/People/People.constants'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const validUsernames: string[] = HAMSURANG_PEOPLE.map((p) => p.username)

export function middleware(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const username = searchParams.get('username')

  if (!username || !validUsernames.includes(username)) {
    return NextResponse.redirect(new URL('/', origin))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/people'],
}
