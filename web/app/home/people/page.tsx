'use client'

import { URL } from '@hamsurang/constants'
import { notFound } from 'next/navigation'

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const username = searchParams.username

  // useEffect(() => {
  //   window.location.href = `${URL.HOME}/people?username=${username}`
  // }, [username])

  if (!username) {
    return notFound()
  }

  return (
    <iframe
      src={`${URL.HOME}/people?username=${username}`}
      style={{ width: '100%', height: '100vh' }}
      title="home"
    />
  )
}
