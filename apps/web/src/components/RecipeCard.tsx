import React from 'react'
import type { Recommendation } from '../services/recommend'

type Props = {
  rec: Recommendation
  onClick?: (rec: Recommendation) => void
}

export default function RecipeCard({ rec, onClick }: Props) {
  return (
    <button
      onClick={() => onClick?.(rec)}
      className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-left hover:border-white/20"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">{rec.recipe.title}</div>
          <div className="text-xs opacity-70">
            {Math.round(rec.matchPercent * 100)}% match • {rec.recipe.mealType} • {rec.recipe.timeMinutes ?? 0}m
          </div>
        </div>
        <div className="text-xs opacity-70">
          {rec.missing.length ? `${rec.missing.length} missing` : 'All ingredients on hand'}
        </div>
      </div>
    </button>
  )
}
