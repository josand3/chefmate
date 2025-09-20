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

const PORT = process.env.PORT || 5050
app.listen(PORT, () => {
  console.log(`ChefMate API listening on http://localhost:${PORT}`)
})
