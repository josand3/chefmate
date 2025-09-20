export type RecipeGenerationRequest = {
  ingredients: string[]
  dietTags?: string[]
  cuisines?: string[]
  experience?: string
  timeConstraints?: number
  mealType?: 'breakfast' | 'lunch' | 'dinner'
}

export type GeneratedRecipe = {
  id: string
  title: string
  ingredients: { name: string; quantity?: number; unit?: string }[]
  steps: string[]
  mealType: string
  dietTags?: string[]
  cuisineTags?: string[]
  timeMinutes?: number
  servings?: number
  difficulty?: string
  nutrition?: {
    calories: number
    protein: string
    carbs: string
    fat: string
  }
  generated: boolean
  generatedAt: string
  sourceIngredients: string[]
}

export async function generateRecipe(request: RecipeGenerationRequest): Promise<GeneratedRecipe> {
  const response = await fetch('/api/recipes/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Recipe generation failed: ${response.status}`)
  }

  const data = await response.json()
  if (!data.success || !data.recipe) {
    throw new Error('Invalid response from recipe generation API')
  }

  return data.recipe as GeneratedRecipe
}

export function validateGenerationRequest(request: RecipeGenerationRequest): string[] {
  const errors: string[] = []

  if (!request.ingredients || request.ingredients.length === 0) {
    errors.push('At least one ingredient is required')
  }

  if (request.timeConstraints && (request.timeConstraints < 5 || request.timeConstraints > 180)) {
    errors.push('Time constraints must be between 5 and 180 minutes')
  }

  if (request.ingredients && request.ingredients.length > 20) {
    errors.push('Maximum 20 ingredients allowed')
  }

  return errors
}
