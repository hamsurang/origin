import { MBTIOverview } from '@/_shared'
import { PEOPLE_MBTI_INFO_MAP } from './people.constants'

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const username = searchParams.username

  return (
    <div className="w-full">
      <MBTIOverview {...PEOPLE_MBTI_INFO_MAP[username as keyof typeof PEOPLE_MBTI_INFO_MAP]} />
    </div>
  )
}
