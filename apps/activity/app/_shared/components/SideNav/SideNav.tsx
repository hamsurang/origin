import Link from 'next/link'

export interface NavItem {
  id: number
  title: string
  subItems: { id: number; name: string; url: string }[]
}

export interface SideNavProps {
  items: NavItem[]
}

export const SideNav = ({ items }: SideNavProps) => {
  return (
    <nav className="p-4">
      <section className="shadow-sm border rounded-lg">
        <header className="border-b p-2 cursor-pointer">
          <h3 className="text-sm font-medium">
            Pages
            <span
              title={items.length.toString()}
              className="text-xs bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 ml-2"
            >
              {items.length}
            </span>
          </h3>
        </header>
        <ul className="p-0 list-none">
          {items.map((item) => (
            <li key={item.id} className="border-b">
              <details open>
                <summary className="cursor-pointer flex items-center p-2">
                  <button type="button" className="p-1 bg-transparent transition-transform">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
                      <path d="m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z" />
                    </svg>
                  </button>
                  <span className="ml-2 text-sm font-bold text-blue-500 truncate">
                    {item.title}
                  </span>
                </summary>
                <ul className="list-none pl-6 pb-4">
                  {item.subItems.map((subItem) => (
                    <li key={subItem.id} className="py-1 text-sm">
                      <Link href={subItem.url} className="text-gray-700 hover:text-blue-500">
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
