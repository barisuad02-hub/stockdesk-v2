# STOCKDESK v2 — DSE Market Intelligence Terminal

AI-powered stock research terminal for Bangladesh's Dhaka Stock Exchange (DSE).

## Features

- **Market Overview** — Live DSEX/DS30/DSES indices, sector heatmap, top gainers & losers
- **Stock Screener** — Sortable/filterable table of 12 DSE stocks with full detail view
- **Candlestick Charts** — Interactive SVG price charts with 30D/60D/90D/180D periods
- **AI Analysis** — Claude claude-sonnet-4-5 powered fundamental, technical, and combined analysis
- **Watchlist** — Supabase-persisted watchlist per user
- **Auth** — Supabase email/password authentication with persistent sessions

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Auth + DB | Supabase (PostgreSQL + RLS) |
| AI | Anthropic Claude claude-sonnet-4-5 |
| Deployment | Vercel |

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/barisuad02-hub/stockdesk-v2.git
cd stockdesk-v2
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://oqjqvjtlrkqcllxlrqtd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel deploy --prod
```

Add environment variables in Vercel Dashboard → Project Settings → Environment Variables.

## Database Schema (already applied to Supabase)

- `profiles` — user profiles (auto-created on signup)
- `watchlist` — per-user stock watchlist
- `ai_analyses` — cached AI analysis results (6h TTL)
- `search_history` — user search history

## Project Structure

```
src/
├── app/
│   ├── api/analyze/route.ts   # AI analysis API endpoint
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               # Entry point
├── components/
│   ├── AuthProvider.tsx        # Supabase auth context
│   ├── Dashboard.tsx           # Main app shell + all tabs
│   ├── LoginPage.tsx           # Auth UI
│   ├── AIAnalysisPanel.tsx     # Claude AI analysis
│   ├── CandlestickChart.tsx    # SVG candlestick chart
│   ├── Sparkline.tsx           # Mini sparkline chart
│   └── useWatchlist.ts         # Watchlist Supabase hook
└── lib/
    ├── stockData.ts            # DSE stock data + types
    └── supabase.ts             # Supabase client
```

## Owner

Mohammad Shahjalal Bari — University of Dhaka  
[barisuad02@gmail.com](mailto:barisuad02@gmail.com)
