import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Clock, Users } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import type { Recommendation } from '../services/recommend'

type Props = {
  rec: Recommendation
  onClose: () => void
}

export default function CookMode({ rec, onClose }: Props) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [startTime] = useState(Date.now())
  const trackCookingStart = useAppStore((s) => s.trackCookingStart)
  const trackCookingComplete = useAppStore((s) => s.trackCookingComplete)
  const trackCookingAbandon = useAppStore((s) => s.trackCookingAbandon)

  useEffect(() => {
    trackCookingStart(rec.recipe.id)
    
    return () => {
      if (!isCompleted) {
        const duration = Date.now() - startTime
        trackCookingAbandon(rec.recipe.id, duration)
      }
    }
  }, [rec.recipe.id, trackCookingStart, trackCookingAbandon, startTime, isCompleted])

  const nextStep = () => {
    if (currentStep < rec.recipe.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      const duration = Date.now() - startTime
      trackCookingComplete(rec.recipe.id, duration)
      setIsCompleted(true)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleClose = () => {
    if (!isCompleted) {
      const duration = Date.now() - startTime
      trackCookingAbandon(rec.recipe.id, duration)
    }
    onClose()
  }

  if (isCompleted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
        <div className="w-full max-w-md rounded-lg bg-gray-900 p-6 text-center">
          <h2 className="mb-4 text-2xl font-bold text-green-400">🎉 Recipe Complete!</h2>
          <p className="mb-6 opacity-80">Great job cooking {rec.recipe.title}!</p>
          <button
            onClick={onClose}
            className="rounded-md bg-brand px-6 py-2 font-medium text-black hover:bg-brand/90"
          >
            Done
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-gray-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{rec.recipe.title}</h2>
          <button
            onClick={handleClose}
            className="rounded-full p-2 hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 flex items-center gap-4 text-sm opacity-70">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{rec.recipe.timeMinutes || 30}m</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>Step {currentStep + 1} of {rec.recipe.steps.length}</span>
          </div>
        </div>

        <div className="mb-6 rounded-lg border border-white/10 bg-white/5 p-4">
          <p className="text-lg leading-relaxed">{rec.recipe.steps[currentStep]}</p>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 rounded-md border border-white/10 px-4 py-2 disabled:opacity-50"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <div className="flex gap-1">
            {rec.recipe.steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 w-2 rounded-full ${
                  idx === currentStep ? 'bg-brand' : idx < currentStep ? 'bg-green-500' : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            className="flex items-center gap-2 rounded-md bg-brand px-4 py-2 font-medium text-black hover:bg-brand/90"
          >
            {currentStep === rec.recipe.steps.length - 1 ? 'Complete' : 'Next'}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
