'use client'

import { IFRAME_STYLE } from '@/_shared/constants/styles'
import { URL } from '@hamsurang/constants'

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { username } = searchParams

  return (
    <iframe src={`${URL.HOME}/people?username=${username}`} style={IFRAME_STYLE} title="home" />
  )
}
