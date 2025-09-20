import type { Recipe } from '../data/recipes'
import { RECIPES } from '../data/recipes'

export type Recommendation = {
  recipe: Recipe
  matchPercent: number
  missing: string[]
  matched: string[]
  score: number
  reasons: string[]
}

export type RecommendOptions = {
  ingredients: string[]
  mealType?: 'breakfast' | 'lunch' | 'dinner'
  dietTags?: string[]
  cuisines?: string[]
  experience?: 'beginner' | 'prep cook' | 'sous chef' | 'executive chef' | ''
  likedRecipeIds?: string[]
  dislikedRecipeIds?: string[]
  recentlyViewedIds?: string[]
  ingredientFrequency?: Record<string, number>
  cuisineCompletionRates?: Record<string, number>
  zipCode?: string
}

const INGREDIENT_SUBSTITUTES: Record<string, string[]> = {
  'ground beef': ['beef', 'ground meat', 'minced beef'],
  'chicken breast': ['chicken', 'chicken thigh'],
  'chicken': ['chicken breast', 'chicken thigh', 'poultry'],
  'beef': ['ground beef', 'beef chuck', 'steak'],
  'tomato': ['cherry tomato', 'roma tomato', 'canned tomato'],
  'onion': ['red onion', 'yellow onion', 'white onion', 'shallot'],
  'bell pepper': ['red pepper', 'green pepper', 'yellow pepper'],
  'cheese': ['cheddar', 'mozzarella', 'parmesan', 'swiss'],
  'milk': ['whole milk', 'skim milk', '2% milk', 'almond milk'],
  'butter': ['margarine', 'olive oil'],
  'olive oil': ['vegetable oil', 'canola oil'],
  'garlic': ['garlic powder', 'minced garlic'],
  'ginger': ['ground ginger', 'ginger powder'],
  'lemon': ['lime', 'lemon juice'],
  'lime': ['lemon', 'lime juice'],
  'basil': ['dried basil', 'italian seasoning'],
  'cilantro': ['parsley', 'fresh herbs'],
  'parsley': ['cilantro', 'fresh herbs'],
  'rice': ['brown rice', 'white rice', 'jasmine rice', 'basmati rice'],
  'pasta': ['spaghetti', 'penne', 'linguine', 'fettuccine'],
  'flour': ['all-purpose flour', 'wheat flour'],
  'sugar': ['brown sugar', 'honey', 'maple syrup'],
  'soy sauce': ['tamari', 'coconut aminos'],
  'yogurt': ['greek yogurt', 'plain yogurt']
}

function getSeasonalBoost(ingredient: string, month: number): number {
  const seasonal: Record<string, number[]> = {
    'tomato': [6, 7, 8, 9], // summer
    'zucchini': [6, 7, 8, 9],
    'cucumber': [6, 7, 8, 9],
    'berries': [5, 6, 7, 8],
    'apple': [9, 10, 11, 12],
    'pumpkin': [9, 10, 11],
    'squash': [9, 10, 11],
    'root vegetables': [10, 11, 12, 1, 2],
    'potato': [9, 10, 11, 12],
    'carrot': [10, 11, 12, 1, 2],
    'cabbage': [10, 11, 12, 1, 2],
    'citrus': [11, 12, 1, 2, 3],
    'leafy greens': [3, 4, 5, 10, 11]
  }

  for (const [category, months] of Object.entries(seasonal)) {
    if (ingredient.includes(category) || category.includes(ingredient)) {
      return months.includes(month) ? 0.05 : -0.02
    }
  }
  return 0
}

function getIngredientMatches(recipeIngredients: string[], availableIngredients: Set<string>): {
  matched: string[]
  missing: string[]
  substitutable: string[]
} {
  const matched: string[] = []
  const missing: string[] = []
  const substitutable: string[] = []

  for (const recipeIng of recipeIngredients) {
    const recipeIngLower = recipeIng.toLowerCase()
    
    if (availableIngredients.has(recipeIngLower)) {
      matched.push(recipeIng)
      continue
    }

    let foundSubstitute = false
    for (const available of availableIngredients) {
      const substitutes = INGREDIENT_SUBSTITUTES[available] || []
      if (substitutes.some(sub => recipeIngLower.includes(sub) || sub.includes(recipeIngLower))) {
        matched.push(recipeIng)
        foundSubstitute = true
        break
      }
    }

    if (!foundSubstitute) {
      const possibleSubs = INGREDIENT_SUBSTITUTES[recipeIngLower] || []
      const hasSubstitute = possibleSubs.some(sub => availableIngredients.has(sub))
      
      if (hasSubstitute) {
        substitutable.push(recipeIng)
      } else {
        missing.push(recipeIng)
      }
    }
  }

  return { matched, missing, substitutable }
}

