import { cn } from '@hamsurang/ui'
import type { HTMLAttributes, ImgHTMLAttributes } from 'react'

export const MDXStylingComponents = {
  h1: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn('mt-2 scroll-m-20 border-b pb-3 text-3xl font-semibold', className)}
      {...props}
    />
  ),
  h2: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        'mt-10 scroll-m-20 mb-[16px] border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0',
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn('mt-8 scroll-m-20 text-xl font-semibold tracking-tight', className)}
      {...props}
    />
  ),
  h4: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={cn('mt-8 scroll-m-20 text-lg font-semibold tracking-tight', className)}
      {...props}
    />
  ),
  h5: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h5
      className={cn('mt-8 scroll-m-20 text-lg font-semibold tracking-tight', className)}
      {...props}
    />
  ),
  h6: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h6
      className={cn('mt-8 scroll-m-20 text-base font-semibold tracking-tight', className)}
      {...props}
    />
  ),
  a: ({ className, ...props }: HTMLAttributes<HTMLAnchorElement>) => (
    <a className={cn('text-[#0969da] underline underline-offset-4', className)} {...props} />
  ),
  p: ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn('text-base leading-[24px] [&:not(:first-child)]:mt-5 mb-[16px]', className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }: HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn('my-6 ml-6 list-disc', className)} {...props} />
  ),
  ol: ({ className, ...props }: HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn('my-6 ml-6 list-decimal', className)} {...props} />
  ),
  li: ({ className, ...props }: HTMLAttributes<HTMLElement>) => (
    <li className={cn('mt-2', className)} {...props} />
  ),
  blockquote: ({ className, ...props }: HTMLAttributes<HTMLElement>) => (
    <blockquote
      className={cn('mt-6 pl-4 text-[#59636e] border-l-4 border-[#d1d9e0]', className)}
      {...props}
    />
  ),
  img: ({ className, alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) => (
    // biome-ignore lint/a11y/useAltText: <explanation>
    <img className={cn('rounded-lg', className)} alt={alt} {...props} />
  ),
  hr: ({ ...props }: HTMLAttributes<HTMLHRElement>) => <hr className="my-4 md:my-8" {...props} />,
  table: ({ className, ...props }: HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn('w-full', className)} {...props} />
    </div>
  ),
  tr: ({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) => (
    <tr className={cn('m-0 border-t p-0 even:bg-muted', className)} {...props} />
  ),
  th: ({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        'border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right',
        className,
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        'border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right',
        className,
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }: HTMLAttributes<HTMLElement>) => (
    <code
      className={cn(
        'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm',
        className,
      )}
      {...props}
    />
  ),
  details: ({ className, ...props }: HTMLAttributes<HTMLDetailsElement>) => (
    <details className={cn('cursor-pointer', className)} {...props} />
  ),
}
