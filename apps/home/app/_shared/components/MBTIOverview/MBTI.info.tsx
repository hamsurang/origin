'use client'

import type { MBTI } from './MBTI.types'
import * as MBTISvg from './svgs'

export const MBTIInfo = ({
  mbti,
}: {
  mbti: MBTI
}) => {
  const Svg = MBTISvg[mbti]

  return (
    <section className="flex flex-col items-center justify-center w-[50%] mobile:flex-row mobile:w-full mobile:items-center mobile:p-5">
      <div className="size-[200px] mobile:size-[50%]">
        <Svg />
      </div>

      <div className="w-[80%]">
        <div className="text-lg font-bold">{mbti}</div>
        <div className="text-xs text-gray-500">{MBTIInfoMap[mbti].alias}</div>

        <div className="text-sm whitespace-pre">{MBTIInfoMap[mbti].description}</div>
      </div>
    </section>
  )
}

const MBTIInfoMap = {
  INTJ: {
    alias: '전략가',
    description: '모든 일에 대해 계획을 세우며\n상상력이 풍부한 전략가입니다.',
  },
  INTP: {
    alias: '논리술사',
    description: '지식을 끝없이 갈망하는\n 혁신적인 발명가입니다.',
  },
  ENTJ: {
    alias: '통솔자',
    description:
      '항상 문제 해결 방법을 찾아내는 성격으로,\n대담하고 상상력이 풍부하며 의지가 강력한 지도자입니다.',
  },
  ENTP: {
    alias: '변론가',
    description: '지적 도전을 즐기는 영리하고\n호기심이 많은 사색가입니다.',
  },
  INFJ: {
    alias: '옹호자',
    description:
      '차분하고 신비한 분위기를 풍기는 성격으로,\n다른 사람에게 의욕을 불어넣는 이상주의자입니다.',
  },
  INFP: {
    alias: '중재자',
    description: '항상 선을 행할 준비가 되어 있는\n부드럽고 친절한 이타주의자입니다.',
  },
  ENFJ: {
    alias: '선도자',
    description: '청중을 사로잡고 의욕을 불어넣는\n카리스마 넘치는 지도자입니다.',
  },
  ENFP: {
    alias: '활동가',
    description:
      '열정적이고 창의적인 성격으로,\n긍정적으로 삶을 바라보는 사교적이면서도 자유로운 영혼입니다.',
  },
  ISTJ: {
    alias: '현실주의자',
    description: '사실을 중시하는\n믿음직한 현실주의자입니다.',
  },
  ISFJ: {
    alias: '수호자',
    description: '주변 사람을 보호할 준비가 되어 있는\n헌신적이고 따뜻한 수호자입니다.',
  },
  ESTJ: {
    alias: '경영자',
    description: '사물과 사람을 관리하는 데 뛰어난 능력을 지닌 경영자입니다.',
  },
  ESFJ: {
    alias: '집정관',
    description:
      '배려심이 넘치고 항상 다른 사람을 도울 준비가 되어 있는 성격으로,\n인기가 많고 사교성 높은 마당발입니다.',
  },
  ISTP: {
    alias: '장인',
    description:
      '대담하면서도 현실적인 성격으로,\n모든 종류의 도구를 자유자재로 다루는 장인입니다.',
  },
  ISFP: {
    alias: '모험가',
    description: '항상 새로운 경험을 추구하는 유연하고 매력 넘치는 예술가입니다.',
  },
  ESTP: {
    alias: '사업가',
    description:
      '위험을 기꺼이 감수하는 성격으로, 영리하고 에너지 넘치며 관찰력이 뛰어난 사업가입니다.',
  },
  ESFP: {
    alias: '연예인',
    description: '즉흥적이고 넘치는 에너지와 열정으로 주변 사람을 즐겁게 하는 연예인입니다.',
  },
}
