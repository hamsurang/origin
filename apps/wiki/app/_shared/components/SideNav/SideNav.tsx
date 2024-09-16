'use client'

import type { NAV_ITEMS } from '@/_shared/constants'
import { cn } from '@hamsurang/ui'
import Link from 'next/link'

export interface SideNavProps {
  items: typeof NAV_ITEMS
  docsId: string | null
}

export const SideNav = ({ docsId, items }: SideNavProps) => {
  return (
    <nav className="p-4 w-[296px] mobile:w-full">
      <section className="shadow-sm border rounded-lg">
        <header className="border-b cursor-pointer py-2 px-3 bg-[#f6f8fa]">
          <h3 className="text-sm font-medium">
            Pages
            <span
              title={items.length.toString()}
              className="text-xs bg-[#59636e] text-white rounded-full px-2 py-0.5 ml-2"
            >
              {items.length}
            </span>
          </h3>
        </header>
        <ul className="p-0 list-none">
          {items.map((item) => (
            <li key={item.id} className="border-b">
              <details className="group" open>
                <summary className="cursor-pointer flex items-center p-2">
                  <svg
                    aria-hidden="true"
                    height="16"
                    viewBox="0 0 16 16"
                    width="16"
                    className="group-open:rotate-0 -rotate-90"
                  >
                    <path d="m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z" />
                  </svg>
                  <span className="ml-2 text-sm font-bold text-blue-500 truncate">
                    <Link
                      href={`?id=${item.id}`}
                      className={cn(
                        'text-gray-700 hover:text-blue-500 hover:underline',
                        !docsId || docsId === item.id ? 'text-primary' : 'text-gray-700',
                      )}
                    >
                      {item.name}
                    </Link>
                  </span>
                </summary>
                <ul className="list-none pl-6 pb-4">
                  {item.subItems.map((subItem) => (
                    <li key={subItem.id} className="py-1 text-sm">
                      <Link
                        href={`?id=${subItem.id}`}
                        className={cn(
                          'text-gray-700 hover:text-blue-500 hover:underline',
                          docsId === subItem.id ? 'text-primary' : 'text-gray-700',
                        )}
                      >
                        {subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </ul>
      </section>
    </nav>
  )
}
