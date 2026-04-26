'use client'
import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { TrendingUp, Lock, Mail, User, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    if (mode === 'login') {
      const { error } = await signIn(email, password)
      if (error) setError(error)
    } else {
      if (!name.trim()) { setError('Please enter your name.'); setLoading(false); return }
      const { error } = await signUp(email, password, name)
      if (error) setError(error)
      else setSuccess('Account created! Check your email to confirm, then sign in.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0d1117' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12" style={{ background: '#161b22', borderRight: '1px solid #21262d' }}>
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm" style={{ background: '#00c389', color: '#0d1117' }}>SD</div>
            <span className="font-bold tracking-widest text-sm" style={{ color: '#e6edf3', letterSpacing: '3px' }}>STOCKDESK</span>
          </div>
          <h1 className="text-4xl font-light mb-6" style={{ color: '#e6edf3', lineHeight: 1.2 }}>
            Bangladesh's Premier<br />
            <span style={{ color: '#00c389' }}>Stock Intelligence</span><br />
            Terminal
          </h1>
          <p className="text-base mb-12" style={{ color: '#8b949e', lineHeight: 1.7 }}>
            AI-powered fundamental & technical analysis. Real-time DSE market data. Built for serious investors.
          </p>
          <div className="grid grid-cols-3 gap-6">
            {[
              { val: 'Claude AI', label: 'AI Engine' },
              { val: 'DSE Live', label: 'Market Data' },
              { val: '320+', label: 'Stocks Tracked' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-2xl font-bold mb-1" style={{ color: '#00c389' }}>{s.val}</div>
                <div className="text-xs uppercase tracking-widest" style={{ color: '#484f58' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-xs" style={{ color: '#484f58' }}>
          © 2026 STOCKDESK · Mohammad Shahjalal Bari, University of Dhaka
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-xs" style={{ background: '#00c389', color: '#0d1117' }}>SD</div>
            <span className="font-bold tracking-widest text-sm" style={{ color: '#e6edf3' }}>STOCKDESK</span>
          </div>

          <h2 className="text-2xl font-semibold mb-1" style={{ color: '#e6edf3' }}>
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-sm mb-8" style={{ color: '#8b949e' }}>
            {mode === 'login' ? 'Sign in to your terminal' : 'Start your investment journey'}
          </p>

          <form onSubmit={handle} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: '#8b949e' }}>Full Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#484f58' }} />
                  <input
                    type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Mohammad Bari"
                    className="w-full pl-9 pr-4 py-3 rounded-lg text-sm outline-none transition-all"
                    style={{ background: '#161b22', border: '1px solid #30363d', color: '#e6edf3' }}
                    onFocus={e => { e.target.style.borderColor = '#00c389' }}
                    onBlur={e => { e.target.style.borderColor = '#30363d' }}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: '#8b949e' }}>Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#484f58' }} />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-4 py-3 rounded-lg text-sm outline-none transition-all"
                  style={{ background: '#161b22', border: '1px solid #30363d', color: '#e6edf3' }}
                  onFocus={e => { e.target.style.borderColor = '#00c389' }}
                  onBlur={e => { e.target.style.borderColor = '#30363d' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: '#8b949e' }}>Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#484f58' }} />
                <input
                  type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-3 rounded-lg text-sm outline-none transition-all"
                  style={{ background: '#161b22', border: '1px solid #30363d', color: '#e6edf3' }}
                  onFocus={e => { e.target.style.borderColor = '#00c389' }}
                  onBlur={e => { e.target.style.borderColor = '#30363d' }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#484f58' }}>
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg text-sm" style={{ background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.25)', color: '#f85149' }}>
                <AlertCircle size={14} className="flex-shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 rounded-lg text-sm" style={{ background: 'rgba(0,195,137,0.1)', border: '1px solid rgba(0,195,137,0.25)', color: '#00c389' }}>
                {success}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-sm transition-opacity"
              style={{ background: '#00c389', color: '#0d1117', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 rounded-full inline-block animate-spin" style={{ borderColor: '#0d1117', borderTopColor: 'transparent' }}></span>
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm" style={{ color: '#8b949e' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess('') }}
              className="font-semibold" style={{ color: '#00c389' }}>
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </div>

          <p className="mt-8 text-xs text-center" style={{ color: '#484f58' }}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
