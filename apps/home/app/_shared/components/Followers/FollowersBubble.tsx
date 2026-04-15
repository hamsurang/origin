'use client'

import { useEffect, useRef, useState } from 'react'
import type { GitHubFollower } from '../../../lib/github/types'
import { type PackedCircle, packCircles } from './circle-pack'
import type { FollowersBubbleProps } from './Followers.types'

export const FollowersBubble = ({ followers }: FollowersBubbleProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [circles, setCircles] = useState<PackedCircle[]>([])
  const [size, setSize] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) {
      return
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) {
        return
      }
      const width = entry.contentRect.width
      setSize(width)
      setCircles(packCircles(width, followers.length))
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [followers.length])

  return (
    <div
      ref={containerRef}
      className="relative w-full mx-auto"
      style={{ maxWidth: 560, aspectRatio: '1', clipPath: 'circle(50%)' }}
    >
      {size > 0 &&
        circles.map((circle) => {
          const follower = followers[circle.index] as GitHubFollower | undefined
          if (!follower) {
            return null
          }

          return (
            <a
              key={follower.login}
              href={follower.html_url}
              target="_blank"
              rel="noreferrer"
              title={follower.login}
              className="absolute rounded-full overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-110 hover:ring-2 hover:ring-blue-600 hover:z-10"
              style={{
                left: circle.x - circle.r,
                top: circle.y - circle.r,
                width: circle.r * 2,
                height: circle.r * 2,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              <img
                src={`${follower.avatar_url}&s=${Math.ceil(circle.r * 4)}`}
                alt={follower.login}
                className="w-full h-full object-cover rounded-full"
                loading="lazy"
              />
            </a>
          )
        })}
    </div>
  )
}
