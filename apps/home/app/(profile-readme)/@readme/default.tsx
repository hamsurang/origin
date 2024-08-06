import { Readme } from '@/_shared'
import { promises as fs } from 'node:fs'
import path from 'node:path'

export default async function Page() {
  const filePath = path.join(
    process.cwd(),
    './app/(profile-readme)/@readme/_shared/content/main.mdx',
  )
  const mainReadme = await fs.readFile(filePath, { encoding: 'utf8' })

  return <Readme text={mainReadme} />
}
