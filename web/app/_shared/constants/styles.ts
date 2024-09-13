import type { CSSProperties } from 'react'

const GLOBAL_NAVBAR_HEIGHT = '84px'

export const IFRAME_STYLE: CSSProperties = {
  width: '100%',
  height: `calc(100vh - ${GLOBAL_NAVBAR_HEIGHT})`,
  paddingBottom: '1rem',
}
