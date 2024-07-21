export const MBTIGraph = ({
  mbtiInfos,
}: {
  mbtiInfos: { value: string; percent: number }[]
}) => {
  const numAxes = mbtiInfos.length
  const angleStep = (2 * Math.PI) / numAxes

  const points = mbtiInfos.map(({ percent }, index) => {
    const angle = index * angleStep - Math.PI / 2
    const x = (0.5 + (percent / 100) * 0.4 * Math.cos(angle)) * 100
    const y = (0.5 + (percent / 100) * 0.4 * Math.sin(angle)) * 100
    return { x, y }
  })

  const pointString = points.map((point) => `${point.x},${point.y}`).join(' ')

  return (
    <div className="flex items-center justify-center w-[50%]">
      <svg width="300" height="300" viewBox="0 0 100 100" className="radar-chart">
        <title>MBTI Graph</title>
        <line
          strokeWidth="0.7"
          strokeLinecap="round"
          className="stroke-primary"
          x1="10"
          y1="50"
          x2="90"
          y2="50"
        />
        <line
          strokeWidth="0.7"
          strokeLinecap="round"
          className="stroke-primary"
          x1="50"
          y1="10"
          x2="50"
          y2="90"
        />

        <polygon
          points={pointString}
          className="fill-[#40c46380]"
          style={{
            fill: '',
          }}
        />

        {points.map((point, index) => (
          <circle
            // biome-ignore lint:
            key={index}
            cx={point.x}
            cy={point.y}
            r="1"
            className="fill-white stroke-primary"
            strokeWidth={0.7}
          />
        ))}

        {mbtiInfos.map(({ percent, value }, index) => {
          const angle = index * angleStep - Math.PI / 2
          const x = (0.5 + 0.45 * Math.cos(angle)) * 100
          const y = (0.5 + 0.45 * Math.sin(angle)) * 100

          return (
            <text
              key={value}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="3"
            >
              <tspan x={x} dy="0" fontSize={4}>
                {value}
              </tspan>
              <tspan x={x} dy="4">
                {percent} %
              </tspan>
            </text>
          )
        })}
      </svg>
    </div>
  )
}
