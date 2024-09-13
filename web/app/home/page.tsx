import { IFRAME_STYLE } from '@/_shared/constants/styles'
import { URL } from '@hamsurang/constants'

export default function Page() {
  return <iframe src={URL.HOME} style={IFRAME_STYLE} title="home" />
}
