import { IFRAME_STYLE } from '@/_shared/constants/styles'
import { URL } from '@hamsurang/constants'

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { id } = searchParams

  return <iframe src={`${URL.WIKI}/docs?id=${id}`} style={IFRAME_STYLE} title="wiki" />
}
