import { MDXRemote } from 'next-mdx-remote/rsc'
import { MDXStylingComponents } from './MDX.styles'

export const Readme = ({ text, className }: { text: string; className?: string }) => (
  <div className={`border-slate-200 border-2 rounded-lg p-[24px] ${className}`}>
    <MDXRemote source={text} components={MDXStylingComponents} />
  </div>
)
