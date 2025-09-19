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

const PORT = process.env.PORT || 5050
app.listen(PORT, () => {
  console.log(`ChefMate API listening on http://localhost:${PORT}`)
})
