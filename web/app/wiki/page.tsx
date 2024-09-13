import { IFRAME_STYLE } from '@/_shared/constants/styles'
import { URL } from '@hamsurang/constants'

export default function WikiPage() {
  return <iframe src={URL.WIKI} style={IFRAME_STYLE} title="wiki" />
}
