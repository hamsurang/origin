'use client'

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return <div>{searchParams.username}</div>
}
