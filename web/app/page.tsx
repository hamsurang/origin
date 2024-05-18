const URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3002'
    : 'https://activity.hamsurang.com'

export default function Page() {
  return <iframe src={URL} style={{ width: '100%', height: '100vh' }} title="home" />
}
