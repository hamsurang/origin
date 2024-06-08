import Link from 'next/link'

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
    <ol className="flex flex-wrap p-4">
      {items.map((item) => (
        <li key={item.id} className="w-full md:w-1/2 p-2">
          <article className="p-4 h-full border rounded-lg flex flex-col justify-between">
            <div className="flex items-center pb-2">
              <Link
                href={item.url}
                className="font-bold text-blue-500 break-all"
                aria-label={item.title}
              >
                {item.title}
              </Link>
              <span className="bg-gray-200 text-gray-700 text-xs font-semibold ml-2 px-2.5 py-0.5 rounded">
                {item.category}
              </span>
            </div>
            <p className="text-gray-600 text-sm">{item.description}</p>
          </article>
        </li>
      ))}
    </ol>
  )
}
