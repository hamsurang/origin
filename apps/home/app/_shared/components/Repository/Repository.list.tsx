import { Repository } from './Repository'
import type { RepositoryProps } from './Repository.types'

export const RepositoryList = ({ items }: RepositoryProps) => {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Repository key={item.id} {...item} />
      ))}
    </ul>
  )
}
