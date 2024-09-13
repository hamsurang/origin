import { URL } from '@hamsurang/constants'

export default function WikiPage() {
  return <iframe src={URL.WIKI} style={{ width: '100%', height: '100vh' }} title="wiki" />
}
