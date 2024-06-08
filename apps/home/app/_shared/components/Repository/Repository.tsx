import { Repo } from '@hamsurang/icon'

export interface RepositoryItem {
  id: number
  title: string
  category: string
  description: string
  url: string
}

export interface RepositoryProps {
  items: RepositoryItem[]
}

export const Repository = ({ items }: RepositoryProps) => {
  return (
    <ul className="flex flex-wrap p-4">
      {items.map((item) => (
        <li key={item.id} className="w-full md:w-1/2 p-2">
          <article className="p-4 h-full border rounded-lg flex flex-col justify-between">
            <div className="flex items-center pb-2 gap-2">
              <Repo />
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
