#!/bin/bash
# ============================================================
# STOCKDESK v2 - One-command GitHub push + Vercel deploy
# ============================================================
# Usage: bash PUSH_TO_GITHUB.sh YOUR_GITHUB_TOKEN
# Get token: github.com → Settings → Developer settings → Personal access tokens
# Required scopes: repo (full control)

set -e

TOKEN=$1

if [ -z "$TOKEN" ]; then
  echo "❌ Usage: bash PUSH_TO_GITHUB.sh YOUR_GITHUB_TOKEN"
  echo ""
  echo "Get a token at: github.com/settings/tokens/new"
  echo "Required scope: repo"
  exit 1
fi

echo "🚀 Pushing STOCKDESK v2 to GitHub..."

# Set remote with token
git remote set-url origin "https://barisuad02-hub:${TOKEN}@github.com/barisuad02-hub/stockdesk-v2.git"

# Push
git push -u origin main --force

echo ""
echo "✅ Code pushed to GitHub!"
echo ""
echo "📋 Next: Add secrets in GitHub repo settings:"
echo "   github.com/barisuad02-hub/stockdesk-v2/settings/secrets/actions"
echo ""
echo "   VERCEL_TOKEN        → From vercel.com/account/tokens"  
echo "   VERCEL_ORG_ID       → team_U8XmOhVSU9ehD5Ejk67EbnQi"
echo "   VERCEL_PROJECT_ID   → (create new project on vercel.com)"
echo ""
echo "Then go to github.com/barisuad02-hub/stockdesk-v2/actions"
echo "and trigger the deploy workflow."
echo ""
echo "OR: Import directly at vercel.com/new and it will auto-deploy!"
