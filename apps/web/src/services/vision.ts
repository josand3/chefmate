export type VisionIngredient = { name: string; confidence?: number }

export async function uploadIngredientImage(file: File): Promise<VisionIngredient[]> {
  const form = new FormData()
  form.append('image', file)

  const res = await fetch('/api/vision/ingredients', {
    method: 'POST',
    body: form,
  })
  if (!res.ok) {
    throw new Error(`Vision API error: ${res.status}`)
  }
  const data = await res.json()
  if (!Array.isArray(data.ingredients)) return []
  return data.ingredients as VisionIngredient[]
}
