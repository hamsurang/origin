'use client'

import { Heart, People as PeopleIcon } from '@hamsurang/icon'
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
          <PeopleIcon width={16} height={16} className="fill-current" aria-hidden="true" />
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
          <Heart width={16} height={16} className="fill-current" aria-hidden="true" />
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
