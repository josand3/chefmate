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
    id: 'omelette',
    title: 'Veggie Omelette',
    ingredients: [
      { name: 'egg', quantity: 3 },
      { name: 'onion', quantity: 0.5 },
      { name: 'bell pepper', quantity: 1 },
      { name: 'cheese', quantity: 0.25, unit: 'cup' },
      { name: 'butter', quantity: 1, unit: 'tbsp' }
    ],
    steps: [
      'Whisk eggs with salt and pepper',
      'Dice onion and bell pepper',
      'Heat butter in non-stick pan over medium heat',
      'Sauté onion and pepper until soft',
      'Pour in eggs and let set for 2 minutes',
      'Add cheese to one half, fold omelette and serve'
    ],
    mealType: 'breakfast',
    dietTags: ['vegetarian'],
    cuisineTags: ['french'],
    timeMinutes: 12
  },
  {
    id: 'pancakes',
    title: 'Fluffy Pancakes',
    ingredients: [
      { name: 'flour', quantity: 1, unit: 'cup' },
      { name: 'milk', quantity: 1, unit: 'cup' },
      { name: 'egg', quantity: 1 },
      { name: 'sugar', quantity: 2, unit: 'tbsp' },
      { name: 'baking powder', quantity: 2, unit: 'tsp' },
      { name: 'butter', quantity: 2, unit: 'tbsp' }
    ],
    steps: [
      'Mix dry ingredients in a bowl',
      'Whisk milk, egg, and melted butter in another bowl',
      'Combine wet and dry ingredients until just mixed',
      'Heat griddle over medium heat',
      'Pour batter and cook until bubbles form',
      'Flip and cook until golden brown'
    ],
    mealType: 'breakfast',
    dietTags: ['vegetarian'],
    cuisineTags: ['american'],
    timeMinutes: 20
  },
  {
    id: 'avocado-toast',
    title: 'Avocado Toast',
    ingredients: [
      { name: 'bread', quantity: 2, unit: 'slices' },
      { name: 'avocado', quantity: 1 },
      { name: 'lemon', quantity: 0.5 },
      { name: 'salt' },
      { name: 'pepper' },
      { name: 'olive oil', quantity: 1, unit: 'tsp' }
    ],
    steps: [
      'Toast bread until golden',
      'Mash avocado with lemon juice, salt, and pepper',
      'Spread avocado mixture on toast',
      'Drizzle with olive oil and serve'
    ],
    mealType: 'breakfast',
    dietTags: ['vegan', 'vegetarian'],
    cuisineTags: ['american'],
    timeMinutes: 8
  },
  {
    id: 'smoothie-bowl',
    title: 'Berry Smoothie Bowl',
    ingredients: [
      { name: 'banana', quantity: 2 },
      { name: 'berries', quantity: 1, unit: 'cup' },
      { name: 'yogurt', quantity: 0.5, unit: 'cup' },
      { name: 'granola', quantity: 0.25, unit: 'cup' },
      { name: 'honey', quantity: 1, unit: 'tbsp' }
    ],
    steps: [
      'Blend frozen banana, berries, and yogurt until thick',
      'Pour into bowl',
      'Top with granola, fresh berries, and honey',
      'Serve immediately'
    ],
    mealType: 'breakfast',
    dietTags: ['vegetarian'],
    cuisineTags: ['american'],
    timeMinutes: 10
  },
  {
    id: 'french-toast',
    title: 'Classic French Toast',
    ingredients: [
      { name: 'bread', quantity: 4, unit: 'slices' },
      { name: 'egg', quantity: 3 },
      { name: 'milk', quantity: 0.5, unit: 'cup' },
      { name: 'cinnamon', quantity: 1, unit: 'tsp' },
      { name: 'vanilla', quantity: 1, unit: 'tsp' },
      { name: 'butter', quantity: 2, unit: 'tbsp' }
    ],
    steps: [
      'Whisk eggs, milk, cinnamon, and vanilla',
      'Dip bread slices in mixture',
      'Heat butter in pan over medium heat',
      'Cook bread until golden on both sides',
      'Serve with syrup or powdered sugar'
    ],
    mealType: 'breakfast',
    dietTags: ['vegetarian'],
    cuisineTags: ['french'],
    timeMinutes: 15
  },
  {
    id: 'breakfast-burrito',
    title: 'Breakfast Burrito',
    ingredients: [
      { name: 'tortilla', quantity: 2, unit: 'large' },
      { name: 'egg', quantity: 4 },
      { name: 'cheese', quantity: 0.5, unit: 'cup' },
      { name: 'potato', quantity: 1, unit: 'medium' },
      { name: 'bell pepper', quantity: 0.5 },
      { name: 'onion', quantity: 0.25 }
    ],
    steps: [
      'Dice and cook potatoes until crispy',
      'Sauté onion and bell pepper',
      'Scramble eggs with vegetables',
      'Warm tortillas',
      'Fill with egg mixture and cheese',
      'Roll tightly and serve'
    ],
    mealType: 'breakfast',
    dietTags: ['vegetarian'],
    cuisineTags: ['mexican'],
    timeMinutes: 25
  },
  {
    id: 'oatmeal',
    title: 'Steel Cut Oatmeal',
    ingredients: [
      { name: 'oats', quantity: 1, unit: 'cup' },
      { name: 'water', quantity: 3, unit: 'cups' },
      { name: 'milk', quantity: 0.5, unit: 'cup' },
      { name: 'banana', quantity: 1 },
      { name: 'cinnamon', quantity: 1, unit: 'tsp' },
      { name: 'honey', quantity: 2, unit: 'tbsp' }
    ],
    steps: [
      'Bring water to boil, add oats',
      'Simmer for 20 minutes, stirring occasionally',
      'Add milk and cinnamon',
      'Top with sliced banana and honey',
      'Serve hot'
    ],
    mealType: 'breakfast',
    dietTags: ['vegetarian'],
    cuisineTags: ['american'],
    timeMinutes: 25
  },
  {
    id: 'shakshuka',
    title: 'Shakshuka',
    ingredients: [
      { name: 'tomato', quantity: 4, unit: 'large' },
      { name: 'egg', quantity: 4 },
      { name: 'onion', quantity: 1 },
      { name: 'bell pepper', quantity: 1 },
      { name: 'garlic', quantity: 3, unit: 'cloves' },
      { name: 'paprika', quantity: 1, unit: 'tsp' },
      { name: 'cumin', quantity: 1, unit: 'tsp' }
    ],
    steps: [
      'Sauté onion and bell pepper until soft',
      'Add garlic, paprika, and cumin',
      'Add crushed tomatoes and simmer',
      'Make wells in sauce and crack eggs into them',
      'Cover and cook until eggs are set',
      'Serve with bread'
    ],
    mealType: 'breakfast',
    dietTags: ['vegetarian'],
    cuisineTags: ['middle-eastern'],
    timeMinutes: 30
  },

  {
    id: 'bruschetta',
    title: 'Tomato Basil Bruschetta',
    ingredients: [
      { name: 'tomato', quantity: 3, unit: 'large' },
      { name: 'basil', quantity: 0.25, unit: 'cup' },
      { name: 'garlic', quantity: 2, unit: 'cloves' },
      { name: 'olive oil', quantity: 3, unit: 'tbsp' },
      { name: 'bread', quantity: 8, unit: 'slices' },
      { name: 'balsamic vinegar', quantity: 1, unit: 'tbsp' }
    ],
    steps: [
      'Dice tomatoes and drain excess liquid',
      'Mince garlic and chop basil',
      'Mix tomatoes, basil, garlic, olive oil, and balsamic',
      'Toast bread slices until golden',
      'Rub toast with garlic clove',
      'Top with tomato mixture and serve'
    ],
    mealType: 'lunch',
    dietTags: ['vegetarian', 'vegan'],
    cuisineTags: ['italian'],
    timeMinutes: 15
  },
  {
    id: 'caesar-salad',
    title: 'Caesar Salad',
    ingredients: [
      { name: 'lettuce', quantity: 1, unit: 'head' },
      { name: 'parmesan', quantity: 0.5, unit: 'cup' },
      { name: 'croutons', quantity: 1, unit: 'cup' },
      { name: 'anchovy', quantity: 3, unit: 'fillets' },
      { name: 'garlic', quantity: 2, unit: 'cloves' },
      { name: 'lemon', quantity: 1 },
      { name: 'olive oil', quantity: 0.25, unit: 'cup' }
    ],
    steps: [
      'Wash and chop romaine lettuce',
      'Make dressing with anchovy, garlic, lemon, and oil',
      'Toss lettuce with dressing',
      'Add croutons and parmesan',
      'Serve immediately'
    ],
    mealType: 'lunch',
    dietTags: [],
    cuisineTags: ['italian'],
    timeMinutes: 15
  },
  {
    id: 'greek-salad',
    title: 'Greek Salad',
    ingredients: [
      { name: 'cucumber', quantity: 2 },
      { name: 'tomato', quantity: 3 },
      { name: 'red onion', quantity: 0.5 },
      { name: 'feta cheese', quantity: 0.5, unit: 'cup' },
      { name: 'olives', quantity: 0.5, unit: 'cup' },
      { name: 'olive oil', quantity: 3, unit: 'tbsp' },
      { name: 'lemon', quantity: 1 }
    ],
    steps: [
      'Chop cucumber, tomatoes, and red onion',
      'Combine vegetables in large bowl',
      'Add feta cheese and olives',
      'Dress with olive oil and lemon juice',
      'Season with salt, pepper, and oregano'
    ],
    mealType: 'lunch',
    dietTags: ['vegetarian'],
    cuisineTags: ['mediterranean'],
    timeMinutes: 12
  },
  {
    id: 'club-sandwich',
    title: 'Club Sandwich',
    ingredients: [
      { name: 'bread', quantity: 3, unit: 'slices' },
      { name: 'turkey', quantity: 4, unit: 'oz' },
      { name: 'bacon', quantity: 4, unit: 'strips' },
      { name: 'lettuce', quantity: 4, unit: 'leaves' },
      { name: 'tomato', quantity: 1, unit: 'large' },
      { name: 'mayonnaise', quantity: 2, unit: 'tbsp' }
    ],
    steps: [
      'Toast bread slices until golden',
      'Cook bacon until crispy',
      'Slice tomato',
      'Spread mayo on toast',
      'Layer turkey, bacon, lettuce, and tomato',
      'Secure with toothpicks and cut diagonally'
    ],
    mealType: 'lunch',
    dietTags: [],
    cuisineTags: ['american'],
    timeMinutes: 18
  },
  {
    id: 'caprese-salad',
    title: 'Caprese Salad',
    ingredients: [
      { name: 'tomato', quantity: 3, unit: 'large' },
      { name: 'mozzarella', quantity: 8, unit: 'oz' },
      { name: 'basil', quantity: 0.25, unit: 'cup' },
      { name: 'olive oil', quantity: 3, unit: 'tbsp' },
      { name: 'balsamic vinegar', quantity: 2, unit: 'tbsp' },
      { name: 'salt' },
      { name: 'pepper' }
    ],
    steps: [
      'Slice tomatoes and mozzarella',
      'Arrange alternating on plate',
      'Tuck basil leaves between slices',
      'Drizzle with olive oil and balsamic',
      'Season with salt and pepper'
    ],
    mealType: 'lunch',
    dietTags: ['vegetarian'],
    cuisineTags: ['italian'],
    timeMinutes: 10
  },
  {
    id: 'quinoa-bowl',
    title: 'Mediterranean Quinoa Bowl',
    ingredients: [
      { name: 'quinoa', quantity: 1, unit: 'cup' },
      { name: 'cucumber', quantity: 1 },
      { name: 'tomato', quantity: 2 },
      { name: 'chickpeas', quantity: 1, unit: 'can' },
      { name: 'feta cheese', quantity: 0.5, unit: 'cup' },
      { name: 'olive oil', quantity: 3, unit: 'tbsp' },
      { name: 'lemon', quantity: 1 }
    ],
    steps: [
      'Cook quinoa according to package directions',
      'Dice cucumber and tomatoes',
      'Drain and rinse chickpeas',
      'Combine all ingredients in bowl',
      'Dress with olive oil and lemon',
      'Top with crumbled feta'
    ],
    mealType: 'lunch',
    dietTags: ['vegetarian'],
    cuisineTags: ['mediterranean'],
    timeMinutes: 25
  },
  {
    id: 'pho',
    title: 'Vietnamese Pho',
    ingredients: [
      { name: 'beef broth', quantity: 6, unit: 'cups' },
      { name: 'rice noodles', quantity: 8, unit: 'oz' },
      { name: 'beef', quantity: 8, unit: 'oz' },
      { name: 'onion', quantity: 1 },
      { name: 'ginger', quantity: 2, unit: 'inches' },
      { name: 'star anise', quantity: 3 },
      { name: 'cinnamon', quantity: 1, unit: 'stick' },
      { name: 'bean sprouts', quantity: 1, unit: 'cup' }
    ],
    steps: [
      'Char onion and ginger over flame',
      'Simmer broth with spices for 1 hour',
      'Cook rice noodles according to package',
      'Slice beef very thin',
      'Place noodles and raw beef in bowls',
      'Pour hot broth over to cook beef',
      'Serve with bean sprouts and herbs'
    ],
    mealType: 'lunch',
    dietTags: [],
    cuisineTags: ['thai'],
    timeMinutes: 90
  },
  {
    id: 'fish-tacos',
    title: 'Fish Tacos',
    ingredients: [
      { name: 'white fish', quantity: 1, unit: 'lb' },
      { name: 'tortilla', quantity: 8, unit: 'small' },
      { name: 'cabbage', quantity: 2, unit: 'cups' },
      { name: 'lime', quantity: 2 },
      { name: 'cilantro', quantity: 0.25, unit: 'cup' },
      { name: 'cumin', quantity: 1, unit: 'tsp' },
      { name: 'chili powder', quantity: 1, unit: 'tsp' }
    ],
    steps: [
      'Season fish with cumin and chili powder',
      'Grill or pan-fry fish until flaky',
      'Warm tortillas',
      'Shred cabbage finely',
      'Flake fish into pieces',
      'Assemble tacos with fish, cabbage, cilantro',
      'Serve with lime wedges'
    ],
    mealType: 'lunch',
    dietTags: [],
    cuisineTags: ['mexican'],
    timeMinutes: 20
  },

  {
    id: 'stirfry',
    title: 'Chicken Veggie Stir Fry',
    ingredients: [
      { name: 'chicken', quantity: 1, unit: 'lb' },
      { name: 'soy sauce', quantity: 3, unit: 'tbsp' },
      { name: 'garlic', quantity: 3, unit: 'cloves' },
      { name: 'broccoli', quantity: 2, unit: 'cups' },
      { name: 'rice', quantity: 1, unit: 'cup' },
      { name: 'ginger', quantity: 1, unit: 'tbsp' },
      { name: 'sesame oil', quantity: 1, unit: 'tbsp' }
    ],
    steps: [
      'Cook rice according to package directions',
      'Cut chicken into bite-sized pieces',
      'Marinate chicken in soy sauce, garlic, and ginger',
      'Heat oil in wok over high heat',
      'Stir fry chicken until cooked through',
      'Add broccoli and cook until tender-crisp',
      'Serve over steamed rice'
    ],
    mealType: 'dinner',
    dietTags: [],
    cuisineTags: ['chinese'],
    timeMinutes: 25
  },
  {
    id: 'pasta-pesto',
    title: 'Pasta al Pesto',
    ingredients: [
      { name: 'pasta', quantity: 1, unit: 'lb' },
      { name: 'basil', quantity: 2, unit: 'cups' },
      { name: 'garlic', quantity: 3, unit: 'cloves' },
      { name: 'olive oil', quantity: 0.5, unit: 'cup' },
      { name: 'parmesan', quantity: 0.5, unit: 'cup' },
      { name: 'pine nuts', quantity: 0.25, unit: 'cup' }
    ],
    steps: [
      'Cook pasta according to package directions',
      'Toast pine nuts until golden',
      'Blend basil, garlic, pine nuts, and olive oil',
      'Add parmesan to pesto mixture',
      'Drain pasta, reserving pasta water',
      'Toss pasta with pesto, adding pasta water as needed'
    ],
    mealType: 'dinner',
    dietTags: ['vegetarian'],
    cuisineTags: ['italian'],
    timeMinutes: 20
  },
  {
    id: 'beef-tacos',
    title: 'Beef Tacos',
    ingredients: [
      { name: 'ground beef', quantity: 1, unit: 'lb' },
      { name: 'tortilla', quantity: 8 },
      { name: 'onion', quantity: 1 },
      { name: 'garlic', quantity: 2, unit: 'cloves' },
      { name: 'cumin', quantity: 1, unit: 'tsp' },
      { name: 'chili powder', quantity: 1, unit: 'tbsp' },
      { name: 'cheese', quantity: 1, unit: 'cup' },
      { name: 'lettuce', quantity: 2, unit: 'cups' }
    ],
    steps: [
      'Brown ground beef in large skillet',
      'Add diced onion and garlic',
      'Season with cumin and chili powder',
      'Warm tortillas',
      'Fill tortillas with beef mixture',
      'Top with cheese and lettuce',
      'Serve with salsa and sour cream'
    ],
    mealType: 'dinner',
    dietTags: [],
    cuisineTags: ['mexican'],
    timeMinutes: 20
  },
  {
    id: 'salmon-teriyaki',
    title: 'Teriyaki Salmon',
    ingredients: [
      { name: 'salmon', quantity: 4, unit: 'fillets' },
      { name: 'soy sauce', quantity: 0.25, unit: 'cup' },
      { name: 'honey', quantity: 2, unit: 'tbsp' },
      { name: 'ginger', quantity: 1, unit: 'tbsp' },
      { name: 'garlic', quantity: 2, unit: 'cloves' },
      { name: 'rice', quantity: 1, unit: 'cup' },
      { name: 'broccoli', quantity: 2, unit: 'cups' }
    ],
    steps: [
      'Mix soy sauce, honey, ginger, and garlic for marinade',
      'Marinate salmon for 30 minutes',
      'Cook rice according to package directions',
      'Steam broccoli until tender',
      'Pan-fry salmon until cooked through',
      'Reduce marinade to make glaze',
      'Serve salmon over rice with broccoli'
    ],
    mealType: 'dinner',
    dietTags: [],
    cuisineTags: ['japanese'],
    timeMinutes: 45
  },
  {
    id: 'chicken-curry',
    title: 'Indian Chicken Curry',
    ingredients: [
      { name: 'chicken', quantity: 2, unit: 'lbs' },
      { name: 'onion', quantity: 2 },
      { name: 'garlic', quantity: 4, unit: 'cloves' },
      { name: 'ginger', quantity: 2, unit: 'tbsp' },
      { name: 'tomato', quantity: 2, unit: 'cans' },
      { name: 'coconut milk', quantity: 1, unit: 'can' },
      { name: 'curry powder', quantity: 2, unit: 'tbsp' },
      { name: 'rice', quantity: 1, unit: 'cup' }
    ],
    steps: [
      'Cut chicken into chunks',
      'Sauté onion, garlic, and ginger',
      'Add curry powder and cook until fragrant',
      'Add tomatoes and simmer',
      'Add chicken and coconut milk',
      'Simmer until chicken is cooked',
      'Serve over basmati rice'
    ],
    mealType: 'dinner',
    dietTags: [],
    cuisineTags: ['indian'],
    timeMinutes: 40
  },
  {
    id: 'pad-thai',
    title: 'Pad Thai',
    ingredients: [
      { name: 'rice noodles', quantity: 8, unit: 'oz' },
      { name: 'shrimp', quantity: 1, unit: 'lb' },
      { name: 'egg', quantity: 2 },
      { name: 'bean sprouts', quantity: 2, unit: 'cups' },
      { name: 'peanuts', quantity: 0.25, unit: 'cup' },
      { name: 'lime', quantity: 2 },
      { name: 'fish sauce', quantity: 3, unit: 'tbsp' },
      { name: 'tamarind paste', quantity: 2, unit: 'tbsp' }
    ],
    steps: [
      'Soak rice noodles in warm water',
      'Make sauce with fish sauce, tamarind, and sugar',
      'Stir-fry shrimp until pink',
      'Push to one side, scramble eggs',
      'Add drained noodles and sauce',
      'Add bean sprouts and peanuts',
      'Serve with lime wedges'
    ],
    mealType: 'dinner',
    dietTags: [],
    cuisineTags: ['thai'],
    timeMinutes: 30
  },
  {
    id: 'ratatouille',
    title: 'Ratatouille',
    ingredients: [
      { name: 'eggplant', quantity: 1, unit: 'large' },
      { name: 'zucchini', quantity: 2 },
      { name: 'bell pepper', quantity: 2 },
      { name: 'tomato', quantity: 4 },
      { name: 'onion', quantity: 1 },
      { name: 'garlic', quantity: 4, unit: 'cloves' },
      { name: 'herbs de provence', quantity: 2, unit: 'tsp' },
      { name: 'olive oil', quantity: 0.25, unit: 'cup' }
    ],
    steps: [
      'Dice all vegetables into similar sizes',
      'Sauté onion and garlic in olive oil',
      'Add eggplant and cook until soft',
      'Add bell peppers and zucchini',
      'Add tomatoes and herbs',
      'Simmer until vegetables are tender',
      'Serve with crusty bread'
    ],
    mealType: 'dinner',
    dietTags: ['vegan', 'vegetarian'],
    cuisineTags: ['french'],
    timeMinutes: 45
  },
  {
    id: 'beef-stew',
    title: 'Classic Beef Stew',
    ingredients: [
      { name: 'beef', quantity: 2, unit: 'lbs' },
      { name: 'potato', quantity: 4 },
      { name: 'carrot', quantity: 3 },
      { name: 'onion', quantity: 1 },
      { name: 'celery', quantity: 2, unit: 'stalks' },
      { name: 'beef broth', quantity: 4, unit: 'cups' },
      { name: 'tomato paste', quantity: 2, unit: 'tbsp' },
      { name: 'flour', quantity: 2, unit: 'tbsp' }
    ],
    steps: [
      'Cut beef into chunks and brown in pot',
      'Remove beef, sauté onion and celery',
      'Add tomato paste and flour',
      'Return beef, add broth and bring to boil',
      'Simmer covered for 1.5 hours',
      'Add potatoes and carrots',
      'Cook until vegetables are tender'
    ],
    mealType: 'dinner',
    dietTags: [],
    cuisineTags: ['american'],
    timeMinutes: 120
  },
  {
    id: 'margherita-pizza',
    title: 'Margherita Pizza',
    ingredients: [
      { name: 'pizza dough', quantity: 1, unit: 'ball' },
      { name: 'tomato sauce', quantity: 0.5, unit: 'cup' },
      { name: 'mozzarella', quantity: 8, unit: 'oz' },
      { name: 'basil', quantity: 0.25, unit: 'cup' },
      { name: 'olive oil', quantity: 2, unit: 'tbsp' },
      { name: 'garlic', quantity: 2, unit: 'cloves' }
    ],
    steps: [
      'Preheat oven to 475°F',
      'Roll out pizza dough',
      'Spread tomato sauce evenly',
      'Add torn mozzarella pieces',
      'Drizzle with olive oil',
      'Bake for 12-15 minutes until golden',
      'Top with fresh basil before serving'
    ],
    mealType: 'dinner',
    dietTags: ['vegetarian'],
    cuisineTags: ['italian'],
    timeMinutes: 30
  },
  {
    id: 'lamb-tagine',
    title: 'Moroccan Lamb Tagine',
    ingredients: [
      { name: 'lamb', quantity: 2, unit: 'lbs' },
      { name: 'onion', quantity: 2 },
      { name: 'dried apricots', quantity: 1, unit: 'cup' },
      { name: 'almonds', quantity: 0.5, unit: 'cup' },
      { name: 'cinnamon', quantity: 1, unit: 'tsp' },
      { name: 'ginger', quantity: 1, unit: 'tsp' },
      { name: 'saffron', quantity: 1, unit: 'pinch' },
      { name: 'couscous', quantity: 1, unit: 'cup' }
    ],
    steps: [
      'Brown lamb pieces in tagine or heavy pot',
      'Add sliced onions and spices',
      'Add enough water to barely cover',
      'Simmer covered for 1.5 hours',
      'Add apricots and almonds',
      'Cook until lamb is tender',
      'Serve over couscous'
    ],
    mealType: 'dinner',
    dietTags: ['halal'],
    cuisineTags: ['middle-eastern'],
    timeMinutes: 120
  },
  {
    id: 'mushroom-risotto',
    title: 'Mushroom Risotto',
    ingredients: [
      { name: 'arborio rice', quantity: 1, unit: 'cup' },
      { name: 'mushrooms', quantity: 1, unit: 'lb' },
      { name: 'onion', quantity: 1 },
      { name: 'garlic', quantity: 3, unit: 'cloves' },
      { name: 'white wine', quantity: 0.5, unit: 'cup' },
      { name: 'vegetable broth', quantity: 4, unit: 'cups' },
      { name: 'parmesan', quantity: 0.5, unit: 'cup' },
      { name: 'butter', quantity: 2, unit: 'tbsp' }
    ],
    steps: [
      'Sauté mushrooms until golden, set aside',
      'Sauté onion and garlic until soft',
      'Add rice and stir for 2 minutes',
      'Add wine and stir until absorbed',
      'Add warm broth one ladle at a time',
      'Stir constantly until rice is creamy',
      'Fold in mushrooms, butter, and parmesan'
    ],
    mealType: 'dinner',
    dietTags: ['vegetarian'],
    cuisineTags: ['italian'],
    timeMinutes: 35
  },
  {
    id: 'chicken-tikka-masala',
    title: 'Chicken Tikka Masala',
    ingredients: [
      { name: 'chicken', quantity: 2, unit: 'lbs' },
      { name: 'yogurt', quantity: 1, unit: 'cup' },
      { name: 'garam masala', quantity: 2, unit: 'tbsp' },
      { name: 'tomato sauce', quantity: 2, unit: 'cups' },
      { name: 'heavy cream', quantity: 0.5, unit: 'cup' },
      { name: 'onion', quantity: 1 },
      { name: 'garlic', quantity: 4, unit: 'cloves' },
      { name: 'ginger', quantity: 2, unit: 'tbsp' }
    ],
    steps: [
      'Marinate chicken in yogurt and spices',
      'Grill or broil chicken until charred',
      'Sauté onion, garlic, and ginger',
      'Add tomato sauce and simmer',
      'Add grilled chicken pieces',
      'Stir in cream and garam masala',
      'Serve with basmati rice and naan'
    ],
    mealType: 'dinner',
    dietTags: [],
    cuisineTags: ['indian'],
    timeMinutes: 50
  },
  {
    id: 'paella',
    title: 'Seafood Paella',
    ingredients: [
      { name: 'bomba rice', quantity: 2, unit: 'cups' },
      { name: 'shrimp', quantity: 1, unit: 'lb' },
      { name: 'mussels', quantity: 1, unit: 'lb' },
      { name: 'squid', quantity: 0.5, unit: 'lb' },
      { name: 'saffron', quantity: 1, unit: 'pinch' },
      { name: 'tomato', quantity: 2 },
      { name: 'bell pepper', quantity: 1 },
      { name: 'seafood stock', quantity: 4, unit: 'cups' }
    ],
    steps: [
      'Heat paella pan with olive oil',
      'Sauté seafood until just cooked, remove',
      'Sauté vegetables until soft',
      'Add rice and stir for 2 minutes',
      'Add hot saffron stock',
      'Simmer without stirring for 15 minutes',
      'Return seafood to pan and finish cooking'
    ],
    mealType: 'dinner',
    dietTags: [],
    cuisineTags: ['mediterranean'],
    timeMinutes: 45
  },
  {
    id: 'eggplant-parmesan',
    title: 'Eggplant Parmesan',
    ingredients: [
      { name: 'eggplant', quantity: 2, unit: 'large' },
      { name: 'breadcrumbs', quantity: 2, unit: 'cups' },
      { name: 'parmesan', quantity: 1, unit: 'cup' },
      { name: 'mozzarella', quantity: 2, unit: 'cups' },
      { name: 'marinara sauce', quantity: 3, unit: 'cups' },
      { name: 'egg', quantity: 3 },
      { name: 'flour', quantity: 1, unit: 'cup' }
    ],
    steps: [
      'Slice eggplant and salt to remove bitterness',
      'Set up breading station with flour, egg, breadcrumbs',
      'Bread eggplant slices and fry until golden',
      'Layer eggplant with sauce and cheese',
      'Repeat layers ending with cheese',
      'Bake at 375°F for 45 minutes',
      'Let rest before serving'
    ],
    mealType: 'dinner',
    dietTags: ['vegetarian'],
    cuisineTags: ['italian'],
    timeMinutes: 75
  },
  {
    id: 'korean-bbq',
    title: 'Korean BBQ Beef',
    ingredients: [
      { name: 'ribeye', quantity: 2, unit: 'lbs' },
      { name: 'soy sauce', quantity: 0.5, unit: 'cup' },
      { name: 'sesame oil', quantity: 2, unit: 'tbsp' },
      { name: 'garlic', quantity: 6, unit: 'cloves' },
      { name: 'ginger', quantity: 2, unit: 'tbsp' },
      { name: 'pear', quantity: 1 },
      { name: 'rice', quantity: 2, unit: 'cups' },
      { name: 'kimchi', quantity: 1, unit: 'cup' }
    ],
    steps: [
      'Slice beef very thin against the grain',
      'Grate pear and mix with soy sauce, sesame oil',
      'Add minced garlic and ginger to marinade',
      'Marinate beef for at least 2 hours',
      'Grill beef over high heat for 2-3 minutes per side',
      'Serve with steamed rice and kimchi',
      'Wrap in lettuce leaves if desired'
    ],
    mealType: 'dinner',
    dietTags: [],
    cuisineTags: ['chinese'],
    timeMinutes: 30
  },
  {
    id: 'fish-and-chips',
    title: 'Fish and Chips',
    ingredients: [
      { name: 'cod', quantity: 4, unit: 'fillets' },
      { name: 'potato', quantity: 4, unit: 'large' },
      { name: 'flour', quantity: 1, unit: 'cup' },
      { name: 'beer', quantity: 1, unit: 'cup' },
      { name: 'baking powder', quantity: 1, unit: 'tsp' },
      { name: 'oil', quantity: 4, unit: 'cups' },
      { name: 'malt vinegar', quantity: 2, unit: 'tbsp' }
    ],
    steps: [
      'Cut potatoes into thick chips',
      'Fry chips at 325°F until tender',
      'Make batter with flour, beer, and baking powder',
      'Dip fish in batter and fry at 375°F',
      'Fry chips again at 375°F until golden',
      'Drain on paper towels',
      'Serve with malt vinegar and mushy peas'
    ],
    mealType: 'dinner',
    dietTags: [],
    cuisineTags: ['american'],
    timeMinutes: 45
  },
  {
    id: 'vegetable-curry',
    title: 'Mixed Vegetable Curry',
    ingredients: [
      { name: 'cauliflower', quantity: 1, unit: 'head' },
      { name: 'potato', quantity: 3 },
      { name: 'peas', quantity: 1, unit: 'cup' },
      { name: 'onion', quantity: 2 },
      { name: 'tomato', quantity: 3 },
      { name: 'coconut milk', quantity: 1, unit: 'can' },
      { name: 'curry powder', quantity: 3, unit: 'tbsp' },
      { name: 'ginger', quantity: 2, unit: 'tbsp' }
    ],
    steps: [
      'Cut vegetables into bite-sized pieces',
      'Sauté onion until golden',
      'Add ginger and curry powder',
      'Add tomatoes and cook until soft',
      'Add harder vegetables first',
      'Add coconut milk and simmer',
      'Add peas last and cook until tender'
    ],
    mealType: 'dinner',
    dietTags: ['vegan', 'vegetarian'],
    cuisineTags: ['indian'],
    timeMinutes: 35
  },
  {
    id: 'chicken-fajitas',
    title: 'Chicken Fajitas',
    ingredients: [
      { name: 'chicken', quantity: 2, unit: 'lbs' },
      { name: 'bell pepper', quantity: 3 },
      { name: 'onion', quantity: 2 },
      { name: 'tortilla', quantity: 8 },
      { name: 'lime', quantity: 2 },
      { name: 'cumin', quantity: 2, unit: 'tsp' },
      { name: 'chili powder', quantity: 1, unit: 'tbsp' },
      { name: 'sour cream', quantity: 0.5, unit: 'cup' }
    ],
    steps: [
      'Slice chicken into strips',
      'Season with cumin, chili powder, and lime',
      'Slice peppers and onions',
      'Cook chicken in hot skillet until done',
      'Remove chicken, cook vegetables until tender',
      'Return chicken to pan and toss',
      'Serve with warm tortillas and toppings'
    ],
    mealType: 'dinner',
    dietTags: [],
    cuisineTags: ['mexican'],
    timeMinutes: 25
  },
  {
    id: 'lentil-dal',
    title: 'Red Lentil Dal',
    ingredients: [
      { name: 'red lentils', quantity: 1, unit: 'cup' },
      { name: 'onion', quantity: 1 },
      { name: 'garlic', quantity: 4, unit: 'cloves' },
      { name: 'ginger', quantity: 2, unit: 'tbsp' },
      { name: 'turmeric', quantity: 1, unit: 'tsp' },
      { name: 'cumin', quantity: 1, unit: 'tsp' },
      { name: 'tomato', quantity: 2 },
      { name: 'coconut milk', quantity: 0.5, unit: 'cup' }
    ],
    steps: [
      'Rinse lentils until water runs clear',
      'Sauté onion, garlic, and ginger',
      'Add spices and cook until fragrant',
      'Add lentils and 3 cups water',
      'Simmer until lentils break down',
      'Add diced tomatoes and coconut milk',
      'Simmer until thick and creamy'
    ],
    mealType: 'dinner',
    dietTags: ['vegan', 'vegetarian'],
    cuisineTags: ['indian'],
    timeMinutes: 30
  },
  {
    id: 'stuffed-peppers',
    title: 'Stuffed Bell Peppers',
    ingredients: [
      { name: 'bell pepper', quantity: 6 },
      { name: 'ground beef', quantity: 1, unit: 'lb' },
      { name: 'rice', quantity: 1, unit: 'cup' },
      { name: 'onion', quantity: 1 },
      { name: 'tomato sauce', quantity: 1, unit: 'can' },
      { name: 'cheese', quantity: 1, unit: 'cup' },
      { name: 'garlic', quantity: 2, unit: 'cloves' }
    ],
    steps: [
      'Cut tops off peppers and remove seeds',
      'Cook rice according to package directions',
      'Brown ground beef with onion and garlic',
      'Mix beef, rice, and half the tomato sauce',
      'Stuff peppers with mixture',
      'Top with remaining sauce and cheese',
      'Bake at 375°F for 30 minutes'
    ],
    mealType: 'dinner',
    dietTags: [],
    cuisineTags: ['american'],
    timeMinutes: 60
  },
  {
    id: 'chicken-marsala',
    title: 'Chicken Marsala',
    ingredients: [
      { name: 'chicken breast', quantity: 4 },
      { name: 'mushrooms', quantity: 8, unit: 'oz' },
      { name: 'marsala wine', quantity: 0.75, unit: 'cup' },
      { name: 'flour', quantity: 0.5, unit: 'cup' },
      { name: 'butter', quantity: 4, unit: 'tbsp' },
      { name: 'heavy cream', quantity: 0.25, unit: 'cup' },
      { name: 'garlic', quantity: 2, unit: 'cloves' }
    ],
    steps: [
      'Pound chicken to even thickness',
      'Dredge chicken in seasoned flour',
      'Pan-fry chicken until golden, remove',
      'Sauté mushrooms and garlic',
      'Add marsala wine and reduce',
      'Add cream and return chicken',
      'Simmer until sauce thickens'
    ],
    mealType: 'dinner',
    dietTags: [],
    cuisineTags: ['italian'],
    timeMinutes: 35
  },
  {
    id: 'vegetable-stir-fry',
    title: 'Mixed Vegetable Stir Fry',
    ingredients: [
      { name: 'broccoli', quantity: 2, unit: 'cups' },
      { name: 'carrot', quantity: 2 },
      { name: 'bell pepper', quantity: 2 },
      { name: 'snap peas', quantity: 1, unit: 'cup' },
      { name: 'soy sauce', quantity: 3, unit: 'tbsp' },
      { name: 'garlic', quantity: 3, unit: 'cloves' },
      { name: 'ginger', quantity: 1, unit: 'tbsp' },
      { name: 'sesame oil', quantity: 1, unit: 'tbsp' }
    ],
    steps: [
      'Cut all vegetables into similar sizes',
      'Heat oil in wok over high heat',
      'Add garlic and ginger, stir for 30 seconds',
      'Add harder vegetables first',
      'Stir-fry until vegetables are tender-crisp',
      'Add soy sauce and sesame oil',
      'Serve immediately over rice'
    ],
    mealType: 'dinner',
    dietTags: ['vegan', 'vegetarian'],
    cuisineTags: ['chinese'],
    timeMinutes: 15
  },
  {
    id: 'shepherd-pie',
    title: 'Shepherd\'s Pie',
    ingredients: [
      { name: 'ground lamb', quantity: 2, unit: 'lbs' },
      { name: 'potato', quantity: 3, unit: 'lbs' },
      { name: 'onion', quantity: 2 },
      { name: 'carrot', quantity: 3 },
      { name: 'peas', quantity: 1, unit: 'cup' },
      { name: 'tomato paste', quantity: 2, unit: 'tbsp' },
      { name: 'worcestershire sauce', quantity: 2, unit: 'tbsp' },
      { name: 'butter', quantity: 4, unit: 'tbsp' }
    ],
    steps: [
      'Boil potatoes until tender, mash with butter',
      'Brown ground lamb in large skillet',
      'Add diced onion and carrot',
      'Stir in tomato paste and worcestershire',
      'Add peas and simmer until thick',
      'Transfer to baking dish',
      'Top with mashed potatoes and bake until golden'
    ],
    mealType: 'dinner',
    dietTags: [],
    cuisineTags: ['american'],
    timeMinutes: 75
  },
  {
    id: 'thai-green-curry',
    title: 'Thai Green Curry',
    ingredients: [
      { name: 'chicken', quantity: 1, unit: 'lb' },
      { name: 'green curry paste', quantity: 3, unit: 'tbsp' },
      { name: 'coconut milk', quantity: 2, unit: 'cans' },
      { name: 'thai basil', quantity: 0.5, unit: 'cup' },
      { name: 'eggplant', quantity: 2, unit: 'small' },
      { name: 'bell pepper', quantity: 1 },
      { name: 'fish sauce', quantity: 2, unit: 'tbsp' },
      { name: 'palm sugar', quantity: 1, unit: 'tbsp' }
    ],
    steps: [
      'Heat thick coconut milk in wok',
      'Fry curry paste until fragrant',
      'Add chicken and cook until done',
      'Add remaining coconut milk',
      'Add vegetables and simmer',
      'Season with fish sauce and sugar',
      'Garnish with thai basil'
    ],
    mealType: 'dinner',
    dietTags: [],
    cuisineTags: ['thai'],
    timeMinutes: 30
  },
  {
    id: 'beef-bourguignon',
    title: 'Beef Bourguignon',
    ingredients: [
      { name: 'beef chuck', quantity: 3, unit: 'lbs' },
      { name: 'red wine', quantity: 1, unit: 'bottle' },
      { name: 'bacon', quantity: 6, unit: 'strips' },
      { name: 'mushrooms', quantity: 1, unit: 'lb' },
      { name: 'pearl onions', quantity: 1, unit: 'bag' },
      { name: 'carrot', quantity: 3 },
      { name: 'tomato paste', quantity: 2, unit: 'tbsp' },
      { name: 'beef stock', quantity: 2, unit: 'cups' }
    ],
    steps: [
      'Cut beef into chunks and marinate in wine overnight',
      'Cook bacon until crispy, remove',
      'Brown beef in bacon fat',
      'Sauté vegetables until soft',
      'Add tomato paste and flour',
      'Add wine marinade and stock',
      'Braise in oven at 325°F for 2.5 hours'
    ],
    mealType: 'dinner',
    dietTags: [],
    cuisineTags: ['french'],
    timeMinutes: 180
  },
  {
    id: 'vegetarian-chili',
    title: 'Three-Bean Vegetarian Chili',
    ingredients: [
      { name: 'black beans', quantity: 1, unit: 'can' },
      { name: 'kidney beans', quantity: 1, unit: 'can' },
      { name: 'pinto beans', quantity: 1, unit: 'can' },
      { name: 'tomato', quantity: 2, unit: 'cans' },
      { name: 'onion', quantity: 2 },
      { name: 'bell pepper', quantity: 2 },
      { name: 'chili powder', quantity: 2, unit: 'tbsp' },
      { name: 'cumin', quantity: 1, unit: 'tbsp' }
    ],
    steps: [
      'Sauté onion and bell pepper until soft',
      'Add chili powder and cumin',
      'Add drained beans and tomatoes',
      'Simmer for 30 minutes',
      'Season with salt and pepper',
      'Serve with cornbread',
      'Top with cheese and sour cream if desired'
    ],
    mealType: 'dinner',
    dietTags: ['vegetarian', 'vegan'],
    cuisineTags: ['american'],
    timeMinutes: 45
  },
  {
    id: 'chicken-parmesan',
    title: 'Chicken Parmesan',
    ingredients: [
      { name: 'chicken breast', quantity: 4 },
      { name: 'breadcrumbs', quantity: 2, unit: 'cups' },
      { name: 'parmesan', quantity: 1, unit: 'cup' },
      { name: 'mozzarella', quantity: 2, unit: 'cups' },
      { name: 'marinara sauce', quantity: 2, unit: 'cups' },
      { name: 'egg', quantity: 2 },
      { name: 'flour', quantity: 1, unit: 'cup' }
    ],
    steps: [
      'Pound chicken to even thickness',
      'Set up breading station with flour, egg, breadcrumbs',
      'Bread chicken and pan-fry until golden',
      'Top with marinara and mozzarella',
      'Bake at 375°F until cheese melts',
      'Sprinkle with parmesan',
      'Serve with pasta'
    ],
    mealType: 'dinner',
    dietTags: [],
    cuisineTags: ['italian'],
    timeMinutes: 40
  },
  {
    id: 'moroccan-chicken',
    title: 'Moroccan Chicken with Olives',
    ingredients: [
      { name: 'chicken', quantity: 1, unit: 'whole' },
      { name: 'olives', quantity: 1, unit: 'cup' },
      { name: 'preserved lemons', quantity: 2 },
      { name: 'onion', quantity: 2 },
      { name: 'ginger', quantity: 2, unit: 'tbsp' },
      { name: 'saffron', quantity: 1, unit: 'pinch' },
      { name: 'cilantro', quantity: 0.5, unit: 'cup' },
      { name: 'olive oil', quantity: 0.25, unit: 'cup' }
    ],
    steps: [
      'Cut chicken into pieces',
      'Marinate with ginger, saffron, and oil',
      'Brown chicken in tagine or heavy pot',
      'Add sliced onions and cook until soft',
      'Add olives and preserved lemons',
      'Simmer covered for 45 minutes',
      'Garnish with fresh cilantro'
    ],
    mealType: 'dinner',
    dietTags: ['halal'],
    cuisineTags: ['middle-eastern'],
    timeMinutes: 75
  },
  {
    id: 'spaghetti-carbonara',
    title: 'Spaghetti Carbonara',
    ingredients: [
      { name: 'spaghetti', quantity: 1, unit: 'lb' },
      { name: 'pancetta', quantity: 6, unit: 'oz' },
      { name: 'egg', quantity: 4 },
      { name: 'parmesan', quantity: 1, unit: 'cup' },
      { name: 'black pepper', quantity: 2, unit: 'tsp' },
      { name: 'garlic', quantity: 2, unit: 'cloves' }
    ],
    steps: [
      'Cook spaghetti until al dente',
      'Crisp pancetta in large skillet',
      'Whisk eggs with parmesan and pepper',
      'Add hot pasta to pancetta pan',
      'Remove from heat and add egg mixture',
      'Toss quickly to create creamy sauce',
      'Serve immediately with extra parmesan'
    ],
    mealType: 'dinner',
    dietTags: [],
    cuisineTags: ['italian'],
    timeMinutes: 20
  },
  {
    id: 'miso-glazed-salmon',
    title: 'Miso Glazed Salmon',
    ingredients: [
      { name: 'salmon', quantity: 4, unit: 'fillets' },
      { name: 'miso paste', quantity: 3, unit: 'tbsp' },
      { name: 'mirin', quantity: 2, unit: 'tbsp' },
      { name: 'sake', quantity: 2, unit: 'tbsp' },
      { name: 'sugar', quantity: 1, unit: 'tbsp' },
      { name: 'ginger', quantity: 1, unit: 'tbsp' },
      { name: 'scallions', quantity: 3 }
    ],
    steps: [
      'Mix miso, mirin, sake, sugar, and ginger',
      'Marinate salmon for 30 minutes',
      'Preheat broiler',
      'Broil salmon for 6-8 minutes',
      'Brush with more glaze halfway through',
      'Garnish with sliced scallions',
      'Serve with steamed rice'
    ],
    mealType: 'dinner',
    dietTags: [],
    cuisineTags: ['japanese'],
    timeMinutes: 45
  },
  {
    id: 'ratatouille-pasta',
    title: 'Ratatouille Pasta',
    ingredients: [
      { name: 'pasta', quantity: 1, unit: 'lb' },
      { name: 'eggplant', quantity: 1 },
      { name: 'zucchini', quantity: 2 },
      { name: 'bell pepper', quantity: 2 },
      { name: 'tomato', quantity: 4 },
      { name: 'onion', quantity: 1 },
      { name: 'garlic', quantity: 4, unit: 'cloves' },
      { name: 'basil', quantity: 0.25, unit: 'cup' }
    ],
    steps: [
      'Dice all vegetables into small pieces',
      'Sauté onion and garlic until soft',
      'Add eggplant and cook until tender',
      'Add bell pepper and zucchini',
      'Add tomatoes and simmer',
      'Cook pasta until al dente',
      'Toss pasta with ratatouille and basil'
    ],
    mealType: 'dinner',
    dietTags: ['vegan', 'vegetarian'],
    cuisineTags: ['french'],
    timeMinutes: 35
  },
  {
    id: 'korean-fried-chicken',
    title: 'Korean Fried Chicken',
    ingredients: [
      { name: 'chicken wings', quantity: 2, unit: 'lbs' },
      { name: 'potato starch', quantity: 1, unit: 'cup' },
      { name: 'gochujang', quantity: 3, unit: 'tbsp' },
      { name: 'soy sauce', quantity: 2, unit: 'tbsp' },
      { name: 'honey', quantity: 2, unit: 'tbsp' },
      { name: 'garlic', quantity: 4, unit: 'cloves' },
      { name: 'ginger', quantity: 1, unit: 'tbsp' },
      { name: 'sesame seeds', quantity: 2, unit: 'tbsp' }
    ],
    steps: [
      'Coat chicken wings in potato starch',
      'Fry at 340°F for 10 minutes',
      'Remove and drain for 5 minutes',
      'Fry again at 375°F for 5 minutes',
      'Make glaze with gochujang, soy, honey',
      'Toss hot wings in glaze',
      'Garnish with sesame seeds'
    ],
    mealType: 'dinner',
    dietTags: [],
    cuisineTags: ['chinese'],
    timeMinutes: 40
  },
  {
    id: 'stuffed-zucchini',
    title: 'Mediterranean Stuffed Zucchini',
    ingredients: [
      { name: 'zucchini', quantity: 4, unit: 'large' },
      { name: 'ground lamb', quantity: 1, unit: 'lb' },
      { name: 'rice', quantity: 0.5, unit: 'cup' },
      { name: 'onion', quantity: 1 },
      { name: 'tomato', quantity: 2 },
      { name: 'pine nuts', quantity: 0.25, unit: 'cup' },
      { name: 'mint', quantity: 0.25, unit: 'cup' },
      { name: 'feta cheese', quantity: 0.5, unit: 'cup' }
    ],
    steps: [
      'Hollow out zucchini, reserve flesh',
      'Sauté onion until soft',
      'Add lamb and cook until browned',
      'Add rice, diced zucchini flesh, tomatoes',
      'Stir in pine nuts and mint',
      'Stuff zucchini with mixture',
      'Bake covered at 375°F for 45 minutes'
    ],
    mealType: 'dinner',
    dietTags: [],
    cuisineTags: ['mediterranean'],
    timeMinutes: 75
  }
]
