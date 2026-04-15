export type PackedCircle = {
  x: number
  y: number
  r: number
  index: number
}

export function assignRadius(count: number, featuredCount = 0): number[] {
  return Array.from({ length: count }, (_, i) => {
    if (i < featuredCount) {
      return 46
    }
    const remaining = count - featuredCount
    const ri = i - featuredCount
    if (ri < Math.ceil(remaining * 0.08)) {
      return 36
    }
    if (ri < Math.ceil(remaining * 0.24)) {
      return 28
    }
    if (ri < Math.ceil(remaining * 0.48)) {
      return 22
    }
    if (ri < Math.ceil(remaining * 0.76)) {
      return 16
    }
    return 10
  })
}

function hasOverlap(circles: PackedCircle[], x: number, y: number, r: number): boolean {
  for (const c of circles) {
    const d = Math.sqrt((x - c.x) ** 2 + (y - c.y) ** 2)
    if (d < r + c.r - 0.2) {
      return true
    }
  }
  return false
}

export function packCircles(
  containerSize: number,
  count: number,
  featuredCount = 0,
): PackedCircle[] {
  const radii = assignRadius(count, featuredCount)
  const cx = containerSize / 2
  const cy = containerSize / 2
  const boundary = containerSize / 2

  const circles: PackedCircle[] = []

  for (let i = 0; i < count; i++) {
    const r = radii[i] ?? 10
    let placed = false
    let attempts = 0

    while (!placed && attempts < 3000) {
      const angle = Math.random() * Math.PI * 2
      const maxDist = boundary - r
      const dist = Math.random() * maxDist
      const x = cx + Math.cos(angle) * dist
      const y = cy + Math.sin(angle) * dist

      const distFromCenter = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
      if (distFromCenter + r > boundary + r * 0.3) {
        attempts++
        continue
      }

      if (!hasOverlap(circles, x, y, r)) {
        circles.push({ x, y, r, index: i })
        placed = true
      }
      attempts++
    }

    if (!placed) {
      let spiralAngle = i * ((Math.PI * 2) / count)
      let spiralDist = 0
      const step = r * 0.4
      while (spiralDist <= boundary) {
        const x = cx + Math.cos(spiralAngle) * spiralDist
        const y = cy + Math.sin(spiralAngle) * spiralDist
        if (!hasOverlap(circles, x, y, r)) {
          circles.push({ x, y, r, index: i })
          placed = true
          break
        }
        spiralDist += step
        spiralAngle += 0.3
      }
    }

    if (!placed) {
      const angle = i * ((Math.PI * 2) / count)
      const dist = boundary * 0.6
      circles.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        r,
        index: i,
      })
    }
  }

  return circles
}
