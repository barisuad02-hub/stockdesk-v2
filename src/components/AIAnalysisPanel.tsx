'use client'
import { useState } from 'react'
import { Bot, ChevronDown, Loader2, TrendingUp, BarChart2, Layers } from 'lucide-react'
import { Stock } from '@/lib/stockData'

interface Props { stock: Stock }

type AnalysisType = 'fundamental' | 'technical' | 'combined'

const ANALYSIS_OPTIONS: { type: AnalysisType; label: string; icon: React.ReactNode; desc: string }[] = [
  { type: 'fundamental', label: 'Fundamental', icon: <TrendingUp size={14} />, desc: 'Valuation, financials, business quality' },
  { type: 'technical', label: 'Technical', icon: <BarChart2 size={14} />, desc: 'Price action, indicators, entry/exit' },
  { type: 'combined', label: 'Full Analysis', icon: <Layers size={14} />, desc: 'Complete fundamental + technical report' },
]

function parseMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    if (line.startsWith('### ')) {
      return <h3 key={i} className="text-xs font-bold uppercase tracking-widest mt-5 mb-2 pb-1" style={{ color: '#00c389', borderBottom: '1px solid #21262d' }}>{line.slice(4)}</h3>
    }
    if (line.startsWith('## ')) {
      return <h2 key={i} className="text-sm font-bold mt-4 mb-2" style={{ color: '#e6edf3' }}>{line.slice(3)}</h2>
    }
    if (line.startsWith('- ')) {
      const content = line.slice(2)
      return (
        <li key={i} className="ml-4 mb-1 text-sm" style={{ color: '#c9d1d9', listStyle: 'disc' }}>
          {renderInline(content)}
        </li>
      )
    }
    if (line.trim() === '') return <div key={i} className="h-1" />
    return <p key={i} className="text-sm mb-1" style={{ color: '#c9d1d9', lineHeight: 1.6 }}>{renderInline(line)}</p>
  })
}

function renderInline(text: string): React.ReactNode {
  // Bold text
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: '#e6edf3', fontWeight: 600 }}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

export default function AIAnalysisPanel({ stock }: Props) {
  const [analysisType, setAnalysisType] = useState<AnalysisType>('combined')
  const [analysis, setAnalysis] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showTypeMenu, setShowTypeMenu] = useState(false)

  const selectedOption = ANALYSIS_OPTIONS.find(o => o.type === analysisType)!

  const runAnalysis = async () => {
    setLoading(true)
    setError('')
    setAnalysis('')
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: stock.symbol, stockData: stock, analysisType })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setAnalysis(data.analysis)
    } catch (err) {
      setError('Analysis failed. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#161b22', border: '1px solid #21262d' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid #21262d' }}>
        <div className="flex items-center gap-2">
          <Bot size={16} style={{ color: '#00c389' }} />
          <span className="font-semibold text-sm" style={{ color: '#e6edf3' }}>AI Analysis</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(0,195,137,0.1)', color: '#00c389' }}>claude-sonnet-4-5</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Analysis type selector */}
          <div className="relative">
            <button
              onClick={() => setShowTypeMenu(!showTypeMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: '#0d1117', border: '1px solid #30363d', color: '#8b949e' }}
            >
              {selectedOption.icon}
              {selectedOption.label}
              <ChevronDown size={12} />
            </button>
            {showTypeMenu && (
              <div className="absolute right-0 top-8 z-20 rounded-lg overflow-hidden shadow-xl" style={{ background: '#1c2128', border: '1px solid #30363d', minWidth: 200 }}>
                {ANALYSIS_OPTIONS.map(opt => (
                  <button
                    key={opt.type}
                    onClick={() => { setAnalysisType(opt.type); setShowTypeMenu(false); setAnalysis('') }}
                    className="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-opacity-50"
                    style={{ background: analysisType === opt.type ? 'rgba(0,195,137,0.08)' : 'transparent', borderBottom: '1px solid #21262d' }}
                  >
                    <span style={{ color: '#00c389', marginTop: 1 }}>{opt.icon}</span>
                    <div>
                      <div className="text-xs font-semibold" style={{ color: analysisType === opt.type ? '#00c389' : '#e6edf3' }}>{opt.label}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#484f58' }}>{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={runAnalysis}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-opacity"
            style={{ background: '#00c389', color: '#0d1117', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? <Loader2 size={12} className="animate-spin" /> : <Bot size={12} />}
            {loading ? 'Analyzing...' : 'Run Analysis'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5" style={{ minHeight: 200 }}>
        {!analysis && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(0,195,137,0.08)', border: '1px solid rgba(0,195,137,0.15)' }}>
              <Bot size={22} style={{ color: '#00c389' }} />
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: '#e6edf3' }}>Ready to analyze {stock.symbol}</p>
            <p className="text-xs" style={{ color: '#484f58' }}>
              Select analysis type and click <strong style={{ color: '#8b949e' }}>Run Analysis</strong> for AI-powered insights
            </p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Loader2 size={28} className="animate-spin mb-4" style={{ color: '#00c389' }} />
            <p className="text-sm" style={{ color: '#8b949e' }}>
              Analyzing {stock.symbol} — {selectedOption.label} report...
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg text-sm" style={{ background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.2)', color: '#f85149' }}>
            {error}
          </div>
        )}

        {analysis && !loading && (
          <div className="animate-fade-in">
            {parseMarkdown(analysis)}
          </div>
        )}
      </div>
    </div>
  )
}
