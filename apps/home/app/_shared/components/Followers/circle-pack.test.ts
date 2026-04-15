import { describe, expect, it } from 'vitest'
import { packCircles, assignRadius } from './circle-pack'

describe('assignRadius', () => {
  it('assigns larger radii to earlier items', () => {
    const radii = assignRadius(50)
    const first = radii[0]
    const last = radii[49]
    expect(first).toBeDefined()
    expect(last).toBeDefined()
    expect(first).toBeGreaterThan(last as number)
  })

  it('returns correct number of radii', () => {
    expect(assignRadius(5)).toHaveLength(5)
    expect(assignRadius(50)).toHaveLength(50)
  })

  it('has 6 distinct tiers for large counts', () => {
    const radii = assignRadius(100)
    const unique = [...new Set(radii)]
    expect(unique).toHaveLength(6)
    expect(unique).toEqual([46, 36, 28, 22, 16, 10])
  })
})

describe('packCircles', () => {
  it('returns positioned circles for all items', () => {
    const result = packCircles(400, 10)
    expect(result).toHaveLength(10)
    for (const c of result) {
      expect(c).toHaveProperty('x')
      expect(c).toHaveProperty('y')
      expect(c).toHaveProperty('r')
      expect(c).toHaveProperty('index')
    }
  })

  it('no circles overlap', () => {
    const circles = packCircles(400, 30)
    for (let i = 0; i < circles.length; i++) {
      for (let j = i + 1; j < circles.length; j++) {
        const a = circles[i]
        const b = circles[j]
        if (!a || !b) {
          continue
        }
        const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
        expect(dist).toBeGreaterThanOrEqual(a.r + b.r - 1)
      }
    }
  })

  it('all circles stay within the container bounds', () => {
    const size = 400
    const circles = packCircles(size, 20)
    const cx = size / 2
    const cy = size / 2
    const boundary = size / 2

    for (const c of circles) {
      const dist = Math.sqrt((c.x - cx) ** 2 + (c.y - cy) ** 2)
      expect(dist + c.r).toBeLessThanOrEqual(boundary + c.r * 0.5)
    }
  })
})
