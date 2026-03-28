import { Readme } from '@/_shared'
import { promises as fs } from 'node:fs'
import path from 'node:path'

export default async function Page({
  searchParams,
}: {
  searchParams: { username: string }
}) {
  const { username } = searchParams
  const filePath = path.join(
    process.cwd(),
    `./app/(profile-readme)/@readme/_shared/content/${username}.mdx`,
  )

  let readme: string
  try {
    readme = await fs.readFile(filePath, { encoding: 'utf8' })
  } catch {
    return <p className="text-gray-500 text-center py-8">아직 README가 작성되지 않았습니다.</p>
  }

  return <Readme text={readme} />
}
