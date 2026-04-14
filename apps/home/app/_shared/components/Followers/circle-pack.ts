export type PackedCircle = {
  x: number
  y: number
  r: number
  index: number
}

export function assignRadius(count: number): number[] {
  return Array.from({ length: count }, (_, i) => {
    if (i < Math.ceil(count * 0.06)) {
      return 42
    }
    if (i < Math.ceil(count * 0.18)) {
      return 32
    }
    if (i < Math.ceil(count * 0.42)) {
      return 24
    }
    return 18
  })
}

function hasOverlap(circles: PackedCircle[], x: number, y: number, r: number): boolean {
  for (const c of circles) {
    const d = Math.sqrt((x - c.x) ** 2 + (y - c.y) ** 2)
    if (d < r + c.r - 0.5) {
      return true
    }
  }
  return false
}

export function packCircles(containerSize: number, count: number): PackedCircle[] {
  const radii = assignRadius(count)
  const cx = containerSize / 2
  const cy = containerSize / 2
  const boundary = containerSize / 2

  const circles: PackedCircle[] = []

  for (let i = 0; i < count; i++) {
    const r = radii[i] ?? 18
    let placed = false
    let attempts = 0

    while (!placed && attempts < 2000) {
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
      // Spiral outward until a non-overlapping position is found
      let spiralAngle = i * ((Math.PI * 2) / count)
      let spiralDist = 0
      const step = r * 0.5
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
      // Last resort: place at boundary even if overlapping
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
