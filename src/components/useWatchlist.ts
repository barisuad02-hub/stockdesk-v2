'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import { useAuth } from './AuthProvider'

export function useWatchlist() {
  const { user } = useAuth()
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  // Stable supabase client
  const supabase = useMemo(() => createClient(), [])

  const fetchWatchlist = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('watchlist')
      .select('symbol')
      .eq('user_id', user.id)
    setWatchlist(data?.map(r => r.symbol) ?? [])
  }, [user, supabase])

  useEffect(() => { fetchWatchlist() }, [fetchWatchlist])

  const addToWatchlist = async (symbol: string, name: string, sector: string) => {
    if (!user) return
    setLoading(true)
    await supabase.from('watchlist').upsert({
      user_id: user.id, symbol, company_name: name, sector
    }, { onConflict: 'user_id,symbol' })
    setWatchlist(prev => [...prev, symbol])
    setLoading(false)
  }

  const removeFromWatchlist = async (symbol: string) => {
    if (!user) return
    setLoading(true)
    await supabase.from('watchlist').delete()
      .eq('user_id', user.id).eq('symbol', symbol)
    setWatchlist(prev => prev.filter(s => s !== symbol))
    setLoading(false)
  }

  const toggle = (symbol: string, name: string, sector: string) => {
    if (watchlist.includes(symbol)) removeFromWatchlist(symbol)
    else addToWatchlist(symbol, name, sector)
  }

  return { watchlist, loading, toggle, isWatched: (s: string) => watchlist.includes(s) }
}
