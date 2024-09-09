import { URL } from '@hamsurang/constants'
import type {
  ChildrenTitle,
  MessageData,
  MessageDataToChildren,
  MessageDataToParent,
} from './iframeEventHandler.types'

export const isValidEventOrigin = (origin: string) => {
  return Object.values(URL).includes(origin)
}

const getChildIframe = (title: ChildrenTitle) => {
  const child = document.querySelector(`iframe[title=${title}]`) as HTMLIFrameElement | null
  return child?.contentWindow
}

const postMessage = (data: MessageData) => {
  switch (data.type) {
    case 'routeChange':
      parent.postMessage({ type: data.type, route: data.route }, URL.ROOT)
      break
    case 'navigate':
      getChildIframe(data.title)?.postMessage({ type: data.type, route: data.route }, URL.HOME)
      break

    default:
      throw new Error('Invalid message type')
  }
}

export const postMessageToParent = (data: MessageDataToParent) => postMessage(data)
export const postMessageToChildren = (data: MessageDataToChildren) => postMessage(data)
