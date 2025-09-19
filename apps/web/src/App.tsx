import { useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useAppStore } from './store/useAppStore'
import Onboarding from './pages/Onboarding'
import Chat from './pages/Chat'

function Shell() {
  const location = useLocation()
  const navigate = useNavigate()
  const hasOnboarded = useAppStore((s) => s.hasOnboarded)

  useEffect(() => {
    if (!hasOnboarded && location.pathname !== '/onboarding') {
      navigate('/onboarding', { replace: true })
    }
  }, [hasOnboarded, location.pathname, navigate])

  return (
    <div className="min-h-screen bg-surface-light text-white dark:bg-surface">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="inline-block h-6 w-6 rounded bg-brand" />
            <h1 className="text-lg font-semibold tracking-tight">ChefMate</h1>
          </div>
          <div className="text-sm opacity-80">Your conversational cooking assistant</div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/" element={<Chat />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return <Shell />
}