export function recommend(opts: RecommendOptions): Recommendation[] {
  const want = new Set(opts.ingredients.map((s) => s.toLowerCase()))
  const currentMonth = new Date().getMonth() + 1

  const filtered = RECIPES.filter((r) => {
    if (opts.dislikedRecipeIds?.includes(r.id)) return false
    
    if (opts.mealType && r.mealType !== opts.mealType) return false
    if (opts.dietTags && opts.dietTags.length > 0) {
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
  const recentlyViewed = new Set(opts.recentlyViewedIds || [])
  const ingredientFreq = opts.ingredientFrequency || {}
  const cuisineRates = opts.cuisineCompletionRates || {}

  const scored: Recommendation[] = filtered.map((r) => {
    const recipeIngs = Array.from(new Set(r.ingredients.map((i) => i.name.toLowerCase())))
    const { matched, missing, substitutable } = getIngredientMatches(recipeIngs, want)
    
    const totalIngredients = recipeIngs.length
    const directMatches = matched.length
    const substituteMatches = substitutable.length * 0.8 // Substitutes count as 80% match
    let matchPercent = (directMatches + substituteMatches) / totalIngredients
    
    const reasons: string[] = []
    let totalScore = matchPercent * 0.4
    
    if (matchPercent > 0.8) reasons.push('Great ingredient match!')
    else if (matchPercent > 0.6) reasons.push('Good ingredient match')

    let preferenceScore = 0
    
    const avgIngredientFreq = matched.reduce((sum, ing) => sum + (ingredientFreq[ing] || 0), 0) / Math.max(matched.length, 1)
    preferenceScore += Math.min(avgIngredientFreq * 0.1, 0.15)
    
    if (avgIngredientFreq > 5) reasons.push('Uses your favorite ingredients')

    // Cuisine completion rate boost
    const recipeCuisines = r.cuisineTags || []
    const avgCuisineRate = recipeCuisines.reduce((sum, cuisine) => sum + (cuisineRates[cuisine] || 0.5), 0) / Math.max(recipeCuisines.length, 1)
    preferenceScore += (avgCuisineRate - 0.5) * 0.2
    
    if (avgCuisineRate > 0.8) reasons.push('From a cuisine you love')

    totalScore += preferenceScore * 0.25

    // Cuisine preference boost (15% weight)
    const rc = new Set((r.cuisineTags || []).map((c) => c.toLowerCase()))
    let cuisineBoost = 0
    for (const c of prefCuisines) {
      if (rc.has(c)) {
        cuisineBoost += 0.12
        reasons.push(`Matches your ${c} preference`)
      }
    }
    totalScore += Math.min(cuisineBoost, 0.15) * 0.15

    let dietScore = 0
    if (opts.dietTags && opts.dietTags.length > 0) {
      const recipeDietTags = new Set(r.dietTags || [])
      const matchingDietTags = opts.dietTags.filter(tag => recipeDietTags.has(tag))
      dietScore = matchingDietTags.length / opts.dietTags.length
      if (dietScore === 1) reasons.push('Perfectly matches your dietary needs')
    }
    totalScore += dietScore * 0.1

    // Experience level appropriateness (5% weight)
    const t = r.timeMinutes ?? 30
    let timeAdj = 0
    if (experience === 'beginner') {
      timeAdj = Math.max(0, 30 - t) / 300
      if (t <= 20) reasons.push('Quick and easy for beginners')
    }
    if (experience === 'prep cook') {
      timeAdj = Math.max(0, 40 - t) / 400
      if (t <= 30) reasons.push('Perfect for your skill level')
    }
    if (experience === 'sous chef') {
      timeAdj = t > 30 ? 0.05 : 0
      if (t > 45) reasons.push('A good challenge for your skills')
    }
    if (experience === 'executive chef') {
      timeAdj = t > 45 ? 0.1 : -0.05
      if (t > 60) reasons.push('Complex recipe for expert chefs')
    }
    totalScore += timeAdj * 0.05

    let diversityScore = 0
    
    if (liked.has(r.id)) {
      diversityScore += 0.15
      reasons.push('You liked this before!')
    }
    
    if (recentlyViewed.has(r.id)) {
      diversityScore -= 0.1
    }
    
    const seasonalBoost = matched.reduce((sum, ing) => sum + getSeasonalBoost(ing, currentMonth), 0) / Math.max(matched.length, 1)
    diversityScore += seasonalBoost
    if (seasonalBoost > 0.03) reasons.push('Uses seasonal ingredients')
    
    totalScore += diversityScore * 0.05

    totalScore = Math.max(0, Math.min(1, totalScore))

    return { 
      recipe: r, 
      matchPercent, 
      missing, 
      matched, 
      score: totalScore,
      reasons: reasons.slice(0, 3) // Limit to top 3 reasons
    }
  })

  return scored
    .sort((a, b) => b.score - a.score || (a.recipe.timeMinutes ?? 999) - (b.recipe.timeMinutes ?? 999))
}
