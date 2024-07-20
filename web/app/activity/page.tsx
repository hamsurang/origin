import { URL } from '@hamsurang/constants'

export default function ActivityPage() {
  return <iframe src={URL.ACTIVITY} style={{ width: '100%', height: '100vh' }} title="activity" />
}
