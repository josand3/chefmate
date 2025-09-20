import { Heart, Clock, Users, ShoppingCart } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import type { Recommendation } from '../services/recommend'

type Props = {
  rec: Recommendation
  onClick: (rec: Recommendation) => void
}

export default function RecipeCard({ rec, onClick }: Props) {
  const likedRecipeIds = useAppStore((s) => s.likedRecipeIds)
  const dislikedRecipeIds = useAppStore((s) => s.dislikedRecipeIds)
  const likeRecipe = useAppStore((s) => s.likeRecipe)
  const dislikeRecipe = useAppStore((s) => s.dislikeRecipe)
  const addToList = useAppStore((s) => s.addToList)

  const isLiked = likedRecipeIds.includes(rec.recipe.id)
  const isDisliked = dislikedRecipeIds.includes(rec.recipe.id)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isLiked) return
    likeRecipe(rec.recipe.id)
  }

  const handleDislike = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isDisliked) return
    dislikeRecipe(rec.recipe.id)
  }

  const handleAddMissing = (e: React.MouseEvent) => {
    e.stopPropagation()
    rec.missing.forEach(ingredient => addToList(ingredient))
  }

  return (
    <div
      onClick={() => onClick(rec)}
      className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
    >
      <div className="mb-2 flex items-start justify-between">
        <h3 className="font-medium">{rec.recipe.title}</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={handleLike}
            className={`rounded-full p-1 transition-colors ${
              isLiked ? 'bg-red-500 text-white' : 'hover:bg-white/10'
            }`}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleDislike}
            className={`rounded-full p-1 transition-colors ${
              isDisliked ? 'bg-gray-500 text-white' : 'hover:bg-white/10'
            }`}
          >
            👎
          </button>
        </div>
      </div>

      <div className="mb-2 flex items-center gap-4 text-sm opacity-70">
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{rec.recipe.timeMinutes || 30}m</span>
        </div>
        <div className="flex items-center gap-1">
          <Users size={14} />
          <span>{Math.round(rec.score * 100)}% match</span>
        </div>
      </div>

      {rec.reasons.length > 0 && (
        <div className="mb-2 text-xs text-brand">
          {rec.reasons[0]}
        </div>
      )}

      {rec.missing.length > 0 && (
        <div className="mb-2 flex items-center justify-between">
          <div className="text-xs opacity-60">
            Missing: {rec.missing.slice(0, 3).join(', ')}
            {rec.missing.length > 3 && ` +${rec.missing.length - 3} more`}
          </div>
          <button
            onClick={handleAddMissing}
            className="flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-xs hover:border-white/20"
            title="Add missing ingredients to shopping list"
          >
            <ShoppingCart size={12} />
            Add
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-1">
        {rec.recipe.cuisineTags?.slice(0, 2).map((tag) => (
          <span key={tag} className="rounded-full bg-brand/20 px-2 py-0.5 text-xs">
            {tag}
          </span>
        ))}
        {rec.recipe.dietTags?.slice(0, 2).map((tag) => (
          <span key={tag} className="rounded-full bg-accent/20 px-2 py-0.5 text-xs">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
