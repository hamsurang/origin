import type { PEOPLE_MBTI_INFO_MAP } from '@/(profile-readme)/people/people.constants'
import type { ProfileProps } from '@/_shared/components/Profile/Profile'

export const PROFILE_INFO = {
  'minsoo-web': {
    name: 'Minsoo kim',
    username: 'minsoo-web',
    email: 'zlemzlem5656@naver.com',
    description: 'Developer who believes in the value of sharing',
  },
  '2-NOW': {
    name: 'Lee HyunJae (whale)',
    username: '2-NOW',
  },
  chaaerim: {
    name: 'chaerim kim',
    username: 'chaaerim',
  },
  manudeli: {
    name: 'Jonghyeon Ko',
    username: 'manudeli',
    email: 'manudeli.ko@gmail.com',
  },
  minchodang: {
    name: 'minsuKang',
    username: 'minchodang',
  },
  minsour: {
    name: 'Minsoo Park',
    username: 'minsour',
    email: 'parkminsoo0128@gmail.com',
  },
  okinawaa: {
    name: '박찬혁',
    username: 'okinawaa',
    description: 'UX, DX enthusiast',
    email: 'chanhyuk-tech@kakao.com',
  },
  sonsurim: {
    name: 'Sonny',
    username: 'sonsurim',
    email: 'surim014@naver.com',
  },
  sungh0lim: {
    name: '임성호 (삼바)',
    username: 'sungh0lim',
  },
  tooooo1: {
    name: 'tooooo1',
    username: 'tooooo1',
    email: 'jungchungil7@gmail.com',
  },
  yejineee: {
    username: 'yejineee',
    email: 'yygeniee@gmail.com',
  },
} satisfies {
  [key in keyof typeof PEOPLE_MBTI_INFO_MAP]: ProfileProps
}
