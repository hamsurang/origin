import { MDXRemote } from 'next-mdx-remote/rsc'
import { MDXStylingComponents } from './MDX.styles'

export const Readme = ({ text }: { text: string }) => (
  <div className="border-slate-200 border-2 rounded-lg p-[24px]">
    <MDXRemote source={text} components={MDXStylingComponents} />
  </div>
)
