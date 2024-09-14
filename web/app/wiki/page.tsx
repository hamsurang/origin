import { IFRAME_STYLE } from '@/_shared/constants/styles'
import { URL } from '@hamsurang/constants'

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const id = searchParams.id || 'main-activity'

  return <iframe src={`${URL.WIKI}?id=${id}`} style={IFRAME_STYLE} title="wiki" />
}
