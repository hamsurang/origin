'use client'

import { useState } from 'react'
import type { Route } from 'next'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@hamsurang/ui'
import type { GitHubFollower } from '../../../lib/github/types'
import { HAMSURANG_PEOPLE } from '../People/People.constants'
import { FollowersBubble } from '../Followers/FollowersBubble'

type Tab = 'people' | 'followers'

type Props = {
  followers: GitHubFollower[]
}

export const PeopleFollowersTabs = ({ followers }: Props) => {
  const [activeTab, setActiveTab] = useState<Tab>('people')

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
          <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
            {followers.length}
          </span>
        </button>
      </div>

      <div className="mt-3">
        {activeTab === 'people' && (
          <div className="flex flex-wrap gap-1">
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
        )}

        {activeTab === 'followers' && (
          <div>
            <FollowersBubble followers={followers} />
            <div className="mt-4 text-center">
              <a
                href="https://github.com/hamsurang"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors"
              >
                <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current" aria-label="GitHub">
                  <title>GitHub</title>
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                Follow Us
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
