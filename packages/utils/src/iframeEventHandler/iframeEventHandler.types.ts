type NavigateOptions = {
  scroll?: boolean
}
type PrefetchOptions = {
  kind: PrefetchKind
}
enum PrefetchKind {
  AUTO = 'auto',
  FULL = 'full',
  TEMPORARY = 'temporary',
}

export interface AppRouterInstance {
  back(): void
  forward(): void
  refresh(): void
  push(href: string, options?: NavigateOptions): void
  replace(href: string, options?: NavigateOptions): void
  prefetch(href: string, options?: PrefetchOptions): void
}

export type ChildrenTitle = 'home' | 'activity'

export type MessageDataToParent = {
  type: 'routeChange'
  route: string
}
export type MessageDataToChildren = {
  title: ChildrenTitle
  type: 'navigate'
  route: string
}
export type MessageData = MessageDataToParent | MessageDataToChildren
