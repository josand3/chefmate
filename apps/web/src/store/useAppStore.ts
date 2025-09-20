import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ExperienceLevel = 'beginner' | 'prep cook' | 'sous chef' | 'executive chef'

export type OnboardingData = {
  zipCode: string
  dietaryPrefs: string[]
  cuisines: string[]
  experience: ExperienceLevel | ''
}

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  ts: number
}

export type RecipeInteraction = {
  recipeId: string
  action: 'view' | 'like' | 'dislike' | 'cook_start' | 'cook_complete' | 'cook_abandon'
  timestamp: number
  duration?: number
}

export type UserBehaviorData = {
  recipeViews: Record<string, number>
  ingredientFrequency: Record<string, number>
  cuisineCompletionRates: Record<string, { completed: number; started: number }>
  recentlyViewedRecipes: string[]
  cookingHistory: RecipeInteraction[]
  averageCookingTime: Record<string, number>
}

export type AppState = {
  onboarding: OnboardingData
  hasOnboarded: boolean
  ingredients: string[]
  messages: ChatMessage[]
  shoppingList: string[]
  likedRecipeIds: string[]
  dislikedRecipeIds: string[]
  behaviorData: UserBehaviorData
  
  setOnboarding: (data: Partial<OnboardingData>) => void
  completeOnboarding: () => void
  addIngredient: (name: string) => void
  removeIngredient: (name: string) => void
  clearIngredients: () => void
  addMessage: (msg: Omit<ChatMessage, 'id' | 'ts'>) => void
  clearMessages: () => void
  addToList: (item: string) => void
  removeFromList: (item: string) => void
  clearList: () => void
  likeRecipe: (id: string) => void
  dislikeRecipe: (id: string) => void
  
  trackRecipeView: (recipeId: string) => void
  trackCookingStart: (recipeId: string) => void
  trackCookingComplete: (recipeId: string, duration?: number) => void
  trackCookingAbandon: (recipeId: string, duration?: number) => void
  updateIngredientFrequency: (ingredients: string[]) => void
  getRecommendationData: () => {
    ingredientFrequency: Record<string, number>
    cuisineCompletionRates: Record<string, number>
    recentlyViewedIds: string[]
  }
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      onboarding: { zipCode: '', dietaryPrefs: [], cuisines: [], experience: '' },
      hasOnboarded: false,
      ingredients: [],
      messages: [],
      shoppingList: [],
      likedRecipeIds: [],
      dislikedRecipeIds: [],
      behaviorData: {
        recipeViews: {},
        ingredientFrequency: {},
        cuisineCompletionRates: {},
        recentlyViewedRecipes: [],
        cookingHistory: [],
        averageCookingTime: {}
      },
      
      setOnboarding: (data) =>
        set((s) => ({ onboarding: { ...s.onboarding, ...data } })),
      completeOnboarding: () => set({ hasOnboarded: true }),
      addIngredient: (name) =>
        set((s) => ({
          ingredients: Array.from(new Set([...s.ingredients, name.toLowerCase().trim()]))
        })),
      removeIngredient: (name) =>
        set((s) => ({ ingredients: s.ingredients.filter((i) => i !== name) })),
      clearIngredients: () => set({ ingredients: [] }),
      addMessage: (msg) =>
        set((s) => ({
          messages: [...s.messages, { ...msg, id: crypto.randomUUID(), ts: Date.now() }]
        })),
      clearMessages: () => set({ messages: [] }),
      addToList: (item) =>
        set((s) => ({ shoppingList: Array.from(new Set([...s.shoppingList, item])) })),
      removeFromList: (item) =>
        set((s) => ({ shoppingList: s.shoppingList.filter((i) => i !== item) })),
      clearList: () => set({ shoppingList: [] }),
      likeRecipe: (id) =>
        set((s) => ({
          likedRecipeIds: Array.from(new Set([...s.likedRecipeIds, id])),
          dislikedRecipeIds: s.dislikedRecipeIds.filter((rid) => rid !== id)
        })),
      dislikeRecipe: (id) =>
        set((s) => ({
          dislikedRecipeIds: Array.from(new Set([...s.dislikedRecipeIds, id])),
          likedRecipeIds: s.likedRecipeIds.filter((rid) => rid !== id)
        })),
      
      trackRecipeView: (recipeId) =>
        set((s) => ({
          behaviorData: {
            ...s.behaviorData,
            recipeViews: {
              ...s.behaviorData.recipeViews,
              [recipeId]: (s.behaviorData.recipeViews[recipeId] || 0) + 1
            },
            recentlyViewedRecipes: [
              recipeId,
              ...s.behaviorData.recentlyViewedRecipes.filter(id => id !== recipeId)
            ].slice(0, 20),
            cookingHistory: [
              ...s.behaviorData.cookingHistory,
              { recipeId, action: 'view', timestamp: Date.now() }
            ]
          }
        })),
      
      trackCookingStart: (recipeId) =>
        set((s) => ({
          behaviorData: {
            ...s.behaviorData,
            cookingHistory: [
              ...s.behaviorData.cookingHistory,
              { recipeId, action: 'cook_start', timestamp: Date.now() }
            ]
          }
        })),
      
      trackCookingComplete: (recipeId, duration) =>
        set((s) => {
          const recipe = get().behaviorData.cookingHistory.find(
            h => h.recipeId === recipeId && h.action === 'cook_start'
          )
          const actualDuration = duration || (recipe ? Date.now() - recipe.timestamp : 0)
          
          return {
            behaviorData: {
              ...s.behaviorData,
              cookingHistory: [
                ...s.behaviorData.cookingHistory,
                { recipeId, action: 'cook_complete', timestamp: Date.now(), duration: actualDuration }
              ],
              averageCookingTime: {
                ...s.behaviorData.averageCookingTime,
                [recipeId]: actualDuration
              }
            }
          }
        }),
      
      trackCookingAbandon: (recipeId, duration) =>
        set((s) => {
          const recipe = get().behaviorData.cookingHistory.find(
            h => h.recipeId === recipeId && h.action === 'cook_start'
          )
          const actualDuration = duration || (recipe ? Date.now() - recipe.timestamp : 0)
          
          return {
            behaviorData: {
              ...s.behaviorData,
              cookingHistory: [
                ...s.behaviorData.cookingHistory,
                { recipeId, action: 'cook_abandon', timestamp: Date.now(), duration: actualDuration }
              ]
            }
          }
        }),
      
      updateIngredientFrequency: (ingredients) =>
        set((s) => {
          const newFreq = { ...s.behaviorData.ingredientFrequency }
          ingredients.forEach(ing => {
            const key = ing.toLowerCase().trim()
            newFreq[key] = (newFreq[key] || 0) + 1
          })
          return {
            behaviorData: {
              ...s.behaviorData,
              ingredientFrequency: newFreq
            }
          }
        }),
      
      getRecommendationData: () => {
        const state = get()
        const behaviorData = state.behaviorData
        
        const cuisineRates: Record<string, number> = {}
        
        Object.entries(behaviorData.cuisineCompletionRates).forEach(([cuisine, stats]) => {
          cuisineRates[cuisine] = stats.started > 0 ? stats.completed / stats.started : 0.5
        })
        
        return {
          ingredientFrequency: behaviorData.ingredientFrequency,
          cuisineCompletionRates: cuisineRates,
          recentlyViewedIds: behaviorData.recentlyViewedRecipes
        }
      }
    }),
    { name: 'chefmate-store' }
  )
)
