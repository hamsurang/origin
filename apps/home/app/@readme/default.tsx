import { promises as fs } from 'node:fs'
import path from 'node:path'
import { Readme } from '@/_shared'

export default async function Page() {
  const filePath = path.join(process.cwd(), './contents/main.mdx')
  const mainReadme = await fs.readFile(filePath, { encoding: 'utf8' })

  return <Readme text={mainReadme} />
}
