export type MBTIProps = {
  에너지_방향: {
    value: 'E' | 'I'
    percent: number
  }
  인식_기능: {
    value: 'S' | 'N'
    percent: number
  }
  판단_기능: {
    value: 'T' | 'F'
    percent: number
  }
  생활_양식: {
    value: 'J' | 'P'
    percent: number
  }
}

export type MBTI =
  | 'ENFJ'
  | 'ENFP'
  | 'ENTJ'
  | 'ENTP'
  | 'ESFJ'
  | 'ESFP'
  | 'ESTJ'
  | 'ESTP'
  | 'INFJ'
  | 'INFP'
  | 'INTJ'
  | 'INTP'
  | 'ISFJ'
  | 'ISFP'
  | 'ISTJ'
  | 'ISTP'
