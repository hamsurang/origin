export type ChildrenTitle = 'home' | 'wiki'

export type MessageDataToParent = {
  type: 'routeChange'
  route: string
}
export type MessageDataToChildren = {
  title: ChildrenTitle
  type: 'navigate'
  route: string
  targetOrigin: string
}
export type MessageData = MessageDataToParent | MessageDataToChildren
