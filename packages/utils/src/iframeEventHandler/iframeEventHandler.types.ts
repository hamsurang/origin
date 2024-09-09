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
