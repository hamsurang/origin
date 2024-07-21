import { Book, Github, Globe, Link, Repo } from '@hamsurang/icon'
import type { Category, RepositoryItem } from './Repository.types'

export const Repository = (item: RepositoryItem) => {
  return (
    <li key={item.id} className="w-[49%] md:w-1/2">
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
            {item?.tag || item.category}
          </span>
        </div>
        <p className="text-gray-600 text-sm">{item.description}</p>
      </article>
    </li>
  )
}

const categoryIconMap: { [key in Category]: JSX.Element } = {
  Blog: <Book />,
  Github: <Github />,
  Social: <Globe />,
  Others: <Link />,
  Repo: <Repo />,
}
