'use client'

import { URL } from '@hamsurang/constants'

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { id } = searchParams

  return (
    <iframe
      src={`${URL.WIKI}/docs?id=${id}`}
      style={{ width: '100%', height: '100vh' }}
      title="wiki"
    />
  )
}
