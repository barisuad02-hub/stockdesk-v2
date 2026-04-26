# STOCKDESK v2 — Deployment Guide

Follow these steps exactly to get your app live.

---

## Step 1: Get Your Anthropic API Key

1. Go to https://console.anthropic.com
2. Click **API Keys** → **Create Key**
3. Copy the key (starts with `sk-ant-...`)

---

## Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Name it `stockdesk-v2`
3. Set to **Public** (or Private)
4. Do NOT initialize with README
5. Click **Create repository**

---

## Step 3: Push Code to GitHub

Unzip the downloaded `stockdesk-v2.zip`, then:

```bash
cd stockdesk-v2
git init
git add -A
git commit -m "feat: STOCKDESK v2 initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/stockdesk-v2.git
git push -u origin main
```

---

## Step 4: Deploy on Vercel

### Option A: Vercel Dashboard (Easiest)

1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Select your `stockdesk-v2` repo
4. Click **Deploy** — it auto-detects Next.js

### Option B: Vercel CLI

```bash
npm install -g vercel
vercel login
cd stockdesk-v2
vercel deploy --prod
```

---

## Step 5: Set Environment Variables in Vercel

After deploy, go to:
**Vercel Dashboard → stockdesk-v2 → Settings → Environment Variables**

Add these three:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://oqjqvjtlrkqcllxlrqtd.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your full anon key) |
| `ANTHROPIC_API_KEY` | `sk-ant-...` (your key from Step 1) |

Then go to **Deployments** → click the latest deployment → **Redeploy**.

---

## Step 6: Enable Supabase Auth Email Confirmations (Optional)

By default, Supabase requires email confirmation. To disable for testing:

1. Go to https://supabase.com → your project
2. **Authentication** → **Email** → **Disable "Confirm email"**

Or just check your email after signup and click the confirmation link.

---

## Step 7: Test Your Live App

1. Visit your Vercel URL (e.g. `stockdesk-v2.vercel.app`)
2. Sign up with your email
3. Explore Market Overview, Screener, and Watchlist tabs
4. Click any stock → scroll down → Run AI Analysis
5. Try all three analysis types: Fundamental, Technical, Full Analysis

---

## Your Supabase Project

- **Dashboard**: https://supabase.com/dashboard/project/oqjqvjtlrkqcllxlrqtd
- **URL**: `https://oqjqvjtlrkqcllxlrqtd.supabase.co`
- **Tables created**: `profiles`, `watchlist`, `ai_analyses`, `search_history`

---

## Troubleshooting

**AI analysis returns generic text, not Claude response**
→ Check that `ANTHROPIC_API_KEY` is correctly set in Vercel env vars and redeployed

**Login not working**
→ Check Supabase auth settings, make sure email confirmation is disabled or confirm your email

**Build fails on Vercel**
→ Make sure Node.js version is 18+ in Vercel project settings
