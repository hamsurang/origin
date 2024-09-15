import { MDXStylingComponents } from '@hamsurang/ui'
import { MDXRemote } from 'next-mdx-remote/rsc'

export const Readme = ({ text }: { text: string }) => (
  <div className="border-slate-200 border-2 rounded-lg p-[24px]">
    <MDXRemote source={text} components={MDXStylingComponents} />
  </div>
)
