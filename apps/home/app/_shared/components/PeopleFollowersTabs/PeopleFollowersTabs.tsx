'use client'

import { FloatingArrow, arrow, autoUpdate, useFloating } from '@floating-ui/react'
import { Avatar, AvatarFallback, AvatarImage } from '@hamsurang/ui'
import { AnimatePresence, motion } from 'framer-motion'
import type { Route } from 'next'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useTimeout } from 'react-use'
import type { GitHubFollower } from '../../../lib/github/types'
import { HAMSURANG_PEOPLE } from '../People/People.constants'
import { FEATURED_FOLLOWERS } from '../Followers/Followers.constants'
import { FollowersBubble } from '../Followers/FollowersBubble'

type Tab = 'people' | 'followers'

function sortWithFeatured(
  followers: GitHubFollower[],
  featuredUsernames: readonly string[],
): { sorted: GitHubFollower[]; featuredCount: number } {
  const featured: GitHubFollower[] = []
  const rest: GitHubFollower[] = []

  const featuredSet = new Set(featuredUsernames.map((u) => u.toLowerCase()))
  for (const f of followers) {
    if (featuredSet.has(f.login.toLowerCase())) {
      featured.push(f)
      featuredSet.delete(f.login.toLowerCase())
    } else {
      rest.push(f)
    }
  }

  // Fill missing featured slots with random followers
  const missing = featuredUsernames.length - featured.length
  for (let i = 0; i < missing && rest.length > 0; i++) {
    const randomIdx = Math.floor(Math.random() * rest.length)
    featured.push(rest.splice(randomIdx, 1)[0] as GitHubFollower)
  }

  return { sorted: [...featured, ...rest], featuredCount: featured.length }
}

export const PeopleFollowersTabs = () => {
  const [activeTab, setActiveTab] = useState<Tab>('people')
  const [followers, setFollowers] = useState<GitHubFollower[]>([])
  const [featuredCount, setFeaturedCount] = useState(0)
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

  useEffect(() => {
    fetch('https://api.github.com/users/hamsurang/followers?per_page=100')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: GitHubFollower[]) => {
        const { sorted, featuredCount: fc } = sortWithFeatured(data, FEATURED_FOLLOWERS)
        setFollowers(sorted)
        setFeaturedCount(fc)
      })
      .catch(() => setFollowers([]))
  }, [])

  return (
    <div>
      <div className="flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('people')}
          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'people'
              ? 'border-[#fd8c73] text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M2 5.5a3.5 3.5 0 115.898 2.549 5.508 5.508 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416.672v.352a.75.75 0 00.574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 101.434-.44 5.01 5.01 0 00-2.56-3.012A3 3 0 0011 4z" />
          </svg>
          People
          <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
            {HAMSURANG_PEOPLE.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('followers')}
          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'followers'
              ? 'border-[#fd8c73] text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.565 20.565 0 008 13.393a20.561 20.561 0 003.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.75.75 0 01-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5z" />
          </svg>
          Followers
          {followers.length > 0 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
              {followers.length}
            </span>
          )}
        </button>
      </div>

      <div className="relative mt-3">
        {activeTab === 'people' && (
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
        )}

        {activeTab === 'followers' && (
          <div>
            {followers.length > 0 ? (
              <>
                <FollowersBubble followers={followers.slice(0, 30)} featuredCount={featuredCount} />
                <div className="mt-3 text-center">
                  <a
                    href="https://github.com/hamsurang"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-md hover:bg-gray-700 transition-colors"
                  >
                    <svg viewBox="0 0 16 16" className="w-3 h-3 fill-current" aria-label="GitHub">
                      <title>GitHub</title>
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                    Follow Us
                  </a>
                </div>
              </>
            ) : (
              <div className="h-[200px] animate-pulse bg-gray-50 rounded-md" />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
