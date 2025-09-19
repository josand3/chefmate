// Local Recipe type to avoid cross-package resolution complexity in early setup
export type Recipe = {
  id: string
  title: string
  ingredients: { name: string; quantity?: number; unit?: string }[]
  steps: string[]
  mealType: 'breakfast' | 'lunch' | 'dinner'
  dietTags?: string[]
  cuisineTags?: string[]
  timeMinutes?: number
}

export const RECIPES: Recipe[] = [
  {
    id: 'bruschetta',
    title: 'Tomato Basil Bruschetta',
    ingredients: [
      { name: 'tomato' },
      { name: 'basil' },
      { name: 'garlic' },
      { name: 'olive oil' },
      { name: 'bread' }
    ],
    steps: [
      'Dice tomatoes and mince garlic',
      'Chop basil',
      'Toss with olive oil and salt',
      'Toast bread and top with mixture'
    ],
    mealType: 'lunch',
    dietTags: ['vegetarian'],
    cuisineTags: ['italian'],
    timeMinutes: 15
  },
  {
    id: 'omelette',
    title: 'Veggie Omelette',
    ingredients: [
      { name: 'egg' },
      { name: 'onion' },
      { name: 'bell pepper' },
      { name: 'cheese' },
      { name: 'butter' }
    ],
    steps: [
      'Whisk eggs with salt',
      'Sauté onion and pepper in butter',
      'Add eggs and cheese, fold and finish'
    ],
    mealType: 'breakfast',
    dietTags: ['vegetarian'],
    cuisineTags: ['french'],
    timeMinutes: 12
  },
  {
    id: 'stirfry',
    title: 'Chicken Veggie Stir Fry',
    ingredients: [
      { name: 'chicken' },
      { name: 'soy sauce' },
      { name: 'garlic' },
      { name: 'broccoli' },
      { name: 'rice' }
    ],
    steps: [
      'Marinate chicken in soy and garlic',
      'Stir fry chicken, add broccoli',
      'Serve over steamed rice'
    ],
    mealType: 'dinner',
    dietTags: [],
    cuisineTags: ['chinese', 'asian'],
    timeMinutes: 25
  },
  {
    id: 'pasta-pesto',
    title: 'Pasta al Pesto',
    ingredients: [
      { name: 'pasta' },
      { name: 'basil' },
      { name: 'garlic' },
      { name: 'olive oil' },
      { name: 'parmesan' }
    ],
    steps: [
      'Cook pasta',
      'Blend basil, garlic, olive oil, parmesan',
      'Toss pasta with pesto'
    ],
    mealType: 'dinner',
    dietTags: ['vegetarian'],
    cuisineTags: ['italian'],
    timeMinutes: 20
  }
]
