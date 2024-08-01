import { Readme } from '@/_shared'
import fs from 'node:fs'
import path from 'node:path'

export default function Page() {
  const filePath = path.join(process.cwd(), 'app/(profile-readme)/@readme/_shared/content/main.mdx')
  const mainReadme = fs.readFileSync(filePath, 'utf8')

  return <Readme text={mainReadme} />
}
