import { MDXRemote } from 'next-mdx-remote/rsc'
import { MDXStylingComponents } from './MDX.style'

export const MDX = ({ fileText }: { fileText: string }) => (
  <MDXRemote source={fileText} components={MDXStylingComponents} />
)
