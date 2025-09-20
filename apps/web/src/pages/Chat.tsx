import { useEffect, useMemo, useRef, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { uploadIngredientImage } from '../services/vision'
import { recommend, type Recommendation } from '../services/recommend'
import { organizeShoppingList, getNearbyStores, getIngredientSubstitutes, type Store, type ShoppingItem } from '../services/shopping'
import { generateRecipe, validateGenerationRequest, type RecipeGenerationRequest, type GeneratedRecipe } from '../services/recipeGeneration'
import RecipeCard from '../components/RecipeCard'
import RecipeDetailsModal from '../components/RecipeDetailsModal'
import CookMode from '../components/CookMode'
import { CUISINE_OPTIONS } from '../lib/emojiData'

// SpeechRecognition types (vendor-prefixed fallback)
const SpeechRecognition = (typeof window !== 'undefined' && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)) as any

type RecognitionState = 'idle' | 'listening' | 'error'

export default function Chat() {
  const ingredients = useAppStore((s) => s.ingredients)
  const addIngredient = useAppStore((s) => s.addIngredient)
  const removeIngredient = useAppStore((s) => s.removeIngredient)
  const clearIngredients = useAppStore((s) => s.clearIngredients)
  const messages = useAppStore((s) => s.messages)
  const addMessage = useAppStore((s) => s.addMessage)
  const onboarding = useAppStore((s) => s.onboarding)
  const addToList = useAppStore((s) => s.addToList)
  const removeFromList = useAppStore((s) => s.removeFromList)
  const clearList = useAppStore((s) => s.clearList)
  const shoppingList = useAppStore((s) => s.shoppingList)

  const [text, setText] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [mealType, setMealType] = useState<'' | 'breakfast' | 'lunch' | 'dinner'>('')
  const [dietFilters, setDietFilters] = useState<string[]>(onboarding.dietaryPrefs || [])
  const [typing, setTyping] = useState(false)
  const [selected, setSelected] = useState<Recommendation | null>(null)
  const [cuisineFilters, setCuisineFilters] = useState<string[]>(onboarding.cuisines || [])
  const [cookRec, setCookRec] = useState<Recommendation | null>(null)
  const [nearbyStores, setNearbyStores] = useState<Store[]>([])
  const [showStores, setShowStores] = useState(false)
  const [organizedList, setOrganizedList] = useState<ReturnType<typeof organizeShoppingList> | null>(null)
  const [showRecipeGenerator, setShowRecipeGenerator] = useState(false)
  const [generatingRecipe, setGeneratingRecipe] = useState(false)
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null)

  // Voice input state
  const [recState, setRecState] = useState<RecognitionState>('idle')
  const recognition = useMemo(() => {
    if (!SpeechRecognition) return null
    const r = new SpeechRecognition()
    r.lang = 'en-US'
    r.continuous = false
    r.interimResults = false
    return r
  }, [])

  useEffect(() => {
    if (!recognition) return
    const handleResult = (e: any) => {
      const transcript = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join(' ')
      setText((t) => (t ? t + ' ' + transcript : transcript))
    }
    const handleStart = () => setRecState('listening')
    const handleEnd = () => setRecState('idle')
    const handleError = () => setRecState('error')

    recognition.addEventListener('result', handleResult)
    recognition.addEventListener('start', handleStart)
    recognition.addEventListener('end', handleEnd)
    recognition.addEventListener('error', handleError)

    return () => {
      recognition.removeEventListener('result', handleResult)
      recognition.removeEventListener('start', handleStart)
      recognition.removeEventListener('end', handleEnd)
      recognition.removeEventListener('error', handleError)
    }
  }, [recognition])

  const onAddIngredient = () => {
    if (!text.trim()) return
    // simple comma/space split to tags
    const newIngredients = text
      .split(/[\,\n]/)
      .map((s) => s.trim())
      .filter(Boolean)
    
    newIngredients.forEach(addIngredient)
    
    useAppStore.getState().updateIngredientFrequency(newIngredients)
    
    setText('')
  }

  const onSendMessage = () => {
    if (!text.trim()) return
    addMessage({ role: 'user', content: text })
    setText('')
  }

  const onUploadImage = async (file: File) => {
    try {
      setUploading(true)
      const ings = await uploadIngredientImage(file)
      if (ings.length === 0) return
      ings.forEach((i) => addIngredient(i.name))
    } catch (e) {
      console.error(e)
    } finally {
      setUploading(false)
    }
  }

  const startVoice = () => {
    if (!recognition) return
    try {
      recognition.start()
    } catch {
      // ignore double starts
    }
  }

  const recs = useMemo(
    () => {
      const behaviorData = useAppStore.getState().getRecommendationData()
      return recommend({
        ingredients,
        mealType: mealType || undefined,
        dietTags: dietFilters,
        cuisines: cuisineFilters.length ? cuisineFilters : onboarding.cuisines,
        experience: onboarding.experience,
        likedRecipeIds: useAppStore.getState().likedRecipeIds,
        dislikedRecipeIds: useAppStore.getState().dislikedRecipeIds,
        recentlyViewedIds: behaviorData.recentlyViewedIds,
        ingredientFrequency: behaviorData.ingredientFrequency,
        cuisineCompletionRates: behaviorData.cuisineCompletionRates,
        zipCode: onboarding.zipCode
      })
    },
    [ingredients, mealType, dietFilters, cuisineFilters, onboarding.cuisines, onboarding.experience, onboarding.zipCode]
  )

  // Auto-suggest: push an assistant message with the top 5 whenever inputs change
  const lastSigRef = useRef<string>('')
  useEffect(() => {
    if (ingredients.length === 0) return
    const top = recs.slice(0, 5)
    if (top.length === 0) return
    const sig = JSON.stringify({
      ings: [...ingredients].sort(),
      mealType,
      dietFilters: [...dietFilters].sort(),
      cuisines: [...(onboarding.cuisines || [])].sort(),
      exp: onboarding.experience,
      ids: top.map((t) => t.recipe.id),
    })
    if (sig === lastSigRef.current) return
    lastSigRef.current = sig

    const lines = top.map(
      (t, idx) => `${idx + 1}. ${t.recipe.title} — ${Math.round(t.score * 100)}% match` +
        (t.missing.length ? ` (missing: ${t.missing.join(', ')})` : '') +
        (t.reasons.length ? ` • ${t.reasons[0]}` : '')
    )
    addMessage({
      role: 'assistant',
      content: `Here are ${top.length} recipe ideas based on your ingredients and preferences:\n\n${lines.join('\n')}`,
    })
  }, [ingredients, mealType, dietFilters, cuisineFilters, onboarding.cuisines, onboarding.experience, recs, addMessage])

  // Typing indicator: show for a short time when inputs change
  const typingTimer = useRef<number | null>(null)
  useEffect(() => {
    if (typingTimer.current) window.clearTimeout(typingTimer.current)
    setTyping(true)
    typingTimer.current = window.setTimeout(() => setTyping(false), 700)
    return () => {
      if (typingTimer.current) window.clearTimeout(typingTimer.current)
    }
  }, [ingredients, mealType, dietFilters, cuisineFilters, onboarding.cuisines, onboarding.experience])

  const toggleDiet = (key: string) =>
    setDietFilters((d) => (d.includes(key) ? d.filter((k) => k !== key) : [...d, key]))

  useEffect(() => {
    if (shoppingList.length > 0) {
      setOrganizedList(organizeShoppingList(shoppingList))
    } else {
      setOrganizedList(null)
    }
  }, [shoppingList])

  const handleFindStores = async () => {
    if (onboarding.zipCode && shoppingList.length > 0) {
      setShowStores(true)
      const stores = await getNearbyStores(onboarding.zipCode, shoppingList)
      setNearbyStores(stores)
    }
  }

  const handleAddMissingIngredients = (missingIngredients: string[]) => {
    missingIngredients.forEach(ingredient => {
      addToList(ingredient)
    })
  }

  const handleGenerateRecipe = async (request: RecipeGenerationRequest) => {
    const validationErrors = validateGenerationRequest(request)
    if (validationErrors.length > 0) {
      alert('Please fix the following issues:\n' + validationErrors.join('\n'))
      return
    }

    setGeneratingRecipe(true)
    try {
      const recipe = await generateRecipe(request)
      setGeneratedRecipe(recipe)
      
      addMessage({
        role: 'assistant',
        content: `Generated custom recipe: ${recipe.title}`,
        generatedRecipe: recipe
      })
      
      setShowRecipeGenerator(false)
    } catch (error) {
      console.error('Recipe generation failed:', error)
      alert('Failed to generate recipe: ' + (error as Error).message)
    } finally {
      setGeneratingRecipe(false)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Ingredients & Inputs */}
      <section className="rounded-lg border border-white/10 bg-black/30 p-4">
        <h3 className="mb-3 text-lg font-semibold">Your Ingredients</h3>
        {ingredients.length > 0 ? (
          <div className="mb-3 flex flex-wrap gap-2">
            {ingredients.map((ing) => (
              <span key={ing} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm">
                {ing}
                <button
                  onClick={() => removeIngredient(ing)}
                  className="rounded-full bg-white/10 px-2 py-0.5 text-xs hover:bg-white/20"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="mb-3 text-sm opacity-70">Add ingredients via text, camera, or voice.</p>
        )}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-xs opacity-70">Meal:</span>
          {(['breakfast', 'lunch', 'dinner'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMealType((prev) => (prev === m ? '' : m))}
              className={`rounded-full border px-3 py-1 text-xs ${mealType === m ? 'border-brand bg-brand/20' : 'border-white/10 hover:border-white/20'}`}
            >
              {m}
            </button>
          ))}
          <span className="ml-2 text-xs opacity-70">Diet:</span>
          {(onboarding.dietaryPrefs || []).map((d) => (
            <button
              key={d}
              onClick={() => toggleDiet(d)}
              className={`rounded-full border px-3 py-1 text-xs ${dietFilters.includes(d) ? 'border-accent bg-accent/20' : 'border-white/10 hover:border-white/20'}`}
            >
              {d}
            </button>
          ))}
          <span className="ml-2 text-xs opacity-70">Cuisines:</span>
          {(CUISINE_OPTIONS || []).slice(0, 6).map((c) => (
            <button
              key={c.key}
              onClick={() =>
                setCuisineFilters((cs) => (cs.includes(c.key) ? cs.filter((x) => x !== c.key) : [...cs, c.key]))
              }
              className={`rounded-full border px-3 py-1 text-xs ${
                cuisineFilters.includes(c.key) ? 'border-brand bg-brand/20' : 'border-white/10 hover:border-white/20'
              }`}
              title="Cuisine preference"
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="mb-3 flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g., tomato, onion, chicken"
            className="flex-1 rounded-md border border-white/10 bg-black/40 px-3 py-2 outline-none focus:border-brand"
          />
          <button onClick={onAddIngredient} className="rounded-md bg-brand px-3 py-2 text-black hover:bg-brand/90">Add</button>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-md border border-white/10 px-3 py-2 hover:border-white/20"
            disabled={uploading}
          >
            {uploading ? 'Processing…' : 'Camera / Upload'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onUploadImage(f)
              e.currentTarget.value = ''
            }}
          />

          <button
            onClick={startVoice}
            className="rounded-md border border-white/10 px-3 py-2 hover:border-white/20 disabled:opacity-50"
            disabled={!recognition}
            title={recognition ? 'Speak your ingredients' : 'Voice not supported in this browser'}
          >
            {recState === 'listening' ? 'Listening… 🎙️' : 'Voice Input 🎤'}
          </button>

          <button
            onClick={() => setShowRecipeGenerator(true)}
            className="rounded-md border border-brand/30 bg-brand/10 px-3 py-2 hover:bg-brand/20"
            title="Generate custom recipe with AI"
          >
            ✨ AI Recipe
          </button>

          {ingredients.length > 0 && (
            <button
              onClick={clearIngredients}
              className="ml-auto rounded-md border border-white/10 px-3 py-2 text-sm hover:border-white/20"
            >
              Clear
            </button>
          )}
        </div>

        {/* Recommendations */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-md font-semibold">Recommended Recipes</h4>
            {typing && <div className="text-xs opacity-80">👨‍🍳 Cooking…</div>}
          </div>
          {recs.length === 0 ? (
            <div className="text-sm opacity-70">Add a few ingredients to get suggestions.</div>
          ) : (
            <ul className="space-y-2">
              {recs.slice(0, 5).map((r) => (
                <li key={r.recipe.id}>
                  <RecipeCard rec={r} onClick={(rec) => {
                    useAppStore.getState().trackRecipeView(rec.recipe.id)
                    setSelected(rec)
                  }} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Chat */}
      <section className="flex min-h-[420px] flex-col rounded-lg border border-white/10 bg-black/30 p-4">
        <h3 className="mb-3 text-lg font-semibold">ChefMate Chat</h3>
        <div className="flex-1 space-y-3 overflow-auto rounded-md border border-white/10 bg-white/5 p-3">
          {messages.length === 0 && (
            <div className="text-sm opacity-70">Tell me what you have, and I’ll suggest recipes!</div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`max-w-[80%] rounded-md px-3 py-2 text-sm ${m.role === 'user' ? 'ml-auto bg-brand text-black' : 'bg-white/10'}`}>
              {m.content}
              {(m as any).generatedRecipe && (
                <div className="mt-3">
                  <RecipeCard
                    rec={{
                      recipe: (m as any).generatedRecipe,
                      score: 1.0,
                      matchPercent: 1.0,
                      missing: [],
                      matched: [],
                      reasons: ['AI Generated Recipe', 'Custom made for your ingredients']
                    }}
                    onClick={(rec) => {
                      useAppStore.getState().trackRecipeView(rec.recipe.id)
                      setSelected(rec)
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ask for recipes or describe what you’d like to cook…"
            className="flex-1 rounded-md border border-white/10 bg-black/40 px-3 py-2 outline-none focus:border-brand"
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSendMessage()
            }}
          />
          <button onClick={onSendMessage} className="rounded-md bg-accent px-3 py-2 text-black hover:bg-accent/90">Send</button>
        </div>

        {/* Shopping Assistant */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-md font-semibold">Shopping List 🛒</h4>
            {shoppingList.length > 0 && onboarding.zipCode && (
              <button
                onClick={handleFindStores}
                className="rounded-md border border-white/10 px-2 py-1 text-xs hover:border-white/20"
              >
                Find Stores
              </button>
            )}
          </div>
          
          {shoppingList.length === 0 ? (
            <div className="text-sm opacity-70">Add missing ingredients from a recipe to build your list.</div>
          ) : organizedList ? (
            <div className="space-y-3">
              {Object.entries(organizedList).map(([category, items]) => 
                (items as ShoppingItem[]).length > 0 && (
                  <div key={category} className="rounded-md border border-white/10 bg-white/5 p-3">
                    <h5 className="mb-2 text-xs font-medium uppercase opacity-70">{category}</h5>
                    <ul className="space-y-1">
                      {(items as ShoppingItem[]).map((item: ShoppingItem) => (
                        <li key={item.name} className="flex items-center justify-between text-sm">
                          <span>{item.name} {item.quantity && `(${item.quantity})`}</span>
                          <button
                            onClick={() => removeFromList(item.name)}
                            className="rounded-md border border-white/10 px-2 py-0.5 text-xs hover:border-white/20"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
          ) : (
            <ul className="space-y-2">
              {shoppingList.map((item) => (
                <li key={item} className="flex items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm">
                  <span>{item}</span>
                  <button
                    onClick={() => removeFromList(item)}
                    className="rounded-md border border-white/10 px-2 py-1 text-xs hover:border-white/20"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          
          {shoppingList.length > 0 && (
            <div className="mt-2 flex gap-2">
              <button onClick={clearList} className="rounded-md border border-white/10 px-3 py-1 text-sm hover:border-white/20">Clear List</button>
            </div>
          )}
          
          {showStores && nearbyStores.length > 0 && (
            <div className="mt-4 rounded-md border border-white/10 bg-white/5 p-3">
              <h5 className="mb-2 text-sm font-medium">Nearby Stores</h5>
              <ul className="space-y-2">
                {nearbyStores.map((store, idx) => (
                  <li key={idx} className="text-sm">
                    <div className="font-medium">{store.name}</div>
                    <div className="text-xs opacity-70">{store.address} • {store.distance}</div>
                    <div className="text-xs opacity-70">Est. cost: {store.estimatedCost}</div>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setShowStores(false)}
                className="mt-2 rounded-md border border-white/10 px-2 py-1 text-xs hover:border-white/20"
              >
                Hide Stores
              </button>
            </div>
          )}
        </div>
      </section>
      {selected && (
        <RecipeDetailsModal
          rec={selected}
          onClose={() => setSelected(null)}
          onStartCook={(rec) => {
            setSelected(null)
            setCookRec(rec)
          }}
        />
      )}
      {cookRec && (
        <CookMode rec={cookRec} onClose={() => setCookRec(null)} />
      )}
      {showRecipeGenerator && (
        <RecipeGeneratorModal
          onClose={() => setShowRecipeGenerator(false)}
          onGenerate={handleGenerateRecipe}
          isGenerating={generatingRecipe}
          availableIngredients={ingredients}
          userPreferences={{
            dietTags: onboarding.dietaryPrefs || [],
            cuisines: onboarding.cuisines || [],
            experience: onboarding.experience
          }}
        />
      )}
    </div>
  )
}

function RecipeGeneratorModal({ 
  onClose, 
  onGenerate, 
  isGenerating, 
  availableIngredients,
  userPreferences 
}: { 
  onClose: () => void
  onGenerate: (request: RecipeGenerationRequest) => void
  isGenerating: boolean
  availableIngredients: string[]
  userPreferences: {
    dietTags: string[]
    cuisines: string[]
    experience: string
  }
}) {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(availableIngredients.slice(0, 5))
  const [customIngredient, setCustomIngredient] = useState('')
  const [selectedDietTags, setSelectedDietTags] = useState<string[]>(userPreferences.dietTags)
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(userPreferences.cuisines.slice(0, 2))
  const [experience, setExperience] = useState(userPreferences.experience)
  const [timeConstraints, setTimeConstraints] = useState(30)
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('dinner')

  const addCustomIngredient = () => {
    if (customIngredient.trim() && !selectedIngredients.includes(customIngredient.trim())) {
      setSelectedIngredients([...selectedIngredients, customIngredient.trim()])
      setCustomIngredient('')
    }
  }

  const removeIngredient = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient))
  }

  const toggleDietTag = (tag: string) => {
    setSelectedDietTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines(prev => 
      prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine]
    )
  }

  const handleSubmit = () => {
    const request: RecipeGenerationRequest = {
      ingredients: selectedIngredients,
      dietTags: selectedDietTags,
      cuisines: selectedCuisines,
      experience,
      timeConstraints,
      mealType
    }
    onGenerate(request)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-white/10 bg-black/90 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Generate Custom Recipe</h2>
          <button
            onClick={onClose}
            className="rounded-md border border-white/10 px-3 py-1 hover:border-white/20"
            disabled={isGenerating}
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Ingredients Section */}
          <div>
            <h3 className="mb-3 text-lg font-medium">Ingredients</h3>
            <div className="mb-3 flex flex-wrap gap-2">
              {selectedIngredients.map((ingredient) => (
                <span key={ingredient} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm">
                  {ingredient}
                  <button
                    onClick={() => removeIngredient(ingredient)}
                    className="rounded-full bg-white/10 px-2 py-0.5 text-xs hover:bg-white/20"
                    disabled={isGenerating}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={customIngredient}
                onChange={(e) => setCustomIngredient(e.target.value)}
                placeholder="Add custom ingredient..."
                className="flex-1 rounded-md border border-white/10 bg-black/40 px-3 py-2 outline-none focus:border-brand"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addCustomIngredient()
                }}
                disabled={isGenerating}
              />
              <button
                onClick={addCustomIngredient}
                className="rounded-md bg-brand px-3 py-2 text-black hover:bg-brand/90"
                disabled={isGenerating}
              >
                Add
              </button>
            </div>
            <div className="mt-3">
              <p className="mb-2 text-sm opacity-70">Available ingredients:</p>
              <div className="flex flex-wrap gap-2">
                {availableIngredients.filter(ing => !selectedIngredients.includes(ing)).map((ingredient) => (
                  <button
                    key={ingredient}
                    onClick={() => setSelectedIngredients([...selectedIngredients, ingredient])}
                    className="rounded-full border border-white/10 px-3 py-1 text-sm hover:border-white/20"
                    disabled={isGenerating}
                  >
                    + {ingredient}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Meal Type */}
          <div>
            <h3 className="mb-3 text-lg font-medium">Meal Type</h3>
            <div className="flex gap-2">
              {(['breakfast', 'lunch', 'dinner'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setMealType(type)}
                  className={`rounded-full border px-4 py-2 text-sm ${
                    mealType === type ? 'border-brand bg-brand/20' : 'border-white/10 hover:border-white/20'
                  }`}
                  disabled={isGenerating}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Time Constraints */}
          <div>
            <h3 className="mb-3 text-lg font-medium">Time Limit</h3>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="15"
                max="120"
                value={timeConstraints}
                onChange={(e) => setTimeConstraints(Number(e.target.value))}
                className="flex-1"
                disabled={isGenerating}
              />
              <span className="text-sm">{timeConstraints} minutes</span>
            </div>
          </div>

          {/* Dietary Preferences */}
          <div>
            <h3 className="mb-3 text-lg font-medium">Dietary Preferences</h3>
            <div className="flex flex-wrap gap-2">
              {['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'low-carb', 'keto', 'paleo'].map((diet) => (
                <button
                  key={diet}
                  onClick={() => toggleDietTag(diet)}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    selectedDietTags.includes(diet) ? 'border-accent bg-accent/20' : 'border-white/10 hover:border-white/20'
                  }`}
                  disabled={isGenerating}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>

          {/* Cuisine Style */}
          <div>
            <h3 className="mb-3 text-lg font-medium">Cuisine Style</h3>
            <div className="flex flex-wrap gap-2">
              {CUISINE_OPTIONS.slice(0, 8).map((cuisine) => (
                <button
                  key={cuisine.key}
                  onClick={() => toggleCuisine(cuisine.key)}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    selectedCuisines.includes(cuisine.key) ? 'border-brand bg-brand/20' : 'border-white/10 hover:border-white/20'
                  }`}
                  disabled={isGenerating}
                >
                  {cuisine.label}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <h3 className="mb-3 text-lg font-medium">Cooking Experience</h3>
            <div className="flex flex-wrap gap-2">
              {['beginner', 'prep cook', 'line cook', 'sous chef', 'executive chef'].map((level) => (
                <button
                  key={level}
                  onClick={() => setExperience(level)}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    experience === level ? 'border-brand bg-brand/20' : 'border-white/10 hover:border-white/20'
                  }`}
                  disabled={isGenerating}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md border border-white/10 px-4 py-2 hover:border-white/20"
            disabled={isGenerating}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-md bg-brand px-4 py-2 text-black hover:bg-brand/90 disabled:opacity-50"
            disabled={isGenerating || selectedIngredients.length === 0}
          >
            {isGenerating ? 'Generating...' : 'Generate Recipe'}
          </button>
        </div>
      </div>
    </div>
  )
}

