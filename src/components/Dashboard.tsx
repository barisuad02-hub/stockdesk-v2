'use client'
import { useState, useMemo } from 'react'
import {
  TrendingUp, TrendingDown, Search, Star, StarOff,
  BarChart2, Activity, LogOut, ChevronUp, ChevronDown,
  ArrowUpRight, ArrowDownRight, RefreshCw, X, Filter
} from 'lucide-react'
import { useAuth } from './AuthProvider'
import { useWatchlist } from './useWatchlist'
import AIAnalysisPanel from './AIAnalysisPanel'
import CandlestickChart from './CandlestickChart'
import Sparkline from './Sparkline'
import { DSE_STOCKS, MARKET_INDICES, SECTORS, generateCandleData, Stock } from '@/lib/stockData'

type Tab = 'market' | 'screener' | 'watchlist'
type SortField = 'price' | 'changePercent' | 'volume' | 'pe' | 'marketCap'
type SortDir = 'asc' | 'desc'

function fmt(n: number | null | undefined, suffix = '') {
  if (n == null) return '—'
  return n.toFixed(2) + suffix
}

function Badge({ positive }: { positive: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold"
      style={{ background: positive ? 'rgba(63,185,80,0.12)' : 'rgba(248,81,73,0.12)', color: positive ? '#3fb950' : '#f85149' }}>
      {positive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
    </span>
  )
}

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { toggle, isWatched, watchlist } = useWatchlist()
  const [tab, setTab] = useState<Tab>('market')
  const [selectedStock, setSelectedStock] = useState<Stock>(DSE_STOCKS[0])
  const [showDetail, setShowDetail] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const [sectorFilter, setSectorFilter] = useState('All')
  const [sortField, setSortField] = useState<SortField>('changePercent')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [chartPeriod, setChartPeriod] = useState<30 | 60 | 90 | 180>(90)
  const [showFilters, setShowFilters] = useState(false)

  const candleData = useMemo(() => generateCandleData(selectedStock.price, chartPeriod), [selectedStock.symbol, chartPeriod])

  const sortedFiltered = useMemo(() => {
    let stocks = DSE_STOCKS
    if (searchQ) stocks = stocks.filter(s => s.symbol.toLowerCase().includes(searchQ.toLowerCase()) || s.name.toLowerCase().includes(searchQ.toLowerCase()))
    if (sectorFilter !== 'All') stocks = stocks.filter(s => s.sector === sectorFilter)
    return [...stocks].sort((a, b) => {
      const av = a[sortField] as number ?? 0
      const bv = b[sortField] as number ?? 0
      return sortDir === 'asc' ? av - bv : bv - av
    })
  }, [searchQ, sectorFilter, sortField, sortDir])

  const watchlistStocks = DSE_STOCKS.filter(s => watchlist.includes(s.symbol))

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const openStock = (stock: Stock) => {
    setSelectedStock(stock)
    setShowDetail(true)
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronDown size={12} style={{ color: '#484f58' }} />
    return sortDir === 'desc' ? <ChevronDown size={12} style={{ color: '#00c389' }} /> : <ChevronUp size={12} style={{ color: '#00c389' }} />
  }

  const advanced = DSE_STOCKS.filter(s => s.changePercent > 0).length
  const declined = DSE_STOCKS.filter(s => s.changePercent < 0).length

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0d1117' }}>
      {/* Sidebar */}
      <aside className="flex flex-col w-56 flex-shrink-0" style={{ background: '#161b22', borderRight: '1px solid #21262d' }}>
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: '1px solid #21262d' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0" style={{ background: '#00c389', color: '#0d1117' }}>SD</div>
          <span className="font-bold text-xs tracking-widest" style={{ color: '#e6edf3', letterSpacing: '2.5px' }}>STOCKDESK</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {([
            { id: 'market', icon: <Activity size={16} />, label: 'Market' },
            { id: 'screener', icon: <BarChart2 size={16} />, label: 'Screener' },
            { id: 'watchlist', icon: <Star size={16} />, label: 'Watchlist' },
          ] as const).map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: tab === item.id ? 'rgba(0,195,137,0.1)' : 'transparent',
                color: tab === item.id ? '#00c389' : '#8b949e',
                border: tab === item.id ? '1px solid rgba(0,195,137,0.2)' : '1px solid transparent'
              }}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-3" style={{ borderTop: '1px solid #21262d' }}>
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: '#00c389', color: '#0d1117' }}>
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate" style={{ color: '#e6edf3' }}>{user?.email?.split('@')[0]}</div>
              <div className="text-xs truncate" style={{ color: '#484f58' }}>DSE Investor</div>
            </div>
            <button onClick={signOut} className="p-1 rounded transition-colors hover:opacity-70" style={{ color: '#484f58' }} title="Sign out">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top ticker bar */}
        <div className="flex items-center gap-6 px-6 py-3 flex-shrink-0 overflow-x-auto" style={{ background: '#161b22', borderBottom: '1px solid #21262d' }}>
          {MARKET_INDICES.map(idx => (
            <div key={idx.name} className="flex items-center gap-3 flex-shrink-0">
              <span className="text-xs font-bold tracking-wider" style={{ color: '#484f58' }}>{idx.name}</span>
              <span className="text-sm font-bold font-mono" style={{ color: '#e6edf3' }}>{idx.value.toLocaleString()}</span>
              <span className="text-xs font-semibold flex items-center gap-1"
                style={{ color: idx.changePercent >= 0 ? '#3fb950' : '#f85149' }}>
                {idx.changePercent >= 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                {Math.abs(idx.changePercent).toFixed(2)}%
              </span>
              <div className="w-px h-4" style={{ background: '#21262d' }} />
            </div>
          ))}
          <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
            <span className="w-2 h-2 rounded-full animate-pulse-slow" style={{ background: '#3fb950' }} />
            <span className="text-xs font-bold" style={{ color: '#3fb950' }}>MARKET OPEN</span>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-auto p-6">

          {/* ── MARKET TAB ── */}
          {tab === 'market' && (
            <div className="animate-fade-in space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold" style={{ color: '#e6edf3' }}>Market Overview</h1>
                <button className="flex items-center gap-1.5 text-xs" style={{ color: '#8b949e' }}>
                  <RefreshCw size={12} /> Live Data
                </button>
              </div>

              {/* Market stats */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Advanced', val: advanced, color: '#3fb950' },
                  { label: 'Declined', val: declined, color: '#f85149' },
                  { label: 'Unchanged', val: DSE_STOCKS.length - advanced - declined, color: '#8b949e' },
                  { label: 'Turnover', val: '৳8.2B', color: '#e6edf3' },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-4" style={{ background: '#161b22', border: '1px solid #21262d' }}>
                    <div className="text-xs uppercase tracking-widest mb-2" style={{ color: '#484f58' }}>{s.label}</div>
                    <div className="text-3xl font-bold" style={{ color: s.color }}>{s.val}</div>
                  </div>
                ))}
              </div>

              {/* Top movers */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: '🚀 Top Gainers', stocks: [...DSE_STOCKS].filter(s => s.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent).slice(0, 5) },
                  { title: '📉 Top Losers', stocks: [...DSE_STOCKS].filter(s => s.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent).slice(0, 5) },
                ].map(group => (
                  <div key={group.title} className="rounded-xl overflow-hidden" style={{ background: '#161b22', border: '1px solid #21262d' }}>
                    <div className="px-4 py-3 text-sm font-semibold" style={{ color: '#e6edf3', borderBottom: '1px solid #21262d' }}>
                      {group.title}
                    </div>
                    {group.stocks.map(s => (
                      <div key={s.symbol} className="flex items-center justify-between px-4 py-3 cursor-pointer transition-colors hover:bg-opacity-50"
                        style={{ borderBottom: '1px solid #21262d' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#1c2128')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        onClick={() => openStock(s)}>
                        <div>
                          <div className="text-sm font-semibold" style={{ color: '#e6edf3' }}>{s.symbol}</div>
                          <div className="text-xs mt-0.5" style={{ color: '#484f58' }}>{s.sector}</div>
                        </div>
                        <Sparkline changePercent={s.changePercent} />
                        <div className="text-right">
                          <div className="text-sm font-bold font-mono" style={{ color: '#e6edf3' }}>৳{s.price}</div>
                          <div className="text-xs font-bold" style={{ color: s.changePercent >= 0 ? '#3fb950' : '#f85149' }}>
                            {s.changePercent >= 0 ? '+' : ''}{s.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Sector heatmap */}
              <div className="rounded-xl p-4" style={{ background: '#161b22', border: '1px solid #21262d' }}>
                <div className="text-sm font-semibold mb-4" style={{ color: '#e6edf3' }}>Sector Performance</div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { name: 'Banking', change: -0.8, stocks: 43 },
                    { name: 'Pharma', change: 1.4, stocks: 28 },
                    { name: 'Telecom', change: 2.1, stocks: 8 },
                    { name: 'Electronics', change: -1.2, stocks: 15 },
                    { name: 'Textiles', change: 0.6, stocks: 52 },
                    { name: 'Energy', change: -0.3, stocks: 21 },
                    { name: 'Food', change: 0.9, stocks: 19 },
                    { name: 'Cement', change: -1.1, stocks: 14 },
                  ].map(sec => (
                    <div key={sec.name} className="rounded-lg p-3 transition-all"
                      style={{
                        background: sec.change >= 0 ? 'rgba(63,185,80,0.06)' : 'rgba(248,81,73,0.06)',
                        border: `1px solid ${sec.change >= 0 ? 'rgba(63,185,80,0.15)' : 'rgba(248,81,73,0.15)'}`
                      }}>
                      <div className="text-xs font-semibold mb-1" style={{ color: '#e6edf3' }}>{sec.name}</div>
                      <div className="text-base font-bold" style={{ color: sec.change >= 0 ? '#3fb950' : '#f85149' }}>
                        {sec.change >= 0 ? '+' : ''}{sec.change}%
                      </div>
                      <div className="text-xs mt-1" style={{ color: '#484f58' }}>{sec.stocks} stocks</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── SCREENER TAB ── */}
          {tab === 'screener' && !showDetail && (
            <div className="animate-fade-in space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold" style={{ color: '#e6edf3' }}>Stock Screener</h1>
                <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{ background: showFilters ? 'rgba(0,195,137,0.1)' : '#161b22', border: '1px solid #30363d', color: showFilters ? '#00c389' : '#8b949e' }}>
                  <Filter size={12} /> Filters
                </button>
              </div>

              {/* Search + filters */}
              <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-48">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#484f58' }} />
                  <input type="text" placeholder="Search stocks..." value={searchQ}
                    onChange={e => setSearchQ(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none"
                    style={{ background: '#161b22', border: '1px solid #30363d', color: '#e6edf3' }} />
                </div>
                <select value={sectorFilter} onChange={e => setSectorFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: '#161b22', border: '1px solid #30363d', color: '#8b949e' }}>
                  {SECTORS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              {/* Table */}
              <div className="rounded-xl overflow-hidden" style={{ background: '#161b22', border: '1px solid #21262d' }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: '1px solid #21262d' }}>
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#484f58' }}>Symbol</th>
                        <th className="text-right px-4 py-3 cursor-pointer text-xs font-semibold uppercase tracking-wider" style={{ color: sortField === 'price' ? '#00c389' : '#484f58' }} onClick={() => handleSort('price')}>
                          <span className="flex items-center justify-end gap-1">Price <SortIcon field="price" /></span>
                        </th>
                        <th className="text-right px-4 py-3 cursor-pointer text-xs font-semibold uppercase tracking-wider" style={{ color: sortField === 'changePercent' ? '#00c389' : '#484f58' }} onClick={() => handleSort('changePercent')}>
                          <span className="flex items-center justify-end gap-1">Chg% <SortIcon field="changePercent" /></span>
                        </th>
                        <th className="text-right px-4 py-3 cursor-pointer text-xs font-semibold uppercase tracking-wider hidden lg:table-cell" style={{ color: sortField === 'volume' ? '#00c389' : '#484f58' }} onClick={() => handleSort('volume')}>
                          <span className="flex items-center justify-end gap-1">Volume <SortIcon field="volume" /></span>
                        </th>
                        <th className="text-right px-4 py-3 cursor-pointer text-xs font-semibold uppercase tracking-wider hidden xl:table-cell" style={{ color: sortField === 'pe' ? '#00c389' : '#484f58' }} onClick={() => handleSort('pe')}>
                          <span className="flex items-center justify-end gap-1">P/E <SortIcon field="pe" /></span>
                        </th>
                        <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden xl:table-cell" style={{ color: '#484f58' }}>ROE%</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden xl:table-cell" style={{ color: '#484f58' }}>Div%</th>
                        <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#484f58' }}>7D</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {sortedFiltered.map(s => (
                        <tr key={s.symbol} className="cursor-pointer transition-colors"
                          style={{ borderBottom: '1px solid #21262d' }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#1c2128')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          onClick={() => openStock(s)}>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-sm" style={{ color: '#e6edf3' }}>{s.symbol}</div>
                            <div className="text-xs mt-0.5 truncate max-w-32" style={{ color: '#484f58' }}>{s.name}</div>
                          </td>
                          <td className="px-4 py-3 text-right font-bold font-mono text-sm" style={{ color: '#e6edf3' }}>৳{s.price}</td>
                          <td className="px-4 py-3 text-right">
                            <span className="font-bold text-sm flex items-center justify-end gap-1"
                              style={{ color: s.changePercent >= 0 ? '#3fb950' : '#f85149' }}>
                              {s.changePercent >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                              {s.changePercent >= 0 ? '+' : ''}{s.changePercent.toFixed(2)}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right text-xs font-mono hidden lg:table-cell" style={{ color: '#8b949e' }}>
                            {(s.volume / 1000).toFixed(0)}K
                          </td>
                          <td className="px-4 py-3 text-right text-xs hidden xl:table-cell" style={{ color: s.pe && s.pe < 15 ? '#3fb950' : s.pe && s.pe > 25 ? '#f85149' : '#8b949e' }}>
                            {fmt(s.pe)}x
                          </td>
                          <td className="px-4 py-3 text-right text-xs hidden xl:table-cell" style={{ color: s.roe && s.roe > 18 ? '#3fb950' : '#8b949e' }}>
                            {fmt(s.roe)}%
                          </td>
                          <td className="px-4 py-3 text-right text-xs hidden xl:table-cell" style={{ color: '#8b949e' }}>{fmt(s.dividendYield)}%</td>
                          <td className="px-4 py-3">
                            <Sparkline changePercent={s.changePercent} width={64} height={28} />
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={e => { e.stopPropagation(); toggle(s.symbol, s.name, s.sector) }}
                              className="p-1.5 rounded-lg transition-all"
                              style={{ color: isWatched(s.symbol) ? '#00c389' : '#484f58' }}>
                              {isWatched(s.symbol) ? <Star size={14} fill="#00c389" /> : <StarOff size={14} />}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {sortedFiltered.length === 0 && (
                    <div className="text-center py-12 text-sm" style={{ color: '#484f58' }}>No stocks found</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── STOCK DETAIL VIEW ── */}
          {tab === 'screener' && showDetail && (
            <div className="animate-fade-in space-y-5">
              {/* Back + header */}
              <div className="flex items-start justify-between">
                <div>
                  <button onClick={() => setShowDetail(false)} className="flex items-center gap-1.5 text-xs mb-3 transition-colors hover:opacity-70" style={{ color: '#8b949e' }}>
                    ← Back to screener
                  </button>
                  <div className="flex items-center gap-4">
                    <div>
                      <h2 className="text-2xl font-bold" style={{ color: '#e6edf3' }}>{selectedStock.symbol}</h2>
                      <p className="text-sm" style={{ color: '#8b949e' }}>{selectedStock.name} · {selectedStock.sector}</p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold font-mono" style={{ color: '#e6edf3' }}>৳{selectedStock.price}</div>
                      <div className="flex items-center gap-1.5 text-sm font-bold"
                        style={{ color: selectedStock.changePercent >= 0 ? '#3fb950' : '#f85149' }}>
                        {selectedStock.changePercent >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.change} ({selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                </div>
                <button onClick={() => toggle(selectedStock.symbol, selectedStock.name, selectedStock.sector)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: isWatched(selectedStock.symbol) ? 'rgba(0,195,137,0.1)' : '#161b22',
                    border: `1px solid ${isWatched(selectedStock.symbol) ? 'rgba(0,195,137,0.3)' : '#30363d'}`,
                    color: isWatched(selectedStock.symbol) ? '#00c389' : '#8b949e'
                  }}>
                  {isWatched(selectedStock.symbol) ? <Star size={14} fill="#00c389" /> : <StarOff size={14} />}
                  {isWatched(selectedStock.symbol) ? 'Watching' : 'Add to Watchlist'}
                </button>
              </div>

              {/* Key stats */}
              <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { label: '52W High', val: `৳${selectedStock.high52}` },
                  { label: '52W Low', val: `৳${selectedStock.low52}` },
                  { label: 'P/E', val: fmt(selectedStock.pe, 'x') },
                  { label: 'EPS', val: `৳${fmt(selectedStock.eps)}` },
                  { label: 'Mkt Cap', val: `৳${selectedStock.marketCap}` },
                  { label: 'Volume', val: `${(selectedStock.volume / 1000).toFixed(0)}K` },
                  { label: 'ROE', val: fmt(selectedStock.roe, '%') },
                  { label: 'D/E', val: fmt(selectedStock.debtEquity) },
                  { label: 'Div Yield', val: fmt(selectedStock.dividendYield, '%') },
                  { label: 'Rev Growth', val: fmt(selectedStock.revenueGrowth, '%') },
                  { label: 'RSI', val: selectedStock.rsi?.toString() ?? '—' },
                  { label: 'Support', val: `৳${selectedStock.support}` },
                ].map(stat => (
                  <div key={stat.label} className="rounded-lg p-3" style={{ background: '#161b22', border: '1px solid #21262d' }}>
                    <div className="text-xs uppercase tracking-wider mb-1.5" style={{ color: '#484f58' }}>{stat.label}</div>
                    <div className="text-sm font-bold font-mono" style={{ color: '#e6edf3' }}>{stat.val}</div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="rounded-xl overflow-hidden" style={{ background: '#161b22', border: '1px solid #21262d' }}>
                <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #21262d' }}>
                  <span className="text-sm font-semibold" style={{ color: '#e6edf3' }}>Price Chart</span>
                  <div className="flex gap-1">
                    {([30, 60, 90, 180] as const).map(p => (
                      <button key={p} onClick={() => setChartPeriod(p)}
                        className="px-3 py-1 rounded text-xs font-semibold transition-all"
                        style={{
                          background: chartPeriod === p ? '#00c389' : 'transparent',
                          color: chartPeriod === p ? '#0d1117' : '#8b949e',
                          border: `1px solid ${chartPeriod === p ? '#00c389' : '#30363d'}`
                        }}>
                        {p}D
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-4">
                  <CandlestickChart data={candleData} height={260} />
                </div>
              </div>

              {/* AI Analysis */}
              <AIAnalysisPanel stock={selectedStock} />
            </div>
          )}

          {/* ── WATCHLIST TAB ── */}
          {tab === 'watchlist' && (
            <div className="animate-fade-in space-y-4">
              <h1 className="text-lg font-semibold" style={{ color: '#e6edf3' }}>My Watchlist</h1>

              {watchlistStocks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl"
                  style={{ background: '#161b22', border: '1px solid #21262d' }}>
                  <Star size={40} style={{ color: '#21262d', marginBottom: 16 }} />
                  <p className="text-sm font-medium mb-1" style={{ color: '#e6edf3' }}>Your watchlist is empty</p>
                  <p className="text-xs" style={{ color: '#484f58' }}>Go to the Screener tab and click the ⭐ icon to add stocks</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {watchlistStocks.map(s => (
                    <div key={s.symbol} className="rounded-xl p-4 cursor-pointer transition-all hover:border-opacity-60"
                      style={{ background: '#161b22', border: '1px solid #21262d' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = '#30363d')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = '#21262d')}
                      onClick={() => { setTab('screener'); openStock(s) }}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="font-bold" style={{ color: '#e6edf3' }}>{s.symbol}</div>
                          <div className="text-xs mt-0.5" style={{ color: '#484f58' }}>{s.sector}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold font-mono" style={{ color: '#e6edf3' }}>৳{s.price}</div>
                          <div className="text-xs font-bold" style={{ color: s.changePercent >= 0 ? '#3fb950' : '#f85149' }}>
                            {s.changePercent >= 0 ? '+' : ''}{s.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                      <Sparkline changePercent={s.changePercent} width={200} height={40} />
                      <div className="flex items-center justify-between mt-3">
                        <div className="text-xs" style={{ color: '#484f58' }}>P/E {fmt(s.pe)}x · ROE {fmt(s.roe)}%</div>
                        <button onClick={e => { e.stopPropagation(); toggle(s.symbol, s.name, s.sector) }}
                          className="p-1 rounded transition-colors hover:opacity-70" style={{ color: '#f85149' }}>
                          <X size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
