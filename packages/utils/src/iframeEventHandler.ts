import { URL } from '@hamsurang/constants'

type MessageData = {
  type: 'routeChange'
  route: string
}

const isValidEventOrigin = (origin: string) => {
  return Object.values(URL).includes(origin)
}

export const onMessageHandler = (event: MessageEvent<MessageData>) => {
  if (!isValidEventOrigin(event.origin)) {
    return
  }

  const { data } = event

  if (data.type === 'routeChange') {
    history.replaceState({}, '', data.route)
  }
}

export const postMessageToParent = (data: MessageData) => {
  switch (data.type) {
    case 'routeChange':
      parent.postMessage({ type: data.type, route: data.route }, URL.ROOT)
      break

    default:
      break
  }
}
