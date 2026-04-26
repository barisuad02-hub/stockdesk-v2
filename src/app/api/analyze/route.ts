import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { symbol, stockData, analysisType } = await req.json()

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey || apiKey === 'placeholder_add_your_key') {
      return NextResponse.json({
        analysis: generateFallbackAnalysis(symbol, stockData, analysisType)
      })
    }

    const prompt = buildPrompt(symbol, stockData, analysisType)

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1200,
        system: `You are an expert financial analyst specializing in Bangladesh's Dhaka Stock Exchange (DSE). 
You provide clear, actionable analysis for retail investors. 
Always structure your response with clear sections using ### headers.
Use 🟢 for bullish signals and 🔴 for bearish signals.
Be concise but thorough. Target beginner-to-intermediate investors.`,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`Anthropic API error: ${response.status} ${err}`)
    }

    const data = await response.json()
    const analysis = data.content?.[0]?.text || 'Analysis unavailable.'

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('AI analysis error:', error)
    const { symbol, stockData, analysisType } = await req.json().catch(() => ({}))
    return NextResponse.json({
      analysis: generateFallbackAnalysis(symbol || 'Unknown', stockData || {}, analysisType || 'combined')
    })
  }
}

function buildPrompt(symbol: string, stock: Record<string, unknown>, type: string): string {
  const changePercent = Number(stock.changePercent)
  const base = `Analyze **${symbol}** (${stock.name}) listed on DSE Bangladesh.

**Market Data:**
- Current Price: ৳${stock.price}
- Day Change: ${changePercent > 0 ? '+' : ''}${changePercent}%
- 52-Week Range: ৳${stock.low52} – ৳${stock.high52}
- Volume: ${Number(stock.volume).toLocaleString()}
- Market Cap: ৳${stock.marketCap}
- Sector: ${stock.sector}`

  const fundamentals = `

**Fundamental Data:**
- P/E Ratio: ${stock.pe || 'N/A'}
- EPS: ৳${stock.eps || 'N/A'}
- ROE: ${stock.roe || 'N/A'}%
- Debt/Equity: ${stock.debtEquity || 'N/A'}
- Dividend Yield: ${stock.dividendYield || 'N/A'}%
- Revenue Growth (YoY): ${stock.revenueGrowth || 'N/A'}%`

  const technicals = `

**Technical Indicators:**
- RSI (14): ${stock.rsi || 'N/A'}
- MACD: ${stock.macd || 'N/A'}
- SMA 20: ৳${stock.sma20 || 'N/A'}
- SMA 50: ৳${stock.sma50 || 'N/A'}
- Support Level: ৳${stock.support || 'N/A'}
- Resistance Level: ৳${stock.resistance || 'N/A'}`

  if (type === 'fundamental') {
    return `${base}${fundamentals}

Provide a **fundamental analysis** covering:
### Business Overview
Brief description of the company and its competitive position.

### Valuation Assessment
Is the stock fairly valued, overvalued, or undervalued? Compare P/E to sector average.

### Financial Health
Analyze ROE, debt levels, dividend sustainability, and revenue growth.

### Key Risks
Top 3 fundamental risks for this investment.

### Fundamental Verdict
🟢 BUY / 🔴 SELL / 🟡 HOLD with a 12-month price target range.`
  }

  if (type === 'technical') {
    return `${base}${technicals}

Provide a **technical analysis** covering:
### Price Action
Current trend, momentum, and recent price behavior.

### Indicator Signals
Interpret RSI, MACD, and moving averages. What are they signaling?

### Key Levels
Identify critical support/resistance levels and what a break means.

### Entry & Exit Strategy
Suggested entry price range, stop-loss level, and profit target.

### Technical Verdict
🟢 BULLISH / 🔴 BEARISH / 🟡 NEUTRAL with short-term outlook (1–4 weeks).`
  }

  // Combined analysis
  return `${base}${fundamentals}${technicals}

Provide a **comprehensive analysis** covering:
### Market Position
Company overview and competitive standing in DSE.

### Fundamental Strengths & Weaknesses
Key financial metrics and what they reveal.

### Technical Picture
Current momentum, trend, and key price levels.

### Bull Case 🟢
Top 3 reasons to be bullish on this stock.

### Bear Case 🔴
Top 3 risks or reasons for caution.

### Investment Verdict
Clear recommendation: BUY / SELL / HOLD with price target and time horizon.`
}

