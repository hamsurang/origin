export type Category = 'Blog' | 'Github' | 'Social' | 'Others' | 'Repo'

export type RepositoryItem = {
  id: number
  title: string
  category: Category
  description: string
  url: string
  tag?: string
}

export type RepositoryProps = {
  items: RepositoryItem[]
}
