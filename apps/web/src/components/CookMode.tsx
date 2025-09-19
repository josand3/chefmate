import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Recommendation } from '../services/recommend'

type Props = {
  rec: Recommendation
  onClose: () => void
}

export default function CookMode({ rec, onClose }: Props) {
  const steps = useMemo(() => rec.recipe.steps, [rec])
  const [idx, setIdx] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (running) {
      timerRef.current = window.setInterval(() => {
        setSeconds((s) => s + 1)
      }, 1000)
    }
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [running])

  const toggleTimer = () => setRunning((r) => !r)
  const resetTimer = () => setSeconds(0)

  const next = () => {
    setIdx((i) => Math.min(i + 1, steps.length - 1))
    setSeconds(0)
  }
  const prev = () => {
    setIdx((i) => Math.max(i - 1, 0))
    setSeconds(0)
  }

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl rounded-t-2xl border border-white/10 bg-surface-light text-white shadow-xl sm:rounded-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div>
            <div className="text-sm opacity-70">Cook Mode</div>
            <h3 className="text-lg font-semibold">{rec.recipe.title}</h3>
          </div>
          <button onClick={onClose} className="rounded-md border border-white/10 px-3 py-1 text-sm hover:border-white/20">Exit</button>
        </div>

        <div className="grid gap-4 p-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <div className="mb-2 text-xs opacity-70">Step {idx + 1} of {steps.length}</div>
            <div className="min-h-[140px] rounded-lg border border-white/10 bg-white/5 p-4 text-base leading-relaxed">
              {steps[idx]}
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button onClick={prev} disabled={idx === 0} className="rounded-md border border-white/10 px-3 py-2 text-sm disabled:opacity-50 hover:border-white/20">Prev</button>
                <button onClick={next} disabled={idx === steps.length - 1} className="rounded-md border border-white/10 px-3 py-2 text-sm disabled:opacity-50 hover:border-white/20">Next</button>
              </div>
              <div className="text-xs opacity-80">
                {rec.recipe.mealType} • {rec.recipe.timeMinutes ?? 0}m • {Math.round(rec.matchPercent * 100)}% match
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="mb-2 text-sm font-medium">⏱️ Step Timer</div>
            <div className="mb-3 text-3xl tabular-nums">{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</div>
            <div className="flex items-center gap-2">
              <button onClick={toggleTimer} className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-black hover:bg-accent/90">
                {running ? 'Pause' : 'Start'}
              </button>
              <button onClick={resetTimer} className="rounded-md border border-white/10 px-3 py-2 text-sm hover:border-white/20">Reset</button>
            </div>

            <div className="mt-5 text-sm">
              <div className="mb-1 font-medium">Tips 👨‍🍳</div>
              <ul className="list-disc space-y-1 pl-5 opacity-90">
                <li>Read the next step before proceeding.</li>
                <li>Use the timer to stay on track.</li>
                <li>Add missing items to your shopping list from the details view.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
