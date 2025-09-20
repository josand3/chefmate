import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { OpenAI } from 'openai'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'chefmate-api' })
})

// Image upload handling
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } })

// Initialize OpenAI client
const openaiApiKey = process.env.OPENAI_API_KEY
const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null

app.post('/api/vision/ingredients', upload.single('image'), async (req, res) => {
  try {
    if (!openai) {
      return res.status(500).json({ error: 'OPENAI_API_KEY not configured' })
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded. Use form field name "image".' })
    }

    const b64 = req.file.buffer.toString('base64')

    const prompt = `You are a kitchen vision assistant. The user provides a single image of ingredients on a counter or inside a fridge. Extract a concise list of food ingredient items that are visually present. Keep general names (e.g., "tomato", "onion", "milk"), do not infer brands or quantities. Respond ONLY with strict JSON of the form:\n\n{\n  "ingredients": [\n    { "name": string, "confidence": number }\n  ]\n}\n\nConfidence is 0-1. Include 3-20 items depending on what you see. If uncertain, include lower confidence items.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Return only JSON. No explanations.' },
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: { url: `data:${req.file.mimetype};base64,${b64}` }
            }
          ] as any
        }
      ],
      temperature: 0.2
    })

    const text = response.choices?.[0]?.message?.content || '{}'
    let data: any
    try {
      data = JSON.parse(text)
    } catch {
      data = { ingredients: [] }
    }
    if (!Array.isArray(data.ingredients)) data.ingredients = []

    // Normalize names
    data.ingredients = data.ingredients
      .filter((it: any) => typeof it?.name === 'string')
      .map((it: any) => ({
        name: String(it.name).toLowerCase().trim(),
        confidence: typeof it.confidence === 'number' ? it.confidence : undefined
      }))

    res.json({ ingredients: data.ingredients })
  } catch (err: any) {
    console.error('Vision error', err)
    res.status(500).json({ error: 'Vision processing failed' })
  }
})

app.get('/api/recipes', async (req, res) => {
  try {
    const fs = await import('fs/promises')
    const path = await import('path')
    const recipesPath = path.join(__dirname, 'data', 'recipes.json')
    const recipesData = await fs.readFile(recipesPath, 'utf-8')
    const recipes = JSON.parse(recipesData)
    
    res.json({ recipes })
  } catch (err: any) {
    console.error('Recipe fetch error', err)
    res.status(500).json({ error: 'Failed to fetch recipes' })
  }
})

app.post('/api/recipes/recommend', async (req, res) => {
  try {
    const {
      ingredients = [],
      mealType,
      dietTags = [],
      cuisines = [],
      experience = '',
      likedRecipeIds = [],
      dislikedRecipeIds = [],
      behaviorData = {}
    } = req.body

    res.json({
      success: true,
      message: 'Enhanced recommendation endpoint ready',
      receivedData: {
        ingredientCount: ingredients.length,
        mealType,
        dietTagCount: dietTags.length,
        cuisineCount: cuisines.length,
        experience,
        likedCount: likedRecipeIds.length,
        dislikedCount: dislikedRecipeIds.length
      }
    })
  } catch (err: any) {
    console.error('Recommendation error', err)
    res.status(500).json({ error: 'Recipe recommendation failed' })
  }
})

app.post('/api/user/behavior', async (req, res) => {
  try {
    const {
      action,
      recipeId,
      ingredients = [],
      duration,
      timestamp = Date.now()
    } = req.body

    if (!action || !recipeId) {
      return res.status(400).json({ error: 'Action and recipeId are required' })
    }

    console.log('Behavior tracked:', { action, recipeId, timestamp })

    res.json({
      success: true,
      message: 'Behavior tracked successfully',
      data: { action, recipeId, timestamp }
    })
  } catch (err: any) {
    console.error('Behavior tracking error', err)
    res.status(500).json({ error: 'Behavior tracking failed' })
  }
})

app.get('/api/ingredients/substitutes', async (req, res) => {
  try {
    const { ingredient } = req.query

    if (!ingredient || typeof ingredient !== 'string') {
      return res.status(400).json({ error: 'Ingredient parameter is required' })
    }

    const substitutes: Record<string, string[]> = {
      'ground beef': ['ground turkey', 'ground chicken', 'lentils', 'mushrooms'],
      'chicken breast': ['chicken thigh', 'turkey breast', 'tofu', 'tempeh'],
      'butter': ['margarine', 'olive oil', 'coconut oil', 'applesauce'],
      'milk': ['almond milk', 'soy milk', 'oat milk', 'coconut milk'],
      'egg': ['flax egg', 'chia egg', 'applesauce', 'banana'],
      'flour': ['almond flour', 'coconut flour', 'oat flour', 'rice flour'],
      'sugar': ['honey', 'maple syrup', 'stevia', 'coconut sugar'],
      'soy sauce': ['tamari', 'coconut aminos', 'worcestershire sauce'],
      'heavy cream': ['coconut cream', 'cashew cream', 'greek yogurt'],
      'parmesan': ['nutritional yeast', 'pecorino romano', 'asiago']
    }

    const ingredientLower = ingredient.toLowerCase().trim()
    const suggestions = substitutes[ingredientLower] || []

    res.json({
      ingredient: ingredientLower,
      substitutes: suggestions,
      count: suggestions.length
    })
  } catch (err: any) {
    console.error('Substitution error', err)
    res.status(500).json({ error: 'Substitution lookup failed' })
  }
})

app.get('/api/shopping/stores', async (req, res) => {
  try {
    const { zipCode, ingredients } = req.query

    if (!zipCode || typeof zipCode !== 'string') {
      return res.status(400).json({ error: 'zipCode parameter is required' })
    }

    const mockStores = [
      {
        name: 'Whole Foods Market',
        address: '123 Main St',
        distance: '0.8 miles',
        hasIngredients: Array.isArray(ingredients) ? ingredients.slice(0, 3) : [],
        estimatedCost: '$25-35'
      },
      {
        name: 'Safeway',
        address: '456 Oak Ave',
        distance: '1.2 miles',
        hasIngredients: Array.isArray(ingredients) ? ingredients.slice(1, 4) : [],
        estimatedCost: '$20-30'
      },
      {
        name: 'Trader Joe\'s',
        address: '789 Pine St',
        distance: '1.5 miles',
        hasIngredients: Array.isArray(ingredients) ? ingredients.slice(0, 2) : [],
        estimatedCost: '$18-25'
      }
    ]

    res.json({
      zipCode,
      stores: mockStores,
      searchRadius: '5 miles'
    })
  } catch (err: any) {
    console.error('Store lookup error', err)
    res.status(500).json({ error: 'Store lookup failed' })
  }
})

app.post('/api/recipes/generate', async (req, res) => {
  try {
    if (!openai) {
      return res.status(500).json({ error: 'OPENAI_API_KEY not configured' })
    }

    const {
      ingredients = [],
      dietTags = [],
      cuisines = [],
      experience = 'beginner',
      timeConstraints = 30,
      mealType = 'dinner'
    } = req.body

    if (!ingredients.length) {
      return res.status(400).json({ error: 'At least one ingredient is required' })
    }

    const experienceMap = {
      'beginner': 'simple techniques like boiling, sautéing, and baking',
      'prep cook': 'intermediate techniques like braising, roasting, and knife skills',
      'line cook': 'advanced techniques like reduction sauces, proper seasoning, and timing',
      'sous chef': 'complex techniques like emulsification, advanced knife work, and flavor balancing',
      'executive chef': 'professional techniques like molecular gastronomy, advanced plating, and creative fusion'
    }

    const dietaryConstraints = dietTags.length > 0 ? 
      `Must be ${dietTags.join(', ')} compliant. ` : ''

    const cuisinePreference = cuisines.length > 0 ? 
      `Prefer ${cuisines.join(' or ')} cuisine style. ` : ''

    const prompt = `You are a professional chef AI. Create a single, complete recipe using the following requirements:

INGREDIENTS AVAILABLE: ${ingredients.join(', ')}
DIETARY REQUIREMENTS: ${dietaryConstraints}
CUISINE PREFERENCE: ${cuisinePreference}
EXPERIENCE LEVEL: ${experience} (use ${experienceMap[experience as keyof typeof experienceMap] || experienceMap.beginner})
TIME LIMIT: ${timeConstraints} minutes maximum
MEAL TYPE: ${mealType}

VALIDATION REQUIREMENTS:
- Recipe must be nutritionally balanced with protein, vegetables, and appropriate macronutrients
- Cooking techniques must match the experience level specified
- Total time (prep + cook) must not exceed ${timeConstraints} minutes
- Ingredient ratios must be realistic and proportional
- All steps must be technically feasible and clearly explained
- Include proper seasoning and flavor balance

Respond ONLY with strict JSON in this exact format:
{
  "id": "generated-[timestamp]",
  "title": "Recipe Name",
  "ingredients": [
    { "name": "ingredient name", "quantity": number, "unit": "unit" }
  ],
  "steps": [
    "Step 1 instruction",
    "Step 2 instruction"
  ],
  "mealType": "${mealType}",
  "dietTags": ${JSON.stringify(dietTags)},
  "cuisineTags": ${JSON.stringify(cuisines.length > 0 ? cuisines : ['fusion'])},
  "timeMinutes": number,
  "servings": number,
  "difficulty": "${experience}",
  "nutrition": {
    "calories": number,
    "protein": "Xg",
    "carbs": "Xg", 
    "fat": "Xg"
  }
}`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a professional chef AI. Return only valid JSON. No explanations or additional text.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    const text = response.choices?.[0]?.message?.content || '{}'
    let recipe: any

    try {
      recipe = JSON.parse(text)
    } catch (parseError) {
      console.error('Recipe generation JSON parse error:', parseError)
      return res.status(500).json({ error: 'Failed to parse generated recipe' })
    }

    const validationErrors = validateGeneratedRecipe(recipe, ingredients, timeConstraints)
    if (validationErrors.length > 0) {
      console.error('Recipe validation failed:', validationErrors)
      return res.status(400).json({ 
        error: 'Generated recipe failed validation',
        details: validationErrors
      })
    }

    recipe.id = `generated-${Date.now()}`
    recipe.generated = true
    recipe.generatedAt = new Date().toISOString()
    recipe.sourceIngredients = ingredients

    res.json({
      success: true,
      recipe: recipe,
      message: 'Recipe generated successfully'
    })

  } catch (err: any) {
    console.error('Recipe generation error', err)
    res.status(500).json({ error: 'Recipe generation failed' })
  }
})

function validateGeneratedRecipe(recipe: any, availableIngredients: string[], timeLimit: number): string[] {
  const errors: string[] = []

  if (!recipe.title || typeof recipe.title !== 'string') {
    errors.push('Recipe must have a valid title')
  }

  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
    errors.push('Recipe must have ingredients array')
  }

  if (!Array.isArray(recipe.steps) || recipe.steps.length === 0) {
    errors.push('Recipe must have cooking steps')
  }

  if (typeof recipe.timeMinutes === 'number' && recipe.timeMinutes > timeLimit) {
    errors.push(`Recipe time (${recipe.timeMinutes}min) exceeds limit (${timeLimit}min)`)
  }

  if (Array.isArray(recipe.ingredients)) {
    const usedIngredients = recipe.ingredients.map((ing: any) => 
      ing.name?.toLowerCase().trim()
    ).filter(Boolean)
    
    const availableSet = new Set(availableIngredients.map(ing => ing.toLowerCase().trim()))
    const usedFromAvailable = usedIngredients.filter((ing: string) => 
      availableSet.has(ing) || 
      Array.from(availableSet).some(avail => avail.includes(ing) || ing.includes(avail))
    )

    if (usedFromAvailable.length < Math.min(2, availableIngredients.length * 0.5)) {
      errors.push('Recipe should use more of the available ingredients')
    }
  }

  if (Array.isArray(recipe.ingredients)) {
    recipe.ingredients.forEach((ing: any, index: number) => {
      if (!ing.name || typeof ing.name !== 'string') {
        errors.push(`Ingredient ${index + 1} must have a name`)
      }
      if (ing.quantity && (typeof ing.quantity !== 'number' || ing.quantity <= 0)) {
        errors.push(`Ingredient ${index + 1} quantity must be a positive number`)
      }
    })
  }

  if (Array.isArray(recipe.steps)) {
    recipe.steps.forEach((step: any, index: number) => {
      if (!step || typeof step !== 'string' || step.trim().length < 10) {
        errors.push(`Step ${index + 1} must be a detailed instruction`)
      }
    })
  }

  return errors
}

const PORT = process.env.PORT || 5050
app.listen(PORT, () => {
  console.log(`ChefMate API listening on http://localhost:${PORT}`)
})
