import { MBTIOverview } from '@/_shared'
import { redirect } from 'next/navigation'
import { PEOPLE_MBTI_INFO_MAP } from './people.constants'

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const username = searchParams.username

  if (
    typeof username !== 'string' ||
    !PEOPLE_MBTI_INFO_MAP[username as keyof typeof PEOPLE_MBTI_INFO_MAP]
  ) {
    return redirect('/')
  }

  return (
    <div className="w-full">
      <MBTIOverview {...PEOPLE_MBTI_INFO_MAP[username as keyof typeof PEOPLE_MBTI_INFO_MAP]} />
    </div>
  )
}
