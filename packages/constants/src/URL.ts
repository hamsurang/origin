const HOME_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3002' : 'https://home.hamsurang.com'

const ROOT_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://hamsurang.com'

const ACTIVITY_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : 'https://activity.hamsurang.com'

export const URL = {
  HOME: HOME_URL,
  ROOT: ROOT_URL,
  ACTIVITY: ACTIVITY_URL,
}
