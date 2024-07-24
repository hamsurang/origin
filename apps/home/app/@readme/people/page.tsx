import fs from 'node:fs'
import path from 'node:path'
import { MDX } from '@/_shared'
import { ReadmeBox } from '../_shared'

export default async function Page({
  searchParams,
}: {
  searchParams: { username: string }
}) {
  const { username } = searchParams

  try {
    const filePath = path.join(process.cwd(), 'app/@readme/_shared/content', `${username}.mdx`)
    const readme = fs.readFileSync(filePath, 'utf8')

    return (
      <ReadmeBox>
        <MDX fileText={readme} />
      </ReadmeBox>
    )
  } catch (e) {
    return <ReadmeBox>클라이머로 등록되지 않는 멤버예요! 🧐</ReadmeBox>
  }
}
