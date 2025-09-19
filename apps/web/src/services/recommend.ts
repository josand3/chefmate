import type { Recipe } from '../data/recipes'
import { RECIPES } from '../data/recipes'

export type Recommendation = {
  recipe: Recipe
  matchPercent: number
  missing: string[]
  matched: string[]
}

export type RecommendOptions = {
  ingredients: string[]
  mealType?: 'breakfast' | 'lunch' | 'dinner'
  dietTags?: string[]
  cuisines?: string[]
  experience?: 'beginner' | 'prep cook' | 'sous chef' | 'executive chef' | ''
  likedRecipeIds?: string[]
  dislikedRecipeIds?: string[]
}

export function recommend(opts: RecommendOptions): Recommendation[] {
  const want = new Set(opts.ingredients.map((s) => s.toLowerCase()))

  const filtered = RECIPES.filter((r) => {
    if (opts.mealType && r.mealType !== opts.mealType) return false
    if (opts.dietTags && opts.dietTags.length > 0) {
      // require all selected diet tags to be present on recipe
      const tags = new Set(r.dietTags || [])
      for (const dt of opts.dietTags) {
        if (!tags.has(dt)) return false
      }
    }
    return true
  })

  const prefCuisines = new Set((opts.cuisines || []).map((c) => c.toLowerCase()))
  const experience = opts.experience || ''
  const liked = new Set(opts.likedRecipeIds || [])
  const disliked = new Set(opts.dislikedRecipeIds || [])

  const scored: Recommendation[] = filtered.map((r) => {
    const recipeIngs = Array.from(new Set(r.ingredients.map((i) => i.name.toLowerCase())))
    const matched = recipeIngs.filter((n) => want.has(n))
    const missing = recipeIngs.filter((n) => !want.has(n))
    let matchPercent = matched.length / recipeIngs.length

    // Cuisine preference boost
    const rc = new Set((r.cuisineTags || []).map((c) => c.toLowerCase()))
    let cuisineBoost = 0
    for (const c of prefCuisines) {
      if (rc.has(c)) cuisineBoost += 0.08 // small boost per match
    }

    // Experience/time shaping: beginners favor shorter recipes
    const t = r.timeMinutes ?? 30
    let timeAdj = 0
    if (experience === 'beginner') timeAdj = Math.max(0, 25 - t) / 200 // up to +0.125 if 0-25m
    if (experience === 'prep cook') timeAdj = Math.max(0, 30 - t) / 300 // up to +0.1
    if (experience === 'sous chef') timeAdj = 0 // neutral
    if (experience === 'executive chef') timeAdj = Math.min(0, 20 - t) / 400 // slight preference for longer

    // Feedback adjustments
    let fbAdj = 0
    if (liked.has(r.id)) fbAdj += 0.15
    if (disliked.has(r.id)) fbAdj -= 0.2

    matchPercent = Math.max(0, Math.min(1, matchPercent + cuisineBoost + timeAdj + fbAdj))

    return { recipe: r, matchPercent, missing, matched }
  })

  return scored
    .sort((a, b) => b.matchPercent - a.matchPercent || (a.recipe.timeMinutes ?? 999) - (b.recipe.timeMinutes ?? 999))
}
