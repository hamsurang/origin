import { IFRAME_CLASS_NAME } from '@/_shared/constants/styles'
import { URL } from '@hamsurang/constants'

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { username } = searchParams

  return (
    <iframe
      className={IFRAME_CLASS_NAME}
      src={`${URL.HOME}/people?username=${username}`}
      title="home"
    />
  )
}
