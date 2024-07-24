import fs from 'node:fs'
import path from 'node:path'
import { Readme } from '@/_shared'

export default function Page() {
  const filePath = path.join(process.cwd(), 'app/@readme/_shared/content/main.mdx')
  const mainReadme = fs.readFileSync(filePath, 'utf8')

  return <Readme text={mainReadme} />
}
