import { MBTIOverview } from '@/_shared'
import { PEOPLE_MBTI_INFO_MAP } from './people.constants'

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const username = searchParams.username
  const mbtiData = PEOPLE_MBTI_INFO_MAP[username as keyof typeof PEOPLE_MBTI_INFO_MAP]

  return (
    <div className="w-full">
      {mbtiData ? (
        <MBTIOverview {...mbtiData} />
      ) : (
        <p className="text-gray-500 text-center py-8">아직 MBTI가 등록되지 않았습니다.</p>
      )}
    </div>
  )
}
