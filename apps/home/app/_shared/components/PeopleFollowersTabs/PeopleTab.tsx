'use client'

import { FloatingArrow, arrow, autoUpdate, useFloating } from '@floating-ui/react'
import { Avatar, AvatarFallback, AvatarImage } from '@hamsurang/ui'
import { AnimatePresence, motion } from 'framer-motion'
import type { Route } from 'next'
import Link from 'next/link'
import { useRef } from 'react'
import { useTimeout } from 'react-use'
import { HAMSURANG_PEOPLE } from '../People/People.constants'

export const PeopleTab = () => {
  const arrowRef = useRef(null)
  const { refs, floatingStyles, context } = useFloating({
    middleware: [
      arrow({
        element: arrowRef,
      }),
    ],
    whileElementsMounted: autoUpdate,
  })
  const [isReady] = useTimeout(500)

  return (
    <>
      <div ref={refs.setPositionReference} className="flex flex-wrap gap-1">
        {HAMSURANG_PEOPLE.map(({ username }) => (
          <Link href={`/people?username=${username}` as Route} key={username}>
            <Avatar className="cursor-pointer">
              <AvatarImage
                src={`https://github.com/${username}.png?size=70`}
                alt={`${username}의 프로필`}
              />
              <AvatarFallback />
            </Avatar>
          </Link>
        ))}
      </div>

      <AnimatePresence>
        {isReady() && (
          <motion.div
            ref={refs.setFloating}
            style={floatingStyles}
            className="relative bg-black text-white p-4 mobile:hidden"
            initial={{ top: 0, opacity: 0 }}
            variants={{
              spring: {
                top: 30,
                transition: {
                  type: 'spring',
                  damping: 3,
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
    </>
  )
}
