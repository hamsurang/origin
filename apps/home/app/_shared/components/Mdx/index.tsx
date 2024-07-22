import { MDXRemote } from 'next-mdx-remote/rsc'
import { MdxStylingComponents } from './Mdx.style'

export const Mdx = ({ fileText }: { fileText: string }) => (
  <MDXRemote source={fileText} components={MdxStylingComponents} />
)
