import { promises as fs } from 'node:fs'
import path from 'node:path'
import { Readme } from '@/_shared'

export default async function Page({
  searchParams,
}: {
  searchParams: { username: string }
}) {
  const { username } = searchParams
  const filePath = path.join(process.cwd(), 'public', `content/${username}.mdx`)
  const readme = await fs.readFile(filePath, 'utf8')

  return <Readme text={readme} />
}
