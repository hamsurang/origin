'use client'

import { type ReactNode, useState } from 'react'
import { HAMSURANG_PEOPLE } from '../People/People.constants'

type Tab = 'people' | 'followers'

type Props = {
  peopleSlot: ReactNode
  followersSlot: ReactNode
  followersCount: number
}

export const PeopleFollowersTabs = ({ peopleSlot, followersSlot, followersCount }: Props) => {
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
          {followersCount > 0 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
              {followersCount}
            </span>
          )}
        </button>
      </div>

      <div className="relative mt-3">
        {activeTab === 'people' && peopleSlot}
        {activeTab === 'followers' && followersSlot}
      </div>
    </div>
  )
}
