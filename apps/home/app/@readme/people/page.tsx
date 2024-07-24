import fs from 'node:fs'
import path from 'node:path'
import { Readme } from '@/_shared'

export default async function Page({
  searchParams,
}: {
  searchParams: { username: string }
}) {
  const { username } = searchParams

  try {
    const filePath = path.join(process.cwd(), 'app/@readme/_shared/content', `${username}.mdx`)
    const readme = fs.readFileSync(filePath, 'utf8')

    return <Readme text={readme} />
  } catch (e) {
    console.error(e)
  }
}
