import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { DIETARY_OPTIONS, CUISINE_OPTIONS, EXPERIENCE_LEVELS } from '../lib/emojiData'

export default function Onboarding() {
  const navigate = useNavigate()
  const onboarding = useAppStore((s) => s.onboarding)
  const setOnboarding = useAppStore((s) => s.setOnboarding)
  const completeOnboarding = useAppStore((s) => s.completeOnboarding)
  const [zip, setZip] = useState(onboarding.zipCode)
  const [diet, setDiet] = useState<string[]>(onboarding.dietaryPrefs)
  const [cuisines, setCuisines] = useState<string[]>(onboarding.cuisines)
  const [experience, setExperience] = useState(onboarding.experience)

  const toggle = (arr: string[], key: string) =>
    arr.includes(key) ? arr.filter((k) => k !== key) : [...arr, key]

  const canContinue = zip.trim().length >= 5 && experience

  const submit = () => {
    setOnboarding({ zipCode: zip, dietaryPrefs: diet, cuisines, experience })
    completeOnboarding()
    navigate('/chat')
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-2 text-2xl font-semibold">Welcome to ChefMate</h2>
      <p className="mb-6 opacity-80">Let’s personalize your cooking experience.</p>

      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">Zip Code</label>
        <input
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
          placeholder="e.g., 10001"
          className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 outline-none focus:border-brand"
          inputMode="numeric"
        />
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">Dietary Preferences</label>
        <div className="flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map((opt) => {
            const active = diet.includes(opt.key)
            return (
              <button
                key={opt.key}
                onClick={() => setDiet((d) => toggle(d, opt.key))}
                className={`rounded-full border px-3 py-1 text-sm ${
                  active ? 'border-brand bg-brand/20' : 'border-white/10 hover:border-white/20'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">Favorite Cuisines</label>
        <div className="flex flex-wrap gap-2">
          {CUISINE_OPTIONS.map((opt) => {
            const active = cuisines.includes(opt.key)
            return (
              <button
                key={opt.key}
                onClick={() => setCuisines((c) => toggle(c, opt.key))}
                className={`rounded-full border px-3 py-1 text-sm ${
                  active ? 'border-accent bg-accent/20' : 'border-white/10 hover:border-white/20'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mb-8">
        <label className="mb-2 block text-sm font-medium">Experience Level</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {EXPERIENCE_LEVELS.map((lvl) => (
            <label key={lvl.key} className={`cursor-pointer rounded-md border p-3 text-center ${experience === lvl.key ? 'border-brand bg-brand/10' : 'border-white/10 hover:border-white/20'}`}>
              <input
                type="radio"
                name="experience"
                value={lvl.key}
                onChange={() => setExperience(lvl.key as any)}
                className="hidden"
              />
              <span>{lvl.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          className="rounded-md border border-white/10 px-4 py-2 hover:border-white/20"
          onClick={() => navigate('/')}
        >
          Skip for now
        </button>
        <button
          disabled={!canContinue}
          className={`rounded-md px-4 py-2 font-medium ${canContinue ? 'bg-brand text-black hover:bg-brand/90' : 'bg-white/10 text-white/40'}`}
          onClick={submit}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
