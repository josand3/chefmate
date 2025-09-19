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

export type AppState = {
  onboarding: OnboardingData
  hasOnboarded: boolean
  ingredients: string[]
  messages: ChatMessage[]
  shoppingList: string[]
  likedRecipeIds: string[]
  dislikedRecipeIds: string[]
<<<<<<< HEAD
  setOnboarding: (data: Partial<OnboardingData>) => void
  completeOnboarding: () => void
  addIngredient: (name: string) => void
  removeIngredient: (name: string) => void
  clearIngredients: () => void
  addMessage: (msg: Omit<ChatMessage, 'id' | 'ts'>) => void
  addToList: (name: string) => void
  removeFromList: (name: string) => void
  clearList: () => void
  likeRecipe: (id: string) => void
  dislikeRecipe: (id: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      onboarding: { zipCode: '', dietaryPrefs: [], cuisines: [], experience: '' },
      hasOnboarded: false,
      ingredients: [],
      messages: [],
      shoppingList: [],
      likedRecipeIds: [],
      dislikedRecipeIds: [],
      setOnboarding: (data) => set((s) => ({ onboarding: { ...s.onboarding, ...data } })),
      completeOnboarding: () => set({ hasOnboarded: true }),
      addIngredient: (name) =>
        set((s) => ({
          ingredients: Array.from(new Set([...s.ingredients, name.toLowerCase().trim()]))
        })),
      removeIngredient: (name) => set((s) => ({ ingredients: s.ingredients.filter((i) => i !== name) })),
      clearIngredients: () => set({ ingredients: [] }),
      addMessage: (msg) => set((s) => ({ messages: [...s.messages, { ...msg, id: crypto.randomUUID(), ts: Date.now() }] })),
      addToList: (name) => set((s) => ({ shoppingList: Array.from(new Set([...s.shoppingList, name])) })),
      removeFromList: (name) => set((s) => ({ shoppingList: s.shoppingList.filter((i) => i !== name) })),
      clearList: () => set({ shoppingList: [] }),
      likeRecipe: (id) =>
        set((s) => ({
          likedRecipeIds: Array.from(new Set([...(s.likedRecipeIds || []), id])),
          dislikedRecipeIds: (s.dislikedRecipeIds || []).filter((x) => x !== id),
        })),
      dislikeRecipe: (id) =>
        set((s) => ({
          dislikedRecipeIds: Array.from(new Set([...(s.dislikedRecipeIds || []), id])),
          likedRecipeIds: (s.likedRecipeIds || []).filter((x) => x !== id),
        })),
    }),
    { name: 'chefmate-store' }
  )
)

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

export type AppState = {
  onboarding: OnboardingData
  hasOnboarded: boolean
  ingredients: string[]
  messages: ChatMessage[]
=======
>>>>>>> 65a4007 (Updated UI with latest improvements)
  // actions
  setOnboarding: (data: Partial<OnboardingData>) => void
  completeOnboarding: () => void
  addIngredient: (name: string) => void
  removeIngredient: (name: string) => void
  clearIngredients: () => void
  addMessage: (msg: Omit<ChatMessage, 'id' | 'ts'>) => void
  addToList: (name: string) => void
  removeFromList: (name: string) => void
  clearList: () => void
  likeRecipe: (id: string) => void
  dislikeRecipe: (id: string) => void
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
        set((s) => ({ messages: [...s.messages, { ...msg, id: crypto.randomUUID(), ts: Date.now() }] })),
      addToList: (name) =>
        set((s) => ({ shoppingList: Array.from(new Set([...s.shoppingList, name])) })),
      removeFromList: (name) =>
        set((s) => ({ shoppingList: s.shoppingList.filter((i) => i !== name) })),
      clearList: () => set({ shoppingList: [] }),
      likeRecipe: (id) =>
        set((s) => ({
          likedRecipeIds: Array.from(new Set([...(s.likedRecipeIds || []), id])),
          dislikedRecipeIds: (s.dislikedRecipeIds || []).filter((x) => x !== id),
        })),
      dislikeRecipe: (id) =>
        set((s) => ({
          dislikedRecipeIds: Array.from(new Set([...(s.dislikedRecipeIds || []), id])),
          likedRecipeIds: (s.likedRecipeIds || []).filter((x) => x !== id),
        })),
    }),
    { name: 'chefmate-store' }
  )
)
