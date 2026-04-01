import type { HAMSURANG_PEOPLE } from '@/_shared/components/People/People.constants'
import type { ProfileProps } from '@/_shared/components/Profile/Profile'

type PeopleUsername = (typeof HAMSURANG_PEOPLE)[number]['username']

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
  'azure-553': {
    name: '심미진',
    username: 'azure-553',
  },
  Sangminnn: {
    name: '박상민',
    username: 'Sangminnn',
  },
  'jong-kyung': {
    name: '이종경',
    username: 'jong-kyung',
  },
  sHyunis: {
    name: '정소현',
    username: 'sHyunis',
  },
  'Seung-wan': {
    name: '유승완',
    username: 'Seung-wan',
  },
  oilater: {
    name: '김성현',
    username: 'oilater',
  },
  'JeongHwan-dev': {
    name: '박정환',
    username: 'JeongHwan-dev',
  },
  tolluset: {
    name: '이병현',
    username: 'tolluset',
  },
  SeolJaeHyeok: {
    name: '설재혁',
    username: 'SeolJaeHyeok',
  },
  jangwonyoon: {
    name: '윤장원',
    username: 'jangwonyoon',
  },
  Kyujenius: {
    name: '홍규진',
    username: 'Kyujenius',
  },
  Jxxunnn: {
    name: '이준근',
    username: 'Jxxunnn',
  },
  doyoonear: {
    name: '이도윤',
    username: 'doyoonear',
  },
  'BO-LIKE-CHICKEN': {
    name: '백보성',
    username: 'BO-LIKE-CHICKEN',
  },
  sudosubin: {
    name: '김수빈',
    username: 'sudosubin',
  },
  jaesoekjjang: {
    name: '이재석',
    username: 'jaesoekjjang',
  },
  kangju2000: {
    name: '강주혁',
    username: 'kangju2000',
  },
  'korkt-kim': {
    name: '김경태',
    username: 'korkt-kim',
  },
} satisfies {
  [key in PeopleUsername]: ProfileProps
}
