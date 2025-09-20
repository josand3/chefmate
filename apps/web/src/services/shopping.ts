export type ShoppingItem = {
  name: string
  category: 'produce' | 'dairy' | 'meat' | 'pantry' | 'spices' | 'other'
  quantity?: string
  estimatedCost?: string
  substitutes?: string[]
}

export type Store = {
  name: string
  address: string
  distance: string
  hasIngredients: string[]
  estimatedCost: string
}

const INGREDIENT_CATEGORIES: Record<string, ShoppingItem['category']> = {
  'tomato': 'produce',
  'onion': 'produce',
  'garlic': 'produce',
  'bell pepper': 'produce',
  'cucumber': 'produce',
  'lettuce': 'produce',
  'basil': 'produce',
  'cilantro': 'produce',
  'parsley': 'produce',
  'lemon': 'produce',
  'lime': 'produce',
  'apple': 'produce',
  'banana': 'produce',
  'berries': 'produce',
  'avocado': 'produce',
  'potato': 'produce',
  'carrot': 'produce',
  'broccoli': 'produce',
  'zucchini': 'produce',
  'eggplant': 'produce',
  'mushrooms': 'produce',
  'ginger': 'produce',
  
  'milk': 'dairy',
  'cheese': 'dairy',
  'butter': 'dairy',
  'yogurt': 'dairy',
  'cream': 'dairy',
  'egg': 'dairy',
  'mozzarella': 'dairy',
  'parmesan': 'dairy',
  'feta cheese': 'dairy',
  
  'chicken': 'meat',
  'beef': 'meat',
  'ground beef': 'meat',
  'salmon': 'meat',
  'shrimp': 'meat',
  'turkey': 'meat',
  'bacon': 'meat',
  'lamb': 'meat',
  'fish': 'meat',
  
  'rice': 'pantry',
  'pasta': 'pantry',
  'bread': 'pantry',
  'flour': 'pantry',
  'sugar': 'pantry',
  'olive oil': 'pantry',
  'soy sauce': 'pantry',
  'vinegar': 'pantry',
  'honey': 'pantry',
  'oats': 'pantry',
  'quinoa': 'pantry',
  'beans': 'pantry',
  'lentils': 'pantry',
  'coconut milk': 'pantry',
  'broth': 'pantry',
  'stock': 'pantry',
  
  'salt': 'spices',
  'pepper': 'spices',
  'cumin': 'spices',
  'paprika': 'spices',
  'cinnamon': 'spices',
  'oregano': 'spices',
  'thyme': 'spices',
  'rosemary': 'spices',
  'chili powder': 'spices',
  'curry powder': 'spices',
  'garam masala': 'spices',
  'turmeric': 'spices'
}

export function categorizeIngredient(ingredient: string): ShoppingItem['category'] {
  const lower = ingredient.toLowerCase().trim()
  
  if (INGREDIENT_CATEGORIES[lower]) {
    return INGREDIENT_CATEGORIES[lower]
  }
  
  for (const [key, category] of Object.entries(INGREDIENT_CATEGORIES)) {
    if (lower.includes(key) || key.includes(lower)) {
      return category
    }
  }
  
  return 'other'
}

export function organizeShoppingList(ingredients: string[]): Record<ShoppingItem['category'], ShoppingItem[]> {
  const organized: Record<ShoppingItem['category'], ShoppingItem[]> = {
    produce: [],
    dairy: [],
    meat: [],
    pantry: [],
    spices: [],
    other: []
  }
  
  ingredients.forEach(ingredient => {
    const category = categorizeIngredient(ingredient)
    organized[category].push({
      name: ingredient,
      category,
      quantity: '1', // Default quantity, could be enhanced
      estimatedCost: '$2-5' // Default cost range, could be enhanced
    })
  })
  
  return organized
}

export async function getNearbyStores(zipCode: string, ingredients: string[]): Promise<Store[]> {
  try {
    const response = await fetch(`/api/shopping/stores?zipCode=${zipCode}&ingredients=${ingredients.join(',')}`)
    if (!response.ok) {
      throw new Error('Failed to fetch stores')
    }
    const data = await response.json()
    return data.stores || []
  } catch (error) {
    console.error('Error fetching stores:', error)
    return []
  }
}

export async function getIngredientSubstitutes(ingredient: string): Promise<string[]> {
  try {
    const response = await fetch(`/api/ingredients/substitutes?ingredient=${encodeURIComponent(ingredient)}`)
    if (!response.ok) {
      throw new Error('Failed to fetch substitutes')
    }
    const data = await response.json()
    return data.substitutes || []
  } catch (error) {
    console.error('Error fetching substitutes:', error)
    return []
  }
}
