'use client'
import { AuthProvider, useAuth } from '@/components/AuthProvider'
import LoginPage from '@/components/LoginPage'
import Dashboard from '@/components/Dashboard'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d1117' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm animate-pulse"
            style={{ background: '#00c389', color: '#0d1117' }}>SD</div>
          <div className="w-5 h-5 border-2 rounded-full animate-spin"
            style={{ borderColor: '#21262d', borderTopColor: '#00c389' }} />
        </div>
      </div>
    )
  }

  if (!user) return <LoginPage />
  return <Dashboard />
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
