const URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : 'https://activity.hamsurang.com'

export default function ActivityPage() {
  return <iframe src={URL} style={{ width: '100%', height: '100vh' }} title="activity" />
}
