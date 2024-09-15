import { IFRAME_CLASS_NAME } from '@/_shared/constants/styles'
import { URL } from '@hamsurang/constants'

export default function Page() {
  return <iframe className={IFRAME_CLASS_NAME} src={URL.HOME} title="home" />
}
