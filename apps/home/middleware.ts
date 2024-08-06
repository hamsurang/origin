import { PEOPLE_MBTI_INFO_MAP } from '@/(profile-readme)/people/people.constants'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const username = searchParams.get('username')

  if (!username || !PEOPLE_MBTI_INFO_MAP[username as keyof typeof PEOPLE_MBTI_INFO_MAP]) {
    return NextResponse.redirect(new URL('/', origin))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/people'],
}