function generateFallbackAnalysis(symbol: string, stock: Record<string, unknown>, type: string): string {
  const isPositive = Number(stock.changePercent) >= 0
  const rsi = Number(stock.rsi) || 50
  const rsiSignal = rsi > 70 ? 'overbought' : rsi < 30 ? 'oversold' : 'neutral'
  const trend = Number(stock.price) > Number(stock.sma50) ? 'uptrend' : 'downtrend'

  if (type === 'technical') {
    return `### Price Action
${symbol} is currently in a **${trend}**, trading ${isPositive ? 'above' : 'below'} its 50-day moving average. The ${isPositive ? 'positive' : 'negative'} day change suggests ${isPositive ? 'buying' : 'selling'} pressure.

### Indicator Signals
🟡 **RSI at ${rsi}** — ${rsiSignal === 'overbought' ? '🔴 Overbought, potential pullback ahead' : rsiSignal === 'oversold' ? '🟢 Oversold, potential bounce candidate' : '🟡 In neutral zone, no extreme readings'}
**MACD**: ${Number(stock.macd) >= 0 ? '🟢 Positive, momentum is bullish' : '🔴 Negative, bearish momentum'}
**SMA 20 vs 50**: ${Number(stock.sma20) > Number(stock.sma50) ? '🟢 Short-term MA above long-term — bullish cross' : '🔴 Short-term MA below long-term — bearish signal'}

### Key Levels
- **Support**: ৳${stock.support} — critical floor, watch for bounces here
- **Resistance**: ৳${stock.resistance} — key ceiling, breakout above would be bullish

### Entry & Exit Strategy
- **Entry zone**: ৳${Number(stock.support) * 1.01} – ৳${Number(stock.sma20)}
- **Stop-loss**: ৳${Number(stock.support) * 0.97} (below support)
- **Target**: ৳${stock.resistance}

### Technical Verdict
${rsi < 40 ? '🟢 **BULLISH** — Oversold conditions suggest potential recovery' : rsi > 65 ? '🔴 **CAUTION** — Extended rally, consider waiting for pullback' : '🟡 **NEUTRAL** — No strong directional signal, range-bound trading expected'}`
  }

  if (type === 'fundamental') {
    const pe = Number(stock.pe)
    const roe = Number(stock.roe)
    return `### Business Overview
${stock.name} is a ${stock.sector} sector company listed on the Dhaka Stock Exchange (DSE). It operates in one of Bangladesh's key economic segments.

### Valuation Assessment
**P/E Ratio: ${pe || 'N/A'}** — ${pe < 10 ? '🟢 Below market average, potentially undervalued' : pe > 25 ? '🔴 Premium valuation, growth must justify price' : '🟡 Fair valuation relative to sector peers'}
The stock's 52-week range (৳${stock.low52}–৳${stock.high52}) shows ${((Number(stock.price) - Number(stock.low52)) / (Number(stock.high52) - Number(stock.low52)) * 100).toFixed(0)}% of the annual range.

### Financial Health
- **ROE ${roe}%**: ${roe > 20 ? '🟢 Excellent capital efficiency' : roe > 12 ? '🟡 Adequate returns' : '🔴 Below-average profitability'}
- **Revenue Growth ${stock.revenueGrowth}%**: ${Number(stock.revenueGrowth) > 10 ? '🟢 Strong growth trajectory' : '🟡 Moderate growth'}
- **Dividend Yield ${stock.dividendYield}%**: ${Number(stock.dividendYield) > 4 ? '🟢 Attractive income for investors' : '🟡 Modest dividend'}

### Key Risks
1. **Market Risk**: DSE volatility and Bangladesh macro environment
2. **Sector Risk**: ${stock.sector}-specific regulatory and competitive pressures
3. **Currency Risk**: Taka depreciation impact on import-dependent operations

### Fundamental Verdict
${roe > 18 && pe < 20 ? '🟢 **BUY** — Strong fundamentals at reasonable valuation' : pe > 28 ? '🟡 **HOLD** — Good company but valuation is stretched' : '🟡 **HOLD** — Monitor next quarterly results before adding position'}
**12-month target range**: ৳${(Number(stock.price) * 0.9).toFixed(0)} – ৳${(Number(stock.price) * 1.2).toFixed(0)}`
  }

  return `### Market Position
${stock.name} (${symbol}) is a ${stock.sector} company on DSE. Current price ৳${stock.price} (${isPositive ? '+' : ''}${stock.changePercent}% today).

### Fundamental Strengths & Weaknesses
**Strengths**: ${Number(stock.roe) > 15 ? 'Strong ROE of ' + stock.roe + '%' : 'Established market presence'}, ${Number(stock.dividendYield) > 3 ? 'attractive dividend yield of ' + stock.dividendYield + '%' : 'sector leadership position'}
**Weaknesses**: ${Number(stock.pe) > 22 ? 'Premium valuation (P/E ' + stock.pe + ')' : 'Limited near-term catalysts visible'}

### Technical Picture
${trend === 'uptrend' ? '🟢 Price above 50-SMA — uptrend intact' : '🔴 Price below 50-SMA — downtrend in place'}. RSI at ${rsi} is ${rsiSignal}.

### Bull Case 🟢
1. ${Number(stock.roe) > 15 ? 'High ROE (' + stock.roe + '%) shows efficient management' : 'Sector tailwinds from Bangladesh economic growth'}
2. ${Number(stock.dividendYield) > 3 ? 'Dividend yield of ' + stock.dividendYield + '% provides income cushion' : '52-week low at ৳' + stock.low52 + ' provides downside reference'}
3. ${Number(stock.revenueGrowth) > 8 ? 'Revenue growing ' + stock.revenueGrowth + '% — momentum building' : 'Brand strength in domestic market'}

### Bear Case 🔴
1. RSI of ${rsi} ${rsi > 60 ? 'suggests extended move, pullback risk' : 'indicates weak momentum'}
2. ${Number(stock.pe) > 20 ? 'P/E of ' + stock.pe + 'x leaves limited margin of safety' : 'Banking sector headwinds from rising NPLs'}
3. DSE market-wide selling pressure if DSEX continues decline

### Investment Verdict
${Number(stock.roe) > 18 && rsi < 55 ? '🟢 **BUY** — Good fundamentals + reasonable technicals. Accumulate near ৳' + stock.support : rsi > 65 ? '🟡 **HOLD** — Strong company but wait for technical pullback to ৳' + stock.sma20 + ' before adding' : '🟡 **HOLD** — Monitor for trend confirmation. Key level: ৳' + stock.resistance}
**Price Target**: ৳${(Number(stock.price) * 1.15).toFixed(0)} (12 months) | **Stop-loss**: ৳${(Number(stock.support) * 0.97).toFixed(0)}`
}
