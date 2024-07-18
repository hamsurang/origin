import { URL } from '@hamsurang/constants'

export default function Page() {
  return <iframe src={URL.HOME} style={{ width: '100%', height: '100vh' }} title="home" />
}
