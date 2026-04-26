export interface Stock {
  symbol: string
  name: string
  sector: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: string
  pe: number | null
  eps: number | null
  high52: number
  low52: number
  roe: number | null
  debtEquity: number | null
  dividendYield: number | null
  revenueGrowth: number | null
  rsi?: number
  macd?: number
  sma20?: number
  sma50?: number
  support?: number
  resistance?: number
}

export interface MarketIndex {
  name: string
  value: number
  change: number
  changePercent: number
}

export interface CandleData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// Simulated DSE market data
export const DSE_STOCKS: Stock[] = [
  {
    symbol: 'GRAMEENPH', name: 'Grameenphone Ltd.', sector: 'Telecom',
    price: 332.50, change: 5.40, changePercent: 1.65, volume: 892340,
    marketCap: '239B', pe: 14.2, eps: 23.4, high52: 389, low52: 280,
    roe: 42.5, debtEquity: 0.3, dividendYield: 5.8, revenueGrowth: 8.2,
    rsi: 58, macd: 1.2, sma20: 325, sma50: 318, support: 315, resistance: 345
  },
  {
    symbol: 'BRACBANK', name: 'BRAC Bank Ltd.', sector: 'Banking',
    price: 56.80, change: -1.20, changePercent: -2.07, volume: 2341800,
    marketCap: '61B', pe: 9.8, eps: 5.8, high52: 72, low52: 46,
    roe: 14.2, debtEquity: 8.1, dividendYield: 3.5, revenueGrowth: 12.4,
    rsi: 42, macd: -0.4, sma20: 58, sma50: 62, support: 54, resistance: 62
  },
  {
    symbol: 'SQURPHARMA', name: 'Square Pharmaceuticals', sector: 'Pharma',
    price: 212.40, change: 3.10, changePercent: 1.48, volume: 445600,
    marketCap: '164B', pe: 17.5, eps: 12.1, high52: 240, low52: 182,
    roe: 22.8, debtEquity: 0.1, dividendYield: 4.2, revenueGrowth: 15.6,
    rsi: 62, macd: 0.8, sma20: 208, sma50: 200, support: 200, resistance: 225
  },
  {
    symbol: 'WALTONHIL', name: 'Walton Hi-Tech Industries', sector: 'Electronics',
    price: 1245.70, change: -22.30, changePercent: -1.76, volume: 98200,
    marketCap: '85B', pe: 22.1, eps: 56.4, high52: 1520, low52: 980,
    roe: 18.5, debtEquity: 0.4, dividendYield: 2.1, revenueGrowth: 22.3,
    rsi: 38, macd: -5.2, sma20: 1270, sma50: 1310, support: 1200, resistance: 1320
  },
  {
    symbol: 'DUTCHBANGL', name: 'Dutch-Bangla Bank Ltd.', sector: 'Banking',
    price: 88.30, change: 0.80, changePercent: 0.91, volume: 1876400,
    marketCap: '53B', pe: 7.6, eps: 11.6, high52: 105, low52: 74,
    roe: 16.8, debtEquity: 7.4, dividendYield: 6.2, revenueGrowth: 9.8,
    rsi: 51, macd: 0.2, sma20: 87, sma50: 85, support: 82, resistance: 95
  },
  {
    symbol: 'BEXIMCO', name: 'Beximco Ltd.', sector: 'Conglomerate',
    price: 127.60, change: 2.80, changePercent: 2.24, volume: 3298000,
    marketCap: '112B', pe: 19.3, eps: 6.6, high52: 155, low52: 98,
    roe: 8.4, debtEquity: 1.8, dividendYield: 1.8, revenueGrowth: 5.6,
    rsi: 65, macd: 1.5, sma20: 122, sma50: 115, support: 115, resistance: 140
  },
  {
    symbol: 'RENATA', name: 'Renata Ltd.', sector: 'Pharma',
    price: 1388.00, change: 14.00, changePercent: 1.02, volume: 54700,
    marketCap: '120B', pe: 25.7, eps: 54.0, high52: 1450, low52: 1120,
    roe: 31.2, debtEquity: 0.2, dividendYield: 3.8, revenueGrowth: 18.4,
    rsi: 55, macd: 2.1, sma20: 1370, sma50: 1340, support: 1320, resistance: 1450
  },
  {
    symbol: 'ISLAMIBANK', name: 'Islami Bank Bangladesh', sector: 'Banking',
    price: 32.50, change: -0.60, changePercent: -1.81, volume: 4120000,
    marketCap: '66B', pe: 6.4, eps: 5.1, high52: 41, low52: 28,
    roe: 12.1, debtEquity: 9.2, dividendYield: 4.5, revenueGrowth: 7.2,
    rsi: 35, macd: -0.3, sma20: 33.5, sma50: 35.2, support: 30, resistance: 36
  },
  {
    symbol: 'CITYBANK', name: 'The City Bank Ltd.', sector: 'Banking',
    price: 24.80, change: 0.40, changePercent: 1.64, volume: 3456000,
    marketCap: '28B', pe: 5.9, eps: 4.2, high52: 32, low52: 20,
    roe: 13.5, debtEquity: 7.8, dividendYield: 5.1, revenueGrowth: 11.3,
    rsi: 48, macd: 0.1, sma20: 24.2, sma50: 23.8, support: 22, resistance: 28
  },
  {
    symbol: 'SINGERBD', name: 'Singer Bangladesh Ltd.', sector: 'Electronics',
    price: 198.20, change: -3.60, changePercent: -1.78, volume: 221400,
    marketCap: '23B', pe: 16.8, eps: 11.8, high52: 245, low52: 168,
    roe: 19.4, debtEquity: 0.6, dividendYield: 3.2, revenueGrowth: 4.8,
    rsi: 40, macd: -1.2, sma20: 202, sma50: 208, support: 185, resistance: 215
  },
  {
    symbol: 'OLYMPIC', name: 'Olympic Industries Ltd.', sector: 'Food',
    price: 145.60, change: 1.90, changePercent: 1.32, volume: 678900,
    marketCap: '42B', pe: 21.4, eps: 6.8, high52: 168, low52: 118,
    roe: 25.6, debtEquity: 0.3, dividendYield: 4.8, revenueGrowth: 14.2,
    rsi: 60, macd: 0.7, sma20: 142, sma50: 138, support: 135, resistance: 158
  },
  {
    symbol: 'LAFARGECEM', name: 'LafargeHolcim Bangladesh', sector: 'Cement',
    price: 78.40, change: -0.90, changePercent: -1.14, volume: 1234500,
    marketCap: '52B', pe: 18.2, eps: 4.3, high52: 95, low52: 62,
    roe: 10.8, debtEquity: 0.9, dividendYield: 2.8, revenueGrowth: 6.4,
    rsi: 44, macd: -0.3, sma20: 80, sma50: 82, support: 74, resistance: 86
  },
]

export const MARKET_INDICES: MarketIndex[] = [
  { name: 'DSEX', value: 5230.45, change: -41.03, changePercent: -0.78 },
  { name: 'DS30', value: 1892.10, change: 12.30, changePercent: 0.65 },
  { name: 'DSES', value: 1140.20, change: -8.70, changePercent: -0.76 },
]

export const SECTORS = ['All', 'Banking', 'Pharma', 'Telecom', 'Electronics', 'Food', 'Cement', 'Conglomerate']

export function generateCandleData(basePrice: number, days: number = 90): CandleData[] {
  const candles: CandleData[] = []
  let price = basePrice * 0.85
  const now = new Date()

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    if (date.getDay() === 0 || date.getDay() === 6) continue

    const change = (Math.random() - 0.48) * price * 0.025
    const open = price
    const close = Math.max(price + change, 1)
    const high = Math.max(open, close) * (1 + Math.random() * 0.012)
    const low = Math.min(open, close) * (1 - Math.random() * 0.012)
    const volume = Math.floor(Math.random() * 2000000 + 500000)

    candles.push({
      date: date.toISOString().split('T')[0],
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
      volume
    })
    price = close
  }
  return candles
}
