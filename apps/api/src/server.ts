import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'chefmate-api' })
})

const PORT = process.env.PORT || 5050
app.listen(PORT, () => {
  console.log(`ChefMate API listening on http://localhost:${PORT}`)
})
