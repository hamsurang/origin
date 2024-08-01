import { Readme } from '@/_shared'
import fs from 'node:fs'
import path from 'node:path'

export default async function Page({
  searchParams,
}: {
  searchParams: { username: string }
}) {
  const { username } = searchParams
  const filePath = path.join(
    process.cwd(),
    'app/(profile-readme)/@readme/_shared/content',
    `${username}.mdx`,
  )
  const readme = fs.readFileSync(filePath, 'utf8')

  return <Readme text={readme} />
}
