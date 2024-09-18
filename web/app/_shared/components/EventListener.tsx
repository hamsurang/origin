'use client'

import { type MessageData, isValidEventOrigin } from '@hamsurang/utils'
import { useEffect } from 'react'

export const EventListener = () => {
  useEffect(() => {
    const handleIncomingMessage = ({ origin, data }: MessageEvent<MessageData>) => {
      if (!isValidEventOrigin(origin)) {
        return
      }

      if (data.type === 'routeChange') {
        history.replaceState({}, '', data.route)
      }
    }

    addEventListener('message', handleIncomingMessage)

    return () => {
      removeEventListener('message', handleIncomingMessage)
    }
  }, [])

  return null
}
