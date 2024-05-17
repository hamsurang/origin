'use client'

import { FloatingArrow, arrow, useFloating } from '@floating-ui/react'
import { Avatar, AvatarFallback, AvatarImage } from '@ui/components'
import { AnimatePresence, motion } from 'framer-motion'
import { useRef } from 'react'
import { useTimeout } from 'react-use'
import { 클라이머 } from './People.constants'

export const People = () => {
  const arrowRef = useRef(null)
  const { refs, floatingStyles, context } = useFloating({
    middleware: [
      arrow({
        element: arrowRef,
      }),
    ],
  })
  const [isReady] = useTimeout(500)

  return (
    <div className="mb-3 py-3 border-top">
      <a
        className="hover:underline"
        href="https://github.com/orgs/hamsurang/people"
        target="_blank"
        rel="noreferrer"
      >
        People
      </a>

      <div ref={refs.setReference} className="flex flex-wrap mt-3 gap-1">
        {클라이머.map(({ name, username }) => (
          <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer" key={name}>
            <Avatar>
              <AvatarImage src={`https://github.com/${username}.png?size=70`} alt="" />
              <AvatarFallback />
            </Avatar>
          </a>
        ))}
      </div>

      <AnimatePresence>
        {isReady() && (
          <motion.div
            ref={refs.setFloating}
            style={floatingStyles}
            className="relative bg-black text-white p-4"
            initial={{ top: 0, opacity: 0 }}
            variants={{
              spring: {
                top: 30,
                transition: {
                  type: 'spring',
                  damping: 3,
                  // Stiffness of the spring. Higher values will create more sudden movement. Set to 100 by default.
                  stiffness: 200,
                },
              },
              fadeIn: {
                opacity: 1,
                transition: {
                  duration: 0.5,
                },
              },
            }}
            animate={['spring', 'fadeIn']}
          >
            show more information
            <FloatingArrow ref={arrowRef} context={context} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
