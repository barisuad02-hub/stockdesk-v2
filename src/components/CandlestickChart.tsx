'use client'
import { useMemo } from 'react'
import { CandleData } from '@/lib/stockData'

interface Props {
  data: CandleData[]
  height?: number
}

export default function CandlestickChart({ data, height = 240 }: Props) {
  const { candles, minP, maxP, svgW, svgH, padL, padR, padT, padB } = useMemo(() => {
    const svgW = 600
    const svgH = height
    const padL = 44
    const padR = 12
    const padT = 12
    const padB = 28

    if (!data.length) return { candles: [], minP: 0, maxP: 0, svgW, svgH, padL, padR, padT, padB }

    const prices = data.flatMap(c => [c.high, c.low])
    const minP = Math.min(...prices) * 0.997
    const maxP = Math.max(...prices) * 1.003

    const chartW = svgW - padL - padR
    const chartH = svgH - padT - padB
    const candleW = Math.max(chartW / data.length - 1, 2)

    const scaleY = (p: number) => padT + chartH - ((p - minP) / (maxP - minP)) * chartH
    const scaleX = (i: number) => padL + i * (chartW / data.length) + (chartW / data.length) / 2

    const candles = data.map((c, i) => ({
      ...c,
      cx: scaleX(i),
      bodyTop: scaleY(Math.max(c.open, c.close)),
      bodyBot: scaleY(Math.min(c.open, c.close)),
      highY: scaleY(c.high),
      lowY: scaleY(c.low),
      bullish: c.close >= c.open,
      width: candleW,
    }))

    return { candles, minP, maxP, svgW, svgH, padL, padR, padT, padB }
  }, [data, height])

  if (!data.length) return (
    <div className="flex items-center justify-center text-sm" style={{ height, color: '#484f58' }}>
      No chart data available
    </div>
  )

  const chartH = svgH - padT - padB
  const gridLines = 4

  // X-axis labels: show every ~20 candles
  const xLabels = candles.filter((_, i) => i % Math.floor(candles.length / 5) === 0 || i === candles.length - 1)

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${svgW} ${svgH}`}
      preserveAspectRatio="none"
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* Grid lines */}
      {Array.from({ length: gridLines + 1 }).map((_, i) => {
        const t = i / gridLines
        const y = padT + t * chartH
        const price = maxP - t * (maxP - minP)
        return (
          <g key={i}>
            <line x1={padL} x2={svgW - padR} y1={y} y2={y}
              stroke="#21262d" strokeWidth="1" strokeDasharray={i === 0 || i === gridLines ? '0' : '3,4'} />
            <text x={padL - 5} y={y + 4} fontSize="9" fill="#484f58" textAnchor="end" fontFamily="monospace">
              {price.toFixed(price > 100 ? 0 : 1)}
            </text>
          </g>
        )
      })}

      {/* Candles */}
      {candles.map((c, i) => {
        const color = c.bullish ? '#3fb950' : '#f85149'
        const bodyH = Math.max(c.bodyBot - c.bodyTop, 1)
        return (
          <g key={i}>
            {/* Wick */}
            <line x1={c.cx} x2={c.cx} y1={c.highY} y2={c.lowY}
              stroke={color} strokeWidth="1" />
            {/* Body */}
            <rect
              x={c.cx - c.width * 0.4}
              y={c.bodyTop}
              width={c.width * 0.8}
              height={bodyH}
              fill={color}
              opacity={0.9}
            />
          </g>
        )
      })}

      {/* X-axis labels */}
      {xLabels.map((c) => (
        <text key={c.date} x={c.cx} y={svgH - 6} fontSize="9" fill="#484f58" textAnchor="middle" fontFamily="monospace">
          {c.date.slice(5)}
        </text>
      ))}
    </svg>
  )
}
