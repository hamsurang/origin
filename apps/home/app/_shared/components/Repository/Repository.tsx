import { Book, Github, Globe, Link } from '@hamsurang/icon'

type Category = 'Blog' | 'Github' | 'Social' | 'Others'
export type RepositoryItem = {
  id: number
  title: string
  category: Category
  description: string
  url: string
}

export type RepositoryProps = {
  items: RepositoryItem[]
}

export const Repository = ({ items }: RepositoryProps) => {
  return (
    <ul className="flex flex-wrap p-4">
      {items.map((item) => (
        <li key={item.id} className="w-full md:w-1/2 p-2">
          <article className="p-4 h-full border rounded-lg flex flex-col justify-between">
            <div className="flex items-center pb-2 gap-2">
              {categoryIconMap[item.category]}
              <a
                href={item.url}
                rel="noreferrer"
                target="_blank"
                className="font-bold text-blue-500 break-all hover:underline"
                aria-label={item.title}
              >
                {item.title}
              </a>
              <span className="border border-gray-300 text-gray-500 text-xs font-medium px-1.5 py-0.5 rounded-full">
                {item.category}
              </span>
            </div>
            <p className="text-gray-600 text-sm">{item.description}</p>
          </article>
        </li>
      ))}
    </ul>
  )
}

const categoryIconMap: { [key in Category]: JSX.Element } = {
  Blog: <Book />,
  Github: <Github />,
  Social: <Globe />,
  Others: <Link />,
}
