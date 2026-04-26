'use client'
import { useMemo } from 'react'

interface Props {
  changePercent: number
  width?: number
  height?: number
}

export default function Sparkline({ changePercent, width = 80, height = 32 }: Props) {
  const points = useMemo(() => {
    const pts: number[] = []
    let v = 50
    const bias = changePercent > 0 ? 0.55 : 0.45
    for (let i = 0; i < 20; i++) {
      v += (Math.random() > bias ? 1 : -1) * Math.random() * 6
      v = Math.max(10, Math.min(90, v))
      pts.push(v)
    }
    return pts
  }, [changePercent])

  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1

  const svgPoints = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width
    const y = height - ((p - min) / range) * (height - 4) - 2
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')

  const color = changePercent >= 0 ? '#3fb950' : '#f85149'

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline points={svgPoints} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
