import React from 'react'
import type { Recommendation } from '../services/recommend'
import { useAppStore } from '../store/useAppStore'

type Props = {
  rec: Recommendation
  onClose: () => void
  onStartCook?: (rec: Recommendation) => void
}

export default function RecipeDetailsModal({ rec, onClose, onStartCook }: Props) {
  const addToList = useAppStore((s) => s.addToList)
  const like = useAppStore((s) => s.likeRecipe)
  const dislike = useAppStore((s) => s.dislikeRecipe)
  const likedIds = useAppStore((s) => s.likedRecipeIds)
  const dislikedIds = useAppStore((s) => s.dislikedRecipeIds)
  const isLiked = likedIds.includes(rec.recipe.id)
  const isDisliked = dislikedIds.includes(rec.recipe.id)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-t-2xl border border-white/10 bg-surface-light p-4 text-white shadow-xl sm:rounded-2xl sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">{rec.recipe.title}</h3>
            <div className="text-xs opacity-70">
              {Math.round(rec.matchPercent * 100)}% match • {rec.recipe.mealType} • {rec.recipe.timeMinutes ?? 0}m
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => (isLiked ? null : like(rec.recipe.id))}
              className={`rounded-md border px-3 py-1 text-sm ${isLiked ? 'border-accent bg-accent/20' : 'border-white/10 hover:border-white/20'}`}
              title="Like"
            >
              👍 Like
            </button>
            <button
              onClick={() => (isDisliked ? null : dislike(rec.recipe.id))}
              className={`rounded-md border px-3 py-1 text-sm ${isDisliked ? 'border-brand bg-brand/20' : 'border-white/10 hover:border-white/20'}`}
              title="Dislike"
            >
              👎 Dislike
            </button>
            <button onClick={onClose} className="rounded-md border border-white/10 px-3 py-1 text-sm hover:border-white/20">Close</button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h4 className="mb-2 font-medium">Ingredients</h4>
            <ul className="space-y-1 text-sm">
              {rec.recipe.ingredients.map((i, idx) => (
                <li key={idx} className="flex items-center justify-between rounded-md border border-white/10 bg-white/5 px-2 py-1">
                  <span>{i.name}</span>
                </li>
              ))}
            </ul>
            {rec.missing.length > 0 && (
              <div className="mt-3 text-xs opacity-80">Missing: {rec.missing.join(', ')}</div>
            )}
            {rec.missing.length > 0 && (
              <button
                onClick={() => rec.missing.forEach((m) => addToList(m))}
                className="mt-3 w-full rounded-md border border-white/10 px-3 py-2 text-sm hover:border-white/20"
              >
                Add missing to shopping list 🛒
              </button>
            )}
          </div>
          <div>
            <h4 className="mb-2 font-medium">Steps</h4>
            <ol className="list-decimal space-y-2 pl-5 text-sm">
              {rec.recipe.steps.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ol>
            <button
              onClick={() => onStartCook?.(rec)}
              className="mt-4 w-full rounded-md bg-accent px-3 py-2 text-sm font-medium text-black hover:bg-accent/90"
            >
              Start Cook Mode 🍳
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
