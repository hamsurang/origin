import { MDXRemote } from 'next-mdx-remote/rsc'
import { MDXStylingComponents } from './MDX.styles'

export const MDX = ({ fileText }: { fileText: string }) => (
  <MDXRemote source={fileText} components={MDXStylingComponents} />
)
