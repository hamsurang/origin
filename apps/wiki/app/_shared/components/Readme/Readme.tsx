import { MDXStylingComponents, cn } from '@hamsurang/ui'
import { MDXRemote } from 'next-mdx-remote/rsc'

export const Readme = ({ text, className }: { text: string; className?: string }) => (
  <div className={cn('border-slate-200 border-2 rounded-lg p-[24px]', className)}>
    <MDXRemote source={text} components={MDXStylingComponents} />
  </div>
)
