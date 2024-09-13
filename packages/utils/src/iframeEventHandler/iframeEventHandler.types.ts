export type ChildrenTitle = 'home' | 'wiki'

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
