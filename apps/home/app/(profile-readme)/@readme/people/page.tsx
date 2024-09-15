import { Readme } from '@/_shared'
import { promises as fs } from 'node:fs'
import path from 'node:path'

const README_FROM_GITHUB_USERS = [{ username: 'sonsurim', branch: 'master' }] as const

export default async function Page({
  searchParams,
}: {
  searchParams: { username: string }
}) {
  const { username } = searchParams

  const githubUser = README_FROM_GITHUB_USERS.find((user) => user.username === username)

  if (githubUser) {
    const readme = await fetch(
      `https://raw.githubusercontent.com/${username}/${username}/${githubUser.branch}/README.md`,
    ).then((res) => res.text())

    return <Readme text={readme} />
  }

  const filePath = path.join(
    process.cwd(),
    `./app/(profile-readme)/@readme/_shared/content/${username}.mdx`,
  )
  const readme = await fs.readFile(filePath, { encoding: 'utf8' })

  return <Readme text={readme} />
}
