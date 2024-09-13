import { Repository } from './Repository'
import type { RepositoryProps } from './Repository.types'

export const RepositoryList = ({ items }: RepositoryProps) => {
  return (
    <ul className="grid grid-cols-2 gap-2 mobile:grid-cols-1">
      {items.map((item) => (
        <Repository key={item.id} {...item} />
      ))}
    </ul>
  )
}
