export type Ingredient = {
  id?: string
  name: string
  confidence?: number
  quantity?: number
  unit?: string
}

export type Recipe = {
  id: string
  title: string
  ingredients: { name: string; quantity?: number; unit?: string }[]
  steps: string[]
  mealType: 'breakfast' | 'lunch' | 'dinner'
  dietTags?: string[]
  timeMinutes?: number
}
